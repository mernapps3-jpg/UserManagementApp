const { body, param } = require("express-validator");


const updateRoleValidator = [
    param("id").isMongoId().withMessage('Valid user id is required'),
    body('role').isIn(['admin', 'user']).withMessage('Role must be admin or user')
]

const userIdParamValidator = [
  param('id').isMongoId().withMessage('Valid user id is required')
];

module.exports = { updateRoleValidator, userIdParamValidator };
