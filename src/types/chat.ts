export enum ChatContext {
	COMMON = 'common',
	SERVICE = 'service',
	ORDER = 'order'
}

export enum ChatContentType {
	TEXT = 'text',
	IMAGE = 'image',
	VIDEO = 'video'
}

export interface ChatGetAllRes {
	context: ChatContext;
	room_id: string;
	service_provider: ChatGetAllResServiceProvider;
	unread_message_count: number;
	latest_message: ChatGetAllResLatestMessage | null;
}

export interface ChatGetAllResServiceProvider {
	id: string;
	name: string;
	logo_url: string;
}

export interface ChatGetAllResLatestMessage {
	id: string;
	content: string;
	content_type: ChatContentType;
	read: boolean;
	created_at: string;
}

export type ChatGetByIDRes = {
	context: ChatContext;
	room_id: string;
	offer_id: string;
	service: ChatGetByIDResService | null;
	order: ChatGetByIDResOrder | null;
	service_provider: ChatGetByIDResServiceProvider;
	messages: ChatGetByIDResMessage[];
};

export type ChatGetByIDResMessage = {
	id: string;
	is_sender: boolean;
	content: string;
	content_type: ChatContentType;
	read: boolean;
	created_at: string;
};

export type ChatGetByIDResOrder = {
	id: string;
	status: string;
	service_date: string;
	service_time: string;
};

export type ChatGetByIDResService = {
	id: string;
	name: string;
};

export type ChatGetByIDResServiceProvider = {
	id: string;
	name: string;
	logo_url: string;
};

export type ChatWsIncoming = {
	room_id: string;
	message_id: string;
	content: string;
	content_type: ChatContentType;
	created_at: string;
};

export type ChatWsSendReq = {
	id: string;
	room_id?: string;
	service_provider_id?: string;
	content: string;
	content_type: ChatContentType;
};

export type ChatWsSendResMetadata = {
	id: string;
};

export type ChatOutboundMessage = {
	id: string;
	is_sending: boolean;
	failed: boolean;
	is_sender: boolean;
	content: string;
	content_type: ChatContentType;
	created_at: string;
};

export type ChatCreateRoomReq = {
	service_id?: string;
	offer_id?: string;
};

export type ChatCreateRoomRes = {
	room_id: string;
};

export type ChatMarkReceivedMessagesAsSeenReq = {
	room_id: string;
	chat_message_ids: string[];
};
