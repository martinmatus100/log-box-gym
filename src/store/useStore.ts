import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Routine, DayWorkout, TimerState, AppSettings, RoutineExercise, CompletedExercise } from '../shared/types';
import { generateId, formatDate, zustandStorage } from '../shared/utils/storage';

interface AppState {
  routines: Routine[];
  dayWorkouts: DayWorkout[];
  selectedDate: string;
  activeTimer: TimerState | null;
  settings: AppSettings;
  
  selectDate: (date: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setState: (state: Partial<AppState>) => void;
  
  addRoutine: (routine: Routine) => void;
  updateRoutine: (routine: Routine) => void;
  deleteRoutine: (id: string) => void;
  
  addDayWorkout: (dayWorkout: DayWorkout) => void;
  updateDayWorkout: (id: string, updates: Partial<DayWorkout>) => void;
  deleteDayWorkout: (id: string) => void;
  getDayWorkoutsForDate: (date: string) => DayWorkout[];
  
  startWorkout: (dayWorkoutId: string) => void;
  finishWorkout: () => void;
  completeSet: (dayWorkoutId: string, exerciseId: string) => void;
  completeExercise: (dayWorkoutId: string, exerciseId: string) => void;
  updateExerciseInWorkout: (dayWorkoutId: string, exerciseId: string, updates: Partial<CompletedExercise>) => void;
  
  startTimer: (timer: TimerState) => void;
  updateTimer: (timer: Partial<TimerState>) => void;
  stopTimer: () => void;
  
  getWorkoutDates: () => string[];
  getCompletedWorkouts: () => DayWorkout[];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      routines: [],
      dayWorkouts: [],
      selectedDate: formatDate(new Date()),
      activeTimer: null,
      settings: {
        restTimerDuration: 120,
        weightUnit: 'kg',
        roundDuration: 180,
      },

      selectDate: (date) => set({ selectedDate: date }),

      setState: (state) => set((prev) => ({ ...prev, ...state })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      addRoutine: (routine) => set((state) => ({
        routines: [...state.routines, routine]
      })),

      updateRoutine: (routine) => set((state) => ({
        routines: state.routines.map((r) => r.id === routine.id ? routine : r)
      })),

      deleteRoutine: (id) => set((state) => ({
        routines: state.routines.filter((r) => r.id !== id)
      })),

      addDayWorkout: (dayWorkout) => set((state) => ({
        dayWorkouts: [...state.dayWorkouts, dayWorkout]
      })),

      updateDayWorkout: (id, updates) => set((state) => ({
        dayWorkouts: state.dayWorkouts.map((w) => w.id === id ? { ...w, ...updates } : w)
      })),

      deleteDayWorkout: (id) => set((state) => ({
        dayWorkouts: state.dayWorkouts.filter((w) => w.id !== id)
      })),

      getDayWorkoutsForDate: (date) => {
        return get().dayWorkouts.filter((w) => w.date === date);
      },

      startWorkout: (dayWorkoutId) => {
        set((state) => ({
          dayWorkouts: state.dayWorkouts.map((w) => 
            w.id === dayWorkoutId 
              ? { ...w, status: 'in_progress', startedAt: Date.now() }
              : w
          )
        }));
      },

      finishWorkout: () => {
        set((state) => ({
          dayWorkouts: state.dayWorkouts.map((w) => 
            w.status === 'in_progress' || w.status === 'pending'
              ? { ...w, status: 'completed', completedAt: Date.now() }
              : w
          )
        }));
      },

      completeExercise: (dayWorkoutId, exerciseId) => {
        set((state) => ({
          dayWorkouts: state.dayWorkouts.map((w) => 
            w.id === dayWorkoutId 
              ? { 
                  ...w, 
                  exercises: w.exercises.map((e) => 
                    e.id === exerciseId ? { ...e, isCompleted: true, completedSets: e.targetSets } : e
                  )
                }
              : w
          )
        }));
      },

      completeSet: (dayWorkoutId, exerciseId) => {
        set((state) => ({
          dayWorkouts: state.dayWorkouts.map((w) => 
            w.id === dayWorkoutId 
              ? { 
                  ...w, 
                  exercises: w.exercises.map((e) => 
                    e.id === exerciseId 
                      ? { ...e, completedSets: (e.completedSets || 0) + 1 }
                      : e
                  )
                }
              : w
          )
        }));
      },

      updateExerciseInWorkout: (dayWorkoutId, exerciseId, updates) => {
        set((state) => ({
          dayWorkouts: state.dayWorkouts.map((w) => 
            w.id === dayWorkoutId 
              ? { 
                  ...w, 
                  exercises: w.exercises.map((e) => 
                    e.id === exerciseId ? { ...e, ...updates } : e
                  )
                }
              : w
          )
        }));
      },

      startTimer: (timer) => set({ activeTimer: timer }),

      updateTimer: (updates) => set((state) => ({
        activeTimer: state.activeTimer ? { ...state.activeTimer, ...updates } : null
      })),

      stopTimer: () => set({ activeTimer: null }),

      getWorkoutDates: () => {
        return [...new Set(get().dayWorkouts.map((w) => w.date))];
      },

      getCompletedWorkouts: () => {
        return get().dayWorkouts.filter((w) => w.status === 'completed');
      },
    }),
    {
      name: 'logboxgym_store',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        routines: state.routines,
        dayWorkouts: state.dayWorkouts,
        settings: state.settings,
      }),
    }
  )
);