import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'drivex.db');
const schemaPath = path.join(__dirname, 'schema.sql');

console.log('🚀 Initializing DriveX Relational SQL Database...');
console.log(`📁 Database Path: ${dbPath}`);
console.log(`📄 Reading Schema: ${schemaPath}`);

try {
  // If database already exists, reset it for clean initialization
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('🧹 Old drivex.db file cleared.');
  }

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Execute schema DDL & seed queries
  db.exec(schemaSql);

  console.log('\n=======================================================');
  console.log('✅ DriveX SQL Database Created & Seeded Successfully!');
  console.log('=======================================================\n');

  // Verify created tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all();
  console.log('📊 Created SQL Tables:');
  tables.forEach((t, i) => console.log(`  ${i + 1}. ${t.name}`));

  // Verify user records
  const usersCount = db.prepare("SELECT COUNT(*) AS count FROM users;").get();
  const vehiclesCount = db.prepare("SELECT COUNT(*) AS count FROM vehicles;").get();
  console.log(`\n👥 Total Users Seeded: ${usersCount.count}`);
  console.log(`🚗 Total Vehicles Seeded: ${vehiclesCount.count}`);

  db.close();
} catch (error) {
  console.error('❌ Failed to create SQL Database:', error);
  process.exit(1);
}
