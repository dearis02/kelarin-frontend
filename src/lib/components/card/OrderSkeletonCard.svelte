<script>
	import Skeleton from '../ui/skeleton/skeleton.svelte';
</script>

<div class="grid w-full grid-flow-row gap-y-4 rounded-md border border-black px-14 py-8 shadow-md">
	<div class="flex items-center justify-between">
		<div class="flex items-start gap-x-4">
			<Skeleton class="h-10 w-72" />
			<Skeleton class="h-8 w-10" />
		</div>
		<Skeleton class="h-8 w-20" />
	</div>
	<div class="flex items-center justify-between">
		<div class="flex flex-col gap-y-3">
			<Skeleton class="h-8 w-40" />
			<Skeleton class="h-8 w-40" />
		</div>
		<div>
			<Skeleton class="h-8 w-20" />
		</div>
	</div>
</div>
