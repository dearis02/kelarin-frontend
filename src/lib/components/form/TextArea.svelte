<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { TextAreaField } from '../../../types/components/form-field';
	import Label from '../ui/label/label.svelte';
	import Textarea from '../ui/textarea/textarea.svelte';

	let { value = $bindable(), class: className, errors = $bindable(), ...restProps }: TextAreaField = $props();

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

<div class={cn('flex flex-col gap-y-2', className)}>
	<Label for={restProps.name} class="text-sm font-medium">{restProps.label}</Label>
	<Textarea
		id={restProps.name}
		class={cn('bg-white', isError ? 'border-red-500' : '')}
		bind:value
		{...restProps}
		oninput={(e) => {
			onInput();
			restProps.oninput?.(e);
		}}
	/>
	{#if isError}
		<p class="text-sm text-red-500">{errMessage}</p>
	{/if}
</div>
