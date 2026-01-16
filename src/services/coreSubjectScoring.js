import { CORE_SUBJECT_ALIASES } from "../constants/coreSubjectsAliases.js";
import { matchSkill } from "../utils/skillMatcher.js";
import { APIError } from "../utils/APIError.js";

export const scoreCoreSubjects = (resumeText, jdCoreSubjects) => {
  if (!jdCoreSubjects || jdCoreSubjects.length === 0) {
    return null; // JD did not require core subjects
  }

  const matched = [];
  const missing = [];

  for (const subject of jdCoreSubjects) {
    const aliases = CORE_SUBJECT_ALIASES[subject];

    if (matchSkill(resumeText, aliases)) {
      matched.push(subject);
    } else {
      missing.push(subject);
    }
  }

  const score = Math.round(
    (matched.length / jdCoreSubjects.length) * 100
  );

  return {
    required: jdCoreSubjects,
    matched,
    missing,
    score,
  };
};
