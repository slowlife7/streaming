exports.HttpError = class HttpError extends Error {
  constructor(status, message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
    this.status = status;
    this.date = new Date();
  }
};

exports.AppError = class AppError extends Error {
  constructor(status, message) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
    this.status = status;
    this.date = new Date();
  }
};
