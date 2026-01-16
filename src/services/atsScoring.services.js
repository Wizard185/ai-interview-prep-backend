/**
 * Combine scores into a relative ATS score
 */
export const calculateRelativeATSScore = ({
  skillScore,
  coreSubjectScore,
  jdExperience,
}) => {
  // Default: experienced role
  let skillWeight = 0.8;
  let coreWeight = 0.2;

  // Fresher / Intern
  if (jdExperience.min === 0 || jdExperience.level === "Junior") {
    skillWeight = 0.6;
    coreWeight = 0.4;
  }

  // If JD has no core subjects
  if (coreSubjectScore === null) {
    return Math.round(skillScore);
  }

  return Math.round(
    skillScore * skillWeight +
    coreSubjectScore * coreWeight
  );
};
