/** Thanks https://userunes.com/ */
import { onMount } from 'svelte';

/**
 * @param {string} key
 * @param {any} initialValue
 */
const useLocalStorage = (key, initialValue) => {
	let value = $state(initialValue);

	onMount(() => {
		const currentValue = localStorage.getItem(key);
		if (currentValue) value = JSON.parse(currentValue);
	});

	const save = () => {
		if (value) {
			localStorage.setItem(key, JSON.stringify(value));
		} else {
			localStorage.removeItem(key);
		}
	};

	return {
		get value() {
			return value;
		},
		set value(v) {
			value = v;
			save();
		}
	};
};

export default useLocalStorage;

/*
const drinksStringDates = localStore('drinks', []);

const drinks = derived(drinksStringDates, ($drinks) =>
	$drinks
		.map((el) => ({
			...el,
			datetime: new Date(el.datetime)
		}))
		.sort((a, b) => (a.datetime.valueOf() - b.datetime.valueOf() > 0 ? -1 : 1))
);

const gender = localStore('gender', 'm');

const weight = localStore('weight', 85000);

const target = localStore('target', 0.08);

const weeklyTarget = localStore('weeklyTarget', 14);

const hasReadDisclaimer = localStore('disclaimer', false);

const frequency = localStore(1000);
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
*/
