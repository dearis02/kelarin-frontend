import api from '$util/axios_interceptor';
import { createQuery } from '@tanstack/svelte-query';
import type { OrderGetAllRes } from '../types/order';
import type { ApiResponse } from '../types/api';

export function orderGetAllService() {
	return createQuery({
		queryKey: ['order.getAll'],
		queryFn: async () => {
			return await api.get<OrderGetAllRes, ApiResponse<OrderGetAllRes[]>>('/consumer/v1/orders');
		}
	});
}
