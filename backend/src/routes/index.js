import express from 'express';
const router = express.Router();



// Basic Health Check Route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is healthy and running',
    timestamp: new Date().toISOString()
  });
});

// Future routes will be mounted here:
import ocrRoutes from './ocrRoutes.js';
import verseRoutes from './verseRoutes.js';
router.use('/ocr', ocrRoutes);
router.use('/verse', verseRoutes);

export default router;
