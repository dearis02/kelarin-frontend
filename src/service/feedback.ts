import api from '$util/axios_interceptor';
import { createMutation } from '@tanstack/svelte-query';
import type { ApiResponse } from '../types/api';
import type { ServiceFeedbackCreateReq } from '../types/feedback';

export function feedbackServiceCreate() {
	return createMutation({
		mutationKey: ['feedback.create'],
		mutationFn: async (req: ServiceFeedbackCreateReq) => {
			return await api.post<ApiResponse<unknown>>('/consumer/v1/service-feedbacks', req);
		}
	});
}
