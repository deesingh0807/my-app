import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
app.use(cors());
app.use(express.json());

// --- DASHBOARD RECORDS ---
app.get('/api/dashboard', (req, res) => {
    db.all('SELECT * FROM daily_records ORDER BY date ASC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/records', (req, res) => {
    const { date, totalCustomers, mealsPrepared, weatherCondition, eventFlag } = req.body;
    const mealsWasted = Math.max(0, mealsPrepared - totalCustomers);
    
    const stmt = db.prepare(`INSERT INTO daily_records (date, total_customers, meals_prepared, meals_wasted, weather_condition, event_flag)
                             VALUES (?, ?, ?, ?, ?, ?)
                             ON CONFLICT(date) DO UPDATE SET
                             total_customers=excluded.total_customers,
                             meals_prepared=excluded.meals_prepared,
                             meals_wasted=excluded.meals_wasted,
                             weather_condition=excluded.weather_condition,
                             event_flag=excluded.event_flag`);
                             
    stmt.run(date, totalCustomers, mealsPrepared, mealsWasted, weatherCondition, eventFlag ? 1 : 0, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: this.lastID });
    });
});

// --- SETTINGS (Financial Configuration) ---
app.get('/api/settings', (req, res) => {
    db.get('SELECT * FROM settings LIMIT 1', [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row || { cost_per_meal: 40, price_per_meal: 80, waste_threshold: 10 });
    });
});

app.put('/api/settings', (req, res) => {
    const { cost_per_meal, price_per_meal, waste_threshold } = req.body;
    db.run(`UPDATE settings SET cost_per_meal = ?, price_per_meal = ?, waste_threshold = ? WHERE id = 1`, 
        [cost_per_meal, price_per_meal, waste_threshold], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
});

// --- USER PROFILE ---
app.get('/api/user', (req, res) => {
    db.get('SELECT * FROM users LIMIT 1', [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

app.put('/api/user', (req, res) => {
    const { name, role, organization } = req.body;
    db.run(`UPDATE users SET name = ?, role = ?, organization = ? WHERE id = 1`, 
        [name, role, organization], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
});

// --- ALERTS ---
app.get('/api/alerts', (req, res) => {
    db.all('SELECT * FROM alerts ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- PROFIT SIMULATOR ---
app.post('/api/simulate', (req, res) => {
    const { predictedCustomers, mealsPrepared } = req.body;
    
    // Fetch current settings to perform calculation
    db.get('SELECT cost_per_meal, price_per_meal FROM settings LIMIT 1', [], (err, row) => {
        if (err || !row) return res.status(500).json({ error: "Missing settings" });
        
        const costPerMeal = row.cost_per_meal;
        const pricePerMeal = row.price_per_meal;

        let wasteCost = 0;
        let lostRevenue = 0;
        
        if (mealsPrepared > predictedCustomers) {
            wasteCost = (mealsPrepared - predictedCustomers) * costPerMeal;
        } else if (predictedCustomers > mealsPrepared) {
            lostRevenue = (predictedCustomers - mealsPrepared) * (pricePerMeal - costPerMeal);
        }

        const revenue = Math.min(predictedCustomers, mealsPrepared) * pricePerMeal;
        const totalCost = mealsPrepared * costPerMeal;
        const netProfit = revenue - totalCost;

        res.json({
            wasteCost,
            lostRevenue,
            netProfit,
            revenue,
            totalCost
        });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
