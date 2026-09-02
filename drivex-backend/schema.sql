-- ==============================================================================
-- DriveX Car & Bike Rental Platform - Complete Relational SQL Database Schema
-- Compatible with PostgreSQL, MySQL 8+, SQLite3 & standard SQL RDBMS
-- ==============================================================================

-- Drop tables if re-initializing
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS users;

-- ------------------------------------------------------------------------------
-- 1. USERS TABLE
-- Stores drivers, registered customers, fleet managers, and admins
-- ------------------------------------------------------------------------------
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'fleet_manager')),
    profile_image VARCHAR(255) DEFAULT '',
    driving_license_number VARCHAR(50) DEFAULT '',
    passport_number VARCHAR(50) DEFAULT '',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    phone_verified BOOLEAN NOT NULL DEFAULT TRUE,
    identity_verified BOOLEAN NOT NULL DEFAULT FALSE,
    driving_license_verified BOOLEAN NOT NULL DEFAULT FALSE,
    membership_tier VARCHAR(30) DEFAULT 'Gold Member',
    total_trips INT DEFAULT 0,
    kilometers_driven INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);


-- ------------------------------------------------------------------------------
-- 2. LOCATIONS TABLE (Pick-up & Drop-off Hubs across India)
-- ------------------------------------------------------------------------------
CREATE TABLE locations (
    id VARCHAR(64) PRIMARY KEY,
    city VARCHAR(60) NOT NULL,
    state VARCHAR(60) NOT NULL,
    hub_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    pincode VARCHAR(10) DEFAULT '',
    latitude DECIMAL(10, 8) DEFAULT 21.2121,
    longitude DECIMAL(11, 8) DEFAULT 81.3629,
    contact_phone VARCHAR(20) DEFAULT '+919876543210',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_locations_city ON locations(city);


-- ------------------------------------------------------------------------------
-- 3. VEHICLES TABLE (Cars, Bikes, Scooters & Commercial Fleet)
-- ------------------------------------------------------------------------------
CREATE TABLE vehicles (
    id VARCHAR(64) PRIMARY KEY,
    brand VARCHAR(60) NOT NULL,
    model VARCHAR(80) NOT NULL,
    variant VARCHAR(80) DEFAULT '',
    type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'scooter', 'ev')),
    category VARCHAR(40) NOT NULL,
    seating_capacity INT NOT NULL DEFAULT 5,
    fuel_type VARCHAR(30) NOT NULL,
    transmission VARCHAR(30) NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    refundable_deposit DECIMAL(10, 2) NOT NULL DEFAULT 5000.00,
    location_id VARCHAR(64) NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    city_name VARCHAR(60) NOT NULL,
    primary_image_url TEXT NOT NULL,
    video_3d_url TEXT DEFAULT '',
    rating DECIMAL(3, 2) DEFAULT 4.85,
    review_count INT DEFAULT 18,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    power_hp VARCHAR(30) DEFAULT '180 HP',
    acceleration_0_100 VARCHAR(30) DEFAULT '7.8s',
    top_speed_kmh VARCHAR(30) DEFAULT '210 km/h',
    mileage_kmpl VARCHAR(30) DEFAULT '16 km/l',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicles_type ON vehicles(type);
CREATE INDEX idx_vehicles_location ON vehicles(location_id);
CREATE INDEX idx_vehicles_category ON vehicles(category);
CREATE INDEX idx_vehicles_price ON vehicles(price_per_day);


