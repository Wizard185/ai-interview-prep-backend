import { SKILL_TAXONOMY } from "../constants/skillTaxonomy.js";
import { SKILL_ALIASES } from "../constants/skillAliases.js";
import { matchSkill } from "../utils/skillMatcher.js";

/* Normalize text */
const normalize = (text = "") =>
  text.toLowerCase().replace(/\s+/g, " ");

export const extractSkillsFromJD = (jdText) => {
  const text = normalize(jdText);
  const extracted = {};

  for (const [category, skills] of Object.entries(SKILL_TAXONOMY)) {
    const required = [];

    for (const skill of skills) {
      const aliases = SKILL_ALIASES[skill] || [skill];

      if (matchSkill(text, aliases)) {
        required.push(skill);
      }
    }

    if (required.length > 0) {
      extracted[category] = required;
    }
  }

  return extracted;
};


/* Extract skills from JD */

/* Extract experience requirement from JD */
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
