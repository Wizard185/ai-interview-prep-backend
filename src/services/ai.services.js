import { APIError } from "../utils/APIError.js";

/**
 * Build a strict prompt that forces JSON output
 */
const buildResumePrompt = ({ resumeText, targetRole }) => {
  return `
You are an expert technical recruiter and career coach.

Analyze the resume below for the role of "${targetRole}".

Return ONLY valid JSON in the following format:

{
  "score": number (0-100),
  "strengths": string[],
  "missingSkills": string[],
  "suggestions": string[]
}

Rules:
- Do NOT include markdown
- Do NOT include explanations outside JSON
- Be concise and practical

Resume:
"""
${resumeText}
"""
`;
};

/**
 * Call AI provider (mocked / abstracted)
 * Replace this implementation with OpenAI / Gemini later
 */
const callAIProvider = async (prompt) => {
  /**
   * 🔴 TEMP MOCK (for now)
   * This allows backend to work without real AI
   * Replace with real API call later
   */
  return `
  {
    "score": 75,
    "strengths": ["Node.js", "Express", "REST APIs"],
    "missingSkills": ["System Design", "Caching", "Cloud Deployment"],
    "suggestions": [
      "Add quantified achievements",
      "Mention scalability experience",
      "Include cloud technologies"
    ]
  }
  `;
};

/**
 * Safely parse AI JSON output
 */
const parseAIResponse = (rawText) => {
  try {
    return JSON.parse(rawText);
  } catch (err) {
    throw new APIError("AI returned invalid JSON", 500);
  }
};

/**
 * Public service method used by controllers
 */
export const analyzeResumeWithAI = async ({ resumeText, targetRole }) => {
  if (!resumeText || resumeText.length < 300) {
    throw new APIError("Resume text is insufficient for analysis", 400);
  }

  const prompt = buildResumePrompt({ resumeText, targetRole });

  const rawAIResponse = await callAIProvider(prompt);

  const parsedResult = parseAIResponse(rawAIResponse);

  return parsedResult;
};
