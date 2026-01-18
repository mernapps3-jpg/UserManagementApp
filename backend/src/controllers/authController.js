const { registerUser, loginUser, sanitizeUser } = require('../services/authService');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const result = await registerUser({ name, email, password })
    res.status(201).json({ success: true, ...result })
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  // req.user is set by auth middleware.
  const safeUser = sanitizeUser(req.user);
  res.json({ success: true, user: safeUser });
}

module.exports = { register, login, me }

