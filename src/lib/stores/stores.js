import { derived, get, readable } from 'svelte/store';
import { localStorageStore } from '@skeletonlabs/skeleton';
import dayjs from '$lib/dayjs';
import { calculateBacAddition } from '$lib/utilities/utilities';

/**
 * @type {import('svelte/store').Writable<App.Drink[]>}
 */
const drinksStringDates = localStorageStore('drinks', []);
/**
 * @type {import('svelte/store').Readable<App.Drink[]>}
 */
const drinks = derived(drinksStringDates, ($drinks) =>
	$drinks
		.map((el) => ({
			...el,
			datetime: new Date(el.datetime)
		}))
		.sort((a, b) => (a.datetime.valueOf() - b.datetime.valueOf() > 0 ? -1 : 1))
);
/**
 * @type {import('svelte/store').Writable<'m' | 'f'>}
 */
const gender = localStorageStore('gender', 'm');
/**
 * @type {import('svelte/store').Writable<number>}
 */
const weight = localStorageStore('weight', 85000);
/**
 * @type {import('svelte/store').Writable<number>}
 */
// const bac = localStorageStore('bac', 0);
/**
 * @type {import('svelte/store').Writable<number>}
 */
const target = localStorageStore('target', 0.08);

/**
 * @type {import('svelte/store').Writable<number>}
 */
const weeklyTarget = localStorageStore('weeklyTarget', 14);
/**
 * @type {import('svelte/store').Writable<boolean>}
 */
const hasReadDisclaimer = localStorageStore('disclaimer', false);

const frequency = readable(1000);
const tick = derived(
	frequency,
	($frequency, set) => {
		const interval = setInterval(() => {
			set(Date.now());
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	},
	1000
);

// 06:30

const bac = derived([tick, drinks], ([, $drinks]) => {
	// Define the metabolism rate (0.016% reduction in BAC per hour)
	const metabolismRate = 0.016;

	// Initialize variables for total alcohol consumed and last drink time
	let bloodAlc = 0;
	let lastDrinkTime = null;

	// Calculate alcohol consumed in grams for each drink
	let table = [];
	let theseDrinks = [...$drinks].reverse();
	for (const drink of theseDrinks) {
		const elapsedHours = lastDrinkTime
			? dayjs(drink.datetime).diff(dayjs(lastDrinkTime), 'hour', true)
			: 0;

		const metabolizedAlcoholAsBacPercentage = metabolismRate * Math.max(elapsedHours, 0);
		const bacAddition = calculateBacAddition(drink.volume, get(weight), get(gender));
		bloodAlc = bloodAlc + bacAddition - Math.min(metabolizedAlcoholAsBacPercentage, bloodAlc);
		lastDrinkTime = drink.datetime;
		table.push({
			time: drink.datetime,
			bacAddition,
			elapsed: elapsedHours,
			metabolised: metabolizedAlcoholAsBacPercentage,
			bloodAlc
		});
	}
	const elapsedHours = lastDrinkTime ? dayjs().diff(dayjs(lastDrinkTime), 'hour', true) : 0;

	const metabolizedAlcoholAsBacPercentage = metabolismRate * Math.max(elapsedHours, 0);
	bloodAlc = bloodAlc - Math.min(metabolizedAlcoholAsBacPercentage, bloodAlc);

	return Math.max(bloodAlc, 0);
});

const timeToZero = derived(bac, ($bac) => $bac / 0.016);
const timeToTarget = derived([bac, target], ([$bac, $target]) =>
	Math.max(0, ($bac - $target) / 0.016)
);
const timeOfZero = derived(timeToZero, ($timeToZero) => dayjs().add($timeToZero, 'hours'));
const timeOfTarget = derived(timeToTarget, ($timeToTarget) => dayjs().add($timeToTarget, 'hours'));
const timeSinceLast = derived([tick, drinks], ([, $drinks]) => {
	return dayjs().to(dayjs($drinks[0]?.datetime));
});
export {
	drinks,
	drinksStringDates,
	gender,
	weight,
	bac,
	target,
	timeToTarget,
	weeklyTarget,
	hasReadDisclaimer,
	timeToZero,
	timeOfZero,
	timeOfTarget,
	timeSinceLast
};
