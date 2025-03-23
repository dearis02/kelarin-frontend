<script lang="ts">
	import { MapPin, Star } from 'lucide-svelte';
	import { COLOR_ACCENT, COLOR_PRIMARY } from '../../../types/color';
	import type { ServiceGetAllRes } from '../../../types/service';
	import { formatRupiah } from '$util/format_rupiah';
	import { goto } from '$app/navigation';

	type Props = {
		service: ServiceGetAllRes;
	};

	let { service }: Props = $props();
</script>

<div class="relative grid grid-rows-10 rounded-lg shadow-lg">
	{#if service.received_rating_count > 0}
		<div class="absolute left-[10px] top-[10px] flex items-center gap-x-2 rounded-full border border-primary bg-secondary px-2 py-[5px]">
			<Star fill={COLOR_PRIMARY} strokeWidth="0" class="text-primary" />
			<span class="font-semibold text-primary">{service.received_rating_average}</span>
		</div>
	{/if}
	<a href={`/services/${service.id}`} class="row-span-7 cursor-pointer rounded-t-lg">
		<img src={service.image_url} alt="service-img" class="h-full max-h-[300px] w-full object-cover" />
	</a>
	<div class="row-span-3 bg-white p-[14px]">
		<div class="flex items-center gap-x-2">
			<h1 class="flex-grow text-sm font-bold">{service.name}</h1>
			<span class="text-[10px] font-medium text-[#717172]">Start From</span>
			<span class="text-sm font-bold">{formatRupiah(service.fee_start_at.toString())}</span>
		</div>
		<div class="grid grid-cols-2 justify-between gap-x-[5px] py-[10px]">
			<span class="line-clamp-2 text-[10px] text-[#717172]">
				{service.address}
			</span>
			<div class="ml-auto gap-x-1 overflow-hidden text-ellipsis text-nowrap" style="line-height: 8px;">
				<MapPin class="inline-block basis-5 text-primary" size={16} />
				<span class="inline text-xs uppercase">{service.province}</span>
			</div>
		</div>
		{#if service.received_rating_count > 0}
			<div class="ml-auto mt-2 flex w-fit items-center gap-x-1">
				<Star fill={COLOR_ACCENT} strokeWidth="0" size={15} class="inline-block" />
				<span class="text-xs"
					>{service.received_rating_count}
					{service.received_rating_count > 1 ? 'Reviews' : 'Review'}</span
				>
			</div>
		{/if}
	</div>
</div>
