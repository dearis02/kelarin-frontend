<script lang="ts">
	import Icon from '@iconify/svelte';
	import { OrderStatus, type OrderGetAllRes } from '../../../types/order';
	import { formatRupiah } from '$util/format_rupiah';
	import Button from '../ui/button/button.svelte';
	import dayjs from 'dayjs';
	import { getLocalTimeZoneAbbreviation } from '$lib/utils';
	import { PaymentStatus } from '../../../types/payment';

	type Props = {
		data: OrderGetAllRes;
		onClickPayNow: (order: OrderGetAllRes) => void;
		onClickShowDetail: (order: OrderGetAllRes) => void;
	};

	let { data, onClickPayNow, onClickShowDetail }: Props = $props();
	let amount = $derived(data.service_fee);
</script>

<div class="grid w-full grid-flow-row gap-y-4 rounded-md border border-primary px-8 py-6 shadow-md md:px-14 md:py-8">
	<div class="flex flex-col justify-between gap-y-2 md:flex-row md:items-center">
		<div class="flex flex-col items-start gap-x-4 md:flex-row">
			<h1 class="text-2xl font-semibold">{data.service.name}</h1>
			<button type="button" class="hidden items-center gap-x-2 rounded-lg bg-primary px-3 py-2 font-semibold text-white md:flex">
				<Icon icon="fluent:chat-48-filled" height="35" />
				<span>Chat</span>
			</button>
		</div>
		<span class="text-2xl font-semibold">{formatRupiah(String(amount))}</span>
	</div>
	<div class="flex flex-col justify-between md:flex-row md:items-center">
		<div class="flex flex-col gap-y-3">
			<div class="flex items-center gap-x-2">
				<Icon icon="iconamoon:delivery-fast-fill" height="30" />
				<span>{dayjs(data.service_date).format('DD MMMM YYYY')}</span>
			</div>
			<div class="flex items-center gap-x-2">
				<Icon icon="hugeicons:time-02" height="30" />
				<span>{`${data.service_time} ${getLocalTimeZoneAbbreviation()}`}</span>
			</div>
		</div>
		<div class="mt-8 md:mt-0">
			{#if data?.payment?.status == PaymentStatus.PENDING || data?.payment?.status == PaymentStatus.EXPIRED || !data.payment}
				<Button class="md:w-fi w-full bg-yellow-500 font-medium hover:bg-opacity-90" onclick={() => onClickPayNow(data)}>PAY NOW</Button>
			{:else if data?.payment?.status == PaymentStatus.PAID || data.payment_fulfilled}
				<div class="flex flex-col items-center">
					<Icon icon="wpf:paid" height="50" class="text-center text-primary" />
					<span class="text-gray-500">Payment Completed</span>
				</div>
			{/if}
			<Button class="mt-4 w-full shadow shadow-border" variant="outline" onclick={() => onClickShowDetail(data)}>Detail</Button>
		</div>
	</div>
	<button type="button" class="flex items-center justify-center gap-x-2 rounded-lg bg-primary px-3 py-2 font-semibold text-white md:hidden">
		<Icon icon="fluent:chat-48-filled" height="35" />
		<span>Chat</span>
	</button>
</div>
