import { body, validationResult } from 'express-validator';

export const datasetRequest = [
    body('datasets').isArray().withMessage('Datasets required and Must be an Array'),
    (req, res, next) => {
        const errors = validationResult(req);

        return !errors.isEmpty()
            ? res.status(400).json({ errors: errors.array() })
            : next();
    },
];
