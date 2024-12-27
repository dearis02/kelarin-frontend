<script lang="ts">
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';

	onMount(() => {
		// Load the Google Identity Services script
		const script = document.createElement('script');
		script.src = 'https://accounts.google.com/gsi/client';
		script.onload = initializeGoogleOneTap;
		document.body.appendChild(script);
	});
	
	function initializeGoogleOneTap() {
		window.google.accounts.id.initialize({
			client_id: env.PUBLIC_GOOGLE_CLIENT_ID,
			callback: handleCredentialResponse
		});
		
		window.google.accounts.id.renderButton(
			document.querySelector('main'),
			{
				theme: 'outline',
				size: 'large',
				text: 'continue_with',
				shape: 'rectangular',
				locale: 'en'
			}
		);	

		window.google.accounts.id.prompt();
	}

	function handleCredentialResponse(res: any) {
		console.log(res);
	}
</script>

<main></main>