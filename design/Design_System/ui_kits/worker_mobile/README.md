# Worker Mobile — UI kit

The **Worker** phone experience: mobile-only, offline-first, **100% Bangla**, icon-first,
minimal typing. A worker logs daily operations on their ONE assigned project. Workers
NEVER see finances, settings, or any other project.

## Flow (`index.html`)
- **Home** — connectivity + pending-sync bar, Bangla greeting with Bangla date + season
  (ঋতু: বর্ষা), a 3×2 grid of large icon action tiles (খাবার / পানি / মৃত্যু / কাজ /
  ক্যামেরা / জরুরি), today's tasks, and recent entries each with a per-item sync badge.
- **খাবার (Feed) log** — big +/- stepper (minimal typing), pond chips, feed-observation
  chips (স্বাভাবিক / উদ্বৃত্ত / খালি). Save is **optimistic**: the entry appears instantly
  on Home as `PENDING`, with the Bangla offline toast "অফলাইন — সংরক্ষিত, পরে সিংক হবে".
- **জরুরি (Emergency)** — high-contrast red flow to raise an oxygen/water alert to the owner.
- Other tiles open a placeholder demonstrating the offline "saved, will sync later" state.

## Try it
Toggle **Network: Online/Offline** above the phone. Offline flips the connectivity bar and
save toast; per-item `SyncBadge`s show PENDING / SYNCED / CONFLICT / FAILED.

## Localization
Every label, number (Bengali numerals ০–৯) and date (single Bangla date + season) is Bangla.
All tap targets ≥ 48px; icons at 28px inside 48px targets.

## Composition
`ConnectivityBar`, `SyncBadge`, `StatusBadge` (lang="bn"), `StateView` (lang="bn"), `Button`
(lang="bn", size lg), `Icon`, `DualDate` (mode="bn"). The phone bezel + `TitleBar`/`Toast`
are local layout scaffolding. Data in `workerData.js`.

Files: `index.html`, `WorkerApp.jsx`, `workerData.js`.
