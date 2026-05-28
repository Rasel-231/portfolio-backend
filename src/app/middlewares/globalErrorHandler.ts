import { ErrorRequestHandler } from 'express';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: error.message || 'Something went wrong!',
        errorSources: error || null,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
};

export default globalErrorHandler;