import bcrypt from "bcrypt";
import { User } from "../models/user.models.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isStrongPassword } from "../utils/passwordValidator.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    throw new APIError("All fields are required", 400);
  }

  if (!isStrongPassword(password)) {
    throw new APIError(
      "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character",
      400
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new APIError("User already exists with this email", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    passwordHash,
  });

  return res.status(201).json(
    new APIResponse({
      statusCode: 201,
      message: "User registered successfully",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    })
  );
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new APIError("Email and password are required", 400);
  }

  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw new APIError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new APIError("Invalid email or password", 401);
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokens.push(refreshToken);
  await user.save();

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .status(200)
    .json(
      new APIResponse({
        message: "Login successful",
        data: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      })
    );
});

export { register, login };
