import React, { useState } from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileDown, 
  RefreshCw, 
  ShieldAlert, 
  CheckSquare, 
  Square,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export const SiteAdvisory = ({ onOpenReport }) => {
  const [weather, setWeather] = useState({
    location: 'Central Metro Commercial Hub - Sector 12',
    temperature_c: 34.0,
    condition: 'Sunny / Clear',
    wind_speed_kmh: 18.0,
    humidity_percentage: 58.0,
    precipitation_chance: 15.0,
    forecast_next_24h: 'High midday solar radiation. Evening wind gusts up to 25 km/h with 20% precipitation chance.'
  });

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});

  const weatherPresets = [
    {
      label: 'Optimal Weather',
      condition: 'Sunny / Clear',
      temp: 25.0,
      wind: 12.0,
      precip: 5.0,
      humidity: 50.0
    },
    {
      label: 'Extreme Heatwave',
      condition: 'Extreme Heat (>38°C)',
      temp: 39.5,
      wind: 16.0,
      precip: 0.0,
      humidity: 35.0
    },
    {
      label: 'Heavy Rain & Storm',
      condition: 'Heavy Rain / Thunderstorm',
      temp: 21.0,
      wind: 32.0,
      precip: 90.0,
      humidity: 95.0
    },
    {
      label: 'High Wind Advisory',
      condition: 'High Winds (>40 km/h)',
      temp: 27.0,
      wind: 45.0,
      precip: 25.0,
      humidity: 60.0
    }
  ];

  const handlePresetSelect = (preset) => {
    const updated = {
      ...weather,
      condition: preset.condition,
      temperature_c: preset.temp,
      wind_speed_kmh: preset.wind,
      precipitation_chance: preset.precip,
      humidity_percentage: preset.humidity
    };
    setWeather(updated);
    fetchAdvisory(updated);
  };

  const fetchAdvisory = async (inputData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getWeatherAdvisory(inputData || weather);
      setReport(data);
    } catch (err) {
      setError(err.message || 'Advisory generation failed');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAdvisory(weather);
  }, []);

  const toggleTask = (taskId) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('halt')) return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    if (s.includes('caution')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  };

  const getRiskColor = (risk) => {
    const r = (risk || '').toLowerCase();
    if (r.includes('critical') || r.includes('shutdown')) return 'text-rose-400 border-rose-500/40 bg-rose-950/30';
    if (r.includes('high')) return 'text-orange-400 border-orange-500/40 bg-orange-950/30';
    if (r.includes('medium')) return 'text-amber-400 border-amber-500/40 bg-amber-950/30';
    return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <CloudSun className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              Daily Site Assistance & Weather-Aware Advisory
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time meteorological impact on concrete hydration, crane lifting safety limits, and shift supervisor checklists.
          </p>
        </div>

        {report && (
          <button
            onClick={() => onOpenReport('Daily Site & Weather Advisory Report', report)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-2"
          >
            <FileDown className="w-4 h-4 text-brand-400" />
            <span>Export Shift Briefing</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Weather Simulation Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Simulate Weather Condition
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {weatherPresets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(p)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                    weather.condition === p.condition
                      ? 'bg-sky-500/10 border-sky-500 text-sky-300'
                      : 'bg-slate-850 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{p.label}</span>
                  <span className="text-[11px] font-mono text-slate-400">{p.temp}°C</span>
                </button>
              ))}
            </div>

            {/* Custom Metrics */}
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Temperature: {weather.temperature_c}°C</span>
                  <Thermometer className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={weather.temperature_c}
                  onChange={(e) => setWeather({ ...weather, temperature_c: parseFloat(e.target.value) })}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Wind Speed: {weather.wind_speed_kmh} km/h</span>
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  value={weather.wind_speed_kmh}
                  onChange={(e) => setWeather({ ...weather, wind_speed_kmh: parseFloat(e.target.value) })}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Rain Chance: {weather.precipitation_chance}%</span>
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weather.precipitation_chance}
                  onChange={(e) => setWeather({ ...weather, precipitation_chance: parseFloat(e.target.value) })}
                  className="w-full accent-brand-500"
                />
              </div>

              <button
                type="button"
                onClick={() => fetchAdvisory(weather)}
                disabled={loading}
                className="w-full mt-2 py-2.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating Weather...</span>
                  </>
                ) : (
                  <>
                    <span>Run Advisory Engine</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Advisory Outputs (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {error && (
            <div className="p-4 bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-2xl text-xs">
              {error}
            </div>
          )}

          {report && (
            <>
              {/* Overall Risk & Delay Metric */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-4 rounded-2xl border ${getRiskColor(report.overall_site_risk)}`}>
                  <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">
                    Overall Site Risk Status
                  </span>
                  <div className="text-2xl font-extrabold mt-1">
                    {report.overall_site_risk}
                  </div>
                  <p className="text-[11px] mt-1 opacity-80">{report.weather_summary}</p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Schedule Delay Probability
                  </span>
                  <div className="text-3xl font-extrabold text-amber-400 mt-1">
                    {report.delay_probability_percentage}%
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                    <div
                      style={{ width: `${report.delay_probability_percentage}%` }}
                      className="h-1.5 rounded-full bg-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Critical Trade Activities Go / No-Go */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Critical Work Package Go / No-Go Feasibility
                </h3>
                <div className="space-y-2.5">
                  {report.operations_impact.map((op, i) => (
                    <div
                      key={i}
                      className="p-3.5 bg-slate-850 rounded-xl border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{op.activity_name}</span>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(op.status)}`}>
                          {op.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {op.advisory_notes}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {op.risk_factors.map((rf, rIdx) => (
                          <span
                            key={rIdx}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700/60"
                          >
                            ⚠️ {rf}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Supervisor Checklist */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Daily Supervisor Shift Checklist
                  </h3>
                  <span className="text-[11px] text-brand-400">
                    {Object.values(completedTasks).filter(Boolean).length} / {report.daily_supervisor_checklist.length} Completed
                  </span>
                </div>

                <div className="space-y-2">
                  {report.daily_supervisor_checklist.map((task) => {
                    const isDone = !!completedTasks[task.task_id];
                    return (
                      <div
                        key={task.task_id}
                        onClick={() => toggleTask(task.task_id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-start space-x-3 ${
                          isDone
                            ? 'bg-slate-850/40 border-slate-800 text-slate-500 line-through'
                            : 'bg-slate-850 border-slate-800 text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <span className="font-medium">{task.item}</span>
                          <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1 not-italic">
                            <span className="text-slate-500">Role:</span>
                            <span className="font-semibold text-slate-300">{task.assigned_role}</span>
                            <span>•</span>
                            <span className="text-brand-400 font-semibold">{task.category}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Material Handling Guidelines */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Material Stockpiling & Weatherproofing Protocol
                </h3>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {report.material_handling_guidelines.map((m, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <span className="text-sky-400 font-mono text-[10px] mt-0.5">•</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
