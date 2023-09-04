# Drinks

## Install Your Own Copy

```sh
npm install
npm run dev
```

(or pnpm, etc.)

## Roadmap

### Version 2

- Add the functionality to set a date/time for a drink, so users can log drinks they forgot to log immediately, or restore drinks they deleted accidentally.
- Set up ‘favourite’ drinks - saved custom drinks with predefined volumes and percentages, and offer these buttons to users rather than requiring them to add a custom drink every time.

### Version 1.X

- Configurable week count
- Add daily target maxes/excesses ('binge day' tracking)
- Ask the user for the key details (gender and weight) before the app starts working. By default it is configured for an 85kg male, which will underestimate BAC for females or males who weigh less than 85kg.
- Some people may prefer to use stone or pounds to input their weight. These are easily convertible, so perhaps these options could also be offered to users.
- Add ‘get help’ links for people who are struggling with alcohol addiction, and links to taxi companies for those who may be considering whether they might be ‘safe to drive’
- Add the functionality to recalculate ‘starting BAC’ when a drink is deleted.
- Add a ‘confirm’ prompt to every drink deletion, not just the reset button.
- Refactor it all out of a giant single file

## Changelog

### Version 1.1.0:

- Add 8 week graphs.
- Add weekly target units.
- Add 'Time since last drink'

### Version 1.0.0: Initial release
