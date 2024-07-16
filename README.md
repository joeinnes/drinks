# Drinks

## Install Your Own Copy

```sh
npm install
npm run dev
```

(or pnpm, etc.)

## Roadmap

### Version 2.X
- [ ] Configurable week count
- [ ] Put charts back (when shadcn svelte adds charts from shadcn)
- [ ] Recalculate ‘starting BAC’ when a drink is deleted.
- [ ] Some people may prefer to use stone or pounds to input their weight. These are easily convertible, so perhaps these options could also be offered to users.
- [ ] Refactor it all out of a giant single file
- [ ] Add app onboading: ask the user for the key details (gender and weight) before the app starts working. By default it is configured for an 85kg male, which will underestimate BAC for females or males who weigh less than 85kg.
  
#### Version 2.2
- [ ] Set up ‘favourite’ drinks - saved custom drinks with predefined volumes and percentages, and offer these buttons to users rather than requiring them to add a custom drink every time.

#### Version 2.1
- [ ] Add ‘get help’ links for people who are struggling with alcohol addiction, and links to taxi companies for those who may be considering whether they might be ‘safe to drive’
- [ ] Add a ‘confirm’ prompt to every drink deletion.
- [ ] Restore 'reset' functionality

### Version 2.0
- [x] Add the functionality to set a date/time for a drink, so users can log drinks they forgot to log immediately, or restore drinks they deleted accidentally.


### Version 2.X

## Changelog

### Version 2.0.1:
- Bug fixes

### Version 2.0.0:
- Switch to shadcn
- Add possibility to record drinks at other times than now

### Version 1.1.0:

- Add 8 week graphs.
- Add weekly target units.
- Add 'Time since last drink'

### Version 1.0.0: Initial release
