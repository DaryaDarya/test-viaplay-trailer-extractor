/* eslint-disable max-classes-per-file */
const http = require('http');

class HttpError extends Error {
  constructor(status, message, data) {
    super(message || http.STATUS_CODES[status]);
    this.status = status;
    this.data = data || {};
  }

  toJson() {
    return { status: this.status, message: this.message, data: this.data };
  }
}

class ValidateError extends HttpError {
  constructor(message, data) {
    super(400, message, data);
  }
}

class NotFoundError extends HttpError {
  constructor(message) {
    super(404, message, null);
  }
}

module.exports = {
  has: (err) => err instanceof HttpError,
  constructor: (status, message, data) => new HttpError(status, message, data),
  badRequest: (message, data) => new ValidateError(message, data),
  notFound: (message) => new NotFoundError(message),
  isBadJson: (err) => err instanceof SyntaxError && err.status === 400 && 'body' in err,
};
