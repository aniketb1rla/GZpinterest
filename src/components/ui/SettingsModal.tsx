"use client";

import React, { useState, useEffect } from "react";
import { X, Key, Sparkles, ShieldCheck, ExternalLink } from "lucide-react";
import { ApiSettings } from "@/lib/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: ApiSettings) => void;
  currentSettings: ApiSettings;
}

export function SettingsModal({ isOpen, onClose, onSave, currentSettings }: SettingsModalProps) {
  const [settings, setSettings] = useState<ApiSettings>(currentSettings);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(settings);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">API & Studio Settings</h3>
              <p className="text-xs text-slate-400">Configure AI models & Pinterest credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-5 space-y-4 text-sm">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-200 font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-rose-400 hover:underline flex items-center gap-1"
              >
                Get Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="AIzaSy... (Optional - fallback AI engine is active)"
              value={settings.geminiApiKey || ""}
              onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-mono text-xs"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Power deep audience extraction, Play Store parsing, and multimodal vision analysis.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-200 font-medium flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#E60023] flex items-center justify-center text-[10px] text-white font-bold">
                  P
                </span>
                Pinterest Access Token
              </label>
              <a
                href="https://developers.pinterest.com/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-rose-400 hover:underline flex items-center gap-1"
              >
                Pinterest Docs <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="pina_... (Optional - Pinterest visual trend engine is active)"
              value={settings.pinterestToken || ""}
              onChange={(e) => setSettings({ ...settings, pinterestToken: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-mono text-xs"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Enables live Pinterest account search & board extraction.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-300">Resilient Smart Fallbacks Active</p>
              <p className="mt-0.5 text-slate-400">
                Keys are stored locally in your browser session. If keys are omitted, the studio uses its built-in Creative Director intelligence engine and Pinterest visual discovery database.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition shadow-lg shadow-rose-600/25 flex items-center gap-2"
          >
            {savedToast ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                Saved!
              </>
            ) : (
              "Save Settings"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
