import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileDown, 
  RefreshCw, 
  Image as ImageIcon,
  HardHat,
  Eye,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

export const SafetyMonitoring = ({ onOpenReport }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('/static/samples/safety_scaffold.svg');
  const [activePreset, setActivePreset] = useState('safety_scaffold');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const presets = [
    { id: 'safety_scaffold', label: 'Elevated Scaffold Hazard', img: '/static/samples/safety_scaffold.svg', risk: 'Moderate' },
    { id: 'safety_safe', label: 'Compliant Framing Crew', img: '/static/samples/safety_safe.svg', risk: 'Low' },
    { id: 'safety_excavation', label: 'Deep Excavation Cave-in', img: '/static/samples/safety_excavation.svg', risk: 'Critical' },
  ];

  const runAnalysis = async (fileObj, presetKey) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.analyzeSafety({ file: fileObj, preset: presetKey });
      setReport(data);
    } catch (err) {
      setError(err.message || 'Safety analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (preset) => {
    setActivePreset(preset.id);
    setSelectedFile(null);
    setPreviewUrl(preset.img);
    runAnalysis(null, preset.id);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setActivePreset('');
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      runAnalysis(file, null);
    }
  };

  // Initial auto-run on first load
  React.useEffect(() => {
    runAnalysis(null, 'safety_scaffold');
  }, []);

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
    if (score >= 65) return 'text-amber-400 border-amber-500/40 bg-amber-950/30';
    return 'text-rose-400 border-rose-500/40 bg-rose-950/30';
  };

  const getSeverityBadge = (sev) => {
    const s = sev.toLowerCase();
    if (s.includes('critical')) return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    if (s.includes('high')) return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    if (s.includes('medium')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              Construction Site Safety Monitoring
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multimodal PPE compliance verification, elevated fall hazard detection, and OSHA 1926 code audit.
          </p>
        </div>

        {report && (
          <button
            onClick={() => onOpenReport('Site Safety Monitoring Audit', report)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-2"
          >
            <FileDown className="w-4 h-4 text-brand-400" />
            <span>Export Safety Audit</span>
          </button>
        )}
      </div>

      {/* Main Analysis Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Selector & Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Preset Buttons */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Select Sample Site Scenario
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePresetSelect(p)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                    activePreset === p.id
                      ? 'bg-brand-500/10 border-brand-500 text-brand-300'
                      : 'bg-slate-850 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                    <span>{p.label}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getSeverityBadge(p.risk)}`}>
                    {p.risk}
                  </span>
                </button>
              ))}
            </div>

            {/* Upload File Input */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Or Upload Live Site Photo
              </label>
              <label className="flex items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-brand-500 rounded-xl cursor-pointer bg-slate-850 hover:bg-slate-800/80 transition text-xs text-slate-400 hover:text-slate-200">
                <Upload className="w-4 h-4 mr-2 text-brand-400" />
                <span>Upload JPEG / PNG image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Visual Image Preview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Visual Inspection Frame
              </span>
              {loading && (
                <span className="flex items-center text-xs text-brand-400 animate-pulse">
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  Analyzing Site...
                </span>
              )}
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-[4/3] flex items-center justify-center border border-slate-800">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Site Frame"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-slate-600 text-xs">No image selected</div>
              )}

              {/* Bounding Box Highlights if report has them */}
              {report?.hazards_detected?.map((h, i) => {
                if (!h.bounding_box) return null;
                const [ymin, xmin, ymax, xmax] = h.bounding_box;
                return (
                  <div
                    key={i}
                    style={{
                      top: `${ymin / 10}%`,
                      left: `${xmin / 10}%`,
                      height: `${(ymax - ymin) / 10}%`,
                      width: `${(xmax - xmin) / 10}%`,
                    }}
                    className="absolute border-2 border-rose-500 bg-rose-500/15 pointer-events-none rounded"
                  >
                    <span className="absolute -top-5 left-0 px-1.5 py-0.5 text-[9px] font-bold bg-rose-600 text-white rounded">
                      {h.hazard_type}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Output (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {error && (
            <div className="p-4 bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-2xl text-xs flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {report ? (
            <>
              {/* Score & Risk Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-4 rounded-2xl border ${getScoreColor(report.overall_safety_score)}`}>
                  <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">
                    Safety Score
                  </span>
                  <div className="text-3xl font-extrabold mt-1">
                    {report.overall_safety_score}
                    <span className="text-sm font-medium opacity-70"> / 100</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Risk Classification
                  </span>
                  <div className={`inline-block mt-2 px-2.5 py-1 rounded-lg text-xs font-bold border ${getSeverityBadge(report.risk_level)}`}>
                    {report.risk_level}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Workers Detected
                  </span>
                  <div className="text-2xl font-extrabold text-slate-100 mt-1 flex items-center space-x-2">
                    <HardHat className="w-5 h-5 text-brand-400" />
                    <span>{report.workers_detected} Personnel</span>
                  </div>
                </div>
              </div>

              {/* Site Context Brief */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Site Context & Observations
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {report.site_context}
                </p>
              </div>

              {/* PPE Compliance Checklist */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                  <span>PPE Compliance Audit</span>
                  <span className="text-[11px] font-normal text-slate-500">ANSI / OSHA Standards</span>
                </h3>
                <div className="space-y-2">
                  {report.ppe_compliance.map((ppe, i) => {
                    const isCompliant = ppe.status.toLowerCase().includes('compliant') && !ppe.status.toLowerCase().includes('non');
                    return (
                      <div
                        key={i}
                        className="p-3 bg-slate-850 rounded-xl border border-slate-800/80 flex items-start justify-between text-xs gap-3"
                      >
                        <div className="flex items-start space-x-2.5">
                          {isCompliant ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold text-slate-200">{ppe.item_name}</span>
                            <p className="text-[11px] text-slate-400 mt-0.5">{ppe.details}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                          isCompliant ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {ppe.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detected Hazards & Remediation */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Identified Site Hazards & Action Items
                </h3>
                <div className="space-y-3">
                  {report.hazards_detected.map((hz, i) => (
                    <div
                      key={i}
                      className="p-3.5 bg-slate-850 rounded-xl border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span className="font-semibold text-xs text-slate-200">{hz.hazard_type}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(hz.severity)}`}>
                          {hz.severity} Severity
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        <strong className="text-slate-400">Location:</strong> {hz.location}
                      </p>
                      <p className="text-xs text-slate-400">
                        {hz.description}
                      </p>
                      <div className="pt-2 border-t border-slate-800 text-xs">
                        <span className="text-brand-400 font-semibold">Immediate Remediation: </span>
                        <span className="text-slate-300">{hz.remediation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* OSHA Regulatory References */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  OSHA Code Compliance Citations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.osha_references.map((ref, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
              Select a scenario or upload an image to view safety audit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
