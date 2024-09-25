export class DeleteConnectionException extends Error {
  errorCode: number;
  constructor(message: string, errorCode: number = 1000) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
