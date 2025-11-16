import { HTTP_STATUS } from '../utils/constants';
import { CustomError } from '../types/auth.type';
import AuthService from './auth.service';
import * as OTPAuth from "otpauth";

class OTPService {

    private buildUserQuery(identifier: string): { email: string } | { username: string } {
        const isEmail = identifier.includes('@');
        return isEmail 
            ? { email: identifier.toLowerCase() } 
            : { username: identifier.toLowerCase() };
    }

    async generateOTP(params: string): Promise<any> {

        const query = this.buildUserQuery(params);
        
        const is_user_exist = await AuthService.findExistingUser(query);

        if (!is_user_exist) {
            throw new CustomError('User not found', HTTP_STATUS.NOT_FOUND);
        }

        const user = await AuthService.getUser(query);

        const secret = new OTPAuth.Secret().base32;
        
        const otp = new OTPAuth.TOTP({
            secret: OTPAuth.Secret.fromBase32(secret),
            digits: 6,
            period: 45, 
            algorithm: 'SHA1',
        })

        user.otpSecret = secret;
        await user.save();

        return { otp: otp.generate() };
    }

    async verifyOTP(params: string, user_otp: string): Promise<void> {

        const query = this.buildUserQuery(params);

        const is_user_exist = await AuthService.findExistingUser(query);

        if (!is_user_exist) {
            throw new CustomError('User not found', HTTP_STATUS.NOT_FOUND);
        }
        
        const user = await AuthService.getUser(query, '+otpSecret');

        if (!user.otpSecret) {
            throw new CustomError('OTP not generated for this user', HTTP_STATUS.BAD_REQUEST);
        }

        const otp = new OTPAuth.TOTP({
            secret: OTPAuth.Secret.fromBase32(user.otpSecret),
            digits: 6,
            period: 45, 
            algorithm: 'SHA1',
        });

        const delta = otp.validate({ token: user_otp, window: 1 });

        if (delta === null) {
            throw new CustomError('Invalid or expired OTP', HTTP_STATUS.BAD_REQUEST);
        }

        user.otpSecret = undefined;
        if (!user.isVerified)  user.isVerified = true;
        await user.save();

        return;
    }

}

export default new OTPService();
