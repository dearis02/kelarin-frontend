<script lang="ts">
	import ServiceCard from '$lib/components/card/ServiceCard.svelte';
	import { Check, ChevronsUpDown, MapPin, Search, SlidersHorizontal } from 'lucide-svelte';
	import type { PageProps } from './$types';
	import { serviceGetAll } from '../service/service';
	import Dialog from '$lib/components/dialog/Dialog.svelte';
	import type { ServiceGetAllFilter } from '../types/service';
	import { provinceGetAll } from '../service/province';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cityGetAllByProvinceID } from '../service/city';
	import BigNumber from 'bignumber.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Command from '$lib/components/ui/command/index';
	import * as Popover from '$lib/components/ui/popover/index';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import type { CityGetAllByProvinceIDRes } from '../types/city';
	import SkeletonServiceCard from '$lib/components/card/SkeletonServiceCard.svelte';
	import { onMount } from 'svelte';

	let { data }: PageProps = $props();

	let areaFilterDialogOpen = $state(false);
	let serviceFilter = $state<ServiceGetAllFilter>({
		keyword: '',
		categories: [],
		province: '',
		city: ''
	});
	let selectedProvinceID = $state<BigNumber>();
	let cities = $state<CityGetAllByProvinceIDRes[]>([]);

	let provinceComboboxOpen = $state(false);
	let cityComboboxOpen = $state(false);
	let categoryFilterComboboxOpen = $state(false);
	let categoryFilterComboboxAnchor = $state<HTMLElement>();
	let categoryFilterComboboxContent = $state<HTMLElement | null>(null);

	const serviceGetAllSvc = serviceGetAll(serviceFilter);
	const provinceGetAllSvc = provinceGetAll();

	$effect(() => {
		if (selectedProvinceID) {
			cityGetAllByProvinceID(selectedProvinceID).subscribe((query) => {
				query.refetch();

				if (query.isSuccess) {
					cities = query.data.data;
				}
			});
		}
	});

	function handleClickOutsideCategoryFilter(e: EventTarget | null) {
		if (e && !categoryFilterComboboxContent?.contains(e as Node) && !categoryFilterComboboxAnchor?.contains(e as Node)) {
			categoryFilterComboboxOpen = false;
		}
	}

	function onClickAreaFilter() {
		areaFilterDialogOpen = !areaFilterDialogOpen;
	}

	function onSelectCategory(name: string) {
		const category = serviceFilter.categories.find((c) => c == name);

		if (category) {
			serviceFilter.categories = serviceFilter.categories.filter((c) => c != category);
		} else {
			serviceFilter.categories.push(name);
		}

		$serviceGetAllSvc.refetch();
	}

	function handleOnConfirmFilter() {
		areaFilterDialogOpen = false;
		$serviceGetAllSvc.refetch();
	}

	function resetAreaFilter() {
		serviceFilter.province = '';
		serviceFilter.city = '';
		selectedProvinceID = undefined;
	}

	onMount(() => {
		window.addEventListener('click', (e) => handleClickOutsideCategoryFilter(e.target));

		return window.removeEventListener('click', (e) => handleClickOutsideCategoryFilter(e.target));
	});

	$inspect(serviceFilter.categories);
</script>

