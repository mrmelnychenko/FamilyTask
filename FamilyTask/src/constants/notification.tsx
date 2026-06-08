import { DefaultNotification, FamilyCreatedNotification, FamilyMemberJoinedNotification, FamilyWelcomeNotification, RoleChangedNotification, TaskAssignedNotification, TaskCompletedForCreatorNotification, TaskCompletedNotification } from "../components/ui/notification/notifications";

type Props = {
    notification: any;
};

export function NotificationItem({ notification }: Props) {
    switch (notification.type) {
        case "TASK_ASSIGNED":
            return <TaskAssignedNotification n={notification} />;

        case "TASK_COMPLETED":
            return <TaskCompletedNotification n={notification} />;

        case "TASK_COMPLETED_FOR_CREATOR":
            return <TaskCompletedForCreatorNotification n={notification} />;

        case "FAMILY_MEMBER_JOINED":
            return <FamilyMemberJoinedNotification n={notification} />;

        case "FAMILY_WELCOME":
            return <FamilyWelcomeNotification n={notification} />;

        case "ROLE_CHANGED":
            return <RoleChangedNotification n={notification} />;

        case "FAMILY_CREATED":
            return <FamilyCreatedNotification n={notification} />;

        default:
            return <DefaultNotification n={notification} />;
    }
}
