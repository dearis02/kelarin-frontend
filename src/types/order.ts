import type { PaymentStatus } from './payment';

export interface OrderGetAllRes {
	id: string;
	offer_id: string;
	service_fee: string;
	service_date: Date;
	service_time: string;
	payment_fulfilled: boolean;
	status: string;
	created_at: Date;
	service: OrderGetAllResService;
	service_provider: OrderGetAllResServiceProvider;
	payment: OrderGetAllResPayment | null;
}

export interface OrderGetAllResService {
	id: string;
	name: string;
}

export interface OrderGetAllResServiceProvider {
	id: string;
	name: string;
	logo_url: string;
}

export interface OrderGetAllResPayment {
	id: string;
	payment_method_name: string;
	amount: string;
	admin_fee: number;
	platform_fee: number;
	status: PaymentStatus;
	payment_link: string;
}
