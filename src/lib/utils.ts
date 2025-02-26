import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function parseTime(timeStr: string) {
	if (!/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
		throw new Error('Invalid time format. Expected format is HH:mm:ss');
	}

	const [hours, minutes, seconds] = timeStr.split(':').map(Number);
	const date = new Date();

	date.setHours(hours, minutes, seconds, 0);

	return date;
}
