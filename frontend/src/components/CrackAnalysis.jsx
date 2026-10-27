import React, { useState } from 'react';
import { 
  SearchCode, 
  Upload, 
  AlertOctagon, 
  CheckCircle2, 
  FileDown, 
  RefreshCw, 
  ImageIcon, 
  Ruler, 
  Layers, 
  Activity,
  Wrench,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';

export const CrackAnalysis = ({ onOpenReport }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('/static/samples/crack_shear.svg');
  const [activePreset, setActivePreset] = useState('crack_shear');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const presets = [
    { id: 'crack_shear', label: 'Beam 45° Diagonal Shear', img: '/static/samples/crack_shear.svg', severity: 'Severe' },
    { id: 'crack_spall', label: 'Column Spall & Exposed Rebar', img: '/static/samples/crack_spall.svg', severity: 'Critical' },
    { id: 'crack_hairline', label: 'Partition Wall Hairline', img: '/static/samples/crack_hairline.svg', severity: 'Minor' },
  ];

  const runAnalysis = async (fileObj, presetKey) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.analyzeCrack({ file: fileObj, preset: presetKey });
      setReport(data);
    } catch (err) {
      setError(err.message || 'Crack analysis failed');
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

  React.useEffect(() => {
    runAnalysis(null, 'crack_shear');
  }, []);

  const getSeverityBadge = (grade) => {
    const g = grade.toLowerCase();
    if (g.includes('critical')) return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    if (g.includes('severe')) return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    if (g.includes('moderate')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <SearchCode className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              Crack Detection & Structural Distress Analysis
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multimodal visual forensic inspection, crack width telemetry, propagation risk, and ACI 224.1R repair methodology.
          </p>
        </div>

        {report && (
          <button
            onClick={() => onOpenReport('Structural Forensic Crack Report', report)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-2"
          >
            <FileDown className="w-4 h-4 text-brand-400" />
            <span>Export Forensic Report</span>
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Selector & Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Select Structural Distress Case
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePresetSelect(p)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                    activePreset === p.id
                      ? 'bg-blue-500/10 border-blue-500 text-blue-300'
                      : 'bg-slate-850 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                    <span>{p.label}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getSeverityBadge(p.severity)}`}>
                    {p.severity}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Or Upload Structural Photograph
              </label>
              <label className="flex items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl cursor-pointer bg-slate-850 hover:bg-slate-800/80 transition text-xs text-slate-400 hover:text-slate-200">
                <Upload className="w-4 h-4 mr-2 text-blue-400" />
                <span>Upload Structural Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Structural Inspection Frame
              </span>
              {loading && (
                <span className="flex items-center text-xs text-blue-400 animate-pulse">
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  Forensic Scanning...
                </span>
              )}
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-[4/3] flex items-center justify-center border border-slate-800">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Crack Frame"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Forensic Output (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {error && (
            <div className="p-4 bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-2xl text-xs">
              {error}
            </div>
          )}

          {report ? (
            <>
              {/* Telemetry Header Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Element Inspected
                  </span>
                  <div className="text-sm font-bold text-slate-100 mt-1 line-clamp-1">
                    {report.element_inspected}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{report.crack_type}</div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Severity Index
                  </span>
                  <div className="text-2xl font-extrabold text-slate-100 mt-1 flex items-baseline gap-1">
                    <span>{report.severity_score}</span>
                    <span className="text-xs text-slate-400 font-normal">/ 100</span>
                  </div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(report.severity_grade)}`}>
                    {report.severity_grade}
                  </span>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Urgency Level
                  </span>
                  <div className="text-xs font-bold text-slate-200 mt-1 leading-snug">
                    {report.urgency_level}
                  </div>
                  <div className="text-[10px] text-amber-400 mt-1">
                    Propagation: {report.propagation_likelihood}
                  </div>
                </div>
              </div>

              {/* Dimensional Telemetry */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                  <span>Physical Crack Telemetry</span>
                  <Ruler className="w-4 h-4 text-blue-400" />
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Est. Width</span>
                    <span className="font-extrabold text-slate-100 text-sm">{report.measurements.estimated_width_mm} mm</span>
                  </div>
                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Est. Length</span>
                    <span className="font-extrabold text-slate-100 text-sm">{report.measurements.estimated_length_cm} cm</span>
                  </div>
                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Orientation</span>
                    <span className="font-semibold text-slate-100 line-clamp-1">{report.measurements.orientation}</span>
                  </div>
                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Depth Profile</span>
                    <span className="font-semibold text-slate-100 line-clamp-1">{report.measurements.depth_characteristic}</span>
                  </div>
                </div>
              </div>

              {/* Structural Integrity Assessment */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-rose-400" />
                  <span>Structural Integrity & Load-Path Vulnerability</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-850 p-3 rounded-xl border border-slate-800">
                  {report.structural_integrity_risk}
                </p>
              </div>

              {/* Root Causes & Remediation Roadmap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center space-x-1.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Primary Root Causes</span>
                  </h3>
                  <div className="space-y-2 text-xs text-slate-300">
                    {report.root_causes.map((rc, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <span className="text-amber-400 font-mono text-[10px] mt-0.5">•</span>
                        <span>{rc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center space-x-1.5">
                    <Wrench className="w-4 h-4 text-emerald-400" />
                    <span>Engineering Remediation Plan</span>
                  </h3>
                  <div className="space-y-2 text-xs text-slate-300">
                    {report.remediation_methods.map((rm, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <span>{rm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Standards */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>Applicable Structural Standards & Codes</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.inspection_code_standards.map((cs, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {cs}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
              Select a crack case or upload an image to view forensic report.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
