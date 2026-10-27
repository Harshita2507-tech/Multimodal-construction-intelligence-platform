import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle2, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../services/api';

export const SettingsModal = ({ isOpen, onClose, onKeyUpdated }) => {
  const [apiKey, setApiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(apiKey);
    setSavedSuccess(true);
    if (onKeyUpdated) onKeyUpdated(apiKey);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    if (onKeyUpdated) onKeyUpdated('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-slate-100">
            <Key className="w-5 h-5 text-brand-400" />
            <h3 className="font-semibold text-lg">AI Engine Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Google Gemini API Key (Optional)
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              When provided, analysis queries call live Gemini 1.5 Multimodal vision and reasoning models.
              If omitted, the platform uses its built-in Autonomous Civil AI Engine with full offline coverage.
            </p>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-800 flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
            <div className="text-xs text-slate-300">
              <p className="font-medium text-slate-200">Zero-Config Standalone Mode</p>
              <p className="text-slate-400 mt-0.5">
                The platform is 100% demo-ready out of the box with strict JSON data contracts, mock datasets, and preset architectural scenarios.
              </p>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Settings saved successfully! Updating AI engine...</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1"
          >
            Clear Stored Key
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
