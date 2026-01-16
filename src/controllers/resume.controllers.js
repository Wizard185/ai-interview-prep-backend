import { analyzeResumeAgainstJD } 
  from "../services/jdScoring.services.js";
import { extractTextFromResume } from "../services/resumeParser.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIResponse } from "../utils/APIResponse.js";

export const analyzeResume = asyncHandler(async (req, res) => {
  const resumeText = await extractTextFromResume(req.file);
  const { jobDescription } = req.body;

  const atsResult = analyzeResumeAgainstJD({
    resumeText,
    jdText: jobDescription,
  });

  return res.status(200).json(
    new APIResponse({
      message: "Resume analyzed successfully",
      data: atsResult,
    })
  );
});
