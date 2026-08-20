"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Key, Sparkles, ShieldCheck, ExternalLink, CheckCircle2, AlertCircle, RefreshCw, FlaskConical, Globe } from "lucide-react";
import { ApiSettings } from "@/lib/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: ApiSettings) => void;
  currentSettings: ApiSettings;
}

export function SettingsModal({ isOpen, onClose, onSave, currentSettings }: SettingsModalProps) {
  const [settings, setSettings] = useState<ApiSettings>({
    useSandbox: true,
    ...currentSettings,
  });
  const [savedToast, setSavedToast] = useState(false);
  const [isTestingPinterest, setIsTestingPinterest] = useState(false);
  const [pinterestStatus, setPinterestStatus] = useState<{
    tested: boolean;
    valid?: boolean;
    isSandbox?: boolean;
    username?: string;
    boardCount?: number;
    pinCount?: number;
    error?: string;
  }>({ tested: false });

  // 1. Declare testPinterestToken BEFORE useEffect
  const testPinterestToken = useCallback(
    async (tokenToTest?: string, useSandboxOverride?: boolean) => {
      const token = tokenToTest || settings.pinterestToken;
      const isSandbox = useSandboxOverride !== undefined ? useSandboxOverride : settings.useSandbox !== false;

      if (!token) {
        setPinterestStatus({
          tested: true,
          valid: false,
          error: "Please enter a Pinterest Access Token to test",
        });
        return;
      }

      setIsTestingPinterest(true);
      try {
        const res = await fetch("/api/pinterest-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, useSandbox: isSandbox }),
        });
        const data = await res.json();

        if (data.valid) {
          setPinterestStatus({
            tested: true,
            valid: true,
            isSandbox: data.isSandbox,
            username: data.user.username,
            boardCount: data.user.boardCount,
            pinCount: data.user.pinCount,
          });
        } else {
          setPinterestStatus({
            tested: true,
            valid: false,
            error: data.error || "Invalid token or insufficient scopes",
          });
        }
      } catch (e: any) {
        setPinterestStatus({
          tested: true,
          valid: false,
          error: e.message || "Failed to reach Pinterest API",
        });
      } finally {
        setIsTestingPinterest(false);
      }
    },
    [settings.pinterestToken, settings.useSandbox]
  );

  // 2. useEffect safely references testPinterestToken
  useEffect(() => {
    setSettings({
      useSandbox: true,
      ...currentSettings,
    });
    if (isOpen && currentSettings.pinterestToken) {
      testPinterestToken(currentSettings.pinterestToken, currentSettings.useSandbox);
    }
  }, [currentSettings, isOpen, testPinterestToken]);

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
              <h3 className="text-lg font-bold text-white">API & Credentials Settings</h3>
              <p className="text-xs text-slate-400">Configure Pinterest Sandbox / Production & Gemini AI</p>
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
          {/* Environment Selector: Sandbox vs Production */}
          <div className="space-y-1.5">
            <label className="text-slate-200 font-semibold text-xs sm:text-sm block">
              Pinterest API Environment
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSettings({ ...settings, useSandbox: true });
                  setPinterestStatus({ tested: false });
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  settings.useSandbox !== false
                    ? "bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Sandbox (api-sandbox)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSettings({ ...settings, useSandbox: false });
                  setPinterestStatus({ tested: false });
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  settings.useSandbox === false
                    ? "bg-rose-500/15 border-rose-500 text-rose-300 shadow-sm"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Production (api)</span>
              </button>
            </div>
          </div>

          {/* Pinterest API Token Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E60023] flex items-center justify-center text-[11px] text-white font-bold">
                  P
                </span>
                Pinterest Access Token {settings.useSandbox !== false ? "(Sandbox)" : "(Production)"}
              </label>
              <a
                href="https://developers.pinterest.com/apps/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-rose-400 hover:underline flex items-center gap-1"
              >
                Pinterest Dev Portal <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex gap-2">
              <input
                type="password"
                placeholder="pina_... (Pinterest Token)"
                value={settings.pinterestToken || ""}
                onChange={(e) => {
                  setSettings({ ...settings, pinterestToken: e.target.value });
                  setPinterestStatus({ tested: false });
                }}
                className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E60023] font-mono text-xs"
              />
              <button
                type="button"
                disabled={isTestingPinterest || !settings.pinterestToken}
                onClick={() => testPinterestToken()}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shrink-0"
              >
                {isTestingPinterest ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#E60023]" />
                ) : (
                  <span>Test Token</span>
                )}
              </button>
            </div>

            {/* Test Status Feedback */}
            {pinterestStatus.tested && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition animate-in fade-in ${
                  pinterestStatus.valid
                    ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-950/40 border-rose-500/30 text-rose-300"
                }`}
              >
                {pinterestStatus.valid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  {pinterestStatus.valid ? (
                    <>
                      <p className="font-bold">
                        Connected to Pinterest {pinterestStatus.isSandbox ? "Sandbox" : "Production"} as @{pinterestStatus.username}
                      </p>
                      <p className="text-[11px] text-emerald-400/80">
                        Found {pinterestStatus.boardCount || 0} Boards & {pinterestStatus.pinCount || 0} Pins. Gemini will automatically analyze these pins for your campaign.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold">Pinterest Connection Failed</p>
                      <p className="text-[11px] text-rose-300/80">{pinterestStatus.error}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Tip: In your Pinterest Developer App, make sure the token is generated with <code>boards:read</code>, <code>pins:read</code>, and <code>user_accounts:read</code> scopes.
                      </p>
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
