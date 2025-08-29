// Test setup file
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI_TEST = 'mongodb://localhost:27017/task-manager-test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_EXPIRE = '1h';
process.env.JWT_COOKIE_EXPIRE = 1;
process.env.BCRYPT_ROUNDS = 1;

// Increase timeout for tests
jest.setTimeout(30000);
