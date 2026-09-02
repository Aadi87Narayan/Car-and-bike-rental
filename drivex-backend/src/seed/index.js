import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { seedLocations } from './seedLocations.js';
import { getSeedVehicles } from './seedVehicles.js';
import { seedAdmin } from './seedAdmin.js';
import { Vehicle } from '../models/Vehicle.js';

async function runMasterSeed() {
  console.log('\n🌱 =======================================================');
  console.log('🚀 Starting DriveX Master Seed Pipeline...');
  console.log('=======================================================\n');

  try {
    await connectDB();

    // 1. Seed Locations
    const locations = await seedLocations();
    const locationsMap = {};
    locations.forEach((loc) => {
      locationsMap[loc.city.toLowerCase()] = loc;
    });

    // 2. Seed Vehicles (Cars, Bikes, Scooters, EVs)
    await Vehicle.deleteMany({});
    const vehiclesData = getSeedVehicles(locationsMap);
    const createdVehicles = await Vehicle.insertMany(vehiclesData);
    console.log(`🚗🏍️ Seeded ${createdVehicles.length} Multi-Category Vehicles (Cars, Bikes, Scooters, EVs)`);

    // 3. Seed Admin Account
    await seedAdmin();

    console.log('\n=======================================================');
    console.log('✅ DriveX Database Seed Completed Successfully!');
    console.log('=======================================================\n');
  } catch (error) {
    console.error('❌ Master Seed Pipeline Failed:', error);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

runMasterSeed();
