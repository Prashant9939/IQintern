import { MetadataRoute } from "next";

/**
 * Generates the dynamic sitemap.xml for SEO.
 * Automatically served at: https://<domain>/sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Check for SITE_URL environment variables, falling back to the default production domain
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.APP_URL ||
    "https://iqintern.in";

  const now = new Date().toISOString();

  return [
    // ── Home ──────────────────────────────────────────────────────────────
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },

    // ── Core public pages ─────────────────────────────────────────────────
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/internships`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // ── Legal pages ───────────────────────────────────────────────────────
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
