import { z } from "zod";

export const resumeAnalysisSchema = z
  .object({
    targetRole: z.string().min(1).optional(),
    jobDescription: z.string().min(50).optional(),
  })
  .refine(
    (data) => data.targetRole || data.jobDescription,
    {
      message: "Either targetRole or jobDescription is required",
      path: ["targetRole"],
    }
  );
