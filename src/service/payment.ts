import { createMutation } from '@tanstack/svelte-query';
import api from '$util/axios_interceptor';
import type { PaymentCreateReq, PaymentCreateRes } from '../types/payment';
import type { ApiResponse } from '../types/api';

export function paymentCreateService() {
	return createMutation({
		mutationKey: ['payment.create'],
		mutationFn: async (req: PaymentCreateReq) => {
			return await api.post<PaymentCreateRes, ApiResponse<PaymentCreateRes>>('/consumer/v1/payments', req);
		}
	});
}
