import api from '$util/axios_interceptor';
import type { ApiResponse } from '../types/api';
import type { ServiceCategoryGetAllRes } from '../types/service_category';

export async function serviceCategoryGetAll() {
	return await api.get<ServiceCategoryGetAllRes, ApiResponse<ServiceCategoryGetAllRes[]>>('/v1/service-categories');
}
