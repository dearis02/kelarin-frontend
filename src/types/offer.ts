import { formatRupiah } from '$util/format_rupiah';
import dayjs from 'dayjs';
import type Decimal from 'decimal.js';
import { z } from 'zod';

export enum OfferStatus {
	PENDING = 'pending',
	ACCEPTED = 'accepted',
	REJECTED = 'rejected',
	CANCELED = 'canceled'
}

export type OfferCreateReq = {
	service_id: string;
	address_id: string;
	detail: string;
	service_cost: number;
	service_start_date: string;
	service_end_date: string;
	service_start_time: string;
	service_end_time: string;
};

const offerCreateSchema = (minCost: number) =>
	z
		.object({
			service_id: z.string().min(1, 'service is not selected'),
			address_id: z.string().min(1, 'address is not selected'),
			detail: z.string().min(1, 'detail is required'),
			service_cost: z.number().min(minCost, `minimum service cost is ${formatRupiah(String(minCost))}`),
			service_start_date: z.string().min(1, 'start date is required').date(),
			service_end_date: z.string().min(1, 'end date is required').date(),
			service_start_time: z
				.string()
				.min(1, 'start time is required')
				.transform((val) => `${val}:00`),
			service_end_time: z
				.string()
				.min(1, 'end time is required')
				.transform((val) => `${val}:00`)
		})
		.superRefine((data, ctx) => {
			// const today = new Date().toLocaleDateString('en-CA', { dateStyle: 'short' });
			const today = dayjs();

			const startDate = dayjs(data.service_start_date);
			const endDate = dayjs(data.service_end_date);

			const startTime = dayjs(dayjs().format('YYYY-MM-DD') + ' ' + data.service_start_time);
			let endTime = dayjs(dayjs().format('YYYY-MM-DD') + ' ' + data.service_end_time);

			const currentTime = today.toDate().getTime();
			// let startTime: number = 0;
			// try {
			// startTime = parseTime(data.service_start_time).getTime();
			// } catch (error) {
			// 	console.error(error);
			// }

			if (startDate.isBefore(today, 'date')) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'start date cannot be in the past',
					path: ['service_start_date']
				});
			}

			if (data.service_start_date > data.service_end_date) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'start date cannot be after end date',
					path: ['service_start_date']
				});
			}

			if (startDate.isSame(today, 'date')) {
				if (startTime.toDate().getTime() < currentTime) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'start time cannot be in the past',
						path: ['service_start_time']
					});
				}

				if (startTime.toDate().getTime() < currentTime + 60 * 60 * 1000) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'start time must be more than 1 hour from now',
						path: ['service_start_time']
					});
				}
			}

			if (startDate.isSame(endDate, 'day')) {
				const endOfDayStartDate = startDate.endOf('day');
				if (endTime.isBefore(startTime)) {
					endTime = startDate.add(1, 'day').set('hour', endTime.hour()).set('minute', endTime.minute()).set('second', endTime.second());
				}

				if (endTime.isAfter(endOfDayStartDate)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `end time must be before or equal ${endOfDayStartDate.format('HH:mm')}`,
						path: ['service_end_time']
					});
				}
			}
		});

export function offerCreateValidationSchema(minCost: number) {
	return offerCreateSchema(minCost);
}

export type OfferCreateForm = z.infer<ReturnType<typeof offerCreateSchema>>;

export type OfferGetAllRes = {
	id: string;
	service_cost: Decimal;
	service_start_date: Date;
	service_end_date: Date;
	service_start_time: string;
	service_end_time: string;
	service_time_time_zone: string;
	has_pending_negotiation: boolean;
	status: OfferStatus;
	created_at: Date;
	service: OfferGetAllResService;
	service_provider: OfferGetAllResServiceProvider;
};

export type OfferGetAllResService = {
	id: string;
	name: string;
	image_url: string;
};

export type OfferGetAllResServiceProvider = {
	id: string;
	name: string;
	logo_url: string;
};

export interface OfferGetByIDRes {
	id: string;
	service_cost: string;
	detail: string;
	service_start_date: string;
	service_end_date: string;
	service_start_time: string;
	service_end_time: string;
	service_time_time_zone: string;
	has_pending_negotiation: boolean;
	created_at: Date;
	service: OfferGetByIDResService;
	service_provider: OfferGetByIDResServiceProvider;
	address: OfferGetByIDResAddress;
	negotiations: OfferGetByIDResNegotiation[];
}

export interface OfferGetByIDResAddress {
	id: string;
	name: string;
	province: string;
	city: string;
	lat: number | null;
	lng: number | null;
	detail: string;
}

export interface OfferGetByIDResService {
	id: string;
	name: string;
}

export interface OfferGetByIDResServiceProvider {
	id: string;
	name: string;
	logo_url: string;
	received_rating_count: number;
	received_rating_average: number;
}

export interface OfferGetByIDResNegotiation {
	id: string;
	message: string;
	requested_service_cost: string;
	status: OfferNegotiationStatus;
	created_at: Date;
}

export enum OfferNegotiationStatus {
	PENDING = 'pending',
	ACCEPTED = 'accepted',
	REJECTED = 'rejected',
	CANCELED = 'canceled'
}

export type OfferNegotiationAcceptOrRejectReq = {
	offer_negotiation_id: string;
	action: 'accept' | 'reject';
};
