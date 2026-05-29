export const getRoleStyle = (role: string) => {
    switch (role) {
        case "OWNER":
            return "bg-gold-bg text-gold";
        case "ADMIN":
            return "bg-primary-light text-primary-dark";
        default:
            return "bg-gray-100 text-muted";
    }
};