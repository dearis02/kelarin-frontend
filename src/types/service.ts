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
