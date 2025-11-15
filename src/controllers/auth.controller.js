import User from '../models/user.model.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import AuthService from '../services/auth.service.js';


const signupController = async (req, res) => {
    try {
        const { username, name, email, password, avatar } = req.body;
        
        const data = await AuthService.signup({ username, name, email, password, avatar });

        return sendSuccess( res, 'Account created successfully', data, HTTP_STATUS.CREATED);

    } catch (error) {
        return sendError( res, error.message || 'Server error during signup', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR );
    }
}

const profileController = async (req, res) => {
    try {
        const { username } = req.query;
        
        if (!username) {
            return sendError(
                res,
                'Username is required',
                HTTP_STATUS.BAD_REQUEST
            );
        }
        
        const user = await User.findOne({ username: username }).select('-password -refreshToken -_id');

        if (!user) {
            return sendError(
                res,
                'User not found',
                HTTP_STATUS.NOT_FOUND
            );
        }
        return sendSuccess(
            res,
            'User profile fetched successfully',
            user ,
            HTTP_STATUS.OK
        );
    } catch (error) {
        return sendError(
            res,
            error.message || 'Server error during fetching profile',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
}

const loginController = (req, res) => {
    try {
        const { email, password } = req.body;
        return sendSuccess(
            res,
            'Login successful',
            { email },
            HTTP_STATUS.OK
        );
    } catch (error) {
        return sendError(
            res,
            'Server error during login',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
}

const logoutController = (req, res) => {
    try {        
        return sendSuccess(
            res,
            'Logout successful',
            {},
            HTTP_STATUS.OK
        );
    } catch (error) {
        return sendError(
            res,
            'Server error during logout',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
}


export { loginController, logoutController, signupController, profileController };