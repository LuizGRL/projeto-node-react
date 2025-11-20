export class AppError {
  public readonly message: any;
  public readonly statusCode: number;

  constructor(message: string, statusCode?: number);
  constructor(message: any, statusCode?: number);

  constructor(message: any, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}