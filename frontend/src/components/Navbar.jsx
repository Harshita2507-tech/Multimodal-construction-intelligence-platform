import React from 'react';
import { 
  Building2, 
  ShieldAlert, 
  SearchCode, 
  CalendarClock, 
  TrendingUp, 
  CloudSun, 
  Bot, 
  LayoutDashboard, 
  Settings, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenSettings, isLiveAI }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'safety', label: 'Site Safety', icon: ShieldAlert },
    { id: 'crack', label: 'Crack Analysis', icon: SearchCode },
    { id: 'planning', label: 'Project Planning', icon: CalendarClock },
    { id: 'valuation', label: 'Valuation', icon: TrendingUp },
    { id: 'advisory', label: 'Daily & Weather', icon: CloudSun },
    { id: 'assistant', label: 'Knowledge AI', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-500 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base text-slate-100 tracking-tight">
                  Multimodal Construction Intelligence
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-brand-500/20 text-brand-400 rounded-full border border-brand-500/30">
                  Full Stack AI
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Decision-Support Decision Matrix</p>
            </div>
          </div>

          {/* Engine Status & Settings */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenSettings}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isLiveAI
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/40'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
              title="Click to configure Gemini API Key"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isLiveAI ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
              <span className="hidden md:inline">
                {isLiveAI ? 'Gemini 1.5 Live' : 'Autonomous Civil AI'}
              </span>
              <Settings className="w-3.5 h-3.5 ml-1 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
