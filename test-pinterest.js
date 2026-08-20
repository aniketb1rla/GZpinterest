const cheerio = require("cheerio");

async function scrapePinterest(query) {
  const url = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;
  console.log("Fetching:", url);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
      },
    });
    console.log("Status:", res.status);
    if (res.ok) {
      const html = await res.text();
      const $ = cheerio.load(html);
      const pins = [];

      // Check script with id="__PWS_DATA__"
      const pwsScript = $('script[id="__PWS_DATA__"]').html();
      if (pwsScript) {
        try {
          const parsed = JSON.parse(pwsScript);
          const rawPins =
            parsed.props?.initialReduxState?.pins ||
            parsed.props?.initialData?.data?.results ||
            {};
          console.log("Found __PWS_DATA__ pins count:", Object.keys(rawPins).length);
          for (const key of Object.keys(rawPins)) {
            const p = rawPins[key];
            const img = p.images?.["736x"]?.url || p.images?.orig?.url || p.images?.["474x"]?.url;
            if (img) {
              pins.push({
                id: p.id || key,
                title: p.grid_title || p.title || p.description || "Pinterest Pin",
                imageUrl: img,
                board: p.board?.name || "Pinterest Board",
                pinner: p.pinner?.username,
              });
            }
          }
        } catch (e) {
          console.log("Error parsing PWS:", e.message);
        }
      }

      // Also regex for i.pinimg.com links in html
      const regex = /https:\/\/i\.pinimg\.com\/(?:originals|\d+x)\/[a-z0-9\/]+\.(?:jpg|png|webp)/g;
      const matches = html.match(regex) || [];
      console.log("Regex pinimg matches:", matches.length);
      const uniqueImg = Array.from(new Set(matches.map((u) => u.replace(/\/\d+x\//, "/736x/"))));
      console.log("Unique 736x image URLs:", uniqueImg.slice(0, 5));

      return { pins, uniqueImg };
    }
  } catch (err) {
    console.log("Fetch error:", err.message);
  }
  return {};
}

scrapePinterest("skincare aesthetic").then((res) => {
  console.log("Total pins:", res.pins?.length, "Total images:", res.uniqueImg?.length);
});
