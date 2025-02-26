import { createMutation } from '@tanstack/svelte-query';
import type { OfferCreateReq } from '../types/offer';
import api from '$util/axios_interceptor';

export function offerSendService() {
	return createMutation({
		mutationKey: ['offer.create'],
		mutationFn: async (req: OfferCreateReq) => {
			await api.post('/consumer/v1/offers', req);
		}
	});
}
