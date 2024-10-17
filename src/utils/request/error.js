export class BizError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'BizError';
    this.message = message;
  }

  toString() {
    return `${this.name}: code: ${this.code}, message: ${this.message}`;
  }
}

export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.message = message;
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
}

export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.message = message;
  }

  toString() {
    return `${this.name}: status code: ${this.statusCode}, message: ${this.message}`;
  }
}
