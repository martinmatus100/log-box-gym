# Log Box Gym - MVP Specification

## 1. Concept & Vision

**Log Box Gym** is a mobile-first PWA fitness tracker built for hybrid athletes who blend weightlifting with boxing. It feels like a **digital training notebook** — raw, focused, no fluff. The interface is a **dark cockpit with neon pill-shaped controls**, making every tap feel deliberate and every workout feel tracked with precision. Think "if a coach built an app."

## 2. Design Language

### Aesthetic Direction
**Neo-minimal dark cockpit** — deep black surfaces with a single electric accent color. Every element is a pill/capsule. Nothing has sharp corners. The vibe is "underground gym meets modern UI."

### Color Palette
```
--bg-deep:        #0A0A0A   (deepest background)
--bg-surface:     #181818   (cards/surfaces)
--bg-elevated:    #242424   (inputs, elevated)
--border-subtle:  #2E2E2E   (subtle borders)
--text-primary:   #FFFFFF   (primary text)
--text-secondary: #8A8A8A   (secondary/muted text)
--accent:         #00FF88   (electric green - single accent)
--accent-dim:     #00CC6E   (hover state)
--accent-glow:    rgba(0,255,136,0.15) (glow background)
--danger:         #FF4757   (delete/errors)
--box-orange:     #FF6B35   (boxing accent)
```

### Typography
- **Primary Font:** Inter (Google Fonts)
- **Headings:** Inter 700 (bold)
- **Body:** Inter 400/500 (regular/medium)
- **Mono/Timer:** JetBrains Mono (for timers, numbers)
- Fallbacks: system-ui, -apple-system, sans-serif

### Spatial System
- Base unit: 4px
- Touch target minimum: 48px height
- Pill corners: `rounded-full` (full pill shape)
- Card corners: `rounded-3xl` or `rounded-2xl`
- Gaps: 8px (tight), 16px (normal), 24px (section)
- Padding: 16px horizontal minimum on mobile

### Motion Philosophy
- **Micro-interactions:** 150ms ease-out for state changes
- **Page transitions:** None for MVP (instant feel)
- **Timer pulse:** Subtle glow animation on active timers
- **Feedback:** Scale down on press (0.97), scale up on release
- **No animations for data display** — data appears instantly

### Visual Assets
- **Icons:** Lucide React (consistent stroke width)
- **No images** — pure UI
- **Decorative:** Subtle glow effects on accent elements

## 3. Layout & Structure

### App Shell
```
┌─────────────────────────────┐
│  LOG BOX GYM      [≡]       │  <- Header (sticky)
├─────────────────────────────┤
│                             │
│      Main Content Area      │  <- Scrollable
│                             │
├─────────────────────────────┤
│  [📅]  [➕]  [📊]  [⏱️]     │  <- Bottom nav (fixed)
└─────────────────────────────┘
```

### Navigation (Bottom Tab Bar)
1. **Calendar** — Daily view & workout history
2. **Log** — Active workout logging (center, prominent)
3. **Dashboard** — Stats & charts
4. **Timers** — All timer controls

### Responsive Strategy
- **Mobile only** — max-width 480px centered on larger screens
- Single column layout throughout
- No horizontal scrolling ever

## 4. Features & Interactions

### 4.1 Daily Log & Calendar View

**Calendar Grid:**
- Horizontal scrollable week view by default
- Tap day to select and view logs
- Days with workouts show accent dot indicator
- Current day highlighted with accent border

**Daily View:**
- Shows date prominently (e.g., "Monday, May 10")
- Lists all logged workouts for the day
- Each log card shows: mode icon, exercise name, key stats, time
- Tap card to expand/edit
- Empty state: "No workouts logged" with prompt to add

### 4.2 Exercise Logging

