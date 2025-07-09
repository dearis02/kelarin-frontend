import api from "../util/axios_interceptor"

import type { ServiceFeedbackGetAllReq, ServiceFeedbackGetAllRes } from "../types/service_feedback";
import type { ApiResponse } from "../types/api";

export abstract class ServiceFeedbackRepository {
    abstract getAll(req: ServiceFeedbackGetAllReq): Promise<ServiceFeedbackGetAllRes[]>;
}

export class ServiceFeedbackRepositoryImpl extends ServiceFeedbackRepository {
    constructor() {
        super();
    }

    async getAll(req: ServiceFeedbackGetAllReq): Promise<ServiceFeedbackGetAllRes[]> {
        const data = await api.get<ServiceFeedbackGetAllRes[], ApiResponse<ServiceFeedbackGetAllRes[]>>(`/v1/services/${req.serviceID}/feedbacks`)
        return data.data;
    }
}

export function NewServiceFeedbackRepository(): ServiceFeedbackRepository {
    return new ServiceFeedbackRepositoryImpl();
}