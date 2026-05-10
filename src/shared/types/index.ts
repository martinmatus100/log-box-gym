export type WorkoutMode = 'gym' | 'boxing';

export type DrillType = 'heavy_bag' | 'sparring' | 'shadowboxing' | 'pad_work' | 'speed_bag' | 'footwork';

export interface GymSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
  toFailure: boolean;
}

export interface RoutineExercise {
  id: string;
  name: string;
  targetSets: number;
  targetReps: number;
  restSeconds: number;
  toFailure: boolean;
}

export interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  createdAt: number;
}

export interface CompletedExercise {
  id: string;
  name: string;
  targetSets: number;
  targetReps: number;
  restSeconds: number;
  completedSets: number;
  completedReps: number;
  toFailure: boolean;
  isCompleted: boolean;
  weights: number[];
}

export interface DayWorkout {
  id: string;
  routineId: string;
  routineName: string;
  date: string;
  exercises: CompletedExercise[];
  status: 'pending' | 'in_progress' | 'completed';
  startedAt: number | null;
  completedAt: number | null;
}

export interface TimerState {
  type: 'rest' | 'duration' | 'round';
  active: boolean;
  timeRemaining: number;
  totalTime: number;
  roundNumber?: number;
  totalRounds?: number;
}

export interface AppSettings {
  restTimerDuration: number;
  weightUnit: 'kg' | 'lbs';
  roundDuration: number;
}

export const DRILL_LABELS: Record<DrillType, string> = {
  heavy_bag: 'Saco de Boxeo',
  sparring: 'Sparring',
  shadowboxing: 'Sombra',
  pad_work: 'Pad Work',
  speed_bag: 'Speed Ball',
  footwork: 'Footwork',
};

export const REST_TIMER_OPTIONS = [30, 60, 90, 120];
export const ROUND_DURATION_OPTIONS = [30, 60, 90, 120, 180];

export const PRESET_EXERCISES = [
  'Sentadilla Sumo',
  'Press Banco c/ Mancuernas',
  'Aperturas Banco c/ Mancuernas',
  'Dumbbell Snatch',
  'Peso Muerto Rumano',
  'Press Militar',
  'Dominadas',
  'Kettlebell Swings',
  'Curl Banco c/ Mancuernas',
  'Extensiones Tríceps Polea',
  'Sentadilla Bulgara',
  'Landmine Press',
  'Vuelos Posteriores',
];