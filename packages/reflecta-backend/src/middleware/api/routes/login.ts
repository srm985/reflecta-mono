import express from 'express';

const router = express.Router();

router.post('/login', async (request, response) => response.send({
    alive: true
}).status(200));

export default router;
