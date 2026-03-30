import express from 'express';
const router = express.Router();
import { detectVerseController, getVersesController } from '../controllers/verseController.js';

// Define exactly what the endpoints accept and return via controllers
router.post('/detect-verse', detectVerseController);
router.post('/get-verses', getVersesController);

export default router;
