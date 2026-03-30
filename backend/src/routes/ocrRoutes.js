import express from 'express';
const router = express.Router();
import upload from '../middlewares/uploadMiddleware.js';
import { handleOCR } from '../controllers/ocrController.js';

router.post('/', upload.single('image'), handleOCR);

export default router;