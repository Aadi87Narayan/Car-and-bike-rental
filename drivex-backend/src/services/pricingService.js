import { calculateRentalDuration } from '../utils/dateUtils.js';

// Approved Server-side Add-on catalog with vehicle type compatibility
export const SYSTEM_ADDONS = {
  zero_dep: {
    id: 'zero_dep',
    name: 'Zero-Depreciation Damage Waiver',
    price: 1499,
    compatibleTypes: ['car', 'bike', 'scooter', 'ev']
  },
  unlimited_km: {
    id: 'unlimited_km',
    name: 'Unlimited Kilometers Plan',
    price: 999,
    compatibleTypes: ['car', 'bike', 'scooter', 'ev']
  },
  extra_driver: {
    id: 'extra_driver',
    name: 'Additional Certified Driver',
    price: 499,
    compatibleTypes: ['car']
  },
  child_seat: {
    id: 'child_seat',
    name: 'Child Safety Isofix Seat',
    price: 349,
    compatibleTypes: ['car']
  },
  premium_helmet: {
    id: 'premium_helmet',
    name: 'DOT/ECE Certified Riding Helmet',
    price: 249,
    compatibleTypes: ['bike', 'scooter', 'ev']
  },
  riding_jacket: {
    id: 'riding_jacket',
    name: 'All-Weather Armor Riding Jacket',
    price: 499,
    compatibleTypes: ['bike']
  },
  doorstep_delivery: {
    id: 'doorstep_delivery',
    name: 'Airport / Doorstep Delivery Service',
    price: 599,
    compatibleTypes: ['car', 'bike', 'scooter', 'ev']
  }
};

// Verified Promo Coupons
const PROMO_COUPONS = {
  DRIVEX20: { discountPercent: 20, maxDiscount: 2500, minDays: 2 },
  FIRSTDRIVE: { flatDiscount: 500, minAmount: 2000 },
  WEEKENDVIBES: { discountPercent: 15, maxDiscount: 1500, minDays: 3 }
};

export class PricingService {
  /**
   * Server-authoritative calculation of rental price
   * Ignores ANY price sent from client!
   */
  static calculatePricing(vehicle, pickupDate, pickupTime, dropoffDate, dropoffTime, selectedAddonIds = [], couponCode = '') {
    // 1. Calculate duration
    const duration = calculateRentalDuration(pickupDate, pickupTime, dropoffDate, dropoffTime);
    const { totalDays } = duration;

    // 2. Base rental rate
    const dailyRate = vehicle.rental?.pricePerDay || 2000;
    let baseRentalTotal = dailyRate * totalDays;

    // Long rental discount (e.g. 7+ days = 10% discount on base)
    if (totalDays >= 7) {
      baseRentalTotal = Math.round(baseRentalTotal * 0.90);
    }

    // 3. Add-ons calculation with strict vehicle-type compatibility check
    const validAddOns = [];
    let addOnsTotal = 0;

    if (Array.isArray(selectedAddonIds)) {
      for (const addonId of selectedAddonIds) {
        const addon = SYSTEM_ADDONS[addonId];
        if (addon && addon.compatibleTypes.includes(vehicle.type)) {
          validAddOns.push({
            id: addon.id,
            name: addon.name,
            price: addon.price
          });
          addOnsTotal += addon.price;
        }
      }
    }

    // 4. Promo Code Validation
    let discountAmount = 0;
    let appliedCoupon = '';

    if (couponCode && typeof couponCode === 'string') {
      const code = couponCode.trim().toUpperCase();
      const coupon = PROMO_COUPONS[code];

      if (coupon) {
        appliedCoupon = code;
        if (coupon.discountPercent) {
          const rawDiscount = Math.round((baseRentalTotal * coupon.discountPercent) / 100);
          discountAmount = coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
        } else if (coupon.flatDiscount) {
          discountAmount = coupon.flatDiscount;
        }
      }
    }

    // Subtotal before GST
    const taxableSubtotal = Math.max(0, baseRentalTotal + addOnsTotal - discountAmount);

    // 5. Government GST (18% in India for self-drive car/bike rentals)
    const taxPercentage = 18;
    const taxGST = Math.round((taxableSubtotal * taxPercentage) / 100);

    // 6. Security Deposit (Refundable)
    const refundableSecurityDeposit = vehicle.rental?.refundableDeposit || 5000;

    // 7. Final Payable Amount (Subtotal + GST + Security Deposit)
    const finalPayableAmount = taxableSubtotal + taxGST + refundableSecurityDeposit;

    return {
      duration,
      validAddOns,
      pricing: {
        baseDailyRate: dailyRate,
        baseRentalTotal,
        addOnsTotal,
        taxGST,
        taxPercentage,
        discountAmount,
        couponCode: appliedCoupon,
        refundableSecurityDeposit,
        finalPayableAmount
      }
    };
  }
}
