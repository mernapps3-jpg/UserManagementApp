const { body } = require('express-validator');

const askValidator = [
  body('prompt').trim().notEmpty().withMessage('Prompt is required')
];

module.exports = { askValidator };