export function getAuthError(message?: string) {
  if (!message) {
    return "Something went wrong";
  }
  if (message.includes("Invalid login")) {
    return "Invalid email or password";
  }
  if (message.includes("Email not confirmed")) {
    return "Please confirm your email address";
  }
  if (message.includes("Too many requests")) {
    return "Too many attempts. Try again later";
  }
  return "Something went wrong";
}