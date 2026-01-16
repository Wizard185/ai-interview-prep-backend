import { APIError } from "../utils/APIError.js";

export const errorHandler = (err, req, res, next) => {
  

  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // Fallback for unexpected errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
  });
};
