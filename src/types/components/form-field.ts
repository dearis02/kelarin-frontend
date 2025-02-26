import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
import type { ValidationError } from '../error';

export type FormField = {
	label: string;
	hideLabel?: boolean;
	errors?: ValidationError[];
} & HTMLInputAttributes;

export type TextAreaField = {
	label: string;
	errors?: ValidationError[];
} & HTMLTextareaAttributes;
