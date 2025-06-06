<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

	type Props = {
		isOpen: boolean;
		title: string;
		message: string;
		messageClass?: string;
	};

	let { isOpen = $bindable(), ...props }: Props = $props();
</script>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{props.title}</AlertDialog.Title>
			<AlertDialog.Description class={props.messageClass}>
				{props.message}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Close</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
