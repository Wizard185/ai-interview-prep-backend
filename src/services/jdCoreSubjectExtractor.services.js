import { CORE_SUBJECT_ALIASES } from "../constants/coreSubjectsAliases.js";
import { matchSkill } from "../utils/skillMatcher.js";

const normalize = (text = "") =>
  text.toLowerCase().replace(/[-_/]/g, " ").replace(/\s+/g, " ");

export const extractCoreSubjectsFromJD = (jdText = "") => {
  const text = normalize(jdText);
  const required = [];

  for (const subject of Object.keys(CORE_SUBJECT_ALIASES)) {
    const aliases = CORE_SUBJECT_ALIASES[subject];

    if (matchSkill(text, aliases)) {
      required.push(subject);
    }
  }

  return required;
};
