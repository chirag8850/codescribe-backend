import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../types/auth.type";
import { HTTP_STATUS, HttpStatus } from "../utils/constants";
import { sendError } from "../utils/responseHandler";

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new CustomError("Only image formats (jpg, jpeg, png, webp, svg) are allowed", HTTP_STATUS.BAD_REQUEST));
    }
};

export const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
});

export const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return sendError(res, 'File size exceeds 5MB limit', HTTP_STATUS.BAD_REQUEST);
        }
        return sendError(res, err.message, HTTP_STATUS.BAD_REQUEST);
    }
    
    if (err instanceof CustomError) {
        return sendError(res, err.message, err.statusCode as HttpStatus);
    }
    
    if (err) {
        return sendError(res, err.message || 'File upload error', HTTP_STATUS.BAD_REQUEST);
    }
    
    next();
};