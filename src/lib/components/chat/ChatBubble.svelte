<script lang="ts">
	import { cn, isSameMonth, isSameWeek, isSameYear, isSame } from '$lib/utils';
	import dayjs from 'dayjs';
	import { ChatContentType, type ChatGetByIDResMessage } from '../../../types/chat';
	import Icon from '@iconify/svelte';

	type Props = {
		data: ChatGetByIDResMessage;
		isSending?: boolean;
		sendMsgFailed?: boolean;
		previousChatSentAt?: string;
		nextChatSentAt?: string;
	};

	let { data, isSending, sendMsgFailed, previousChatSentAt, nextChatSentAt }: Props = $props();

	let chatTimeFrame = $state('');
	const dayjsNow = dayjs();

	function generateTimeFrame() {
		if (isSame(data.created_at, dayjsNow)) {
			chatTimeFrame = 'Today';
		} else if (isSameWeek(data.created_at, dayjsNow)) {
			chatTimeFrame = dayjs(data.created_at).format('dddd');
		} else if (isSameMonth(data.created_at, dayjsNow) || isSameYear(data.created_at, dayjsNow)) {
			chatTimeFrame = dayjs(data.created_at).format('ddd, DD MMM');
		} else {
			chatTimeFrame = dayjs(data.created_at).format('DD MMM YYYY');
		}
	}

	if (previousChatSentAt && nextChatSentAt) {
		if (!isSame(data.created_at, previousChatSentAt)) {
			generateTimeFrame();
		}
	} else if (!previousChatSentAt && nextChatSentAt) {
		generateTimeFrame();
	} else if (!previousChatSentAt && !nextChatSentAt) {
		generateTimeFrame();
	}
</script>

{#if chatTimeFrame !== ''}
	<p class="mx-auto w-fit rounded-full bg-gray-200 px-4 py-1 font-medium text-black">{chatTimeFrame}</p>
{/if}
<div
	class={cn(
		'flex h-fit w-fit max-w-[70%] flex-wrap justify-end gap-x-3 rounded-md px-3 py-2',
		data.is_sender ? 'justify-self-end bg-primary' : 'justify-self-start bg-gray-500'
	)}
>
	<div class="flex-grow">
		{#if data.content_type === ChatContentType.VIDEO}
			<video src={data.content} controls class="w-full" />
		{:else if data.content_type === ChatContentType.IMAGE}
			<img src={data.content} alt="img" class="h-auto w-full max-w-[200px] object-cover" />
		{:else}
			<span class="text-justify text-white">{data.content}</span>
		{/if}
	</div>
	<div class={cn('flex items-center gap-x-1 place-self-end self-end justify-self-end text-xs', data.is_sender ? 'text-slate-50' : 'text-slate-200')}>
		<p>
			{dayjs(data.created_at).format('HH:mm')}
		</p>
		{#if data.is_sender}
			<i>
				{#if isSending}
					<Icon icon="line-md:loading-alt-loop" height="24" />
				{:else if !sendMsgFailed && !data.read}
					<Icon icon="material-symbols:done" height="20" />
				{:else if data.read}
					<Icon icon="solar:check-read-linear" height="24" />
				{/if}
			</i>
		{/if}
	</div>
</div>
