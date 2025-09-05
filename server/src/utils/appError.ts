class AppError extends Error {
  constructor(
    msg: string,
    public statusCode: number,
    public error: string,
  ) {
    super(msg);
    this.statusCode = statusCode;
    this.error = error;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export default AppError;
