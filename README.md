# Log Box Gym

A mobile-first PWA fitness tracker designed for hybrid weightlifting and boxing training.

![Log Box Gym](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Vite](https://img.shields.io/badge/Vite-6.0-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)

## Features

- **Routines Management** - Create and manage custom workout routines with exercises, sets, reps, and rest times
- **Calendar View** - Plan your workouts by day with a weekly calendar navigation
- **Workout Runner** - Execute your workouts with real-time set tracking and rest timer
- **Statistics Dashboard** - Track weekly workouts, streaks, and exercise completion
- **Weight Progress Charts** - Visualize your strength gains over time with interactive charts
- **Data Backup** - Export and import all your data as JSON for safekeeping
- **PWA Support** - Install on mobile for a native app-like experience
- **Dark Theme** - Modern pill-styled dark UI with orange accent colors

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Zustand** for state management with localStorage persistence
- **Recharts** for weight progress visualization
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/log-box-gym.git
cd log-box-gym

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── app/                    # Main app component and routing
├── features/               # Feature-based modules
│   ├── calendar/          # Calendar and workout runner
│   ├── dashboard/        # Statistics and charts
│   └── routines/         # Routine CRUD
├── shared/               # Shared components, types, and utilities
│   ├── components/       # Reusable UI components
│   ├── types/           # TypeScript interfaces
│   └── utils/           # Storage and date utilities
└── store/               # Zustand global store
```

## Workflow

1. **Routines** - Create workout routines with exercises
2. **Calendar** - Schedule routines for specific days
3. **Workout Runner** - Execute the workout, track sets and weights
4. **Dashboard** - Review stats and weight progress

## Data Storage

All data is stored locally in your browser using localStorage. No account required. Use the built-in export/import feature to backup your data.

## License

MIT
