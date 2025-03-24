import { createMutation, createQuery } from '@tanstack/svelte-query';
import type { OfferNegotiationAcceptOrRejectReq, OfferCreateReq, OfferGetAllRes, OfferGetByIDRes } from '../types/offer';
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

export function offerGetByIDService(id: () => string | undefined) {
	return createQuery({
		queryKey: ['offer.getByID', id],
		queryFn: async () => {
			const res = await api.get<OfferGetByIDRes, ApiResponse<OfferGetByIDRes>>(`/consumer/v1/offers/${id()}`);
			return res.data;
		},
		enabled: !!id()
	});
}

export function offerAcceptOrRejectNegotiationService() {
	return createMutation({
		mutationKey: ['offer.acceptOrReject'],
		mutationFn: async (req: OfferNegotiationAcceptOrRejectReq) => {
			await api.post(`/consumer/v1/offer-negotiations/${req.offer_negotiation_id}`, {
				action: req.action
			});
		}
	});
}
