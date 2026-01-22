import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new APIResponse({
      message: "User profile fetched successfully",
      data: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
      },
    })
  );
});

export { getMe };