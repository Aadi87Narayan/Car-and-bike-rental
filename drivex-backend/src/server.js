import http from 'http';
import app from './app.js';
import { ENV } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

let server;

async function startServer() {
  // Connect to MongoDB
  await connectDB();

  server = http.createServer(app);

  server.listen(ENV.PORT, () => {
    console.log(`\n=======================================================`);
    console.log(`🚗🏍️ DriveX Backend Server Running on Port: ${ENV.PORT}`);
    console.log(`🌐 Environment: ${ENV.NODE_ENV}`);
    console.log(`🚀 Base API URL: http://localhost:${ENV.PORT}/api/v1`);
    console.log(`🩺 Health Check: http://localhost:${ENV.PORT}/api/v1/health`);
    console.log(`=======================================================\n`);
  });
}

// Graceful Shutdown Handler
async function handleShutdown(signal) {
  console.log(`\n⚠️ Received ${signal}. Initiating graceful shutdown...`);

  if (server) {
    server.close(() => {
      console.log('🛑 HTTP Server closed.');
    });
  }

  await disconnectDB();
  console.log('✅ Graceful shutdown completed. Exiting process.');
  process.exit(0);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

startServer();
