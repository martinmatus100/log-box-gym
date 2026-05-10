import { useState } from 'react';
import { Plus, Trash2, Edit2, X, Dumbbell, Target, Heart, Zap, Flame, Star, Award, Activity, Users, Shield } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { PillButton } from '../../shared/components';
import { Routine, RoutineExercise, REST_TIME_OPTIONS, PRESET_EXERCISES } from '../../shared/types';
import { generateId } from '../../shared/utils/storage';

const iconMap: Record<string, React.ReactNode> = {
  dumbbell: <Dumbbell className="w-5 h-5" />,
  target: <Target className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
  zap: <Zap className="w-5 h-5" />,
  flame: <Flame className="w-5 h-5" />,
  star: <Star className="w-5 h-5" />,
  award: <Award className="w-5 h-5" />,
  activity: <Activity className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  shield: <Shield className="w-5 h-5" />,
};

const defaultIcon = <Dumbbell className="w-5 h-5" />;

function getExerciseIcon(exerciseName: string): React.ReactNode {
  const name = exerciseName.toLowerCase();
  
  if (name.includes('sentadilla sumo') || name.includes('sentadilla bulgara') || name.includes('sentadilla')) return iconMap.activity;
  if (name.includes('press militar') || name.includes('press banco') || name.includes('landmine')) return iconMap.target;
  if (name.includes('peso muerto')) return iconMap.flame;
  if (name.includes('dominadas')) return iconMap.users;
  if (name.includes('kettlebell') || name.includes('swings')) return iconMap.zap;
  if (name.includes('curl')) return iconMap.heart;
  if (name.includes('tríceps')) return iconMap.zap;
  if (name.includes('vuelos') || name.includes('posteriores') || name.includes('aperturas')) return iconMap.zap;
  if (name.includes('dumbbell') || name.includes('snatch')) return iconMap.dumbbell;
  
  return defaultIcon;
}

