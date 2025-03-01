<script lang="ts">
	import OfferCard from '$lib/components/card/OfferCard.svelte';
	import Dialog from '$lib/components/dialog/Dialog.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import { formatRupiah } from '$util/format_rupiah';
	import { onMount, untrack } from 'svelte';
	import { offerGetAllService, offerGetByIDService } from '../../service/offer';
	import { type OfferGetByIDRes, type OfferGetAllRes } from '../../types/offer';
	import Icon from '@iconify/svelte';
	import { CalendarDate, parseDate, type DateValue } from '@internationalized/date';

	let selectedOffer = $state<OfferGetAllRes>();
	let offers = $state<OfferGetAllRes[]>([]);
	let offer = $state<OfferGetByIDRes>();
	let offerDetailDialogOpen = $state(false);
	let offerTimeZoneAbbv = $state('');

	let calendarDates = $state<CalendarDate[]>([]);

	const getAllOffer = offerGetAllService();

	$effect(() => {
		if (selectedOffer) {
			offerGetByIDService(selectedOffer.id ?? '').subscribe((res) => {
				if (res.isSuccess) {
					untrack(() => {
						offer = res.data.data;
					});
				}
			});
		}
	});

	$effect(() => {
		if (offer) {
			const serviceStartDate = parseDate(offer.service_start_date);
			const serviceEndDate = parseDate(offer.service_end_date);
			untrack(() => {
				calendarDates = [];
				generateDateRange(serviceStartDate, serviceEndDate);
			});
		}
	});

	function isSelected(date: DateValue): boolean {
		return !!calendarDates.find((c) => c.year == date.year && c.month == date.month && c.day == date.day);
	}

	function generateDateRange(start: CalendarDate, end: CalendarDate) {
		let currentDate = new CalendarDate(start.year, start.month, start.day);

		while (currentDate.compare(end) <= 0) {
			calendarDates.push(currentDate);
			currentDate = currentDate.add({ days: 1 });
		}
	}

	getAllOffer.subscribe((res) => {
		if (res.isSuccess) {
			offers = res.data.data;
		}
	});

	$effect(() => {
		const formatter = new Intl.DateTimeFormat('id-ID', { timeZone: offer?.service_time_time_zone, timeZoneName: 'short' });
		const dateStr = formatter.format(new Date());
		offerTimeZoneAbbv = dateStr.split(' ')[1];
	});

	$inspect($getAllOffer.data.data);
	$inspect(offer);
	$inspect(calendarDates);
</script>

<div class="mt-4 md:mt-20">
	<h1 class="mx-auto w-fit text-2xl font-semibold">Sent Offers</h1>
	<div class="mt-9 grid h-full grid-flow-row gap-x-5 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
		{#each offers as offer}
			<OfferCard
				data={offer}
				onClickDetailButtonFn={() => {
					selectedOffer = offer;
					offerDetailDialogOpen = true;
				}}
			/>
		{/each}
	</div>
</div>

<Dialog bind:isOpen={offerDetailDialogOpen} useDefaultFooter={false} class="overflow-y-scroll md:max-w-[600px]">
	{#snippet body()}
		<div class="grid grid-flow-row gap-y-5 text-black">
			<div class="flex items-center justify-between">
				<h1 class="text-2xl font-semibold">Offer Detail</h1>
				<Icon icon="emojione-monotone:handshake" class="text-primary" height="50" />
			</div>
			<div>
				<div class="flex items-center gap-x-5">
					<h2 class="text-xl font-semibold">{offer?.service.name}</h2>
					<button class="flex h-10 w-10 items-center justify-center rounded-full bg-primary p-2 shadow-lg">
						<Icon icon="mingcute:arrow-right-up-fill" height="26" class="text-white" />
					</button>
				</div>
				<div class="mt-2 flex items-center gap-x-4">
					<img
						src="https://akcdn.detik.net.id/visual/2023/08/14/jihyo-twice-1_11.jpeg?w=720&q=90"
						alt="provider-logo"
						class="h-[60px] w-[60px] rounded-full object-cover"
					/>
					<div class="grid grid-flow-row items-center gap-y-1">
						<span class="col-span-full text-start">{offer?.service_provider.name}</span>
						<div class="flex items-center gap-x-2">
							<Icon icon="stash:star-solid" height="28" class="text-[#F8BD00]" />
							<span>{offer?.service_provider.received_rating_average}</span>
							<span>|</span>
							<span>
								{offer?.service_provider.received_rating_count}
								{offer?.service_provider.received_rating_count && offer.service_provider.received_rating_count > 1 ? 'Reviews' : 'Review'}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div class="flex flex-col items-start">
				<span class="font-bold">Detail:</span>
				<p class="text-justify">
					{offer?.detail}
				</p>
			</div>
			<Divider />
			<Calendar type="single" class="rounded-md border bg-primary text-white shadow" weekdayFormat="long" {isSelected} readonly />
			<div class="flex w-fit items-center gap-x-3 rounded-md bg-primary px-4 py-3 text-white">
				<Icon icon="tabler:clock" height="38" />
				<span class="font-bold">{`${offer?.service_start_time} - ${offer?.service_end_time} ${offerTimeZoneAbbv}`}</span>
			</div>
			<div class="flex flex-col items-start gap-1 font-light">
				<h4 class="font-medium">{offer?.address.name}</h4>
				<span>{`${offer?.address.city}, ${offer?.address.province}`}</span>
				<span class="text-start">{offer?.address.address}</span>
			</div>
			<Divider />
			<!-- fee -->
			<div class="grid grid-cols-12 place-items-start">
				<span class="col-span-8 text-sm text-[#717172] md:col-span-8">Fee</span>
				<span class="col-span-1 justify-self-end font-medium md:col-span-2">Rp</span>
				<span class="col-span-3 justify-self-end font-medium md:col-span-2">{formatRupiah(offer?.service_cost ?? '0', false)}</span>
				<span class="col-span-8 text-sm text-[#717172] md:col-span-8">Platform Fee</span>
				<span class="col-span-1 justify-self-end font-medium md:col-span-2">Rp</span>
				<span class="col-span-3 justify-self-end font-medium md:col-span-2">5.000</span>
			</div>
			<div class="grid grid-cols-12 place-items-start">
				<span class="col-span-8 text-[18px] font-normal md:col-span-8">Total</span>
				<span class="col-span-1 justify-self-end text-[18px] font-semibold md:col-span-2">Rp</span>
				<span class="col-span-3 justify-self-end text-[18px] font-semibold text-primary md:col-span-2"
					>{formatRupiah(String(Number(offer?.service_cost ?? '0') + 5000), false)}</span
				>
			</div>
			<!-- end of fee -->
		</div>
	{/snippet}

	{#snippet footer()}
		<div class="pt-4 md:pt-10">
			<p class="text-center text-xl text-[#EDBF33]">There is pending negotiation, lets take a look !!!</p>
			<button class="mt-3 flex w-full items-center justify-center gap-x-3 rounded-lg bg-[#EDBF33] py-2 text-xl text-white hover:bg-yellow-500 md:h-14">
				<Icon icon="emojione-monotone:handshake" class="text-white" height="40" />
				<span class="font-semibold"> Show Negotiation </span>
			</button>
			<Button class="mt-6 w-full bg-gray-400 py-7 text-xl font-semibold hover:bg-gray-500" onclick={() => (offerDetailDialogOpen = false)}>Close</Button>
		</div>
	{/snippet}
</Dialog>
