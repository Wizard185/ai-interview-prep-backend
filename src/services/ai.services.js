import { GoogleGenAI } from "@google/genai";
import { parseAISuggestions } from "./aiParser.services.js";

/**
 * Initialize Gemini client
 */
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({})
  : null;

/**
 * Low-level Gemini call (SAFE + STABLE)
 */
const callAIModel = async ({ prompt }) => {
  if (!ai) {
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // ✅ STABLE MODEL
      contents: prompt,
    });

    const text = response.text?.trim();
    if (!text) return null;

    return text
      .split("\n")
      .map(line => line.replace(/^[-•\d.\s]+/, "").trim())
      .filter(Boolean);

  } catch (error) {
    console.error("Gemini AI error:", error.message);
    return null;
  }
};

/**
 * AI-powered JD + Project analysis (STRUCTURED)
 */
export const generateAISuggestions = async ({
  jdText,
  projectText,
  skillResult,
  coreSubjectResult,
}) => {
  // 🔹 No gaps → no AI needed
  if (
    (!skillResult || skillResult.missing.length === 0) &&
    (!coreSubjectResult || coreSubjectResult.missing.length === 0)
  ) {
    return {
      summary: [],
      reframeSuggestions: [],
      projectIdeas: [],
    };
  }

  const prompt = `
You are a technical recruiter.

Job Description (summary):
${jdText.slice(0, 1200)}

Candidate Projects:
${projectText || "No projects listed"}

Missing Skills:
${skillResult?.missing.join(", ") || "None"}

Missing Core Subjects:
${coreSubjectResult?.missing.join(", ") || "None"}

Task:
1. Briefly summarize project relevance.
2. Suggest how existing projects can be reframed.
3. Suggest 1–2 new project ideas aligned with the JD.

Return concise bullet points.
`;

  // Try Gemini
  const rawLines = await callAIModel({ prompt });

  // 🔒 Fallback if AI fails
  if (!rawLines) {
    return parseAISuggestions([
      "Projects align reasonably with the job description but can be improved.",
      "Reframe existing projects to explicitly mention missing skills or concepts.",
      "Consider adding a project that demonstrates the missing JD requirements.",
    ]);
  }

  // ✅ Structured output
  return parseAISuggestions(rawLines);
};
