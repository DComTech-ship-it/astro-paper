import type { APIRoute } from "astro";
import { generateOgImageForSite } from "@/utils/generateOgImages";

export const GET: APIRoute = async () => {
  const buffer = await generateOgImageForSite();
  return new Response(new Uint8Array(buffer), {
    headers: { 
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=86400"
    },
  });
};
