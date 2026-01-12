import jwt from "jsonwebtoken";
import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

export const requireAuth = asyncHandler(async (req, _, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new APIError("Authentication required", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    throw new APIError("Invalid or expired token", 401);
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new APIError("User no longer exists", 401);
  }

  // attach user to request
  req.user = user;

  next();
});
