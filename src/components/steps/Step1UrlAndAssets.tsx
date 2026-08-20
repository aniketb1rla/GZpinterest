"use client";

import React, { useState, useRef } from "react";
import {
  Globe,
  Upload,
  Sparkles,
  Trash2,
  Tag,
  ArrowRight,
  Layers,
  Store,
  Smartphone,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { UploadedAsset, AssetType } from "@/lib/types";

interface Step1Props {
  url: string;
  setUrl: (url: string) => void;
  assets: UploadedAsset[];
  setAssets: React.Dispatch<React.SetStateAction<UploadedAsset[]>>;
  campaignGoal: string;
  setCampaignGoal: (goal: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  loadingStatus: string;
}

const PRESETS = [
  {
    name: "Skincare E-Commerce",
    url: "https://www.glossier.com",
    goal: "E-Commerce ROAS & Conversions",
    icon: Flame,
    badge: "E-Commerce",
  },
  {
    name: "Notion Workspace App",
    url: "https://play.google.com/store/apps/details?id=com.notion.notion",
    goal: "App Installs & Trial Signups",
    icon: Smartphone,
    badge: "Play Store",
  },
  {
    name: "Allbirds Sustainable Footwear",
    url: "https://www.allbirds.com",
    goal: "Brand Awareness & D2C Sales",
    icon: Store,
    badge: "D2C Brand",
  },
  {
    name: "Duolingo Language App",
    url: "https://play.google.com/store/apps/details?id=com.duolingo",
    goal: "Viral User Acquisition & Retention",
    icon: Smartphone,
    badge: "Play Store",
  },
];

const CAMPAIGN_GOALS = [
  "E-Commerce ROAS & Conversions (Meta Feed & Google Shopping)",
  "Mobile App Installs & Downloads (Play Store / App Store)",
  "Brand Awareness & High-Stopping-Power Reels/TikTok",
  "Retargeting & High-Intent Google Performance Max",
];

export function Step1UrlAndAssets({
  url,
  setUrl,
  assets,
  setAssets,
  campaignGoal,
  setCampaignGoal,
  onAnalyze,
  isLoading,
  loadingStatus,
}: Step1Props) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newAsset: UploadedAsset = {
          id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: file.name,
          type: file.name.toLowerCase().includes("logo") ? "logo" : "product_image",
          dataUrl,
          mimeType: file.type,
        };
        setAssets((prev) => [...prev, newAsset]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const updateAssetType = (id: string, type: AssetType) => {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, type } : a)));
  };

  const isPlayStoreUrl = /play\.google\.com/i.test(url);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Autonomous Creative Strategy Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          AI Creative Director for{" "}
          <span className="gradient-text">Meta & Google Ads</span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400">
          Enter any website or Google Play Store link. Our AI Director extracts your audience DNA, mines high-converting Pinterest visual trends, and crafts production-ready <strong className="text-amber-400">Nano Banana Pro</strong> prompt blueprints.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="glow-card rounded-3xl p-6 sm:p-8 space-y-7">
        {/* URL Input Section */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            Target Website or Google Play Store URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              {isPlayStoreUrl ? (
                <Smartphone className="w-5 h-5 text-emerald-400" />
              ) : (
                <Globe className="w-5 h-5 text-rose-400" />
              )}
            </div>
            <input
              type="url"
              placeholder="https://yourbrand.com or https://play.google.com/store/apps/details?id=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-12 pr-28 py-3.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-sm font-medium transition"
            />
            {isPlayStoreUrl && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" /> Play Store Detected
              </div>
            )}
          </div>

          {/* Quick Presets */}
          <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-400">
            <span className="text-slate-500 font-medium">Quick Presets:</span>
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setUrl(p.url);
                  setCampaignGoal(p.goal);
                }}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 transition flex items-center gap-1.5"
              >
                <p.icon className="w-3 h-3 text-rose-400" />
                <span>{p.name}</span>
                <span className="text-[10px] px-1 py-0.2 bg-slate-800 text-slate-400 rounded">
                  {p.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Goal Selector */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            Primary Campaign Objective
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {CAMPAIGN_GOALS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => setCampaignGoal(goal)}
                className={`px-4 py-3 rounded-xl text-xs sm:text-sm text-left font-medium transition border flex items-center justify-between ${
                  campaignGoal === goal
                    ? "bg-rose-600/15 border-rose-500 text-rose-300 shadow-sm"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <span>{goal}</span>
                {campaignGoal === goal && (
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Asset Uploader */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="text-sm font-semibold text-slate-200">
                Upload Brand & Product Assets (Optional)
              </label>
              <p className="text-xs text-slate-400">
                Upload product bottles, packaging, logos, or moodboard references for Gemini Vision analysis.
              </p>
            </div>
            {assets.length > 0 && (
              <span className="text-xs text-rose-400 font-semibold px-2 py-0.5 bg-rose-500/10 rounded-full border border-rose-500/20">
                {assets.length} {assets.length === 1 ? "Asset" : "Assets"} Attached
              </span>
            )}
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center gap-2 ${
              dragActive
                ? "border-rose-500 bg-rose-500/10"
                : "border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/70"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
              <Upload className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                Drag and drop product images or logos here, or{" "}
                <span className="text-rose-400 underline">browse files</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Supports PNG, JPG, WEBP, SVG (multiple files allowed)
              </p>
            </div>
          </div>

          {/* Uploaded Asset Previews */}
          {assets.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3 relative group"
                >
                  <img
                    src={asset.dataUrl}
                    alt={asset.name}
                    className="w-14 h-14 rounded-lg object-cover border border-slate-800 bg-slate-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{asset.name}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-slate-500" />
                      <select
                        value={asset.type}
                        onChange={(e) => updateAssetType(asset.id, e.target.value as AssetType)}
                        className="bg-slate-900 border border-slate-700 text-slate-300 text-[11px] rounded px-1.5 py-0.5 focus:outline-none"
                      >
                        <option value="product_image">Product Image</option>
                        <option value="logo">Brand Logo</option>
                        <option value="moodboard">Moodboard Ref</option>
                        <option value="reference">General Ref</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAsset(asset.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Big Action CTA */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Pinterest mining + Nano Banana prompt generation ready</span>
          </div>

          <button
            type="button"
            disabled={!url || isLoading}
            onClick={onAnalyze}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-semibold text-sm transition flex items-center justify-center gap-2.5 shadow-xl ${
              !url || isLoading
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-rose-600/30 hover:scale-[1.02]"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{loadingStatus || "Analyzing Brand DNA..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Launch Creative Intelligence</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
