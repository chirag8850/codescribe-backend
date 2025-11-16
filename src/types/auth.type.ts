import { HttpStatus } from "../utils/constants";

export interface IUser {
    username: string;
    name: string;
    email: string;
    isVerified: boolean;
    password: string;
    avatar: string | null;
    role: string;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
    otpSecret?: string;
}

export interface SignupData {
    username: string;
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface ApiResponse<T = any> {
    success?: {
        status_code: HttpStatus;
        message: string;
        data: T;
    };
    error?: {
        status_code: HttpStatus;
        message: string;
        data: T | null;
    };
}


export class CustomError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'CustomError';
    }
}
