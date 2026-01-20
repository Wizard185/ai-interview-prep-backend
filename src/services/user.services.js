import bcrypt from "bcrypt";
import { APIError } from "../utils/APIError.js";
import { User } from "../models/user.models.js";

/**
 * Change user password securely
 */
export const changeUserPassword = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
  const user = await User.findById(userId).select("+passwordHash");

  if (!user) {
    throw new APIError("User not found", 404);
  }

  // 1️⃣ Verify current password
  const isMatch = await bcrypt.compare(
    currentPassword,
    user.passwordHash
  );

  if (!isMatch) {
    throw new APIError("Current password is incorrect", 400);
  }

  // 2️⃣ Prevent reusing same password
  const isSamePassword = await bcrypt.compare(
    newPassword,
    user.passwordHash
  );

  if (isSamePassword) {
    throw new APIError(
      "New password must be different from the old password",
      400
    );
  }

  // 3️⃣ Hash new password
  const newHash = await bcrypt.hash(newPassword, 12);

  user.passwordHash = newHash;

  // 4️⃣ Invalidate all refresh tokens (logout everywhere)
  user.refreshTokens = [];

  await user.save();
};

export const updateUserFullName = async ({
    userId,
    fullName,
  }) => {
    const user = await User.findById(userId);
  
    if (!user) {
      throw new APIError("User not found", 404);
    }
  
    // Prevent unnecessary DB write
    if (user.fullName === fullName) {
      throw new APIError(
        "New full name must be different from current name",
        400
      );
    }
  
    user.fullName = fullName;
    await user.save();
  
    return {
      fullName: user.fullName,
    };
  };
