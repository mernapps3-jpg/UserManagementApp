const { listUsers, updateUserRole } = require('../services/userService');

async function getAllUsers(req, res, next) {
    try {
        const users = await listUsers();
        res.json({ success: true, users });
    } catch (error) {
        next(error);
    }
}

async function changeRole(req, res, next) {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const actingUserId = req.user._id || req.user.id;
        console.log('Change role request:', {
            targetUserId: id,
            newRole: role,
            actingUserId: String(actingUserId),
            actingUserRole: req.user.role
        });

        const user = await updateUserRole(id, role, actingUserId);
        res.json({ success: true, user });
    } catch (error) {
        console.error('Change role error:', error.message, error.status);
        next(error);
    }
}

async function removeUser(req, res, next) {
  try {
    const { id } = req.params;
    const actingUserId = req.user._id || req.user.id;
    await deleteUser(id, actingUserId);
    res.json({ success: true, deletedId: id });
  } catch (error) {
    next(error);
  }
}




module.exports = { getAllUsers, changeRole, removeUser }