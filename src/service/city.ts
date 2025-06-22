import api from '$util/axios_interceptor';
import { createQuery } from '@tanstack/svelte-query';
import type { CityGetAllByProvinceIDRes } from '../types/city';
import type { ApiResponse } from '../types/api';
import BigNumber from 'bignumber.js';

export function cityGetAllByProvinceID(provinceID?: BigNumber) {
	return createQuery({
		queryKey: ['city.getAll', provinceID],
		queryFn: async () => {
			if (!provinceID) {
				return {
					status_code: 200,
					message: '',
					data: []
				};
			}

			return await api.get<CityGetAllByProvinceIDRes, ApiResponse<CityGetAllByProvinceIDRes[]>>(`/common/v1/cities?province_id=${provinceID}`);
		},
		initialData: {
			status_code: 200,
			message: '',
			data: []
		},
		enabled: false
	});
}
