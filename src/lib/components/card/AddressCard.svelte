<script lang="ts">
	import { Edit } from 'lucide-svelte';
	import type { AddressGetAllRes } from '../../../types/address';
	import Button from '../ui/button/button.svelte';

	type Props = {
		data: AddressGetAllRes;
		onClickOpenMapDetailFn?: () => void;
		onClickEditButtonFn: () => void;
	};

	let { data, onClickOpenMapDetailFn, onClickEditButtonFn }: Props = $props();
</script>

<div class="grid grid-flow-row gap-y-2 rounded-md border-t p-8 shadow-md">
	<div class="flex items-center gap-x-3">
		<h5 class="font-medium">{data.name}</h5>
		<button onclick={onClickEditButtonFn}>
			<Edit class="text-yellow-500" />
		</button>
	</div>
	<span>{data.city}, {data.province}</span>
	<p>{data.detail}</p>
	{#if data.lat != null}
		<Button variant="outline" onclick={onClickOpenMapDetailFn} class="w-fit">Show on Map</Button>
	{/if}
</div>
