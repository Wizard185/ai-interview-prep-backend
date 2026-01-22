import bcrypt from "bcrypt";
import { User } from "../models/user.models.js";
import { APIError } from "../utils/APIError.js";

export const changePassword = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
  const user = await User.findById(userId).select("+passwordHash");

  if (!user) throw new APIError("User not found", 404);

  const isValid = await bcrypt.compare(
    currentPassword,
    user.passwordHash
  );

  if (!isValid) {
    throw new APIError("Current password is incorrect", 400);
  }

  const samePassword = await bcrypt.compare(
    newPassword,
    user.passwordHash
  );

  if (samePassword) {
    throw new APIError(
      "New password must be different from old password",
      400
    );
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);

  // 🔒 logout all devices
  user.refreshTokens = [];

  await user.save();
};
