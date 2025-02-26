import { z } from 'zod';

export type AddressGetAllRes = {
	id: string;
	name: string;
	lat: number | null;
	lng: number | null;
	province: string;
	city: string;
	address: string;
};

export type AddressCreateReq = {
	name: string;
	lat: number | null;
	lng: number | null;
	province: string;
	city: string;
	address: string;
};

export const createAddressValidationSchema = z.object({
	name: z.string().min(1, 'name required'),
	lat: z.number().nullable(),
	lng: z.number().nullable(),
	province: z.string().min(1, 'province required'),
	city: z.string().min(1, 'city required'),
	address: z.string().min(1, 'address required')
});

export type AddressCreateForm = z.infer<typeof createAddressValidationSchema>;

export type AddressUpdateReq = AddressCreateReq & { id: string };

export const updateAddressValidationSchema = z.object({
	name: z.string().min(1, 'name required'),
	lat: z.number().nullable(),
	lng: z.number().nullable(),
	province: z.string().min(1, 'province required'),
	city: z.string().min(1, 'city required'),
	address: z.string().min(1, 'address required')
});

export type AddressUpdateForm = z.infer<typeof updateAddressValidationSchema>;
