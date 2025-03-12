export type NotificationGetAllRes = {
	id: string;
	title: string;
	message: string;
	read: boolean;
	created_at: Date;
	metadata: unknown;
};

export type NotificationMetadataOffer = {
	offer_id: string;
};

export type NotificationMetadataOfferNegotiation = {
	offer_negotiation_id: string;
};

export type NotificationMetadataPayment = {
	payment_id: string;
};

export type NotificationMetadataOrder = {
	order_id: string;
};
