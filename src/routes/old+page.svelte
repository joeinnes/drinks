<script>
	// Library Components
	import { Beer, Delete, GlassWater, Martini, Plus, Wine } from 'lucide-svelte';

	// My Code
	import { calculateBacAddition } from '$lib/utilities/utilities';
	import dayjs from '$lib/dayjs';
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
	let customName = $state('Spirit shot');
	let customVolume = $state(40);
	let customPercent = $state(40);
	let stateInWords = $state(`Sober`);

	$effect(() => {
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
	});
</script>

<div

>
	<div  >
		<h1  >Drinks</h1>

		<section  >
			{#if !$hasReadDisclaimer}
				<p>
					This app uses some calculations to guess approximately what your blood alcohol content is
					based on what you have had to drink and when.
				</p>
				<ul  >
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
				<button onclick={() => ($hasReadDisclaimer = true)}>I understand and agree</button>
			{:else}
				<div />
				{#if $drinks.length}
					<p>Your last drink was {$timeSinceLast}</p>
				{/if}
				<div  >
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
				<div  >
					<button
						onclick={() => addDrink('Small beer', 0.045 * 330)}
						class={`${
							$bac > $target
								? 'unique btn variant-filled-error'
								: calculateBacAddition(0.045 * 330, $weight, $gender) + $bac > $target
								? 'unique btn variant-filled-warning'
								: ''
						}`}><span><Beer /></span><span>Small Beer </span></button
					>
					<button
						onclick={() => addDrink('Large beer', 0.045 * 500)}
						class={`${
							$bac > $target
								? 'unique btn variant-filled-error'
								: calculateBacAddition(0.045 * 330, $weight, $gender) + $bac > $target
								? 'unique btn variant-filled-warning'
								: ''
						}`}><span><Beer /></span><span>Large Beer</span></button
					>
					<button
						onclick={() => addDrink('Red wine', 0.14 * 150)}
						class={`${
							$bac > $target
								? 'unique btn variant-filled-error'
								: calculateBacAddition(0.045 * 330, $weight, $gender) + $bac > $target
								? 'unique btn variant-filled-warning'
								: ''
						}`}><span><Wine /></span><span>Red Wine</span></button
					>
					<button
						onclick={() => addDrink('White wine', 0.12 * 150)}
						class={`${
							$bac > $target
								? 'unique btn variant-filled-error'
								: calculateBacAddition(0.045 * 330, $weight, $gender) + $bac > $target
								? 'unique btn variant-filled-warning'
								: ''
						}`}><span><Wine /></span><span>White Wine</span></button
					>
					<button
						onclick={() => addDrink('Spirits', 0.375 * 40)}
						class={`${
							$bac > $target
								? 'unique btn variant-filled-error'
								: calculateBacAddition(0.045 * 330, $weight, $gender) + $bac > $target
								? 'unique btn variant-filled-warning'
								: ''
						}`}><span><Martini /></span><span>Spirits/Mixed</span></button
					>
				</div>
				<div>
          <div>
						<GlassWater />
						Custom Drink
						<label  >
								<span>Drink name</span>
								<input type="text" bind:value={customName} />
							</label>
							<div  >
								<label  >
									<span>Volume in ml</span>
									<input type="number" bind:value={customVolume} />
								</label>
								<label  >
									<span>Percentage</span>
									<div>
										<input type="number" bind:value={customPercent} />
										<div  >%</div>
									</div>
								</label>
							</div>
							<button
								
								onclick={() => {
									addDrink(customName, customVolume * (customPercent / 100));
									customName = 'Spirit shot';
									customVolume = 40;
									customPercent = 40;
								}}
								><span><Plus /></span><span>Add</span>
							</button>
            </div>
          </div>

				<table>
					<thead>
            <tr>
              <th>Drink</th>
              <th>This Drink</th>
              <th>BAC <span  >Peak</span></th>
              <th>Time</th>
              <th>Remove</th>
            </tr>
					</thead>
					<tbody  >
						{#each $drinks as drink, i}
							<tr>
								<td>{drink.name}</td>
								<td  >{drink.bac.toFixed(4)}</td>
								<td>{(drink.bacAtStart + drink.bac).toFixed(4)}</td>
								<td
									><span  >{dayjs(drink.datetime).fromNow()}</span><span
										 >{dayjs(drink.datetime).format('HH:mm')}</span
									></td
								>
								<td
									><button
										 
										onclick={(e) => {
                      e.preventDefault()
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
				<div  >
					<button
						 
						
						disabled={$drinks.length < 1}>Reset</button
					>
				</div>
				<div >
					<p>Are you sure? This will delete all of your drinks history and cannot be undone!</p>
					<div  >
						<button  >Cancel</button>
						<button
							 
							onclick={() => ($drinksStringDates = [])}>Delete history</button
						>
					</div>
					<div />
				</div>
			{/if}
		</section>

		<ChartPanel />
		<SettingsMenu />
		<div  >
			<small
				>Reminder: this app is not to be used to calculate BAC with accuracy, and should not be
				relied on for any purpose. If you or others around you have concerns about your drinking,
				seek professional help.</small
			>
		</div>
	</div>
</div>