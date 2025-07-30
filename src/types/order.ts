import type { OfferStatus } from './offer';
import type { PaymentStatus } from './payment';
import type { ServiceRule } from './service';

export enum OrderStatus {
	PENDING = 'pending',
	ONGOING = 'ongoing',
	FINISHED = 'finished',
	EXPIRED = 'expired'
}

export type OrderGetAllRes = {
	id: string;
	offer_id: string;
	service_fee: string;
	service_date: Date;
	service_time: string;
	payment_fulfilled: boolean;
	status: OrderStatus;
	created_at: Date;
	service: OrderGetAllResService;
	service_provider: OrderGetAllResServiceProvider;
	payment: OrderGetAllResPayment | null;
};

export type OrderGetAllResService = {
	id: string;
	name: string;
};

export type OrderGetAllResServiceProvider = {
	id: string;
	name: string;
	logo_url: string;
};

export type OrderGetAllResPayment = {
	id: string;
	payment_method_name: string;
	amount: string;
	admin_fee: number;
	platform_fee: number;
	status: PaymentStatus;
	payment_link: string;
};

export type OrderGetByIDRes = {
	id: string;
	offer_id: string;
	service_fee: string;
	service_date: Date;
	service_time: string;
	payment_fulfilled: boolean;
	status: OrderStatus;
	rated: boolean;
	created_at: Date;
	offer: OrderGetByIDResOffer;
	service: OrderGetByIDResService;
	address: OrderGetByIDResAddress;
	payment: OrderGetByIDResPayment | null;
};

export type OrderGetByIDResOffer = {
	id: string;
	detail: string;
	status: OfferStatus;
	created_at: Date;
};

export type OrderGetByIDResAddress = {
	name: string;
	province: string;
	city: string;
	lat: number;
	lng: number;
	detail: string;
};

export type OrderGetByIDResService = {
	id: string;
	name: string;
	delivery_methods: string[];
	rules: ServiceRule[];
	description: string;
	service_provider: OrderGetByIDResOfferServiceServiceProvider;
};

export type OrderGetByIDResOfferServiceServiceProvider = {
	id: string;
	name: string;
	logo_url: string;
	received_rating_count: number;
	received_rating_average: number;
};

export type OrderGetByIDResPayment = {
	id: string;
	reference: string;
	payment_method_name: string;
	payment_method_logo: string;
	amount: string;
	admin_fee: number;
	platform_fee: number;
	status: PaymentStatus;
	payment_link: string;
	expired_at: string;
	created_at: string;
	updated_at: string | null;
};

export type OrderGenerateQRCodeReq = {
	order_id: string;
};

export type OrderGenerateQRCodeRes = {
	qr_code_content: string;
	valid_duration_in_second: number;
};
