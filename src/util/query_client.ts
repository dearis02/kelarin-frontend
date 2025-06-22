import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			enabled: browser
		}
	}
});

export default queryClient;
