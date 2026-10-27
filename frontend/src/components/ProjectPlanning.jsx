import React, { useState } from 'react';
import { 
  CalendarClock, 
  DollarSign, 
  Clock, 
  Layers, 
  Users, 
  AlertTriangle, 
  Lightbulb, 
  FileDown, 
  RefreshCw, 
  CheckCircle2,
  Building,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export const ProjectPlanning = ({ onOpenReport }) => {
  const [form, setForm] = useState({
    project_name: 'Skyline Residences Tower B',
    project_type: 'Residential Multi-Storey',
    built_up_area_sqft: 28000,
    floors_count: 5,
    target_budget_usd: 1450000,
    target_duration_months: 15,
    location_climate: 'Subtropical / Moderate'
  });

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.generateProjectPlan(form);
      setPlan(data);
    } catch (err) {
      setError(err.message || 'Project plan generation failed');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <CalendarClock className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              Construction Project Planning & Cost Estimation
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Work Breakdown Structure (WBS), Gantt milestone schedule, AACE cost estimation, and manpower allocations.
          </p>
        </div>

        {plan && (
          <button
            onClick={() => onOpenReport('Construction Project Master Plan', plan)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-2"
          >
            <FileDown className="w-4 h-4 text-brand-400" />
            <span>Export Master Plan</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls (4 cols) */}
        <div className="lg:col-span-4">
          <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Project Specification Parameters
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Project Name</label>
              <input
                type="text"
                value={form.project_name}
                onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Building Type</label>
                <select
                  value={form.project_type}
                  onChange={(e) => setForm({ ...form, project_type: e.target.value })}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="Residential Multi-Storey">Residential</option>
                  <option value="Commercial Complex">Commercial</option>
                  <option value="Industrial Warehouse">Industrial</option>
                  <option value="Villa / Bungalow">Villa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Floors / Tiers</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={form.floors_count}
                  onChange={(e) => setForm({ ...form, floors_count: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Built-Up Area (sq ft)</label>
                <input
                  type="number"
                  step="500"
                  value={form.built_up_area_sqft}
                  onChange={(e) => setForm({ ...form, built_up_area_sqft: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Duration (mo)</label>
                <input
                  type="number"
                  min="3"
                  max="60"
                  value={form.target_duration_months}
                  onChange={(e) => setForm({ ...form, target_duration_months: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Budget ($ USD)</label>
              <input
                type="number"
                step="50000"
                value={form.target_budget_usd}
                onChange={(e) => setForm({ ...form, target_budget_usd: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white transition flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Plan...</span>
                </>
              ) : (
                <>
                  <span>Generate WBS Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Master Plan Results (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {error && (
            <div className="p-4 bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-2xl text-xs">
              {error}
            </div>
          )}

          {plan && (
            <>
              {/* Financial & Schedule KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Total Estimated Cost
                  </span>
                  <div className="text-2xl font-extrabold text-slate-100 mt-1">
                    ${plan.total_estimated_cost.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-0.5">
                    Variance: {plan.budget_variance_percentage > 0 ? `+${plan.budget_variance_percentage}%` : `${plan.budget_variance_percentage}%`}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Contingency Reserve (10%)
                  </span>
                  <div className="text-2xl font-extrabold text-amber-400 mt-1">
                    ${plan.contingency_fund.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Weather & price hedge</div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Total Duration
                  </span>
                  <div className="text-2xl font-extrabold text-teal-400 mt-1">
                    {plan.total_duration_weeks} Weeks
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">6 synchronized phases</div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed">
                {plan.project_summary}
              </div>

              {/* Work Breakdown Structure (WBS) Milestones */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                  <span>Work Breakdown Structure (WBS) Milestones</span>
                  <span className="text-[11px] text-brand-400 font-normal">Gantt Sequence</span>
                </h3>

                <div className="space-y-3">
                  {plan.milestones.map((ms) => (
                    <div
                      key={ms.phase_number}
                      className="p-3.5 bg-slate-850 rounded-xl border border-slate-800 space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-md bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-[11px]">
                            {ms.phase_number}
                          </span>
                          <span className="font-semibold text-slate-200">{ms.phase_name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px]">
                          <span className="text-slate-400">Weeks {ms.start_week} - {ms.end_week} ({ms.duration_weeks} wks)</span>
                          {ms.critical_path && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              Critical Path
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Progress bar visualizer */}
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          style={{
                            marginLeft: `${(ms.start_week / plan.total_duration_weeks) * 100}%`,
                            width: `${(ms.duration_weeks / plan.total_duration_weeks) * 100}%`,
                          }}
                          className={`h-1.5 rounded-full ${ms.critical_path ? 'bg-rose-500' : 'bg-teal-500'}`}
                        />
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {ms.deliverables.map((del, dIdx) => (
                          <span
                            key={dIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 border border-slate-700/60"
                          >
                            ✓ {del}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Cost Breakdown by Package
                </h3>
                <div className="space-y-2.5">
                  {plan.cost_breakdown.map((item, i) => (
                    <div key={i} className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span className="font-medium">{item.category}</span>
                        <span className="font-bold text-slate-100">
                          ${item.amount.toLocaleString()} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          style={{ width: `${item.percentage}%` }}
                          className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-brand-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resource Schedule */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                  <span>Workforce & Trade Allocations</span>
                  <Users className="w-4 h-4 text-teal-400" />
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[11px]">
                        <th className="pb-2">Trade Discipline</th>
                        <th className="pb-2 text-center">Peak Headcount</th>
                        <th className="pb-2 text-right">Avg Daily Rate</th>
                        <th className="pb-2 text-right">Est. Man-Days</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {plan.resource_schedule.map((res, i) => (
                        <tr key={i} className="hover:bg-slate-850/50">
                          <td className="py-2.5 font-medium text-slate-200">{res.trade}</td>
                          <td className="py-2.5 text-center font-bold text-teal-400">{res.peak_headcount}</td>
                          <td className="py-2.5 text-right font-mono">${res.average_daily_rate}/day</td>
                          <td className="py-2.5 text-right font-mono text-slate-400">{res.total_man_days} days</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Efficiency Recommendations */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Construction Engineering Value Optimizations</span>
                </h3>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {plan.efficiency_recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <span className="text-brand-400 font-mono text-[10px] mt-0.5">•</span>
                      <span>{rec}</span>
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
