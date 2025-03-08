export enum PaymentStatus {
	PENDING = 'pending',
	PAID = 'paid',
	EXPIRED = 'expired',
	FAILED = 'failed',
	CANCELED = 'canceled'
}

export type PaymentCreateReq = {
	order_id: string;
	payment_method_id: string;
};

export type PaymentCreateRes = {
	payment_link: string;
};
