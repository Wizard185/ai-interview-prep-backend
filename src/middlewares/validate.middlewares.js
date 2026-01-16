import { ZodError } from "zod";
import { APIError } from "../utils/APIError.js";

export const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    try {
      const data = req[property] ?? {}; // 🔥 IMPORTANT
      const parsed = schema.parse(data);
      req[property] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        }));

        return next(new APIError("Invalid request data", 400, errors));
      }

      return next(err); // unexpected error
    }
  };
