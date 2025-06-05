<script lang="ts">
	import { cn } from '$lib/utils';
	import { OrderStatus } from '../../../types/order';

	type Props = {
		class?: string;
		status: OrderStatus;
	};

	let { class: className, status }: Props = $props();

	let colorByStatus = $state('');
	$effect(() => {
		switch (status) {
			case OrderStatus.PENDING:
				colorByStatus = 'bg-gray-400 text-white';
				break;
			case OrderStatus.ONGOING:
				colorByStatus = 'bg-yellow-500 text-white';
				break;
			case OrderStatus.FINISHED:
				colorByStatus = 'bg-green-500 text-white';
				break;
			case OrderStatus.EXPIRED:
				colorByStatus = 'bg-gray-700 text-white';
				break;
		}
	});
</script>

<span class={cn('inline-flex items-center rounded-full px-5 py-2 text-base font-medium', colorByStatus, className)}>{status.toUpperCase()}</span>
