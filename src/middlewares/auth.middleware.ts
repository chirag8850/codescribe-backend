import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseHandler';
import { HTTP_STATUS } from '../utils/constants';
import tokenService from '../services/token.service';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const auth_header = req.headers['authorization'];
        
        if (!auth_header || !auth_header.startsWith('Bearer ')) {
            return sendError(res, 'Access token is missing', HTTP_STATUS.UNAUTHORIZED);
        }

        const token = auth_header && auth_header.split(' ')[1];

        const decoded_data = tokenService.verifyAccessToken(token);

        req.user = decoded_data;
        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return sendError(res, 'Invalid access token', HTTP_STATUS.UNAUTHORIZED);
        }

        if (error instanceof jwt.TokenExpiredError) {
            return sendError(res, 'Access token has expired', HTTP_STATUS.FORBIDDEN);
        }

        return sendError(res, 'Server error during token authentication', HTTP_STATUS.INTERNAL_SERVER_ERROR);

    }
};
;