export const cars = [
  // ==========================================
  // 🚗 CARS - LUXURY, SPORTS, SUVS & SEDANS
  // ==========================================
  {
    id: "car-001",
    name: "BMW X5 xDrive40i",
    brand: "BMW",
    type: "car",
    category: "SUV",
    pricePerDay: 6500,
    securityDeposit: 10000,
    location: "Bhilai",
    availableLocations: ["Bhilai", "Raipur", "Delhi", "Mumbai", "Bengaluru"],
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    doors: 5,
    rating: 4.9,
    reviewsCount: 84,
    isFeatured: true,
    available: true,
    image: "https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1000&q=80",
    video3D: "/videos/BMW_3_Series_LWB.mp4",
    heroVideo: "/videos/BMW_3_Series_LWB.mp4",
    description: "The BMW X5 delivers exceptional comfort, athletic dynamics, and commanding road presence. Equipped with a responsive TwinPower Turbo inline-6 engine and state-of-the-art panoramic iDrive cockpit.",
    features: [
      "TwinPower Turbo Engine",
      "Panoramic Sunroof",
      "360° Surround Camera",
      "Harman Kardon Audio",
      "Wireless Apple CarPlay & Android Auto",
      "Heated & Ventilated Leather Seats"
    ],
    specs: {
      power: "375 HP",
      acceleration: "0-100 in 5.3s",
      topSpeed: "250 km/h",
      mileage: "11.2 km/l",
      luggage: "650 Litres",
      drivetrain: "All-Wheel Drive (xDrive)"
    },
    colorOptions: [
      { name: "Obsidian Black", hex: "#0c0d10" },
      { name: "Alpine White", hex: "#f0f2f5" },
      { name: "Phytonic Blue", hex: "#123b7a" },
      { name: "Sunset Orange", hex: "#e05304" }
    ]
  },
  {
    id: "car-002",
    name: "Mercedes-Benz C-Class 300",
    brand: "Mercedes-Benz",
    type: "car",
    category: "Sedan",
    pricePerDay: 5200,
    securityDeposit: 8000,
    location: "Raipur",
    availableLocations: ["Raipur", "Bhilai", "Delhi", "Mumbai", "Bengaluru"],
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    doors: 4,
    rating: 4.8,
    reviewsCount: 112,
    isFeatured: true,
    available: true,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80",
    video3D: "/videos/Mercedes_Benz_C_Class_300.mp4",
    description: "Sophisticated styling meets supreme executive luxury. The Mercedes-Benz C-Class features MBUX infotainment, ambient lighting in 64 colors, and supreme suspension comfort.",
    features: [
      "MBUX Portrait Touchscreen",
      "64-Color Ambient Lighting",
      "Burmester 3D Surround Sound",
      "Driver Assistance Package",
      "Keyless Go & Hands-Free Boot",
      "Active Park Assist"
    ],
    specs: {
      power: "255 HP",
      acceleration: "0-100 in 5.9s",
      topSpeed: "245 km/h",
      mileage: "14.5 km/l",
      luggage: "455 Litres",
      drivetrain: "Rear-Wheel Drive"
    },
    colorOptions: [
      { name: "Obsidian Black", hex: "#0d0e12" },
      { name: "Polar White", hex: "#ffffff" },
      { name: "Selenite Grey", hex: "#4b5058" },
      { name: "Cavansite Blue", hex: "#0b2046" }
    ]
  },
  {
    id: "car-003",
    name: "Mahindra Thar ROXX 4x4",
    brand: "Mahindra",
    type: "car",
    category: "SUV",
    pricePerDay: 4800,
    securityDeposit: 10000,
    location: "Bhilai",
    availableLocations: ["Bhilai", "Raipur", "Durg", "Nagpur", "Goa"],
    transmission: "Automatic",
    fuelType: "Diesel",
    seats: 5,
    doors: 5,
    rating: 5.0,
    reviewsCount: 178,
    isFeatured: true,
    available: true,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80",
    video3D: "/videos/Mahindra_Thar_Roxx_OffRoad.mp4",
    heroVideo: "/videos/Mahindra_Thar_Roxx_OffRoad.mp4",
    description: "The brand new 5-Door Thar ROXX. Panoramic sunroof, Harman Kardon audio, Level 2 ADAS, and world-class 4XPLOR 4x4 terrain conquest capability.",
    features: [
      "Panoramic Skyroof",
      "4XPLOR 4x4 Terrain Modes",
      "Harman Kardon 9-Speaker Audio",
      "Ventilated Front Seats",
      "Level 2 ADAS Safety Suite",
      "10.25-inch Twin Digital Cockpit"
    ],
    specs: {
      power: "172 HP",
      acceleration: "0-100 in 10.2s",
      topSpeed: "170 km/h",
      mileage: "14.8 km/l",
      luggage: "644 Litres",
      drivetrain: "Four-Wheel Drive (4x4)"
    },
    colorOptions: [
      { name: "Stealth Black", hex: "#0a0a0c" },
      { name: "Deep Forest", hex: "#16281b" },
      { name: "Everest White", hex: "#f2f2f4" }
    ]
  },
  {
    id: "car-004",
    name: "Hyundai Creta SX (O) Turbo",
    brand: "Hyundai",
    type: "car",
    category: "SUV",
    pricePerDay: 3500,
    securityDeposit: 7000,
    location: "Bhilai",
    availableLocations: ["Bhilai", "Raipur", "Durg", "Nagpur", "Pune"],
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    doors: 5,
    rating: 4.9,
    reviewsCount: 220,
    isFeatured: true,
    available: true,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80",
    video3D: "/videos/Hyundai_Creta_rotating_360_degrees_202608201447.mp4",
    heroVideo: "/videos/Hyundai_Creta_rotating_360_degrees_202608201447.mp4",
    description: "India's undisputed favorite mid-size SUV. 160PS Turbo engine with lightning fast 7-speed DCT, dual 10.25-inch displays, and panoramic sunroof.",
    features: [
      "Voice-Enabled Panoramic Sunroof",
      "Bose 8-Speaker Premium Sound",
      "360° Surround View Camera",
      "Ventilated Front Seats",
      "Dual-Zone Auto Climate Control"
    ],
    specs: {
      power: "158 HP",
      acceleration: "0-100 in 8.9s",
      topSpeed: "190 km/h",
      mileage: "18.4 km/l",
      luggage: "433 Litres",
      drivetrain: "Front-Wheel Drive"
    },
    colorOptions: [
      { name: "Robust Emerald", hex: "#0f2f24" },
      { name: "Abyss Black", hex: "#0c0d10" },
      { name: "Atlas White", hex: "#ffffff" }
    ]
  },
  {
    id: "car-005",
    name: "Mahindra Scorpio-N Z8 L 4x4",
    brand: "Mahindra",
    type: "car",
    category: "SUV",
    pricePerDay: 4400,
    securityDeposit: 9000,
    location: "Raipur",
    availableLocations: ["Raipur", "Bhilai", "Durg", "Nagpur", "Mumbai"],
    transmission: "Automatic",
    fuelType: "Diesel",
    seats: 7,
    doors: 5,
    rating: 4.9,
    reviewsCount: 165,
    isFeatured: true,
    available: true,
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=80",
    video3D: "/videos/Mahindra_Scorpio_N.mp4",
    heroVideo: "/videos/Mahindra_Scorpio_N.mp4",
    description: "The Big Daddy of SUVs. Butch road presence, 400Nm torque, supreme 7-seater space, and cutting-edge 4XPLOR terrain mastery.",
    features: [
      "Sony 12-Speaker 3D Immersive Sound",
      "4XPLOR Intelligent Terrain Management",
      "Electric Sunroof",
      "Dual-Zone Auto AC",
      "Captain Seats Configuration"
    ],
    specs: {
      power: "172 HP",
      acceleration: "0-100 in 9.8s",
      topSpeed: "175 km/h",
      mileage: "14.0 km/l",
      luggage: "460 Litres",
      drivetrain: "Four-Wheel Drive (4x4)"
    },
    colorOptions: [
      { name: "Deep Forest", hex: "#152419" },
      { name: "Napoli Black", hex: "#090a0c" },
      { name: "Dazzling Silver", hex: "#c5c8cc" }
    ]
  },
  {
    id: "car-006",
    name: "Toyota Fortuner Legender 4x4",
    brand: "Toyota",
    type: "car",
    category: "SUV",
    pricePerDay: 7200,
    securityDeposit: 15000,
    location: "Delhi",
    availableLocations: ["Delhi", "Mumbai", "Raipur", "Bengaluru", "Goa"],
    transmission: "Automatic",
    fuelType: "Diesel",
    seats: 7,
    doors: 5,
    rating: 4.9,
    reviewsCount: 230,
    isFeatured: true,
    available: true,
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80",
    description: "The supreme symbol of power and bulletproof reliability on Indian roads. 500Nm massive torque and legendary VIP road presence.",
    features: [
      "500 Nm High-Output Diesel Engine",
      "11-Speaker JBL Premium Audio",
      "Sequential LED Headlamps",
      "Wireless Charger & Handsfree Boot",
      "Unbreakable Ladder Frame 4x4"
    ],
    specs: {
      power: "201 HP",
      acceleration: "0-100 in 9.6s",
      topSpeed: "185 km/h",
      mileage: "12.8 km/l",
      luggage: "500 Litres",
      drivetrain: "Four-Wheel Drive (4x4)"
    },
    colorOptions: [
      { name: "White Pearl & Black Roof", hex: "#f4f5f8" },
      { name: "Attitude Black", hex: "#0a0a0c" }
    ]
  },
  {
    id: "car-007",
    name: "Porsche 911 GT3 RS",
    brand: "Porsche",
    type: "car",
    category: "Sports",
    pricePerDay: 22500,
    securityDeposit: 50000,
    location: "Goa",
    availableLocations: ["Goa", "Mumbai", "Delhi", "Bengaluru"],
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 2,
    doors: 2,
    rating: 5.0,
    reviewsCount: 68,
    isFeatured: true,
    available: true,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
    video3D: "/videos/Porsche_911_GT3_RS_rotating.mp4",
    heroVideo: "/videos/Porsche_911_GT3_RS.mp4",
    description: "The timeless track-focused German supercar icon. 518 HP naturally aspirated 4.0L flat-six engine revving to 9,000 RPM with active DRS aerodynamics.",
    features: [
      "4.0L Naturally Aspirated Flat-Six (9000 RPM)",
      "Active Drag Reduction System (DRS)",
      "Carbon Fiber Front Splitter & Massive Rear Wing",
      "Porsche Active Suspension Management (PASM)",
      "Sport Chrono Package with Lap Trigger"
    ],
    specs: {
      power: "518 HP",
      acceleration: "0-100 in 3.2s",
      topSpeed: "296 km/h",
      mileage: "8.5 km/l",
      luggage: "132 Litres",
      drivetrain: "Rear-Wheel Drive (PDK)"
    },
    colorOptions: [
      { name: "Guards Red", hex: "#d11212" },
      { name: "Racing Yellow", hex: "#f0c808" },
      { name: "GT Silver", hex: "#b5b9bd" },
      { name: "Shark Blue", hex: "#0055ff" }
    ]
  },
  {
    id: "car-008",
    name: "Maruti Suzuki Swift ZXi+",
    brand: "Maruti Suzuki",
    type: "car",
    category: "Economy",
    pricePerDay: 1800,
    securityDeposit: 4000,
    location: "Bhilai",
    availableLocations: ["Bhilai", "Raipur", "Durg", "Nagpur"],
    transmission: "Manual",
    fuelType: "Petrol",
    seats: 5,
    doors: 5,
    rating: 4.7,
    reviewsCount: 142,
    isFeatured: false,
    available: true,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80",
    description: "The definitive peppy city hatchback. Agile handling, class-leading fuel economy, and effortless city navigation across Chhattisgarh.",
    features: [
      "SmartPlay Pro+ 9-inch Touchscreen",
      "Cruise Control",
      "Auto Climate Control",
      "Push Start/Stop",
      "Reverse Parking Camera"
    ],
    specs: {
      power: "89 HP",
      acceleration: "0-100 in 11.2s",
      topSpeed: "165 km/h",
      mileage: "22.4 km/l",
      luggage: "268 Litres",
      drivetrain: "Front-Wheel Drive"
    },
    colorOptions: [
      { name: "Sizzling Red", hex: "#b31b1b" },
      { name: "Pearl White", hex: "#f0f2f5" }
    ]
  },
  {
    id: "car-009",
    name: "Honda City ZX i-VTEC",
    brand: "Honda",
    type: "car",
    category: "Sedan",
    pricePerDay: 2900,
    securityDeposit: 6000,
    location: "Nagpur",
    availableLocations: ["Nagpur", "Raipur", "Mumbai", "Pune"],
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    doors: 4,
    rating: 4.9,
    reviewsCount: 128,
    isFeatured: false,
    available: true,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80",
    description: "The executive benchmark sedan in India. Supreme rear legroom, serene highway ride, and legendary i-VTEC performance.",
    features: [
      "Honda SENSING ADAS Suite",
      "Electric One-Touch Sunroof",
      "LaneWatch Camera",
      "Plush Leatherette Seats"
    ],
    specs: {
      power: "119 HP",
      acceleration: "0-100 in 10.1s",
      topSpeed: "195 km/h",
      mileage: "18.4 km/l",
      luggage: "506 Litres",
      drivetrain: "Front-Wheel Drive"
    },
    colorOptions: [
      { name: "Golden Brown", hex: "#443224" },
      { name: "Platinum White", hex: "#f7f7f7" }
    ]
  },
  {
    id: "car-010",
    name: "BMW 3 Series Gran Limousine LWB",
    brand: "BMW",
    type: "car",
    category: "Luxury",
    pricePerDay: 5800,
    securityDeposit: 10000,
    location: "Bengaluru",
    availableLocations: ["Bengaluru", "Mumbai", "Delhi", "Raipur", "Goa"],
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    doors: 4,
    rating: 4.9,
    reviewsCount: 76,
    isFeatured: true,
    available: true,
    image: "https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1000&q=80",
    video3D: "/videos/BMW_3_Series_LWB.mp4",
    description: "Unrivaled executive rear-seat luxury and dynamic TwinPower Turbo athleticism in an extended long-wheelbase stance with panoramic sunroof and curved iDrive display.",
    features: [
      "Extended Wheelbase 110mm Extra Legroom",
      "BMW Curved Display with iDrive 8.5",
      "Harman Kardon 16-Speaker Surround Sound",
      "Panoramic Glass Sunroof",
      "Comfort Seats with Vernasca Leather",
      "Reversing Assistant & 360 Parking"
    ],
    specs: {
      power: "258 HP",
      acceleration: "0-100 in 6.2s",
      topSpeed: "250 km/h",
      mileage: "15.3 km/l",
      luggage: "480 Litres",
      drivetrain: "Rear-Wheel Drive"
    },
    colorOptions: [
      { name: "Portimao Blue", hex: "#123b7a" },
      { name: "Mineral White", hex: "#f5f6f8" },
      { name: "Carbon Black", hex: "#0b0c0f" }
    ]
  },
  {
    id: "car-011",
    name: "BMW M4 Competition Blue Edition",
    brand: "BMW",
    type: "car",
    category: "Sports",
    pricePerDay: 14500,
    securityDeposit: 25000,
    location: "Mumbai",
    availableLocations: ["Mumbai", "Delhi", "Bengaluru", "Goa"],
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 4,
    doors: 2,
    rating: 5.0,
    reviewsCount: 94,
    isFeatured: true,
    available: true,
    image: "/images/BMW_M4_Competition_Blue_Edition.jfif",
    video3D: "/videos/BMW_M4_Competition_rotating_202608201410.mp4",
    heroVideo: "/videos/BMW_M4_Competition_rotating_202608201410.mp4",
    description: "The ultimate track weapon wrapped in Portimao Blue aerodynamics. 503 horsepower M TwinPower Turbo with explosive acceleration and surgical handling.",
    features: [
      "503 HP M TwinPower Turbo Inline-6",
      "M Carbon Bucket Seats",
      "M Ceramic Compound Brakes",
      "Adaptive M Suspension",
      "Carbon Fiber Roof & Quad Titanium Exhaust",
      "M Drift Analyser & 10-Stage Traction"
    ],
    specs: {
      power: "503 HP",
      acceleration: "0-100 in 3.8s",
      topSpeed: "290 km/h",
      mileage: "10.1 km/l",
      luggage: "440 Litres",
      drivetrain: "M xDrive All-Wheel Drive"
    },
    colorOptions: [
      { name: "Portimao Blue", hex: "#0055ff" },
      { name: "Isle of Man Green", hex: "#0c3b28" },
      { name: "Frozen Black", hex: "#090a0c" }
    ]
  },
  {
    id: "car-012",
    name: "Dodge Challenger SRT Hellcat",
    brand: "Dodge",
    type: "car",
    category: "Sports",
    pricePerDay: 16000,
    securityDeposit: 30000,
    location: "Delhi",
    availableLocations: ["Delhi", "Mumbai", "Goa", "Bengaluru"],
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 4,
    doors: 2,
    rating: 5.0,
    reviewsCount: 88,
    isFeatured: true,
    available: true,
    image: "/images/Dodge_SRT_Hellcat.jfif",
    video3D: "/videos/Dodge_Challenger_rotating_on_green_202608201411.mp4",
    heroVideo: "/videos/Dodge_Challenger_rotating_on_green_202608201411.mp4",
    description: "Unleash 717 supercharged American V8 horses. Iconic widebody stance, tire-shredding torque, and an earth-shattering supercharger whine.",
    features: [
      "6.2L Supercharged HEMI V8 (717 HP)",
      "Torqueflite 8-Speed High-Performance Auto",
      "Brembo 6-Piston High-Performance Brakes",
      "Line Lock & TorqueFlite Launch Control",
      "Widebody Competition Flare Package",
      "Harman Kardon 18-Speaker Premium Sound"
    ],
    specs: {
      power: "717 HP",
      acceleration: "0-100 in 3.6s",
      topSpeed: "327 km/h",
      mileage: "6.8 km/l",
      luggage: "459 Litres",
      drivetrain: "Rear-Wheel Drive"
    },
    colorOptions: [
      { name: "TorRed", hex: "#c71818" },
      { name: "Pitch Black", hex: "#0a0a0c" },
      { name: "Smoke Show Grey", hex: "#9da1a6" }
    ]
  },
  {
    id: "car-013",
    name: "Ford Mustang Shelby GT500",
    brand: "Ford",
    type: "car",
    category: "Sports",
    pricePerDay: 15000,
    securityDeposit: 28000,
    location: "Goa",
    availableLocations: ["Goa", "Mumbai", "Delhi", "Bengaluru"],
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 4,
    doors: 2,
    rating: 5.0,
    reviewsCount: 110,
    isFeatured: true,
    available: true,
    image: "/images/SHELBY_GT_500.jfif",
    fallbackImage: "/images/Ford_Mustang.jfif",
    video3D: "/videos/Ford_Mustang_rotating_on_green_202608201411.mp4",
    heroVideo: "/videos/Ford_Mustang_rotating_on_green_202608201411.mp4",
    description: "The pinnacle of American muscle racing heritage. Supercharged 5.2L Predator V8 engine delivering 760 horsepower, dual-clutch transmission, and active track aero.",
    features: [
      "5.2L Supercharged Cross-Plane V8 (760 HP)",
      "TREMEC 7-Speed Dual-Clutch Transmission",
      "MagneRide Active Damping System",
      "Track Apps with Launch Control & Line Lock",
      "Carbon Fiber Track Pack Wing & Splitter",
      "Active Valve Quad Exhaust Sound"
    ],
    specs: {
      power: "760 HP",
      acceleration: "0-100 in 3.5s",
      topSpeed: "290 km/h",
      mileage: "7.2 km/l",
      luggage: "382 Litres",
      drivetrain: "Rear-Wheel Drive"
    },
    colorOptions: [
      { name: "Grabber Blue", hex: "#0066cc" },
      { name: "Shadow Black", hex: "#08080a" },
      { name: "Race Red", hex: "#d91414" }
    ]
  },

  // ==========================================
  // 🏍️ BIKES & SUPERBIKES
  // ==========================================
  {
    id: "bike-001",
    name: "Royal Enfield Classic 350",
    brand: "Royal Enfield",
    type: "bike",
    category: "Cruiser",
    pricePerDay: 1100,
    securityDeposit: 2500,
    location: "Bhilai",
    availableLocations: ["Bhilai", "Raipur", "Durg", "Nagpur", "Goa"],
    transmission: "Manual",
    fuelType: "Petrol",
    seats: 2,
    doors: 0,
    rating: 4.9,
    reviewsCount: 310,
    isFeatured: true,
    available: true,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80",
    video3D: "/videos/Royal_Enfield_Classic_350.mp4",
    heroVideo: "/videos/Royal_Enfield_Classic_350.mp4",
    description: "The soul of Indian motorcycling. Iconic low-end thump, relaxed upright touring posture, and timeless British heritage.",
    features: [
      "J-Series Counterbalanced Engine",
      "Dual-Channel ABS",
      "Tripper Navigation Pod",
      "Classic Thump Exhaust Note",
      "Tubeless Alloy Wheels"
    ],
    specs: {
      power: "20.2 BHP",
      acceleration: "0-60 in 5.1s",
      topSpeed: "115 km/h",
      mileage: "36.2 km/l",
      luggage: "Saddlebag Ready",
      drivetrain: "Chain Drive"
    },
    colorOptions: [
      { name: "Stealth Black", hex: "#1c1c1f" },
      { name: "Halcyon Green", hex: "#18382b" }
    ]
  },
  {
    id: "bike-002",
    name: "Royal Enfield Himalayan 450",
    brand: "Royal Enfield",
    type: "bike",
    category: "Adventure",
    pricePerDay: 1700,
    securityDeposit: 4000,
    location: "Raipur",
    availableLocations: ["Raipur", "Bhilai", "Delhi", "Goa", "Bengaluru"],
    transmission: "Manual",
    fuelType: "Petrol",
    seats: 2,
    doors: 0,
    rating: 5.0,
    reviewsCount: 140,
    isFeatured: true,
    available: true,
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80",
    description: "Built in the Himalayas to go anywhere on earth. Liquid-cooled 40HP engine, 200mm Showa suspension clearance, and full Google Maps display.",
    features: [
      "Sherpa 450 Liquid-Cooled Engine",
      "Full-Map Google Navigation on TFT",
      "Long-Travel 200mm Suspension",
      "Switchable Rear ABS for Trails",
      "Ride-by-Wire with Eco/Performance"
    ],
    specs: {
      power: "40.0 BHP",
      acceleration: "0-100 in 6.4s",
      topSpeed: "152 km/h",
      mileage: "30.0 km/l",
      luggage: "Pannier Mounts",
      drivetrain: "Chain Drive"
    },
    colorOptions: [
      { name: "Hanle Black", hex: "#151515" },
      { name: "Kamet White", hex: "#eaeaea" }
    ]
  },
  {
    id: "bike-003",
    name: "KTM Duke 390",
    brand: "KTM",
    type: "bike",
    category: "Streetfighter",
    pricePerDay: 1900,
    securityDeposit: 5000,
    location: "Pune",
    availableLocations: ["Pune", "Mumbai", "Goa", "Bengaluru", "Delhi"],
    transmission: "Manual",
    fuelType: "Petrol",
    seats: 2,
    doors: 0,
    rating: 5.0,
    reviewsCount: 215,
    isFeatured: true,
    available: true,
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80",
    video3D: "/videos/KTM_Duke_390_rotating_202608201447.mp4",
    heroVideo: "/videos/KTM_Duke_390_rotating_202608201447.mp4",
    description: "The ultimate pocket rocket. 45 horsepower pure adrenaline, cornering ABS, bi-directional quickshifter, and aggressive Austrian stance.",
    features: [
      "Cornering ABS & Supermoto Mode",
      "Quickshifter+ (Bi-Directional)",
      "Launch Control with 5-inch TFT",
      "Adjustable WP APEX Suspension",
      "3 Riding Modes (Street/Rain/Track)"
    ],
    specs: {
      power: "45.3 BHP",
      acceleration: "0-100 in 5.4s",
      topSpeed: "170 km/h",
      mileage: "28.5 km/l",
      luggage: "Tail Bag Ready",
      drivetrain: "Chain Drive"
    },
    colorOptions: [
      { name: "Electronic Orange", hex: "#ff6600" },
      { name: "Atlantic Blue", hex: "#0a3d62" }
    ]
  },
  {
    id: "bike-004",
    name: "Yamaha MT-15 V2",
    brand: "Yamaha",
    type: "bike",
    category: "Streetfighter",
    pricePerDay: 950,
    securityDeposit: 2000,
    location: "Bhilai",
    availableLocations: ["Bhilai", "Raipur", "Durg", "Nagpur", "Pune"],
    transmission: "Manual",
    fuelType: "Petrol",
    seats: 2,
    doors: 0,
    rating: 4.8,
    reviewsCount: 175,
    isFeatured: false,
    available: true,
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1000&q=80",
    description: "Dark Side of Japan. Hyper-agile city streetfighter with MotoGP-derived Deltabox frame, inverted golden forks, and class-leading mileage.",
    features: [
      "Variable Valve Actuation (VVA)",
      "Inverted Front Golden USD Forks",
      "Traction Control System (TCS)",
      "Assist & Slipper Clutch"
    ],
    specs: {
      power: "18.4 BHP",
      acceleration: "0-100 in 11.5s",
      topSpeed: "130 km/h",
      mileage: "48.0 km/l",
      luggage: "Compact",
      drivetrain: "Chain Drive"
    },
    colorOptions: [
      { name: "Cyan Storm", hex: "#00d2d3" },
      { name: "Metallic Black", hex: "#111215" }
    ]
  },
  {
    id: "bike-006",
    name: "Ducati Panigale V4",
    brand: "Ducati",
    type: "bike",
    category: "Superbike",
    pricePerDay: 4900,
    securityDeposit: 12000,
    location: "Goa",
    availableLocations: ["Goa", "Mumbai", "Delhi", "Bengaluru", "Pune"],
    transmission: "Manual",
    fuelType: "Petrol",
    seats: 2,
    doors: 0,
    rating: 5.0,
    reviewsCount: 92,
    isFeatured: true,
    available: true,
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80",
    video3D: "/videos/Ducati_Panigale_V4.mp4",
    heroVideo: "/videos/Ducati_Panigale_V4.mp4",
    description: "Pure Italian track fury with 214 HP Desmosedici Stradale V4 engine, aerodynamic winglets, and cutting-edge MotoGP electronic controls.",
    features: [
      "Desmosedici Stradale 1,103cc V4 (214 HP)",
      "Ohlins Smart EC 2.0 Electronic Suspension",
      "Ducati Traction & Slide Control (DTC EVO 3)",
      "Aerodynamic Biplane Carbon Wings",
      "Ducati Power Launch (DPL) & Quickshifter",
      "Akrapovic Full Racing Exhaust"
    ],
    specs: {
      power: "214.3 BHP",
      acceleration: "0-100 in 3.1s",
      topSpeed: "299 km/h",
      mileage: "14.0 km/l",
      luggage: "Solo Seat Cowl",
      drivetrain: "Chain Drive"
    },
    colorOptions: [
      { name: "Ducati Red", hex: "#d00000" },
      { name: "Winter Test Black", hex: "#111215" }
    ]
  },
  {
    id: "bike-007",
    name: "Royal Enfield Continental GT 650",
    brand: "Royal Enfield",
    type: "bike",
    category: "Cruiser",
    pricePerDay: 1800,
    securityDeposit: 4000,
    location: "Bhilai",
    availableLocations: ["Bhilai", "Raipur", "Goa", "Mumbai", "Bengaluru"],
    transmission: "Manual",
    fuelType: "Petrol",
    seats: 2,
    doors: 0,
    rating: 4.9,
    reviewsCount: 145,
    isFeatured: true,
    available: true,
    image: "/images/Gt_650.jfif",
    description: "Quintessential British cafe racer styling with 648cc parallel-twin burble, clip-on handlebars, and sculpted fuel tank.",
    features: [
      "648cc Twin-Cylinder Engine",
      "Slip-and-Assist Clutch",
      "ByBre Twin-Disc ABS",
      "Twin Upswept Silencers",
      "Clip-On Sport Handlebars"
    ],
    specs: {
      power: "47.0 BHP",
      acceleration: "0-100 in 5.9s",
      topSpeed: "165 km/h",
      mileage: "25.0 km/l",
      luggage: "Cafe Tail Cowl",
      drivetrain: "Chain Drive"
    },
    colorOptions: [
      { name: "Mr Clean Chrome", hex: "#e0e4ea" },
      { name: "Rocker Red", hex: "#b81414" },
      { name: "Apex Grey", hex: "#4b5058" }
    ]
  },
  {
    id: "bike-008",
    name: "Harley-Davidson Fat Boy 114",
    brand: "Harley-Davidson",
    type: "bike",
    category: "Cruiser",
    pricePerDay: 4200,
    securityDeposit: 10000,
    location: "Bengaluru",
    availableLocations: ["Bengaluru", "Mumbai", "Delhi", "Goa", "Pune"],
    transmission: "Manual",
    fuelType: "Petrol",
    seats: 2,
    doors: 0,
    rating: 5.0,
    reviewsCount: 118,
    isFeatured: true,
    available: true,
    image: "/images/Harley_Davidson.jfif",
    video3D: "/videos/Harley_Davidson_motorcycle_rotating_202608201457.mp4",
    heroVideo: "/videos/Harley_Davidson_motorcycle_rotating_202608201457.mp4",
    description: "The original fat custom icon. Milwaukee-Eight 114 V-Twin thunder, massive 240mm rear tire, and brilliant satin chrome accents.",
    features: [
      "Milwaukee-Eight 114 V-Twin (1,868cc)",
      "155 Nm Mountain-Moving Torque",
      "Lakester Solid Cast Wheels",
      "Signature LED Headlight Nacelle",
      "High-Performance Rear Monoshock"
    ],
    specs: {
      power: "94.0 BHP",
      acceleration: "0-100 in 4.5s",
      topSpeed: "180 km/h",
      mileage: "18.0 km/l",
      luggage: "Saddlebag Ready",
      drivetrain: "Belt Drive"
    },
    colorOptions: [
      { name: "Vivid Black", hex: "#0c0d10" },
      { name: "Billiard Gray", hex: "#7a8288" },
      { name: "Red Rock", hex: "#8b2500" }
    ]
  },
  {
    id: "bike-009",
    name: "Kawasaki Ninja Z900",
    brand: "Kawasaki",
    type: "bike",
    category: "Streetfighter",
    pricePerDay: 3200,
    securityDeposit: 8000,
    location: "Pune",
    availableLocations: ["Pune", "Mumbai", "Delhi", "Bengaluru", "Goa"],
    transmission: "Manual",
    fuelType: "Petrol",
    seats: 2,
    doors: 0,
    rating: 4.9,
    reviewsCount: 160,
    isFeatured: true,
    available: true,
    image: "/images/Ninja_Z900.jfif",
    video3D: "/videos/Ninja_Z900.mp4",
    heroVideo: "/videos/Ninja_Z900.mp4",
    description: "Aggressive Sugomi design with a roaring 948cc in-line four-cylinder engine, color TFT display, and Kawasaki Traction Control (KTRC).",
    features: [
      "948cc In-Line 4 Engine (125 PS)",
      "4 Riding Modes (Sport/Road/Rain/Rider)",
      "Kawasaki Traction Control (KTRC)",
      "Bluetooth TFT Smartphone Connectivity",
      "Assist & Slipper Clutch",
      "Aggressive Quad Headlight Stance"
    ],
    specs: {
      power: "123.6 BHP",
      acceleration: "0-100 in 3.4s",
      topSpeed: "245 km/h",
      mileage: "18.5 km/l",
      luggage: "Tail Pack Ready",
      drivetrain: "Chain Drive"
    },
    colorOptions: [
      { name: "Metallic Spark Black / Lime Green", hex: "#32ff00" },
      { name: "Metallic Matte Graphensteel", hex: "#2e3138" }
    ]
  },
  {
    id: "bike-010",
    name: "KTM RC 200 GP Edition",
    brand: "KTM",
    type: "bike",
    category: "Streetfighter",
    pricePerDay: 1300,
    securityDeposit: 3000,
    location: "Raipur",
    availableLocations: ["Raipur", "Bhilai", "Durg", "Nagpur", "Pune"],
    transmission: "Manual",
    fuelType: "Petrol",
    seats: 2,
    doors: 0,
    rating: 4.8,
    reviewsCount: 135,
    isFeatured: false,
    available: true,
    image: "/images/RC200.jfif",
    video3D: "/videos/RC200.mp4",
    heroVideo: "/videos/RC200.mp4",
    description: "MotoGP-inspired supersport race ergonomics. Aerodynamic fairings, WP APEX suspension, Supermoto ABS, and high-revving 200cc performance.",
    features: [
      "MotoGP Aero Windscreen & Fairing",
      "Clip-on Racing Handlebars",
      "WP APEX 43mm Big Piston Forks",
      "Supermoto ABS Mode",
      "Ultra-Lightweight Trellis Chassis"
    ],
    specs: {
      power: "25.0 BHP",
      acceleration: "0-100 in 9.2s",
      topSpeed: "140 km/h",
      mileage: "35.0 km/l",
      luggage: "Race Tail",
      drivetrain: "Chain Drive"
    },
    colorOptions: [
      { name: "GP Orange & Black", hex: "#ff6600" },
      { name: "Dark Galvano White", hex: "#e6e6e6" }
    ]
  },

  // ==========================================
  // 🛵 SCOOTERS & ELECTRIC VEHICLES (EV)
  // ==========================================
  {
    id: "bike-005",
    name: "Honda Activa 6G H-Smart",
    brand: "Honda",
    type: "scooter",
    category: "Commuter",
    pricePerDay: 500,
    securityDeposit: 1500,
    location: "Bhilai",
    availableLocations: ["Bhilai", "Raipur", "Durg", "Nagpur", "Goa", "Pune"],
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 2,
    doors: 0,
    rating: 4.8,
    reviewsCount: 390,
    isFeatured: true,
    available: true,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80",
    description: "India's highest-selling family scooter. Effortless smooth ride, smart-key entry, whisper-quiet start, and massive 50 km/l fuel efficiency.",
    features: [
      "Smart Key Remote with Anti-Theft Lock",
      "eSP Silent ACG Starter",
      "Telescopic Front Suspension",
      "External Fuel Filling Lid"
    ],
    specs: {
      power: "7.7 BHP",
      acceleration: "0-60 in 9.2s",
      topSpeed: "85 km/h",
      mileage: "50.0 km/l",
      luggage: "18L Under-seat Storage",
      drivetrain: "Belt Drive (CVT)"
    },
    colorOptions: [
      { name: "Decent Blue", hex: "#16314f" },
      { name: "Pearl Siren Blue", hex: "#0e7090" }
    ]
  },
  {
    id: "ev-001",
    name: "Ola S1 Pro Gen 2",
    brand: "Ola Electric",
    type: "ev",
    category: "Electric",
    pricePerDay: 750,
    securityDeposit: 2000,
    location: "Bengaluru",
    availableLocations: ["Bengaluru", "Hyderabad", "Pune", "Mumbai", "Raipur"],
    transmission: "Automatic",
    fuelType: "Electric",
    seats: 2,
    doors: 0,
    rating: 4.9,
    reviewsCount: 165,
    isFeatured: true,
    available: true,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80",
    description: "High-tech EV scooter sensation. 180 km real-world range, explosive 2.6s acceleration in Hyper mode, onboard stereo speakers, and zero fuel expenses.",
    features: [
      "MoveOS 4 Touchscreen with GPS Maps",
      "Cruise Control & Party Mode Music",
      "Hyper Mode with 58Nm Instant Torque",
      "Reverse Mode for Easy Parking"
    ],
    specs: {
      power: "14.7 BHP",
      acceleration: "0-40 in 2.6s",
      topSpeed: "120 km/h",
      mileage: "180 km / charge",
      luggage: "34L Under-seat Storage",
      drivetrain: "Mid-Drive Motor"
    },
    colorOptions: [
      { name: "Stellar Blue", hex: "#1b4f72" },
      { name: "Midnight Black", hex: "#111215" }
    ]
  },
  {
    id: "ev-002",
    name: "Ather 450X Warp Plus",
    brand: "Ather",
    type: "ev",
    category: "Electric",
    pricePerDay: 700,
    securityDeposit: 2000,
    location: "Hyderabad",
    availableLocations: ["Hyderabad", "Bengaluru", "Pune", "Mumbai", "Raipur"],
    transmission: "Automatic",
    fuelType: "Electric",
    seats: 2,
    doors: 0,
    rating: 5.0,
    reviewsCount: 120,
    isFeatured: false,
    available: true,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80",
    description: "The precision engineering benchmark for electric two-wheelers. Aluminum chassis, AutoHold hill assist, and razor-sharp handling.",
    features: [
      "Ather Grid Fast-Charging (1.5 km/min)",
      "7-inch Snapdragon Touchscreen",
      "Google Maps On-Screen Navigation",
      "AutoHold Hill Assist (No roll-back)"
    ],
    specs: {
      power: "8.6 BHP",
      acceleration: "0-40 in 3.3s",
      topSpeed: "90 km/h",
      mileage: "150 km / charge",
      luggage: "22L Storage",
      drivetrain: "Belt-Driven PMS Motor"
    },
    colorOptions: [
      { name: "Space Grey", hex: "#2c3e50" },
      { name: "Cosmic Black", hex: "#0f1012" }
    ]
  }
];
