import { Location } from '../models/Location.js';

export const SEED_LOCATIONS = [
  {
    name: 'Bhilai Central Mobility Hub',
    city: 'Bhilai',
    state: 'Chhattisgarh',
    country: 'India',
    address: 'Great Eastern Road, Civic Center, Bhilai, Chhattisgarh - 490006',
    pincode: '490006',
    coordinates: {
      type: 'Point',
      coordinates: [81.3629, 21.2121] // [lng, lat]
    },
    operatingHours: { open: '06:00', close: '23:30' },
    contactPhone: '+91 98765 12340',
    active: true
  },
  {
    name: 'Raipur Swami Vivekananda Airport Hub',
    city: 'Raipur',
    state: 'Chhattisgarh',
    country: 'India',
    address: 'Airport Road, VIP Estate, Raipur, Chhattisgarh - 492015',
    pincode: '492015',
    coordinates: {
      type: 'Point',
      coordinates: [81.6296, 21.2514]
    },
    operatingHours: { open: '05:00', close: '23:59' },
    contactPhone: '+91 98765 12341',
    active: true
  },
  {
    name: 'Durg Junction Railway Hub',
    city: 'Durg',
    state: 'Chhattisgarh',
    country: 'India',
    address: 'Station Road, Mohan Nagar, Durg, Chhattisgarh - 491001',
    pincode: '491001',
    coordinates: {
      type: 'Point',
      coordinates: [81.2849, 21.1904]
    },
    operatingHours: { open: '06:00', close: '23:00' },
    contactPhone: '+91 98765 12342',
    active: true
  },
  {
    name: 'Nagpur Central Metro Hub',
    city: 'Nagpur',
    state: 'Maharashtra',
    country: 'India',
    address: 'Wardha Road, Sitabuldi, Nagpur, Maharashtra - 440012',
    pincode: '440012',
    coordinates: {
      type: 'Point',
      coordinates: [79.0882, 21.1458]
    },
    operatingHours: { open: '06:00', close: '23:00' },
    contactPhone: '+91 98765 12343',
    active: true
  },
  {
    name: 'Indore Vijay Nagar Hub',
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    address: 'AB Road, Vijay Nagar Square, Indore, Madhya Pradesh - 452010',
    pincode: '452010',
    coordinates: {
      type: 'Point',
      coordinates: [75.8577, 22.7196]
    },
    operatingHours: { open: '06:00', close: '23:00' },
    contactPhone: '+91 98765 12344',
    active: true
  },
  {
    name: 'Mumbai Bandra-Kurla Complex Hub',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    address: 'G Block, BKC, Bandra East, Mumbai, Maharashtra - 400051',
    pincode: '400051',
    coordinates: {
      type: 'Point',
      coordinates: [72.8697, 19.0657]
    },
    operatingHours: { open: '05:00', close: '23:59' },
    contactPhone: '+91 98765 12345',
    active: true
  },
  {
    name: 'Pune Viman Nagar Hub',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    address: 'Symbiosis Road, Viman Nagar, Pune, Maharashtra - 411014',
    pincode: '411014',
    coordinates: {
      type: 'Point',
      coordinates: [73.9143, 18.5679]
    },
    operatingHours: { open: '06:00', close: '23:00' },
    contactPhone: '+91 98765 12346',
    active: true
  },
  {
    name: 'Delhi Connaught Place Hub',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    address: 'Inner Circle, Connaught Place, New Delhi - 110001',
    pincode: '110001',
    coordinates: {
      type: 'Point',
      coordinates: [77.2167, 28.6328]
    },
    operatingHours: { open: '05:30', close: '23:30' },
    contactPhone: '+91 98765 12347',
    active: true
  },
  {
    name: 'Bengaluru Indiranagar Hub',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru - 560038',
    pincode: '560038',
    coordinates: {
      type: 'Point',
      coordinates: [77.6412, 12.9784]
    },
    operatingHours: { open: '06:00', close: '23:30' },
    contactPhone: '+91 98765 12348',
    active: true
  },
  {
    name: 'Hyderabad Hitec City Hub',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    address: 'Cyber Towers Road, Hitec City, Madhapur, Hyderabad - 500081',
    pincode: '500081',
    coordinates: {
      type: 'Point',
      coordinates: [78.3807, 17.4483]
    },
    operatingHours: { open: '06:00', close: '23:00' },
    contactPhone: '+91 98765 12349',
    active: true
  },
  {
    name: 'Goa Panaji Coastal Hub',
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    address: 'Dayanand Bandodkar Marg, Miramar, Panaji, Goa - 403001',
    pincode: '403001',
    coordinates: {
      type: 'Point',
      coordinates: [73.8180, 15.4868]
    },
    operatingHours: { open: '06:00', close: '23:59' },
    contactPhone: '+91 98765 12350',
    active: true
  }
];

export async function seedLocations() {
  await Location.deleteMany({});
  const created = await Location.insertMany(SEED_LOCATIONS);
  console.log(`📍 Seeded ${created.length} Indian Rental Hub Locations successfully.`);
  return created;
}
