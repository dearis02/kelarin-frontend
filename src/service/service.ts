import api from '$util/axios_interceptor';
import { createQuery } from '@tanstack/svelte-query';
import type { ServiceGetAllFilter, ServiceGetAllRes, ServiceGetByIDRes } from '../types/service';
import type { ApiResponse } from '../types/api';

export function serviceGetAll(filter: ServiceGetAllFilter) {
	return createQuery({
		queryKey: ['service.getAll', filter],
		queryFn: async () => {
			const res = await api.get<ServiceGetAllRes, ApiResponse<ServiceGetAllRes[]> & { metadata?: number }>('/v1/services', { params: filter });

			return res;
		},
		initialData: {
			status_code: 200,
			data: [],
			message: ''
		}
	});
}

export async function serviceGetByID(id: string | undefined) {
	return await api.get<ServiceGetByIDRes, ApiResponse<ServiceGetByIDRes>>(`/v1/services/${id}`);
}
