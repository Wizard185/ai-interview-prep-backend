import { asyncHandler } from "../utils/asyncHandler.js";
import { APIResponse } from "../utils/APIResponse.js";
import { AnalysisHistory } from "../models/analysisHistory.models.js";

import { APIError } from "../utils/APIError.js";
/**
 * GET /api/v1/analysis/history
 * Fetch user's resume analysis history (paginated)
 */
export const getAnalysisHistory = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const [history, total] = await Promise.all([
    AnalysisHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    AnalysisHistory.countDocuments({ userId: req.user._id }),
  ]);

  return res.status(200).json(
    new APIResponse({
      message: "Analysis history fetched successfully",
      data: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        results: history,
      },
    })
  );
});


/**
 * DELETE /api/v1/analysis/:id
 * Delete a single analysis entry (owned by user)
 */
export const deleteAnalysisById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await AnalysisHistory.findOneAndDelete({
    _id: id,
    userId: req.user._id, // 🔒 ownership check
  });

  if (!deleted) {
    throw new APIError("Analysis not found or access denied", 404);
  }

  return res.status(200).json(
    new APIResponse({
      message: "Analysis entry deleted successfully",
    })
  );
});

/**
 * DELETE /api/v1/analysis
 * Delete all analysis history for the user
 */
export const deleteAllAnalysisHistory = asyncHandler(async (req, res) => {
  const result = await AnalysisHistory.deleteMany({
    userId: req.user._id,
  });

  return res.status(200).json(
    new APIResponse({
      message: "All analysis history deleted successfully",
      data: {
        deletedCount: result.deletedCount,
      },
    })
  );
});

