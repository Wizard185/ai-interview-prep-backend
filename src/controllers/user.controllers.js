import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { changeUserPassword } from "../services/user.services.js";
import { updateUserFullName } from "../services/user.services.js";
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
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await changeUserPassword({
    userId: req.user._id,
    currentPassword,
    newPassword,
  });

  return res.status(200).json(
    new APIResponse({
      message: "Password changed successfully. Please login again.",
    })
  );
});
const updateFullName = asyncHandler(async (req, res) => {
  const { fullName } = req.body;

  const updatedUser = await updateUserFullName({
    userId: req.user._id,
    fullName,
  });

  return res.status(200).json(
    new APIResponse({
      message: "Full name updated successfully",
      data: updatedUser,
    })
  );
});

export { getMe,changePassword,updateFullName };