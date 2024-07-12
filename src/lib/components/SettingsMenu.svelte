<script>
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { Settings } from 'lucide-svelte';

	import { gender, weight, target, weeklyTarget } from '$lib/stores/stores';
</script>

<section  >
	<Accordion>
		<AccordionItem>
			<svelte:fragment slot="lead"><Settings /></svelte:fragment>
			<svelte:fragment slot="summary">Settings</svelte:fragment>
			<svelte:fragment slot="content"
				><label  >
					<span>Weight in grams</span>
					<input type="number" bind:value={$weight} />
				</label>
				<label  >
					<span>Target Maximum BAC</span>
					<input type="number" bind:value={$target} step="0.01" />
				</label>
				<label  >
					<span>Target Maximum Units Per Week</span>
					<input type="number" bind:value={$weeklyTarget} step="1" />
				</label>
				<p  >Gender</p>
				<label  >
					<input
						type="radio"
						 
						bind:group={$gender}
						step="0.
							01"
						value="m"
					/><span>Male</span>
				</label>
				<label  >
					<input type="radio" bind:group={$gender} step="0.01" value="f" /><span
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
