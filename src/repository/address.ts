import type { AddressCreateReq, AddressGetAllRes, AddressUpdateReq } from '../types/address';
import type { ApiResponse } from '../types/api';
import api from '$util/axios_interceptor';

export abstract class AddressRepository {
	abstract getAll(): Promise<AddressGetAllRes[]>
	abstract create(req: AddressCreateReq): Promise<void>
	abstract update(req: AddressUpdateReq): Promise<void>
}

export class AddressRepositoryImpl extends AddressRepository {

	constructor() {
		super();

	}

	async getAll(): Promise<AddressGetAllRes[]> {
		const res = await api.get<AddressGetAllRes, ApiResponse<AddressGetAllRes[]>>('/consumer/v1/addresses');
		return res.data;
	}

	async create(req: AddressCreateReq): Promise<void> {
		await api.post('/consumer/v1/addresses', req);
	}

	async update(req: AddressUpdateReq): Promise<void> {
		await api.put(`/consumer/v1/addresses/${req.id}`, req);
	}
}


export function NewAddressRepository(): AddressRepository {
	return new AddressRepositoryImpl();
}
