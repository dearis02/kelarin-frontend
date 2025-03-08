<script lang="ts">
	import OrderCard from '$lib/components/card/OrderCard.svelte';
	import OrderSkeletonCard from '$lib/components/card/OrderSkeletonCard.svelte';
	import PaymentMethodCard from '$lib/components/card/PaymentMethodCard.svelte';
	import Dialog from '$lib/components/dialog/Dialog.svelte';
	import { orderGetAllService } from '../../service/order';
	import type { OrderGetAllRes } from '../../types/order';
	import * as RadioGroup from '$lib/components/ui/radio-group/index';
	import { paymentMethodGetAllService } from '../../service/payment_method';
	import { PaymentMethodType, type PaymentMethodGetAllRes, type PaymentMethodGroupedByType } from '../../types/payment_method';
	import { formatRupiah } from '$util/format_rupiah';
	import { calculateAdminFee } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { paymentCreateService } from '../../service/payment';
	import { PaymentStatus, type PaymentCreateReq } from '../../types/payment';
	import { LoaderCircle } from 'lucide-svelte';

	const PLATFORM_FEE = 5000;
	let isLoading = $state(false);
	let isLoadingCreatePayment = $state(false);
	let isCheckoutDialogOpen = $state(false);
	let selectedOrder = $state<OrderGetAllRes>();
	let selectedPaymentMethodID = $state('');
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

	$inspect(selectedOrder);
	$inspect(adminFee);
	$inspect(totalFee);
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
				<OrderCard data={order} onClickPayNow={orderCardHandleOnClickPayNow} />
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
