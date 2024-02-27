class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    // this.success = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
    this.isOperational = true;
  }
}

module.exports = ApiError; 