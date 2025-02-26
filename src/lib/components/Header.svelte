<script lang="ts">
	import kelarinLogo from '$assets/Logo-Kelarin.png?enhanced';
	import { CircleAlert, Menu, UserRound, X } from 'lucide-svelte';
	import { authUser, isLoggedIn, setAuthUser } from '../../store/auth';
	import GoogleLoginButton from './button/GoogleLoginButton.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { clearToken, setLoginSession } from '../../service/auth';
	import { COLOR_PRIMARY } from '../../types/color';
	import Button from './ui/button/button.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let dropdownMenuOpen = $state(false);
	let dropdownMenuAnchor = $state<HTMLElement>();
	let mobileMenuAnchor = $state<HTMLElement>();

	let headerRef = $state<HTMLElement>();

	function onClickMobileMenu() {
		if (mobileMenuAnchor?.classList.contains('fixed')) {
			mobileMenuAnchor.classList.remove('fixed');
			mobileMenuAnchor.classList.add('hidden');
			document.body.classList.remove('overflow-hidden');
		} else {
			mobileMenuAnchor?.classList.remove('hidden');
			mobileMenuAnchor?.classList.add('fixed');
			document.body.classList.add('overflow-hidden');
		}
	}

	function onClickDropdownMenu() {
		dropdownMenuOpen = !dropdownMenuOpen;
	}

	function handleLogout() {
		clearToken();
		setLoginSession(false);
		setAuthUser(null);
	}

	onMount(() => {
		window.addEventListener('scroll', function () {
			if (headerRef) {
				if (window.scrollY === 0) {
					headerRef.classList.remove('shadow-lg', 'border-b');
				} else {
					headerRef.classList.add('shadow-lg', 'border-b');
				}
			}
		});
	});
</script>

<header
	bind:this={headerRef}
	class="fixed z-50 flex w-full flex-row justify-between border-[0.5px] border-primary bg-white px-8 py-5 md:p-10 xl:px-[110px] xl:py-10"
>
	<enhanced:img src={kelarinLogo} class="h-auto max-w-32 cursor-pointer md:max-w-40" alt="kelarin logo" />
	<button type="button" class="md:hidden" onclick={onClickMobileMenu}>
		<Menu class="text-primary" />
	</button>
	{#if $isLoggedIn}
		<div
			bind:this={dropdownMenuAnchor}
			class="hidden items-center gap-x-3 rounded-full border border-accent bg-white px-6 py-2 shadow-xl outline outline-primary md:flex md:min-w-[150px]"
		>
			<span class="flex-grow cursor-pointer font-semibold">{$authUser?.name}</span>
			<button>
				<Menu class="text-primary" onclick={onClickDropdownMenu} />
			</button>
			<button>
				<UserRound class="text-primary" />
			</button>
			<DropdownMenu.Root bind:open={dropdownMenuOpen}>
				<DropdownMenu.Content class="w-[150px] bg-white" customAnchor={dropdownMenuAnchor}>
					<DropdownMenu.Group>
						<DropdownMenu.GroupHeading>My Account</DropdownMenu.GroupHeading>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Item onclick={() => goto('/addresses')}>Address</DropdownMenu.Item>
							<DropdownMenu.Item>Orders</DropdownMenu.Item>
							<DropdownMenu.Item>Transactions</DropdownMenu.Item>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Item class="cursor-pointer text-red-500" onclick={handleLogout}>Log out</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	{:else}
		<GoogleLoginButton class="hidden md:block" />
	{/if}
</header>

<aside bind:this={mobileMenuAnchor} class="right-0 top-0 z-50 hidden h-screen w-full gap-x-3 gap-y-4 bg-primary px-7 py-6 text-white md:hidden">
	<X class="ml-auto" size="30" onclick={onClickMobileMenu} />
	<div class="mt-10 flex h-full flex-col gap-y-4 overflow-auto">
		{#if $isLoggedIn}
			<div class="flex w-fit items-center gap-x-4 rounded-md bg-white px-5 py-2 text-primary">
				<UserRound fill={COLOR_PRIMARY} />
				<span class="text-lg font-bold">{$authUser?.name}</span>
			</div>
			<span class="font-bold">Orders</span>
			<span class="font-bold">Transactions</span>
			<Button class="bg-white text-lg font-bold text-red-600" onclick={handleLogout}>Logout</Button>
		{:else}
			<div>
				<CircleAlert class="inline-block text-yellow-400" />
				<span>You have to login using your google account to make an order</span>
			</div>
			<GoogleLoginButton />
		{/if}
	</div>
</aside>
