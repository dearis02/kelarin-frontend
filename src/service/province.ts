import api from '$util/axios_interceptor';
import { createQuery } from '@tanstack/svelte-query';
import type { ApiResponse } from '../types/api';
import type { ProvinceGetAllRes } from '../types/province';

export function provinceGetAll() {
	return createQuery({
		queryKey: ['province.getAll'],
		queryFn: async () => {
			return await api.get<ProvinceGetAllRes, ApiResponse<ProvinceGetAllRes[]>>(
				'/common/v1/provinces'
			);
		},
		initialData: {
			status_code: 200,
			message: '',
			data: []
		}
	});
}
