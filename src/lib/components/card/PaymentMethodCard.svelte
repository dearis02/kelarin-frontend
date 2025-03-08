<script lang="ts">
	import * as RadioGroup from '$lib/components/ui/radio-group/index';
	import { cn } from '$lib/utils';
	import type { PaymentMethodGetAllRes } from '../../../types/payment_method';
	import Label from '../ui/label/label.svelte';

	type Props = {
		data: PaymentMethodGetAllRes;
		selected: boolean;
	};

	let { data, selected }: Props = $props();
</script>

<div class={cn('flex cursor-pointer items-center gap-x-2 rounded-md px-4 py-3 shadow shadow-border', selected && 'outline outline-primary')}>
	<RadioGroup.Item value={data.id} id={data.id} />
	<Label class="flex w-full cursor-pointer items-center gap-x-5" for={data.id}>
		<img src={data.logo_url} class="h-[70px] w-[100px]" alt={data.name} />
		<span>{data.name}</span>
	</Label>
</div>
