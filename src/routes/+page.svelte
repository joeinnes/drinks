<script>
	import { Beer, Delete, GlassWater, Martini, Settings, Wine } from 'lucide-svelte';
	import dayjs from 'dayjs';
	import isoWeek from 'dayjs/plugin/isoWeek';
	import relativeTime from 'dayjs/plugin/relativeTime';

	dayjs.extend(isoWeek);
	dayjs.extend(relativeTime);

	import * as Accordion from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Pagination from '$lib/components/ui/pagination';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';

	import useLocalStorage from '$lib/stores/stores.svelte';
	import { calculateBacAddition } from '$lib/utilities/utilities';
	import UsefulLinksPanel from '$lib/components/UsefulLinksPanel.svelte';

	let loading = useLocalStorage('loading', true);

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
	let customTime = $state(dayjs().format('YYYY-MM-DDTHH:mm'));
	let page = $state(1);
	let confirmText = $state('');

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
	let stateInWords = $derived.by(() => {
		if (bac > 0.2) return 'Dangerous levels!';
		if (bac > 0.15) return 'Severe impairment';
		if (bac > 0.1) return 'Serious impairment';
		if (bac > 0.08) return 'High impairment';
		if (bac > 0.04) return 'Some impairment';
		if (bac > 0.02) return 'Mild impairment';
		if (bac > 0) return 'Minimal impairment';
		return 'Sober';
	});
	let lastDrink = $derived.by(() => {
		tick;
		return dayjs().to(dayjs(sortedDrinks[0]?.datetime));
	});

	/**
	 * @param {string} name
	 * @param {number} volume
	 * @param {string} [time]
	 */
	const addDrink = (name, volume, time) => {
		/** type Drink */
		const drinkToAdd = {
			name,
			volume,
			bac: calculateBacAddition(volume, weight.value, gender.value),
			bacAtStart: bac,
			datetime: time ? dayjs(time).toDate() : new Date()
		};
		drinks.value = [...drinks.value, drinkToAdd];
	};

	setInterval(() => (tick = new Date().getTime()), 1000);
	$effect(() => {
		loading.value = false;
	});
	$inspect(drinksMap);
</script>

<div class="flex items-center justify-center gap-2">
	<img src="/beer_logo.svg" class="w-16 h-16" alt="Logo" />
	<h1 class="text-6xl font-bold">Drinks</h1>
