import { createQuery } from '@tanstack/svelte-query';
import api from '$util/axios_interceptor';
import type { NotificationGetAllRes } from '../types/notification';
import type { ApiResponse } from '../types/api';

export function notificationGetAllService() {
	return createQuery({
		queryKey: ['notification.getAll'],
		queryFn: async () => {
			return await api.get<NotificationGetAllRes[], ApiResponse<NotificationGetAllRes[]>>('/consumer/v1/notifications');
		},
		_defaulted: true
	});
}
