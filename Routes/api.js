const express = require('express');
const router = express.Router();
const authenticate = require('./Middleware/authenticate');

/**
 * -------------------------------
 * POST --> DATASETS API ROUTE
 * -------------------------------
 */
router.post('/datasets', authenticate, (req, res) => {
  
});

/**
 * -------------------------------
 * GET --> RECOMMENDATIONS ROUTES
 * -------------------------------
 */
router.get('/recommendations', authenticate, (req, res) => {
  
});

module.exports = router;
