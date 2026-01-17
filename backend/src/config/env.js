const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(process.cwd(), ".env") })

// process

const env = {
    port: process.env.PORT || 5001,
    mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/user_management',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
    clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5174',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    chatGptApiKey: process.env.CHATGPT_API_KEY || '',
    chatGptModel: process.env.CHATGPT_MODEL || 'gpt-3.5-turbo'
};

function ensureEnv() {
    const usingDefaultSecret = env.jwtSecret === 'dev-secret-change-me'
    const usingLocalDb = env.mongoUri.includes('127.0.0.1') || env.mongoUri.includes('localhost');

    if (usingDefaultSecret && process.env.NODE_ENV === 'production') {
        throw new Error('Set JWT_SECRET to a strong value in production.');
    }

    if (usingLocalDb && process.env.NODE_ENV === 'production') {
        throw new Error('Set MONGO_URI to your production database connection string.');
    }
    if (!env.clientOrigin) {
        throw new Error('CLIENT_ORIGIN is required.');
    }

    if (usingDefaultSecret) {
        console.warn('Warning: using default JWT secret. Set JWT_SECRET in backend/.env.');
    }
}

module.exports = { ...env, ensureEnv }
