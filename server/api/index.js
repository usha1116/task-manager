const mongoose = require('mongoose');
const app = require('../server');

// Vercel serverless handler
module.exports = async (req, res) => {
  // Custom handler for root path
  if (req.url === '/' || req.url === '') {
    return res.status(200).json({
      message: 'Welcome to the Task Manager API! Visit /api/health for status.'
    });
  }
  if (!mongoose.connection.readyState) {
    await mongoose.connect(
      process.env.NODE_ENV === 'test' ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  }
  return app(req, res);
};

// const { app, connectDB } = require("../server");

// let isConnected = false;

// module.exports = async (req, res) => {
//   if (!isConnected) {
//     try {
//       await connectDB();
//       isConnected = true;
//     } catch (err) {
//       console.error("MongoDB connection error:", err);
//       return res.status(500).json({ error: "Database connection failed" });
//     }
//   }
//   return app(req, res);
// };
