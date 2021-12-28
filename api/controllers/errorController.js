const AppError = require("../../utils/appError");

const sendErrorDev = (err, res) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    const statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (err.isOperational) {
        res.status(statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(statusCode).json({
            status: err.status,
            message: "Something went Wrong",
        });
    }
};

const handleDuplicateFields = err => {
    let value = err.keyValue.email
    message = `Duplicate Field Value: ${value} already exists`
    return new AppError(message, 400)
}

const handleCastErrorDB = err => { return new AppError(`Invalid ID: ${err.value}`, 400) };


const handleJWTTokenError = err => { return new AppError('Invalid Token Please Login Again', 401) }

module.exports = (err, req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else {
        let msg = err.message;
        let copyError = { ...err };
        copyError.message = msg;
        let error = { ...copyError };
        if (error.code === 11000) error = handleDuplicateFields(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTTokenError(error);
        if (err.name === 'CastError') error = handleCastErrorDB(err);
        sendErrorProd(error, res);
    }
};