#### Gym Mode
**Exercise Entry:**
- Exercise name: Pill dropdown with preset exercises + custom option
- Set tracking: Each set as a pill row [Set #] [Reps] [Weight] [✓]
- "Add Set" button below sets
- Quick-add presets: Bench, Squat, Deadlift, Row, OHP, Pull-ups

**Set Interaction:**
- Tap ✓ to complete set → triggers rest timer
- Long press set to delete
- Completed sets show checkmark and fade slightly

**Quick Stats:**
- Total sets, total volume (reps × weight), estimated time

#### Boxing Mode
**Round Entry:**
- Round count (1-12)
- Time per round (30s, 1m, 2m, 3m options)
- Drill type: Heavy Bag, Sparring, Shadowboxing, Pad Work, Speed Bag, Footwork

**Drill Selection:**
- Pill buttons for drill type (single select)
- Duration timer auto-starts on round start

**Training Summary:**
- Total rounds, total time, drill breakdown

### 4.3 Integrated Timers

#### Rest Timer (Auto-triggered)
- Pill-shaped countdown display
- Default: 60s (configurable: 30s, 60s, 90s, 120s)
- Visual countdown ring
- Audio beep at 0 (Web Audio API)
- "Skip" button to end early
- "Add 15s" button for extension

#### Duration Timer (Stopwatch)
- Large pill-shaped time display (MM:SS format)
- Start/Stop button (single pill toggle)
- Reset button (secondary)
- Elapsed time since last exercise started

#### Round Timer (Boxing)
- Large pill display with current round / total rounds
- Time remaining in current round
- Visual: progress bar showing round progress
- Audio: 3-2-1 countdown beeps before round ends
- "Next Round" button to advance
- "Finish" button to end early

#### Timer Widget (Persistent)
- Small persistent bar at bottom of workout screen
- Shows active timer name + time
- Tap to expand timer controls
- Minimizes to icon when not active

### 4.4 Performance Dashboard

**Summary Cards:**
- Total workouts this week
- Total rounds (boxing)
- Total volume (gym)
- Active streak (days)

**Weekly Chart:**
- Simple pill-styled bar chart
- 7 bars for days of week
- Color-coded: gym (accent green), boxing (orange)
- Tap bar for day details

**Recent History:**
- Last 5 workouts as mini cards
- Tap to view full log

## 5. Component Inventory

### Core Components

#### PillButton
- States: default (bg-surface), hover (bg-elevated), active (scale 0.97), disabled (opacity 50%)
- Variants: primary (accent bg), secondary (surface), danger (red)
- Sizes: sm (h-8), md (h-12), lg (h-14)

#### PillInput
- Always pill-shaped (rounded-full)
- States: default, focused (accent border glow), error (red border)
- Variants: text, number (with +/- stepper buttons), dropdown

#### PillTag/Group
- Horizontal scrollable pill group for selections
- Single or multi-select mode
- Active state: accent bg, inactive: surface bg

#### TimerDisplay
- Large pill container with time in JetBrains Mono
- Subtle glow when active
- Compact and expanded variants

#### LogCard
- Pill-shaped card for workout entries
- Icon (mode), title, stats, time
- Expandable for details
- Swipe to delete (stretch goal)

#### StatCard
- Small pill card with icon, value, label
- Used in dashboard for quick stats

#### BarChart (Pill Bars)
- Horizontal bars, fully rounded (pill shape)
- Max height: 120px
- Tap to select bar

#### BottomNav
- Fixed at bottom, 64px height
- 4 items, icon + label
- Active state: accent color + glow

#### Modal/BottomSheet
- Slides up from bottom
- Rounded top corners (xl)
- Backdrop blur

## 6. Technical Approach

### Stack
- **Runtime:** React 18 + TypeScript
- **Build:** Vite 5
- **Styling:** TailwindCSS v3
- **Icons:** Lucide React
- **State:** Zustand (lightweight, simple)
- **Storage:** localStorage (JSON)
- **Audio:** Web Audio API (no library)

### Project Structure (Screaming Architecture)
```
src/
├── app/
│   └── App.tsx
├── features/
│   ├── calendar/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── calendar.tsx
│   ├── workout/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── workout.tsx
│   ├── timers/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── timers.tsx
│   └── dashboard/
│       ├── components/
│       ├── hooks/
│       └── dashboard.tsx
├── shared/
│   ├── components/
│   │   ├── PillButton.tsx
│   │   ├── PillInput.tsx
│   │   ├── PillGroup.tsx
│   │   ├── TimerDisplay.tsx
│   │   ├── LogCard.tsx
│   │   ├── StatCard.tsx
│   │   └── BarChart.tsx
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── storage.ts
│       └── audio.ts
├── store/
│   └── useStore.ts
└── styles/
    └── globals.css
```

### Data Model

```typescript
interface Workout {
  id: string;
  date: string; // YYYY-MM-DD
  mode: 'gym' | 'boxing';
  exercises: GymExercise[] | BoxingRound[];
  createdAt: number;
}

interface GymExercise {
  id: string;
  name: string;
  sets: GymSet[];
}

interface GymSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

interface BoxingRound {
  id: string;
  drillType: 'heavy_bag' | 'sparring' | 'shadowboxing' | 'pad_work' | 'speed_bag' | 'footwork';
  duration: number; // seconds
  completed: boolean;
}

interface TimerState {
  type: 'rest' | 'duration' | 'round';
  active: boolean;
  timeRemaining: number;
  totalTime: number;
}

interface AppState {
  workouts: Workout[];
  selectedDate: string;
  activeTimer: TimerState | null;
  workoutMode: 'gym' | 'boxing';
  restTimerDuration: number;
}
```

### localStorage Schema
```json
{
  "logboxgym_workouts": [...workouts],
  "logboxgym_settings": {
    "restTimerDuration": 60,
    "weightUnit": "kg",
    "roundDuration": 180
  }
}
```

### Key Implementation Notes
- Use `crypto.randomUUID()` for IDs
- Date handling with native `Date` object, format as ISO date string
- Timers use `setInterval` with cleanup on unmount
- Audio beeps generated with Web Audio API oscillator
- Zustand for global state with localStorage persistence middleware
- All interactive elements minimum 48px touch target