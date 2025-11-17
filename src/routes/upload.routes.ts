import express from 'express';
import { uploadController }  from '../controllers/file.controller';
import { upload, handleMulterError } from '../middlewares/multer.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/avatar', upload.single('file'), handleMulterError, uploadController);

router.post('/image', authenticateToken, upload.single('file'), handleMulterError, uploadController);

export default router;