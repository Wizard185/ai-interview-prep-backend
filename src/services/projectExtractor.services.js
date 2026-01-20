/**
 * Extract project section from resume text
 * Simple heuristic-based extraction (works well in practice)
 */
export const extractProjectsFromResume = (resumeText = "") => {
    const lower = resumeText.toLowerCase();
  
    const projectKeywords = [
      "project",
      "projects",
      "academic project",
      "mini project",
      "capstone",
    ];
  
    let startIndex = -1;
  
    for (const keyword of projectKeywords) {
      const idx = lower.indexOf(keyword);
      if (idx !== -1) {
        startIndex = idx;
        break;
      }
    }
  
    if (startIndex === -1) {
      return null;
    }
  
    // Take a reasonable chunk after "Projects"
    return resumeText.substring(startIndex, startIndex + 1500);
  };
  