"use client";

import React from "react";
import { Link2, Target, Image as ImageIcon, Wand2, Download, Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  maxStepReached: number;
}

const STEPS = [
  { step: 1, title: "URL & Assets", icon: Link2, subtitle: "Link & Uploads" },
  { step: 2, title: "Brand DNA", icon: Target, subtitle: "Audience & Tone" },
  { step: 3, title: "Pinterest Pins", icon: ImageIcon, subtitle: "Visual Moodboard" },
  { step: 4, title: "Creative Studio", icon: Wand2, subtitle: "Nano Banana Prompts" },
  { step: 5, title: "Export Hub", icon: Download, subtitle: "Campaign Brief" },
];

export function StepIndicator({ currentStep, onSelectStep, maxStepReached }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-5xl mx-auto my-6 px-4">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-800 -z-0" />

        {/* Progress highlight line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400 transition-all duration-500 -z-0"
          style={{
            width: `${((Math.min(currentStep, STEPS.length) - 1) / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {STEPS.map((s) => {
          const Icon = s.icon;
          const isCompleted = currentStep > s.step;
          const isActive = currentStep === s.step;
          const isClickable = s.step <= maxStepReached;

          return (
            <button
              key={s.step}
              onClick={() => isClickable && onSelectStep(s.step)}
              disabled={!isClickable}
              className={`relative z-10 flex flex-col items-center group transition focus:outline-none ${
                !isClickable ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 font-semibold text-xs ${
                  isActive
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/40 ring-4 ring-rose-500/20 scale-110"
                    : isCompleted
                    ? "bg-rose-950 border border-rose-500/50 text-rose-300"
                    : "bg-slate-900 border border-slate-700 text-slate-400"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 text-rose-400 stroke-[3]" /> : <Icon className="w-4 h-4" />}
              </div>

              <div className="mt-2 text-center hidden sm:block">
                <span
                  className={`text-xs font-semibold block transition ${
                    isActive ? "text-rose-400" : isCompleted ? "text-slate-200" : "text-slate-500"
                  }`}
                >
                  {s.title}
                </span>
                <span className="text-[10px] text-slate-500 block">{s.subtitle}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
