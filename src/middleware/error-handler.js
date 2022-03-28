import { StatusCodes } from "http-status-codes";
import { logger } from "../utils/logger.js";
const { INTERNAL_SERVER_ERROR, PRECONDITION_FAILED, BAD_REQUEST } = StatusCodes;

// eslint-disable-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    logger.error(err);
    let error = {
        statusCode: err.statusCode || INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong try again later",
    };

    if (err.name == "ValidationError" || err.code == "ER_BAD_FIELD_ERROR") {
        if (err.message.match(/ER_BAD_FIELD_ERROR/i)) {
            error.message = err.sqlMessage;
        } else {
            error.message = err.message.replace(/"/g, "");
        }
        error.statusCode = PRECONDITION_FAILED;
    }

    if (err.errno === 1062) {
        error.message = `${err.sqlMessage}, please choose another value`;
        error.statusCode = BAD_REQUEST;
    }

    if (err.name.match(/Token/i)) {
        error.statusCode = PRECONDITION_FAILED;
        error.message = err.message;
    }

    return res.status(error.statusCode).json({ message: error.message });
};

export default errorHandler;
