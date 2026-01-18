const User = require("../models/User");
const { sanitizeUser } = require("../services/authService");


async function listUsers() {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return users.map((u) => sanitizeUser(u))
}

async function updateUserRole(userId, role, actingUserId) {
  if (userId === String(actingUserId)) {
    const error = new Error('Admins cannot change their own role here to avoid lockout.');
    error.status = 400;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  user.role = role;
  await user.save();
  return sanitizeUser(user);
}

async function deleteUser(userId, actingUserId) {
  if (userId === String(actingUserId)) {
    const error = new Error('You cannot delete your own admin account.');
    error.status = 400;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  await user.deleteOne();
  return userId;
}



module.exports = { listUsers, updateUserRole, deleteUser }