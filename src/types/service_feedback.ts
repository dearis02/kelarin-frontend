export type ServiceFeedbackGetAllReq = {
    serviceID: string;
}

export type ServiceFeedbackGetAllRes = {
    id: string;
    user_name: string;
    service_id: string;
    rating: number;
    comment: string;
    created_at: string;
}