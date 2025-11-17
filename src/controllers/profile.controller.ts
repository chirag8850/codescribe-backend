import { Request, Response } from 'express';
import { HTTP_STATUS, HttpStatus } from '../utils/constants';
import { sendSuccess, sendError } from '../utils/responseHandler';
import { AuthRequest } from '../middlewares/auth.middleware';
import profileService from '../services/profile.service';

export const getProfileController = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {

        const user = req.user;

        const data = await profileService.getProfile(user);

        return sendSuccess(res, 'Profile fetched successfully', HTTP_STATUS.OK, data);
    } catch (error) {
        return sendError(res, 'Server error while fetching profile', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }    
}


    