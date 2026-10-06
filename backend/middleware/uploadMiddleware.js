const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Destination folder for resume uploads
const uploadDir = path.join(__dirname, '../uploads/resumes');

// Ensure directory exists securely
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed MIME types and extensions for authentic documents
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

// Storage configuration with cryptographically secure random filenames
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Security: Generate a safe random hash name on disk
    // Never trust client-sent filenames to avoid path traversal (../) or double extensions
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXTENSIONS.includes(ext) ? ext : '.pdf';
    const randomHash = crypto.randomBytes(16).toString('hex');
    cb(null, `resume_${Date.now()}_${randomHash}${safeExt}`);
  }
});

// Dual validation: Verify BOTH file extension and MIME type
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isExtValid = ALLOWED_EXTENSIONS.includes(ext);
  const isMimeValid = ALLOWED_MIME_TYPES.includes(file.mimetype);

  if (isExtValid && isMimeValid) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Security Alert: Only authentic PDF, DOC, and DOCX files are allowed!'
      ),
      false
    );
  }
};

const uploadResume = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Strict 5 MB maximum limit to prevent DoS / disk exhaustion
    files: 1 // Only 1 file per request
  },
  fileFilter
});

module.exports = { uploadResume };
