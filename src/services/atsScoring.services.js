
 import { ATS_SKILLS } from "../constants/atsSkills.js";
import { APIError } from "../utils/APIError.js";

const normalize = (text) => text.toLowerCase();

const scoreCategory = (resumeText, skills) => {
  const matched = skills.filter(skill =>
    resumeText.includes(skill)
  );
  return {
    matched,
    score: matched.length / skills.length,
  };
};

export const scoreResumeWithATS = ({ resumeText, domain }) => {
  const domainConfig = ATS_SKILLS[domain];
  if (!domainConfig) {
    throw new APIError("Unsupported domain", 400);
  }

  const text = normalize(resumeText);
  let finalScore = 0;
  const breakdown = {};

  for (const [category, skills] of Object.entries(domainConfig)) {
    if (category === "weights") continue;

    const { matched, score } = scoreCategory(text, skills);
    const weight = domainConfig.weights[category] || 0;

    finalScore += score * weight;

    breakdown[category] = {
      matched,
      missing: skills.filter(s => !matched.includes(s)),
    };
  }

  return {
    domain,
    atsScore: Math.round(finalScore * 100),
    breakdown,
  };
};
