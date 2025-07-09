<script lang="ts">
	import Icon from '@iconify/svelte';

	type Props = {
		id: string;
		userName: string;
		rating: number;
		comment: string;
		createdAt: string;
	};

	let { data }: { data: Props } = $props();
</script>

<div class="flex flex-col items-start gap-2">
	<div class="flex w-full items-start justify-between">
		<div class="flex-grow">
			<p class="font-semibold">{data.userName}</p>
			<p class="text-sm text-gray-500">{new Date(data.createdAt).toLocaleDateString()}</p>
		</div>
		<div class="flex items-center gap-1">
			{#each Array(data.rating) as _, index}
				<Icon icon="mdi:star" class="text-yellow-500" />
			{/each}
		</div>
	</div>
	<p class="mt-2 text-sm text-gray-700">
		{data.comment}
	</p>
</div>
