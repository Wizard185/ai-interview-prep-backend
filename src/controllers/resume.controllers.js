import { asyncHandler } from "../utils/asyncHandler.js";
import { APIResponse } from "../utils/APIResponse.js";
import { extractTextFromResume } from "../services/resumeParser.services.js";
import { analyzeResumeWithAI } from "../services/ai.services.js";
import { APIError } from "../utils/APIError.js";

export const analyzeResume = asyncHandler(async (req, res) => {
  const resumeText = await extractTextFromResume(req.file);
  console.log("FILE",req.file);
  console.log("BODY",req.body);
  if (resumeText.length < 300) {
    throw new APIError("Resume content is too short", 400);
  }

  const aiResult = await analyzeResumeWithAI({
    resumeText,
    targetRole: req.body.targetRole,
  });

  return res.status(200).json(
    new APIResponse({
      message: "Resume analyzed successfully",
      data: aiResult,
    })
  );
});
