"use client";

import React from "react";
import { Sparkles, SlidersHorizontal, Layers, Compass, Search } from "lucide-react";
import { ApiSettings } from "@/lib/types";

interface NavbarProps {
  onOpenSettings: () => void;
  onReset: () => void;
  currentStep: number;
  apiSettings?: ApiSettings;
}

export function Navbar({ onOpenSettings, onReset, currentStep, apiSettings }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-amber-500 p-[1.5px] shadow-lg shadow-rose-500/20 group-hover:scale-105 transition duration-200">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-rose-500 animate-pulse-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-rose-400 transition">
                GZ<span className="text-rose-500">Pinterest</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full">
                AI Director
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              Nano Banana Pro Ad Creative Studio
            </p>
          </div>
        </div>

        {/* Center Pill Indicators */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-full text-xs text-slate-300">
          <span className="flex items-center gap-1 text-slate-400">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            URL / PlayStore
          </span>
          <span className="text-slate-600">→</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            Live Pinterest Discovery
          </span>
          <span className="text-slate-600">→</span>
          <span className="flex items-center gap-1 text-rose-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            Nano Banana Prompts
          </span>
        </div>

        {/* Action Controls & Pinterest Search Status */}
        <div className="flex items-center gap-3">
          {/* Pinterest MCP Sandbox Badge */}
          <button
            onClick={onOpenSettings}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 rounded-xl text-xs font-semibold transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="w-4 h-4 rounded-full bg-[#E60023] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              P
            </span>
            <span className="truncate max-w-[160px]">
              {apiSettings?.connectedAccount
                ? `@${apiSettings.connectedAccount.username} (MCP Sandbox)`
                : "@aniketbirla8 (MCP Sandbox)"}
            </span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {currentStep > 1 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-medium rounded-xl transition"
            >
              New Campaign
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
