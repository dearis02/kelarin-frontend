export enum PaymentMethodAdminFeeUnit {
	FIXED = 'fixed',
	PERCENT = 'percent'
}

export enum PaymentMethodType {
	QR = 'qr',
	VA = 'va'
}

export type PaymentMethodGetAllRes = {
	id: string;
	name: string;
	type: PaymentMethodType;
	admin_fee: number;
	admin_fee_unit: PaymentMethodAdminFeeUnit;
	logo_url: string;
	enabled: boolean;
};

export type PaymentMethodGroupedByType = {
	type: PaymentMethodType;
	methods: PaymentMethodGetAllRes[];
};
