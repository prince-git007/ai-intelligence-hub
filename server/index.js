require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const webhookRoutes = require('./routes/webhook');
const leadsRoutes = require('./routes/leads');
const v1LeadsRoutes = require('./routes/v1/leads');
const repliesRoutes = require('./routes/replies');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (async, but don't block server start)
let dbConnected = false;
connectDB()
  .then(() => {
    dbConnected = true;
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    // In production, exit if DB connection fails
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS Configuration - Allow all localhost origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow all localhost origins
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow custom origins from env
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',') 
      : [];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/webhook', webhookRoutes);
app.use('/api/leads', leadsRoutes); // Legacy route
app.use('/api/v1/leads', v1LeadsRoutes); // New v1 route
app.use('/api/v1/leads', repliesRoutes); // Reply routes

// Health check route
app.get('/health', async (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  const health = {
    status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    service: 'AI Intelligence Hub API',
    database: dbStatus,
    uptime: process.uptime()
  };

  const statusCode = dbStatus === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
