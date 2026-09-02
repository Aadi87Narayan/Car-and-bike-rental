import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

import { corsOptions } from './config/cors.js';
import { ENV } from './config/env.js';
import { generalLimiter } from './middleware/rateLimitMiddleware.js';
import { securitySanitizer } from './middleware/securityMiddleware.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import v1Router from './routes/v1/index.js';

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://api.dicebear.com"],
        connectSrc: ["'self'", "http://localhost:5000", "http://127.0.0.1:5000"]
      }
    }
  })
);

// Cross-Origin Resource Sharing
app.use(cors(corsOptions));

// HTTP Request Logging
if (!ENV.isProduction) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body Parsers & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(securitySanitizer);

// General Rate Limiting for all requests
app.use('/api', generalLimiter);

// Serve static uploaded assets safely
const uploadsPath = path.resolve(process.cwd(), ENV.UPLOAD_DIR);
app.use('/uploads', express.static(uploadsPath));

// API Version 1 Mount
app.use('/api/v1', v1Router);

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    name: 'DriveX India Rental Platform REST API',
    version: '1.0.0',
    documentation: '/api/v1/health',
    status: 'online'
  });
});

// 404 & Global Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
