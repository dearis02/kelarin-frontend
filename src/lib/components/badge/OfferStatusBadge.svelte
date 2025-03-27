<script lang="ts">
	import { cn } from '$lib/utils';
	import { OfferStatus } from '../../../types/offer';
	import Badge from '../ui/badge/badge.svelte';

	type Props = {
		status: OfferStatus;
		class?: string;
	};

	let { class: className, status }: Props = $props();
	let classByStatus = $state('');

	$effect(() => {
		switch (status) {
			case OfferStatus.PENDING:
				classByStatus = 'bg-yellow-500 text-white hover:bg-opacity-90';
				break;
			case OfferStatus.ACCEPTED:
				classByStatus = 'bg-green-500 text-white hover:bg-opacity-90';
				break;
			case OfferStatus.REJECTED:
				classByStatus = 'bg-red-500 text-white hover:bg-opacity-90';
				break;
			default:
				classByStatus = 'bg-gray-300 text-white hover:bg-opacity-90';
				break;
		}
	});
</script>

<Badge class={cn('font-medium leading-none', classByStatus, className)}>{status.toUpperCase()}</Badge>
