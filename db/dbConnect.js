// backend/db/dbConnect.js
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env file.');
  process.exit(1); // Exit the process if URI is missing
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disables Mongoose's default buffering
      // useNewUrlParser: true, // Deprecated in Mongoose 6+
      // useUnifiedTopology: true, // Deprecated in Mongoose 6+
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((m) => {
        console.log('New MongoDB connection established');
        return m;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error; // Re-throw the error to be caught by the calling function
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null; // Clear promise on failure to retry
    throw e;
  }
}

module.exports = dbConnect;
