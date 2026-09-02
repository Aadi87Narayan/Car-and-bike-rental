import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { ENV } from '../config/env.js';

// Ensure base upload directories exist
const uploadBaseDir = path.resolve(process.cwd(), ENV.UPLOAD_DIR);
const subDirs = ['profiles', 'vehicles', 'documents'];

subDirs.forEach((dir) => {
  const target = path.join(uploadBaseDir, dir);
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
});

// Configure disk storage with randomized server-side filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subFolder = 'documents';
    if (file.fieldname === 'profile') subFolder = 'profiles';
    if (file.fieldname === 'vehicleImage') subFolder = 'vehicles';

    const dest = path.join(uploadBaseDir, subFolder);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Generate secure random filename
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomName}${ext}`);
  }
});

// Strict MIME type and extension filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

  const ext = path.extname(file.originalname).toLowerCase();

  // Reject executable extensions immediately
  const forbiddenExts = ['.exe', '.bat', '.sh', '.js', '.mjs', '.php', '.py', '.html', '.svg'];
  if (forbiddenExts.includes(ext)) {
    return cb(new Error('Executable and script file uploads are strictly forbidden.'));
  }

  if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, WEBP, and PDF documents are allowed.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: ENV.MAX_FILE_SIZE_MB * 1024 * 1024 // 5 MB max
  }
});
