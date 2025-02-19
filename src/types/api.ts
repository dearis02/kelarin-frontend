export type ApiResponse<T> = {
	status_code: number;
	message: string;
	data: T;
	errors?: unknown;
	pagination?: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
	metadata?: unknown;
};
