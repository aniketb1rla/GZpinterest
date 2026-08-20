import * as cheerio from "cheerio";

export interface ScrapedLinkData {
  url: string;
  isPlayStore: boolean;
  title: string;
  description: string;
  siteName?: string;
  headings: string[];
  mainTextSnippet: string;
  ogImage?: string;
  favicon?: string;
  keywords?: string[];
  playStoreData?: {
    appName: string;
    developer?: string;
    category?: string;
    rating?: string;
    reviewsCount?: string;
    installs?: string;
    description: string;
    screenshots: string[];
    iconUrl?: string;
  };
}

export async function scrapeUrlContent(targetUrl: string): Promise<ScrapedLinkData> {
  let url = targetUrl.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  const isPlayStore = /play\.google\.com\/store\/apps\/details/i.test(url);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    if (isPlayStore) {
      // Parse Google Play Store Page
      const appName =
        $('h1[itemprop="name"]').first().text().trim() ||
        $('h1').first().text().trim() ||
        $('meta[property="og:title"]').attr("content") ||
        "App on Google Play";

      const developer =
        $('div:contains("Contains ads")').parent().find('a').first().text().trim() ||
        $('a[href*="/store/apps/dev"]').first().text().trim() ||
        $('a[href*="/store/apps/developer"]').first().text().trim() ||
        "";

      const description =
        $('[data-g-id="description"]').text().trim() ||
        $('div[itemprop="description"]').text().trim() ||
        $('meta[property="og:description"]').attr("content") ||
        "";

      const rating =
        $('div[itemprop="starRating"]').text().trim() ||
        $('div[aria-label*="stars"]').first().attr("aria-label") ||
        $('div:contains("star")').first().text().trim() ||
        "4.5";

      const category =
        $('a[itemprop="genre"]').text().trim() ||
        $('a[href*="/store/apps/category/"]').first().text().trim() ||
        "Mobile App";

      const iconUrl =
        $('img[alt="Cover art"]').attr("src") ||
        $('meta[property="og:image"]').attr("content") ||
        $('img[itemprop="image"]').attr("src") ||
        "";

      const screenshots: string[] = [];
      $('img[alt="Screenshot Image"], img[data-screenshot-index]').each((_, el) => {
        const src = $(el).attr("src") || $(el).attr("data-src");
        if (src && !screenshots.includes(src)) {
          screenshots.push(src);
        }
      });

      return {
        url,
        isPlayStore: true,
        title: appName,
        description: description.slice(0, 1500),
        siteName: "Google Play Store",
        headings: [appName, category, developer].filter(Boolean),
        mainTextSnippet: description.slice(0, 3000),
        ogImage: iconUrl,
        playStoreData: {
          appName,
          developer,
          category,
          rating,
          description: description.slice(0, 2000),
          screenshots: screenshots.slice(0, 6),
          iconUrl,
        },
      };
    }

    // Standard Website / Landing Page parsing
    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text().trim() ||
      $('meta[name="twitter:title"]').attr("content") ||
      url;

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      "";

    const siteName =
      $('meta[property="og:site_name"]').attr("content") ||
      $('meta[name="application-name"]').attr("content") ||
      new URL(url).hostname.replace("www.", "");

    const ogImage =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";

    const keywordsContent = $('meta[name="keywords"]').attr("content");
    const keywords = keywordsContent
      ? keywordsContent.split(",").map((k) => k.trim()).filter(Boolean)
      : [];

    const headings: string[] = [];
    $("h1, h2, h3").each((_, el) => {
      const text = $(el).text().trim().replace(/\s+/g, " ");
      if (text && text.length < 120 && !headings.includes(text)) {
        headings.push(text);
      }
    });

    // Remove script, style, nav, footer tags to get meaningful text
    $("script, style, noscript, svg, nav, footer, header").remove();
    const bodyText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    return {
      url,
      isPlayStore: false,
      title,
      description,
      siteName,
      headings: headings.slice(0, 15),
      mainTextSnippet: bodyText.slice(0, 3500),
      ogImage,
      keywords,
    };
  } catch (error: any) {
    // Fallback if direct fetch is blocked by CORS/anti-bot
    const parsedDomain = new URL(url).hostname.replace("www.", "");
    return {
      url,
      isPlayStore,
      title: parsedDomain.charAt(0).toUpperCase() + parsedDomain.slice(1),
      description: `Website and product catalog for ${parsedDomain}`,
      siteName: parsedDomain,
      headings: [`Discover ${parsedDomain}`],
      mainTextSnippet: `Brand domain: ${url}. Targeting digital shoppers and users interested in ${parsedDomain}.`,
    };
  }
}
