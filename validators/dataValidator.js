import { body } from 'express-validator';

export const dataValidator = [
    body('length')
        .isInt({ min: 1, max: 5 })
        .withMessage('length must be an integer between 1 and 5'),

    body('items')
        .isArray({ min: 1, max: 26 })
        .withMessage('items must be an array with 1 to 26 elements'),

    body('items.*')
        .isInt({ min: 1, max: 10 })
        .withMessage('each item must be an integer between 1 and 10'),
];
