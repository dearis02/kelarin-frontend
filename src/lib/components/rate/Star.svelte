<script lang="ts">
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';

	type Props = {
		total?: number;
		onClick?: (n: number) => void;
	};

	let { total = 5, onClick }: Props = $props();
	let starClicked = $state(0);

	function handleOnClickStar(n: number) {
		starClicked = n;
		onClick?.(n);
	}
</script>

<div class="flex w-full items-center justify-center gap-x-2">
	{#each Array(total) as _, i}
		<Icon
			icon="heroicons:star-20-solid"
			height="50"
			class={cn('cursor-pointer', i + 1 <= starClicked ? 'text-[#fcd53f]' : 'text-white')}
			stroke={i + 1 <= starClicked ? '#fcd53f' : '#000000'}
			onclick={() => handleOnClickStar?.(i + 1)}
		/>
	{/each}
</div>
