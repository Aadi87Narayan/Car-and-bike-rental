import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { PricingService, SYSTEM_ADDONS } from '../src/services/pricingService.js';
import { AuthService } from '../src/services/authService.js';
import { calculateRentalDuration, isDateOverlap } from '../src/utils/dateUtils.js';
import { generateBookingNumber } from '../src/utils/bookingNumber.js';
import { ENV } from '../src/config/env.js';

test('🚗 DriveX Backend Core Logic Test Suite', async (t) => {
  // Test 1: Date and Duration Calculation
  await t.test('calculateRentalDuration correctly computes duration', () => {
    const duration = calculateRentalDuration('2026-08-25', '10:00', '2026-08-28', '10:00');
    assert.equal(duration.totalDays, 3, 'Rental should be exactly 3 days');
    assert.equal(duration.totalHours, 72, 'Rental should be 72 hours');
  });

  // Test 2: Booking Date Overlap Detection
  await t.test('isDateOverlap detects conflicting booking windows', () => {
    const existingStart = new Date('2026-08-25T10:00:00');
    const existingEnd = new Date('2026-08-28T10:00:00');

    // Overlapping booking: Aug 26 to Aug 29
    const overlapping = isDateOverlap(
      new Date('2026-08-26T10:00:00'),
      new Date('2026-08-29T10:00:00'),
      existingStart,
      existingEnd
    );
    assert.equal(overlapping, true, 'Should detect overlap');

    // Non-overlapping booking: Aug 29 to Sep 01
    const nonOverlapping = isDateOverlap(
      new Date('2026-08-29T10:00:00'),
      new Date('2026-09-01T10:00:00'),
      existingStart,
      existingEnd
    );
    assert.equal(nonOverlapping, false, 'Should not overlap for subsequent dates');
  });

  // Test 3: Server-Authoritative Price Calculation for Cars
  await t.test('PricingService calculates car rental with GST and add-ons', () => {
    const mockCar = {
      type: 'car',
      rental: {
        pricePerDay: 4500,
        refundableDeposit: 10000
      }
    };

    const calculation = PricingService.calculatePricing(
      mockCar,
      '2026-08-25',
      '10:00',
      '2026-08-28',
      '10:00',
      ['zero_dep', 'child_seat'], // 1499 + 349 = 1848
      'DRIVEX20' // 20% discount on 13500 base = 2500 max cap
    );

    assert.equal(calculation.duration.totalDays, 3);
    assert.equal(calculation.pricing.baseRentalTotal, 13500); // 4500 * 3
    assert.equal(calculation.pricing.addOnsTotal, 1848); // 1499 + 349
    assert.equal(calculation.pricing.discountAmount, 2500); // Max capped discount

    // Subtotal before tax: 13500 + 1848 - 2500 = 12848
    // GST (18%): 12848 * 0.18 = 2313 (rounded)
    assert.equal(calculation.pricing.taxGST, 2313);
    assert.equal(calculation.pricing.refundableSecurityDeposit, 10000);
    // Final total: 12848 + 2313 + 10000 = 25161
    assert.equal(calculation.pricing.finalPayableAmount, 25161);
  });

  // Test 4: Bike Addon Compatibility Check
  await t.test('PricingService filters out car-only add-ons for motorcycles', () => {
    const mockBike = {
      type: 'bike',
      rental: {
        pricePerDay: 1500,
        refundableDeposit: 3000
      }
    };

    const calculation = PricingService.calculatePricing(
      mockBike,
      '2026-08-25',
      '10:00',
      '2026-08-26',
      '10:00',
      ['child_seat', 'extra_driver', 'premium_helmet'] // child_seat and extra_driver should be ignored for bikes
    );

    // Only premium_helmet (249) should be accepted
    assert.equal(calculation.validAddOns.length, 1);
    assert.equal(calculation.validAddOns[0].id, 'premium_helmet');
    assert.equal(calculation.pricing.addOnsTotal, 249);
  });

  // Test 5: Human-readable Booking Number Generation
  await t.test('generateBookingNumber generates correct format', () => {
    const bNumber = generateBookingNumber();
    const regex = /^DX-20\d{2}-\d{6}$/;
    assert.match(bNumber, regex, 'Booking number must match DX-YYYY-NNNNNN');
  });

  // Test 6: JWT Token Issuance & Verification
  await t.test('AuthService generates and verifies JWT access tokens', () => {
    const mockUser = {
      _id: '66c34a1234567890abcdef12',
      email: 'test@drivex.in',
      role: 'user'
    };

    const token = AuthService.generateAccessToken(mockUser);
    assert.ok(token, 'Access token string must exist');

    const decoded = AuthService.verifyAccessToken(token);
    assert.equal(decoded.id, mockUser._id);
    assert.equal(decoded.email, mockUser.email);
    assert.equal(decoded.role, 'user');
  });

  // Test 7: Bcrypt Password Hashing
  await t.test('Bcrypt hashes and verifies password correctly', async () => {
    const plain = 'DriveXSecure@2026';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plain, salt);

    assert.notEqual(plain, hash, 'Hash must not equal plaintext');
    const isMatch = await bcrypt.compare(plain, hash);
    assert.equal(isMatch, true, 'Bcrypt compare must succeed for correct password');
    const isWrong = await bcrypt.compare('WrongPassword', hash);
    assert.equal(isWrong, false, 'Bcrypt compare must fail for incorrect password');
  });
});
