<script lang="ts">
	import kelarinLogoOnly from '$assets/Kelarin-Logo-Only.png?enhanced';
	import { Instagram, Mail } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';

	const year = new Date().getFullYear();
</script>

<footer class="mt-auto w-full border-t border-gray-300">
	<div
		class="flex flex-col gap-y-3 bg-secondary p-10 md:flex-row md:justify-between md:px-10 lg:p-10 xl:px-[110px] xl:py-[60px]"
	>
		<div>
			<enhanced:img
				src={kelarinLogoOnly}
				alt="logo kelarin"
				class="mb- h-[50px] w-[50px] self-center"
			/>
			<h1 class="mt-2 text-xl font-bold text-primary">KELARIN</h1>
			<h1 class="mt-3 text-xl font-bold text-black md:max-w-64 lg:max-w-full">
				Find the best service that <span class="text-primary">Fit</span> your
				<span class="text-primary">Needs</span>
			</h1>
		</div>
		<div class="mt-3 flex flex-col gap-y-6 md:mt-0 md:flex-row">
			<div class="grid h-fit grid-rows-1 gap-y-3">
				<span class="cursor-pointer">News</span>
				<span class="cursor-pointer">About Us</span>
				<span class="cursor-pointer">Term of Service</span>
				<span class="cursor-pointer">Privacy and Policy</span>
			</div>
			<div class="md:mt-0 md:text-center">
				<h1 class="mb-4 text-lg font-bold">Quickly find any services now</h1>
				<Button variant="default">Find Now</Button>
			</div>
		</div>
	</div>
	<div
		class="flex w-full items-center justify-between bg-primary px-10 py-6 md:px-20 xl:px-[110px] xl:py-[28px]"
	>
		<span class="text-xs font-semibold text-white">© {year} Kelarin Inc. All rights reserved</span>
		<div class="flex items-center gap-x-3">
			<Mail class="text-white" />
			<Instagram class="text-white" />
		</div>
	</div>
</footer>
