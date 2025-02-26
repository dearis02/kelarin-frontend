import type { ZodError } from 'zod';
import type { ValidationError } from '../types/error';

export function transformZodError(errors: ZodError): ValidationError[] {
	return errors.errors.map((error) => ({
		field: error.path.join('.'),
		message: error.message
	}));
}
