"use client";

import React, { useState } from "react";
import {
  Search,
  CheckCircle2,
  Plus,
  Sparkles,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Filter,
  Flame,
  Award,
  Zap,
  Play,
  Film,
  Image as ImageIcon,
} from "lucide-react";
import { BrandProfile, PinterestPin } from "@/lib/types";

interface Step3Props {
  brandProfile: BrandProfile;
  pins: PinterestPin[];
  selectedPins: PinterestPin[];
  onTogglePin: (pin: PinterestPin) => void;
  onSearchNewQuery: (query: string) => void;
  onAddCustomPin: (pin: Partial<PinterestPin>) => void;
  onProceedToCreativeStudio: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function Step3PinterestMoodboard({
  brandProfile,
  pins,
  selectedPins,
  onTogglePin,
  onSearchNewQuery,
  onAddCustomPin,
  onProceedToCreativeStudio,
  onBack,
  isLoading,
}: Step3Props) {
  const [searchQuery, setSearchQuery] = useState(
    brandProfile.pinterestStrategy.searchQueries[0] || `${brandProfile.name} aesthetic moodboard`
  );
  const [activeTag, setActiveTag] = useState<string>("All");
  const [customUrl, setCustomUrl] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const selectedIds = new Set(selectedPins.map((p) => p.id));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchNewQuery(searchQuery.trim());
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl) return;
    onAddCustomPin({
      id: `custom-pin-${Date.now()}`,
      title: customTitle || "Custom Pinterest Visual Reference",
      description: "User supplied aesthetic reference",
      imageUrl: customUrl,
      pinUrl: customUrl.startsWith("http") ? customUrl : `https://${customUrl}`,
      board: "User Curated Moodboard",
      aestheticTags: ["Custom Inspo", "User Reference", "Curated Hook"],
      colorScheme: ["#E11D48", "#1E293B", "#FFFFFF"],
      visualComposition: "Custom framing inspiration for prompt generation",
      lightingStyle: "Ambient studio direction",
      adCreativeAngle: "Direct aesthetic reference",
      geminiFitScore: 95,
      geminiFitReason: "Custom user-selected reference perfectly tailored for this campaign.",
    });
    setCustomUrl("");
    setCustomTitle("");
    setShowAddModal(false);
  };

  // Filter pins
  const filteredPins = pins.filter((p) => {
    if (activeTag === "All") return true;
    if (activeTag === "Top Picks") return (p.geminiFitScore || 0) >= 90;
    if (activeTag === "Videos") return p.isVideo || Boolean(p.videoUrl);
    return (
      p.aestheticTags.some((t) => t.toLowerCase().includes(activeTag.toLowerCase())) ||
      p.title.toLowerCase().includes(activeTag.toLowerCase()) ||
      p.board?.toLowerCase().includes(activeTag.toLowerCase())
    );
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E60023]/10 border border-[#E60023]/20 text-[#E60023] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Live Pinterest Search & AI Visual Discovery
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Curate Visual Trends & Aesthetic Pins
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Real live Pinterest images & video pins fetched for <strong className="text-rose-400">{brandProfile.name}</strong>, scored by Gemini AI for target audience resonance (<span className="text-slate-300">{brandProfile.targetAudience.primaryPersona}</span>).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl text-xs font-medium transition flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-rose-400" />
          <span>Add Custom Pin URL</span>
        </button>
      </div>

      {/* Search & Query Bar */}
      <div className="glow-card rounded-2xl p-4 sm:p-5 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-[#E60023]" />
            </div>
            <input
              type="text"
              placeholder="Search live Pinterest pins, aesthetics & boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E60023] text-xs sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-[#E60023] hover:bg-[#c2001e] text-white font-semibold rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5 shrink-0 shadow-lg shadow-red-900/20"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search Pinterest</span>
              </>
            )}
          </button>
        </form>

        {/* AI Suggested Query Chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Gemini Recommendations:
          </span>
          {brandProfile.pinterestStrategy.searchQueries.map((query, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setSearchQuery(query);
                onSearchNewQuery(query);
              }}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-[11px] transition"
            >
              #{query}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Aesthetic Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="text-slate-500 font-medium shrink-0">Filter:</span>
        {["All", "MCP Account", "Top Picks", "Videos", "Minimalist", "3D", "Clean", "Lifestyle", "UGC", "Macro"].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 flex items-center gap-1.5 ${
              activeTag === tag
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {tag === "MCP Account" && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
            {tag === "Top Picks" && <Award className="w-3.5 h-3.5 text-amber-300" />}
            {tag === "Videos" && <Film className="w-3.5 h-3.5 text-rose-300" />}
            <span>{tag}</span>
          </button>
        ))}
      </div>

      {/* Pinterest Pins Grid with Live Image & Video URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPins.map((pin) => {
          const isSelected = selectedIds.has(pin.id);

          return (
            <div
              key={pin.id}
              onClick={() => onTogglePin(pin)}
              className={`group cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between border ${
                isSelected
                  ? "bg-slate-900/90 border-rose-500 shadow-xl shadow-rose-950/40 ring-2 ring-rose-500/20"
                  : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40"
              }`}
            >
              {/* Media Container (Image or Video) */}
              <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-slate-900">
                {pin.videoUrl ? (
                  <video
                    src={pin.videoUrl}
                    poster={pin.imageUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <img
                    src={pin.imageUrl}
                    alt={pin.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                )}

                {/* Top Badge: Selection Toggle */}
                <div className="absolute top-3 right-3 z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-md ${
                      isSelected
                        ? "bg-rose-600 text-white"
                        : "bg-black/60 text-white/70 group-hover:text-white border border-white/20"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${isSelected ? "fill-white text-rose-600" : ""}`}
                    />
                  </div>
                </div>

                {/* Top Left: Gemini Fit Score Badge & Video Indicator */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  {pin.geminiFitScore && (
                    <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-[11px] font-bold text-amber-300 rounded-full border border-amber-500/30 flex items-center gap-1 shadow-md">
                      <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                      {pin.geminiFitScore}% Gemini Fit
                    </span>
                  )}
                  {pin.isVideo && (
                    <span className="px-2 py-0.5 bg-rose-950/80 backdrop-blur-md text-[10px] font-semibold text-rose-300 rounded-full border border-rose-500/30 flex items-center gap-1">
                      <Film className="w-2.5 h-2.5 text-rose-400" /> Video Pin
                    </span>
                  )}
                </div>

                {/* Bottom Overlay: Color Palette Swatches */}
                {pin.colorScheme && pin.colorScheme.length > 0 && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                    {pin.colorScheme.map((hex, i) => (
                      <span
                        key={i}
                        className="w-3 h-3 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                )}

                {/* Bottom Right: Creator Badge / Board info */}
                {pin.authorName && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-slate-200">
                    {pin.authorAvatar ? (
                      <img
                        src={pin.authorAvatar}
                        alt=""
                        className="w-3.5 h-3.5 rounded-full object-cover"
                      />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#E60023] flex items-center justify-center text-[8px] font-bold">
                        P
                      </span>
                    )}
                    <span className="font-medium line-clamp-1 max-w-[120px]">
                      {pin.authorName}
                    </span>
                  </div>
                )}
              </div>

              {/* Pin Details & Gemini Director Rationale */}
              <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-100 line-clamp-2 group-hover:text-rose-400 transition">
                      {pin.title}
                    </h3>
                    <a
                      href={pin.pinUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Gemini Fit Reason */}
                  {pin.geminiFitReason && (
                    <div className="p-2.5 bg-amber-950/20 border border-amber-500/20 rounded-xl text-[11px] text-amber-200/90 leading-relaxed">
                      <span className="font-bold text-amber-400 block mb-0.5">
                        Creative Director Assessment:
                      </span>
                      {pin.geminiFitReason}
                    </div>
                  )}

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {pin.description}
                  </p>
                </div>

                {/* Board & Likes meta */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                  <span className="line-clamp-1 text-slate-400">
                    📌 {pin.board || "Pinterest Board"}
                  </span>
                  {pin.likesOrSaves && (
                    <span className="shrink-0 text-slate-400">{pin.likesOrSaves}</span>
                  )}
                </div>

                {/* Select Button */}
                <button
                  type="button"
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      : "bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Selected for Creative Studio</span>
                    </>
                  ) : (
                    <span>+ Select Visual Seed</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar */}
      <div className="sticky bottom-4 z-30 glow-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-rose-500/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-sm">
            {selectedPins.length}
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              {selectedPins.length} Pinterest Visual {selectedPins.length === 1 ? "Seed" : "Seeds"} Selected
            </p>
            <p className="text-xs text-slate-400">
              {selectedPins.length === 0
                ? "Select at least 1 pin to seed Nano Banana Pro prompt style"
                : "Gemini will fuse these real Pinterest aesthetics with your product DNA"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 text-xs sm:text-sm font-medium transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onProceedToCreativeStudio}
            disabled={selectedPins.length === 0}
            className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
              selectedPins.length === 0
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-lg shadow-rose-600/30"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate Nano Banana Pro Creatives</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Custom Pin Adder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add Custom Pinterest Pin</h3>
            <form onSubmit={handleAddCustom} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Image / Video URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-medium block mb-1">Title / Visual Style Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pastel Skincare Flat Lay"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Add Pin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
