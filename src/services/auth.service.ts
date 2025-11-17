import User from '../models/user.model';
import { HTTP_STATUS } from '../utils/constants';
import { CustomError, IUser, SignupData } from '../types/auth.type';
import tokenService from './token.service';
import { buildUserQuery } from '../utils/constants';

class AuthService {
    async findExistingUser({ email, username }: { email?: string; username?: string }): Promise<IUser | null> {
        const query: any [] = [];

        if (email) query.push({ email: email.toLowerCase() });
        if (username) query.push({ username: username.toLowerCase() });

        return await User.findOne({ $or: query });
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

    async getUser(key: any, selectFields?:string): Promise<any> {
        const select_default:string = '-__v';
        const select_query = selectFields ? `${select_default} ${selectFields}` : select_default;
        return await User.findOne(key).select(select_query);
    }

    async signup(signup_data: SignupData): Promise<any> {
        const { username, email } = signup_data;

        const existing_user = await this.findExistingUser({ email, username });
        
        this.validateUserUniqueness(existing_user, email, username);

        const new_user = await this.createUser(signup_data);

        const created_user = await this.getUser({ _id: new_user._id });

        if (!created_user) {
            throw new CustomError('User creation failed', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        return created_user;
    }

    async loginPassword(identifier: string, password: string): Promise<any> {

        const query = buildUserQuery(identifier);
        
        const user = await this.getUser(query, '+password');

        if (!user) {
            throw new CustomError('Invalid username or email or password', HTTP_STATUS.UNAUTHORIZED);
        }

        const is_password_valid = await user.comparePassword(password);

        if (!is_password_valid) {
            throw new CustomError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
        }

        const tokens = tokenService.generateTokens({
            email: user.email,
            username: user.username,
            role: user.role,
        });

        user.refreshToken = tokens.refreshToken;
        await user.save();

        return {
            email: user.email,
            username: user.username,
            role: user.role,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    async logout(email: string): Promise<void> {
        const user = await this.getUser({ email: email.toLowerCase() });

        user.refreshToken = undefined;
        await user.save();

        return;
    }
}

export default new AuthService();
