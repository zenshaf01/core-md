import express from 'express';

const router = express.Router();

//Health Check Route
router.get('/', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

export default router;