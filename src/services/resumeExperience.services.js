export const estimateExperienceFromResume = (resumeText = "") => {
    const matches = resumeText.match(/(\d+)\+?\s+years?/gi);
  
    if (!matches) {
      return { years: 0, level: "Junior" };
    }
  
    const maxYears = Math.max(...matches.map(m => parseInt(m)));
  
    if (maxYears >= 5) return { years: maxYears, level: "Senior" };
    if (maxYears >= 2) return { years: maxYears, level: "Mid" };
    return { years: maxYears, level: "Junior" };
  };
  