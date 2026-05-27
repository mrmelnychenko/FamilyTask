export function getLevel(xp: number) {
    const baseXP = 100;
    const growth = 1.25;
  
    let level = 1;
    let required = baseXP;
  
    let remainingXP = xp;
  
    while (remainingXP >= required) {
      remainingXP -= required;
      level += 1;
      required = Math.floor(baseXP * Math.pow(growth, level - 1));
    }
  
    return {
      level,
      currentXP: remainingXP,
      nextLevelXP: required,
    };
  }