-- ------------------------------------------------------------------------------
-- 4. BOOKINGS TABLE (Rental Transactions & Dispatch Life-Cycle)
-- ------------------------------------------------------------------------------
CREATE TABLE bookings (
    id VARCHAR(64) PRIMARY KEY,
    booking_number VARCHAR(40) NOT NULL UNIQUE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id VARCHAR(64) NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    pickup_location_id VARCHAR(64) NOT NULL REFERENCES locations(id),
    dropoff_location_id VARCHAR(64) NOT NULL REFERENCES locations(id),
    pickup_location_name VARCHAR(120) NOT NULL,
    dropoff_location_name VARCHAR(120) NOT NULL,
    pickup_datetime TIMESTAMP NOT NULL,
    dropoff_datetime TIMESTAMP NOT NULL,
    total_days INT NOT NULL DEFAULT 1,
    price_per_day DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    deposit_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled')),
    payment_method VARCHAR(50) DEFAULT 'Credit Card / UPI',
    payment_status VARCHAR(30) DEFAULT 'Paid' CHECK (payment_status IN ('Pending', 'Paid', 'Refunded', 'Failed')),
    driver_name VARCHAR(100) NOT NULL,
    driver_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_vehicle ON bookings(vehicle_id);
CREATE INDEX idx_bookings_status ON bookings(status);


-- ------------------------------------------------------------------------------
-- 5. PAYMENTS TABLE (Gateway Records, Invoices & Security Holds)
-- ------------------------------------------------------------------------------
CREATE TABLE payments (
    id VARCHAR(64) PRIMARY KEY,
    booking_id VARCHAR(64) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_ref VARCHAR(80) NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    payment_gateway VARCHAR(40) DEFAULT 'Razorpay',
    payment_method VARCHAR(40) DEFAULT 'UPI',
    status VARCHAR(30) NOT NULL DEFAULT 'Success' CHECK (status IN ('Initiated', 'Success', 'Failed', 'Refunded')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_booking ON payments(booking_id);


-- ------------------------------------------------------------------------------
-- 6. REVIEWS TABLE (Customer Ratings & Feedback)
-- ------------------------------------------------------------------------------
CREATE TABLE reviews (
    id VARCHAR(64) PRIMARY KEY,
    vehicle_id VARCHAR(64) NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_vehicle ON reviews(vehicle_id);


-- ------------------------------------------------------------------------------
-- 7. FAVORITES TABLE (Saved Vehicles per user)
-- ------------------------------------------------------------------------------
CREATE TABLE favorites (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id VARCHAR(64) NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_favorite UNIQUE (user_id, vehicle_id)
);


-- ==============================================================================
-- 🚀 INITIAL SEED DATA (Clients, Admins, Locations & Fleet)
-- ==============================================================================

-- 1. Insert Hub Locations
INSERT INTO locations (id, city, state, hub_name, address) VALUES
('loc-001', 'Bhilai', 'Chhattisgarh', 'Supela Hub', 'GE Road, Near Supela Clock Tower, Bhilai'),
('loc-002', 'Raipur', 'Chhattisgarh', 'Raipur Airport (RPR)', 'Swami Vivekananda Airport, VIP Road, Raipur'),
('loc-003', 'Delhi NCR', 'Delhi', 'Terminal 3 IGI Airport', 'T3 Arrival Gate 4, New Delhi'),
('loc-004', 'Bengaluru', 'Karnataka', 'Koramangala 5th Block', '100 Feet Road, Koramangala, Bengaluru');

-- 2. Insert Client Records with Email, Phone, Driving License & Passport
INSERT INTO users (id, first_name, last_name, email, phone, password_hash, role, profile_image, driving_license_number, passport_number, membership_tier, total_trips, kilometers_driven, identity_verified, driving_license_verified) VALUES
('usr-admin-primary', 'DriveX', 'MasterAdmin', 'admin123@gmail.com', '+919876500123', '$2a$10$e846ZtW9vO273xT7gG08/.W4tQfA7i.jDkQ18f9eFv0vH.08', 'admin', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80', 'DL-ADMIN-001', 'A1000001', 'Executive Admin', 120, 24000, TRUE, TRUE),
('usr-admin', 'DriveX', 'SuperAdmin', 'admin@drivex.in', '+919876543210', '$2a$10$e846ZtW9vO273xT7gG08/.W4tQfA7i.jDkQ18f9eFv0vH.08', 'admin', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80', 'DL-ADMIN-002', 'A1000002', 'Executive Admin', 99, 18500, TRUE, TRUE),
('usr-8891', 'Vikram', 'Malhotra', 'vikram.drivex@example.com', '+919876512340', '$2a$10$e846ZtW9vO273xT7gG08/.W4tQfA7i.jDkQ18f9eFv0vH.08', 'user', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80', 'DL-042019008921', 'Z3498210', 'Platinum Driver', 14, 3420, TRUE, TRUE),
('usr-8892', 'Ananya', 'Sen', 'ananya.sen@example.com', '+919812345678', '$2a$10$e846ZtW9vO273xT7gG08/.W4tQfA7i.jDkQ18f9eFv0vH.08', 'user', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', 'DL-072021004512', 'P9823411', 'Gold Member', 6, 1280, TRUE, TRUE),
('usr-8893', 'Rahul', 'Sharma', 'rahul.sharma@example.com', '+919723456789', '$2a$10$e846ZtW9vO273xT7gG08/.W4tQfA7i.jDkQ18f9eFv0vH.08', 'user', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 'DL-012018009843', 'V7612984', 'Diamond Member', 22, 6890, TRUE, TRUE),
('usr-8894', 'Priya', 'Nair', 'priya.nair@example.com', '+919934567890', '$2a$10$e846ZtW9vO273xT7gG08/.W4tQfA7i.jDkQ18f9eFv0vH.08', 'user', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 'DL-092022003189', 'T5543120', 'Gold Member', 4, 850, TRUE, TRUE),
('usr-8895', 'Rohan', 'Mehta', 'rohan.mehta@example.com', '+919845678901', '$2a$10$e846ZtW9vO273xT7gG08/.W4tQfA7i.jDkQ18f9eFv0vH.08', 'user', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', 'DL-032020007621', 'N8892145', 'Platinum Driver', 11, 2900, TRUE, TRUE);

-- 3. Insert Vehicles
INSERT INTO vehicles (id, brand, model, variant, type, category, seating_capacity, fuel_type, transmission, price_per_day, refundable_deposit, location_id, city_name, primary_image_url, video_3d_url, rating, is_featured) VALUES
('car-001', 'BMW', 'X5', 'xDrive40i', 'car', 'SUV', 5, 'Petrol', 'Automatic', 6500.00, 10000.00, 'loc-001', 'Bhilai', 'https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1000&q=80', '/videos/BMW_3_Series_LWB.mp4', 4.90, TRUE),
('car-002', 'Mercedes-Benz', 'C-Class', '300', 'car', 'Sedan', 5, 'Petrol', 'Automatic', 5200.00, 8000.00, 'loc-002', 'Raipur', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80', '/videos/Mercedes_Benz_C_Class_300.mp4', 4.85, TRUE),
('car-003', 'Mahindra', 'Thar ROXX', '4x4', 'car', 'SUV', 4, 'Diesel', 'Manual', 3800.00, 5000.00, 'loc-001', 'Bhilai', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80', '/videos/Mahindra_Thar_Roxx_OffRoad.mp4', 4.95, TRUE),
('bike-001', 'Royal Enfield', 'Classic 350', 'Reborn', 'bike', 'Cruiser', 2, 'Petrol', 'Manual', 1400.00, 3000.00, 'loc-001', 'Bhilai', 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80', '/videos/Royal_Enfield_Classic_350.mp4', 4.88, TRUE),
('bike-006', 'Ducati', 'Panigale V4', 'S', 'bike', 'Sports', 1, 'Petrol', 'Manual', 8500.00, 15000.00, 'loc-003', 'Delhi NCR', 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80', '/videos/Ducati_Panigale_V4.mp4', 4.98, TRUE);

-- 4. Insert Sample Bookings
INSERT INTO bookings (id, booking_number, user_id, vehicle_id, pickup_location_id, dropoff_location_id, pickup_location_name, dropoff_location_name, pickup_datetime, dropoff_datetime, total_days, price_per_day, subtotal, tax_amount, deposit_amount, total_amount, status, payment_method, payment_status, driver_name, driver_phone) VALUES
('DRV-84920', 'DX-2026-849200', 'usr-8891', 'car-001', 'loc-001', 'loc-001', 'Bhilai (Supela Hub)', 'Bhilai (Supela Hub)', '2026-08-25 10:00:00', '2026-08-28 10:00:00', 3, 6500.00, 19500.00, 3779.00, 10000.00, 24778.00, 'Confirmed', 'UPI (Google Pay)', 'Paid', 'Vikram Malhotra', '+919876512340'),
('DRV-84921', 'DX-2026-849201', 'usr-8893', 'car-002', 'loc-002', 'loc-002', 'Raipur (Airport)', 'Raipur (Airport)', '2026-08-29 09:00:00', '2026-08-31 18:00:00', 2, 5200.00, 10400.00, 1872.00, 8000.00, 20272.00, 'Active', 'Credit Card (Visa)', 'Paid', 'Rahul Sharma', '+919723456789');
