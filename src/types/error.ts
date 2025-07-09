export type ValidationError = {
	field: string;
	message: string;
};

export class AppError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace?.(this, this.constructor);
	}
}

export class InternalServerError extends AppError { }
export class UnauthorizedError extends AppError { }
export class NotFoundError extends AppError { }
export class UnprocessableEntityError extends AppError {
	constructor(public readonly details: Record<string, string>) {
		super("Form validation failed");
	}
}