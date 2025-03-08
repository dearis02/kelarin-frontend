import { createQuery } from '@tanstack/svelte-query';
import api from '$util/axios_interceptor';
import type { PaymentMethodGetAllRes } from '../types/payment_method';
import type { ApiResponse } from '../types/api';

export function paymentMethodGetAllService() {
	return createQuery({
		queryKey: ['paymentMethod.getAll'],
		queryFn: async () => {
			return await api.get<PaymentMethodGetAllRes, ApiResponse<PaymentMethodGetAllRes[]>>('/common/v1/payment-methods');
		}
	});
}
