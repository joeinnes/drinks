<script>
	// Library Components
	import { Accordion, AccordionItem, popup } from '@skeletonlabs/skeleton';
	import { Beer, Delete, GlassWater, Martini, Plus, Wine } from 'lucide-svelte';

	// My Code
	import { calculateBacAddition } from '$lib/utilities/utilities';
	import {
		drinks,
		drinksStringDates,
		gender,
		weight,
		bac,
		target,
		hasReadDisclaimer,
		timeToTarget,
		timeToZero,
		timeOfZero,
		timeOfTarget,
		timeSinceLast
	} from '$lib/stores/stores';

	// My Components
	import ChartPanel from '$lib/components/ChartPanel.svelte';
	import SettingsMenu from '$lib/components/SettingsMenu.svelte';
	import Metric from '$lib/components/Metric.svelte';

	/**
	 * @param {string} name
	 * @param {number} volume
	 */
	const addDrink = (name, volume) => {
		/** type Drink */
		const drinkToAdd = {
			name,
			volume,
			bac: calculateBacAddition(volume, $weight, $gender),
			bacAtStart: $bac,
			datetime: new Date()
		};
		$drinksStringDates = [...$drinks, drinkToAdd];
		$drinksStringDates.sort((a, b) => (a.datetime > b.datetime ? -1 : 1));
	};

	/** @type {import('@skeletonlabs/skeleton').PopupSettings}*/
	const resetDrinks = {
		event: 'click',
		target: 'resetDrinks',
		placement: 'top'
	};
	let customName = 'Spirit shot';
	let customVolume = 40;
	let customPercent = 40;
	let stateInWords = `Sober`;

	$: {
		if ($bac > 0.2) {
			stateInWords = 'Dangerous levels!';
		} else if ($bac > 0.15) {
			stateInWords = 'Severe impairment';
		} else if ($bac > 0.1) {
			stateInWords = 'Serious impairment';
		} else if ($bac > 0.08) {
			stateInWords = 'High impairment';
		} else if ($bac > 0.04) {
			stateInWords = 'Some impairment';
		} else if ($bac > 0.02) {
			stateInWords = 'Mild impairment';
		} else if ($bac > 0) {
			stateInWords = 'Minimal impairment';
		} else {
			stateInWords = 'Sober';
		}
	}
</script>

<div
	class="container h-full mx-auto flex justify-center items-center w-full mt-4
