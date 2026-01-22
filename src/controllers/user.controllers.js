import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { changePassword } from "../services/user.services.js";
import { updateFullName } from "../services/user.services.js";
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

const changeUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await changePassword({
    userId: req.user._id,
    currentPassword,
    newPassword,
  });

  return res.status(200).json(
    new APIResponse({
      message: "Password updated successfully. Please login again.",
    })
  );
});


const updateUserName = asyncHandler(async (req, res) => {
  const result = await updateFullName({
    userId: req.user._id,
    fullName: req.body.fullName,
  });

  return res.status(200).json(
    new APIResponse({
      message: "Name updated successfully",
      data: result,
    })
  );
});


export { getMe,changeUserPassword,updateUserName };