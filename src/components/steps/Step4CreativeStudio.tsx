"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Wand2,
  Image as ImageIcon,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Eye,
  Sliders,
  Layers,
  Flame,
  CheckCircle2,
  Download,
  Maximize2,
  HelpCircle,
} from "lucide-react";
import { BrandProfile, NanoBananaPrompt, PinterestPin } from "@/lib/types";

interface Step4Props {
  brandProfile: BrandProfile;
  metaAdSets: NanoBananaPrompt[];
  googleAdSets: NanoBananaPrompt[];
  selectedPins: PinterestPin[];
  onRegenerate: () => void;
  onProceedToExport: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function Step4CreativeStudio({
  brandProfile,
  metaAdSets,
  googleAdSets,
  selectedPins,
  onRegenerate,
  onProceedToExport,
  onBack,
  isLoading,
}: Step4Props) {
  const [activePlatform, setActivePlatform] = useState<"all" | "meta" | "google">("all");
  const [activeRatio, setActiveRatio] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatingMockupId, setGeneratingMockupId] = useState<string | null>(null);
  const [mockupImages, setMockupImages] = useState<Record<string, string>>({});
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  const allPrompts = [...metaAdSets, ...googleAdSets];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateMockup = async (item: NanoBananaPrompt) => {
    try {
      setGeneratingMockupId(item.id);
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: item.prompt,
          aspectRatio: item.aspectRatio,
          negativePrompt: item.negativePrompt,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setMockupImages((prev) => ({ ...prev, [item.id]: data.imageUrl }));
      }
    } catch (e) {
      console.error("Failed to generate mockup:", e);
    } finally {
      setGeneratingMockupId(null);
    }
  };

  const filteredPrompts = allPrompts.filter((p) => {
    if (activePlatform !== "all" && p.platform !== activePlatform) return false;
    if (activeRatio !== "all" && p.aspectRatio !== activeRatio) return false;
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Wand2 className="w-3.5 h-3.5" />
            AI Creative Director Studio
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Nano Banana Pro Ad Creative Prompts
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Synthesized from <strong className="text-rose-400">{brandProfile.name}</strong>'s audience profile and {selectedPins.length} Pinterest visual moodboard inspirations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isLoading}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl text-xs font-medium transition flex items-center gap-2"
          >
            <RotateCw className={`w-3.5 h-3.5 text-rose-400 ${isLoading ? "animate-spin" : ""}`} />
            <span>Regenerate Variations</span>
          </button>

          <button
            type="button"
            onClick={onProceedToExport}
            className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-rose-600/30"
          >
            <span>Export Campaign Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Platform and Ratio Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 glow-card rounded-2xl">
        {/* Platform Tabs */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Platform:</span>
          <button
            type="button"
            onClick={() => setActivePlatform("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activePlatform === "all"
                ? "bg-slate-800 text-white border border-slate-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Creatives ({allPrompts.length})
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform("meta")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activePlatform === "meta"
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Meta Ads ({metaAdSets.length})
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform("google")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activePlatform === "google"
                ? "bg-gradient-to-r from-amber-500 to-emerald-500 text-white shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Google Ads ({googleAdSets.length})
          </button>
        </div>

        {/* Aspect Ratio Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Format:</span>
          {["all", "1:1", "9:16", "16:9", "1.91:1"].map((ratio) => (
            <button
              key={ratio}
              type="button"
              onClick={() => setActiveRatio(ratio)}
              className={`px-2.5 py-1 rounded-lg transition font-mono ${
                activeRatio === ratio
                  ? "bg-rose-600 text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {ratio === "all" ? "All" : ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredPrompts.map((item) => {
          const isMeta = item.platform === "meta";
          const currentMockup = mockupImages[item.id] || item.mockupImageUrl;
          const isGeneratingThis = generatingMockupId === item.id;

          return (
            <div
              key={item.id}
              className="glow-card rounded-3xl p-6 space-y-6 flex flex-col justify-between border border-slate-800 hover:border-slate-700 transition relative overflow-hidden"
            >
              {/* Card Header: Platform Badge + Aspect Ratio */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        isMeta
                          ? "bg-blue-500/10 border border-blue-500/30 text-blue-400"
                          : "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isMeta ? "bg-blue-400" : "bg-amber-400"
                        }`}
                      />
                      {isMeta ? "Meta Ads (IG / FB)" : "Google Ads (PMax / Display)"}
                    </span>

                    <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-700 text-slate-300 rounded-lg text-xs font-mono font-semibold">
                      --ar {item.aspectRatio}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.placement.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    {item.adConcept}
                  </h3>
                  <p className="text-xs text-rose-400 font-medium mt-1">
                    🎯 Hook: {item.visualHook}
                  </p>
                </div>
              </div>

              {/* Nano Banana Pro Master Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <span className="text-amber-400">🍌</span>
                    Nano Banana Pro Prompt:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.prompt, `${item.id}-prompt`)}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white rounded-lg text-[11px] font-medium transition flex items-center gap-1.5"
                  >
                    {copiedId === `${item.id}-prompt` ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200 leading-relaxed max-h-48 overflow-y-auto select-all">
                  {item.prompt}
                </div>
              </div>

              {/* Negative Prompt Collapsible / Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">Negative Prompt:</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.negativePrompt, `${item.id}-neg`)}
                    className="text-[11px] text-slate-500 hover:text-slate-300 transition flex items-center gap-1"
                  >
                    {copiedId === `${item.id}-neg` ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-[11px] font-mono text-slate-400 truncate">
                  {item.negativePrompt}
                </div>
              </div>

              {/* Ad Copy Pack Preview */}
              <div className="p-4 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800/90 rounded-2xl space-y-2.5 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Recommended Ad Copy Set
                </span>
                <div>
                  <span className="text-slate-500 font-medium">Headline:</span>
                  <p className="text-white font-bold text-sm mt-0.5">{item.copyPack.headline}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Primary Text:</span>
                  <p className="text-slate-300 mt-0.5">{item.copyPack.primaryText}</p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-[11px] text-slate-400">Call to Action:</span>
                  <span className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold text-xs shadow-sm">
                    {item.copyPack.cta}
                  </span>
                </div>
              </div>

              {/* Pinterest Inspiration Tie-in */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#E60023] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E60023]" />
                  Pinterest Inspo Tie-In
                </span>
                <p className="text-slate-300 font-medium">
                  {item.pinterestInspirationReference.pinTitle}
                </p>
                <p className="text-[11px] text-slate-400">
                  Element Adopted: {item.pinterestInspirationReference.visualElementAdopted}
                </p>
              </div>

              {/* Live Mockup Image Rendering Box */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                {currentMockup ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 group">
                    <img
                      src={currentMockup}
                      alt={item.adConcept}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 backdrop-blur-xs">
                      <button
                        type="button"
                        onClick={() => setPreviewModalImage(currentMockup)}
                        className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-md transition"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                      <a
                        href={currentMockup}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-md transition"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isGeneratingThis}
                    onClick={() => handleGenerateMockup(item)}
                    className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
                  >
                    {isGeneratingThis ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Rendering FLUX / Banana Visual...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
                        <span>{currentMockup ? "Re-render Mockup Visual" : "Generate Live Visual Mockup"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Conversion Rationale Footer */}
              <div className="pt-2 text-[11px] text-slate-400 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-300">Why this converts:</strong> {item.creativeRationale}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 text-sm font-medium transition flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pinterest Moodboard</span>
        </button>

        <button
          type="button"
          onClick={onProceedToExport}
          className="px-7 py-3 rounded-2xl font-semibold text-sm bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-lg shadow-rose-600/30 transition flex items-center gap-2"
        >
          <span>Complete Campaign & Export Blueprint</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Fullscreen Image Preview Modal */}
      {previewModalImage && (
        <div
          onClick={() => setPreviewModalImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-white/20">
            <img
              src={previewModalImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
