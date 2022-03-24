import { StatusCodes } from "http-status-codes";
import { logger } from "../utils/logger.js";
const { INTERNAL_SERVER_ERROR, NOT_FOUND, PRECONDITION_FAILED } = StatusCodes;

const errorHandler = (err, req, res) => {
    logger.error(err);
    let error = {
        statusCode: err.statusCode || INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong try again later",
    };

    if (err.name == "ValidationError") {
        if (typeof err.message == "string") {
            error.message = err.message.replace(/"/g, "");
        } else {
            error.message = Object.values(err.errors)
                .map(value => value.message)
                .join(",");
        }

        error.statusCode = PRECONDITION_FAILED;
    }
    if (err.name == "CastError") {
        if (err.path.match(/id/i)) {
            error.message = `No item found with id : ${err.value}`;
        } else {
            logger.warn(err.message.match(/Cast/i));
            error.message = err.message.replace(/"/g, "");
        }
        error.statusCode = NOT_FOUND;
    }

    return res.status(error.statusCode).json({ message: error.message });
};

export default errorHandler;
