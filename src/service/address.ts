import { createMutation, createQuery } from '@tanstack/svelte-query';
import type { AddressCreateReq, AddressGetAllRes, AddressUpdateReq } from '../types/address';
import type { ApiResponse } from '../types/api';
import api from '$util/axios_interceptor';

export function addressGetAllService() {
	return createQuery({
		queryKey: ['address.getAll'],
		queryFn: async () => {
			const res = await api.get<AddressGetAllRes, ApiResponse<AddressGetAllRes[]>>('/consumer/v1/addresses');
			return res.data;
		},
		initialData: []
	});
}

export function addressCreateService() {
	return createMutation({
		mutationKey: ['address.create'],
		mutationFn: async (req: AddressCreateReq) => {
			await api.post('/consumer/v1/addresses', req);
		}
	});
}

export function addressUpdateService() {
	return createMutation({
		mutationKey: ['address.update'],
		mutationFn: async (req: AddressUpdateReq) => {
			await api.put(`/consumer/v1/addresses/${req.id}`, req);
		}
	});
}
