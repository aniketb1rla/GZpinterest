"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import {
  Download,
  Copy,
  Check,
  FileText,
  Sparkles,
  Share2,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Layers,
  Flame,
  Globe,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { BrandProfile, NanoBananaPrompt, PinterestPin, UploadedAsset } from "@/lib/types";

interface Step5Props {
  brandProfile: BrandProfile;
  metaAdSets: NanoBananaPrompt[];
  googleAdSets: NanoBananaPrompt[];
  selectedPins: PinterestPin[];
  assets: UploadedAsset[];
  campaignGoal: string;
  onReset: () => void;
  onBack: () => void;
}

export function Step5CampaignExport({
  brandProfile,
  metaAdSets,
  googleAdSets,
  selectedPins,
  assets,
  campaignGoal,
  onReset,
  onBack,
}: Step5Props) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  useEffect(() => {
    // Trigger celebratory confetti on completion
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f43f5e", "#fb7185", "#facc15", "#0081FB", "#4285F4"],
      });
    } catch (e) {
      console.log("Confetti trigger skipped");
    }
  }, []);

  const allPrompts = [...metaAdSets, ...googleAdSets];

  // 1. Export as JSON
  const handleDownloadJson = () => {
    const campaignData = {
      campaignTitle: `${brandProfile.name} - AI Creative Director Ad Blueprint`,
      generatedAt: new Date().toISOString(),
      campaignGoal,
      brandProfile,
      pinterestInspirationPins: selectedPins,
      uploadedAssets: assets.map((a) => ({ name: a.name, type: a.type, analysis: a.analysis })),
      adSets: {
        meta: metaAdSets,
        google: googleAdSets,
      },
    };

    const blob = new Blob([JSON.stringify(campaignData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brandProfile.name.toLowerCase().replace(/\s+/g, "-")}-ad-campaign-blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 2. Export as Markdown Document
  const handleDownloadMarkdown = () => {
    let md = `# 🚀 AI Creative Director Campaign Blueprint: ${brandProfile.name}\n\n`;
    md += `**Campaign Objective**: ${campaignGoal}\n`;
    md += `**Generated Date**: ${new Date().toLocaleDateString()}\n`;
    md += `**Target URL**: ${brandProfile.url}\n\n`;

    md += `## 🎯 1. Target Audience & Brand Intelligence\n`;
    md += `- **Primary Persona**: ${brandProfile.targetAudience.primaryPersona}\n`;
    md += `- **Demographics**: ${brandProfile.targetAudience.demographics.ageRange}, ${brandProfile.targetAudience.demographics.gender}, ${brandProfile.targetAudience.demographics.location}\n`;
    md += `- **Tone of Voice**: ${brandProfile.brandIdentity.toneOfVoice.join(", ")}\n`;
    md += `- **Core Value Proposition**: ${brandProfile.marketPositioning.coreValueProposition}\n\n`;

    md += `## 📌 2. Pinterest Visual Inspirations Used\n`;
    selectedPins.forEach((p, i) => {
      md += `${i + 1}. **${p.title}** - *${p.adCreativeAngle}*\n   - Lighting: ${p.lightingStyle}\n   - Board: ${p.board || "Aesthetic Inspiration"}\n`;
    });
    md += `\n`;

    md += `## 🍌 3. Nano Banana Pro Prompts & Ad Sets\n\n`;
    allPrompts.forEach((ad, i) => {
      md += `### Ad Set ${i + 1}: ${ad.adConcept} (${ad.platform.toUpperCase()} - ${ad.aspectRatio})\n`;
      md += `- **Placement**: ${ad.placement}\n`;
      md += `- **Visual Hook**: ${ad.visualHook}\n\n`;
      md += `\`\`\`text\n${ad.prompt}\n\`\`\`\n\n`;
      md += `**Negative Prompt**:\n\`\`\`text\n${ad.negativePrompt}\n\`\`\`\n\n`;
      md += `**Ad Copy Pack**:\n`;
      md += `- **Headline**: ${ad.copyPack.headline}\n`;
      md += `- **Primary Text**: ${ad.copyPack.primaryText}\n`;
      md += `- **CTA**: ${ad.copyPack.cta}\n\n`;
      md += `**Why This Converts**: ${ad.creativeRationale}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brandProfile.name.toLowerCase().replace(/\s+/g, "-")}-campaign-brief.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 3. Copy All Nano Banana Prompts
  const handleCopyAllPrompts = () => {
    const formatted = allPrompts
      .map(
        (ad, i) =>
          `// --- Ad ${i + 1}: ${ad.platform.toUpperCase()} (${ad.aspectRatio}) - ${ad.adConcept} ---\n${ad.prompt}\n\n// Negative:\n${ad.negativePrompt}`
      )
      .join("\n\n====================\n\n");

    navigator.clipboard.writeText(formatted);
    setCopiedType("prompts");
    setTimeout(() => setCopiedType(null), 2000);
  };

  // 4. Copy All Ad Copies
  const handleCopyAllCopies = () => {
    const formatted = allPrompts
      .map(
        (ad, i) =>
          `[${ad.platform.toUpperCase()} - ${ad.adConcept}]\nHeadline: ${ad.copyPack.headline}\nPrimary Text: ${ad.copyPack.primaryText}\nCTA: ${ad.copyPack.cta}`
      )
      .join("\n\n---\n\n");

    navigator.clipboard.writeText(formatted);
    setCopiedType("copies");
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" />
          Campaign Blueprint Ready For Deployment
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Campaign Master Export Hub
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400">
          Your complete AI Creative Director campaign package for <strong className="text-rose-400">{brandProfile.name}</strong> is generated and ready to run on Meta & Google Ads.
        </p>
      </div>

      {/* Campaign Summary Card */}
      <div className="glow-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase tracking-wider text-rose-400 font-bold">
              Campaign Snapshot
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">{brandProfile.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{campaignGoal}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-slate-200">
              4 Ad Creatives
            </span>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs font-medium text-blue-400">
              2 Meta Sets
            </span>
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-medium text-amber-400">
              2 Google Sets
            </span>
            <span className="px-3 py-1 bg-[#E60023]/10 border border-[#E60023]/20 rounded-xl text-xs font-medium text-[#E60023]">
              {selectedPins.length} Pinterest Seeds
            </span>
          </div>
        </div>

        {/* Quick Action Export Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="p-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl transition flex flex-col items-start gap-2 text-left group"
          >
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-105 transition">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white group-hover:text-rose-400 transition">
                Download Markdown
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Formatted campaign brief (.md)
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="p-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition flex flex-col items-start gap-2 text-left group"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-105 transition">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white group-hover:text-amber-400 transition">
                Download JSON Pack
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Full structured data (.json)
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={handleCopyAllPrompts}
            className="p-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition flex flex-col items-start gap-2 text-left group"
          >
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-105 transition">
              {copiedType === "prompts" ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                {copiedType === "prompts" ? "Copied All Prompts!" : "Copy All Prompts"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Banana / FLUX prompts with --ar
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={handleCopyAllCopies}
            className="p-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition flex flex-col items-start gap-2 text-left group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition">
              {copiedType === "copies" ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                {copiedType === "copies" ? "Copied All Ad Copy!" : "Copy All Ad Copy"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Headlines, primary text & CTAs
              </p>
            </div>
          </button>
        </div>

        {/* Campaign Ad Set List Overview */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-slate-200">Generated Ad Campaign Deliverables</h3>

          <div className="space-y-3">
            {allPrompts.map((ad, idx) => (
              <div
                key={ad.id}
                className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-white">{ad.adConcept}</h4>
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] text-slate-400 rounded">
                      {ad.platform.toUpperCase()} • --ar {ad.aspectRatio}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 pl-8">
                    Headline: <span className="text-slate-200 font-medium">"{ad.copyPack.headline}"</span> | CTA: <span className="text-rose-400 font-semibold">{ad.copyPack.cta}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(ad.prompt);
                    setCopiedType(`single-${ad.id}`);
                    setTimeout(() => setCopiedType(null), 1500);
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs rounded-xl transition flex items-center gap-1.5 self-start sm:self-center"
                >
                  {copiedType === `single-${ad.id}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
            ))}
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
          <span>Back to Creative Studio</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-rose-600 hover:bg-rose-500 text-white transition flex items-center gap-2 shadow-lg shadow-rose-600/25"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start New Brand Campaign</span>
        </button>
      </div>
    </div>
  );
}
