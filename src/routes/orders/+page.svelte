<script lang="ts">
	import OrderCard from '$lib/components/card/OrderCard.svelte';
	import OrderSkeletonCard from '$lib/components/card/OrderSkeletonCard.svelte';
	import PaymentMethodCard from '$lib/components/card/PaymentMethodCard.svelte';
	import Dialog from '$lib/components/dialog/Dialog.svelte';
	import { orderGenerateQRCodeService, orderGetAllService, orderGetByIDService } from '../../service/order';
	import { OrderStatus, type OrderGenerateQRCodeRes, type OrderGetAllRes, type OrderGetByIDRes } from '../../types/order';
	import * as RadioGroup from '$lib/components/ui/radio-group/index';
	import { paymentMethodGetAllService } from '../../service/payment_method';
	import { PaymentMethodType, type PaymentMethodGetAllRes, type PaymentMethodGroupedByType } from '../../types/payment_method';
	import { formatRupiah } from '$util/format_rupiah';
	import { calculateAdminFee, getLocalTimeZoneAbbreviation } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { paymentCreateService } from '../../service/payment';
	import { PaymentStatus, type PaymentCreateReq } from '../../types/payment';
	import { LoaderCircle } from 'lucide-svelte';
	import Icon from '@iconify/svelte';
	import Divider from '$lib/components/Divider.svelte';
	import dayjs from 'dayjs';
	import PaymentStatusBadge from '$lib/components/badge/PaymentStatusBadge.svelte';
	import { type CreateQueryResult } from '@tanstack/svelte-query';
	import type { ApiResponse } from '../../types/api';
	import { toast } from 'svelte-sonner';
	import qrcode from 'qrcode-generator';

	const PLATFORM_FEE = 5000;
	let isLoading = $state(false);
	let isLoadingCreatePayment = $state(false);
	let isCheckoutDialogOpen = $state(false);
	let selectedOrder = $state<OrderGetAllRes>();
	let selectedPaymentMethodID = $state('');
	let orderDetailDialogOpen = $state(false);
	let qrCodeDialogOpen = $state(false);
	let qrDataURL = $state<string>('');
	let qrValidDurationCounterInSecond = $state(0);

	$effect(() => {
		if (qrValidDurationCounterInSecond > 0) {
			const interval = setInterval(() => {
				if (qrValidDurationCounterInSecond > 0) {
					qrValidDurationCounterInSecond = qrValidDurationCounterInSecond - 1;
				}
			}, 1000);

			return () => {
				clearInterval(interval);
			};
		}
	});

	let selectedOrderForDetail = $state<OrderGetAllRes>();
	let order = $state<OrderGetByIDRes>();

	let orderGetByIDSvc: CreateQueryResult<ApiResponse<OrderGetByIDRes>, Error>;

	$effect(() => {
		if (selectedOrderForDetail) {
			orderGetByIDSvc = orderGetByIDService(selectedOrderForDetail.id);
			$orderGetByIDSvc.refetch();

			if ($orderGetByIDSvc.isSuccess) {
				order = $orderGetByIDSvc.data.data;
				orderDetailDialogOpen = true;
			}
		}
	});

	const orderGenerateQRCodeSvc = orderGenerateQRCodeService();

	orderGenerateQRCodeSvc.subscribe((res) => {
		if (res.isSuccess) {
			const response = res.data.data;
			qrValidDurationCounterInSecond = response.valid_duration_in_second;

			const qr = qrcode(0, 'L');
			qr.addData(response.qr_code_content);
			qr.make();

			qrDataURL = qr.createDataURL(10, 0);

			orderDetailDialogOpen = false;
			qrCodeDialogOpen = true;
		}

		if (res.isError) {
			qrCodeDialogOpen = false;
			toast.error('Failed to generate QR Code. Please try again later.', { position: 'top-right' });
		}
	});

	let adminFee = $derived.by(() => {
		if (selectedOrder && selectedPaymentMethodID != '') {
			const paymentMethod = paymentMethods.find((pm) => pm.id === selectedPaymentMethodID);
			if (paymentMethod) {
				let adminFee = calculateAdminFee(selectedOrder.service_fee, paymentMethod.admin_fee, paymentMethod.admin_fee_unit);

				return Math.ceil(adminFee);
			}
		}
	});

	let totalFee = $derived.by(() => {
		if (selectedOrder && adminFee) {
			return Number(selectedOrder.service_fee) + adminFee + PLATFORM_FEE;
		}
	});

	let orderDetailTotalFee = $derived.by(() => {
		if (order && order.payment) {
			return Number(order.service_fee) + order.payment.admin_fee + order.payment.platform_fee;
		}

		return order?.service_fee;
	});

	let groupedPaymentMethodByType = $state<PaymentMethodGroupedByType[]>([
		{
			type: PaymentMethodType.QR,
			methods: []
		},
		{
			type: PaymentMethodType.VA,
			methods: []
		}
	]);

	let paymentMethods = $state<PaymentMethodGetAllRes[]>([]);

	let orders = $state<OrderGetAllRes[]>([]);
	const orderGetAllSvc = orderGetAllService();
	orderGetAllSvc.subscribe((res) => {
		isLoading = res.isFetching;
	});

	orderGetAllSvc.subscribe((res) => {
		if (res.isSuccess) {
			orders = res.data.data;
		}
	});

	const paymentMethodGetAllSvc = paymentMethodGetAllService();
	paymentMethodGetAllSvc.subscribe((res) => {
		if (res.isSuccess) {
			res.data.data.forEach((pm) => {
				if (pm.type === PaymentMethodType.QR) {
					groupedPaymentMethodByType[0].methods.push(pm);
				} else if (pm.type === PaymentMethodType.VA) {
					groupedPaymentMethodByType[1].methods.push(pm);
				}
			});

			paymentMethods = res.data.data;
		}
	});

	const paymentCreateSvc = paymentCreateService();
	paymentCreateSvc.subscribe((res) => {
		isLoadingCreatePayment = res.isPending;

		if (res.isSuccess) {
			isCheckoutDialogOpen = false;
			window.location.href = res.data.data.payment_link;
		}
	});

	function orderCardHandleOnClickPayNow(order: OrderGetAllRes) {
		if (order.payment && order.payment.status == PaymentStatus.PENDING) {
			window.location.href = order.payment.payment_link;
		}

		selectedOrder = order;
		isCheckoutDialogOpen = true;
	}

	function onClickPayNowCheckout() {
		const req: PaymentCreateReq = {
			order_id: selectedOrder!.id,
			payment_method_id: selectedPaymentMethodID
		};

		$paymentCreateSvc.mutate(req);
	}

	function handleOnClickShowDetailOrder(order: OrderGetAllRes) {
		orderDetailDialogOpen = true;
		selectedOrderForDetail = order;
	}

	function handleShowQRCode() {
		$orderGenerateQRCodeSvc.mutate({
			order_id: order!.id
		});
	}

	$inspect(selectedOrder);
	$inspect(adminFee);
	$inspect(totalFee);
	$inspect(order);
