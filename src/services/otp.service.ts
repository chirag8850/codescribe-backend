import User from '../models/user.model';
import { HTTP_STATUS } from '../utils/constants';
import { CustomError } from '../types/auth.type';
import AuthService from './auth.service';
import * as OTPAuth from "otpauth";

class OTPService {

    async generateOTP(params: string): Promise<any> {

        const is_email = params.includes('@');
        
        const is_user_exist = await AuthService.findExistingUser( is_email ? { email: params.toLowerCase() } : { username: params.toLowerCase() } );

        if (!is_user_exist) {
            throw new CustomError('User not found', HTTP_STATUS.NOT_FOUND);
        }

        const user = await AuthService.getUser( is_email ? { email: params.toLowerCase() } : { username: params.toLowerCase() } );

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

        const is_email = params.includes('@');

        const is_user_exist = await AuthService.findExistingUser( is_email ? { email: params.toLowerCase() } : { username: params.toLowerCase() } );

        if (!is_user_exist) {
            throw new CustomError('User not found', HTTP_STATUS.NOT_FOUND);
        }
        
        const user = await AuthService.getUser( is_email ? { email: params.toLowerCase() } : { username: params.toLowerCase() }, '+otpSecret');

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
