/**
 * Generate ATS suggestions strictly from JD gaps
 */
export const generateSuggestions = ({
    skillResult,
    coreSubjectResult,
    jdExperience,
    candidateExperience,
  }) => {
    const suggestions = [];
  
    /* =======================
       SKILL GAPS
    ======================= */
    if (skillResult && skillResult.missing.length > 0) {
      skillResult.missing.forEach((skill) => {
        suggestions.push({
          type: "skill",
          message: `Add hands-on experience or projects involving ${skill}, as it is required in the job description.`,
        });
      });
    }
  
    /* =======================
       CORE SUBJECT GAPS
    ======================= */
    if (
      coreSubjectResult &&
      coreSubjectResult.missing.length > 0
    ) {
      coreSubjectResult.missing.forEach((subject) => {
        suggestions.push({
          type: "core-subject",
          message: `Highlight coursework or academic knowledge in ${subject}, which is expected for this role.`,
        });
      });
    }
  
    /* =======================
       EXPERIENCE GAP
    ======================= */
    if (
      jdExperience.min !== null &&
      candidateExperience.years < jdExperience.min
    ) {
      suggestions.push({
        type: "experience",
        message: `The role expects at least ${jdExperience.min} years of experience. Emphasize internships, academic projects, or practical training to bridge this gap.`,
      });
    }
  
    /* =======================
       NO GAPS (STRONG MATCH)
    ======================= */
    if (suggestions.length === 0) {
      suggestions.push({
        type: "positive",
        message:
          "Your resume aligns well with the job description. Focus on quantifying achievements and impact.",
      });
    }
  
    return suggestions;
  };
  