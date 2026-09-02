import { MetadataRoute } from "next";
import { URL_SITE } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${URL_SITE}/sitemap.xml`,
  };
}
