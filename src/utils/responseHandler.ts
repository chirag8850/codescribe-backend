import { Response } from 'express';
import { HTTP_STATUS, HttpStatus } from "./constants";
import { ApiResponse } from '../types/auth.type';

export const sendSuccess = <T = any>(
    res: Response,
    message: string = "Success",
    statusCode: HttpStatus = HTTP_STATUS.OK,
    data: T = {} as T
): Response<ApiResponse<T>> => {
    return res.status(statusCode).json({
        success: {
            status_code: statusCode,
            message,
            data,
        }
    });
}

export const sendError = (
    res: Response,
    message: string = "Something went wrong",
    statusCode: HttpStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    data: any = null
): Response<ApiResponse> => {
    return res.status(statusCode).json({
        error: {
            status_code: statusCode,
            message,
            data,
        }
    });
}

