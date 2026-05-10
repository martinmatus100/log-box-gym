import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Play, Check, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatDate, formatTime } from '../../shared/utils/storage';
import { Routine, DayWorkout, CompletedExercise } from '../../shared/types';
import { generateId } from '../../shared/utils/storage';
import { PillButton } from '../../shared/components';

export function CalendarPage() {
  const { selectedDate, selectDate, getDayWorkoutsForDate, deleteDayWorkout, startWorkout, finishWorkout } = useStore();
  
  const dayWorkouts = getDayWorkoutsForDate(selectedDate);
  const today = formatDate(new Date());
  const currentDate = new Date(selectedDate + 'T00:00:00');
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });
  
  const monthYear = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  
  const dayNames: Record<number, string> = { 0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb' };
  
  return (
    <div className="flex flex-col min-h-full pb-24">
      <div className="p-4 pb-2">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          Calendario
        </h1>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { const d = new Date(currentDate); d.setDate(currentDate.getDate() - 7); selectDate(formatDate(d)); }} className="p-2 rounded-full bg-bg-elevated text-text-secondary active:scale-95">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-text-primary capitalize">{monthYear}</span>
            {selectedDate !== today && <button onClick={() => selectDate(formatDate(new Date()))} className="text-xs text-accent">Ir a hoy</button>}
          </div>
          <button onClick={() => { const d = new Date(currentDate); d.setDate(currentDate.getDate() + 7); selectDate(formatDate(d)); }} className="p-2 rounded-full bg-bg-elevated text-text-secondary active:scale-95">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((date) => {
            const dateStr = formatDate(date);
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === today;
            const hasWorkout = getDayWorkoutsForDate(dateStr).length > 0;
            
            return (
              <button key={dateStr} onClick={() => selectDate(dateStr)} className={`flex flex-col items-center p-3 rounded-card active:scale-95 ${isSelected ? 'bg-accent text-bg-deep' : isToday ? 'bg-accent-glow border border-accent' : 'bg-bg-surface'}`}>
                <span className={`text-xs font-medium ${isSelected ? '' : 'text-text-secondary'}`}>{dayNames[date.getDay()]}</span>
                <span className={`text-lg font-bold mt-1 ${isSelected ? '' : 'text-text-primary'}`}>{date.getDate()}</span>
                {hasWorkout && !isSelected && <div className="w-2 h-2 rounded-full bg-accent mt-1" />}
              </button>
            );
          })}
        </div>
      </div>
      
      <DayWorkoutsList date={selectedDate} dayWorkouts={dayWorkouts} onDelete={deleteDayWorkout} onStart={startWorkout} onFinish={finishWorkout} />
    </div>
  );
}

