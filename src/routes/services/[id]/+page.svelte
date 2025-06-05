<script lang="ts">
	import Carousel from '$lib/components/carousel/Carousel.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index';
	import * as Select from '$lib/components/ui/select';
	import {
		CalendarCheck,
		ChevronRight,
		ChevronLeft,
		CircleCheck,
		CircleX,
		Star,
		MessageCircleMore,
		MapPin,
		Smartphone,
		Phone,
		CalendarX,
		LoaderCircle,
		CircleCheckBig,
		X
	} from 'lucide-svelte';
	import { COLOR_PRIMARY } from '../../../types/color';
	import Button from '$lib/components/ui/button/button.svelte';
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils';
	import type { PageProps } from './$types';
	import { formatRupiah, formatRupiahRange } from '$util/format_rupiah';
	import Dialog from '$lib/components/dialog/Dialog.svelte';
	import { offerSendService } from '../../../service/offer';
	import { offerCreateValidationSchema, type OfferCreateForm, type OfferCreateReq } from '../../../types/offer';
	import type { ValidationError } from '../../../types/error';
	import { transformZodError } from '$util/error';
	import InputField from '$lib/components/form/InputField.svelte';
	import TextArea from '$lib/components/form/TextArea.svelte';
	import { addressGetAllService } from '../../../service/address';
	import Label from '$lib/components/ui/label/label.svelte';
	import { AxiosError, HttpStatusCode } from 'axios';
	import { chatCreateRoom } from '../../../service/chat';
	import { selectedChatRoomID } from '$store/chat';

	let props: PageProps = $props();
	let { service } = props.data;

	service.delivery_methods = service.delivery_methods.map((m) => m.charAt(0).toUpperCase() + m.slice(1));

	const iconSize = 30;

	let descriptionRef = $state<HTMLParagraphElement>();
	let showMoreDescBtn = $state(false);
	let showMoreDescBtnRef = $state<HTMLButtonElement>();
	let descExpanded = $state(false);

	let alertDialogOpen = $state(false);
	let alertDialogMsg = $state('failed to send offer, try again later');

	let sendOfferFormDialogOpen = $state(false);
	let sendOfferForm = $state<OfferCreateForm>({
		service_id: service.id,
		address_id: '',
		detail: '',
		service_cost: Number(service.fee_start_at),
		service_start_date: '',
		service_end_date: '',
		service_start_time: '',
		service_end_time: ''
	});
	let errors = $state<ValidationError[]>([]);

	const sendOfferService = offerSendService();
	const getAllAddressService = addressGetAllService();
	const chatServiceCreateRoom = chatCreateRoom();

	const selectedAddress = $derived.by(() => {
		const address = $getAllAddressService.data?.find((a) => a.id == sendOfferForm.address_id);

		if (address) {
			return `${address.name} | ${address.city}, ${address.province}`;
		}
	});

	sendOfferService.subscribe((res) => {
		if (res.isSuccess) {
			alertDialogOpen = true;
			sendOfferFormDialogOpen = false;
		}

		if (res.isError) {
			if (res.error instanceof AxiosError) {
				const resCode = res.error.response?.status;
				const errorsRes = res.error.response?.data.errors as ValidationError[];

				errors = errorsRes;

				if (resCode === HttpStatusCode.Forbidden) {
					sendOfferFormDialogOpen = false;
					alertDialogMsg = res.error.response?.data.message;
					alertDialogOpen = true;
				} else {
					alertDialogOpen = true;
				}
			} else {
				alertDialogOpen = true;
			}
		}
	});

	function onClickShowMoreDescBtn() {
		if (showMoreDescBtnRef && descriptionRef) {
			descriptionRef.classList.toggle('line-clamp-5');

			if (descriptionRef.classList.contains('line-clamp-5')) {
				descExpanded = false;
			} else {
				descExpanded = true;
			}
		}
	}

	function formatDate(date: string): string {
		const d = new Date(date);

		return d.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long'
		});
	}

	function onSendOfferFormSubmit() {
		const { data, error, success } = offerCreateValidationSchema(Number(service.fee_start_at)).safeParse(sendOfferForm);
		if (!success) {
			errors = transformZodError(error);
			return;
		}

		const req: OfferCreateReq = { ...data };
		$sendOfferService.mutate(req);
	}

	function resetForm() {
		sendOfferForm = {
			service_id: service.id,
			address_id: '',
			detail: '',
			service_cost: Number(service.fee_start_at),
			service_start_date: '',
			service_end_date: '',
			service_start_time: '',
			service_end_time: ''
		};
	}

	chatServiceCreateRoom.subscribe((res) => {
		if (res.isSuccess) {
			$selectedChatRoomID = res.data.room_id;
		}
	});

	function openChatRoom() {
		$chatServiceCreateRoom.mutate({
			service_id: service.id
		});
	}

	$effect(() => {
		if (!sendOfferFormDialogOpen) {
			errors = [];
			resetForm();
		}
	});

	$effect(() => {
		if (sendOfferForm.service_cost == null && sendOfferFormDialogOpen) {
			sendOfferForm.service_cost = Number(service.fee_start_at);
		}
	});

	onMount(() => {
		if (descriptionRef) {
			if (descriptionRef.scrollHeight > descriptionRef.clientHeight) {
				showMoreDescBtn = true;
			}
		}
	});

	$inspect(sendOfferForm);
