import { extractSkillsFromJD, extractExperienceFromJD }
  from "./jdExtractor.services.js";
import { estimateExperienceFromResume }
  from "./resumeExperience.services.js";
import { extractCoreSubjectsFromJD }
  from "./jdCoreSubjectExtractor.services.js";
import { scoreCoreSubjects }
  from "./coreSubjectScoring.js";
import { APIError } from "../utils/APIError.js";

/**
 * Match resume skills against JD skills
 */
const computeSkillMatch = (resumeText, jdSkills) => {
  const text = resumeText.toLowerCase();
  let matched = 0;
  let total = 0;

  const breakdown = {};

  for (const [category, skills] of Object.entries(jdSkills)) {
    const found = [];
    const missing = [];

    for (const skill of skills) {
      if (text.includes(skill.toLowerCase())) {
        found.push(skill);
        matched++;
      } else {
        missing.push(skill);
      }
      total++;
    }

    breakdown[category] = {
      matched: found,
      missing,
    };
  }

  return {
    score: total === 0 ? 0 : (matched / total) * 100,
    breakdown,
  };
};

/**
 * Adjust score based on JD experience requirement
 */
const applyExperiencePenalty = (
  baseScore,
  jdExperience,
  candidateExperience
) => {
  if (jdExperience.level === "Unspecified") {
    return baseScore;
  }

  if (candidateExperience.years < jdExperience.min) {
    return baseScore * 0.7;
  }

  if (
    jdExperience.max !== null &&
    candidateExperience.years > jdExperience.max + 3
  ) {
    return baseScore * 0.95;
  }

  return baseScore;
};

const calculateRelativeATSScore = ({
    skillScore,
    coreSubjectScore,
    jdExperience,
  }) => {
    // Default weights (experienced roles)
    let skillWeight = 0.8;
    let coreWeight = 0.2;
  
    // Fresher / Intern roles
    if (
      jdExperience.level === "Junior" ||
      jdExperience.min === 0
    ) {
      skillWeight = 0.6;
      coreWeight = 0.4;
    }
  
    // If JD has no core subjects, rely only on skills
    if (coreSubjectScore === null) {
      return Math.round(skillScore);
    }
  
    return Math.round(
      skillScore * skillWeight +
      coreSubjectScore * coreWeight
    );
  };
  
export const analyzeResumeAgainstJD = ({ resumeText, jdText }) => {
    if (!jdText || jdText.trim().length < 50) {
      throw new APIError("Job description is required", 400);
    }
  
    // Skill ATS
    const jdSkills = extractSkillsFromJD(jdText);
    const jdExperience = extractExperienceFromJD(jdText);
    const candidateExperience = estimateExperienceFromResume(resumeText);
  
    const {
      score: skillScore,
      breakdown: skillBreakdown,
    } = computeSkillMatch(resumeText, jdSkills);
  
    const adjustedSkillScore = applyExperiencePenalty(
      skillScore,
      jdExperience,
      candidateExperience
    );
  
    // Core Subject ATS (JD-only)
    const jdCoreSubjects = extractCoreSubjectsFromJD(jdText);
    const coreSubjectResult = scoreCoreSubjects(
      resumeText,
      jdCoreSubjects
    );
  
    const finalATSScore = calculateRelativeATSScore({
      skillScore: adjustedSkillScore,
      coreSubjectScore: coreSubjectResult
        ? coreSubjectResult.score
        : null,
      jdExperience,
    });
  
    return {
      atsScore: finalATSScore,           // 🔥 RELATIVE SCORE
      breakdown: {
        skills: {
          score: Math.round(adjustedSkillScore),
          details: skillBreakdown,
        },
        coreSubjects: coreSubjectResult,
      },
      jdExperience,
      candidateExperience,
    };
  };
  
