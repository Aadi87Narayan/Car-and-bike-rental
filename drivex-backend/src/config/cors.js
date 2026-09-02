import { ENV } from './env.js';

const allowedOrigins = [
  ENV.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server or non-browser tools (e.g., Postman/curl) where origin is undefined
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || !ENV.isProduction) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: Origin ${origin} not allowed by DriveX policy`));
    }
  },
  credentials: true, // Allow cookies across origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Set-Cookie']
};
