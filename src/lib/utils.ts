import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PaymentMethodAdminFeeUnit } from '../types/payment_method';
import dayjs from 'dayjs';

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

export function isSame(d1: string | dayjs.Dayjs, d2: string | dayjs.Dayjs): boolean {
	return dayjs(d1).isSame(d2, 'date');
}

export function isSameWeek(d1: string | dayjs.Dayjs, d2: string | dayjs.Dayjs): boolean {
	return dayjs(d1).isSame(d2, 'week');
}

export function isSameMonth(d1: string | dayjs.Dayjs, d2: string | dayjs.Dayjs): boolean {
	return dayjs(d1).isSame(d2, 'month');
}

export function isSameYear(d1: string | dayjs.Dayjs, d2: string | dayjs.Dayjs): boolean {
	return dayjs(d1).isSame(d2, 'year');
}
