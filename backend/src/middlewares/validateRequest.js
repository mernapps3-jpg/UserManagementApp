const { validationResult } = require("express-validator");

function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        console.error('Request params:', req.params);
        console.error('Request body:', req.body);
        return res.status(400).json({
            success: false,
            message: errors.array()[0]?.msg || 'Validation failed',
            errors: errors.array()
        });
    }
    next();
}

module.exports = validateRequest;