<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { FormField } from '../../../types/components/form-field';
	import Label from '../ui/label/label.svelte';

	let { value = $bindable(), class: className, errors = $bindable(), ...restProps }: FormField = $props();

	let isError = $state(false);
	let errMessage = $state('');

	function onInput() {
		errors = errors?.filter((err) => err.field !== restProps.name);
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

{#if !restProps.hideLabel}
	<div class={cn('relative flex flex-col gap-y-2', className)}>
		<Label for={restProps.name} class="text-sm font-medium">{restProps.label}</Label>
		<input
			id={restProps.name}
			class={cn(
				'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
				isError ? 'border-red-500' : ''
			)}
			bind:value
			oninput={(e) => {
				onInput();
				restProps.oninput?.(e);
			}}
			{...restProps}
		/>
		{#if isError}
			<p class="absolute -bottom-6 text-sm text-red-500">{errMessage}</p>
		{/if}
	</div>
{:else}
	<div class={cn('relative', className)}>
		<input
			id={restProps.name}
			class={cn(
				'flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
				isError ? 'border-red-500' : ''
			)}
			bind:value
			oninput={(e) => {
				onInput();
				restProps.oninput?.(e);
			}}
			{...restProps}
		/>
		{#if isError}
			<p class="absolute -bottom-6 text-sm text-red-500">{errMessage}</p>
		{/if}
	</div>
{/if}
