const jwt = require("jsonwebtoken");
const env = require("../config/env");

function generateToken(userId) {
    return jwt.sign({ id: userId}, env.jwtSecret, { expiresIn: "2h" })
}

module.exports = generateToken;
