<script lang="ts">
	import { cn } from '$lib/utils';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { cubicInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	type Props = {
		images: string[];
		ref?: HTMLElement;
		class?: string;
	};

	let { images, class: className, ref = $bindable() }: Props = $props();

	let currentIndex = $state(0);
	let direction = $state(1);

	const size = 40;

	function onClickNext() {
		direction = 1;
		currentIndex = (currentIndex + 1) % images.length;
	}

	function onClickPrev() {
		direction = -1;
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	}
</script>

<section bind:this={ref} class={cn(className)}>
	{#if images.length}
		<div class="relative h-full w-full overflow-hidden">
			{#if images.length}
				<button type="button" class="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full text-primary" onclick={onClickPrev}>
					<ChevronLeft {size} />
				</button>
			{/if}
			{#each images as image, i (i)}
				{#if i === currentIndex}
					<img
						src={image}
						alt="carousel-img"
						class="absolute left-0 top-0 h-full w-full object-cover"
						transition:fly={{ x: 100 * -direction, duration: 650, easing: cubicInOut }}
					/>
				{/if}
			{/each}
			{#if images.length}
				<button type="button" class="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full text-primary" onclick={onClickNext}>
					<ChevronRight {size} />
				</button>
			{/if}
		</div>
	{:else}
		<img src="https://placehold.co/600x400?text=empty+image" alt="" class="h-full w-full object-cover" />
	{/if}
</section>
