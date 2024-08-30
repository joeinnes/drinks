<script lang="ts">
	import { CarTaxiFront } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Helpful Links</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-4">
		<div class="flex flex-col gap-2">
			<p>Don't drink and drive. Call a taxi.</p>

			<Button href="https://www.google.com/search?q=taxis+near+me" target="_blank"
				><CarTaxiFront class="mr-2" />Taxi Companies</Button
			>
		</div>

		<div class="flex flex-col gap-2">
			<p>Worried about your alcohol use?</p>
			<Button href="https://www.smartrecoveryinternational.org/" target="_blank"
				>Smart Recovery International</Button
			>
			<Button href="htthttps://www.google.com/search?q=help+with+alcohol+addiction" target="_blank"
				>Help with alcohol addiction</Button
			>
		</div></Card.Content
	>
</Card.Root>
