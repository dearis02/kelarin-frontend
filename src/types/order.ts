import type Decimal from 'decimal.js';
import type { PaymentStatus } from './payment';
import type { OfferNegotiationStatus } from './offer';

export enum OrderStatus {
	PENDING = 'pending',
	ONGOING = 'ongoing',
	FINISHED = 'finished'
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

export interface OrderGetByIDRes {
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
	payment: OrderGetByIDResOfferPayment | null;
}

export type OrderGetByIDResOffer = {
	id: string;
	service_cost: string;
	detail: string;
	service_start_date: Date;
	service_end_date: Date;
	service_start_time: string;
	service_end_time: string;
	service_time_time_zone: string;
	status: string;
	has_pending_negotiation: boolean;
	created_at: Date;
	service: OrderGetByIDResOfferService;
	service_provider: OrderGetByIDResOfferServiceServiceProvider;
	address: OrderGetByIDResOfferAddress;
	negotiations: OrderGetByIDResOfferNegotiation[];
};

export type OrderGetByIDResOfferNegotiation = {
	id: string;
	Message: string;
	requested_service_cost: Decimal;
	status: OfferNegotiationStatus;
	created_at: Date;
};

export interface OrderGetByIDResOfferAddress {
	id: string;
	name: string;
	province: string;
	city: string;
	lat: number;
	lng: number;
	address: string;
}

export interface OrderGetByIDResOfferService {
	id: string;
	name: string;
}

export interface OrderGetByIDResOfferServiceServiceProvider {
	id: string;
	name: string;
	logo_url: string;
	received_rating_count: number;
	received_rating_average: number;
}

export interface OrderGetByIDResOfferPayment {
	id: string;
	reference: string;
	payment_method_name: string;
	payment_method_logo_url: string;
	amount: string;
	admin_fee: number;
	platform_fee: number;
	status: PaymentStatus;
	payment_link: string;
	expired_at: string;
	created_at: string;
	updated_at: string | null;
}

export type OrderGenerateQRCodeReq = {
	order_id: string;
};

export type OrderGenerateQRCodeRes = {
	qr_code_content: string;
	valid_duration_in_second: number;
};
