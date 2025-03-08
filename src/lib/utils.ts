import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PaymentMethodAdminFeeUnit } from '../types/payment_method';

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

export function getLocalTimeZoneAbbreviation() {
	return new Date().toLocaleTimeString('id-ID', { timeZoneName: 'short' }).split(' ')[1];
}

export function calculateAdminFee(amount: string, adminFee: number, adminFeeUnit: PaymentMethodAdminFeeUnit): number {
	if (adminFeeUnit === PaymentMethodAdminFeeUnit.FIXED) {
		return adminFee;
	}

	return Number(amount) * (adminFee / 100);
}
