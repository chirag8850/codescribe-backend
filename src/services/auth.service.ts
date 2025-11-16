import User from '../models/user.model';
import { HTTP_STATUS } from '../utils/constants';
import { CustomError, IUser, SignupData } from '../types/auth.type';

class AuthService {
    async findExistingUser(email: string, username: string): Promise<IUser | null> {
        return await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });
    }

    validateUserUniqueness(existing_user: IUser | null, email: string, username: string): void {
        if (!existing_user) return;

        if (existing_user.email === email.toLowerCase()) {
            throw new CustomError('Email is already registered', HTTP_STATUS.BAD_REQUEST);
        }

        if (existing_user.username === username.toLowerCase()) {
            throw new CustomError('Username is already taken', HTTP_STATUS.BAD_REQUEST);
        }
    }

    async createUser(user_data: SignupData): Promise<any> {
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

    async getUser(key: any): Promise<any> {
        return await User.findOne(key).select('-password -refreshToken -_id');
    }

    async signup(signup_data: SignupData): Promise<any> {
        const { username, email } = signup_data;

        const existing_user = await this.findExistingUser(email, username);
        
        this.validateUserUniqueness(existing_user, email, username);

        const new_user = await this.createUser(signup_data);

        const created_user = await this.getUser({ _id: new_user._id });

        if (!created_user) {
            throw new CustomError('User creation failed', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        return created_user;
    }
}

export default new AuthService();
