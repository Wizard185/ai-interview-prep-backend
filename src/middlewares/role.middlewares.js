import { APIError } from "../utils/APIError.js";

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new APIError("Authentication required", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new APIError("Forbidden: insufficient permissions", 403);
    }

    next();
  };
};


export  {requireRole};

