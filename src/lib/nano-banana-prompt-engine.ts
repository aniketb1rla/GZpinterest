import { AdPlatform, AdPlacement, NanoBananaPrompt, PromptParameters } from "./types";

export interface PromptFormattingOptions {
  model?: "nano-banana-pro" | "flux-1-pro" | "midjourney-v6" | "sdxl";
  aspectRatio: "1:1" | "9:16" | "16:9" | "4:5" | "1.91:1";
  includeLightingModifiers?: boolean;
  includeCameraModifiers?: boolean;
}

// Master Nano Banana Pro prompt builder
export function formatNanoBananaProPrompt(params: PromptParameters, rawConcept: string): string {
  const parts: string[] = [];

  // 1. Core Subject & Action
  parts.push(params.subject);

  // 2. Setting & Environment
  if (params.setting) {
    parts.push(`set in ${params.setting}`);
  }

  // 3. Art Direction & Style
  if (params.artDirection) {
    parts.push(`art direction: ${params.artDirection}`);
  }

  // 4. Lighting Style & Atmosphere
  if (params.lighting) {
    parts.push(`lighting: ${params.lighting}`);
  }

  // 5. Camera, Lens & Depth of Field
  if (params.cameraAndLens) {
    parts.push(`shot on ${params.cameraAndLens}`);
  }

  // 6. Color Grading & Palette
  if (params.colorGrading) {
    parts.push(`color grading: ${params.colorGrading}`);
  }

  // 7. Composition & Framing
  if (params.composition) {
    parts.push(`composition: ${params.composition}`);
  }

  // 8. Quality Triggers & Render Engine Modifiers for Nano Banana Pro
  const qualityTriggers = [
    "commercial advertising photography",
    "award-winning art direction",
    "8k resolution",
    "hyper-detailed textures",
    "subtle volumetric glow",
    ...(params.qualityBoosters || []),
  ];
  parts.push(qualityTriggers.join(", "));

  // 9. Aspect Ratio Tag
  parts.push(`--ar ${params.aspectRatio}`);

  return parts.filter(Boolean).join(", ");
}

export const DEFAULT_NANO_BANANA_NEGATIVE_PROMPT =
  "low quality, blurry, distorted text, amateur photography, blown out highlights, harsh artificial shadows, deformed hands, extra fingers, watermark, grainy, oversaturated, plastic skin, cheap rendering, bad anatomy, cropped weirdly";

export const PLATFORM_SPECS: Record<
  AdPlacement,
  {
    platform: AdPlatform;
    name: string;
    aspectRatio: "1:1" | "9:16" | "16:9" | "4:5" | "1.91:1";
    description: string;
    conversionFocus: string;
  }
> = {
  meta_feed_1_1: {
    platform: "meta",
    name: "Meta Feed (Instagram & Facebook)",
    aspectRatio: "1:1",
    description: "High-stopping-power square format designed to halt thumb scrolling with bold central focal point.",
    conversionFocus: "Instant visual hook within 0.5s, clean product prominence, space for 20% text rule.",
  },
  meta_story_reels_9_16: {
    platform: "meta",
    name: "Meta Stories & Reels (Instagram, TikTok, FB)",
    aspectRatio: "9:16",
    description: "Full-screen vertical immersion, dynamic lifestyle perspective, UGC-styled or cinematic drama.",
    conversionFocus: "High engagement vertical framing, safe zones for UI buttons, native feel.",
  },
  meta_carousel_1_1: {
    platform: "meta",
    name: "Meta Carousel Slide (Multi-Angle / Feature)",
    aspectRatio: "1:1",
    description: "Seamless storytelling swipeable visual with unified background tone and progressive benefit reveal.",
    conversionFocus: "Curiosity loop leading to swipe and high CTR.",
  },
  google_pmax_landscape: {
    platform: "google",
    name: "Google Performance Max & YouTube Display",
    aspectRatio: "1.91:1",
    description: "Wide cinematic landscape layout optimized for Google Discovery, YouTube banners, and Gmail feeds.",
    conversionFocus: "Clear horizontal visual hierarchy, high contrast product framing.",
  },
  google_display_square: {
    platform: "google",
    name: "Google Responsive Display Square",
    aspectRatio: "1:1",
    description: "Ultra-crisp responsive ad unit that scales down cleanly on mobile and web publisher sidebars.",
    conversionFocus: "High legibility, bold silhouette, instant recognition.",
  },
  google_display_vertical: {
    platform: "google",
    name: "Google Mobile Discovery Vertical",
    aspectRatio: "9:16",
    description: "Mobile-first Google ad format across Google Discover and Shorts feed.",
    conversionFocus: "Mobile user engagement and app download velocity.",
  },
};
