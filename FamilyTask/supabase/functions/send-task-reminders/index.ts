// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.105.1";

type TaskReminderRow = {
  id: string;
  task_id: string;
  user_id: string;
  reminder_at: string;
  tasks: {
    title: string;
    deadline: string | null;
  } | null;
};

type PushTokenRow = {
  token: string;
  user_id: string;
};

type ExpoTicket = {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: {
    error?: string;
  };
};

type ExpoResponse = {
  data?: ExpoTicket[];
  errors?: Array<{ message?: string }>;
};

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const BATCH_SIZE = 100;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function getRequiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

function isAuthorized(request: Request) {
  const cronSecret = Deno.env.get("TASK_REMINDER_CRON_SECRET");
  if (!cronSecret) return true;

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

function isExpoPushToken(token: string) {
  return (
    token.startsWith("ExponentPushToken[") ||
    token.startsWith("ExpoPushToken[")
  );
}

Deno.serve(async (request) => {
  if (!isAuthorized(request)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    getRequiredEnv("SUPABASE_URL"),
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY")
  );

  const { data: reminders, error: remindersError } = await supabase
    .from("task_reminders")
    .select(
      `
      id,
      task_id,
      user_id,
      reminder_at,
      tasks (
        title,
        deadline
      )
    `
    )
    .eq("status", "pending")
    .lte("reminder_at", new Date().toISOString())
    .order("reminder_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (remindersError) {
    return jsonResponse({ error: remindersError.message }, 500);
  }

  const dueReminders = (reminders ?? []) as unknown as TaskReminderRow[];
  if (dueReminders.length === 0) {
    return jsonResponse({ sent: 0, failed: 0, skipped: 0 });
  }

  const reminderIds = dueReminders.map((reminder) => reminder.id);
  const { error: claimError } = await supabase
    .from("task_reminders")
    .update({ status: "processing" })
    .in("id", reminderIds)
    .eq("status", "pending");

  if (claimError) {
    return jsonResponse({ error: claimError.message }, 500);
  }

  const userIds = Array.from(
    new Set(dueReminders.map((reminder) => reminder.user_id))
  );

  const { data: tokens, error: tokensError } = await supabase
    .from("push_tokens")
    .select("token, user_id")
    .in("user_id", userIds)
    .eq("enabled", true);

  if (tokensError) {
    await supabase
      .from("task_reminders")
      .update({
        status: "failed",
        failed_reason: tokensError.message,
      })
      .in("id", reminderIds);

    return jsonResponse({ error: tokensError.message }, 500);
  }

  const tokensByUserId = new Map<string, PushTokenRow[]>();
  for (const tokenRow of (tokens ?? []) as PushTokenRow[]) {
    if (!isExpoPushToken(tokenRow.token)) continue;

    const userTokens = tokensByUserId.get(tokenRow.user_id) ?? [];
    userTokens.push(tokenRow);
    tokensByUserId.set(tokenRow.user_id, userTokens);
  }

  const messages = dueReminders.flatMap((reminder) => {
    const userTokens = tokensByUserId.get(reminder.user_id) ?? [];

    return userTokens.map((tokenRow) => ({
      reminderId: reminder.id,
      to: tokenRow.token,
      sound: "default",
      title: "Нагадування про задачу",
      body: `Скоро дедлайн: ${reminder.tasks?.title ?? "задача"}`,
      data: {
        type: "task-reminder",
        taskId: reminder.task_id,
        reminderId: reminder.id,
      },
    }));
  });

  if (messages.length === 0) {
    await supabase
      .from("task_reminders")
      .update({
        status: "failed",
        failed_reason: "No enabled Expo push tokens",
      })
      .in("id", reminderIds);

    return jsonResponse({
      sent: 0,
      failed: dueReminders.length,
      skipped: dueReminders.length,
    });
  }

  const expoMessages = messages.map(({ reminderId: _reminderId, ...message }) =>
    message
  );

  const expoResponse = await fetch(EXPO_PUSH_URL, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(expoMessages),
  });

  const expoJson = (await expoResponse.json()) as ExpoResponse;

  if (!expoResponse.ok || expoJson.errors?.length) {
    await supabase
      .from("task_reminders")
      .update({
        status: "failed",
        failed_reason:
          expoJson.errors?.[0]?.message ?? "Expo push request failed",
      })
      .in("id", reminderIds);

    return jsonResponse(
      {
        error: expoJson.errors?.[0]?.message ?? "Expo push request failed",
      },
      502
    );
  }

  const tickets = expoJson.data ?? [];
  const failedTokens = messages
    .map((message, index) => ({
      token: message.to,
      ticket: tickets[index],
    }))
    .filter(({ ticket }) => ticket?.details?.error === "DeviceNotRegistered")
    .map(({ token }) => token);

  if (failedTokens.length > 0) {
    await supabase
      .from("push_tokens")
      .update({ enabled: false })
      .in("token", failedTokens);
  }

  const ticketsByReminderId = new Map<string, ExpoTicket[]>();
  messages.forEach((message, index) => {
    const reminderTickets = ticketsByReminderId.get(message.reminderId) ?? [];
    const ticket = tickets[index];

    if (ticket) {
      reminderTickets.push(ticket);
    }

    ticketsByReminderId.set(message.reminderId, reminderTickets);
  });

  let sentCount = 0;
  let failedCount = 0;

  await Promise.all(
    dueReminders.map((reminder) => {
      const reminderTickets = ticketsByReminderId.get(reminder.id) ?? [];
      const firstOkTicket = reminderTickets.find(
        (ticket) => ticket.status === "ok"
      );
      const firstErrorTicket = reminderTickets.find(
        (ticket) => ticket.status === "error"
      );
      const isSent = !!firstOkTicket;

      if (isSent) {
        sentCount += 1;
      } else {
        failedCount += 1;
      }

      return supabase
        .from("task_reminders")
        .update({
          status: isSent ? "sent" : "failed",
          sent_at: isSent ? new Date().toISOString() : null,
          expo_ticket_id: firstOkTicket?.id ?? null,
          failed_reason: isSent
            ? null
            : firstErrorTicket?.message ?? "All Expo tickets failed",
        })
        .eq("id", reminder.id);
    })
  );

  return jsonResponse({
    sent: sentCount,
    failed: failedCount,
    disabledTokens: failedTokens.length,
  });
});
