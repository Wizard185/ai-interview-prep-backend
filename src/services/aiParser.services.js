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
      .replace(/[*#>`]/g, "")     // remove markdown symbols
      .replace(/\\/g, "")         // remove backslashes
      .replace(/\s+/g, " ")       // normalize spaces
      .trim();

    if (!line || line.length < 8) continue;

    const lower = line.toLowerCase();

    /* =====================================================
       1️⃣ SKIP NUMBERED SECTION HEADINGS (VERY IMPORTANT)
       Examples:
       - "1. Profile Summary"
       - "2. How to Reframe Existing Projects"
       - "3. Suggested New Projects"
    ===================================================== */
    if (/^\d+\.\s*(profile|summary|reframe|suggested)/i.test(lower)) {
      continue;
    }

    /* =====================================================
       2️⃣ SECTION DETECTION (ORDER MATTERS)
    ===================================================== */

    // ---- SUMMARY ----
    if (lower.includes("relevance") || lower.includes("alignment")) {
      currentSection = "summary";
      continue;
    }

    // ---- REFRAME EXISTING PROJECTS ----
    if (
      lower.includes("reframe") ||
      lower.includes("existing project") ||
      lower.includes("highlight the backend") ||
      lower.includes("emphasize")
    ) {
      currentSection = "reframeSuggestions";
      continue;
    }

    // ---- PROJECT IDEAS ----
    if (
      lower.includes("suggested new project") ||
      lower.includes("suggested new projects") ||
      lower.includes("project idea") ||
      lower.includes("project ideas") ||
      lower.startsWith("project ") ||       // Project 1:, Project 2:
      lower.startsWith("project:") ||
      lower.includes("containerized") ||
      lower.includes("real-time") ||
      lower.includes("microservice") ||
      lower.includes("system design")
    ) {
      currentSection = "projectIdeas";
      continue;
    }

    /* =====================================================
       3️⃣ SKIP GENERIC NOISE LINES
    ===================================================== */
    if (
      lower.startsWith("focus:") ||
      lower.startsWith("jd goal:") ||
      lower.startsWith("technical interest:")
    ) {
      continue;
    }

    /* =====================================================
       4️⃣ PUSH CONTENT INTO CURRENT SECTION
    ===================================================== */
    if (currentSection) {
      if (!result[currentSection].includes(line)) {
        result[currentSection].push(line);
      }
    }
  }

  return result;
};
