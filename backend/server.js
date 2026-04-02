import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
app.use(cors());
app.use(express.json());

// --- AUTH (MOCK) ---
app.post('/api/login', (req, res) => {
    const { role } = req.body;
    db.get('SELECT * FROM users WHERE role = ? LIMIT 1', [role], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'User not found for role' });
        res.json(row);
    });
});

app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

// --- STORES ---
app.get('/api/stores', (req, res) => {
    db.all(`SELECT stores.*, users.name as owner_name, users.avatar_url as owner_avatar 
            FROM stores JOIN users ON stores.owner_id = users.id`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/stores/:ownerId', (req, res) => {
    const { ownerId } = req.params;
    db.get('SELECT * FROM stores WHERE owner_id = ? LIMIT 1', [ownerId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

// --- ORDERS ---
app.get('/api/orders', (req, res) => {
    const { customerId, ownerId } = req.query;
    let query = '';
    let params = [];

    if (customerId) {
        query = `SELECT orders.*, stores.name as store_name, delivery_agents.name as agent_name, delivery_agents.rating as agent_rating 
                 FROM orders 
                 JOIN stores ON orders.store_id = stores.id 
                 LEFT JOIN delivery_agents ON orders.delivery_agent_id = delivery_agents.id
                 WHERE orders.customer_id = ? ORDER BY orders.timestamp DESC`;
        params.push(customerId);
    } else if (ownerId) {
        query = `SELECT orders.*, users.name as customer_name, users.avatar_url as customer_avatar
                 FROM orders 
                 JOIN stores ON orders.store_id = stores.id 
                 JOIN users ON orders.customer_id = users.id
                 WHERE stores.owner_id = ? ORDER BY orders.timestamp DESC`;
        params.push(ownerId);
    } else {
        return res.status(400).json({ error: 'Missing customerId or ownerId' });
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- MESSAGES ---
app.get('/api/messages/:userId', (req, res) => {
    const { userId } = req.params;
    db.all(`SELECT messages.*, 
            sender.name as sender_name, sender.avatar_url as sender_avatar, sender.role as sender_role,
            receiver.name as receiver_name, receiver.avatar_url as receiver_avatar, receiver.role as receiver_role
            FROM messages 
            JOIN users as sender ON messages.sender_id = sender.id 
            JOIN users as receiver ON messages.receiver_id = receiver.id 
            WHERE sender_id = ? OR receiver_id = ? ORDER BY timestamp ASC`, [userId, userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/messages', (req, res) => {
    const { senderId, receiverId, content } = req.body;
    const timestamp = new Date().toISOString();
    db.run('INSERT INTO messages (sender_id, receiver_id, content, timestamp, status) VALUES (?, ?, ?, ?, ?)',
        [senderId, receiverId, content, timestamp, 'sent'], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID, timestamp });
        });
});

// --- FINANCIAL STATS ---
app.get('/api/stats/:ownerId', (req, res) => {
    const { ownerId } = req.params;
    db.get('SELECT id FROM stores WHERE owner_id = ? LIMIT 1', [ownerId], (err, store) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!store) return res.status(404).json({ error: 'Store not found' });

        db.all('SELECT * FROM financial_data WHERE store_id = ? ORDER BY date DESC LIMIT 7', [store.id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
