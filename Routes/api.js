import express from 'express';
import GPTModelController from '../Controllers/GPTModelController.js';
import { datasetRequest } from '../Requests/DatasetValidation.js';

const router = express.Router();

/**
 * -------------------------------
 * POST --> DATASETS API ROUTE
 * -------------------------------
 */
router.post('/datasets', datasetRequest, GPTModelController.store);

/**
 * -------------------------------
 * GET --> RECOMMENDATIONS ROUTES
 * -------------------------------
 */
router.get('/recommendations', (req, res) => {
  
});

export default router;
