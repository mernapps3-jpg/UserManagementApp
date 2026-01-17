const express = require('express');
const { register } = require("../controllers/authController")
const { registerValidator } = require('../validators/authValidators');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.post("/register", registerValidator, validateRequest, register);


module.exports = router;