export class APIError extends Error {
    constructor(
      message,
      statusCode = 500,
      errors = [],
      isOperational = true
    ) {
      super(message);
  
      this.statusCode = statusCode;
      this.errors = errors;
      this.isOperational = isOperational;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  