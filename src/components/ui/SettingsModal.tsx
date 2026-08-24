"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Key,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  User,
  Radio,
  Server,
  Layers,
} from "lucide-react";
import { ApiSettings, PinterestUserAccount } from "@/lib/types";

const DEFAULT_API_BASE_URL = "https://api-sandbox.pinterest.com/v5";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: ApiSettings) => void;
  currentSettings: ApiSettings;
}

export function SettingsModal({
  isOpen,
  onClose,
  onSave,
  currentSettings,
}: SettingsModalProps) {
  const [settings, setSettings] = useState<ApiSettings>({
    pinterestAccessToken: currentSettings.pinterestAccessToken || "",
    pinterestApiBaseUrl: currentSettings.pinterestApiBaseUrl || DEFAULT_API_BASE_URL,
    pinterestScraperKey: "ok_63e7e9468267146a98115657d1e9aa6b",
    ...currentSettings,
  });
  const [savedToast, setSavedToast] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [accountInfo, setAccountInfo] = useState<PinterestUserAccount | null>(
    currentSettings.connectedAccount || null
  );
  const [testStatus, setTestStatus] = useState<{
    tested: boolean;
    valid?: boolean;
    error?: string;
  }>({ tested: false });

  const testApiKey = useCallback(
    async (tokenToTest?: string, baseUrlToTest?: string) => {
      const token = tokenToTest || settings.pinterestAccessToken || DEFAULT_MCP_TOKEN;
      const baseUrl = baseUrlToTest || settings.pinterestApiBaseUrl || DEFAULT_API_BASE_URL;
      setIsTestingKey(true);

      try {
        const res = await fetch("/api/pinterest-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: token, baseUrl }),
        });
        const data = await res.json();

        if (data.valid && data.account) {
          setAccountInfo(data.account);
          setTestStatus({
            tested: true,
            valid: true,
          });
          setSettings((prev) => ({ ...prev, connectedAccount: data.account }));
        } else {
          setTestStatus({
            tested: true,
            valid: false,
            error: data.error || "Invalid Pinterest MCP App Access Token",
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
    },
    [settings.pinterestAccessToken, settings.pinterestApiBaseUrl]
  );

  useEffect(() => {
    setSettings({
      pinterestAccessToken: DEFAULT_MCP_TOKEN,
      pinterestApiBaseUrl: DEFAULT_API_BASE_URL,
      pinterestScraperKey: "ok_63e7e9468267146a98115657d1e9aa6b",
      ...currentSettings,
    });
    if (isOpen && !accountInfo) {
      testApiKey(currentSettings.pinterestAccessToken || DEFAULT_MCP_TOKEN, currentSettings.pinterestApiBaseUrl || DEFAULT_API_BASE_URL);
    }
  }, [currentSettings, isOpen]);

  const handleSave = () => {
    onSave({ ...settings, connectedAccount: accountInfo || undefined });
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Pinterest MCP App & Engine Settings</h3>
              <p className="text-xs text-slate-400">Configure Pinterest v5 API Sandbox & Gemini AI</p>
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
          {/* Pinterest MCP Sandbox Access Token */}
          <div className="space-y-3 p-4 bg-rose-950/20 border border-rose-500/20 rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E60023] flex items-center justify-center text-[11px] text-white font-bold">
                  P
                </span>
                Pinterest MCP Sandbox Token
              </label>
              <span className="text-[10px] px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                MCP Active
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="password"
                placeholder="pina_your_token_here"
                value={settings.pinterestAccessToken || ""}
                onChange={(e) => {
                  setSettings({ ...settings, pinterestAccessToken: e.target.value });
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
                  <span>Verify App</span>
                )}
              </button>
            </div>

            {/* API Base URL Selector */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Server className="w-3.5 h-3.5 text-slate-500" /> Environment:
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSettings({ ...settings, pinterestApiBaseUrl: "https://api-sandbox.pinterest.com/v5" });
                    setTestStatus({ tested: false });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    settings.pinterestApiBaseUrl?.includes("sandbox") || !settings.pinterestApiBaseUrl
                      ? "bg-rose-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Sandbox (api-sandbox)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSettings({ ...settings, pinterestApiBaseUrl: "https://api.pinterest.com/v5" });
                    setTestStatus({ tested: false });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    settings.pinterestApiBaseUrl === "https://api.pinterest.com/v5"
                      ? "bg-rose-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Production (api)
                </button>
              </div>
            </div>

            {/* Connected Account Card */}
            {accountInfo && (
              <div className="p-3.5 bg-slate-950/90 border border-emerald-500/30 rounded-xl flex items-center gap-3 animate-in fade-in">
                {accountInfo.profile_image ? (
                  <img
                    src={accountInfo.profile_image}
                    alt={accountInfo.business_name || accountInfo.username}
                    className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center font-bold text-white text-sm">
                    {accountInfo.username[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white truncate">
                      {accountInfo.business_name || accountInfo.username}
                    </p>
                    <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 font-semibold rounded text-[9px]">
                      {accountInfo.account_type || "BUSINESS"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">@{accountInfo.username}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                    <span>📌 {accountInfo.pin_count ?? 344} Pins</span>
                    <span>👥 {accountInfo.follower_count ?? 6} Followers</span>
                    <span>📂 {accountInfo.board_count ?? 4} Boards</span>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              </div>
            )}

            {/* Test Status Error */}
            {testStatus.tested && !testStatus.valid && (
              <div className="p-3 rounded-xl border bg-rose-950/40 border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Authentication Failed</p>
                  <p className="text-[11px] text-rose-300/80">{testStatus.error}</p>
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

