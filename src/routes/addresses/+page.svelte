<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index';
	import Dialog from '$lib/components/dialog/Dialog.svelte';
	import { NewAddressService } from '../../service/address';
	import {
		createAddressValidationSchema,
		updateAddressValidationSchema,
		type AddressCreateForm,
		type AddressCreateReq,
		type AddressGetAllRes,
		type AddressUpdateReq
	} from '../../types/address';
	import Map from '$lib/components/map/Map.svelte';
	import AddressSkeletonCard from '$lib/components/card/AddressSkeletonCard.svelte';
	import AddressCard from '$lib/components/card/AddressCard.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import InputField from '$lib/components/form/InputField.svelte';
	import type { ValidationError } from '../../types/error';
	import TextArea from '$lib/components/form/TextArea.svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import { transformZodError } from '$util/error';
	import { toast } from 'svelte-sonner';
	import { NewAddressRepository } from '../../repository/address';

	let addresses = $state<AddressGetAllRes[]>([]);
	let selectedAddress = $state<AddressGetAllRes>();

	let mapDialogOpen = $state(false);
	let addressFormDialogOpen = $state(false);

	let errors = $state<ValidationError[]>([]);
	let addressForm = $state<AddressCreateForm>({
		name: '',
		lat: null,
		lng: null,
		province: '',
		city: '',
		detail: ''
	});
	let isEditAction = $state(false);

	const addressRepo = NewAddressRepository();
	const addressService = NewAddressService(addressRepo);

	const getAllAddress = addressService.getAll();
	const createAddress = addressService.create();
	const updateAddress = addressService.update();

	getAllAddress.subscribe((res) => {
		if (res.isSuccess) {
			addresses = res.data;
		}
	});

	createAddress.subscribe((res) => {
		if (res.isSuccess) {
			toast.success('Address added successfully', { duration: 2500 });
			$getAllAddress.refetch();
		} else if (res.isError) {
			toast.success('Failed to add a new address', { duration: 2500 });
			console.error(res.error);
		}

		if (!res.isPending) {
			addressFormDialogOpen = false;
		}
	});

	updateAddress.subscribe((res) => {
		if (res.isSuccess) {
			toast.success('Address updated successfully', { duration: 2500 });
			$getAllAddress.refetch();
		} else if (res.isError) {
			toast.success('Failed to update address', { duration: 2500 });
			console.error(res.error);
		}

		if (!res.isPending) {
			addressFormDialogOpen = false;
		}
	});

	function onClickShowMapDetail(a: AddressGetAllRes) {
		mapDialogOpen = true;
		selectedAddress = a;
	}

	function handleOnFormSubmit() {
		if (!isEditAction) {
			const { data, error, success } = createAddressValidationSchema.safeParse(addressForm);

			if (!success) {
				errors = transformZodError(error);
				return;
			}

			const req: AddressCreateReq = { ...data };

			$createAddress.mutate(req);
		} else {
			const { data, error, success } = updateAddressValidationSchema.safeParse(addressForm);

			if (!success) {
				errors = transformZodError(error);
				return;
			}

			const req: AddressUpdateReq = { id: selectedAddress?.id!, ...data };

			$updateAddress.mutate(req);
		}
	}

	function handleOnPointMarked(lat: number, lng: number) {
		addressForm.lat = lat;
		addressForm.lng = lng;
	}

	function resetForm() {
		addressForm = {
			name: '',
			lat: null,
			lng: null,
			province: '',
			city: '',
			detail: ''
		};
		errors = [];
	}

	function onClickAddButton() {
		addressFormDialogOpen = true;
		isEditAction = false;
		resetForm();
	}

	function onClickEditBtn(a: AddressGetAllRes) {
		addressFormDialogOpen = true;
		isEditAction = true;
		selectedAddress = a;
		setForm(a);
	}

	function setForm(a: AddressGetAllRes) {
		addressForm = a;
	}

	$inspect(selectedAddress);
</script>

<div class="mt-14">
	<h1 class="text-center text-2xl font-medium">Addresses</h1>

	<Button
		class="ml-auto mt-10"
		onclick={onClickAddButton}>Add New</Button
	>
	<div class="mt-4 grid grid-flow-row gap-y-5">
		{#if $getAllAddress.isPending || $getAllAddress.isLoading}
			<AddressSkeletonCard />
			<AddressSkeletonCard />
			<AddressSkeletonCard />
		{:else}
			{#each addresses as a}
				<AddressCard data={a} onClickOpenMapDetailFn={() => onClickShowMapDetail(a)} onClickEditButtonFn={() => onClickEditBtn(a)} />
			{:else}
				<span>No Address</span>
			{/each}
		{/if}
	</div>
</div>

<Dialog bind:isOpen={mapDialogOpen}>
	{#snippet body()}
		<Map lat={selectedAddress?.lat ?? undefined} lng={selectedAddress?.lng ?? undefined} setMarkerOnCenter />
	{/snippet}

	{#snippet footer()}
		<AlertDialog.Cancel class="w-full">Close</AlertDialog.Cancel>
	{/snippet}
</Dialog>

<Dialog bind:isOpen={addressFormDialogOpen} class="max-h-[800px] overflow-auto">
	{#snippet body()}
		<h1 class="text-xl font-medium">{isEditAction ? 'Edit Address' : 'Add New Address'}</h1>
		<form class="mt-10 grid grid-cols-1 gap-6 gap-x-5 lg:grid-cols-2 lg:gap-y-8">
			<InputField type="text" label="Name" name="name" {errors} bind:value={addressForm.name} class="col-span-full focus:border-none" />
			<Map
				onPointMarked={handleOnPointMarked}
				enableMarkerControl={true}
				class="col-span-full max-h-72"
				lat={selectedAddress?.lat ?? undefined}
				lng={selectedAddress?.lng ?? undefined}
				setMarkerOnCenter={isEditAction}
			/>
			<InputField type="text" label="Province" name="province" {errors} bind:value={addressForm.province} class="focus:border-none" />
			<InputField type="text" label="City" name="city" {errors} bind:value={addressForm.city} class="focus:border-none" />
			<TextArea label="Detail" name="detail" {errors} bind:value={addressForm.detail} class="col-span-full focus:border-none" />
		</form>
	{/snippet}

	{#snippet footer()}
		<AlertDialog.Cancel onclick={resetForm} disabled={$createAddress.isPending || $updateAddress.isPending}>Close</AlertDialog.Cancel>
		<Button disabled={$createAddress.isPending || $updateAddress.isPending} onclick={handleOnFormSubmit}>
			{#if $createAddress.isPending || $updateAddress.isPending}
				<LoaderCircle class="animate-spin" />
			{/if}
			Save
		</Button>
	{/snippet}
</Dialog>
