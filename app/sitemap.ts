import { MetadataRoute } from "next";
import { produits } from "@/lib/produits";
import { URL_SITE } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const pagesStatiques: MetadataRoute.Sitemap = [
    { url: URL_SITE, changeFrequency: "weekly", priority: 1 },
    { url: `${URL_SITE}/notre-histoire`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${URL_SITE}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${URL_SITE}/reglementation`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const pagesProduits: MetadataRoute.Sitemap = produits.map((p) => ({
    url: `${URL_SITE}/produits/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...pagesStatiques, ...pagesProduits];
}
