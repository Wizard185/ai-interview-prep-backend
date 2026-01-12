import { APIError } from "../utils/APIError.js";

export const errorHandler = (err, req, res, next) => {
  if (!(err instanceof APIError)) {
    err = new APIError(
      "Internal Server Error",
      500,
      [],
      false
    );
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors,
  });
};
