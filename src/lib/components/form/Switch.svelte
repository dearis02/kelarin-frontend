<script lang="ts">
	import { Switch as SwitchPrimitive, type WithoutChildrenOrChild } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	import Label from '../ui/label/label.svelte';

	let {
		ref = $bindable(null),
		class: className,
		checked = $bindable(false),
		...restProps
	}: WithoutChildrenOrChild<SwitchPrimitive.RootProps> & { label: string } = $props();
</script>

<div class={cn('flex flex-col gap-y-2', className)}>
	<Label for={restProps.name} class="font-merdium text-sm">{restProps.label}</Label>
	<SwitchPrimitive.Root
		bind:ref
		bind:checked
		class="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
		{...restProps}
	>
		<SwitchPrimitive.Thumb
			class={cn(
				'pointer-events-none block size-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
			)}
		/>
	</SwitchPrimitive.Root>
</div>
