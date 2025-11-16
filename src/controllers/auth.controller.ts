import { Request, Response } from 'express';
import User from '../models/user.model';
import { HTTP_STATUS, HttpStatus } from '../utils/constants';
import { sendSuccess, sendError } from '../utils/responseHandler';
import AuthService from '../services/auth.service';
import { CustomError, SignupData, LoginData } from '../types';


const signupController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, name, email, password, avatar } = req.body as SignupData;
        
        const data = await AuthService.signup({ username, name, email, password, avatar });

        return sendSuccess( res, 'Account created successfully', data, HTTP_STATUS.CREATED);

    } catch (error) {
        const err = error as CustomError;
        return sendError( res, err.message || 'Server error during signup', (err.statusCode as HttpStatus) || HTTP_STATUS.INTERNAL_SERVER_ERROR );
    }
}

const profileController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username } = req.query;
        
        if (!username || typeof username !== 'string') {
            return sendError( res, 'Username is required', HTTP_STATUS.BAD_REQUEST );
        }
        
        const user = await User.findOne({ username }).select('-password -refreshToken -_id');

        if (!user) {
            return sendError( res, 'User not found', HTTP_STATUS.NOT_FOUND );   
        }

        return sendSuccess( res, 'User profile fetched successfully', user , HTTP_STATUS.OK );  

    } catch (error) {
        const err = error as Error;
        return sendError( res, err.message || 'Server error during fetching profile', HTTP_STATUS.INTERNAL_SERVER_ERROR );
    }
}

const loginController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body as LoginData;
        return sendSuccess(
            res,
            'Login successful',
            { email },
            HTTP_STATUS.OK
        );
    } catch (error) {
        return sendError( res, 'Server error during login', HTTP_STATUS.INTERNAL_SERVER_ERROR );
    }
}

const logoutController = async (req: Request, res: Response): Promise<Response> => {
    try {        
        return sendSuccess( res, 'Logout successful', HTTP_STATUS.OK );

    } catch (error) {
        return sendError( res, 'Server error during logout', HTTP_STATUS.INTERNAL_SERVER_ERROR );
    }
}


export { loginController, logoutController, signupController, profileController };