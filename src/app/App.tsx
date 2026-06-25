import { useState } from 'react';
import { Calendar, Plus, BarChart3, List, Dumbbell } from 'lucide-react';
import { CalendarPage } from '../features/calendar';
import { RoutinesPage } from '../features/routines';
import { DashboardPage } from '../features/dashboard';
import { useStore } from '../store/useStore';

type Tab = 'calendar' | 'routines' | 'dashboard';

function BottomNav({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: Tab; 
  onTabChange: (tab: Tab) => void;
}) {
  const tabs: { id: Tab; label: string; icon: JSX.Element }[] = [
    { id: 'calendar', label: 'Calendario', icon: <Calendar className="w-5 h-5" /> },
    { id: 'routines', label: 'Rutinas', icon: <List className="w-5 h-5" /> },
    { id: 'dashboard', label: 'Estadísticas', icon: <BarChart3 className="w-5 h-5" /> },
  ];
  
  return (
    <nav data-testid="bottom-nav" className="fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-border-subtle z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              data-testid={`tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all duration-150 touch-target ${isActive ? 'text-accent' : 'text-text-secondary'}`}
            >
              {tab.icon}
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Header() {
  return (
    <header data-testid="app-header" className="fixed top-0 left-0 right-0 bg-bg-deep/95 backdrop-blur-sm border-b border-border-subtle z-50">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-bg-deep" />
          </div>
          <h1 className="text-lg font-bold text-text-primary">Log Box Gym</h1>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calendar');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarPage />;
      case 'routines':
        return <RoutinesPage />;
      case 'dashboard':
        return <DashboardPage />;
      default:
        return <CalendarPage />;
    }
  };
  
  return (
    <div className="min-h-screen bg-bg-deep">
      <Header />
      
      <main className="pt-14 pb-20 min-h-screen">
        <div className="max-w-lg mx-auto">
          {renderContent()}
        </div>
      </main>
      
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}