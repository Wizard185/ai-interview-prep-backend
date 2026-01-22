import bcrypt from "bcrypt";
import { User } from "../models/user.models.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";
import jwt from "jsonwebtoken";

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new APIError("User already exists with this email", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    passwordHash,
    role: "user"
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
const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new APIError("Refresh token missing", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new APIError("Invalid refresh token", 401);
  }

  const user = await User.findById(decoded.userId);
  if (!user || !user.refreshTokens.includes(refreshToken)) {
    throw new APIError("Refresh token revoked", 401);
  }

  const newAccessToken = generateAccessToken(user._id);

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });

  return res.status(200).json(
    new APIResponse({
      message: "Access token refreshed",
    })
  );
});
const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    const user = await User.findOne({
      refreshTokens: refreshToken,
    });

    if (user) {
      user.refreshTokens = user.refreshTokens.filter(
        (token) => token !== refreshToken
      );
      await user.save();
    }
  }

  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json(
      new APIResponse({
        message: "Logged out successfully",
      })
    );
});

const logoutAll = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.refreshTokens = [];
    await user.save();
  }

  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json(
      new APIResponse({
        message: "Logged out from all devices",
      })
    );
});



export { register, login, refresh, logout, logoutAll };