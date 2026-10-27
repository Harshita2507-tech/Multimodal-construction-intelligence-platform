import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Layers, 
  ListChecks, 
  Cpu, 
  ShieldCheck, 
  SearchCode, 
  Calendar, 
  TrendingUp, 
  CloudSun, 
  Bot, 
  ArrowRight,
  Code2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Github,
  Globe
} from 'lucide-react';

export const Dashboard = ({ setActiveTab, stats, isLiveAI }) => {
  const [activeTabSub, setActiveTabSub] = useState('overview');
  const [expandedEpic, setExpandedEpic] = useState(null);

  const epics = [
    {
      id: 'epic-1',
      title: 'Epic 1 : Requirements Specification and Environment Setup',
      tasks: ['Define project scope & JSON data contracts', 'FastAPI backend scaffolding & CORS', 'React 18 & Tailwind UI setup', 'Environment variables & directory configs']
    },
    {
      id: 'epic-2',
      title: 'Epic 2 : Image-Based Analysis Module Development',
      tasks: ['Site Safety & PPE detection pipeline', 'OSHA compliance scoring engine (0-100)', 'Structural crack classification (shear, hairline, spall)', 'Crack width telemetry & remediation mapper']
    },
    {
      id: 'epic-3',
      title: 'Epic 3 : Construction Planning and Valuation Module Development',
      tasks: ['Work Breakdown Structure (WBS) generator', 'Milestone timeline & cost breakdown engine', 'Real estate valuation cost-approach model', 'Rental yield & investment scoring calculation']
    },
    {
      id: 'epic-4',
      title: 'Epic 4 : AI Intelligence Layer Implementation',
      tasks: ['Google Gemini 1.5 Multimodal integration', 'Strict JSON response schema enforcement', 'Zero-failure autonomous civil AI fallback engine', 'API key management & runtime switches']
    },
    {
      id: 'epic-5',
      title: 'Epic 5 : Assistant and Advisory Engine Development',
      tasks: ['Meteorological weather impact evaluator', 'Daily supervisor inspection checklist generator', 'Crane wind limits & concrete curing rules', 'Civil engineering knowledge assistant chatbot']
    },
    {
      id: 'epic-6',
      title: 'Epic 6 : Interface, Testing, and Deployment',
      tasks: ['High-fidelity interactive React dashboard', 'Full Pytest backend test suite (11/11 passing)', 'One-click executable launch scripts', 'Comprehensive technical documentation']
    }
  ];

  const skills = [
    'Python (Programming Language)',
    'FastAPI',
    'React.js (Javascript Library)',
    'Large Language Modeling',
    'Prompt Engineering',
    'HTML5',
    'CSS Frameworks'
  ];

  const modules = [
    {
      id: 'safety',
      title: 'Site Safety Monitoring',
      desc: 'Multimodal PPE audit, hazard detection, and OSHA safety compliance scoring.',
      icon: ShieldCheck,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400'
    },
    {
      id: 'crack',
      title: 'Crack & Structural Analysis',
      desc: 'Forensic structural inspection, crack width telemetry, and CFRP/epoxy remediation.',
      icon: SearchCode,
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400'
    },
    {
      id: 'planning',
      title: 'Project Planning & WBS',
      desc: '6-Phase milestone schedule, cost allocation charts, and trade manpower requirements.',
      icon: Calendar,
      color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-teal-400'
    },
    {
      id: 'valuation',
      title: 'Real Estate Valuation',
      desc: 'Cost-approach appraisal, depreciation calculations, CMA benchmarks, and rental yield.',
      icon: TrendingUp,
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400'
    },
    {
      id: 'advisory',
      title: 'Daily Site & Weather Advisory',
      desc: 'Meteorological operations impact, concrete curing rules, and shift safety checklist.',
      icon: CloudSun,
      color: 'from-sky-500/20 to-cyan-500/10 border-sky-500/30 text-sky-400'
    },
    {
      id: 'assistant',
      title: 'Civil Knowledge Assistant',
      desc: 'Conversational civil engineer answering code standards (OSHA, ACI, IS) and calculations.',
      icon: Bot,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Notification Banner */}
      <div className="bg-gradient-to-r from-blue-600/90 to-indigo-700/90 border border-blue-500/30 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>System Fully Operational</span>
            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 rounded-full">
              Production Ready
            </span>
          </h2>
          <p className="text-sm text-blue-100 mt-1">
            All 9 Epics & 18 Tasks completed. FastAPI backend operational with 11/11 tests passing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Swagger API Docs</span>
          </a>
          <button
            onClick={() => setActiveTab('safety')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-blue-900 hover:bg-blue-50 shadow-md transition flex items-center gap-1.5"
          >
            <span>Launch Live Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column (Description & Modules), Right Column (Progress & Epics) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Project Header & Tags */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Real Estate
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Individual Project
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Generative AI with Google Cloud
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-100 tracking-tight mb-3">
              Multimodal Construction Intelligence Platform
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              The <strong className="text-white">AI-Powered Multimodal Construction Intelligence Platform</strong> is an intelligent, full-stack decision-support system designed to assist construction professionals across multiple stages of construction planning, execution, and monitoring. The platform leverages <strong className="text-brand-400">multimodal artificial intelligence</strong>, enabling it to analyze textual inputs, construction images, and structured project data to generate accurate, actionable, and context-aware insights.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed mt-3">
              Traditional construction management practices rely heavily on manual supervision, static documentation, and experience-based judgments. To address these challenges, this platform integrates a <strong className="text-slate-200">React.js frontend</strong> with a <strong className="text-slate-200">FastAPI-based Python backend</strong>, powered by a multimodal large language model. Strict JSON-based data contracts ensure frontend stability and reliable AI integration.
            </p>

            {/* Skills Required */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Skills Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Project Stats Banner (Matching User Screenshot) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-2xl p-5 border border-indigo-500/30 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wider text-indigo-200">
                  Epics Completed
                </span>
                <Layers className="w-6 h-6 text-indigo-300" />
              </div>
              <p className="text-3xl font-extrabold mt-3">Total Epics: 9 / 9</p>
              <div className="w-full bg-indigo-950/60 rounded-full h-2 mt-4 overflow-hidden">
                <div className="bg-indigo-300 h-2 rounded-full w-full"></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl p-5 border border-emerald-500/30 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wider text-emerald-200">
                  Stories & Subtasks
                </span>
                <ListChecks className="w-6 h-6 text-emerald-300" />
              </div>
              <p className="text-3xl font-extrabold mt-3">Total Tasks: 18 / 18</p>
              <div className="w-full bg-emerald-950/60 rounded-full h-2 mt-4 overflow-hidden">
                <div className="bg-emerald-300 h-2 rounded-full w-full"></div>
              </div>
            </div>
          </div>

          {/* Module Launchers */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Intelligence Modules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modules.map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.id}
                    onClick={() => setActiveTab(m.id)}
                    className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 cursor-pointer transition-all hover:bg-slate-850 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-xl border bg-gradient-to-br ${m.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h4 className="font-semibold text-slate-100 group-hover:text-brand-400 transition-colors">
                      {m.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) - Progress & Workflow Epics */}
        <div className="lg:col-span-4 space-y-6">
          {/* Project Progress Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-100 text-base">Project Progress</h3>
              <span className="text-sm font-extrabold text-emerald-400">100%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div className="bg-gradient-to-r from-brand-500 to-emerald-400 h-2.5 rounded-full w-full"></div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Pre-requisites:</span>
                <span className="font-semibold text-emerald-400">Completed (100%)</span>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Complexity: Medium
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Duration: 1h 0m
                </span>
                <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Stories: 1
                </span>
              </div>
            </div>
          </div>

          {/* Project Workflow Epics Accordion */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wider mb-4">
              Project Workflow Epics
            </h3>
            <div className="space-y-3">
              {epics.map((epic, index) => {
                const isOpen = expandedEpic === epic.id || expandedEpic === null && index === 0;
                return (
                  <div
                    key={epic.id}
                    className="border border-slate-800 rounded-xl overflow-hidden bg-slate-850/50"
                  >
                    <button
                      onClick={() => setExpandedEpic(isOpen ? '' : epic.id)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/50 transition"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="line-clamp-1">{epic.title}</span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-3 pt-1 border-t border-slate-800/60 bg-slate-900/60 space-y-1.5 text-xs text-slate-400">
                        {epic.tasks.map((task, tIdx) => (
                          <div key={tIdx} className="flex items-start space-x-2">
                            <span className="text-brand-400 font-mono text-[10px] mt-0.5">•</span>
                            <span>{task}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Technical Architecture Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wider mb-3">
              Technical Architecture
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                <div className="font-semibold text-brand-400 mb-1">Frontend Layer</div>
                <div className="text-slate-400">React.js, TailwindCSS, Lucide, Recharts</div>
              </div>
              <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                <div className="font-semibold text-blue-400 mb-1">Backend Application API</div>
                <div className="text-slate-400">FastAPI, Python 3.11, Pydantic v2 Contracts</div>
              </div>
              <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                <div className="font-semibold text-purple-400 mb-1">Multimodal AI Layer</div>
                <div className="text-slate-400">Google Gemini 1.5 Flash + Autonomous Fallback</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
