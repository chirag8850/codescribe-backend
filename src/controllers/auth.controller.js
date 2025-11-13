import User from '../models/user.model.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';


const signupController = async (req, res) => {
    try {
        const { username, name, email, password, avatar } = req.body;
        
        const user_exists = await User.findOne({
            $or: [{email: email.toLowerCase()}, {username: username.toLowerCase()}]
        })

        if (user_exists) {
            if (user_exists.email === email.toLowerCase()) {
                return sendError(
                    res,
                    'Email is already registered',
                    {},
                    HTTP_STATUS.BAD_REQUEST
                );
            }else if (user_exists.username === username.toLowerCase()) {
                return sendError(
                    res,
                    'Username is already taken',
                    {},
                    HTTP_STATUS.BAD_REQUEST
                );
            }
        }

        // create user
        const new_user = new User({
            username: username.toLowerCase(),
            name,
            email:  email.toLowerCase(),
            password,
            avatar: avatar || null,
        });

        await new_user.save();

        const created_user = await User.findById(new_user._id).select('-password -refreshToken -_id');

        if (!created_user) {
            return sendError(
                res,
                'User creation failed',
                {},
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }

        return sendSuccess(
            res,
            'Signup successful',
            { created_user },
            HTTP_STATUS.CREATED
        );


    } catch (error) {
        console.error('Signup Error:', error);
        return sendError(
            res,
            'Server error during signup',
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }
}

const profileController = async (req, res) => {
    try {
        const { username } = req.query;
        
        if (!username) {
            return sendError(
                res,
                'username required',
                {},
                HTTP_STATUS.BAD_REQUEST
            );
        }
        
        const user = await User.findOne({ username: username }).select('-password -refreshToken -_id');

        if (!user) {
            return sendError(
                res,
                'User not found',
                {},
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