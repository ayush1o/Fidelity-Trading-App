const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const { pool, initializeDatabase } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== CORS CONFIG =====
const corsOptions = {
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// ===== HEALTH CHECK =====
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.status(200).json({ success: true, message: 'API running' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Database unavailable' });
  }
});

// ===== ROUTES =====
app.use('/api/auth', authRoutes);

// ===== STATIC FRONTEND =====
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// ===== 404 HANDLER =====
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ===== START SERVER =====
(async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize server:', error.message);
    process.exit(1);
  }
})();
