import { createQuery, type CreateQueryResult } from "@tanstack/svelte-query";
import type { ServiceFeedbackRepository } from "../repository/service_feedback";
import type { ServiceFeedbackGetAllRes } from "../types/service_feedback";

export abstract class ServiceFeedbackService {
    abstract getAll(serviceID: string): CreateQueryResult<ServiceFeedbackGetAllRes[], Error>;
}

export class ServiceFeedbackServiceImpl extends ServiceFeedbackService {
    private repository: ServiceFeedbackRepository;

    constructor(repository: ServiceFeedbackRepository) {
        super();
        this.repository = repository;
    }

    getAll(serviceID: string): CreateQueryResult<ServiceFeedbackGetAllRes[], Error> {
        return createQuery({
            queryKey: ['serviceFeedback.getAll'],
            queryFn: async () => {
                return await this.repository.getAll({ serviceID });
            }
        });
    }
}

export function NewServiceFeedbackService(repository: ServiceFeedbackRepository): ServiceFeedbackService {
    return new ServiceFeedbackServiceImpl(repository);
}