<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import '../app.css';
	import { browser } from '$app/environment';
	import { onMount, type ComponentType } from 'svelte';
	import { setAuthUser, type AuthUser } from '../store/auth';
	import { getToken, googleLoginService, isSessionExists, setLoginSession, setToken } from '../service/auth';
	import { jwtDecode } from 'jwt-decode';
	import type { AuthDecodedAccessToken } from '../types/auth';
	import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
	import api from '$util/axios_interceptor';
	import AlertDialog from '$lib/components/dialog/AlertDialog.svelte';
	import { AxiosError, HttpStatusCode } from 'axios';
	import { isGSIClientLoaded } from '../store/google';
	import { initFirebaseMessaging, requestPermission } from '$util/firebase';
	import { Toaster } from '$lib/components/ui/sonner/index';
	import { toast } from 'svelte-sonner';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

	let { children } = $props();

	let alertDialog = $state({
		open: false,
		title: '',
		message: ''
	});
	const notifToast = toast('notification');

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				retry: false,
				refetchOnWindowFocus: false
			}
		}
	});

	const googleLoginMutation = googleLoginService(queryClient, api);

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

	onMount(async () => {
		const script = document.createElement('script');
		script.src = 'https://accounts.google.com/gsi/client';
		script.onload = initializeGoogleOneTap;

		document.body.appendChild(script);

		const accessToken = getToken()?.accessToken;
		if (accessToken) {
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
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<Header />
	<main class="min-h-screen pt-10">
		<div class="container py-[50px]">
			{@render children()}
		</div>
	</main>
	<Footer />
	<AlertDialog isOpen={alertDialog.open} title={alertDialog.title} message={alertDialog.message} />
	<SvelteQueryDevtools />
</QueryClientProvider>

<Toaster />
