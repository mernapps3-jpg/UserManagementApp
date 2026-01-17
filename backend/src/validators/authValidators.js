const { body } = require("express-validator")

const registerValidator = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 characters long')
]


module.exports = { registerValidator }


// "         Shubham      " = "Shubham"