import { SKILL_TAXONOMY } from "./skillTaxonomy.js";
import { SKILL_ALIASES } from "./skillAliases.js";

/**
 * Flatten SKILL_TAXONOMY into a single array of all skills
 */
const getAllSkills = () => {
  const allSkills = [];
  for (const category of Object.values(SKILL_TAXONOMY)) {
    allSkills.push(...category);
  }
  return allSkills;
};

/**
 * Build BRANCH_SKILL_ALIASES by combining SKILL_TAXONOMY with SKILL_ALIASES
 * For skills without explicit aliases, use the skill name itself
 */
export const BRANCH_SKILL_ALIASES = {};

// Add all skills from taxonomy
const allSkills = getAllSkills();
for (const skill of allSkills) {
  // Use aliases from SKILL_ALIASES if available, otherwise use skill name
  BRANCH_SKILL_ALIASES[skill] = SKILL_ALIASES[skill] || [skill];
}

// Also include all skills from SKILL_ALIASES that might not be in taxonomy
for (const [skill, aliases] of Object.entries(SKILL_ALIASES)) {
  if (!BRANCH_SKILL_ALIASES[skill]) {
    BRANCH_SKILL_ALIASES[skill] = aliases;
  }
}