"
>
	<div class="space-y-5 w-full">
		<h1 class="text-5xl text-center">Drinks</h1>

		<section class="card p-4 w-full">
			{#if !$hasReadDisclaimer}
				<p>
					This app uses some calculations to guess approximately what your blood alcohol content is
					based on what you have had to drink and when.
				</p>
				<ul class="list py-4">
					<li>
						<span>&bullet;</span>
						<span>
							You <strong>MUST NOT</strong> use this app to estimate when you may be below a drink-driving
							limit, or safe to operate heavy machinery, etc.</span
						>
					</li>
					<li>
						<span>&bullet;</span>
						<span
							>This app <strong>MUST NOT</strong> be used for any purpose other than out of personal
							curiosity. The numbers it creates are at best guesses.</span
						>
					</li>
					<li>
						<span>&bullet;</span>
						<span>You <strong>MUST NOT</strong> rely on this app for making decisions.</span>
					</li>

					<p>
						This app is available as-is, with no warranty express or implied. You must not rely on
						this app to inform decisions.
					</p>
				</ul>
				<button on:click={() => ($hasReadDisclaimer = true)}>I understand and agree</button>
			{:else}
				<div class="w-full text-center text-2xl" />
				{#if $drinks.length}
					<p class="text-center">Your last drink was {$timeSinceLast}</p>
				{/if}
				<div class="flex gap-2 justify-around my-2 text-center">
					<Metric title="Current BAC" subtitle={stateInWords} value={$bac.toFixed(4)} />
					<Metric
						title="Time To Zero"
						value={`${Math.floor($timeToZero)}h${Math.round(
							($timeToZero - Math.floor($timeToZero)) * 60
						)}m`}
						subtitle={$timeToZero ? $timeOfZero.format('h:mm a') : ''}
					/>
					<Metric
						title="Time To Target"
						value={`${Math.floor($timeToTarget)}h${Math.round(
							($timeToTarget - Math.floor($timeToTarget)) * 60
						)}m`}
						subtitle={$timeToTarget ? $timeOfTarget.format('hh:mm a') : ''}
					/>
				</div>
				<div class="flex justify-center my-4 gap-2 flex-wrap">
					<button
						on:click={() => addDrink('Small beer', 0.045 * 330)}
						class={`${
							$bac > $target
								? 'unique btn variant-filled-error'
								: calculateBacAddition(0.045 * 330, $weight, $gender) + $bac > $target
								? 'unique btn variant-filled-warning'
								: ''
						}`}><span><Beer /></span><span>Small Beer </span></button
					>
					<button
						on:click={() => addDrink('Large beer', 0.045 * 500)}
						class={`${
							$bac > $target
								? 'unique btn variant-filled-error'
								: calculateBacAddition(0.045 * 330, $weight, $gender) + $bac > $target
								? 'unique btn variant-filled-warning'
								: ''
						}`}><span><Beer /></span><span>Large Beer</span></button
					>
					<button
						on:click={() => addDrink('Red wine', 0.14 * 150)}
						class={`${
							$bac > $target
								? 'unique btn variant-filled-error'
								: calculateBacAddition(0.045 * 330, $weight, $gender) + $bac > $target
								? 'unique btn variant-filled-warning'
								: ''
						}`}><span><Wine /></span><span>Red Wine</span></button
					>
					<button
						on:click={() => addDrink('White wine', 0.12 * 150)}
						class={`${
							$bac > $target
								? 'unique btn variant-filled-error'
								: calculateBacAddition(0.045 * 330, $weight, $gender) + $bac > $target
								? 'unique btn variant-filled-warning'
								: ''
						}`}><span><Wine /></span><span>White Wine</span></button
					>
					<button
						on:click={() => addDrink('Spirits', 0.375 * 40)}
						class={`${
							$bac > $target
								? 'unique btn variant-filled-error'
								: calculateBacAddition(0.045 * 330, $weight, $gender) + $bac > $target
								? 'unique btn variant-filled-warning'
								: ''
						}`}><span><Martini /></span><span>Spirits/Mixed</span></button
					>
				</div>
				<Accordion class="my-4">
					<AccordionItem>
						<svelte:fragment slot="lead"><GlassWater /></svelte:fragment>
						<svelte:fragment slot="summary">Custom Drink</svelte:fragment>
						<svelte:fragment slot="content"
							><label class="label">
								<span>Drink name</span>
								<input type="text" bind:value={customName} class="input" />
							</label>
							<div class="flex gap-2 w-full pr-0">
								<label class="label w-full">
									<span>Volume in ml</span>
									<input type="number" bind:value={customVolume} class="input" />
								</label>
								<label class="label">
									<span>Percentage</span>
									<div class="input-group input-group-divider grid-cols-[1fr_auto]">
										<input type="number" bind:value={customPercent} class="input" />
										<div class="input-group-shim">%</div>
									</div>
								</label>
							</div>
							<button
								class={`${
									calculateBacAddition(customVolume * (customPercent / 100), $weight, $gender) +
										$bac >
									$target
										? 'unique btn variant-filled-warning'
										: ''
								}`}
								on:click={() => {
									addDrink(customName, customVolume * (customPercent / 100));
									customName = 'Spirit shot';
									customVolume = 40;
									customPercent = 40;
								}}
								><span><Plus /></span><span>Add</span>
							</button></svelte:fragment
						>
					</AccordionItem>
				</Accordion>

				<table class="table">
					<thead>
						<th>Drink</th>
						<th class="hidden lg:table-cell">BAC Addition</th>
						<th>BAC <span class="hidden md:inline">at Start</span></th>
						<th>Time</th>
						<th>Remove</th>
					</thead>
					<tbody class="text-center">
						{#each $drinks as drink, i}
							<tr>
								<td>{drink.name}</td>
								<td class="hidden lg:table-cell">{drink.bac.toFixed(4)}</td>
								<td>{drink.bacAtStart.toFixed(4)}</td>
								<td
									>{(drink.datetime.getHours() + '').padStart(2, '0')}:{(
										drink.datetime.getMinutes() + ''
									).padStart(2, '0')}</td
								>
								<td
									><button
										class="unique btn btn-icon variant-soft-error"
										on:click|preventDefault={() => {
											$drinksStringDates.splice(i, 1);
											$drinksStringDates = $drinksStringDates;
										}}><Delete /></button
									></td
								>
							</tr>
						{:else}
							<tr>
								<td colspan="5">No drinks</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<div class="p-4 text-center">
					<button
						class="unique btn variant-filled-error"
						use:popup={resetDrinks}
						disabled={$drinks.length < 1}>Reset</button
					>
				</div>
				<div class="card p-4 variant-filled-warning w-1/2" data-popup="resetDrinks">
					<p>Are you sure? This will delete all of your drinks history and cannot be undone!</p>
					<div class="flex flex-col md:flex-row justify-end">
						<button class="unique btn variant-ghost-warning">Cancel</button>
						<button
							class="unique btn variant-filled-error"
							on:click={() => ($drinksStringDates = [])}>Delete history</button
						>
					</div>
					<div class="arrow variant-filled-warning" />
				</div>
			{/if}
		</section>

		<ChartPanel />
		<SettingsMenu />
		<div class="container p-4">
			<small
				>Reminder: this app is not to be used to calculate BAC with accuracy, and should not be
				relied on for any purpose. If you or others around you have concerns about your drinking,
				seek professional help.</small
			>
		</div>
	</div>
</div>

<style lang="postcss">
	button:not(.unique) {
		@apply btn variant-filled-primary;
	}
	table tbody tr td {
		@apply align-middle;
	}
	.radio {
		@apply mr-2;
	}
</style>
