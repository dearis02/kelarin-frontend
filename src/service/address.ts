import { createMutation, createQuery, type CreateMutationResult, type DefinedCreateQueryResult } from '@tanstack/svelte-query';
import type { AddressCreateReq, AddressGetAllRes, AddressUpdateReq } from '../types/address';
import type { AddressRepository } from '../repository/address';

export abstract class AddressService {
	abstract getAll(): DefinedCreateQueryResult<AddressGetAllRes[], Error>
	abstract create(): CreateMutationResult<void, Error, AddressCreateReq, unknown>;
	abstract update(): CreateMutationResult<void, Error, AddressUpdateReq, unknown>;
}

class AddressServiceImpl extends AddressService {
	private addressRepo: AddressRepository;

	constructor(addressRepo: AddressRepository) {
		super();

		this.addressRepo = addressRepo;
	}

	getAll(): DefinedCreateQueryResult<AddressGetAllRes[], Error> {
		return createQuery({
			queryKey: ['address.getAll'],
			queryFn: async () => {
				return await this.addressRepo.getAll();
			},
			initialData: []
		});
	}

	create(): CreateMutationResult<void, Error, AddressCreateReq, unknown> {
		return createMutation({
			mutationKey: ['address.create'],
			mutationFn: async (req: AddressCreateReq) => {
				await this.addressRepo.create(req);
			}
		});
	}

	update(): CreateMutationResult<void, Error, AddressUpdateReq, unknown> {
		return createMutation({
			mutationKey: ['address.update'],
			mutationFn: async (req: AddressUpdateReq) => {
				await this.addressRepo.update(req);
			}
		});
	}
}

export function NewAddressService(addressRepo: AddressRepository): AddressService {
	return new AddressServiceImpl(addressRepo);
}