<div class="mt-8 w-full md:mt-20">
	<h1 class="hidden text-center text-lg font-bold md:block">Find The Best Service That Fit Your Needs</h1>
	<div class="mt-7 flex w-full flex-wrap justify-center gap-x-2 gap-y-3 lg:gap-x-4">
		<button
			onclick={onClickAreaFilter}
			type="button"
			class={cn(
				'order-2 flex items-center justify-center rounded-full border-2 border-primary bg-white px-6 focus:border-primary lg:order-1',
				selectedProvinceID != undefined ? 'bg-primary' : ''
			)}
		>
			<MapPin class={cn('mx-auto my-auto text-primary', selectedProvinceID != undefined ? 'text-white' : '')} size="30" />
		</button>
		<div class="relative order-1 basis-full lg:order-2 lg:flex-none">
			<input
				type="text"
				class="w-full rounded-full border-2 border-primary bg-white px-7 py-4 focus:outline-primary focus:ring-0 focus:ring-offset-0 md:min-h-11 lg:min-w-[460px]"
				placeholder="Start your search"
				bind:value={serviceFilter.keyword}
			/>
			<button type="button" class="absolute right-[18px] top-1/2 -translate-y-1/2 rounded-full bg-primary p-2" onclick={handleOnConfirmFilter}>
				<Search class="text-white" size="20" />
			</button>
		</div>
		<button
			bind:this={categoryFilterComboboxAnchor}
			type="button"
			class={cn(
				'order-3 flex items-center justify-center rounded-full border-2 border-primary bg-white px-7 py-2 focus:border-primary lg:order-3',
				serviceFilter.categories.length ? 'bg-primary' : ''
			)}
			onclick={() => {
				categoryFilterComboboxOpen = !categoryFilterComboboxOpen;
			}}
			aria-expanded={categoryFilterComboboxOpen}
		>
			<SlidersHorizontal class={cn('text-primary', serviceFilter.categories.length ? 'text-white' : '')} />
		</button>
		<Popover.Root bind:open={categoryFilterComboboxOpen}>
			<Popover.Content align="start" customAnchor={categoryFilterComboboxAnchor} bind:ref={categoryFilterComboboxContent}>
				<Command.Root class="bg-white">
					<Command.Input placeholder="Search category..." class="h-9" />
					<Command.List>
						<Command.Empty>Category not found</Command.Empty>
						<Command.Group>
							{#each data.serviceCategories as category}
								<Command.Item
									value={category.name}
									onSelect={() => {
										onSelectCategory(category.name);
									}}
								>
									<Check class={cn(!serviceFilter.categories.includes(category.name) && 'text-transparent')} />
									{category.name}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	</div>
	<div class="mt-8 h-[0.5px] w-full bg-gray-300 md:mt-14"></div>

	<!-- categories -->
	<div class="hidden gap-x-3 overflow-x-auto text-nowrap py-4 font-bold lg:flex">
		{#each data.serviceCategories as category}
			<button
				class={cn(
					'cursor-pointer rounded-full bg-white px-6 py-2 text-primary shadow-md ring-1 ring-primary hover:bg-opacity-95',
					serviceFilter.categories.includes(category.name) && 'bg-primary text-white'
				)}
				onclick={() => onSelectCategory(category.name)}
			>
				{category.name.toUpperCase()}
			</button>
		{/each}
	</div>
	<!-- end of categories -->

	<div class="mt-4 grid grid-cols-1 justify-center gap-x-[18px] gap-y-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#if $serviceGetAllSvc.isFetching}
			<SkeletonServiceCard />
			<SkeletonServiceCard class="hidden md:block" />
			<SkeletonServiceCard class="hidden md:block" />
			<SkeletonServiceCard class="hidden md:block" />
		{:else}
			{#each $serviceGetAllSvc.data.data as service}
				<ServiceCard {service} />
			{:else}
				<p class="col-span-full self-center text-center font-semibold">No service available</p>
			{/each}
		{/if}
	</div>
</div>

<Dialog bind:isOpen={areaFilterDialogOpen}>
	{#snippet body()}
		<h1 class="mb-10 text-center text-xl font-semibold">Area Filter</h1>

		<div class="grid w-full grid-flow-row gap-y-4">
			<div>
				<Label class="mb-2 block">Province</Label>
				<Popover.Root bind:open={provinceComboboxOpen}>
					<Popover.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" class="w-full justify-between" {...props} role="combobox" aria-expanded={provinceComboboxOpen}>
								{serviceFilter.province == '' ? 'Select province' : serviceFilter.province}
								<ChevronsUpDown class="opacity-50" />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content align="start">
						<Command.Root>
							<Command.Input placeholder="Search province..." class="h-9" />
							<Command.List>
								<Command.Empty>Province not found</Command.Empty>
								<Command.Group>
									{#each $provinceGetAllSvc.data.data as province}
										<Command.Item
											value={province.name}
											onSelect={() => {
												serviceFilter.province = province.name;
												provinceComboboxOpen = false;
												selectedProvinceID = province.id;
											}}
										>
											<Check class={cn(serviceFilter.province != province.name && 'text-transparent')} />
											{province.name}
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</div>
			<div>
				<Label class="mb-2 block">City</Label>
				<Popover.Root bind:open={cityComboboxOpen}>
					<Popover.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" class="w-full justify-between" {...props} role="combobox" aria-expanded={cityComboboxOpen}>
								{serviceFilter.city == '' ? 'Select city' : serviceFilter.city}
								<ChevronsUpDown class="opacity-50" />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content align="start">
						<Command.Root>
							<Command.Input placeholder="Search city..." class="h-9" />
							<Command.List>
								<Command.Empty>City not found</Command.Empty>
								<Command.Group>
									{#each cities as city}
										<Command.Item
											value={city.name}
											onSelect={() => {
												serviceFilter.city = city.name;
												cityComboboxOpen = false;
											}}
										>
											<Check class={cn(serviceFilter.city != city.name && 'text-transparent')} />
											{city.name}
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</div>
		</div>
	{/snippet}

	{#snippet footer()}
		<div class="ml-auto">
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<Button class="bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600" onclick={resetAreaFilter}>Reset</Button>
			<Button variant="default" onclick={handleOnConfirmFilter}>Confirm</Button>
		</div>
	{/snippet}
</Dialog>
