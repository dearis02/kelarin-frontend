<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { DateFormatter, type DateValue, getLocalTimeZone, today } from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button/index';
	import { Calendar } from '$lib/components/ui/calendar/index';
	import * as Popover from '$lib/components/ui/popover/index';
	import type { ValidationError } from '../../types/error';
	import Label from './ui/label/label.svelte';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	type Props = {
		value?: DateValue;
		class?: string;
		isDateUnavailable?: (date: DateValue) => boolean;
		isDateDisabled?: (date: DateValue) => boolean;
		label?: string;
		errors?: ValidationError[];
		name?: string;
		required?: boolean;
		onValueChange?: (value: DateValue) => void;
	};

	let { value = $bindable(), isDateUnavailable, isDateDisabled, class: className, errors, ...restProps }: Props = $props();

	let isError = $state(false);
	let errMessage = $state('');

	function onInput(e: DateValue | undefined) {
		errors = errors?.filter((err) => err.field !== restProps.name);
		if (e) {
			restProps?.onValueChange?.(e);
		}
	}

	function isDateBeforeToday(date: DateValue): boolean {
		return date.compare(today(getLocalTimeZone())) < 0;
	}

	$effect(() => {
		if (errors?.find((err) => err.field === restProps.name)) {
			isError = true;
			errMessage = errors.find((err) => err.field === restProps.name)?.message ?? '';
		} else {
			isError = false;
			errMessage = '';
		}
	});
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<div class="relative flex flex-col gap-y-2">
				{#if restProps.label}
					<Label for={restProps.name} class="text-sm font-medium text-black">
						{restProps.label}
						{#if restProps.required}
							<span class="text-red-500">*</span>
						{/if}
					</Label>
				{/if}
				<Button variant="outline" class={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')} {...props}>
					<CalendarIcon />
					{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
				</Button>
				{#if isError}
					<p class="absolute -bottom-6 w-fit text-sm text-red-500">{errMessage}</p>
				{/if}
			</div>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" align="start">
		<Calendar
			class="bg-white"
			type="single"
			bind:value
			isDateUnavailable={isDateUnavailable ?? isDateBeforeToday}
			isDateDisabled={isDateDisabled ?? isDateBeforeToday}
			onValueChange={(e) => {
				onInput(e);
			}}
		/>
	</Popover.Content>
</Popover.Root>
