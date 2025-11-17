import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../utils/constants';
import { CustomError } from '../types/auth.type';

interface TokenPayload {
    email: string;
    username: string;
    role: string;
}

class TokenService {

    generateAccessToken(payload: TokenPayload): string {
        const secret = process.env.JWT_ACCESS_SECRET;
        
        if (!secret) {
            throw new CustomError('JWT_ACCESS_SECRET is not defined', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        return jwt.sign(payload, secret, {
            expiresIn: '1d',
        });
    }

    generateRefreshToken(payload: TokenPayload): string {
        const secret = process.env.JWT_REFRESH_SECRET;
        
        if (!secret) {
            throw new CustomError('JWT_REFRESH_SECRET is not defined', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        return jwt.sign(payload, secret, {
            expiresIn: '7d',
        });
    }

    generateTokens(payload: TokenPayload): { accessToken: string; refreshToken: string } {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }

    verifyRefreshToken(token: string): TokenPayload {
        const secret = process.env.JWT_REFRESH_SECRET;
        
        if (!secret) {
            throw new CustomError('JWT_REFRESH_SECRET is not defined', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        const decoded = jwt.verify(token, secret) as TokenPayload;
        return decoded;
    }

    verifyAccessToken(token: string): TokenPayload {
        const secret = process.env.JWT_ACCESS_SECRET;
        
        if (!secret) {
            throw new CustomError('JWT_ACCESS_SECRET is not defined', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }

        const decoded = jwt.verify(token, secret) as TokenPayload;
        return decoded;
    }

}

export default new TokenService();
