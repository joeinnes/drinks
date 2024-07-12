<script>
	import { Beer, Delete, GlassWater, Martini, Plus, Settings, Wine } from 'lucide-svelte';
	import dayjs from 'dayjs';
	import isoWeek from 'dayjs/plugin/isoWeek';
	dayjs.extend(isoWeek);

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Pagination from '$lib/components/ui/pagination';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import * as Table from '$lib/components/ui/table';

	import useLocalStorage from '$lib/stores/stores.svelte';
	import { calculateBacAddition } from '$lib/utilities/utilities';

	let drinks = useLocalStorage('drinks', []);
	let weight = useLocalStorage('weight', 80000);
	let gender = useLocalStorage('gender', 'm');
	let target = useLocalStorage('target', 0.08);
	let weeklyTarget = useLocalStorage('weeklyTarget', 14);
	let hasReadDisclaimer = useLocalStorage('hasReadDisclaimer', false);

	let sortedDrinks = $derived(
		drinks.value
			.map((el) => ({
				...el,
				datetime: new Date(el.datetime)
			}))
			.sort((a, b) => (a.datetime.valueOf() - b.datetime.valueOf() > 0 ? -1 : 1))
	);

	let tick = $state();
	let customName = $state('Spirit shot');
	let customPercent = $state(40);
	let customVolume = $state(40);
	let page = $state(1);

	let bac = $derived.by(() => {
		tick;
		const metabolismRate = 0.016;

		// Initialize variables for total alcohol consumed and last drink time
		let bloodAlc = 0;
		let lastDrinkTime = null;

		// Calculate alcohol consumed in grams for each drink
		let table = [];
		let theseDrinks = sortedDrinks.toReversed();
		for (const drink of theseDrinks) {
			const elapsedHours = lastDrinkTime
				? dayjs(drink.datetime).diff(dayjs(lastDrinkTime), 'hour', true)
				: 0;

			const metabolizedAlcoholAsBacPercentage = metabolismRate * Math.max(elapsedHours, 0);
			const bacAddition = calculateBacAddition(drink.volume, weight.value, gender.value);
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
	let timeToZero = $derived(bac / 0.016);
	let timeToTarget = $derived(Math.max(0, (bac - target.value) / 0.016));
	let unitsPerDay = $derived(
		drinks.value.reduce((acc, curr) => {
			const dateOfDrink = dayjs(curr.datetime).format('YYYY-MM-DD');
			if (acc[dateOfDrink]) {
				acc[dateOfDrink] = acc[dateOfDrink] + curr.volume / 10;
			} else {
				acc[dateOfDrink] = curr.volume / 10;
			}
			return acc;
		}, /** @type Record<string, number> */ ({}))
	);

	let excessDays = $derived(
		Object.values(unitsPerDay).filter((el) => el > weeklyTarget / 3).length
	); // Note: recommendation from NHS is that drinks should be spread over 3 or more days: https://www.nhs.uk/conditions/alcohol-misuse/
	let drinksMap = $derived.by(() => {
		let map = {};
		drinks.value.forEach((drink) => {
			console.log(drink);
			const drinksmapDrinkDT = dayjs(drink.datetime);
			let week = 'W' + drinksmapDrinkDT.isoWeek() + ' ' + drinksmapDrinkDT.isoWeekYear();
			if (map.hasOwnProperty(week)) {
				map[week] = map[week] + drink.volume / 10;
			} else {
				map[week] = drink.volume / 10;
			}
		});
		return map;
	});

	/**
	 * @param {string} name
	 * @param {number} volume
	 */
	const addDrink = (name, volume) => {
		/** type Drink */
		const drinkToAdd = {
			name,
			volume,
			bac: calculateBacAddition(volume, weight.value, gender.value),
			bacAtStart: bac,
			datetime: new Date()
		};
		drinks.value = [...drinks.value, drinkToAdd];
	};

	setInterval(() => (tick = new Date().getTime()), 1000);
</script>

<h1 class="text-center text-4xl font-bold">Drinks</h1>
<main class="p-2 space-y-4">
	{#if !hasReadDisclaimer.value}
		<Card.Root>
			<Card.Header>
				<Card.Title>Warning</Card.Title>
			</Card.Header>
			<Card.Content>
				<p>
					This app uses some calculations to guess approximately what your blood alcohol content is
					based on what you have had to drink and when.
				</p>
				<ul class="list-disc">
					<li>
						<span>
							You <strong>MUST NOT</strong> use this app to estimate when you may be below a drink-driving
							limit, or safe to operate heavy machinery, etc.</span
						>
					</li>
					<li>
						<span
							>This app <strong>MUST NOT</strong> be used for any purpose other than out of personal
							curiosity. The numbers it creates are at best guesses.</span
						>
					</li>
					<li>
						<span>You <strong>MUST NOT</strong> rely on this app for making decisions.</span>
					</li>

					<p>
						This app is available as-is, with no warranty express or implied. You must not rely on
						this app to inform decisions.
					</p>
				</ul>
			</Card.Content>
			<Card.Footer class="flex justify-center">
				<Button onclick={() => (hasReadDisclaimer.value = true)}>I understand and agree</Button>
			</Card.Footer>
		</Card.Root>
	{/if}
	<Card.Root>
		<Card.Content class="pt-6">
			{#if drinks.value.length}
				<p>Your last drink was {dayjs().to(dayjs(drinks.value[0]?.datetime))}.</p>
			{:else}<p>No drinks recorded.</p>
			{/if}
			<div class="grid grid-cols-3 gap-2 text-center pt-2">
				<div>
					<h3 class="text-sm">Current BAC</h3>
					<p class="font-black text-2xl">{bac.toFixed(4)}</p>
					<small />
				</div>
				<div>
					<h3 class="text-sm">Time to Zero</h3>
					<p class="font-black text-2xl">
						{Math.floor(timeToZero)}h{Math.round((timeToZero - Math.floor(timeToZero)) * 60)}m
					</p>
					<small>{timeToZero ? dayjs().add(timeToZero, 'hours').format('h:mm a') : ''}</small>
				</div>
				<div>
					<h3 class="text-sm">Time to Target</h3>
					<p class="font-black text-2xl">
						{Math.floor(timeToTarget)}h{Math.round((timeToTarget - Math.floor(timeToTarget)) * 60)}m
					</p>
					<small>{timeToTarget ? dayjs().add(timeToTarget, 'hours').format('h:mm a') : ''}</small>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header><Card.Title>Add Drink</Card.Title></Card.Header>
		<Card.Content>
			<div class="flex gap-2 flex-wrap justify-center">
				<Button
					variant={bac > target.value
						? 'destructive'
						: calculateBacAddition(0.045 * 330, weight.value, gender.value) + bac > target.value
						? 'secondary'
						: undefined}
					onclick={() => addDrink('Small beer', 0.045 * 330)}
					><Beer class="mr-2 w-4" /> Small Beer</Button
				><Button
					variant={bac > target.value
						? 'destructive'
						: calculateBacAddition(0.045 * 500, weight.value, gender.value) + bac > target.value
						? 'secondary'
						: undefined}
					onclick={() => addDrink('Large beer', 0.045 * 500)}
					><Beer class="mr-2" /> Large Beer</Button
				><Button
					variant={bac > target.value
						? 'destructive'
						: calculateBacAddition(0.14 * 150, weight.value, gender.value) + bac > target.value
						? 'secondary'
						: undefined}
					onclick={() => addDrink('Red wine', 0.14 * 150)}><Wine class="mr-2" />Red Wine</Button
				><Button
					onclick={() => addDrink('White wine', 0.12 * 150)}
					variant={bac > target.value
						? 'destructive'
						: calculateBacAddition(0.12 * 150, weight.value, gender.value) + bac > target.value
						? 'secondary'
						: undefined}><Wine class="mr-2" />White Wine</Button
				><Button
					onclick={() => addDrink('Spirits', 0.375 * 40)}
					variant={bac > target.value
						? 'destructive'
						: calculateBacAddition(0.375 * 40, weight.value, gender.value) + bac > target.value
						? 'secondary'
						: undefined}><Martini class="mr-2" />Spirits/Mixed</Button
				><Drawer.Root>
					<Drawer.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							variant={bac > target.value
								? 'destructive'
								: calculateBacAddition(0.375 * 40, weight.value, gender.value) + bac > target.value
								? 'secondary'
								: undefined}><GlassWater class="mr-2" />Custom Drink</Button
						>
					</Drawer.Trigger>
					<Drawer.Content>
						<Drawer.Header>
							<Drawer.Title>Add a custom drink</Drawer.Title>
							<Drawer.Description>Add details of your drink.</Drawer.Description>
						</Drawer.Header>
						<div class="p-4">
							<Label for="name">Drink Name</Label>
							<Input name="name" id="name" bind:value={customName} />
							<Label for="volume">Volume in ml</Label>
							<Input name="volume" id="volume" type="number" bind:value={customVolume} />
							<Label for="percent">Percentage</Label>
							<Input name="percent" id="percent" type="number" bind:value={customPercent} />
						</div>
						<Drawer.Footer>
							<Drawer.Close>
								<Button
									onclick={() => {
										addDrink(customName, customVolume * (customPercent / 100));
										customName = 'Spirit shot';
										customVolume = 40;
										customPercent = 40;
									}}>Save</Button
								>
								<Button variant="outline">Close</Button>
							</Drawer.Close>
						</Drawer.Footer>
					</Drawer.Content>
				</Drawer.Root>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header><Card.Title>Drink List</Card.Title></Card.Header>
		<Card.Content
			><Table.Root>
				<Table.Caption>A list of your recent drinks.</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head>Drink</Table.Head>
						<Table.Head>BAC</Table.Head>
						<Table.Head>Time</Table.Head>
						<Table.Head>Remove</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each sortedDrinks.slice((page - 1) * 10, (page - 1) * 10 + 10) as drink, i (i)}
						<Table.Row>
							<Table.Cell class="font-medium">{drink.name}</Table.Cell>
							<Table.Cell>{drink.bac.toFixed(4)}</Table.Cell>
							<Table.Cell>{dayjs(drink.datetime).format('HH:mm')}</Table.Cell>
							<Table.Cell
								><Button
									variant="outline"
									size="icon"
									onclick={(e) => {
										e.preventDefault();
										sortedDrinks.splice(i, 1);
										drinks.value = sortedDrinks;
									}}><Delete /></Button
								></Table.Cell
							>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
			<Pagination.Root
				siblingCount={0}
				count={drinks.value.length}
				perPage={10}
				bind:page
				let:pages
				let:currentPage
			>
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.PrevButton />
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.value > 0}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item isVisible={currentPage == page.value}>
									<Pagination.Link {page} isActive={currentPage == page.value}>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/if}
					{/each}
					<Pagination.Item>
						<Pagination.NextButton />
					</Pagination.Item>
				</Pagination.Content>
			</Pagination.Root>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header><Card.Title>How Much Have You Been Drinking?</Card.Title></Card.Header>
		<Card.Content>
			<div class="grid grid-cols-4 gap-1 text-center">
				<div class="flex flex-col justify-between">
					<h3 class="text-xs">Average Daily Units</h3>
					<p class="text-2xl font-black">
						{isNaN(
							(
								Object.values(drinksMap).reduce((acc, curr) => acc + curr, 0) /
								Object.keys(drinksMap).length /
								7
							).toFixed(2)
						)
							? ' '
							: (
									Object.values(drinksMap).reduce((acc, curr) => acc + curr, 0) /
									Object.keys(drinksMap).length /
									7
							  ).toFixed(2)}
					</p>
				</div>
				<div class="flex flex-col justify-between">
					<h3 class="text-xs">Average Weekly Units</h3>
					<p class="text-2xl font-black">
						{isNaN(
							(
								Object.values(drinksMap).reduce((acc, curr) => acc + curr, 0) /
								Object.keys(drinksMap).length
							).toFixed(2)
						)
							? ' '
							: (
									Object.values(drinksMap).reduce((acc, curr) => acc + curr, 0) /
									Object.keys(drinksMap).length
							  ).toFixed(2)}
					</p>
				</div>
				<div class="flex flex-col justify-between">
					<h3 class="text-xs">Excess Weeks</h3>
					<p class="text-2xl font-black">
						{Object.values(drinksMap).filter((el) => el > weeklyTarget).length + ''}
					</p>
				</div>
				<div class="flex flex-col justify-between">
					<h3 class="text-xs">Excess Days</h3>
					<p class="text-2xl font-black">{excessDays + ''}</p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<div class="text-center text-foreground">
		<Drawer.Root>
			<Drawer.Trigger asChild let:builder>
				<Button builders={[builder]} variant="outline"><Settings class="mr-2" />Settings</Button>
			</Drawer.Trigger>
			<Drawer.Content>
				<Drawer.Header>
					<Drawer.Title>Settings</Drawer.Title>
					<Drawer.Description>Add your details below.</Drawer.Description>
				</Drawer.Header>
				<div class="p-4">
					<Label for="weight">Weight in grams</Label>
					<Input
						name="weight"
						id="weight"
						value={weight.value}
						onchange={(e) => {
							weight.value = e.target.value;
						}}
					/>
					<Label for="max_bac">Target maximum BAC</Label>
					<Input
						name="max_bac"
						id="max_bac"
						value={target.value}
						onchange={(e) => {
							target.value = e.target.value;
						}}
					/>
					<Label for="max_week">Target maximum units per week</Label>
					<Input
						name="max_week"
						id="max_week"
						value={weeklyTarget.value}
						onchange={(e) => {
							weeklyTarget.value = e.target.value;
						}}
					/>

					<Label for="gender">Gender</Label>
					<RadioGroup.Root
						value={gender.value}
						onValueChange={(e) => {
							gender.value = e;
						}}
					>
						<div class="flex items-center space-x-2">
							<RadioGroup.Item value="m" id="m" />
							<Label for="m">Male</Label>
						</div>
						<div class="flex items-center space-x-2">
							<RadioGroup.Item value="f" id="f" />
							<Label for="f">Female</Label>
						</div>
					</RadioGroup.Root>
				</div>
				<Drawer.Footer>
					<Drawer.Close asChild let:builder>
						<Button builders={[builder]} variant="outline">Close</Button>
					</Drawer.Close>
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Root>
	</div>
</main>

<footer class="p-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Disclaimer</Card.Title>
		</Card.Header>
		<Card.Content>
			<p>
				Reminder: this app is not to be used to calculate BAC with accuracy, and should not be
				relied on for any purpose. If you or others around you have concerns about your drinking,
				seek professional help.
			</p>
		</Card.Content>
	</Card.Root>
</footer>
