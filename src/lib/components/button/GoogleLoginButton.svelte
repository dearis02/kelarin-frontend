<script lang="ts">
	import { isGSIClientLoaded } from '../../../store/google';

	let { class: className }: { class?: string } = $props();
	let button = $state<HTMLDivElement>();

	function renderGoogleLoginButton() {
		if (!button) {
			return;
		}

		google.accounts.id.renderButton(button, {
			type: 'standard',
			theme: 'outline',
			size: 'large',
			text: 'signin_with',
			shape: 'rectangular',
			locale: 'en'
		});
	}

	$effect(() => {
		if ($isGSIClientLoaded) renderGoogleLoginButton();
	});
</script>

<div bind:this={button} class={className}></div>
