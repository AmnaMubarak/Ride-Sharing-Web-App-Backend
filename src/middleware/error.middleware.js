const { ZodError } = require('zod');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(errors) {
    super(400, 'Validation Error');
    this.errors = errors;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(401, message);
  }
}

const errorHandler = (err, req, res, next) => {
  // Add request ID for tracking
  const requestId = req.id || uuidv4();
  
  logger.error({
    requestId,
    message: err.message,
    error: err,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
    headers: req.headers,
    query: req.query,
    body: req.body,
  });

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    logger.error('Error 💥', err);
    
    if (err instanceof ZodError) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation Error',
        errors: err.errors,
      });
    }

    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Production error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or unknown error
  logger.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  errorHandler,
}; 