const mongoose = require('mongoose');

/**
 * Wait for MongoDB to be ready before starting the server
 * This is a backup to docker-compose health checks
 */
const waitForMongo = async (maxRetries = 30, delay = 2000) => {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  for (let i = 0; i < maxRetries; i++) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ MongoDB connection established');
      return true;
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error('❌ Failed to connect to MongoDB after', maxRetries, 'attempts');
        console.error('Error:', error.message);
        process.exit(1);
      }
      console.log(`⏳ Waiting for MongoDB... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

module.exports = waitForMongo;
