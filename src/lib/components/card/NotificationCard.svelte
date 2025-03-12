<script lang="ts">
	import type { NotificationGetAllRes } from '../../../types/notification';
	import Badge from '../ui/badge/badge.svelte';

	type Props = {
		data: NotificationGetAllRes;
	};

	let { data }: Props = $props();
</script>

<div class="grid grid-cols-12 hover:cursor-pointer hover:bg-slate-50">
	<h1 class="col-span-10 text-lg font-medium">{data.title}</h1>
	<div class="col-span-2">
		<Badge color="primary">Unread</Badge>
	</div>
	<p class="col-span-full mt-1">{data.message}</p>
</div>
