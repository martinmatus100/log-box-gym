# Log Box Gym

<div align="center">

![Logo](./public/favicon.svg)

**Mobile-first PWA fitness tracker for hybrid weightlifting and boxing training**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-CC4333?logo=zustand)](https://zustand.demo.pm)

</div>

---

## Features

| Feature | Description |
|---------|-------------|
| **Routines** | Create custom workout routines with exercises, sets, reps & rest times |
| **Supersets** | Group two or more exercises as a single unit for advanced training |
| **Calendar** | Plan your workouts day-by-day with weekly navigation |
| **Workout Runner** | Execute workouts with real-time set tracking & rest timer |
| **Weight per Set** | Track weight for each individual set during workouts |
| **Failure Tracking** | Log reps achieved for exercises performed to failure |
| **Statistics** | Track weekly workouts, streaks & exercise completion |
| **Progress Charts** | Visualize strength gains over time with interactive graphs |
| **Failure Charts** | Track progression of reps for exercises performed to failure |
| **Backup** | Export/import all data as JSON |
| **PWA** | Install on mobile for a native app-like experience |
| **Dark Theme** | Modern pill-styled dark UI with vibrant orange accents |

---

## What's New in v1.1

### Superseries
- Create supersets grouping two or more exercises together
- Supersets are displayed as grouped cards with visual indicators
- Rest timer between exercises within a superset
- Visual distinction in workout runner and routine cards

### Weight per Set
- Track weight for each individual set during workouts
- Visual history of completed sets with weight and reps
- Required weight input before completing a set
- Set-by-set progression tracking

### Failure Exercise Tracking
- Log actual reps achieved for exercises performed to failure
- Dedicated chart for tracking failure exercise progression
- Statistics: last reps, best record, and average
- Visual indicators for failure exercises in workout runner

### DOM Test Identifiers
- Added `data-testid` attributes to all interactive elements and key containers
- Enables robust end-to-end and integration testing with selectors like:
  - Navigation: `bottom-nav`, `tab-calendar`, `tab-routines`, `tab-dashboard`
  - Calendar: `calendar-title`, `week-days-grid`, `day-cell-{date}`, `prev-week-btn`, `next-week-btn`
  - Workout Runner: `workout-routine-name`, `current-exercise-card`, `complete-set-btn`, `rest-timer`, `weight-input`, `reps-input`
  - Routines: `routines-title`, `new-routine-btn`, `routine-card-{id}`, `routine-name-input`, `save-routine-btn`, `add-superset-btn`
  - Dashboard: `dashboard-title`, `stat-card-week`, `weekly-chart`, `exercise-select`, `weight-chart`, `failure-exercise-select`, `failure-chart`, `export-btn`, `import-btn`

### Component Updates
- `StatCard` now accepts `data-testid` prop for test targeting
- `PillButton` passes through all native button attributes including `data-testid`
- All form inputs, toggles, and action buttons are now testable
- New `SupersetForm` component for creating/editing supersets
- New `CompletedSet` type for tracking weight and reps per set

---

## Tech Stack

```
Frontend Framework  →  React 18 + TypeScript
Build Tool         →  Vite 6
Styling            →  TailwindCSS 3
State Management   →  Zustand 5
Charts             →  Recharts
Icons              →  Lucide React
```

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/log-box-gym.git
cd log-box-gym

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Project Structure

```
src/
├── app/                      # Main app component
├── features/
│   ├── calendar/            # Calendar & workout runner
│   ├── dashboard/           # Statistics & charts
│   └── routines/            # Routine CRUD
├── shared/
│   ├── components/          # PillButton, StatCard, etc.
│   ├── types/               # TypeScript interfaces
│   └── utils/              # Storage & date utilities
└── store/                   # Zustand global store
```

---

## Workflow

```
Routines  →  Calendar  →  Workout Runner  →  Dashboard
   ↑                                          ↓
   └────────── Export / Import (backup) ───────┘
```

---

## Screenshots

| Calendar | Workout Runner | Dashboard |
|----------|---------------|-----------|
| Weekly view | Set tracking & rest timer | Stats & charts |

---

## License

MIT © 2026
