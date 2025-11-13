import { HTTP_STATUS } from "./constants.js";

const sendSuccess = (res, message = "Success", data = {}, statusCode = HTTP_STATUS.OK) => {
    return res.status(statusCode).json({
        success: {
            status_code: statusCode,
            message,
            data,
        }
    });
}

const sendError = (res, message = "Something went wrong", data = {}, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
    return res.status(statusCode).json({
        error: {
            status_code: statusCode,
            message,
            data,
        }
    });
}

export { sendSuccess, sendError };