</div>
<main class="p-2 space-y-4">
	{#if !loading.value}
		{#if !hasReadDisclaimer.value}
			<Card.Root>
				<Card.Header>
					<Card.Title>Warning</Card.Title>
				</Card.Header>
				<Card.Content>
					<p>
						This app uses some calculations to guess approximately what your blood alcohol content
						is based on what you have had to drink and when.
					</p>
					<ul class="list-disc list-inside">
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
				{#if sortedDrinks?.length}
					<p>Your last drink was {lastDrink}.</p>
				{:else}<p>No drinks recorded.</p>
				{/if}
				<div class="grid grid-cols-3 gap-2 text-center pt-2">
					<div>
						<h3 class="text-sm">Current BAC</h3>
						<p class="font-black text-2xl">{bac.toFixed(4)}</p>
						<small>{stateInWords}</small>
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
							{Math.floor(timeToTarget)}h{Math.round(
								(timeToTarget - Math.floor(timeToTarget)) * 60
							)}m
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
					><Drawer.Root onOpenChange={() => (customTime = dayjs().format('YYYY-MM-DDTHH:mm'))}>
						<Drawer.Trigger asChild let:builder>
							<Button
								builders={[builder]}
								variant={bac > target.value
									? 'destructive'
									: calculateBacAddition(0.375 * 40, weight.value, gender.value) + bac >
									  target.value
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
								<Label for="time">Time</Label>
								<Input name="time" id="time" type="datetime-local" bind:value={customTime} />
							</div>
							<Drawer.Footer>
								<Drawer.Close>
									<Button
										onclick={() => {
											addDrink(customName, customVolume * (customPercent / 100), customTime);
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
							<Table.Head class="hidden md:table-cell">This Drink Added</Table.Head>
							<Table.Head
								>BAC<span class="hidden md:inline">&nbsp;After This Drink</span></Table.Head
							>
							<Table.Head>Time</Table.Head>
							<Table.Head class="text-center">Remove</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each sortedDrinks.slice((page - 1) * 10, (page - 1) * 10 + 10) as drink, i (i)}
							<Table.Row>
								<Table.Cell class="font-semibold">{drink.name}</Table.Cell>
								<Table.Cell class="hidden md:table-cell">{drink.bac.toFixed(4)}</Table.Cell>
								<Table.Cell>{drink.bac.toFixed(4)}</Table.Cell>
								<Table.Cell class="text-center md:text-start flex flex-col"
									><p class="hidden md:inline">{dayjs(drink.datetime).fromNow()}</p>
									<p class="inline md:hidden">
										{dayjs(drink.datetime).format('HH:mm')}
									</p>
									<small>{dayjs(drink.datetime).format('DD MMM')}</small></Table.Cell
								>
								<Table.Cell class="text-end">
									<Dialog.Root>
										<Dialog.Trigger
											><Button variant="secondary" size="icon"><Delete /></Button></Dialog.Trigger
										>
										<Dialog.Content class="max-w-[90dvw]">
											<Dialog.Header>
												<Dialog.Title>Are you sure?</Dialog.Title>
												<Dialog.Description>
													You are about to delete the only copy of this data. There is no undo
													button, and no way to recover this data if you proceed.
												</Dialog.Description>
											</Dialog.Header>
											<Dialog.Footer>
												<Button
													variant="destructive"
													onclick={(e) => {
														e.preventDefault();
														sortedDrinks.splice(i, 1);
														drinks.value = sortedDrinks;
													}}>Yes, I'm sure</Button
												>
												<Dialog.Close asChild let:builder>
													<Button variant="outline" class="w-full mb-2" builders={[builder]}
														>No, don't delete</Button
													></Dialog.Close
												>
											</Dialog.Footer>
										</Dialog.Content>
									</Dialog.Root>
								</Table.Cell>
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
								? '0'
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
								? '0'
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
		<Card.Root>
			<Card.Header><Card.Title>Last 7 Days</Card.Title></Card.Header>
			<Card.Content>
				<div class="grid grid-cols-3 gap-1 text-center">
					<div class="flex flex-col justify-between">
						<h3 class="text-xs">Number of Drinks</h3>
						<p class="text-2xl font-black">
							{Object.values(drinks.value).filter((el) => {
								const startDate = dayjs().subtract(7, 'day');
								return dayjs(el.datetime).isAfter(startDate);
							})?.length}
						</p>
					</div>
					<div class="flex flex-col justify-between">
						<h3 class="text-xs">Units Consumed</h3>
						<p class="text-2xl font-black">
							{(
								Object.values(drinks.value).reduce((acc, curr) => {
									const startDate = dayjs().subtract(7, 'day');
									if (dayjs(curr.datetime).isAfter(startDate)) {
										return acc + curr.volume;
									}
									return acc;
								}, 0) / 10
							).toFixed(0)}
						</p>
					</div>
					<div class="flex flex-col justify-between">
						<h3 class="text-xs">Days Drinking</h3>
						<p class="text-2xl font-black">
							{[
								...new Set(
									Object.values(drinks.value).map((el) => dayjs(el.datetime).format('DD-MMM-YYYY'))
								)
							].length}
						</p>
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
						<Select.Root
							onSelectedChange={(e) => {
								gender.value = e.value;
							}}
							selected={{ value: gender.value, label: gender.value === 'f' ? 'Female' : 'Male' }}
						>
							<Select.Trigger>
								<Select.Value placeholder="Gender" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="m" isSelected={gender.value === 'm'}>Male</Select.Item>
								<Select.Item value="f" isSelected={gender.value === 'f'}>Female</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					<div class="p-4">
						<Accordion.Root>
							<Accordion.Item value="item-1">
								<Accordion.Trigger>Advanced</Accordion.Trigger>
								<Accordion.Content
									><Dialog.Root onOpenChange={() => (confirmText = '')}>
										<Dialog.Trigger
											><Button variant="destructive">Reset All Data</Button></Dialog.Trigger
										>
										<Dialog.Content class="max-w-[90dvw]">
											<Dialog.Header>
												<Dialog.Title>Are you sure?</Dialog.Title>
												<Dialog.Description>
													You are about to delete the only copy of this data. There is no undo
													button, and no way to recover your data if you proceed. If you are sure,
													then please type <strong>drinks</strong> underneath.
												</Dialog.Description>
												<Input bind:value={confirmText} type="text" />
											</Dialog.Header>
											<Dialog.Footer>
												<Button
													variant="destructive"
													disabled={confirmText.toLocaleLowerCase() !== 'drinks'}
													onclick={(e) => {
														e.preventDefault();
														drinks.value = [];
														weight.value = 80000;
														gender.value = 'm';
														target.value = 0.08;
														weeklyTarget.value = 14;
														hasReadDisclaimer.value = false;
														window.location.reload();
													}}>Yes, I'm sure</Button
												>
												<Dialog.Close asChild let:builder>
													<Button variant="outline" class="w-full mb-2" builders={[builder]}
														>No, don't delete</Button
													></Dialog.Close
												>
											</Dialog.Footer>
										</Dialog.Content>
									</Dialog.Root>
									<p>Debug Details</p>
									<pre>{JSON.stringify(
											{
												drinks: drinks.value,
												weight: weight.value,
												gender: gender.value,
												target: target.value,
												weeklyTarget: weeklyTarget.value,
												hasReadDisclaimer: hasReadDisclaimer.value
											},
											null,
											2
										)}</pre>
								</Accordion.Content>
							</Accordion.Item>
						</Accordion.Root>
					</div>
					<Drawer.Footer>
						<Drawer.Close asChild let:builder>
							<Button builders={[builder]} variant="outline">Close</Button>
						</Drawer.Close>
					</Drawer.Footer>
				</Drawer.Content>
			</Drawer.Root>
		</div>
	{/if}
	<UsefulLinksPanel />
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
