import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'planeat_v2.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // 1. Daily Records Table
        db.run(`CREATE TABLE IF NOT EXISTS daily_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT UNIQUE,
            total_customers INTEGER,
            meals_prepared INTEGER,
            meals_wasted INTEGER,
            weather_condition TEXT,
            event_flag INTEGER
        )`);

        // 2. Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            role TEXT,
            organization TEXT
        )`);

        // 3. Settings Table
        db.run(`CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cost_per_meal REAL,
            price_per_meal REAL,
            waste_threshold INTEGER
        )`);

        // 4. Alerts Table
        db.run(`CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT,
            type TEXT,
            created_at TEXT,
            is_read INTEGER DEFAULT 0
        )`, () => {
            // Seed all tables after the last one is created
            seedData();
        });
    }
});

function seedData() {
    db.serialize(() => {
        // --- SEED USERS ---
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
            if (row.count === 0) {
                db.run(`INSERT INTO users (name, role, organization) VALUES ('Alex Canteen', 'Canteen Manager', 'TechCorp HQ Cafeteria')`);
            }
        });

        // --- SEED SETTINGS ---
        db.get('SELECT COUNT(*) as count FROM settings', (err, row) => {
            if (row.count === 0) {
                db.run(`INSERT INTO settings (cost_per_meal, price_per_meal, waste_threshold) VALUES (40.0, 80.0, 10)`);
            }
        });

        // --- SEED ALERTS ---
        db.get('SELECT COUNT(*) as count FROM alerts', (err, row) => {
            if (row.count === 0) {
                const today = new Date().toISOString().split('T')[0];
                db.run(`INSERT INTO alerts (message, type, created_at) VALUES ('System updated to Planeat Pro Version 2.0', 'info', ?)`, [today]);
                db.run(`INSERT INTO alerts (message, type, created_at) VALUES ('High waste detected 2 days ago (22 plates). Please adjust forecasting.', 'warning', ?)`, [today]);
            }
        });

        // --- SEED DAILY RECORDS ---
        db.get('SELECT COUNT(*) as count FROM daily_records', (err, row) => {
            if (row.count === 0) {
                console.log('Seeding daily records with mock data...');
                const stmt = db.prepare(`INSERT INTO daily_records (date, total_customers, meals_prepared, meals_wasted, weather_condition, event_flag) VALUES (?, ?, ?, ?, ?, ?)`);
                
                // Seed 21 days of data leading up to today for better charts
                const today = new Date();
                for (let i = 21; i > 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    
                    let customers = Math.floor(Math.random() * 40) + 130; 
                    let prepared = customers + Math.floor(Math.random() * 30);
                    
                    const weathers = ['Sunny', 'Cloudy', 'Rainy'];
                    const weather = weathers[Math.floor(Math.random() * weathers.length)];
                    if (weather === 'Rainy') {
                        customers = Math.floor(customers * 0.85);
                    }
                    
                    const hasEvent = Math.random() > 0.8;
                    if (hasEvent) {
                        customers = Math.floor(customers * 1.2);
                    }

                    const wasted = Math.max(0, prepared - customers);
                    
                    stmt.run(dateStr, customers, prepared, wasted, weather, hasEvent ? 1 : 0);
                }
                stmt.finalize();
            }
        });
    });
}

export default db;
