import { User } from '../models/User.js';
import { ENV } from '../config/env.js';

export async function seedAdmin() {
  const existingAdmin = await User.findOne({ email: ENV.ADMIN_EMAIL.toLowerCase() });
  const passwordHash = await User.hashPassword(ENV.ADMIN_PASSWORD);

  if (existingAdmin) {
    existingAdmin.role = 'admin';
    existingAdmin.passwordHash = passwordHash;
    existingAdmin.verification = {
      emailVerified: true,
      phoneVerified: true,
      identityVerified: true,
      drivingLicenseVerified: true
    };
    await existingAdmin.save();
    console.log(`👤 Admin user updated: ${ENV.ADMIN_EMAIL}`);
    return existingAdmin;
  }

  const admin = await User.create({
    firstName: ENV.ADMIN_FIRST_NAME,
    lastName: ENV.ADMIN_LAST_NAME,
    email: ENV.ADMIN_EMAIL.toLowerCase(),
    phone: ENV.ADMIN_PHONE,
    passwordHash,
    role: 'admin',
    verification: {
      emailVerified: true,
      phoneVerified: true,
      identityVerified: true,
      drivingLicenseVerified: true
    },
    drivingLicenseNumber: 'DL-042019ADMIN01'
  });

  console.log(`👤 Admin user created successfully: ${ENV.ADMIN_EMAIL}`);
  return admin;
}
