export function getErrorPasswordMessage(error: any): string {
    if (!error) return "Unknown error";

    const msg = error?.message || "";

    if (msg.includes("different from the old password")) {
        return "New password must be different from current password";
    }

    if (msg.includes("Invalid login credentials")) {
        return "Invalid session. Please log in again";
    }

    if (msg.includes("Password should be at least")) {
        return "Password is too weak (min 6 characters)";
    }

    // fallback
    return msg || "Something went wrong";
}