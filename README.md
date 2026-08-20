# 🎨 GZpinterest - AI Creative Director

> **Autonomous AI Creative Director** that analyzes any Website or Google Play Store URL, extracts deep target audience & brand DNA, mines trending Pinterest visual aesthetics, and crafts hyper-converting **Nano Banana Pro** ad prompts & copy packs for **Meta & Google Ads**.

---

## 🌟 Key Features

1. **Brand & Play Store Intelligence**:
   - Scrapes website content, OpenGraph tags, and Google Play Store listings.
   - Extracts: Target Audience Persona, Demographics, Psychographics (Pain Points, Desires, Values), Tone of Voice, and Recommended Color Palette.
2. **Pinterest Visual Mining & Moodboard Curation**:
   - Queries Pinterest for aesthetic visual trends matching the target audience.
   - Analyzes lighting style, camera framing, color palettes, and visual hook angles.
   - Allows curating pins and adding custom Pinterest references.
3. **Multi-Modal Asset Analysis**:
   - Accepts uploaded product photos, packaging, and brand logos.
   - Uses Gemini Vision to analyze assets and inject precise placement constraints into image prompts.
4. **Nano Banana Pro Prompt Engine**:
   - Tailored prompts for **Meta Ads** (Feed 1:1, Stories/Reels 9:16) and **Google Ads** (Performance Max Landscape 1.91:1 / 16:9, Responsive Display 1:1).
   - Generates aspect ratio tags (`--ar 1:1`, `--ar 9:16`, `--ar 16:9`), camera/lighting specs, negative prompts, and matching ad copy sets (Headline, Primary Text, CTA).
5. **Creative Director Studio**:
   - Live visual mockup generation preview.
   - 1-click prompt copying and campaign blueprint export (JSON, Markdown, or PDF).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Add your `GEMINI_API_KEY` (or configure it directly inside the app's Settings modal in the browser).

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router) & React 19
- **Styling**: Tailwind CSS & Lucide Icons
- **AI & Vision**: Google Generative AI (Gemini 1.5 / 2.0 / Flash / Pro)
- **Scraper**: Cheerio & HTML Parser
- **Visual Engine**: Nano Banana Pro & FLUX Image Pipeline
