import mongoose from 'mongoose';
import { ENV } from './env.js';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Disable command buffering when DB is unreachable so requests respond immediately instead of hanging
    mongoose.set('bufferCommands', false);
    if (ENV.isProduction) {
      process.exit(1);
    } else {
      console.warn('⚠️ Server running without active DB connection. Local/mock mode active.');
    }
  }

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('⚠️ MongoDB disconnected.');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB connection event error: ${err.message}`);
  });
}

export async function disconnectDB() {
  if (!isConnected) return;
  await mongoose.connection.close();
  isConnected = false;
  console.log('🔌 MongoDB connection closed gracefully.');
}
