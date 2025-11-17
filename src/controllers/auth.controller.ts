import { Request, Response } from 'express';
import User from '../models/user.model';
import { HTTP_STATUS, HttpStatus } from '../utils/constants';
import { sendSuccess, sendError } from '../utils/responseHandler';
import AuthService from '../services/auth.service';
import { CustomError, SignupData, LoginData } from '../types/auth.type';
import OTPService from '../services/otp.service';

const signupController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, name, email, password, avatar } = req.body as SignupData;

        if (!username || !name || !email || !password) {
            return sendError( res, 'All required fields must be provided', HTTP_STATUS.BAD_REQUEST );
        }
        
        const data = await AuthService.signup({ username, name, email, password, avatar });

        return sendSuccess( res, 'Account created successfully', HTTP_STATUS.CREATED, data);

    } catch (error) {
        const err = error as CustomError;
        return sendError( res, err.message || 'Server error during signup', (err.statusCode as HttpStatus) || HTTP_STATUS.INTERNAL_SERVER_ERROR );
    }
}

const generateOTPController = async (req: Request, res: Response): Promise<Response> => {
    try {
        
        const { identifier } = req.body as { identifier: string; };

        const data = await OTPService.generateOTP(identifier);

        return sendSuccess( res, 'OTP generated successfully', HTTP_STATUS.OK, data );

    } catch (error) {
        const err = error as Error;
        return sendError( res, err.message || 'Server error during OTP generation', HTTP_STATUS.INTERNAL_SERVER_ERROR );
    }
}

const verifyOTPController = async (req: Request, res: Response): Promise<Response> => {
    try {

        const { identifier, otp: user_otp } = req.body as { identifier: string; otp: string; };
        
        await OTPService.verifyOTP(identifier, user_otp);
        
        return sendSuccess( res, 'OTP verified successfully', HTTP_STATUS.OK );

    } catch (error) {
        const err = error as Error;
        return sendError( res, err.message || 'Server error during OTP verification', HTTP_STATUS.INTERNAL_SERVER_ERROR );
    }
}

const loginPasswordController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { identifier , password } = req.body as LoginData;

        if (!identifier || !password) {
            return sendError( res, 'identifier and password is required', HTTP_STATUS.BAD_REQUEST );
        }

        const data = await AuthService.loginPassword(identifier, password );

        return sendSuccess( res, 'Login successful', HTTP_STATUS.OK, data );

    } catch (error) {
        const err = error as CustomError;
        return sendError( res, err.message || 'Server error during login', (err.statusCode as HttpStatus) || HTTP_STATUS.INTERNAL_SERVER_ERROR );
    }
}

const loginOTPController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { identifier, otp } = req.body as { identifier: string; otp: string; };
        if (!identifier || !otp) {
            return sendError( res, 'identifier and otp is required', HTTP_STATUS.BAD_REQUEST );
        }

        const data = await AuthService.loginOTP(identifier, otp);

        return sendSuccess( res, 'Login successful', HTTP_STATUS.OK, data );

    } catch (error) {
        const err = error as CustomError;
        return sendError( res, err.message || 'Server error during login', (err.statusCode as HttpStatus) || HTTP_STATUS.INTERNAL_SERVER_ERROR );
    }
}

const logoutController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email } = req.body as { email: string; };

        await AuthService.logout(email);
                
        return sendSuccess( res, 'Logout successful', HTTP_STATUS.OK );
    } catch (error) {
        return sendError( res, 'Server error during logout', HTTP_STATUS.INTERNAL_SERVER_ERROR );
    }
}


export { 
    loginPasswordController, logoutController, signupController, 
    generateOTPController, verifyOTPController, loginOTPController
};