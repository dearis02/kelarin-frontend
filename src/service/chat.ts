import api from '$util/axios_interceptor';
import { createMutation, createQuery, QueryClient } from '@tanstack/svelte-query';
import type { ApiResponse } from '../types/api';
import type { ChatCreateRoomReq, ChatCreateRoomRes, ChatGetAllRes, ChatGetByIDRes } from '../types/chat';

export function chatGetAllService(queryClient: QueryClient) {
	return createQuery(
		{
			queryKey: ['chat.getAll'],
			queryFn: async () => {
				const res = await api.get<ChatGetAllRes[], ApiResponse<ChatGetAllRes[]>>('/consumer/v1/chats');
				return res.data;
			},
			enabled: false
		},
		queryClient
	);
}

export function chatGetByRoomIDService(queryClient: QueryClient, id: () => string | undefined) {
	return createQuery(
		{
			queryKey: ['chat.getAll'],
			queryFn: async () => {
				const res = await api.get<ChatGetByIDRes, ApiResponse<ChatGetByIDRes>>(`/consumer/v1/chats/${id()}`);
				return res.data;
			},
			enabled: !!id()
		},
		queryClient
	);
}

export function chatCreateRoom() {
	return createMutation({
		mutationFn: async (data: ChatCreateRoomReq) => {
			const res = await api.put<ChatCreateRoomRes, ApiResponse<ChatCreateRoomRes>>('/consumer/v1/chat-rooms', data);
			return res.data;
		}
	});
}
