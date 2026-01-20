import { APIError } from "../utils/APIError.js";

import { extractSkillsFromJD } from "./jdExtractor.services.js";
import { extractCoreSubjectsFromJD } from "./jdCoreSubjectExtractor.services.js";
import { scoreCoreSubjects } from "./coreSubjectScoring.js";
import { calculateRelativeATSScore } from "./atsScoring.services.js";
import { extractExperienceFromJD } from "./jdExtractor.services.js";
import { estimateExperienceFromResume } from "./resumeExperience.services.js";

import { BRANCH_SKILL_ALIASES } from "../constants/branchSkillAliases.js";
import { matchSkill } from "../utils/skillMatcher.js";
import { generateSuggestions }
  from "./suggestion.services.js";
  import { extractProjectsFromResume }
  from "./projectExtractor.services.js";
import { generateAISuggestions }
  from "./ai.services.js";



const normalize = (text = "") =>
  text.toLowerCase().replace(/[-_/]/g, " ").replace(/\s+/g, " ").trim();

/**
 * Score skills against JD
 */
const scoreSkills = (resumeText, jdSkills) => {
  if (!jdSkills || jdSkills.length === 0) {
    return null;
  }

  const matched = [];
  const missing = [];

  for (const skill of jdSkills) {
    const aliases = BRANCH_SKILL_ALIASES[skill];

    if (matchSkill(resumeText, aliases)) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  const score = Math.round(
    (matched.length / jdSkills.length) * 100
  );

  return {
    required: jdSkills,
    matched,
    missing,
    score,
  };
};

/**
 * 🔥 FINAL ATS ANALYSIS
 */
export const analyzeResumeAgainstJD = async ({ resumeText, jdText }) => {
  if (!jdText || jdText.trim().length < 50) {
    throw new APIError("Job description is required", 400);
  }

  const normalizedResume = normalize(resumeText);

  // Experience
  const jdExperience = extractExperienceFromJD(jdText);
  const candidateExperience = estimateExperienceFromResume(normalizedResume);

  // Skills (JD-only)
  const jdSkills = extractSkillsFromJD(jdText);
  const skillResult = scoreSkills(normalizedResume, jdSkills);

  // Core Subjects (JD-only)
  const jdCoreSubjects = extractCoreSubjectsFromJD(jdText);
  const coreSubjectResult = scoreCoreSubjects(
    normalizedResume,
    jdCoreSubjects
  );

  // Relative ATS Score
  const finalATSScore = calculateRelativeATSScore({
    skillScore: skillResult ? skillResult.score : 0,
    coreSubjectScore: coreSubjectResult
      ? coreSubjectResult.score
      : null,
    jdExperience,
  });
  const suggestions = generateSuggestions({
    skillResult,
    coreSubjectResult,
    jdExperience,
    candidateExperience,
  });
  const deterministicSuggestions = generateSuggestions({
    skillResult,
    coreSubjectResult,
    jdExperience,
    candidateExperience,
  });

  // Extract project text
  const projectText = extractProjectsFromResume(resumeText);

  // AI suggestions (async)
  const aiSuggestions = await generateAISuggestions({
    jdText,
    projectText,
    skillResult,
    coreSubjectResult,
  });
  

  return {
    atsScore: finalATSScore,
    breakdown: {
      skills: skillResult,
      coreSubjects: coreSubjectResult,
    },
    jdExperience,
    candidateExperience,
    suggestions: {
      deterministic: deterministicSuggestions,
      ai: aiSuggestions,
    },
  };
};