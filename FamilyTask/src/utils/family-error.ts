export function getFamilyError(message?: string) {
    if (!message) return "Something went wrong";
  
    if (message.includes("violates row-level security")) {
      return "You don't have permission to do this action";
    }
  
    if (message.includes("duplicate")) {
      return "You are already in a family";
    }
  
    if (message.includes("null value")) {
      return "Please fill all required fields";
    }
  
    if (message.includes("foreign key")) {
      return "Family or user not found";
    }
  
    return "Something went wrong";
  }