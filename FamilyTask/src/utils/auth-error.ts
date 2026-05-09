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

export function getRegisterError(message?: string) {
  if (!message) {
    return "Something went wrong";
  }

  if (message.includes("User already registered")) {
    return "This email is already registered";
  }

  if (message.includes("Password should be at least")) {
    return "Password is too weak";
  }

  if (message.includes("Unable to validate email address")) {
    return "Invalid email address";
  }

  if (message.includes("Signup is disabled")) {
    return "Registration is currently disabled";
  }

  if (message.includes("For security purposes")) {
    return "Too many attempts. Try again later";
  }

  return "Something went wrong";
}