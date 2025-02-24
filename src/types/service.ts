import type Decimal from 'decimal.js';

export type ServiceGetAllRes = {
	id: string;
	name: string;
	image_url: string;
	fee_start_at: Decimal;
	fee_end_at: Decimal;
	address: string;
	province: string;
	city: string;
	received_rating_count: number;
	received_rating_average: number;
};

export type ServiceGetAllFilter = {
	keyword: string;
	categories: string[];
	province: string;
	city: string;
};

export type ServiceGetByIDRes = {
	id: string;
	name: string;
	description: string;
	delivery_methods: string[];
	image_urls: string[];
	fee_start_at: string;
	fee_end_at: string;
	rules: ServiceRule[];
	is_available: boolean;
	received_rating_count: number;
	received_rating_average: number;
	service_provider: ServiceGetByIDResServiceProvider;
};

export interface ServiceRule {
	type: string;
	name: string;
}

export interface ServiceGetByIDResServiceProvider {
	id: string;
	name: string;
	description: string;
	province: string;
	city: string;
	address: string;
	mobile_phone_number: string;
	telephone: string;
	logo_image_url: string;
	received_rating_count: number;
	received_rating_average: number;
	joined_at: string;
}
