require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const webhookRoutes = require('./routes/webhook');
const leadsRoutes = require('./routes/leads');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/webhook', webhookRoutes);
app.use('/api/leads', leadsRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Intelligence Hub API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
