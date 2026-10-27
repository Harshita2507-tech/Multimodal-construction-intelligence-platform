import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { SafetyMonitoring } from './components/SafetyMonitoring';
import { CrackAnalysis } from './components/CrackAnalysis';
import { ProjectPlanning } from './components/ProjectPlanning';
import { RealEstateValuation } from './components/RealEstateValuation';
import { SiteAdvisory } from './components/SiteAdvisory';
import { KnowledgeAssistant } from './components/KnowledgeAssistant';
import { SettingsModal } from './components/SettingsModal';
import { ReportModal } from './components/ReportModal';
import { api, getStoredApiKey } from './services/api';
import { Building2, Github, ExternalLink, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLiveAI, setIsLiveAI] = useState(false);
  const [stats, setStats] = useState(null);
  const [reportModal, setReportModal] = useState({
    isOpen: false,
    title: '',
    data: null,
  });

  const checkHealthAndMode = async () => {
    try {
      const storedKey = getStoredApiKey();
      const health = await api.getHealth();
      setIsLiveAI(Boolean(storedKey) || health.gemini_live_connected);
    } catch {
      setIsLiveAI(Boolean(getStoredApiKey()));
    }
  };

  const loadStats = async () => {
    try {
      const data = await api.getProjectStats();
      setStats(data);
    } catch {
      // stats fallback
    }
  };

  useEffect(() => {
    checkHealthAndMode();
    loadStats();
  }, []);

  const handleOpenReport = (title, data) => {
    setReportModal({
      isOpen: true,
      title,
      data,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isLiveAI={isLiveAI}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            stats={stats}
            isLiveAI={isLiveAI}
          />
        )}

        {activeTab === 'safety' && (
          <SafetyMonitoring onOpenReport={handleOpenReport} />
        )}

        {activeTab === 'crack' && (
          <CrackAnalysis onOpenReport={handleOpenReport} />
        )}

        {activeTab === 'planning' && (
          <ProjectPlanning onOpenReport={handleOpenReport} />
        )}

        {activeTab === 'valuation' && (
          <RealEstateValuation onOpenReport={handleOpenReport} />
        )}

        {activeTab === 'advisory' && (
          <SiteAdvisory onOpenReport={handleOpenReport} />
        )}

        {activeTab === 'assistant' && (
          <KnowledgeAssistant />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-brand-400" />
            <span className="font-semibold text-slate-300">
              Multimodal Construction Intelligence Platform
            </span>
            <span>• Full-Stack Decision Support System</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-200 transition flex items-center space-x-1"
            >
              <span>FastAPI Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span className="text-slate-500">React 18 + FastAPI + Gemini 1.5</span>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeyUpdated={(key) => checkHealthAndMode()}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ ...reportModal, isOpen: false })}
        title={reportModal.title}
        data={reportModal.data}
      />
    </div>
  );
}
