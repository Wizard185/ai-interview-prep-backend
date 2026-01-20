/**
 * Clean and structure Gemini AI output into ATS-friendly suggestions
 */
export const parseAISuggestions = (lines = []) => {
    const result = {
      summary: [],
      reframeSuggestions: [],
      projectIdeas: [],
    };
  
    let currentSection = null;
  
    for (let raw of lines) {
      if (!raw) continue;
  
      let line = raw
        .replace(/[*#>`]/g, "")          // remove **, ##, >
        .replace(/\\/g, "")              // remove \
        .replace(/\s+/g, " ")            // normalize spaces
        .trim();
  
      if (!line || line.length < 8) continue;
  
      const lower = line.toLowerCase();
  
      /* -------- Section detection -------- */
      if (lower.includes("relevance") || lower.includes("alignment")) {
        currentSection = "summary";
        continue;
      }
  
      if (lower.includes("reframe") || lower.includes("existing project")) {
        currentSection = "reframeSuggestions";
        continue;
      }
  
      if (
        lower.includes("project idea") ||
        lower.includes("suggested project") ||
        lower.includes("vfd") ||
        lower.includes("simulation")
      ) {
        currentSection = "projectIdeas";
      }
  
      /* -------- Skip noise lines -------- */
      if (
        lower.startsWith("focus:") ||
        lower.startsWith("jd goal:") ||
        lower.startsWith("technical interest:")
      ) {
        continue;
      }
  
      /* -------- Push cleaned line -------- */
      if (currentSection) {
        // Avoid duplicates
        if (!result[currentSection].includes(line)) {
          result[currentSection].push(line);
        }
      }
    }
  
    return result;
  };
  