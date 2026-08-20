"use client";

import React, { useState } from "react";
import {
  Users,
  Palette,
  Target,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Flame,
  Check,
  Compass,
  Copy,
  Layers,
  Smartphone,
  Globe,
  Star,
  Award,
} from "lucide-react";
import { BrandProfile } from "@/lib/types";

interface Step2Props {
  brandProfile: BrandProfile;
  onProceedToPinterest: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function Step2BrandAnalysis({
  brandProfile,
  onProceedToPinterest,
  onBack,
  isLoading,
}: Step2Props) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const { targetAudience, brandIdentity, marketPositioning, pinterestStrategy } = brandProfile;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glow-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Brand & Audience DNA Extracted
              </span>
              {brandProfile.isPlayStore ? (
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" /> Google Play App
                </span>
              ) : (
                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Web Product
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              {brandProfile.name}
            </h1>
            <p className="text-rose-400 font-medium text-sm sm:text-base">
              "{brandProfile.tagline}"
            </p>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              {brandProfile.description}
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs space-y-1.5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Industry:</span>
                <span className="font-semibold text-slate-200">{brandProfile.industry}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Product Type:</span>
                <span className="font-semibold text-rose-400">{brandProfile.productType}</span>
              </div>
              {brandProfile.playStoreDetails?.rating && (
                <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800">
                  <span className="text-slate-400">App Rating:</span>
                  <span className="font-semibold text-amber-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {brandProfile.playStoreDetails.rating}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Audience Persona & Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Persona Card */}
        <div className="lg:col-span-1 glow-card rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
            <Users className="w-4 h-4" />
            <span>Target Persona Archetype</span>
          </div>

          <div className="p-4 bg-gradient-to-br from-rose-950/40 via-slate-950 to-slate-950 border border-rose-500/20 rounded-2xl space-y-2">
            <span className="text-xs uppercase tracking-wider text-rose-400 font-bold">
              Primary Persona
            </span>
            <h3 className="text-lg font-bold text-white">
              {targetAudience.primaryPersona}
            </h3>
          </div>

          {/* Demographics Breakdown */}
          <div className="space-y-2.5 text-xs">
            <h4 className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
              Demographics
            </h4>
            <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <div className="flex justify-between">
                <span className="text-slate-400">Age Bracket:</span>
                <span className="text-slate-200 font-medium">{targetAudience.demographics.ageRange}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gender Skew:</span>
                <span className="text-slate-200 font-medium">{targetAudience.demographics.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-slate-200 font-medium">{targetAudience.demographics.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Income Level:</span>
                <span className="text-slate-200 font-medium">{targetAudience.demographics.incomeLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Education:</span>
                <span className="text-slate-200 font-medium">{targetAudience.demographics.education}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Psychographics & Pain Points */}
        <div className="lg:col-span-2 glow-card rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Psychographics & Conversion Triggers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Pain Points */}
            <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-2xl space-y-2.5">
              <h4 className="font-semibold text-rose-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4" /> Core Pain Points
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                {targetAudience.psychographics.painPoints.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desires */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl space-y-2.5">
              <h4 className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Aspirational Desires
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                {targetAudience.psychographics.desires.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interests */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <h4 className="font-semibold text-slate-300">Audience Interests</h4>
              <div className="flex flex-wrap gap-1.5">
                {targetAudience.psychographics.interests.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-slate-900 border border-slate-700/80 text-slate-300 rounded-md text-[11px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Values */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
              <h4 className="font-semibold text-slate-300">Core Values</h4>
              <div className="flex flex-wrap gap-1.5">
                {targetAudience.psychographics.values.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-slate-900 border border-slate-700/80 text-slate-300 rounded-md text-[11px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Identity & Visual Aesthetic Palette */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand Personality & Tone */}
        <div className="glow-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
            <Palette className="w-4 h-4" />
            <span>Tone of Voice & Brand Personality</span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-400 font-medium block mb-1.5">
                Tone of Voice:
              </span>
              <div className="flex flex-wrap gap-2">
                {brandIdentity.toneOfVoice.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block mb-1.5">
                Visual Art Style Direction:
              </span>
              <div className="flex flex-wrap gap-2">
                {brandIdentity.visualStyle.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="glow-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Palette className="w-4 h-4" />
              <span>Recommended Ad Color Palette</span>
            </div>
            <span className="text-[11px] text-slate-500">Click to copy hex</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {brandIdentity.colorPalette.map((col, i) => (
              <div
                key={i}
                onClick={() => copyColor(col.hex)}
                className="group cursor-pointer p-3 bg-slate-950 border border-slate-800 hover:border-rose-500/50 rounded-2xl transition text-center space-y-2"
              >
                <div
                  className="w-full h-12 rounded-xl shadow-inner border border-white/10 group-hover:scale-105 transition"
                  style={{ backgroundColor: col.hex }}
                />
                <div>
                  <span className="text-xs font-semibold text-slate-200 block truncate">
                    {col.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-1">
                    {copiedHex === col.hex ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
                    )}
                    {col.hex}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                    {col.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Positioning & Pinterest Mining Strategy */}
      <div className="glow-card rounded-3xl p-6 space-y-5">
        <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
          <Compass className="w-4 h-4 text-[#E60023]" />
          <span>AI Pinterest Visual Trend Strategy</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
            <span className="font-semibold text-slate-300 block">Generated Pinterest Queries</span>
            <ul className="space-y-1 text-slate-400">
              {pinterestStrategy.searchQueries.map((q, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-rose-500">#</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
            <span className="font-semibold text-slate-300 block">Aesthetic Visual Angles</span>
            <ul className="space-y-1 text-slate-400">
              {pinterestStrategy.visualHookAngles.map((a, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">→</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
            <span className="font-semibold text-slate-300 block">Core Value Proposition</span>
            <p className="text-rose-300 font-medium">
              "{marketPositioning.coreValueProposition}"
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Differentiator: {marketPositioning.competitorDifferentiator}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 text-sm font-medium transition flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to URL & Assets</span>
        </button>

        <button
          type="button"
          onClick={onProceedToPinterest}
          className="px-7 py-3 rounded-2xl font-semibold text-sm bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-lg shadow-rose-600/30 transition flex items-center gap-2"
        >
          <span>Explore Pinterest Inspiration Pins</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
