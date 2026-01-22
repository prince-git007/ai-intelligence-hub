const { body, validationResult } = require('express-validator');

/**
 * Validation rules for lead creation
 */
const validateLead = [
  body('source')
    .trim()
    .notEmpty()
    .withMessage('Source is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Source must be between 2 and 100 characters')
    .escape(),

  body('originalContent')
    .trim()
    .notEmpty()
    .withMessage('Original content is required')
    .isLength({ min: 5, max: 5000 })
    .withMessage('Original content must be between 5 and 5000 characters'),

  body('aiSummary')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('AI summary must not exceed 1000 characters')
    .escape(),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),

  body('status')
    .optional()
    .isIn(['New', 'Contacted'])
    .withMessage('Status must be New or Contacted'),

  // Custom validation for message field (alias for originalContent)
  body('message')
    .optional()
    .trim()
    .isLength({ min: 5, max: 5000 })
    .withMessage('Message must be between 5 and 5000 characters')
];

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

module.exports = {
  validateLead,
  handleValidationErrors
};
