export default function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    //log error to console
    console.error(`[${new Date().toISOString()}] ${statusCode} - ${message}`);

    //send error response
    res.status(statusCode).json({
        status: 'error',
        statusCode: statusCode,
        message: message
    });
}