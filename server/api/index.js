const mongoose = require('mongoose');
const app = require('../server');

// Vercel serverless handler
module.exports = async (req, res) => {
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
