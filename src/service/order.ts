import api from '$util/axios_interceptor';
import { createMutation, createQuery } from '@tanstack/svelte-query';
import type { OrderGenerateQRCodeReq, OrderGenerateQRCodeRes, OrderGetAllRes, OrderGetByIDRes } from '../types/order';
import type { ApiResponse } from '../types/api';

export function orderGetAllService() {
	return createQuery({
		queryKey: ['order.getAll'],
		queryFn: async () => {
			return await api.get<OrderGetAllRes, ApiResponse<OrderGetAllRes[]>>('/consumer/v1/orders');
		}
	});
}

export function orderGetByIDService(id: () => string | undefined) {
	return createQuery({
		queryKey: ['order.getByID', id()],
		queryFn: async () => {
			return await api.get<OrderGetByIDRes, ApiResponse<OrderGetByIDRes>>(`/consumer/v1/orders/${id()}`);
		},
		enabled: false
	});
}

export function orderGenerateQRCodeService() {
	return createMutation({
		mutationKey: ['order.generateQRCode'],
		mutationFn: async (req: OrderGenerateQRCodeReq) => {
			return await api.post<OrderGenerateQRCodeRes, ApiResponse<OrderGenerateQRCodeRes>>(`/consumer/v1/orders/${req.order_id}/_qr_code`);
		}
	});
}
