import { Request, Response } from 'express';
import uploadService from '../services/upload.service';
import { sendSuccess, sendError } from '../utils/responseHandler';
import { HTTP_STATUS } from '../utils/constants';
import path from 'path';

const uploadController = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return sendError(res, 'No file uploaded', HTTP_STATUS.BAD_REQUEST);    
        }

        const file_name = path.parse(req.file.originalname).name;
        const unique_file_name = `${file_name}-${Date.now()}`;

        const url = await uploadService.uploadImage(
            req.file.buffer,
            unique_file_name
        )

        return sendSuccess(res, 'File uploaded successfully', HTTP_STATUS.OK, { url });

    } catch (error) {
        return sendError(res, (error as Error).message || 'Server error during file upload', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
};

export { uploadController };