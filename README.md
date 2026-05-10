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
| **Calendar** | Plan your workouts day-by-day with weekly navigation |
| **Workout Runner** | Execute workouts with real-time set tracking & rest timer |
| **Statistics** | Track weekly workouts, streaks & exercise completion |
| **Progress Charts** | Visualize strength gains over time with interactive graphs |
| **Backup** | Export/import all data as JSON |
| **PWA** | Install on mobile for a native app-like experience |
| **Dark Theme** | Modern pill-styled dark UI with vibrant orange accents |

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
