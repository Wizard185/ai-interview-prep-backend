import mongoose from "mongoose";

const analysisHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    atsScore: {
      type: Number,
      required: true,
    },

    jobDescriptionSummary: {
      type: String,
    },

    breakdown: {
      skills: Object,
      coreSubjects: Object,
    },

    experience: {
      jd: Object,
      candidate: Object,
    },

    suggestions: {
      deterministic: Array,
      ai: Object,
    },
  },
  { timestamps: true }
);

export const AnalysisHistory = mongoose.model(
  "AnalysisHistory",
  analysisHistorySchema
);
