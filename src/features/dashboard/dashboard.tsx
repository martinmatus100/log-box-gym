import { useEffect, useState } from 'react';
import { Dumbbell, Flame, CalendarDays, Check, Download, Upload, TrendingUp, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../../store/useStore';
import { StatCard, PillButton } from '../../shared/components';
import { formatDate } from '../../shared/utils/storage';

export function DashboardPage() {
  const dayWorkouts = useStore(state => state.dayWorkouts);
  const routines = useStore(state => state.routines);
  const settings = useStore(state => state.settings);
  const setState = useStore(state => state.setState);
  
  const [stats, setStats] = useState({ weekWorkouts: 0, weekExercises: 0, streak: 0, totalRoutines: 0 });
  const [weeklyData, setWeeklyData] = useState<{ label: string; value: number; max: number; color: 'accent' | 'box' }[]>([]);
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [weightHistory, setWeightHistory] = useState<{ date: string; weight: number }[]>([]);
  const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);
  
  const [selectedFailureExercise, setSelectedFailureExercise] = useState('');
  const [failureExerciseOptions, setFailureExerciseOptions] = useState<string[]>([]);
  const [failureHistory, setFailureHistory] = useState<{ date: string; reps: number; weight: number }[]>([]);
  
  const exportData = () => {
    const data = {
      routines,
      dayWorkouts,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logboxgym-backup-${formatDate(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!data.routines || !data.dayWorkouts) {
          setImportError('Archivo inválido. No contiene datos de Log Box Gym.');
          return;
        }
        
        setState({
          routines: data.routines || [],
          dayWorkouts: data.dayWorkouts || [],
          settings: data.settings || settings,
        });
        
        setShowImportModal(false);
        setImportError('');
      } catch {
        setImportError('Error al leer el archivo. Asegúrate de que sea un JSON válido.');
      }
    };
    reader.readAsText(file);
  };
  
  useEffect(() => {
    const today = formatDate(new Date());
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = formatDate(weekAgo);
    
    const thisWeekWorkouts = dayWorkouts.filter(w => w.date >= weekAgoStr && w.date <= today && w.status === 'completed');
    const completedExercises = thisWeekWorkouts.reduce((sum, w) => 
      sum + w.exercises.filter((e: any) => e.isCompleted).length, 0
    );
    
    const streak = calculateStreak(dayWorkouts.filter(w => w.status === 'completed').map(w => w.date));
    
    setStats({
      weekWorkouts: thisWeekWorkouts.length,
      weekExercises: completedExercises,
      streak,
      totalRoutines: routines.length,
    });
    
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const todayDate = new Date();
    const week: { label: string; value: number; max: number; color: 'accent' | 'box' }[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(todayDate);
      date.setDate(todayDate.getDate() - i);
      const dateStr = formatDate(date);
      const dayCount = dayWorkouts.filter(w => w.date === dateStr && w.status === 'completed').length;
      
      week.push({
        label: days[date.getDay()],
        value: dayCount,
        max: 3,
        color: 'accent',
      });
    }
    setWeeklyData(week);
    
    const recent = dayWorkouts
      .filter(w => w.status === 'completed')
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
      .slice(0, 5);
    setRecentWorkouts(recent);
    
    const exerciseNames = [...new Set(
      dayWorkouts.flatMap(w => w.exercises.map((e: any) => e.name))
    )];
    setExerciseOptions(exerciseNames);
    
    const failureExercises = [...new Set(
      dayWorkouts.flatMap(w => w.exercises
        .filter((e: any) => e.toFailure && e.completedSets && e.completedSets.length > 0)
        .map((e: any) => e.name)
      )
    )];
    setFailureExerciseOptions(failureExercises);
    
    if (selectedExercise && exerciseNames.includes(selectedExercise)) {
      const history = dayWorkouts
        .filter(w => w.status === 'completed')
        .flatMap(w => w.exercises
          .filter((e: any) => e.name === selectedExercise && e.completedSets && e.completedSets.length > 0)
          .flatMap((e: any) => e.completedSets.map((set: any) => ({
            date: w.date,
            weight: set.weight,
          })))
        )
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-10);
      setWeightHistory(history);
    } else if (selectedExercise) {
      setWeightHistory([]);
    }
    
    if (selectedFailureExercise && failureExercises.includes(selectedFailureExercise)) {
      const history = dayWorkouts
        .filter(w => w.status === 'completed')
        .flatMap(w => w.exercises
          .filter((e: any) => e.name === selectedFailureExercise && e.toFailure && e.completedSets && e.completedSets.length > 0)
          .flatMap((e: any) => e.completedSets.map((set: any) => ({
            date: w.date,
            reps: set.reps,
            weight: set.weight,
          })))
        )
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-15);
      setFailureHistory(history);
    } else if (selectedFailureExercise) {
      setFailureHistory([]);
    }
  }, [dayWorkouts, routines, selectedExercise, selectedFailureExercise]);
  
  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      <h1 data-testid="dashboard-title" className="text-2xl font-bold text-text-primary flex items-center gap-2">
        <Flame className="w-6 h-6 text-accent" />
        Estadísticas
      </h1>
      
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          data-testid="stat-card-week"
          icon={<CalendarDays className="w-6 h-6" />}
          value={stats.weekWorkouts}
          label="Esta Semana"
        />
        <StatCard
          data-testid="stat-card-streak"
          icon={<Flame className="w-6 h-6" />}
          value={stats.streak}
          label="Racha"
          variant="accent"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          data-testid="stat-card-exercises"
          icon={<Check className="w-6 h-6" />}
          value={stats.weekExercises}
          label="Ejercicios Completados"
          variant="accent"
        />
        <StatCard
          data-testid="stat-card-routines"
          icon={<Dumbbell className="w-6 h-6" />}
          value={stats.totalRoutines}
          label="Rutinas Creadas"
          variant="accent"
        />
      </div>
      
      <div className="p-4 rounded-card bg-bg-surface border border-border-subtle">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Esta Semana</h2>
        <div data-testid="weekly-chart" className="flex items-end justify-between gap-2 h-32 px-2">
          {weeklyData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-24">
                <div
                  className="w-full max-w-8 rounded-full bg-accent"
                  style={{ height: `${Math.max(4, (item.value / item.max) * 100)}%` }}
                />
              </div>
              <span className="text-xs text-text-secondary">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {exerciseOptions.length > 0 && (
        <div className="p-4 rounded-card bg-bg-surface border border-border-subtle">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-text-primary">Progreso de Pesos</h2>
          </div>
          <select
            data-testid="exercise-select"
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="w-full h-12 px-4 bg-bg-elevated rounded-full border-2 border-border-subtle text-text-primary mb-4"
          >
            <option value="">Seleccionar ejercicio</option>
            {exerciseOptions.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          {selectedExercise && weightHistory.length > 0 && (
            <div data-testid="weight-chart" className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightHistory}>
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                    tickFormatter={(val) => new Date(val + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  />
                  <YAxis
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }}
                    labelFormatter={(val) => new Date(val + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#FF6B35"
                    strokeWidth={2}
                    dot={{ fill: '#FF6B35', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {selectedExercise && weightHistory.length === 0 && (
            <p className="text-text-secondary text-sm text-center py-4">No hay datos de peso para este ejercicio</p>
          )}
        </div>
      )}

      {failureExerciseOptions.length > 0 && (
        <div className="p-4 rounded-card bg-bg-surface border border-border-subtle">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-text-primary">Ejercicios al Fallo</h2>
          </div>
          <p className="text-text-secondary text-sm mb-4">
            Seguimiento de repeticiones logradas en ejercicios al fallo
          </p>
          <select
            data-testid="failure-exercise-select"
            value={selectedFailureExercise}
            onChange={(e) => setSelectedFailureExercise(e.target.value)}
            className="w-full h-12 px-4 bg-bg-elevated rounded-full border-2 border-border-subtle text-text-primary mb-4"
          >
            <option value="">Seleccionar ejercicio al fallo</option>
            {failureExerciseOptions.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          {selectedFailureExercise && failureHistory.length > 0 && (
            <div data-testid="failure-chart" className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={failureHistory}>
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                    tickFormatter={(val) => new Date(val + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  />
                  <YAxis
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }}
                    labelFormatter={(val) => new Date(val + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    formatter={(value: number, name: string) => {
                      if (name === 'reps') return [`${value} reps`, 'Repeticiones'];
                      return [`${value}kg`, 'Peso'];
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reps"
                    stroke="#FF6B35"
                    strokeWidth={2}
                    dot={{ fill: '#FF6B35', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="reps"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {selectedFailureExercise && failureHistory.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="p-2 rounded-card bg-bg-elevated text-center">
                <p className="text-xs text-text-secondary">Últimas reps</p>
                <p className="text-lg font-bold text-accent">{failureHistory[failureHistory.length - 1]?.reps || 0}</p>
              </div>
              <div className="p-2 rounded-card bg-bg-elevated text-center">
                <p className="text-xs text-text-secondary">Mejor marca</p>
                <p className="text-lg font-bold text-accent">{Math.max(...failureHistory.map(h => h.reps))}</p>
              </div>
              <div className="p-2 rounded-card bg-bg-elevated text-center">
                <p className="text-xs text-text-secondary">Promedio</p>
                <p className="text-lg font-bold text-accent">{Math.round(failureHistory.reduce((sum, h) => sum + h.reps, 0) / failureHistory.length)}</p>
              </div>
            </div>
          )}
          {selectedFailureExercise && failureHistory.length === 0 && (
            <p className="text-text-secondary text-sm text-center py-4">No hay datos de ejercicios al fallo</p>
          )}
        </div>
      )}
      
      {recentWorkouts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Entrenamientos Recientes</h2>
          <div data-testid="recent-workouts" className="flex flex-col gap-3">
            {recentWorkouts.map((workout) => (
              <div key={workout.id} data-testid={`workout-item-${workout.id}`} className="p-4 rounded-card bg-bg-surface border border-border-subtle">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-text-primary font-medium">{workout.routineName}</h4>
                    <p className="text-text-secondary text-sm">
                      {workout.exercises.filter((e: any) => e.isCompleted).length}/{workout.exercises.length} ejercicios
                    </p>
                  </div>
                  <span className="text-text-secondary text-sm">
                    {new Date(workout.date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-border-subtle">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Backup</h2>
        <div className="flex gap-3">
          <PillButton data-testid="export-btn" variant="secondary" onClick={exportData} className="flex-1">
            <Download className="w-4 h-4 mr-2" />Exportar
          </PillButton>
          <PillButton data-testid="import-btn" variant="secondary" onClick={() => setShowImportModal(true)} className="flex-1">
            <Upload className="w-4 h-4 mr-2" />Importar
          </PillButton>
        </div>
      </div>
      
      {showImportModal && (
        <div className="fixed inset-0 bg-bg-deep/80 z-50 flex items-center justify-center p-4">
          <div data-testid="import-modal" className="w-full max-w-sm bg-bg-surface rounded-card p-6 border border-border-subtle">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Importar Datos</h3>
            <p className="text-text-secondary text-sm mb-4">
              Al importar, se reemplazarán todas las rutinas y entrenamientos actuales.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="w-full mb-4 text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-border-subtle file:text-text-primary file:bg-transparent hover:file:bg-bg-elevated cursor-pointer"
            />
            {importError && <p className="text-danger text-sm mb-4">{importError}</p>}
            <PillButton variant="ghost" onClick={() => { setShowImportModal(false); setImportError(''); }} className="w-full">
              Cancelar
            </PillButton>
          </div>
        </div>
      )}
    </div>
  );
}

function calculateStreak(dates: string[]): number {
  if (dates.length < 3) return 0;
  
  const uniqueDates = [...new Set(dates)].sort().reverse();
  const today = formatDate(new Date());
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = formatDate(weekAgo);
  
  const thisWeekDates = uniqueDates.filter(d => d >= weekAgoStr && d <= today);
  
  if (thisWeekDates.length >= 3) {
    return Math.floor(thisWeekDates.length / 3);
  }
  
  return 0;
}
