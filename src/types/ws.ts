export type WebSocketResponse<T> = {
	success: boolean;
	type: 'server' | 'incoming_message';
	code: WebSocketResponseCode;
	message: string;
	data?: T;
	metadata: unknown;
};

export enum WebSocketResponseCode {
	SUCCESS = 2000,
	INTERNAL_SERVER_ERROR = 2001,
	CLIENT_ERROR = 2400,
	CHAT_ROOM_NOT_FOUND = 2402,
	RECIPIENT_NOT_FOUND = 2403,
	RECIPIENT_OFFLINE = 2404
}
