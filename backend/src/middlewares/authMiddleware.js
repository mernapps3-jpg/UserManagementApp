const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require("../models/User")

async function authenticate(req, res, next){
    try {
        const authHeader = req.headers.authorization;
        console.log(authHeader)
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
             return res.status(401).json({ success: false, message: 'Missing token' });
        }

        const token = authHeader.split(" ")[1]
        console.log(token)
        const decoded = jwt.verify(token, env.jwtSecret);
        console.log(decoded)

        const user = await User.findById(decoded.id).select("-password");
        console.log(user)

        if (!user) {
           return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}

function authorizeRole(role) {
    return (req, res, next) => {
        if(!req.user || req.user.role !== role) {
            return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
        }
        next();
    }
}


module.exports = { authenticate, authorizeRole }