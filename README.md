# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/YamiNixa/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/YamiNixa/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Trophy Atlas — the best offline guide and tracker for all 55 Grand Theft Auto VI trophies on PlayStation 5. Every trophy with its official name, description and grade, a guide written for this entry in its own words with its sources named beside it, a three-stage roadmap to the platinum, a warning for the one trophy that may be missable, and a checklist that saves in the browser with export and import. Static files, no build step, no network at run time.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in desktop Chrome. Or serve `app/` with any static file server — `app/index.html` is the entry point.

## What is inside

- `app/` — the guide itself: `index.html`, `style.css`, `app.js`, `guide.js`, `roadmap.js`, and `data/trophies.json` (all 55 trophies, each with a guide and cited sources) plus `data/roadmap.json` (the platinum roadmap, facts and missable warnings).
- `screenshots/` — renders of the guide running in a browser.
- `main.ts` — the entrypoint: copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendored library.
- `serve.ts` — a tiny static server for local previews.

## Notes

- Trophy names and descriptions are shown as PlayStation publishes them, as listed by PSNProfiles and Exophase on 18 November 2026. Every guide was written for this entry; the facts come from the launch guides named beside each trophy (PowerPyx, Push Square, KeenGamer and others) — cited, never copied.
- All 55 trophies are single-player and offline. There are no online trophies, and only one — Positive Mental Attitude — may be missable.
- Unofficial and fan-made; not affiliated with Rockstar Games, Take-Two Interactive or PlayStation. No Rockstar logo, artwork or game imagery is used.

---

<sub>Entered on [make.fun](https://make.fun/?ref=x651d7m6&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
