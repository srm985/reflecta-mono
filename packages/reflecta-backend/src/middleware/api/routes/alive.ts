import express from 'express';

const router = express.Router();

router.get('/alive', async (request, response) => response.send({
    alive: true
}).status(200));

export default router;
