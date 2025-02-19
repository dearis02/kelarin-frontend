<script lang="ts">
	import {
		googleLoginService,
		isSessionExists,
		setLoginSession,
		setToken
	} from '../../../service/auth';
	import { onMount } from 'svelte';
	import { isGSIClientLoaded } from '../../../store/google';

	let { class: className }: { class?: string } = $props();
	let button = $state<HTMLDivElement>();

	function renderGoogleLoginButton() {
		window.google.accounts.id.renderButton(button, {
			type: 'standard',
			theme: 'outline',
			size: 'large',
			text: 'sign_in_with',
			shape: 'rectangular',
			locale: 'en'
		});
	}

	// function openWebSocketConnection(): void {
	// 	const ws = new WebSocket('ws://localhost:3000/ws?token=1');
	// 	ws.onopen = (e) => {
	// 		console.log('Connection opened with token 1');
	// 	};
	// 	ws.onmessage = (event) => {
	// 		console.log(event.data);
	// 	};
	// 	ws.onclose = () => {
	// 		console.log('Connection closed');
	// 	};

	// 	ws.send(JSON.stringify({ target_id: '2', message: 'Hello from client' }));
	// }

	// function openWebSocketConnection2(): void {
	// 	const ws2 = new WebSocket('ws://localhost:3000/ws?token=1');
	// 	ws2.onopen = (e) => {
	// 		console.log('Connection opened with token 2');
	// 	};
	// 	ws2.onmessage = (event) => {
	// 		console.log(event.data);
	// 	};
	// 	ws2.onclose = () => {
	// 		console.log('Connection closed');
	// 	};

	// 	ws2.send(JSON.stringify({ target_id: '1', message: 'Hello from client 2' }));
	// }

	$effect(() => {
		if ($isGSIClientLoaded) renderGoogleLoginButton();
	});
</script>

<div bind:this={button} class={className}></div>
