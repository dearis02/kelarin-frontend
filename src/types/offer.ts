import { parseTime } from '$lib/utils';
import { formatRupiah } from '$util/format_rupiah';
import { z } from 'zod';

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
			const today = new Date().toLocaleDateString('en-CA', { dateStyle: 'short' });

			const currentTime = new Date().getTime();
			let startTime: number = 0;
			try {
				startTime = parseTime(data.service_start_time).getTime();
			} catch (error) {
				console.log(error);
			}

			if (data.service_start_date < today) {
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

			if (data.service_start_date == today) {
				if (startTime < currentTime) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'start time cannot be in the past',
						path: ['service_start_time']
					});
				}

				if (startTime < currentTime + 60 * 60 * 1000) {
					console.log('less than one hour');

					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'start time must be more than 1 hour from now',
						path: ['service_start_time']
					});
				}
			}
		});

export function offerCreateValidationSchema(minCost: number) {
	return offerCreateSchema(minCost);
}

export type OfferCreateForm = z.infer<ReturnType<typeof offerCreateSchema>>;
