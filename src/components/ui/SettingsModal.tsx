"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Key, Sparkles, ShieldCheck, ExternalLink, CheckCircle2, AlertCircle, RefreshCw, Search } from "lucide-react";
import { ApiSettings } from "@/lib/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: ApiSettings) => void;
  currentSettings: ApiSettings;
}

export function SettingsModal({ isOpen, onClose, onSave, currentSettings }: SettingsModalProps) {
  const [settings, setSettings] = useState<ApiSettings>({
    pinterestScraperKey: "ok_63e7e9468267146a98115657d1e9aa6b",
    ...currentSettings,
  });
  const [savedToast, setSavedToast] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testStatus, setTestStatus] = useState<{
    tested: boolean;
    valid?: boolean;
    profilesFound?: number;
    error?: string;
  }>({ tested: false });

  const testApiKey = useCallback(async (keyToTest?: string) => {
    const key = keyToTest || settings.pinterestScraperKey || "ok_63e7e9468267146a98115657d1e9aa6b";
    setIsTestingKey(true);
    try {
      const res = await fetch("/api/pinterest-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scraperKey: key }),
      });
      const data = await res.json();

      if (data.valid) {
        setTestStatus({
          tested: true,
          valid: true,
          profilesFound: data.profilesFound,
        });
      } else {
        setTestStatus({
          tested: true,
          valid: false,
          error: data.error || "Invalid Pinterest Scraper API key",
        });
      }
    } catch (e: any) {
      setTestStatus({
        tested: true,
        valid: false,
        error: e.message || "Failed to reach Pinterest API",
      });
    } finally {
      setIsTestingKey(false);
    }
  }, [settings.pinterestScraperKey]);

  useEffect(() => {
    setSettings({
      pinterestScraperKey: "ok_63e7e9468267146a98115657d1e9aa6b",
      ...currentSettings,
    });
  }, [currentSettings, isOpen]);

  const handleSave = () => {
    onSave(settings);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">API & Engine Settings</h3>
              <p className="text-xs text-slate-400">Configure Live Pinterest Search & Gemini AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-4"
        >
          {/* Live Pinterest Search Scraper API Key */}
          <div className="space-y-2 p-4 bg-rose-950/20 border border-rose-500/20 rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E60023] flex items-center justify-center text-[11px] text-white font-bold">
                  P
                </span>
                Live Pinterest Search API Key
              </label>
              <span className="text-[10px] px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full border border-emerald-500/30">
                Connected
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="password"
                placeholder="ok_63e7e9468267146a98115657d1e9aa6b"
                value={settings.pinterestScraperKey || "ok_63e7e9468267146a98115657d1e9aa6b"}
                onChange={(e) => {
                  setSettings({ ...settings, pinterestScraperKey: e.target.value });
                  setTestStatus({ tested: false });
                }}
                className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E60023] font-mono text-xs"
              />
              <button
                type="button"
                disabled={isTestingKey}
                onClick={() => testApiKey()}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shrink-0"
              >
                {isTestingKey ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#E60023]" />
                ) : (
                  <span>Test API</span>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Directly searches Pinterest (<code>pinterest-scraper.omkar.cloud</code>) for real images, video pins, and aesthetic boards.
            </p>

            {/* Test Status Feedback */}
            {testStatus.tested && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition animate-in fade-in ${
                  testStatus.valid
                    ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-950/40 border-rose-500/30 text-rose-300"
                }`}
              >
                {testStatus.valid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  {testStatus.valid ? (
                    <p className="font-bold">
                      Live Pinterest Search API is online & responding ({testStatus.profilesFound} search results ready).
                    </p>
                  ) : (
                    <>
                      <p className="font-bold">API Test Failed</p>
                      <p className="text-[11px] text-rose-300/80">{testStatus.error}</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Gemini API Key Section */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-rose-400 hover:underline flex items-center gap-1"
              >
                Get Gemini Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="AIzaSy... (Optional - built-in fallback AI is active)"
              value={settings.geminiApiKey || ""}
              onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono text-xs"
            />
            <p className="text-[11px] text-slate-500">
              Powers deep brand intelligence, multimodal vision on user uploads, and Nano Banana Pro prompt crafting.
            </p>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-[#E60023] hover:from-rose-500 hover:to-[#c2001e] rounded-xl transition shadow-lg shadow-rose-600/25 flex items-center gap-2"
            >
              {savedToast ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                "Save Settings"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
