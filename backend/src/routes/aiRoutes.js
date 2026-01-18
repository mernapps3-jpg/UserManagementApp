const express = require("express");
const { ask } = require("../controllers/aiController")
const validateRequest = require("../middlewares/validateRequest");
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');
const { askValidator } = require("../validators/aiValidators")

const router = express.Router();

router.post("/ask", authenticate, authorizeRole('admin'), askValidator, validateRequest, ask);

module.exports = router;