function DayWorkoutsList({ date, dayWorkouts, onDelete, onStart, onFinish }: any) {
  const { routines, addDayWorkout } = useStore();
  const [showAddRoutine, setShowAddRoutine] = useState(false);
  
  const inProgressWorkout = dayWorkouts.find((w: any) => w.status === 'in_progress');
  
  const handleAddRoutine = (routine: Routine) => {
    const exercises: CompletedExercise[] = routine.exercises.map((ex: any) => ({
      ...ex,
      completedSets: 0,
      weights: [],
      isCompleted: false,
    }));
    
    const dayWorkout: DayWorkout = {
      id: generateId(),
      routineId: routine.id,
      routineName: routine.name,
      date,
      exercises,
      status: 'pending',
      startedAt: null,
      completedAt: null,
    };
    
    addDayWorkout(dayWorkout);
    setShowAddRoutine(false);
  };
  
  if (inProgressWorkout) return <WorkoutRunner workout={inProgressWorkout} onFinish={onFinish} />;
  
  return (
    <div className="flex-1 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h2>
        <span className="text-sm text-text-secondary">{dayWorkouts.length} rutinas</span>
      </div>
      
      {dayWorkouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-bg-surface flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-text-secondary" />
          </div>
          <p className="text-text-secondary mb-4">No hay rutinas para este día</p>
          <PillButton variant="primary" onClick={() => setShowAddRoutine(true)}>
            <Plus className="w-4 h-4 mr-2" />Agregar Rutina
          </PillButton>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {dayWorkouts.map((workout: any) => (
            <div key={workout.id} className="p-4 rounded-card bg-bg-surface border border-border-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-text-primary font-semibold">{workout.routineName}</h3>
                  <p className="text-text-secondary text-sm">{workout.exercises.length} ejercicios</p>
                </div>
                <div className="flex gap-2">
                  {workout.status === 'completed' ? (
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm">Completado</span>
                  ) : (
                    <PillButton variant="primary" size="sm" onClick={() => onStart(workout.id)}>
                      <Play className="w-4 h-4 mr-1" />Iniciar
                    </PillButton>
                  )}
                  <button onClick={() => onDelete(workout.id)} className="p-2 rounded-full text-text-secondary hover:text-danger">×</button>
                </div>
              </div>
            </div>
          ))}
          <PillButton variant="secondary" onClick={() => setShowAddRoutine(true)}>
            <Plus className="w-4 h-4 mr-2" />Agregar Otra Rutina
          </PillButton>
        </div>
      )}
      
      {showAddRoutine && (
        <div className="fixed inset-0 bg-bg-deep/80 z-50 flex items-end justify-center">
          <div className="w-full max-w-lg bg-bg-surface rounded-t-card p-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Seleccionar Rutina</h3>
            {routines.length === 0 ? (
              <p className="text-text-secondary text-center py-4">No hay rutinas creadas. Crea una primero.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {routines.map((routine: any) => (
                  <button key={routine.id} onClick={() => handleAddRoutine(routine)} className="p-4 rounded-card bg-bg-elevated text-left hover:bg-border-subtle">
                    <h4 className="text-text-primary font-medium">{routine.name}</h4>
                    <p className="text-text-secondary text-sm">{routine.exercises.length} ejercicios</p>
                  </button>
                ))}
              </div>
            )}
            <PillButton variant="secondary" className="w-full mt-4" onClick={() => setShowAddRoutine(false)}>Cancelar</PillButton>
          </div>
        </div>
      )}
    </div>
  );
}