</script>

<div class="mt-14">
	<h1 class="text-2xl font-semibold">Orders</h1>
	<div class="mt-10 grid grid-flow-row gap-y-5">
		{#if isLoading}
			<OrderSkeletonCard />
			<OrderSkeletonCard />
			<OrderSkeletonCard />
		{:else}
			{#each orders as order}
				<OrderCard data={order} onClickPayNow={orderCardHandleOnClickPayNow} onClickShowDetail={handleOnClickShowDetailOrder} />
			{/each}
		{/if}
	</div>
</div>

<Dialog bind:isOpen={isCheckoutDialogOpen} class="overflow-auto md:max-w-screen-lg">
	{#snippet body()}
		<h1 class="text-center text-2xl font-semibold text-black">Complete Your Payment</h1>

		<div class="mt-8 grid grid-flow-row gap-x-5 gap-y-5 md:mt-14 md:grid-flow-col md:grid-cols-12">
			<div class="rounded-lg px-9 py-7 text-black shadow shadow-border md:col-span-5">
				<h2 class="text-center text-xl font-semibold">Select Payment Method</h2>
				<!-- QR Code -->
				<RadioGroup.Root bind:value={selectedPaymentMethodID} class="mt-10 grid grid-flow-row gap-y-5">
					{#each groupedPaymentMethodByType as p}
						{#if p.type === PaymentMethodType.QR && p.methods.length > 0}
							<div>
								<h3 class="text-center font-semibold">QR Code</h3>
								<div class="mt-3 grid grid-flow-row gap-y-3">
									{#each p.methods as pm}
										<PaymentMethodCard data={pm} selected={pm.id === selectedPaymentMethodID} />
									{/each}
								</div>
							</div>
						{:else if p.type === PaymentMethodType.VA && p.methods.length > 0}
							<div>
								<h3 class="text-center font-semibold">Virtual Account</h3>
								<div class="mt-3 grid grid-flow-row gap-y-3">
									{#each p.methods as pm}
										<PaymentMethodCard data={pm} selected={pm.id === selectedPaymentMethodID} />
									{/each}
								</div>
							</div>
						{/if}
					{/each}
				</RadioGroup.Root>
			</div>

			<div class="h-full w-full px-10 py-8 shadow shadow-border md:col-span-7">
				<h1 class="text-center text-xl font-semibold text-black">Checkout</h1>
				<div class="mt-10 flex flex-col gap-y-3 text-black">
					<div class="flex justify-between">
						<span class="text-lg">Service Fee</span>
						<span class="float-right">{formatRupiah(selectedOrder?.service_fee ?? '0')}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-[#717172]">Admin Fee</span>
						<span class="float-right">{formatRupiah(String(adminFee ?? '0'))}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-[#717172]">Platform Fee</span>
						<span class="float-right">{formatRupiah(String(PLATFORM_FEE))}</span>
					</div>
					<div class="mt-3 flex justify-between">
						<span class="text-lg font-semibold">Total Fee</span>
						<span class="float-right text-lg font-semibold">{totalFee && formatRupiah(String(totalFee))}</span>
					</div>

					<div class="mt-10">
						<Button class="w-full bg-gray-400 hover:bg-opacity-90" onclick={() => (isCheckoutDialogOpen = false)}>Cancel</Button>
						<Button class="mt-3 w-full" onclick={onClickPayNowCheckout} disabled={isLoadingCreatePayment || selectedPaymentMethodID == ''}>
							{#if isLoadingCreatePayment}
								<LoaderCircle class="animate-spin" />
								<span>Redirecting...</span>
							{:else}
								Pay Now
							{/if}
						</Button>
					</div>
				</div>
			</div>
		</div>
	{/snippet}
</Dialog>

<Dialog bind:isOpen={orderDetailDialogOpen} class="overflow-auto" useDefaultFooter={false}>
	{#snippet body()}
		{#if $orderGetByIDSvc.isLoading}
			<div class="flex h-full items-center justify-center">
				<LoaderCircle class="animate-spin" />
			</div>
		{:else}
			<h1 class="text-center text-2xl font-semibold text-black">Order Detail</h1>
			{#if order?.payment}
				<div class="mt-5 flex items-center justify-center">
					<PaymentStatusBadge status={order.payment.status} />
				</div>
			{/if}

			<div class="mt-9 grid grid-flow-row gap-y-4 text-black">
				<div>
					<span class="text-lg font-semibold text-black">{order?.offer.service.name}</span>
					<div class="flex items-center gap-x-3">
						<img src={order?.offer.service_provider.logo_url} alt="provider-logo" class="size-10 rounded-full object-cover" />
						<span>{order?.offer.service_provider.name}</span>
					</div>
				</div>
				<div class="text-black">
					<span class="text-lg font-semibold">Service Date :</span>
					<div class="flex items-center gap-x-2">
						<Icon icon="iconamoon:delivery-fast-fill" height="31" class="" />
						<span class="text-base">{dayjs(order?.service_date).format('DD MMMM YYYY')}</span>
					</div>
				</div>
				<div class="text-black">
					<span class="text-lg font-semibold">Service Time :</span>
					<div class="flex items-center gap-x-2">
						<Icon icon="tabler:clock" height="30" />
						<span class="text-base">{order?.service_time} {getLocalTimeZoneAbbreviation()}</span>
					</div>
				</div>
				<div>
					<span class="text-lg font-semibold">Detail</span>
					<p class="text-justify">{order?.offer.detail}</p>
				</div>
			</div>
			<Divider class="my-7" />
			<div class="grid grid-flow-row gap-y-2 text-base text-black">
				{#if order?.payment}
					<div class="flex items-center justify-between">
						<span class="text-secondary">Payment Method</span>
						<img src={order?.payment.payment_method_logo_url} alt="" class="h-10 w-14 rounded-md object-fill" />
					</div>
				{/if}
				<div class="flex items-center justify-between">
					<span class="text-secondary">Service Fee</span>
					<span>{formatRupiah(order?.service_fee ?? '0')}</span>
				</div>
				{#if order?.payment}
					<div class="flex items-center justify-between">
						<span class="text-secondary">Admin Fee</span>
						<span>{formatRupiah(String(order.payment.admin_fee))}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-secondary">Platform Fee</span>
						<span>{formatRupiah(String(order.payment.platform_fee))}</span>
					</div>
				{/if}
				<div class="mt-8 flex items-center justify-between text-xl">
					<span class="font-semibold">Total</span>
					<span class="font-semibold">{formatRupiah(String(orderDetailTotalFee ?? '0'))}</span>
				</div>
			</div>
		{/if}
	{/snippet}

	{#snippet footer()}
		<!-- show if paid -->
		{#if !$orderGetByIDSvc.isLoading && !$orderGetByIDSvc.isPending && order?.payment?.status == PaymentStatus.PAID && order.status == OrderStatus.ONGOING}
			<div class="mb-4 flex w-full flex-col items-center gap-y-2">
				<span class="text-[#FFC907]"> Show this QR Code after they finish their job! </span>
				<Button class="w-full py-7 text-lg font-semibold" onclick={handleShowQRCode}>
					{#if $orderGenerateQRCodeSvc.isPending}
						<Icon icon="akar-icons:loading" class="animate-spin" />
					{:else}
						<span>Show QR Code</span>
					{/if}
				</Button>
			</div>
		{/if}
		<Button variant="outline" class="w-full py-7 text-lg font-semibold" onclick={() => (orderDetailDialogOpen = false)}>Close</Button>
	{/snippet}
</Dialog>

<Dialog bind:isOpen={qrCodeDialogOpen} class="md:max-w-80">
	{#snippet body()}
		<img src={qrDataURL} alt="qr-code" class="mx-auto h-auto w-full max-w-60" />
		{#if qrValidDurationCounterInSecond == 0}
			<p class="mt-8 text-center text-black">QR Code Expired</p>
		{:else}
			<p class="mt-8 text-center text-black">This QR Code expires in <span class="font-semibold text-red-500">{qrValidDurationCounterInSecond}</span></p>
		{/if}
	{/snippet}
	{#snippet footer()}
		<Button class="w-full" variant="outline" onclick={() => (qrCodeDialogOpen = false)}>Close</Button>
	{/snippet}
</Dialog>