</script>

<div class="mt-4 w-full md:mt-16">
	<div class="hidden grid-flow-col gap-x-4 gap-y-3 lg:grid lg:max-h-80 lg:grid-cols-12 lg:grid-rows-2">
		<!-- <img src="https://placehold.co/350x400/png" alt="" class="h-full w-full object-cover lg:col-span-5 lg:row-span-2" />
		<img src="https://placehold.co/600x400/png" alt="" class="h-full w-full object-cover lg:col-span-4" />
		<img src="https://placehold.co/600x400/png" alt="" class="h-full w-full object-cover lg:col-span-4" />
		<img src="https://placehold.co/300x600/png" alt="" class="h-full w-full object-cover lg:col-span-3 lg:row-span-2" /> -->

		<img src={service.image_urls[0]} alt="" class="h-full w-full object-cover lg:col-span-5 lg:row-span-2" loading="lazy" />
		<img src={service.image_urls[1] ?? 'https://placehold.co/600x400/png'} alt="" class="h-full w-full object-cover lg:col-span-4" loading="lazy" />
		<img src={service.image_urls[2] ?? 'https://placehold.co/600x400/png'} alt="" class="h-full w-full object-cover lg:col-span-4" loading="lazy" />
		<img
			src={service.image_urls[3] ?? 'https://placehold.co/300x600/png'}
			alt=""
			class="h-full w-full object-cover lg:col-span-3 lg:row-span-2"
			loading="lazy"
		/>
	</div>
	<div class="w-full lg:hidden">
		<Carousel class="mx-auto h-80 w-full" images={service.image_urls} />
	</div>
	<div class="mt-12 grid grid-rows-1 gap-x-14 gap-y-7 xl:grid-flow-col xl:grid-cols-12">
		<div class="order-2 xl:order-1 xl:col-span-8">
			<div class="grid grid-flow-row gap-y-6">
				<div class="h-fit">
					<h1 class="text-2xl font-medium">{service.name}</h1>
					<span class="my-1 block">{service.delivery_methods.join('/')}</span>
					<div class="flex w-fit items-center justify-evenly gap-x-2 text-sm">
						<Star fill={COLOR_PRIMARY} strokeWidth="0" />
						<span>{service.received_rating_average}</span>
						<span>|</span>
						<span>{service.received_rating_count} {service.received_rating_count > 1 ? 'Reviews' : 'Review'}</span>
					</div>
				</div>
				<!-- divider -->
				<div class="col-span-full h-[1px] w-full bg-primary"></div>
				<!-- divider -->
				<h1 class="font-semibold">Service Rules</h1>
				<section class="relative grid w-full grid-flow-row justify-items-start gap-x-5 gap-y-6 lg:grid-cols-2">
					<!-- inclusion -->
					<div class="grid grid-flow-row place-items-start gap-y-[10px] py-4 text-justify">
						{#each service.rules.filter((r) => r.type == 'inclusion') as rule}
							<div class="grid grid-flow-col-dense gap-x-2">
								<CircleCheck class="text-primary" size={iconSize} />
								<span class="self-center text-sm">{rule.name}</span>
							</div>
						{/each}
					</div>
					<!-- end inclusion -->

					<div class="left-1/2 h-[1px] w-full bg-accent lg:absolute lg:z-20 lg:block lg:h-full lg:w-[1px]"></div>

					<!-- exclusion -->
					<div class="grid grid-flow-row justify-items-start gap-y-[10px] py-4 text-justify">
						{#each service.rules.filter((r) => r.type == 'exclusion') as rule}
							<div class="grid grid-flow-col-dense gap-x-2">
								<CircleX class="text-red-500" size={iconSize} />
								<span class="self-center text-sm">{rule.name}.</span>
							</div>
						{/each}
					</div>
					<!-- end exclusion -->
				</section>

				<!-- divider -->
				<div class="col-span-full mt-8 h-[1px] w-full bg-primary"></div>
				<!-- divider -->

				<div class="py-8 pt-4">
					<p class="line-clamp-5 text-justify" bind:this={descriptionRef}>
						{service.description}
					</p>
					{#if showMoreDescBtn}
						<button bind:this={showMoreDescBtnRef} onclick={onClickShowMoreDescBtn} type="button" class="mt-4 flex items-center gap-x-2">
							<span class={cn('font-bold', { 'order-1': !descExpanded, 'order-2': descExpanded })}>{!descExpanded ? 'Show more' : 'Show less'}</span>
							{#if !descExpanded}
								<ChevronRight class="order-2" />
							{:else}
								<ChevronLeft class="order-1" />
							{/if}
						</button>
					{/if}
				</div>

				<!-- divider -->
				<div class="col-span-full mt-8 h-[1px] w-full bg-primary"></div>
				<!-- divider -->

				<div class="grid grid-flow-row gap-x-4 gap-y-8 lg:grid-flow-col-dense lg:gap-x-10">
					<div class="grid grid-cols-3 justify-start gap-x-5 gap-y-4 sm:grid-flow-col-dense sm:grid-cols-none">
						<img src={service.service_provider.logo_image_url} alt="" class="h-20 max-w-20 rounded-full object-cover" />
						<div class="col-span-2 flex flex-col gap-y-1 sm:col-auto">
							<h3 class="text-lg font-medium">{service.service_provider.name}</h3>
							<div class="grid grid-flow-col-dense items-center justify-start gap-x-2">
								<Star fill="#F8BD00" strokeWidth="0" />
								<span>{service.service_provider.received_rating_average}</span>
								<span>|</span>
								<span>
									{service.service_provider.received_rating_count}
									{service.service_provider.received_rating_count > 1 ? 'Reviews' : 'Review'}
								</span>
							</div>
							<p class="text-gray-500">Joined since {formatDate(service.service_provider.joined_at)}</p>
						</div>
						<button
							class="col-span-full hidden h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg sm:col-auto sm:flex"
							onclick={openChatRoom}
						>
							<MessageCircleMore class="text-white" size="38" />
						</button>
						<Button class="col-span-full w-full sm:hidden">Chat Now</Button>
					</div>
					<div class="grid grid-flow-col-dense justify-start gap-x-2 lg:order-2 lg:text-justify">
						<MapPin fill={COLOR_PRIMARY} strokeWidth="1" color="white" size="30" />
						<div>
							<p class="text-lg font-medium">
								{#if service.service_provider.province != ''}
									{service.service_provider.province} , {service.service_provider.city}
								{:else}
									Unknown
								{/if}
							</p>
							<p>{service.service_provider.address}</p>
						</div>
					</div>
				</div>
				<div class="grid grid-flow-col-dense place-content-start gap-x-4 lg:order-3 lg:gap-x-10">
					<div class="flex items-center gap-x-2">
						<Smartphone class="text-primary" size="20" />
						<span>{service.service_provider.mobile_phone_number}</span>
					</div>
					<div class="flex items-center gap-x-2">
						<Phone fill={COLOR_PRIMARY} size="20" strokeWidth="0" />
						<span>{service.service_provider.telephone != '' ? service.service_provider.telephone : '-'}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="order-1 cursor-default xl:order-2 xl:col-span-4 xl:mt-8">
			<div class="grid h-fit w-full grid-flow-row grid-cols-2 items-center gap-y-5 rounded-lg bg-white p-6 shadow-lg lg:shadow-2xl">
				{#if service.is_available}
					<div class="col-span-full flex items-center gap-x-2">
						<i><CalendarCheck class="text-primary" /></i>
						<span class="text-sm">Available</span>
					</div>
				{:else}
					<div class="col-span-full flex items-center gap-x-2">
						<i><CalendarX class="text-red-500" /></i>
						<span class="text-sm">Not Available</span>
					</div>
				{/if}
				<div class="col-span-full">
					<span class="mb-1 block text-[#898989]">Fee</span>
					<span class="text-xl font-bold">{formatRupiahRange(service.fee_start_at, service.fee_end_at)} </span>
				</div>
				<Button class="col-span-full text-[16px] font-bold" onclick={() => (sendOfferFormDialogOpen = true)}>Send an Offer</Button>
				<span class="text-start text-sm">Kelarin platform fee</span>
				<span class="text-end text-sm">RP 5.000</span>
				<div class="col-span-full h-[1px] w-full bg-primary"></div>
				<span class="self-end text-sm font-medium">Total before taxes</span>
				<div class="flex flex-col gap-y-1 self-end">
					<span class="text-end font-medium text-[#898989]">Start From</span>
					<span class="text-end text-sm font-medium">{formatRupiahRange(Number(service.fee_start_at) + 5000, Number(service.fee_end_at) + 5000)} </span>
				</div>
			</div>
		</div>
	</div>
</div>

<Dialog bind:isOpen={sendOfferFormDialogOpen}>
	{#snippet body()}
		<h1 class="mb-10 text-center text-xl font-medium text-black">Send Offer</h1>
		<form class="grid grid-flow-row gap-x-4 gap-y-6 text-black md:grid-cols-2">
			<div class="relative col-span-full">
				<Label>Address</Label>
				<Select.Root type="single" name="address_id" bind:value={sendOfferForm.address_id}>
					<Select.Trigger class="mt-2 w-full bg-white">{selectedAddress ?? 'Select address'}</Select.Trigger>
					<Select.Content class="bg-white">
						<Select.Group>
							<Select.GroupHeading>Address</Select.GroupHeading>
							{#each $getAllAddressService.data as a}
								<Select.Item value={a.id} label={a.name} />
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
				{#if errors?.find((err) => err.field === 'address_id')}
					<p class="absolute -bottom-6 text-sm text-red-500">{errors.find((err) => err.field === 'address_id')?.message}</p>
				{/if}
			</div>
			<TextArea label="Detail" name="detail" {errors} bind:value={sendOfferForm.detail} class="col-span-full focus:border-none" />
			<div class="relative col-span-full">
				<InputField
					type="number"
					label="Service Cost in Rupiah"
					name="service_cost"
					min={Number(service.fee_start_at)}
					{errors}
					bind:value={sendOfferForm.service_cost}
					class="focus:border-none"
				/>
				<p class="absolute -bottom-6 right-0 text-end text-sm font-bold text-primary">Min cost {formatRupiah(service.fee_start_at)}</p>
			</div>
			<InputField
				type="date"
				label="Service Start Date"
				name="service_start_date"
				{errors}
				bind:value={sendOfferForm.service_start_date}
				class="focus:border-none"
			/>
			<InputField type="date" label="Service End Date" name="service_end_date" {errors} bind:value={sendOfferForm.service_end_date} class="focus:border-none" />
			<InputField
				type="time"
				label="Service Start Time"
				name="service_start_time"
				{errors}
				bind:value={sendOfferForm.service_start_time}
				class="focus:border-none"
			/>
			<InputField type="time" label="Service End Time" name="service_end_time" {errors} bind:value={sendOfferForm.service_end_time} class="focus:border-none" />
		</form>
	{/snippet}

	{#snippet footer()}
		<AlertDialog.Cancel disabled={$sendOfferService.isPending}>Cancel</AlertDialog.Cancel>
		<Button onclick={onSendOfferFormSubmit} disabled={$sendOfferService.isPending}>
			{#if $sendOfferService.isPending}
				<LoaderCircle class="animate-spin" />
			{/if}
			Send
		</Button>
	{/snippet}
</Dialog>

<!-- send offer result dialog -->
<Dialog bind:isOpen={alertDialogOpen} class="md:max-w-md" useDefaultFooter={false}>
	{#snippet body()}
		<div class="grid w-full grid-flow-row place-items-center gap-y-4 text-black">
			<h1 class="text-xl font-medium">Offer</h1>
			{#if $sendOfferService.isSuccess}
				<CircleCheckBig size="40" class="text-primary" />
				<p>Offer has been sent</p>
			{:else if $sendOfferService.isError}
				<X size="40" class="text-red-500" />
				<p>Failed to send offer</p>
				<p>{alertDialogMsg}</p>
			{/if}
		</div>
	{/snippet}
	{#snippet footer()}
		{#if $sendOfferService.isSuccess}
			<a href="/offers">
				<Button class="w-full">Go to Offers</Button>
			</a>
		{/if}
		<Button variant="outline" class="mx-auto w-full" onclick={() => (alertDialogOpen = false)}>Close</Button>
	{/snippet}
</Dialog>
