import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'planeat_v4.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the new Planeat SQLite database v4.');
        
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            role TEXT,
            avatar_url TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS stores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            owner_id INTEGER,
            name TEXT,
            category TEXT,
            crowd_level TEXT,
            discount TEXT,
            event TEXT,
            highlights TEXT,
            FOREIGN KEY(owner_id) REFERENCES users(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER,
            store_id INTEGER,
            items TEXT,
            total REAL,
            status TEXT,
            delivery_agent_id INTEGER,
            timestamp TEXT,
            FOREIGN KEY(customer_id) REFERENCES users(id),
            FOREIGN KEY(store_id) REFERENCES stores(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER,
            receiver_id INTEGER,
            content TEXT,
            timestamp TEXT,
            status TEXT,
            FOREIGN KEY(sender_id) REFERENCES users(id),
            FOREIGN KEY(receiver_id) REFERENCES users(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS delivery_agents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            rating REAL,
            reviews INTEGER,
            bio TEXT,
            phone TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS financial_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            store_id INTEGER,
            date TEXT,
            profit REAL,
            waste_saved INTEGER,
            plates_saved INTEGER,
            revenue REAL,
            cost REAL,
            FOREIGN KEY(store_id) REFERENCES stores(id)
        )`, () => {
            seedData();
        });
    }
});

function seedData() {
    db.serialize(() => {
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
            if (row.count === 0) {
                console.log('Seeding extended data...');
                
                // Users (Customers)
                db.run(`INSERT INTO users (id, name, role, avatar_url) VALUES (1, 'Alex User', 'customer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex')`);
                db.run(`INSERT INTO users (id, name, role, avatar_url) VALUES (3, 'Sarah Smith', 'customer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah')`);
                db.run(`INSERT INTO users (id, name, role, avatar_url) VALUES (4, 'John Doe', 'customer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=John')`);
                
                // Users (Owners)
                db.run(`INSERT INTO users (id, name, role, avatar_url) VALUES (2, 'Bob Owner', 'owner', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob')`);
                db.run(`INSERT INTO users (id, name, role, avatar_url) VALUES (5, 'Maria Canteen', 'owner', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria')`);

                // Delivery Agents
                db.run(`INSERT INTO delivery_agents (id, name, rating, reviews, bio, phone) VALUES (1, 'Swift Sam', 4.9, 124, 'Fast and safe.', '555-0101')`);
                db.run(`INSERT INTO delivery_agents (id, name, rating, reviews, bio, phone) VALUES (2, 'Flash Fiona', 4.7, 89, 'Always on time.', '555-0102')`);
                db.run(`INSERT INTO delivery_agents (id, name, rating, reviews, bio, phone) VALUES (3, 'Quick Pete', 4.8, 201, 'Reliable delivery.', '555-0103')`);

                // Stores
                db.run(`INSERT INTO stores (id, owner_id, name, category, crowd_level, discount, event, highlights) VALUES (1, 2, 'Bob''s Canteen', 'Healthy Food', 'High', '20% off at closing', 'Taco Tuesday', 'Vegan Wraps, Protein Bowls')`);
                db.run(`INSERT INTO stores (id, owner_id, name, category, crowd_level, discount, event, highlights) VALUES (2, 2, 'Spicy Corner', 'Indian', 'Medium', 'Free Chai with meals', '', 'Curry, Samosas')`);
                db.run(`INSERT INTO stores (id, owner_id, name, category, crowd_level, discount, event, highlights) VALUES (3, 5, 'Maria''s Bakery', 'Bakery & Cafe', 'Low', 'Buy 1 Get 1 Croissant', 'Morning Rush', 'Fresh Bread, Coffee')`);
                db.run(`INSERT INTO stores (id, owner_id, name, category, crowd_level, discount, event, highlights) VALUES (4, 5, 'Campus Grill', 'Fast Food', 'High', 'Student Combo ₹150', 'Exam Week Special', 'Burgers, Fries')`);

                const todayObj = new Date();
                const today = todayObj.toISOString();
                const yesterday = new Date(todayObj.getTime() - 86400000).toISOString();
                const twoDaysAgo = new Date(todayObj.getTime() - 86400000 * 2).toISOString();
                
                // Helper to stagger time slightly
                const timeStr = (base, minsToAdd) => new Date(new Date(base).getTime() + minsToAdd * 60000).toISOString();

                // Orders
                db.run(`INSERT INTO orders (customer_id, store_id, items, total, status, delivery_agent_id, timestamp) VALUES (1, 1, 'Vegan Wrap, Green Tea', 250.00, 'Dropping', 1, '${today}')`);
                db.run(`INSERT INTO orders (customer_id, store_id, items, total, status, delivery_agent_id, timestamp) VALUES (1, 3, '2x Chocolate Croissant, Latte', 320.00, 'Delivered', 2, '${yesterday}')`);
                db.run(`INSERT INTO orders (customer_id, store_id, items, total, status, delivery_agent_id, timestamp) VALUES (3, 1, 'Protein Bowl', 180.00, 'Picking Up', 3, '${today}')`);
                db.run(`INSERT INTO orders (customer_id, store_id, items, total, status, delivery_agent_id, timestamp) VALUES (4, 4, 'Classic Burger Combo', 150.00, 'Delivered', 1, '${twoDaysAgo}')`);
                db.run(`INSERT INTO orders (customer_id, store_id, items, total, status, delivery_agent_id, timestamp) VALUES (1, 2, 'Chicken Tikka, Naan', 350.00, 'Delivered', 2, '${twoDaysAgo}')`);

                // Messages (staggered sequentially)
                db.run(`INSERT INTO messages (sender_id, receiver_id, content, timestamp, status) VALUES (1, 2, 'Is my order on the way?', '${timeStr(today, 0)}', 'seen')`);
                db.run(`INSERT INTO messages (sender_id, receiver_id, content, timestamp, status) VALUES (2, 1, 'Yes, the agent just picked it up!', '${timeStr(today, 5)}', 'sent')`);
                
                db.run(`INSERT INTO messages (sender_id, receiver_id, content, timestamp, status) VALUES (3, 2, 'Do you still have vegan wraps?', '${timeStr(yesterday, 0)}', 'seen')`);
                db.run(`INSERT INTO messages (sender_id, receiver_id, content, timestamp, status) VALUES (2, 3, 'Yes! We have exactly 4 left.', '${timeStr(yesterday, 10)}', 'seen')`);
                
                db.run(`INSERT INTO messages (sender_id, receiver_id, content, timestamp, status) VALUES (4, 5, 'The burger combo was great!', '${timeStr(twoDaysAgo, 0)}', 'seen')`);

                // Financial Data for Store 1 (Bob's Canteen) - Simulate 30 days
                const stmt = db.prepare(`INSERT INTO financial_data (store_id, date, profit, waste_saved, plates_saved, revenue, cost) VALUES (?, ?, ?, ?, ?, ?, ?)`);
                let baseProfit = 2400; // Rs
                for (let i = 30; i >= 0; i--) {
                    const d = new Date(todayObj.getTime() - (86400000 * i));
                    
                    // Modulate randomly
                    const profit = baseProfit + (Math.random() * 500 - 150);
                    const wasteSaved = 15 + Math.floor(Math.random() * 20); // 15% to 35%
                    const platesSaved = 20 + Math.floor(Math.random() * 30);
                    const revenue = profit + 1200;
                    const cost = 1200;

                    stmt.run(1, d.toISOString(), profit, wasteSaved, platesSaved, revenue, cost);
                }
                stmt.finalize();
            }
        });
    });
}

export default db;
