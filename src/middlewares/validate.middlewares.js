import { ZodError } from "zod";
import { APIError } from "../utils/APIError.js";

const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    try {
      const parsed = schema.parse(req[property]);
      // Replace the original object with the validated & parsed data
      req[property] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        }));
        return next(new APIError("Invalid request data", 400, errors));
      }
      next(err);
    }
  };
export { validate };
