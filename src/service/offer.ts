import { createMutation, createQuery } from '@tanstack/svelte-query';
import type { OfferCreateReq, OfferGetAllRes, OfferGetByIDRes } from '../types/offer';
import api from '$util/axios_interceptor';
import type { ApiResponse } from '../types/api';

export function offerSendService() {
	return createMutation({
		mutationKey: ['offer.create'],
		mutationFn: async (req: OfferCreateReq) => {
			await api.post('/consumer/v1/offers', req);
		}
	});
}

export function offerGetAllService() {
	return createQuery({
		queryKey: ['offer.getAll'],
		queryFn: async () => {
			return await api.get<OfferGetAllRes, ApiResponse<OfferGetAllRes[]>>('/consumer/v1/offers');
		},
		initialData: {
			status_code: 200,
			message: '',
			data: []
		}
	});
}

export function offerGetByIDService(id: string) {
	return createQuery({
		queryKey: ['offer.getByID', id],
		queryFn: async () => {
			return await api.get<OfferGetByIDRes, ApiResponse<OfferGetByIDRes>>(`/consumer/v1/offers/${id}`);
		}
	});
}
