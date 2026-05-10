import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { formatDate } from '../../../shared/utils/storage';

export function CalendarView() {
  const { selectedDate, selectDate, getWorkoutDates } = useStore();
  const workoutDates = getWorkoutDates();
  
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
  
  const goToPrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    selectDate(formatDate(newDate));
  };
  
  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    selectDate(formatDate(newDate));
  };
  
  const goToToday = () => {
    selectDate(formatDate(new Date()));
  };
  
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevWeek}
          className="p-2 rounded-full bg-bg-elevated text-text-secondary hover:text-text-primary transition-all active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold text-text-primary capitalize">{monthYear}</span>
          {selectedDate !== today && (
            <button
              onClick={goToToday}
              className="text-xs text-accent hover:underline"
            >
              Ir a hoy
            </button>
          )}
        </div>
        <button
          onClick={goToNextWeek}
          className="p-2 rounded-full bg-bg-elevated text-text-secondary hover:text-text-primary transition-all active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((date) => {
          const dateStr = formatDate(date);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === today;
          const hasWorkout = workoutDates.includes(dateStr);
          
          const dayNames: Record<number, string> = {
            0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb'
          };
          
          return (
            <button
              key={dateStr}
              onClick={() => selectDate(dateStr)}
              className={`
                flex flex-col items-center p-3 rounded-card transition-all active:scale-95
                ${isSelected 
                  ? 'bg-accent text-bg-deep' 
                  : isToday 
                    ? 'bg-accent-glow border border-accent' 
                    : 'bg-bg-surface hover:bg-bg-elevated'
                }
              `}
            >
              <span className={`text-xs font-medium ${
                isSelected ? '' : 'text-text-secondary'
              }`}>
                {dayNames[date.getDay()]}
              </span>
              <span className={`text-lg font-bold mt-1 ${
                isSelected ? '' : 'text-text-primary'
              }`}>
                {date.getDate()}
              </span>
              {hasWorkout && !isSelected && (
                <div className="w-2 h-2 rounded-full bg-accent mt-1" />
              )}
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-bg-deep mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}