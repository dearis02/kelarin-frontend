<script lang="ts">
	import { cn } from '$lib/utils';
	import Skeleton from '../ui/skeleton/skeleton.svelte';

	let { class: className }: { class?: string } = $props();
</script>

<div class={cn('relative grid grid-rows-10 rounded-lg shadow-lg', className)}>
	<Skeleton class="row-span-7 h-56 w-full cursor-pointer rounded-t-lg" />
	<div class="row-span-3 h-28 p-[14px]">
		<div class="flex items-center gap-x-2">
			<h1 class="flex-grow text-sm font-bold">
				<Skeleton class="h-6 w-full" />
			</h1>
			<span class="text-[10px]">
				<Skeleton class="h-5 w-full" />
			</span>
			<span class="text-sm font-bold">
				<Skeleton class="h-5 w-full" />
			</span>
		</div>
		<div class="grid grid-cols-2 justify-between gap-x-[5px] py-[10px]">
			<span class="line-clamp-2 text-[10px] text-[#717172]">
				<Skeleton class="h-10 w-full" />
			</span>
			<div class="ml-auto gap-x-1">
				<Skeleton class="h-5 w-full" />
			</div>
		</div>
		<div class="ml-auto mt-2 flex w-fit items-center gap-x-1">
			<Skeleton class="h-4 w-full" />
		</div>
	</div>
</div>
