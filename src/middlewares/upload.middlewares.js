import multer from "multer";
import { APIError } from "../utils/APIError.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    cb(new APIError("Only PDF and DOCX files are allowed", 400));
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
});

export const uploadResume = (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (err) {
      // Multer or fileFilter error
      return next(
        err instanceof APIError
          ? err
          : new APIError(err.message || "File upload failed", 400)
      );
    }
    next();
  });
};
