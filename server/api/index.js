const mongoose = require('mongoose');
const app = require('./../server');

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
