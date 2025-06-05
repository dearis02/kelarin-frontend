<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import '../app.css';
	import { browser } from '$app/environment';
	import { onMount, tick, untrack, type ComponentType } from 'svelte';
	import { setAuthUser, type AuthUser } from '../store/auth';
	import { getToken, googleLoginService, isSessionExists, setLoginSession, setToken } from '../service/auth';
	import { jwtDecode } from 'jwt-decode';
	import type { AuthDecodedAccessToken } from '../types/auth';
	import { PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_WEB_SOCKET_URL } from '$env/static/public';
	import api from '$util/axios_interceptor';
	import AlertDialog from '$lib/components/dialog/AlertDialog.svelte';
	import { AxiosError, HttpStatusCode } from 'axios';
	import { isGSIClientLoaded } from '../store/google';
	import { initFirebaseMessaging, requestPermission } from '$util/firebase';
	import { Toaster } from '$lib/components/ui/sonner/index';
	import { toast } from 'svelte-sonner';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import Icon from '@iconify/svelte';
	import ChatCard from '$lib/components/card/ChatCard.svelte';
	import { chatGetAllService, chatGetByRoomIDService } from '../service/chat';
	import {
		ChatContentType,
		ChatContext,
		type ChatGetAllRes,
		type ChatGetByIDRes,
		type ChatOutboundMessage,
		type ChatWsIncoming,
		type ChatWsSendReq,
		type ChatWsSendResMetadata
	} from '../types/chat';
	import ChatBubble from '$lib/components/chat/ChatBubble.svelte';
	import { WebSocketResponseCode, type WebSocketResponse } from '../types/ws';
	import { cn, getLocalTimeZoneAbbreviation } from '$lib/utils';
	import { v7 as uuidV7 } from 'uuid';
	import dayjs from 'dayjs';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { COLOR_PRIMARY } from '../types/color';
	import { selectedChatRoomID, chatRoomOpen } from '../store/chat';

	let { children } = $props();

	let alertDialog = $state({
		open: false,
		title: '',
		message: ''
	});
	const notifToast = toast('notification');
	let ws: WebSocket | undefined;

	let chatSheetOpen = $state(false);
	let chatContainer = $state<HTMLDivElement>();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				retry: false,
				refetchOnWindowFocus: false
			}
		}
	});

	let chats = $state<ChatGetAllRes[]>([]);
	let selectedChat = $state<ChatGetAllRes>();
	let chat = $state<ChatGetByIDRes>();

	let wsConnectionOpened = $state(false);
	let chatSendReq = $state<ChatWsSendReq>({
		id: '',
		content: '',
		content_type: ChatContentType.TEXT
	});
	let failedCount = $state(0);
	let outBoundMsgs = $state<ChatOutboundMessage[]>([]);

	const googleLoginMutation = googleLoginService(queryClient, api);
	const chatGetAllSvc = chatGetAllService(queryClient);
	const chatGetByIDSvc = chatGetByRoomIDService(queryClient, () => selectedChat?.room_id ?? $selectedChatRoomID);

	chatGetAllSvc.subscribe((res) => {
		if (res.isSuccess) {
			chats = res.data;
		}
	});

	chatGetByIDSvc.subscribe((res) => {
		if (res.isSuccess) {
			chat = res.data;
		}
	});

	$effect(() => {
		if (selectedChat) {
			untrack(() => {
				$chatGetByIDSvc.refetch();
			});
		}
	});

	function handleCredentialResponse(response: any) {
		if (response.credential) {
			$googleLoginMutation.mutate({ id_token: response.credential });
		}
	}

	function handleOnGoogleLoginError(err: Error) {
		alertDialog.open = true;

		alertDialog.title = 'Login Failed';
		if (err instanceof AxiosError) {
			console.error(err);

			if (err.response?.status === HttpStatusCode.Forbidden || err.response?.status === HttpStatusCode.Unauthorized) {
				alertDialog.message = err.response.data?.message;
			} else {
				alertDialog.message = 'Something went wrong, try again later!';
			}
		} else {
			alertDialog.message = 'Something went wrong, try again later!';
			console.error(err);
		}
	}

	googleLoginMutation.subscribe((res) => {
		if (res.isSuccess) {
			setToken(res.data.access_token, res.data.refresh_token);
			const claims = jwtDecode<AuthDecodedAccessToken>(res.data.access_token);
			const authUser: AuthUser = {
				id: claims.sub,
				name: claims.name,
				role: claims.role
			};
			setAuthUser(authUser);
			setLoginSession(true);
		}

		if (res.isError) {
			handleOnGoogleLoginError(res.error);
		}
	});

	function initializeGoogleOneTap() {
		isGSIClientLoaded.set(true);

		window.google.accounts.id.initialize({
			client_id: PUBLIC_GOOGLE_CLIENT_ID,
			callback: handleCredentialResponse
		});
	}

	$effect(() => {
		if ($isGSIClientLoaded && !isSessionExists()) {
			window.google.accounts.id.prompt();
		}
	});

	$effect(() => {
		if (!chatSheetOpen) {
			closeChatRoom();
		}
	});

	function toggleChatSheet() {
		chatSheetOpen = !chatSheetOpen;
	}

	function openChatRoom(chat: ChatGetAllRes) {
		chatRoomOpen.set(true);
		selectedChat = chat;
	}

	$effect(() => {
		if (chatRoomOpen || chat?.messages || outBoundMsgs) {
			scrollToBottomChatContainer();
		}
	});

	$effect(() => {
		if ($selectedChatRoomID) {
			untrack(() => {
				$chatGetByIDSvc.refetch();
				toggleChatSheet();
				chatRoomOpen.set(true);
			});
		}
	});

	$effect(() => {
		if (outBoundMsgs) {
			tick().then(() => {
				scrollToBottomChatContainer();
			});
		}
	});

	function closeChatRoom() {
		$chatGetAllSvc.refetch();
		selectedChat = undefined;
		selectedChatRoomID.set(undefined);
		chat = undefined;
		chatRoomOpen.set(false);
		outBoundMsgs = [];
	}

	function initWebSocketConnection(token: string): void {
		ws = new WebSocket(`${PUBLIC_WEB_SOCKET_URL}/v1/web-socket/chat?token=${token}`);
		ws.binaryType = 'arraybuffer';

		ws.onopen = (e) => {
			wsConnectionOpened = true;
		};

		ws.onmessage = (event) => {
			const msg: WebSocketResponse<ChatWsIncoming> = decodeAndParseMessageToJSON(event.data);

			if (msg.data) handleIncomingMessage(msg);
			if (msg.type === 'incoming_message' && msg.data?.room_id !== selectedChat?.room_id) $chatGetAllSvc.refetch();
		};

		ws.onclose = (e) => {
			console.info('Connection closed');
			wsConnectionOpened = false;

			if (e.code === 1000 || e.code === 1001) return;

			console.error('Connection closed with error:', e.reason);
		};

		ws.onerror = (e) => {
			console.error('Connection error:', e);
		};
	}

	const textDecoder = new TextDecoder();
	const textEncoder = new TextEncoder();

	function decodeAndParseMessageToJSON(m: ArrayBuffer) {
		const text = textDecoder.decode(m);
		return JSON.parse(text);
	}

	function setOutboundMsgsFailed(index: number, failed: boolean) {
		outBoundMsgs[index].failed = failed;
	}

	function scrollToBottomChatContainer() {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	function handleIncomingMessage(msg: WebSocketResponse<ChatWsIncoming>) {
		const incomingMsgData = msg.data;

		let outboundMsgIndex = -1;
		let metadataID = '';
		if (msg.type === 'server' && msg.metadata) {
			const metadata = msg.metadata as ChatWsSendResMetadata;
			if (metadata?.id) {
				metadataID = metadata.id;
				outboundMsgIndex = outBoundMsgs.findIndex((msg) => msg.id === metadata.id);
			}
		}

		if (outboundMsgIndex !== -1 && metadataID !== '') {
			outBoundMsgs[outboundMsgIndex].is_sending = false;
		}

		switch (msg.type) {
			case 'server':
				// switch (msg.code) {
				// 	case WebSocketResponseCode.SUCCESS:
				// 		sendingMsgFailed = false;
				// 		failedCount = 0;
				// 		setOutboundMsgsFailed(outboundMsgIndex, false);
				// 		break;
				// 	case WebSocketResponseCode.CLIENT_ERROR:
				// 		sendingMsgFailed = true;
				// 		failedCount++;
				// 		setOutboundMsgsFailed(outboundMsgIndex, true);
				// 		break;
				// 	case WebSocketResponseCode.CHAT_ROOM_NOT_FOUND:
				// 		sendingMsgFailed = true;
				// 		failedCount++;
				// 		setOutboundMsgsFailed(outboundMsgIndex, true);
				// 		break;
				// 	case WebSocketResponseCode.RECIPIENT_NOT_FOUND:
				// 		sendingMsgFailed = true;
				// 		failedCount++;
				// 		setOutboundMsgsFailed(outboundMsgIndex, true);
				// 		break;
				// 	case WebSocketResponseCode.RECIPIENT_OFFLINE:
				// 		sendingMsgFailed = false;
				// 		failedCount = 0;
				// 		setOutboundMsgsFailed(outboundMsgIndex, false);
				// 		break;
				// 	case WebSocketResponseCode.INTERNAL_SERVER_ERROR:
				// 		sendingMsgFailed = true;
				// 		failedCount++;
				// 		setOutboundMsgsFailed(outboundMsgIndex, true);
				// 		break;
				// }

				if (!msg.success) {
					failedCount++;
				}
				setOutboundMsgsFailed(outboundMsgIndex, !msg.success);
				break;
			case 'incoming_message':
				if (incomingMsgData) {
					if (chat?.room_id === incomingMsgData.room_id) {
						if (outBoundMsgs.length) {
							outBoundMsgs = [
								...outBoundMsgs,
								{
									id: incomingMsgData.message_id,
									content: incomingMsgData.content,
									content_type: incomingMsgData.content_type,
									failed: false,
									is_sender: false,
									is_sending: false,
									created_at: incomingMsgData.created_at
								}
							];
						} else {
							chat.messages = [
								...chat.messages,
								{
									id: incomingMsgData.message_id,
									content: incomingMsgData.content,
									content_type: incomingMsgData.content_type,
									created_at: incomingMsgData.created_at,
									is_sender: false,
									read: false
								}
							];
						}
					}
				}
				break;
		}
	}

	function handleSendMsg() {
		if (ws && $chatRoomOpen && chat && chatSendReq.content !== '' && failedCount < 3) {
			const id = uuidV7();
			outBoundMsgs = [
				...outBoundMsgs,
				{
					id,
					is_sending: true,
					failed: false,
					content: chatSendReq.content,
					content_type: ChatContentType.TEXT,
					is_sender: true,
					created_at: dayjs().format()
				}
			];

			chatSendReq.id = id;
			chatSendReq.room_id = chat.room_id;
			const encoded = textEncoder.encode(JSON.stringify(chatSendReq));
			ws.send(encoded);

			chatSendReq.content = '';
			chatSendReq.content_type = ChatContentType.TEXT;
			chatSendReq.room_id = undefined;
			chatSendReq.service_provider_id = undefined;
		}
	}

	let tokenExists = $state(false);

	onMount(async () => {
		const script = document.createElement('script');
		script.src = 'https://accounts.google.com/gsi/client';
		script.onload = initializeGoogleOneTap;

		document.body.appendChild(script);

		const accessToken = getToken()?.accessToken;
		if (accessToken) {
			tokenExists = true;

			setLoginSession(true);
			const claims = jwtDecode<AuthDecodedAccessToken>(accessToken);
			const authUser: AuthUser = {
				id: claims.sub,
				name: claims.name,
				role: claims.role
			};
			setAuthUser(authUser);

			await initFirebaseMessaging(notifToast);
			await requestPermission();

			initWebSocketConnection(accessToken);

			$chatGetAllSvc.refetch();
		}
	});

	$inspect('chats', chats);
	$inspect(chat?.messages);
	$inspect(outBoundMsgs);
</script>

<QueryClientProvider client={queryClient}>
	<Header />
	<main class="relative min-h-screen pt-10">
		<div class="container py-[50px]">
			{@render children()}
		</div>
		{#if tokenExists}
			<button type="button" class="fixed bottom-20 right-10 rounded-full bg-primary p-3 shadow-2xl" onclick={toggleChatSheet}>
				<Icon icon="fluent:chat-48-filled" height="35" class="text-white" />
			</button>
		{/if}
	</main>
	<Footer />
	<AlertDialog isOpen={alertDialog.open} title={alertDialog.title} message={alertDialog.message} />
	<!-- <SvelteQueryDevtools /> -->
</QueryClientProvider>

{#if tokenExists}
	<Sheet.Root bind:open={chatSheetOpen}>
		<Sheet.Content side="right" class="md:min-w-[500px]" useDefaultCloseButton={false}>
			<Sheet.Header>
				<Sheet.Title>
					<div class="flex items-center gap-x-4">
						{#if $chatRoomOpen}
							<button type="button" class="rounded-full bg-primary p-2 shadow-xl" onclick={closeChatRoom}>
								<Icon icon="eva:arrow-back-outline" class="text-white" height="30" />
							</button>
							<div class="flex items-center gap-x-4 justify-self-start">
								<img src={chat?.service_provider?.logo_url} class="h-12 w-12 rounded-full" alt="" loading="lazy" />
								<span class="line-clamp-1 text-xl font-semibold">{chat?.service_provider?.name}</span>
							</div>
							{#if chat?.context === ChatContext.ORDER}
								<div class="ml-auto">
									<Badge color={COLOR_PRIMARY}>Order</Badge>
								</div>
							{/if}
						{:else}
							<button type="button" class="focus-visible:outline-none" onclick={() => (chatSheetOpen = false)}>
								<Icon icon="maki:cross" class="text-muted-foreground" height="30" />
							</button>
							<span class="mx-auto text-center font-semibold">Chat</span>
						{/if}
					</div>
				</Sheet.Title>
			</Sheet.Header>
			{#if !$chatRoomOpen}
				{#if wsConnectionOpened}
					<div class="mt-6 grid h-[calc(100vh-6rem)] grid-flow-row content-start gap-y-4 overflow-y-auto">
						{#each chats as chat}
							<ChatCard data={chat} onClick={() => openChatRoom(chat)} />
						{/each}
					</div>
				{:else}
					<p>Connecting...</p>
				{/if}
			{:else if $chatRoomOpen && chat}
				<div class="relative mt-6 grid h-[calc(100vh-7rem)] grid-flow-row content-between">
					{#if chat.context === ChatContext.ORDER && chat.order && chat.service}
						<div class="absolute left-0 right-0 top-0 grid grid-flow-row gap-y-3 bg-white px-4 py-2 shadow shadow-border">
							<h1 class="line-clamp-1 font-medium">Service: {chat.service.name}</h1>
							<p class="line-clamp-1">
								{`${dayjs(chat.order.service_date).format('ddd, DD MMM YYYY')} - ${chat.order.service_time}  ${getLocalTimeZoneAbbreviation()}`}
							</p>
						</div>
					{:else if chat.context === ChatContext.SERVICE && chat.service}
						<div class="absolute left-0 right-0 top-0 grid grid-flow-row gap-y-3 bg-white px-4 py-2 shadow shadow-border">
							<h1 class="line-clamp-1 font-medium">Service: {chat.service.name}</h1>
						</div>
					{/if}
					{#if chat.messages?.length || outBoundMsgs?.length}
						<div
							class={cn(
								"grid grid-flow-row gap-y-3 overflow-y-auto pb-4 pt-4 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden",
								{
									'pt-24': chat.context === ChatContext.ORDER
								}
							)}
							bind:this={chatContainer}
						>
							{#each chat.messages as msg, i}
								<ChatBubble data={msg} previousChatSentAt={chat.messages[i - 1]?.created_at} nextChatSentAt={chat.messages[i + 1]?.created_at} />
							{/each}
							{#each outBoundMsgs as msg, i}
								<ChatBubble
									data={{
										id: msg.id,
										content: msg.content,
										content_type: msg.content_type,
										created_at: msg.created_at,
										is_sender: msg.is_sender,
										read: false
									}}
									previousChatSentAt={chat.messages[chat.messages.length - 1]?.created_at ?? outBoundMsgs[i - 1]?.created_at}
									nextChatSentAt={outBoundMsgs[i + 1]?.created_at}
								/>
							{/each}
						</div>
					{:else}
						<div class="justify-self-center">
							<span>No messages</span>
						</div>
					{/if}

					<div class="flex w-full items-center gap-x-2 place-self-end">
						{#if failedCount < 3}
							<input
								type="text"
								class="max-h flex h-fit max-h-[100px] w-full flex-grow rounded-md border border-input bg-white px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
								bind:value={chatSendReq.content}
							/>
						{:else}
							<p class="flex-grow text-yellow-500">Failed to send message, try reloading the page!</p>
						{/if}
						<button
							type="button"
							class={cn('flex items-center justify-center rounded-full bg-primary p-2 transition-colors duration-500 focus-visible:outline-none', {
								'bg-gray-600': chatSendReq.content === ''
							})}
							disabled={chatSendReq.content === '' || failedCount >= 3}
							onclick={handleSendMsg}
						>
							<Icon icon="material-symbols:send-rounded" class="ml-[4px] text-white" height="30" />
						</button>
					</div>
				</div>
			{/if}
		</Sheet.Content>
	</Sheet.Root>
{/if}

<Toaster richColors />
