<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		class?: string;
	};

	let { class: className }: Props = $props();
</script>

<div class={cn('h-[1px] w-full bg-gray-300', className)}></div>
