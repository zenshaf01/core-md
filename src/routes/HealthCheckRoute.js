import express from 'express';

const router = express.Router();

/**
* @swagger
* /health-check:
*   get:
*     summary: Health check endpoint
*     description: Returns a simple message to check if the server is running
*     responses:
*       200:
*         description: Server is running
*/
router.get('/', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

export default router;