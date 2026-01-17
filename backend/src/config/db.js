const mongoose = require("mongoose");
const env = require("./env")

async function connectDb() {
    try {
        const options = {
           serverSelectionTimeoutMS: 5000,
           socketTimeoutMS: 45000
        };

        await mongoose.connect(env.mongoUri, options);
        console.log('✅ Connected to MongoDB');

    } catch(error) {
        let errorMsg = error.message;

       if (error.message.includes('IP') || error.message.includes('whitelist')) {
         errorMsg = 'Could not connect to MongoDB Atlas. Your IP address may not be whitelisted.\n' +
        'Fix: Go to MongoDB Atlas → Network Access → Add IP Address\n' +
        'For development, you can temporarily allow all IPs (0.0.0.0/0) - not recommended for production.\n' +
        `Original error: ${error.message}`;
    }

    console.error('❌ Mongo connection error:', errorMsg);
    throw new Error(errorMsg);
}
}

module.exports = connectDb;