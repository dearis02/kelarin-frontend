<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	interface Props {
		title: string;
		message: string;
		imgURL?: string;
	}

	let props: Props = $props();
</script>

<div class="flex w-full gap-x-2 rounded-md border border-primary bg-white px-4 py-2 shadow-lg">
	{#if props.imgURL}
		<img src={props.imgURL} alt="" class="size-10 rounded-full border border-black object-scale-down" />
	{/if}
	<div>
		<h1 class="line-clamp-1 text-lg font-semibold">{props.title}</h1>
		<p class="mt-[2px] line-clamp-2">{props.message}</p>
	</div>
	<button class="absolute right-2 top-2" onclick={() => dispatch('closeToast')}>
		<Icon icon="basil:cross-outline" height="30" />
	</button>
</div>
