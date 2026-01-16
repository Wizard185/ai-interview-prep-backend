import { BRANCH_SKILL_ALIASES } from "../constants/branchSkillAliases.js";
import { matchSkill } from "../utils/skillMatcher.js";

const normalize = (text = "") =>
  text.toLowerCase().replace(/[-_/]/g, " ").replace(/\s+/g, " ").trim();

/**
 * Extract in-demand skills strictly from JD
 */
export const extractSkillsFromJD = (jdText = "") => {
  const text = normalize(jdText);
  const requiredSkills = [];

  for (const skill of Object.keys(BRANCH_SKILL_ALIASES)) {
    const aliases = BRANCH_SKILL_ALIASES[skill];

    if (matchSkill(text, aliases)) {
      requiredSkills.push(skill);
    }
  }

  return requiredSkills;
};
export const extractExperienceFromJD = (jdText = "") => {
  const text = jdText.toLowerCase();

  if (text.includes("fresher") || text.includes("entry level")) {
    return { min: 0, max: 1, level: "Junior" };
  }

  const range = text.match(/(\d+)\s*[-to]{1,3}\s*(\d+)\s*years?/);
  if (range) {
    return {
      min: Number(range[1]),
      max: Number(range[2]),
      level: "Mid",
    };
  }

  const plus = text.match(/(\d+)\+?\s*years?/);
  if (plus) {
    const min = Number(plus[1]);
    return {
      min,
      max: null,
      level: min >= 5 ? "Senior" : "Mid",
    };
  }

  return { min: null, max: null, level: "Unspecified" };
};
