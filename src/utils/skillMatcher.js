/**
 * Match skill aliases safely (handles symbols like C++)
 */
export const matchSkill = (text, aliases) => {
    return aliases.some(alias => {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  
      // Custom boundary:
      // (^|[^a-zA-Z0-9])  → left boundary
      // ($|[^a-zA-Z0-9])  → right boundary
      const regex = new RegExp(
        `(^|[^a-zA-Z0-9])${escaped}($|[^a-zA-Z0-9])`,
        "i"
      );
  
      return regex.test(text);
    });
  };
  