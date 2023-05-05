import express from 'express';

import API from './api';

const middleware = express.Router();

// Append Headers
middleware.get('/*', (request, response, next) => {
    response.set('Content-Type', 'application/json');

    next();
});

middleware.use('/api', ...API);

export default middleware;
