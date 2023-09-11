<script>
	import { onMount } from 'svelte';

	import dayjs from '$lib/dayjs';
	import { drinks, weeklyTarget } from '$lib/stores/stores';

	import Metric from '$lib/components/Metric.svelte';
	// Charts logic
	import Chart from 'chart.js/auto';
	/** @type HTMLCanvasElement */
	let chart;
	import isoWeek from 'dayjs/plugin/isoWeek';
	dayjs.extend(isoWeek);
	/** @type Record<String, number> */
	let drinksMap = {};
	let excessDays = 0;

	/** @type {import('chart.js').Chart} */
	let chartJSObject;
	onMount(() => {
		chartJSObject = new Chart(chart, {
			type: 'line',
			options: {
				responsive: true,
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 1
						}
					}
				},
				plugins: {
					legend: {
						display: false
					}
				}
			},
			data: {
				labels: Object.keys(drinksMap),
				datasets: [
					{
						data: Object.keys(drinksMap).map((el) => drinksMap[el]),
						tension: 0.5
					},
					{
						data: Object.keys(drinksMap).map((el) => $weeklyTarget),
						borderDash: [5, 5],
						pointRadius: 0
					}
				]
			}
		});
	});

	$: {
		const unitsPerDay = $drinks.reduce((acc, curr) => {
			const dateOfDrink = dayjs(curr.datetime).format('YYYY-MM-DD');
			if (acc[dateOfDrink]) {
				acc[dateOfDrink] = acc[dateOfDrink] + curr.volume / 10;
			} else {
				acc[dateOfDrink] = curr.volume / 10;
			}
			return acc;
		}, /** @type Record<string, number> */ ({}));
		excessDays = Object.values(unitsPerDay).filter((el) => el > $weeklyTarget / 3).length; // Note: recommendation from NHS is that drinks should be spread over 3 or more days: https://www.nhs.uk/conditions/alcohol-misuse/
		for (let i = 7; i >= 0; i--) {
			let startDate = dayjs().subtract(i, 'week');
			drinksMap['W' + startDate.isoWeek() + ' ' + startDate.isoWeekYear()] = 0;
		}

		$drinks.forEach((drink) => {
			const drinksmapDrinkDT = dayjs(drink.datetime);
			let week = 'W' + drinksmapDrinkDT.isoWeek() + ' ' + drinksmapDrinkDT.isoWeekYear();
			if (drinksMap.hasOwnProperty(week)) {
				drinksMap[week] = drinksMap[week] + drink.volume / 10;
			}
		});
		if (chartJSObject) {
			chartJSObject.data = {
				labels: Object.keys(drinksMap),
				datasets: [
					{
						data: Object.keys(drinksMap).map((el) => drinksMap[el]),
						tension: 0.5
					},
					{
						data: Object.keys(drinksMap).map((el) => $weeklyTarget),
						borderDash: [5, 5],
						pointRadius: 0
					}
				]
			};
			chartJSObject?.update('none');
		}
	}
</script>

<section class="card p-4 w-full">
	<h2 class="mb-4 h3">How Much Have You Been Drinking?</h2>
	<canvas bind:this={chart} />
	<div class="flex gap-2 justify-around my-2 text-center">
		<Metric
			title="Average Daily Units"
			value={(
				Object.values(drinksMap).reduce((acc, curr) => acc + curr, 0) /
				Object.keys(drinksMap).length /
				7
			).toFixed(2)}
		/>

		<Metric
			title="Average Weekly Units"
			value={(
				Object.values(drinksMap).reduce((acc, curr) => acc + curr, 0) /
				Object.keys(drinksMap).length
			).toFixed(2)}
		/>

		<Metric
			title="Excess Weeks"
			value={Object.values(drinksMap).filter((el) => el > $weeklyTarget).length + ''}
		/>

		<Metric title="Excess Days" value={excessDays + ''} />
	</div>

	<p class="hidden">
		<small
			>Note that it is the current UK guidelines that both men and women do not exceed 14 units per
			week, spread out over at least three days. This is lower than most European countries for men,
			and about average for women. A unit is 10ml of pure alcohol. New guidance says that there is
			no safe level of alcohol to drink during pregnancy. It is recommended not to drink while
			breastfeeding, although it is unlikely to harm the baby if you have a single drink and wait at
			least 2 hours before feeding. Studies have not shown that 'pumping and dumping' is effective
			to remove alcohol from breast milk.</small
		>
	</p>
</section>
