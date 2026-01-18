const express = require('express');
const { getAllUsers, changeRole, removeUser } = require('../controllers/userController');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');
const { updateRoleValidator, userIdParamValidator } = require('../validators/userValidators');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.get('/', authenticate, authorizeRole('user'), getAllUsers);
router.patch('/:id/role', authenticate, authorizeRole('user'), updateRoleValidator, validateRequest, changeRole);
router.delete('/:id', authenticate, authorizeRole('user'), userIdParamValidator, validateRequest, removeUser);

module.exports = router;