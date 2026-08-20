export interface Demographics {
  ageRange: string;
  gender: string;
  location: string;
  incomeLevel: string;
  education: string;
}

export interface Psychographics {
  interests: string[];
  values: string[];
  lifestyle: string[];
  painPoints: string[];
  desires: string[];
}

export interface TargetAudience {
  primaryPersona: string;
  demographics: Demographics;
  psychographics: Psychographics;
}

export interface ColorDefinition {
  hex: string;
  name: string;
  role: string;
}

export interface BrandIdentity {
  toneOfVoice: string[];
  brandPersonality: string[];
  visualStyle: string[];
  colorPalette: ColorDefinition[];
  keywords: string[];
}

export interface MarketPositioning {
  usps: string[];
  competitorDifferentiator: string;
  coreValueProposition: string;
}

export interface PinterestStrategy {
  searchQueries: string[];
  aestheticKeywords: string[];
  recommendedBoards: string[];
  visualHookAngles: string[];
}

export interface PlayStoreDetails {
  category?: string;
  rating?: string;
  reviewsCount?: string;
  installs?: string;
  developer?: string;
  features?: string[];
  screenshots?: string[];
  iconUrl?: string;
}

export interface BrandProfile {
  url: string;
  isPlayStore: boolean;
  name: string;
  tagline: string;
  description: string;
  industry: string;
  productType: string;
  targetAudience: TargetAudience;
  brandIdentity: BrandIdentity;
  marketPositioning: MarketPositioning;
  pinterestStrategy: PinterestStrategy;
  playStoreDetails?: PlayStoreDetails;
}

export interface PinterestPin {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pinUrl: string;
  board?: string;
  aestheticTags: string[];
  colorScheme: string[];
  visualComposition: string;
  lightingStyle: string;
  adCreativeAngle: string;
  likesOrSaves?: string;
  selected?: boolean;
}

export type AssetType = "product_image" | "logo" | "moodboard" | "reference";

export interface UploadedAsset {
  id: string;
  name: string;
  type: AssetType;
  dataUrl: string;
  mimeType: string;
  analysis?: {
    description: string;
    dominantColors: string[];
    objectType: string;
    keyFeatures: string[];
    suggestedPlacement: string;
  };
}

export type AdPlatform = "meta" | "google";

export type AdPlacement =
  | "meta_feed_1_1"
  | "meta_story_reels_9_16"
  | "meta_carousel_1_1"
  | "google_pmax_landscape"
  | "google_display_square"
  | "google_display_vertical";

export interface PromptParameters {
  subject: string;
  setting: string;
  lighting: string;
  composition: string;
  cameraAndLens: string;
  colorGrading: string;
  artDirection: string;
  aspectRatio: string;
  qualityBoosters: string[];
}

export interface AdCopyPack {
  primaryText: string;
  headline: string;
  description?: string;
  cta: string;
  hookAngle: string;
}

export interface NanoBananaPrompt {
  id: string;
  platform: AdPlatform;
  placement: AdPlacement;
  aspectRatio: "1:1" | "9:16" | "16:9" | "4:5" | "1.91:1";
  adConcept: string;
  visualHook: string;
  targetPersonaTargeted: string;
  prompt: string;
  negativePrompt: string;
  promptParameters: PromptParameters;
  copyPack: AdCopyPack;
  pinterestInspirationReference: {
    pinTitle: string;
    visualElementAdopted: string;
    pinImageUrl?: string;
  };
  productIntegration: string;
  creativeRationale: string;
  mockupImageUrl?: string;
}

export interface CampaignBrief {
  brandProfile: BrandProfile;
  selectedPins: PinterestPin[];
  assets: UploadedAsset[];
  metaAdSets: NanoBananaPrompt[];
  googleAdSets: NanoBananaPrompt[];
  createdAt: string;
}

export interface ApiSettings {
  geminiApiKey?: string;
  pinterestToken?: string;
  nanoBananaEndpoint?: string;
}
