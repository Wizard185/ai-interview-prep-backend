import { createRequire } from "module";
import mammoth from "mammoth";
import { APIError } from "../utils/APIError.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/**
 * Normalize extracted text
 */
const normalizeText = (text = "") =>
  text.replace(/\s+/g, " ").trim();

/**
 * Extract text from resume (PDF / DOCX)
 */
export const extractTextFromResume = async (file) => {
  if (!file) {
    throw new APIError("Resume file is required", 400);
  }

  // ---------- PDF ----------
  if (file.mimetype === "application/pdf") {
    let parsed;
    try {
      parsed = await pdfParse(file.buffer);
    } catch (err) {
      console.error("PDF PARSE ERROR:", err);
      throw new APIError(
        "Unable to read this PDF. Please upload a DOCX or a different PDF.",
        400
      );
    }

    const cleanedText = normalizeText(parsed.text);

    if (!cleanedText || cleanedText.length < 200) {
      throw new APIError(
        "Unable to extract readable text from this PDF. Please upload a DOCX or a different PDF.",
        400
      );
    }

    return cleanedText;
  }

  // ---------- DOCX ----------
  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    let result;
    try {
      result = await mammoth.extractRawText({ buffer: file.buffer });
    } catch {
      throw new APIError("Failed to parse DOCX file", 400);
    }

    const cleanedText = normalizeText(result.value);

    if (!cleanedText || cleanedText.length < 200) {
      throw new APIError("DOCX file does not contain enough readable content", 400);
    }

    return cleanedText;
  }
  throw new APIError("Unsupported file type", 400);
};
