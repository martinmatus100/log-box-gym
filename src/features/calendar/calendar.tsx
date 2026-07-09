import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Play, Check, X, Zap, Link, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatDate, formatTime } from '../../shared/utils/storage';
import { Routine, DayWorkout, CompletedExercise, CompletedSet } from '../../shared/types';
import { generateId } from '../../shared/utils/storage';
import { PillButton } from '../../shared/components';

export function CalendarPage() {
  const { selectedDate, selectDate, getDayWorkoutsForDate, deleteDayWorkout, startWorkout, finishWorkout } = useStore();
  const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(true);
  
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
        <h1 data-testid="calendar-title" className="text-2xl font-bold text-text-primary flex items-center gap-2">
          Calendario
        </h1>
      </div>
      
      <div className="p-4">
        <div
          data-testid="toggle-calendar-btn"
          onClick={() => setIsCalendarCollapsed(!isCalendarCollapsed)}
          className="w-full flex items-center justify-between mb-3 p-2 rounded-card bg-bg-surface border border-border-subtle cursor-pointer active:scale-98"
        >
          <div className="flex items-center gap-2">
            <button data-testid="prev-week-btn" onClick={(e) => { e.stopPropagation(); const d = new Date(currentDate); d.setDate(currentDate.getDate() - 7); selectDate(formatDate(d)); }} className="p-1 rounded-full bg-bg-elevated text-text-secondary active:scale-95">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-semibold text-text-primary capitalize">{monthYear}</span>
            <button data-testid="next-week-btn" onClick={(e) => { e.stopPropagation(); const d = new Date(currentDate); d.setDate(currentDate.getDate() + 7); selectDate(formatDate(d)); }} className="p-1 rounded-full bg-bg-elevated text-text-secondary active:scale-95">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {selectedDate !== today && <button data-testid="go-to-today-btn" onClick={(e) => { e.stopPropagation(); selectDate(formatDate(new Date())); }} className="text-[10px] text-accent">Ir a hoy</button>}
            {isCalendarCollapsed ? <ChevronDown className="w-4 h-4 text-text-secondary" /> : <ChevronUp className="w-4 h-4 text-text-secondary" />}
          </div>
        </div>
        
        {!isCalendarCollapsed && (
          <div data-testid="week-days-grid" className="grid grid-cols-7 gap-1.5 mb-4">
            {weekDays.map((date) => {
              const dateStr = formatDate(date);
              const isSelected = dateStr === selectedDate;
              const isToday = dateStr === today;
              const hasWorkout = getDayWorkoutsForDate(dateStr).length > 0;
              
              return (
                <button key={dateStr} data-testid={`day-cell-${dateStr}`} onClick={() => selectDate(dateStr)} className={`flex flex-col items-center p-2 rounded-card active:scale-95 ${isSelected ? 'bg-accent text-bg-deep' : isToday ? 'bg-accent-glow border border-accent' : 'bg-bg-surface'}`}>
                  <span className={`text-[10px] font-medium ${isSelected ? '' : 'text-text-secondary'}`}>{dayNames[date.getDay()]}</span>
                  <span className={`text-sm font-bold mt-0.5 ${isSelected ? '' : 'text-text-primary'}`}>{date.getDate()}</span>
                  {hasWorkout && !isSelected && <div className="w-1.5 h-1.5 rounded-full bg-accent mt-0.5" />}
                </button>
              );
            })}
          </div>
        )}
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
    const exercises: CompletedExercise[] = routine.exercises.map((ex) => ({
      id: ex.id,
      name: ex.name,
      targetSets: ex.targetSets,
      targetReps: ex.targetReps,
      restSeconds: ex.restSeconds,
      toFailure: ex.toFailure,
      isCompleted: false,
      completedSets: [],
      supersetId: ex.supersetId,
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
        <h2 data-testid="date-title" className="text-lg font-semibold text-text-primary">
          {new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h2>
        <span data-testid="day-workouts-count" className="text-sm text-text-secondary">{dayWorkouts.length} rutinas</span>
      </div>
      
      {dayWorkouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-bg-surface flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-text-secondary" />
          </div>
          <p className="text-text-secondary mb-4">No hay rutinas para este día</p>
          <PillButton data-testid="add-routine-btn" variant="primary" onClick={() => setShowAddRoutine(true)}>
            <Plus className="w-4 h-4 mr-2" />Agregar Rutina
          </PillButton>
        </div>
      ) : (
        <div data-testid="day-workouts-list" className="flex flex-col gap-3">
          {dayWorkouts.map((workout: any) => (
            <div key={workout.id} data-testid={`workout-card-${workout.id}`} className="p-4 rounded-card bg-bg-surface border border-border-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-text-primary font-semibold">{workout.routineName}</h3>
                  <p className="text-text-secondary text-sm">{workout.exercises.length} ejercicios</p>
                </div>
                <div className="flex gap-2">
                  {workout.status === 'completed' ? (
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm">Completado</span>
                  ) : (
                    <PillButton data-testid="start-workout-btn" variant="primary" size="sm" onClick={() => onStart(workout.id)}>
                      <Play className="w-4 h-4 mr-1" />Iniciar
                    </PillButton>
                  )}
                  <button data-testid="delete-workout-btn" onClick={() => onDelete(workout.id)} className="p-2 rounded-full text-text-secondary hover:text-danger">×</button>
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
          <div data-testid="select-routine-modal" className="w-full max-w-lg bg-bg-surface rounded-t-card p-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Seleccionar Rutina</h3>
            {routines.length === 0 ? (
              <p className="text-text-secondary text-center py-4">No hay rutinas creadas. Crea una primero.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {routines.map((routine: any) => (
                  <button key={routine.id} data-testid={`routine-option-${routine.id}`} onClick={() => handleAddRoutine(routine)} className="p-4 rounded-card bg-bg-elevated text-left hover:bg-border-subtle">
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
  const { dayWorkouts, routines, completeSet, updateExerciseInWorkout } = useStore();
  const currentWorkout = dayWorkouts.find((w: any) => w.id === workout.id) || workout;
  const currentRoutine = routines.find((r) => r.id === currentWorkout.routineId);
  const supersets = currentRoutine?.supersets || [];
  
  const [activeTimer, setActiveTimer] = useState<{ time: number; total: number; active: boolean } | null>(() => {
    try {
      const saved = localStorage.getItem('logboxgym_timer');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.active && parsed.total > 0) {
          const elapsed = Math.floor((Date.now() - parsed.startedAt) / 1000);
          const remaining = Math.max(0, parsed.time - elapsed);
          if (remaining > 0) {
            return { time: remaining, total: parsed.total, active: true };
          }
        }
      }
    } catch {}
    return null;
  });
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const intervalRef = useRef<number | null>(null);
  
  const currentExercise = currentWorkout.exercises[exerciseIndex];
  
  const allCompleted = currentWorkout.exercises.every((e: any) => e.isCompleted);
  
  const getSupersetForExercise = (exerciseId: string) => {
    return supersets.find(s => s.exerciseIds.includes(exerciseId));
  };
  
  const getSupersetProgress = (supersetId: string) => {
    const superset = supersets.find(s => s.id === supersetId);
    if (!superset) return { completed: 0, total: 0, percent: 0 };
    
    const exercises = superset.exerciseIds
      .map(id => currentWorkout.exercises.find((e: any) => e.id === id))
      .filter(Boolean);
    
    const completed = exercises.filter((e: any) => e.isCompleted).length;
    const total = exercises.length;
    const percent = total > 0 ? (completed / total) * 100 : 0;
    
    return { completed, total, percent };
  };
  
  const getCurrentSuperset = () => {
    if (!currentExercise) return null;
    return getSupersetForExercise(currentExercise.id);
  };
  
  useEffect(() => {
    if (activeTimer && activeTimer.active) {
      localStorage.setItem('logboxgym_timer', JSON.stringify({ ...activeTimer, startedAt: Date.now() }));
      intervalRef.current = window.setInterval(() => {
        setActiveTimer(prev => {
          if (!prev || prev.time <= 0) {
            clearInterval(intervalRef.current!);
            localStorage.removeItem('logboxgym_timer');
            playBeep();
            return { ...prev, active: false };
          }
          if (prev.time <= 4 && prev.time > 0) playCountdown();
          const next = { ...prev, time: prev.time - 1 };
          localStorage.setItem('logboxgym_timer', JSON.stringify({ ...next, startedAt: Date.now() }));
          return next;
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
    if (!weight) return;
    
    const repsValue = currentExercise.toFailure ? parseInt(reps || '0') : currentExercise.targetReps;
    
    if (currentExercise.toFailure && (!reps || parseInt(reps) <= 0)) return;
    
    completeSet(workout.id, currentExercise.id, { 
      weight: parseFloat(weight), 
      reps: repsValue 
    });
    
    setWeight('');
    setReps('');
    
    const newTimer = { time: currentExercise.restSeconds, total: currentExercise.restSeconds, active: true };
    setActiveTimer(newTimer);
  };
  
  const skipTimer = () => {
    setActiveTimer(null);
    localStorage.removeItem('logboxgym_timer');
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  
  const handleFinish = () => {
    skipTimer();
    onFinish();
  };
  
  if (!currentExercise) return null;
  
  const completedSetsCount = currentExercise.completedSets?.length || 0;
  const progressPercent = currentExercise.targetSets > 0 ? (completedSetsCount / currentExercise.targetSets) * 100 : 0;
  const nextSetNumber = completedSetsCount + 1;
  
  return (
    <div className="flex-1 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 data-testid="workout-routine-name" className="text-lg font-semibold text-text-primary">{currentWorkout.routineName}</h2>
        <PillButton data-testid="finish-workout-btn" variant="danger" size="sm" onClick={handleFinish}>
          <X className="w-3 h-3 mr-1" />Finalizar
        </PillButton>
      </div>
      
      <div data-testid="exercise-tabs" className="mb-4">
        {supersets.length > 0 && (
          <div data-testid="superset-badges" className="flex flex-wrap gap-2 mb-3">
            {supersets.map((superset) => {
              const progress = getSupersetProgress(superset.id);
              const isComplete = progress.completed === progress.total;
              const isActive = currentExercise && superset.exerciseIds.includes(currentExercise.id);
              
              return (
                <div 
                  key={superset.id}
                  data-testid={`superset-badge-${superset.id}`}
                  className={`px-3 py-2 rounded-card text-xs font-medium flex items-center gap-2 ${
                    isComplete
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                      : isActive 
                        ? 'bg-accent/20 border border-accent text-accent' 
                        : 'bg-bg-elevated border border-border-subtle text-text-secondary'
                  }`}
                >
                  {isComplete ? <Check className="w-3 h-3" /> : <Link className="w-3 h-3" />}
                  <span>{superset.name}</span>
                  <span className="font-mono">{progress.completed}/{progress.total}</span>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {currentWorkout.exercises.map((ex: any, i: number) => {
            const superset = getSupersetForExercise(ex.id);
            const isSupersetExercise = !!superset;
            const supersetIndex = isSupersetExercise 
              ? superset!.exerciseIds.indexOf(ex.id) + 1
              : 0;
            const totalInSuperset = isSupersetExercise ? superset!.exerciseIds.length : 0;
            const supersetComplete = isSupersetExercise && getSupersetProgress(superset!.id).completed === getSupersetProgress(superset!.id).total;
            
            return (
              <button 
                key={ex.id}
                data-testid={`exercise-tab-${ex.id}`}
                onClick={() => setExerciseIndex(i)}
                className={`flex-shrink-0 px-3 py-2 rounded-full text-sm transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  i === exerciseIndex 
                    ? 'bg-accent text-bg-deep' 
                    : ex.isCompleted || supersetComplete
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-bg-surface text-text-secondary'
                }`}
              >
                {isSupersetExercise && <Link className="w-3 h-3" />}
                {(ex.isCompleted || supersetComplete) && <Check className="w-3 h-3" />}
                <span className="max-w-[100px] truncate">{ex.name}</span>
                {isSupersetExercise && (
                  <span className="text-[10px] opacity-70">{supersetIndex}/{totalInSuperset}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {activeTimer && (
        <div data-testid="rest-timer" className="mb-4 p-4 rounded-card bg-accent-glow border-2 border-accent text-center">
          <p className="text-accent font-medium mb-1">Descanso</p>
          <p className="font-mono text-4xl font-bold text-text-primary">{formatTime(activeTimer.time)}</p>
          <div className="mt-3 flex justify-center gap-2">
            <button onClick={() => setActiveTimer(prev => prev ? { ...prev, time: prev.time + 15 } : null)} className="px-4 py-2 rounded-full bg-bg-elevated text-text-secondary text-sm">+15s</button>
            <button data-testid="skip-timer-btn" onClick={skipTimer} className="px-4 py-2 rounded-full bg-danger text-white text-sm">Saltar</button>
          </div>
        </div>
      )}
      
      <div data-testid="current-exercise-card" className="p-4 rounded-card bg-bg-surface border border-border-subtle">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl font-bold text-text-primary">{currentExercise.name}</h3>
          {getCurrentSuperset() && (
            <span data-testid="current-superset-badge" className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium flex items-center gap-1">
              <Link className="w-3 h-3" />{getCurrentSuperset()!.name}
            </span>
          )}
          {currentExercise.toFailure && (
            <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium flex items-center gap-1">
              <Zap className="w-3 h-3" />Al fallo
            </span>
          )}
        </div>
        <p className="text-text-secondary mb-2">
          {completedSetsCount}/{currentExercise.targetSets} series × {currentExercise.targetReps} reps
        </p>
        
        {getCurrentSuperset() && (() => {
          const supersetProgress = getSupersetProgress(getCurrentSuperset()!.id);
          const isComplete = supersetProgress.completed === supersetProgress.total;
          return (
            <div data-testid="superset-progress" className={`mb-3 p-2 rounded-card ${isComplete ? 'bg-green-500/10 border border-green-500/30' : 'bg-accent/10 border border-accent/30'}`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${isComplete ? 'text-green-400' : 'text-accent'}`}>
                  {isComplete ? '¡Superserie completada!' : 'Progreso superserie'}
                </span>
                <span className={`font-mono ${isComplete ? 'text-green-400' : 'text-accent'}`}>
                  {supersetProgress.completed}/{supersetProgress.total} ejercicios
                </span>
              </div>
              <div className="mt-2 h-2 bg-bg-elevated rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${isComplete ? 'bg-green-500' : 'bg-accent'}`}
                  style={{ width: `${supersetProgress.percent}%` }}
                />
              </div>
            </div>
          );
        })()}
        
        <div data-testid="exercise-progress" className="mb-4">
          <div className="flex justify-between text-xs text-text-secondary mb-1">
            <span>Progreso de series</span>
            <span>{completedSetsCount}/{currentExercise.targetSets}</span>
          </div>
          <div className="h-3 bg-bg-elevated rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        
        {completedSetsCount > 0 && (
          <div className="mb-4">
            <p className="text-xs text-text-secondary mb-2">Series completadas:</p>
            <div className="flex flex-wrap gap-2">
              {currentExercise.completedSets.map((set: CompletedSet) => (
                <div key={set.setNumber} className="px-3 py-2 rounded-card bg-bg-elevated border border-border-subtle">
                  <span className="text-xs text-text-secondary">Serie {set.setNumber}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-accent">{set.weight}kg</span>
                    <span className="text-xs text-text-secondary">×{set.reps}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <p className="text-xs text-text-secondary mb-2">Serie {nextSetNumber} de {currentExercise.targetSets}</p>
          
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <label className="text-xs text-text-secondary mb-1 block">Peso (kg) *</label>
              <input 
                data-testid="weight-input" 
                type="number" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)} 
                placeholder="0" 
                className="w-full h-10 px-3 bg-bg-elevated rounded-card border border-border-subtle text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent text-center font-mono"
              />
            </div>
            
            {currentExercise.toFailure && (
              <div className="flex-1">
                <label className="text-xs text-text-secondary mb-1 block">Reps logradas *</label>
                <input 
                  data-testid="reps-input"
                  type="number" 
                  value={reps} 
                  onChange={(e) => setReps(e.target.value)} 
                  placeholder="0" 
                  className="w-full h-10 px-3 bg-bg-elevated rounded-card border border-border-subtle text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent text-center font-mono"
                />
              </div>
            )}
          </div>
        </div>
        
        <PillButton 
          data-testid="complete-set-btn" 
          variant="primary" 
          className="w-full" 
          onClick={completeCurrentSet} 
          disabled={currentExercise.isCompleted || !weight || (currentExercise.toFailure && !reps)}
        >
          <Check className="w-4 h-4 mr-1" />
          {currentExercise.isCompleted ? 'Completado' : 'Completar Serie'}
        </PillButton>
      </div>
      
      {allCompleted && (
        <div data-testid="workout-completed" className="mt-6 p-4 rounded-card bg-accent/20 border border-accent/30 text-center">
          <p className="text-accent font-semibold mb-2">¡Rutina completada!</p>
          <PillButton variant="primary" onClick={handleFinish}>Finalizar</PillButton>
        </div>
      )}
    </div>
  );
}
