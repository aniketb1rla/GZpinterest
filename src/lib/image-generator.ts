export async function generateAdImageFromPrompt(
  prompt: string,
  aspectRatio: "1:1" | "9:16" | "16:9" | "4:5" | "1.91:1" = "1:1",
  negativePrompt?: string
): Promise<string> {
  // Determine dimensions based on aspect ratio
  let width = 1024;
  let height = 1024;

  if (aspectRatio === "9:16") {
    width = 720;
    height = 1280;
  } else if (aspectRatio === "16:9" || aspectRatio === "1.91:1") {
    width = 1280;
    height = 720;
  } else if (aspectRatio === "4:5") {
    width = 864;
    height = 1080;
  }

  // Strip --ar flags for raw image generators
  const cleanPrompt = prompt.replace(/--ar\s+[0-9:]+/gi, "").trim();

  // We can use the ultra-fast high-quality Pollinations FLUX/SDXL image endpoint
  const encodedPrompt = encodeURIComponent(cleanPrompt.slice(0, 500));
  const seed = Math.floor(Math.random() * 1000000);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

  return imageUrl;
}
