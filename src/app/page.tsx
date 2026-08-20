"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { SettingsModal } from "@/components/ui/SettingsModal";
import { Step1UrlAndAssets } from "@/components/steps/Step1UrlAndAssets";
import { Step2BrandAnalysis } from "@/components/steps/Step2BrandAnalysis";
import { Step3PinterestMoodboard } from "@/components/steps/Step3PinterestMoodboard";
import { Step4CreativeStudio } from "@/components/steps/Step4CreativeStudio";
import { Step5CampaignExport } from "@/components/steps/Step5CampaignExport";
import {
  BrandProfile,
  NanoBananaPrompt,
  PinterestPin,
  UploadedAsset,
  ApiSettings,
} from "@/lib/types";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [url, setUrl] = useState("");
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [campaignGoal, setCampaignGoal] = useState("E-Commerce ROAS & Conversions (Meta Feed & Google Shopping)");

  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [pinterestPins, setPinterestPins] = useState<PinterestPin[]>([]);
  const [selectedPins, setSelectedPins] = useState<PinterestPin[]>([]);
  const [metaAdSets, setMetaAdSets] = useState<NanoBananaPrompt[]>([]);
  const [googleAdSets, setGoogleAdSets] = useState<NanoBananaPrompt[]>([]);

  const [apiSettings, setApiSettings] = useState<ApiSettings>({});
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");

  // Load API settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gz_pinterest_settings");
      if (saved) {
        setApiSettings(JSON.parse(saved));
      }
    } catch (e) {
      console.log("Settings load skipped");
    }
  }, []);

  const handleSaveSettings = (settings: ApiSettings) => {
    setApiSettings(settings);
    try {
      localStorage.setItem("gz_pinterest_settings", JSON.stringify(settings));
    } catch (e) {
      console.log("Settings save skipped");
    }

    // If already on or past Step 2 and has brand profile, refresh Pinterest pins using new token
    if (brandProfile) {
      const pinQuery = brandProfile.pinterestStrategy.searchQueries[0] || brandProfile.name;
      handleSearchPinterestPins(pinQuery, settings.pinterestToken);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    if (step > maxStepReached) {
      setMaxStepReached(step);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 1 -> 2: Analyze URL and uploaded assets
  const handleAnalyzeUrl = async () => {
    if (!url) return;
    setIsLoading(true);
    setLoadingStatus("Scraping URL & Extracting Brand DNA...");

    try {
      // 1. Analyze URL
      const res = await fetch("/api/analyze-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          geminiApiKey: apiSettings.geminiApiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.brandProfile) {
        throw new Error(data.error || "Failed to analyze URL");
      }

      const profile: BrandProfile = data.brandProfile;
      setBrandProfile(profile);

      // 2. Multimodal Vision on Uploaded Assets if any
      if (assets.length > 0) {
        setLoadingStatus("Running Vision Analysis on Uploaded Assets...");
        try {
          const assetRes = await fetch("/api/analyze-assets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              assets,
              geminiApiKey: apiSettings.geminiApiKey,
            }),
          });
          const assetData = await assetRes.json();
          if (assetData.analyzedAssets) {
            setAssets(assetData.analyzedAssets);
          }
        } catch (err) {
          console.warn("Asset vision analysis skipped:", err);
        }
      }

      // 3. Pre-fetch initial Pinterest Pins with Token
      setLoadingStatus("Mining Pinterest Visual Trends & Account Pins...");
      try {
        const pinQuery = profile.pinterestStrategy.searchQueries[0] || profile.name;
        const pinRes = await fetch("/api/pinterest-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: pinQuery,
            categoryHint: profile.industry,
            pinterestToken: apiSettings.pinterestToken,
          }),
        });
        const pinData = await pinRes.json();
        if (pinData.pins && pinData.pins.length > 0) {
          setPinterestPins(pinData.pins);
          // Auto select top 2 pins
          setSelectedPins(pinData.pins.slice(0, 2));
        }
      } catch (err) {
        console.warn("Pinterest initial search skipped:", err);
      }

      goToStep(2);
    } catch (error: any) {
      console.error(error);
      alert(`Analysis error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setLoadingStatus("");
    }
  };

  // Step 3: Search Pinterest Pins
  const handleSearchPinterestPins = async (query: string, overrideToken?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/pinterest-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          categoryHint: brandProfile?.industry,
          pinterestToken: overrideToken !== undefined ? overrideToken : apiSettings.pinterestToken,
        }),
      });
      const data = await res.json();
      if (data.pins) {
        setPinterestPins(data.pins);
      }
    } catch (e) {
      console.error("Pinterest search failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Pin Toggle
  const handleTogglePin = (pin: PinterestPin) => {
    setSelectedPins((prev) => {
      const exists = prev.some((p) => p.id === pin.id);
      if (exists) {
        return prev.filter((p) => p.id !== pin.id);
      } else {
        return [...prev, pin];
      }
    });
  };

  const handleAddCustomPin = (customPin: Partial<PinterestPin>) => {
    const fullPin: PinterestPin = {
      id: customPin.id || `custom-${Date.now()}`,
      title: customPin.title || "Custom Pin",
      description: customPin.description || "Custom aesthetic reference",
      imageUrl: customPin.imageUrl || "",
      pinUrl: customPin.pinUrl || "",
      board: customPin.board || "Custom Board",
      aestheticTags: customPin.aestheticTags || ["Custom"],
      colorScheme: customPin.colorScheme || ["#E11D48", "#FFFFFF"],
      visualComposition: customPin.visualComposition || "Custom framing",
      lightingStyle: customPin.lightingStyle || "Custom lighting",
      adCreativeAngle: customPin.adCreativeAngle || "Direct aesthetic reference",
    };
    setPinterestPins((prev) => [fullPin, ...prev]);
    setSelectedPins((prev) => [fullPin, ...prev]);
  };

  // Step 3 -> 4: Generate Nano Banana Pro Campaign
  const handleGenerateCampaign = async () => {
    if (!brandProfile) return;
    setIsLoading(true);
    setLoadingStatus("Synthesizing Brand DNA & Pinterest Trends into Nano Banana Prompts...");

    try {
      const res = await fetch("/api/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandProfile,
          selectedPins,
          assets,
          campaignGoal,
          geminiApiKey: apiSettings.geminiApiKey,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.metaAdSets) {
        throw new Error(data.error || "Failed to generate ad sets");
      }

      setMetaAdSets(data.metaAdSets);
      setGoogleAdSets(data.googleAdSets);
      goToStep(4);
    } catch (error: any) {
      console.error(error);
      alert(`Generation error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setLoadingStatus("");
    }
  };

  // Reset all
  const handleReset = () => {
    setCurrentStep(1);
    setMaxStepReached(1);
    setUrl("");
    setAssets([]);
    setBrandProfile(null);
    setPinterestPins([]);
    setSelectedPins([]);
    setMetaAdSets([]);
    setGoogleAdSets([]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onReset={handleReset}
        currentStep={currentStep}
        apiSettings={apiSettings}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <StepIndicator
          currentStep={currentStep}
          onSelectStep={goToStep}
          maxStepReached={maxStepReached}
        />

        <div className="mt-8">
          {currentStep === 1 && (
            <Step1UrlAndAssets
              url={url}
              setUrl={setUrl}
              assets={assets}
              setAssets={setAssets}
              campaignGoal={campaignGoal}
              setCampaignGoal={setCampaignGoal}
              onAnalyze={handleAnalyzeUrl}
              isLoading={isLoading}
              loadingStatus={loadingStatus}
            />
          )}

          {currentStep === 2 && brandProfile && (
            <Step2BrandAnalysis
              brandProfile={brandProfile}
              onProceedToPinterest={() => goToStep(3)}
              onBack={() => goToStep(1)}
              isLoading={isLoading}
            />
          )}

          {currentStep === 3 && brandProfile && (
            <Step3PinterestMoodboard
              brandProfile={brandProfile}
              pins={pinterestPins}
              selectedPins={selectedPins}
              onTogglePin={handleTogglePin}
              onSearchNewQuery={handleSearchPinterestPins}
              onAddCustomPin={handleAddCustomPin}
              onProceedToCreativeStudio={handleGenerateCampaign}
              onBack={() => goToStep(2)}
              isLoading={isLoading}
            />
          )}

          {currentStep === 4 && brandProfile && (
            <Step4CreativeStudio
              brandProfile={brandProfile}
              metaAdSets={metaAdSets}
              googleAdSets={googleAdSets}
              selectedPins={selectedPins}
              onRegenerate={handleGenerateCampaign}
              onProceedToExport={() => goToStep(5)}
              onBack={() => goToStep(3)}
              isLoading={isLoading}
            />
          )}

          {currentStep === 5 && brandProfile && (
            <Step5CampaignExport
              brandProfile={brandProfile}
              metaAdSets={metaAdSets}
              googleAdSets={googleAdSets}
              selectedPins={selectedPins}
              assets={assets}
              campaignGoal={campaignGoal}
              onReset={handleReset}
              onBack={() => goToStep(4)}
            />
          )}
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <p>
          GZ Pinterest AI Creative Director • Nano Banana Pro Ad Studio • Engineered for High-Conversion Meta & Google Campaigns
        </p>
      </footer>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        currentSettings={apiSettings}
      />
    </div>
  );
}
