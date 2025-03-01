<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { Calendar as CalendarPrimitive } from 'bits-ui';

	let { ref = $bindable(null), class: className, ...restProps }: CalendarPrimitive.DayProps = $props();
</script>

<CalendarPrimitive.Day
	bind:ref
	class={cn(
		'hover:bg-white',
		buttonVariants({ variant: 'ghost' }),
		'size-9 p-0 font-normal',
		'[&[data-today]:not([data-selected])]:bg-white [&[data-today]:not([data-selected])]:text-primary',
		// Selected
		'data-[selected]:bg-white data-[selected]:text-primary data-[selected]:opacity-100 data-[selected]:hover:bg-white data-[selected]:hover:text-primary data-[selected]:focus:bg-white data-[selected]:focus:text-primary',
		// Disabled
		'data-[disabled]:text-gray-600 data-[disabled]:opacity-50',
		// Unavailable
		'data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through',
		// Outside months
		'data-[outside-month]:pointer-events-none data-[outside-month]:text-muted-foreground data-[outside-month]:opacity-50 [&[data-outside-month][data-selected]]:bg-white/50 [&[data-outside-month][data-selected]]:text-muted-foreground [&[data-outside-month][data-selected]]:opacity-30',
		className
	)}
	{...restProps}
/>
