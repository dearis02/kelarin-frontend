<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { Calendar as CalendarPrimitive } from 'bits-ui';

	let { ref = $bindable(null), class: className, ...restProps }: CalendarPrimitive.DayProps = $props();
</script>

<CalendarPrimitive.Day
	bind:ref
	class={cn(
		'hover:bg-primary hover:text-white',
		buttonVariants({ variant: 'ghost' }),
		'size-9 p-0 font-normal',
		'[&[data-today]:not([data-selected])]:bg-black [&[data-today]:not([data-selected])]:opacity-60 [&[data-today]:not([data-selected])]:text-white',
		// Selected
		'data-[selected]:bg-primary data-[selected]:text-white data-[selected]:opacity-100 data-[selected]:hover:bg-opacity-90',
		// Disabled
		'data-[disabled]:bg-none data-[disabled]:text-black data-[disabled]:opacity-100 data-[disabled]:cursor-not-allowed data-[disabled]:hover:bg-none',
		// Unavailable
		'data-[unavailable]:text-black data-[unavailable]:line-through data-[unavailable]:opacity-50',
		// Outside months
		'data-[outside-month]:pointer-events-none data-[outside-month]:text-muted-foreground data-[outside-month]:opacity-50 [&[data-outside-month][data-selected]]:bg-white/50 [&[data-outside-month][data-selected]]:text-muted-foreground [&[data-outside-month][data-selected]]:opacity-30',
		className
	)}
	{...restProps}
/>
