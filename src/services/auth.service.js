import User from '../models/user.model.js';
import { HTTP_STATUS } from '../utils/constants.js';

class AuthService {
    async findExistingUser(email, username) {
        return await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });
    }

    validateUserUniqueness(existing_user, email, username) {
        if (!existing_user) return;

        if (existing_user.email === email.toLowerCase()) {
            const error = new Error('Email is already registered');
            error.statusCode = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }

        if (existing_user.username === username.toLowerCase()) {
            const error = new Error('Username is already taken');
            error.statusCode = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }
    }

    async createUser(user_data) {
        const { username, name, email, password, avatar } = user_data;

        const new_user = new User({
            username: username.toLowerCase(),
            name,
            email: email.toLowerCase(),
            password,
            avatar: avatar || null,
        });

        await new_user.save();
        return new_user;
    }

    async getUser(key) {
        return await User.findOne(key).select('-password -refreshToken -_id');
    }

    async signup(signup_data) {
        const { username, email } = signup_data;

        const existing_user = await this.findExistingUser(email, username);
        
        this.validateUserUniqueness(existing_user, email, username);

        const new_user = await this.createUser(signup_data);

        const created_user = await this.getUser({ _id: new_user._id });

        if (!created_user) {
            const error = new Error('User creation failed');
            error.statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            throw error;
        }

        return created_user;
    }
}

export default new AuthService();
