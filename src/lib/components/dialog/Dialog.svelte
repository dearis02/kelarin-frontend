<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		isOpen: boolean;
		body?: Snippet;
		footer?: Snippet;
		class?: string;
	};

	let { isOpen = $bindable(), ...props }: Props = $props();
</script>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Content class={cn('md:max-w-screen-md', props.class)}>
		<AlertDialog.Header>
			<AlertDialog.Description>
				{@render props.body?.()}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer class="mt-10">
			{@render props.footer?.()}
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
