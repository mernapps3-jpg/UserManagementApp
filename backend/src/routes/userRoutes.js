const express = require('express');
const { getAllUsers, changeRole, removeUser } = require('../controllers/userController');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');
const { updateRoleValidator, userIdParamValidator } = require('../validators/userValidators');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.get('/', authenticate, authorizeRole('admin'), getAllUsers);
router.patch('/:id/role', authenticate, authorizeRole('admin'), updateRoleValidator, validateRequest, changeRole);
router.delete('/:id', authenticate, authorizeRole('admin'), userIdParamValidator, validateRequest, removeUser);

module.exports = router;