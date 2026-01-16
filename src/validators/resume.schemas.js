import { z } from "zod";

export const resumeAnalysisSchema = z.object({
  targetRole: z.string().min(2, "Target role is required"),
});
