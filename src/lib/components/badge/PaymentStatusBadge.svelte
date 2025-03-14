<script lang="ts">
	import { cn } from '$lib/utils';
	import { PaymentStatus } from '../../../types/payment';

	type Props = {
		class?: string;
		status: PaymentStatus;
	};

	let { class: className, status }: Props = $props();

	let colorByStatus = $state('');
	$effect(() => {
		switch (status) {
			case PaymentStatus.PENDING:
				colorByStatus = 'bg-yellow-500 text-yellow-800';
				break;
			case PaymentStatus.PAID:
				colorByStatus = 'bg-green-500 text-white';
				break;
			case (PaymentStatus.FAILED, PaymentStatus.CANCELED):
				colorByStatus = 'bg-red-500 text-red-800';
				break;
			case PaymentStatus.EXPIRED:
				colorByStatus = 'bg-gray-500 text-gray-800';
				break;
		}
	});
</script>

<span class={cn('inline-flex items-center rounded-full px-5 py-2 text-base font-medium', colorByStatus, className)}>{status.toUpperCase()}</span>
