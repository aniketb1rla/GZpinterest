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
  Eye,
  SlidersHorizontal,
  Flame,
  Lightbulb,
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
    });
    setCustomUrl("");
    setCustomTitle("");
    setShowAddModal(false);
  };

  // Filter pins based on active tag
  const filteredPins = pins.filter((p) => {
    if (activeTag === "All") return true;
    return (
      p.aestheticTags.some((t) => t.toLowerCase().includes(activeTag.toLowerCase())) ||
      p.title.toLowerCase().includes(activeTag.toLowerCase())
    );
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E60023]/10 border border-[#E60023]/20 text-[#E60023] text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#E60023] animate-ping" />
            Pinterest Visual Mining & Aesthetic Inspiration
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Curate Visual Trends & Aesthetic Pins
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Select high-performing pins that align with <strong className="text-rose-400">{brandProfile.name}</strong>'s target audience. Our AI will extract lighting, composition, and visual hooks directly into your Nano Banana Pro prompts.
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
              placeholder="Search Pinterest aesthetics (e.g. minimalist skincare photography, 3d cyberpunk app mockup)..."
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
                <span>Search Pins</span>
              </>
            )}
          </button>
        </form>

        {/* AI Suggested Query Chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> AI Suggestions:
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
        <span className="text-slate-500 font-medium shrink-0">Aesthetics:</span>
        {["All", "Minimalist", "3D", "Clean", "Lifestyle", "UGC", "Macro", "Editorial"].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
              activeTag === tag
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Pinterest Pins Grid */}
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
              {/* Pin Image Container */}
              <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-slate-900">
                <img
                  src={pin.imageUrl}
                  alt={pin.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

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

                {/* Top Left: Board / Saves */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {pin.likesOrSaves && (
                    <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-[10px] font-semibold text-white rounded-full border border-white/10">
                      {pin.likesOrSaves}
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
              </div>

              {/* Pin Details */}
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

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {pin.description}
                  </p>
                </div>

                {/* Aesthetic Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {pin.aestheticTags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Breakdown Cues for AI Prompting */}
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1.5 text-[11px]">
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <span className="text-amber-400 font-semibold shrink-0">Lighting:</span>
                    <span className="text-slate-400 line-clamp-1">{pin.lightingStyle}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <span className="text-rose-400 font-semibold shrink-0">Angle Hook:</span>
                    <span className="text-slate-400 line-clamp-1">{pin.adCreativeAngle}</span>
                  </div>
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
                      <span>Selected for Creative Prompting</span>
                    </>
                  ) : (
                    <span>+ Add to Inspiration Moodboard</span>
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
              {selectedPins.length} Pinterest Inspiration {selectedPins.length === 1 ? "Pin" : "Pins"} Selected
            </p>
            <p className="text-xs text-slate-400">
              {selectedPins.length === 0
                ? "Select at least 1 pin to seed Nano Banana Pro prompt style"
                : "AI will blend these aesthetics with your product DNA"}
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
                <label className="text-slate-300 font-medium block mb-1">Image URL / Pin Image</label>
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
