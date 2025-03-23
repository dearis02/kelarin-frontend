<script lang="ts">
	import dayjs from 'dayjs';
	import { ChatContext, type ChatGetAllRes } from '../../../types/chat';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { onDestroy, onMount } from 'svelte';

	dayjs.extend(relativeTime);

	type Props = {
		data: ChatGetAllRes;
		onClick?: () => void;
	};

	let { data, onClick }: Props = $props();

	let sentAtInterval: NodeJS.Timeout | undefined;
	let sentAt = $state('');

	function getSentAt(sentAt: string): string {
		return dayjs().to(sentAt);
	}

	onMount(() => {
		if (data.latest_message) {
			sentAt = getSentAt(data.latest_message.created_at);
		}

		sentAtInterval = setInterval(() => {
			if (data.latest_message) {
				sentAt = getSentAt(data.latest_message.created_at);
			}
		}, 60000);

		return () => {
			if (sentAtInterval) clearInterval(sentAtInterval);
		};
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="grid w-full cursor-pointer grid-cols-12 items-center justify-start gap-x-3 rounded-md border-b-[0.5px] p-2 hover:bg-muted" onclick={onClick}>
	<img src={data.service_provider.logo_url} alt="logo" class="col-span-2 h-14 w-14 rounded-full" loading="lazy" />
	<div class="col-span-10">
		<div class="flex items-center justify-between">
			<h1 class="line-clamp-1 font-semibold">{data.service_provider.name}</h1>
			<div class="relative min-w-fit">
				<span class="text-secondary">{sentAt}</span>
				{#if data.unread_message_count > 0}
					<span class="absolute -bottom-7 right-0 rounded-full bg-primary px-2 py-1 text-xs text-white">{data.unread_message_count}</span>
				{/if}
			</div>
		</div>
		{#if data.context !== ChatContext.COMMON}
			<span class="text-sm">{data.context.toUpperCase()}</span>
		{/if}
		{#if data.latest_message}
			<p class="line-clamp-1 text-muted-foreground">{data.latest_message.content}</p>
		{:else}
			<p class="line-clamp-1 text-muted-foreground">No message yet</p>
		{/if}
	</div>
</div>