export function RoutinesPage() {
  const { routines, addRoutine, updateRoutine, deleteRoutine } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [expandedRoutine, setExpandedRoutine] = useState<string | null>(null);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-accent" />
          Rutinas
        </h1>
        <PillButton variant="primary" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Nueva
        </PillButton>
      </div>

      {showForm && (
        <RoutineForm
          initialRoutine={editingRoutine || undefined}
          onSave={(routine) => {
            if (editingRoutine) {
              updateRoutine(routine);
            } else {
              addRoutine(routine);
            }
            setShowForm(false);
            setEditingRoutine(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingRoutine(null);
          }}
        />
      )}

      <div className="flex flex-col gap-3">
        {routines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-bg-surface flex items-center justify-center mb-4">
              <Dumbbell className="w-8 h-8 text-text-secondary" />
            </div>
            <p className="text-text-secondary mb-2">No hay rutinas creadas</p>
            <p className="text-text-secondary text-sm">Crea tu primera rutina para comenzar</p>
          </div>
        ) : (
          routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              isExpanded={expandedRoutine === routine.id}
              onToggle={() => setExpandedRoutine(expandedRoutine === routine.id ? null : routine.id)}
              onEdit={() => {
                setEditingRoutine(routine);
                setShowForm(true);
              }}
              onDelete={() => deleteRoutine(routine.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface RoutineFormProps {
  initialRoutine?: Routine;
  onSave: (routine: Routine) => void;
  onCancel: () => void;
}

function RoutineForm({ initialRoutine, onSave, onCancel }: RoutineFormProps) {
  const [name, setName] = useState(initialRoutine?.name || '');
  const [exercises, setExercises] = useState<RoutineExercise[]>(initialRoutine?.exercises || []);
  const [showExerciseForm, setShowExerciseForm] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    
    const routine: Routine = {
      id: initialRoutine?.id || generateId(),
      name: name.trim(),
      exercises,
      createdAt: initialRoutine?.createdAt || Date.now(),
    };
    
    onSave(routine);
  };

  const addExercise = (exercise: RoutineExercise) => {
    setExercises([...exercises, exercise]);
    setShowExerciseForm(false);
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter(e => e.id !== exerciseId));
  };

  return (
    <div className="p-4 rounded-card bg-bg-surface border border-border-subtle">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          {initialRoutine ? 'Editar Rutina' : 'Nueva Rutina'}
        </h3>
        <button onClick={onCancel} className="p-2 rounded-full text-text-secondary hover:text-text-primary">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-text-secondary mb-2 block">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la rutina"
            className="w-full h-12 px-4 bg-bg-elevated rounded-full border border-border-subtle text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-text-secondary">Ejercicios ({exercises.length})</label>
            <button
              onClick={() => setShowExerciseForm(true)}
              className="text-xs text-accent hover:underline"
            >
              + Agregar
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="flex items-center gap-2 p-3 rounded-full bg-bg-elevated">
                <span className="text-accent">{getExerciseIcon(exercise.name)}</span>
                <span className="flex-1 text-text-primary">{exercise.name}</span>
                <span className="text-text-secondary text-sm">{exercise.targetSets}x{exercise.targetReps}</span>
                <span className="text-text-secondary text-sm">{exercise.restSeconds === 90 ? '1:30' : '2:00'}</span>
                {exercise.toFailure && <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">AF</span>}
                <button onClick={() => removeExercise(exercise.id)} className="p-1 text-text-secondary hover:text-danger">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {exercises.length === 0 && (
              <p className="text-text-secondary text-sm text-center py-2">Sin ejercicios</p>
            )}
          </div>
        </div>

        {showExerciseForm && (
          <ExerciseForm
            onSave={addExercise}
            onCancel={() => setShowExerciseForm(false)}
          />
        )}

        <div className="flex gap-2">
          <PillButton variant="secondary" onClick={onCancel}>Cancelar</PillButton>
          <PillButton variant="primary" onClick={handleSave} disabled={!name.trim()}>
            Guardar Rutina
          </PillButton>
        </div>
      </div>
    </div>
  );
}

interface ExerciseFormProps {
  initialExercise?: RoutineExercise;
  onSave: (exercise: RoutineExercise) => void;
  onCancel: () => void;
}

function ExerciseForm({ onSave, onCancel }: ExerciseFormProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customName, setCustomName] = useState('');
  const [targetSets, setTargetSets] = useState(3);
  const [targetReps, setTargetReps] = useState(10);
  const [restSeconds, setRestSeconds] = useState(90);
  const [toFailure, setToFailure] = useState(false);

  const handleSave = () => {
    const name = selectedPreset || customName.trim();
    if (!name) return;
    
    const exercise: RoutineExercise = {
      id: generateId(),
      name,
      targetSets,
      targetReps,
      restSeconds,
      toFailure,
    };
    
    onSave(exercise);
  };

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    setCustomName('');
  };

  return (
    <div className="p-4 rounded-card bg-bg-elevated border border-border-subtle">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-text-primary">Agregar Ejercicio</h4>
        <button onClick={onCancel} className="p-1 rounded-full text-text-secondary hover:text-text-primary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-text-secondary mb-2 block">Ejercicios Predefinidos</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_EXERCISES.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetSelect(preset)}
                className={`px-3 py-2 rounded-full text-sm flex items-center gap-1 transition-all ${
                  selectedPreset === preset 
                    ? 'bg-accent text-bg-deep' 
                    : 'bg-bg-surface text-text-secondary border border-border-subtle'
                }`}
              >
                <span className="text-accent">{getExerciseIcon(preset)}</span>
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-border-subtle" />
          <span className="text-text-secondary text-xs">O</span>
          <div className="flex-1 h-px bg-border-subtle" />
        </div>

        <div>
          <label className="text-xs text-text-secondary mb-1 block">Ejercicio Personalizado</label>
          <input
            type="text"
            value={customName}
            onChange={(e) => {
              setCustomName(e.target.value);
              setSelectedPreset('');
            }}
            placeholder="Escribe el nombre del ejercicio"
            className="w-full h-10 px-4 bg-bg-deep rounded-full border border-border-subtle text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs text-text-secondary mb-1 block">Series</label>
            <div className="flex items-center gap-2">
              <button onClick={() => setTargetSets(Math.max(1, targetSets - 1))} className="w-8 h-8 rounded-full bg-bg-surface text-text-secondary">-</button>
              <span className="text-text-primary font-mono w-8 text-center">{targetSets}</span>
              <button onClick={() => setTargetSets(targetSets + 1)} className="w-8 h-8 rounded-full bg-bg-surface text-text-secondary">+</button>
            </div>
          </div>
          <div className="flex-1">
            <label className="text-xs text-text-secondary mb-1 block">Repeticiones</label>
            <div className="flex items-center gap-2">
              <button onClick={() => setTargetReps(Math.max(1, targetReps - 1))} className="w-8 h-8 rounded-full bg-bg-surface text-text-secondary">-</button>
              <span className="text-text-primary font-mono w-8 text-center">{targetReps}</span>
              <button onClick={() => setTargetReps(targetReps + 1)} className="w-8 h-8 rounded-full bg-bg-surface text-text-secondary">+</button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm text-text-secondary">Al fallo</label>
          <button
            onClick={() => setToFailure(!toFailure)}
            className={`w-12 h-7 rounded-full relative transition-all ${toFailure ? 'bg-accent' : 'bg-bg-surface'}`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${toFailure ? 'left-6' : 'left-1'}`} />
          </button>
        </div>

        <div>
          <label className="text-xs text-text-secondary mb-1 block">Descanso</label>
          <div className="flex gap-2">
            <button
              onClick={() => setRestSeconds(90)}
              className={`flex-1 h-10 rounded-full text-sm ${
                restSeconds === 90 ? 'bg-accent text-bg-deep' : 'bg-bg-surface text-text-secondary'
              }`}
            >
              1:30
            </button>
            <button
              onClick={() => setRestSeconds(120)}
              className={`flex-1 h-10 rounded-full text-sm ${
                restSeconds === 120 ? 'bg-accent text-bg-deep' : 'bg-bg-surface text-text-secondary'
              }`}
            >
              2:00
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <PillButton variant="secondary" size="sm" onClick={onCancel}>Cancelar</PillButton>
          <PillButton 
            variant="primary" 
            size="sm" 
            onClick={handleSave} 
            disabled={!selectedPreset && !customName.trim()}
          >
            Agregar
          </PillButton>
        </div>
      </div>
    </div>
  );
}

const ROUTINE_ICONS = ['dumbbell', 'users', 'shield', 'zap', 'flame', 'award'];

interface RoutineCardProps {
  routine: Routine;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function RoutineCard({ routine, isExpanded, onToggle, onEdit, onDelete }: RoutineCardProps) {
  const [activeExercise, setActiveExercise] = useState(0);

  return (
    <div className="p-4 rounded-card bg-bg-surface border border-border-subtle">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-accent-glow flex items-center justify-center text-accent">
          <Dumbbell className="w-5 h-5" />
        </div>
        <div className="flex-1" onClick={onToggle}>
          <h3 className="text-text-primary font-semibold">{routine.name}</h3>
          <p className="text-text-secondary text-sm">{routine.exercises.length} ejercicios</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-2 rounded-full text-text-secondary hover:text-accent">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-2 rounded-full text-text-secondary hover:text-danger">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && routine.exercises.length > 0 && (
        <div className="mt-4">
          <div className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {routine.exercises.map((exercise, index) => (
              <button
                key={exercise.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveExercise(index);
                }}
                className={`px-3 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeExercise === index
                    ? 'bg-accent text-bg-deep'
                    : 'bg-bg-elevated text-text-secondary'
                }`}
              >
                <span className={activeExercise === index ? 'text-bg-deep' : 'text-accent'}>
                  {getExerciseIcon(exercise.name)}
                </span>
                {exercise.name}
              </button>
            ))}
          </div>
          {routine.exercises[activeExercise] && (
            <div className="mt-3 p-3 rounded-card bg-bg-elevated">
              <div className="flex items-center gap-3">
                <span className="text-accent">{getExerciseIcon(routine.exercises[activeExercise].name)}</span>
                <span className="flex-1 text-text-primary font-medium">{routine.exercises[activeExercise].name}</span>
              </div>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-text-secondary">
                  <span className="text-text-primary font-mono">{routine.exercises[activeExercise].targetSets}</span> series
                </span>
                <span className="text-text-secondary">
                  <span className="text-text-primary font-mono">{routine.exercises[activeExercise].targetReps}</span> reps
                </span>
                <span className="text-text-secondary">
                  Descanso: <span className="text-text-primary font-mono">{routine.exercises[activeExercise].restSeconds === 90 ? '1:30' : '2:00'}</span>
                </span>
                {routine.exercises[activeExercise].toFailure && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">Al fallo</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}