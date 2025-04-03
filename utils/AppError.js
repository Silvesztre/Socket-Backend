class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;  // Set the statusCode property
        Error.captureStackTrace(this, this.constructor);  // Capture the stack trace
    }
}

module.exports = AppError; 