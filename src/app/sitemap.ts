import type { MetadataRoute } from "next";
import { site } from "@/data/contenu";

// Génère /sitemap.xml : le site n'a qu'une page.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: "2026-11-26",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
