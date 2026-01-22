import { analyzeResumeAgainstJD } 
  from "../services/jdScoring.services.js";
import { extractTextFromResume } from "../services/resumeParser.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIResponse } from "../utils/APIResponse.js";
import { AnalysisHistory } from "../models/analysisHistory.models.js";

export const analyzeResume = asyncHandler(async (req, res) => {
  const resumeText = await extractTextFromResume(req.file);
  const { jobDescription } = req.body;

  const atsResult = await analyzeResumeAgainstJD({
    resumeText,
    jdText: jobDescription,
  });

  // ✅ SAVE ANALYSIS HISTORY
  await AnalysisHistory.create({
    userId: req.user._id,
    atsScore: atsResult.atsScore,
    breakdown: atsResult.breakdown,
    experience: {
      jd: atsResult.jdExperience,
      candidate: atsResult.candidateExperience,
    },
    suggestions: atsResult.suggestions,
  });

  return res.status(200).json(
    new APIResponse({
      message: "Resume analyzed successfully",
      data: atsResult,
    })
  );
});
