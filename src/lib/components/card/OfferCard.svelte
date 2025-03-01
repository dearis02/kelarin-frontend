<script lang="ts">
	import { Calendar, Clock4, Clock7, HandHelping } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import type { OfferGetAllRes } from '../../../types/offer';
	import dayjs from 'dayjs';
	import { formatRupiah } from '$util/format_rupiah';

	type Props = {
		data: OfferGetAllRes;
		onClickDetailButtonFn?: () => void;
	};

	let { data, onClickDetailButtonFn }: Props = $props();

	function formatServiceDate(startDate: Date, endDate: Date): string {
		const isSameDate = dayjs(startDate).isSame(endDate, 'day');
		const isOnTheSameYearAndMonth = dayjs(startDate).isSame(endDate, 'month');
		const isOnTheSameYear = dayjs(startDate).isSame(endDate, 'year');

		if (isSameDate) {
			return dayjs(endDate).format('DD MMM YYYY');
		} else if (isOnTheSameYearAndMonth) {
			return dayjs(startDate).format('DD') + ' - ' + dayjs(endDate).format('DD MMM YYYY');
		} else if (isOnTheSameYear) {
			return dayjs(startDate).format('DD MMM') + ' - ' + dayjs(endDate).format('DD MMM YYYY');
		}

		return dayjs(startDate).format('DD MMM YYYY') + ' - ' + dayjs(endDate).format('DD MMM YYYY');
	}
</script>

<div class="grid grid-flow-row place-content-between gap-y-2 rounded-md shadow-md">
	<div>
		<img src={data.service.image_url} alt="offer-img" class="h-[300px] w-full rounded-t-md object-cover" loading="lazy" />
		<div class="flex flex-col gap-y-4 p-5">
			<div class="w-full">
				<div class="flex items-center justify-between">
					<h1 class="text-lg font-semibold">{data.service.name}</h1>
					<div class="hidden items-center justify-between gap-x-2 text-center lg:flex">
						<Clock4 color="#717172" />
						<span>{dayjs(data.created_at).format('DD MMM YYYY HH:mm:ss')}</span>
					</div>
				</div>
				<div class="mt-1 flex items-center gap-x-2">
					<img src={data.service_provider.logo_url} alt="provider-pp" class="h-8 w-8 rounded-full object-fill" />
					<span>{data.service_provider.name}</span>
				</div>
			</div>
			<div class="grid grid-flow-row gap-y-2 py-4 lg:grid-cols-2">
				<span class="text-[#717172]">Offered Cost</span>
				<div class="flex items-center gap-x-2 lg:justify-end">
					<HandHelping size="30" class="text-primary" />
					<span class="font-medium">{formatRupiah(data.service_cost.toString())}</span>
				</div>
				<span class="text-[#717172]">Date</span>
				<div class="flex items-center gap-x-2 lg:justify-end">
					<Calendar size="24" class="text-primary" />
					<span class="font-medium">{formatServiceDate(data.service_start_date, data.service_end_date)}</span>
				</div>
				<span class="text-[#717172]">Working Hour</span>
				<div class="flex items-center gap-x-2 lg:justify-end">
					<Clock7 size="24" class="text-primary" />
					<span class="font-medium">{data.service_start_time + ' - ' + data.service_end_time}</span>
				</div>
			</div>
		</div>
	</div>
	<div class="p-5 text-center">
		{#if data.has_pending_negotiation}
			<span class="block"> Service provider service provider proposes negotiation </span>
			<span class="font-medium text-primary"> SEE DETAIL! </span>
		{/if}
		<Button class="mt-3 w-full bg-accent text-white" onclick={onClickDetailButtonFn}>Detail</Button>
	</div>
</div>
