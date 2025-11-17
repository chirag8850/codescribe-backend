import express from 'express';
import { uploadController }  from '../controllers/file.controller';
import { upload, handleMulterError } from '../middlewares/multer.middleware';

const router = express.Router();

router.post('/image', upload.single('file'), handleMulterError, uploadController);

export default router;