function WorkoutRunner({ workout, onFinish }: any) {
  const { dayWorkouts, completeSet, updateExerciseInWorkout } = useStore();
  const currentWorkout = dayWorkouts.find((w: any) => w.id === workout.id) || workout;
  
  const [activeTimer, setActiveTimer] = useState<{ time: number; total: number; active: boolean } | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [weight, setWeight] = useState('');
  const intervalRef = useRef<number | null>(null);
  
  const currentExercise = currentWorkout.exercises[exerciseIndex];
  const allCompleted = currentWorkout.exercises.every((e: any) => e.isCompleted);
  
  useEffect(() => {
    if (activeTimer && activeTimer.active) {
      intervalRef.current = window.setInterval(() => {
        setActiveTimer(prev => {
          if (!prev || prev.time <= 0) {
            clearInterval(intervalRef.current!);
            playBeep();
            return { ...prev, active: false };
          }
          if (prev.time <= 4 && prev.time > 0) playCountdown();
          return { ...prev, time: prev.time - 1 };
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [activeTimer?.active]);
  
  const playBeep = () => {
    try { const ctx = new AudioContext(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.frequency.value = 1000; gain.gain.value = 0.3; osc.start(); setTimeout(() => { osc.stop(); ctx.close(); }, 200); } catch {}
  };
  
  const playCountdown = () => {
    try { const ctx = new AudioContext(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.frequency.value = 600; gain.gain.value = 0.2; osc.start(); setTimeout(() => { osc.stop(); ctx.close(); }, 100); } catch {}
  };
  
  const completeCurrentSet = () => {
    completeSet(workout.id, currentExercise.id);
    
    const newCompletedSets = (currentExercise.completedSets || 0) + 1;
    if (newCompletedSets >= currentExercise.targetSets) {
      updateExerciseInWorkout(workout.id, currentExercise.id, { isCompleted: true });
    }
    
    setActiveTimer({ time: currentExercise.restSeconds, total: currentExercise.restSeconds, active: true });
  };
  
  const addWeight = () => {
    if (!weight || !currentExercise) return;
    const newWeights = [...(currentExercise.weights || []), parseFloat(weight)];
    updateExerciseInWorkout(workout.id, currentExercise.id, { weights: newWeights });
    setWeight('');
  };
  
  const skipTimer = () => {
    setActiveTimer(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  
  const handleFinish = () => {
    skipTimer();
    onFinish();
  };
  
  if (!currentExercise) return null;
  
  const progressPercent = currentExercise.targetSets > 0 ? ((currentExercise.completedSets || 0) / currentExercise.targetSets) * 100 : 0;
  
  return (
    <div className="flex-1 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">{currentWorkout.routineName}</h2>
        <PillButton variant="danger" size="sm" onClick={handleFinish}>
          <X className="w-3 h-3 mr-1" />Finalizar
        </PillButton>
      </div>
      
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {currentWorkout.exercises.map((ex: any, i: number) => (
          <button key={ex.id} onClick={() => setExerciseIndex(i)} className={`flex-shrink-0 px-3 py-2 rounded-full text-sm transition-all whitespace-nowrap flex items-center gap-1.5 ${i === exerciseIndex ? 'bg-accent text-bg-deep' : ex.isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-bg-surface text-text-secondary'}`}>
            {ex.isCompleted && <Check className="w-3 h-3" />}
            {ex.name}
          </button>
        ))}
      </div>
      
      <div className="p-4 rounded-card bg-bg-surface border border-border-subtle">
        <h3 className="text-xl font-bold text-text-primary mb-1">{currentExercise.name}</h3>
        <p className="text-text-secondary mb-2">
          {(currentExercise.completedSets || 0)}/{currentExercise.targetSets} series × {currentExercise.targetReps} reps
          {currentExercise.toFailure && <span className="ml-2 text-accent">(Al fallo)</span>}
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between text-xs text-text-secondary mb-1">
            <span>Progreso de series</span>
            <span>{currentExercise.completedSets || 0}/{currentExercise.targetSets}</span>
          </div>
          <div className="h-3 bg-bg-elevated rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        
        <div className="flex gap-1 mb-4">
          {Array.from({ length: currentExercise.targetSets }).map((_, i) => (
            <div key={i} className={`flex-1 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < (currentExercise.completedSets || 0) ? 'bg-accent text-bg-deep' : 'bg-bg-elevated text-text-secondary'}`}>
              {i + 1}
            </div>
          ))}
        </div>
        
        {currentExercise.weights && currentExercise.weights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {currentExercise.weights.map((w: number, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm">{w}kg</span>
            ))}
          </div>
        )}
        
        <div className="flex gap-2 mb-4">
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Peso (kg)" className="flex-1 h-12 px-4 bg-bg-elevated rounded-full border border-border-subtle text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent" />
          <PillButton variant="secondary" onClick={addWeight} disabled={!weight}>+</PillButton>
        </div>
        
        <PillButton variant="primary" className="w-full" onClick={completeCurrentSet} disabled={currentExercise.isCompleted}>
          <Check className="w-4 h-4 mr-1" />
          {currentExercise.isCompleted ? 'Completado' : 'Completar Serie'}
        </PillButton>
      </div>
      
      {activeTimer && (
        <div className="mt-4 p-6 rounded-card bg-accent-glow border-2 border-accent text-center">
          <p className="text-accent font-medium mb-2">Descanso</p>
          <p className="font-mono text-5xl font-bold text-text-primary">{formatTime(activeTimer.time)}</p>
          <div className="mt-4 flex justify-center gap-2">
            <button onClick={() => setActiveTimer(prev => prev ? { ...prev, time: prev.time + 15 } : null)} className="px-4 py-2 rounded-full bg-bg-elevated text-text-secondary">+15s</button>
            <button onClick={skipTimer} className="px-4 py-2 rounded-full bg-danger text-white">Saltar</button>
          </div>
        </div>
      )}
      
      {allCompleted && (
        <div className="mt-6 p-4 rounded-card bg-accent/20 border border-accent/30 text-center">
          <p className="text-accent font-semibold mb-2">¡Rutina completada!</p>
          <PillButton variant="primary" onClick={handleFinish}>Finalizar</PillButton>
        </div>
      )}
    </div>
  );
}