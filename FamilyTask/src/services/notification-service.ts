import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

type TaskReminderParams = {
  taskId: string;
  title: string;
  deadline: string | null;
  reminderMinutesBefore?: number;
  requestPermission?: boolean;
};

const DEFAULT_REMINDER_MINUTES_BEFORE = 30;

function getExpoProjectId() {
  return (
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId ??
    process.env.EXPO_PUBLIC_EAS_PROJECT_ID ??
    null
  );
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function setupNotifications({ requestPermission = true } = {}) {
  if (Platform.OS === "web") return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("task-reminders", {
      name: "Task reminders",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const permissions = await Notifications.getPermissionsAsync();

  if (permissions.granted) {
    return true;
  }

  if (!requestPermission) {
    return false;
  }

  const requestedPermissions = await Notifications.requestPermissionsAsync();
  return requestedPermissions.granted;
}

export async function getExpoPushToken() {
  if (Platform.OS !== "ios" && Platform.OS !== "android") return null;

  const hasPermission = await setupNotifications();
  if (!hasPermission) return null;

  const projectId = getExpoProjectId();
  if (!projectId) return null;

  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data;
}

export async function scheduleTaskReminder({
  taskId,
  title,
  deadline,
  reminderMinutesBefore = DEFAULT_REMINDER_MINUTES_BEFORE,
  requestPermission = true,
}: TaskReminderParams) {
  if (Platform.OS === "web" || !deadline) return null;

  await cancelTaskReminder(taskId);

  const hasPermission = await setupNotifications({ requestPermission });
  if (!hasPermission) return null;

  const reminderDate = new Date(
    new Date(deadline).getTime() - reminderMinutesBefore * 60 * 1000
  );

  if (reminderDate.getTime() <= Date.now()) {
    return null;
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Нагадування про задачу",
      body: `Скоро дедлайн: ${title}`,
      data: {
        taskId,
        type: "task-reminder",
      },
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
      channelId: "task-reminders",
    },
  });
}

export async function cancelTaskReminder(taskId: string) {
  if (Platform.OS === "web") return;

  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  await Promise.all(
    scheduledNotifications
      .filter((notification) => notification.content.data?.taskId === taskId)
      .map((notification) =>
        Notifications.cancelScheduledNotificationAsync(notification.identifier)
      )
  );
}

export async function cancelAllTaskReminders() {
  if (Platform.OS === "web") return;

  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  await Promise.all(
    scheduledNotifications
      .filter(
        (notification) => notification.content.data?.type === "task-reminder"
      )
      .map((notification) =>
        Notifications.cancelScheduledNotificationAsync(notification.identifier)
      )
  );
}
