<script>
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { Settings } from 'lucide-svelte';

	import { gender, weight, target, weeklyTarget } from '$lib/stores/stores';
</script>

<section class="card p-4">
	<Accordion>
		<AccordionItem>
			<svelte:fragment slot="lead"><Settings /></svelte:fragment>
			<svelte:fragment slot="summary">Settings</svelte:fragment>
			<svelte:fragment slot="content"
				><label class="label">
					<span>Weight in grams</span>
					<input type="number" bind:value={$weight} class="input" />
				</label>
				<label class="label">
					<span>Target Maximum BAC</span>
					<input type="number" bind:value={$target} step="0.01" class="input" />
				</label>
				<label class="label">
					<span>Target Maximum Units Per Week</span>
					<input type="number" bind:value={$weeklyTarget} step="1" class="input" />
				</label>
				<p class="label">Gender</p>
				<label class="label">
					<input
						type="radio"
						class="radio"
						bind:group={$gender}
						step="0.
							01"
						value="m"
					/><span>Male</span>
				</label>
				<label class="label">
					<input type="radio" class="radio" bind:group={$gender} step="0.01" value="f" /><span
						>Female</span
					>
				</label>
			</svelte:fragment>
		</AccordionItem>
	</Accordion>
</section>

<style lang="postcss">
	.radio {
		@apply mr-2;
	}
</style>
