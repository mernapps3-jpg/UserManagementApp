const { registerUser } = require("../services/authService")

async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;
        const result = await registerUser({ name, email, password })
        res.status(201).json({ success: true, ...result })
    } catch(error) {
        next(error);
    }
}

module.exports = { register }

