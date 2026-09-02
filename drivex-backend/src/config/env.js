import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/drivex',

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'drivex_access_secret_fallback_2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'drivex_refresh_secret_fallback_2026',
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || '15m',
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d',

  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  ADMIN_FIRST_NAME: process.env.ADMIN_FIRST_NAME || 'DriveX',
  ADMIN_LAST_NAME: process.env.ADMIN_LAST_NAME || 'SuperAdmin',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@drivex.in',
  ADMIN_PHONE: process.env.ADMIN_PHONE || '+919876543210',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'AdminDriveX@2026',

  GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY || '',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',

  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 2525,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  SMTP_FROM: process.env.SMTP_FROM || 'DriveX Rentals <support@drivex.in>',

  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5,

  isProduction: process.env.NODE_ENV === 'production'
};
