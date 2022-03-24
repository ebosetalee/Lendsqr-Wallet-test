//@ts-check
import ErrorResponse from "./index.js";

class ValidationError extends ErrorResponse {
    /**
     * @param {string} message
     * @param {any} statusCode
     * @param {any} metadata
     */
    constructor(message, statusCode, metadata) {
        super(message, statusCode);
        this.metadata = metadata;
    }
}

export default ValidationError;
