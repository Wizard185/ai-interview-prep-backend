
import { User } from "../models/user.models.js";
import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-passwordHash");

  return res.status(200).json(
    new APIResponse({
      message: "All users fetched successfully",
      data: users,
    })
  );
});

export { getAllUsers };