<script lang="ts">
	import { cn } from '$lib/utils';
	import { OfferNegotiationStatus } from '../../../types/offer';
	import Badge from '../ui/badge/badge.svelte';

	type Props = {
		status: OfferNegotiationStatus;
		class?: string;
	};

	let { class: className, status }: Props = $props();
	let classByStatus = $state('');

	$effect(() => {
		switch (status) {
			case OfferNegotiationStatus.PENDING:
				classByStatus = 'bg-yellow-500 text-white';
				break;
			case OfferNegotiationStatus.ACCEPTED:
				classByStatus = 'bg-green-500 text-white';
				break;
			case OfferNegotiationStatus.REJECTED:
				classByStatus = 'bg-red-500 text-white';
				break;
			default:
				classByStatus = 'bg-gray-300 text-white';
				break;
		}
	});
</script>

<Badge class={cn('font-medium leading-none', classByStatus, className)}>{status.toUpperCase()}</Badge>
