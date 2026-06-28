import { MetadataRoute } from "next";

/**
 * Generates the dynamic robots.txt file for SEO.
 * Automatically served at: https://<domain>/robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  // Check for SITE_URL environment variables, falling back to the default production domain
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://iqintern.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
