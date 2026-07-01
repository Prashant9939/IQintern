import { MetadataRoute } from "next";

/**
 * Generates the dynamic, standards-compliant robots.txt file for SEO.
 * Automatically served at: https://<domain>/robots.txt
 *
 * Designed to maximize SEO authority for public pages while ensuring search engine crawlers
 * do not index administrative, auth, student portal, API, or checkout routes.
 */
export default function robots(): MetadataRoute.Robots {
  // 1. Determine site URL based on environment configuration, defaulting to the production domain.
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.APP_URL ||
    "https://iqintern.in";

  // 2. Decide if AI bot crawling should be blocked.
  // Set the BLOCK_AI_CRAWLERS env variable to "true" to disallow AI indexers.
  const blockAICrawlers = process.env.BLOCK_AI_CRAWLERS === "true";

  // 3. Define standard rules for search engine bots (User-Agent: *)
  const rules: MetadataRoute.Robots["rules"] = [
    {
      userAgent: "*",
      // Publicly accessible paths that add SEO value
      allow: [
        "/",                  // Homepage
        "/about",             // About Us
        "/contact",           // Contact Us
        "/internships",       // Internship listings
        "/privacy-policy",    // Privacy Policy
        "/terms-and-conditions", // Terms and Conditions
        // Static assets & Next.js cache directory to optimize crawl efficiency
        "/images/",
        "/icons/",
        "/assets/",
        "/fonts/",
        "/_next/static/",
        "/_next/image/",
      ],
      // Private/administrative paths that must NOT be indexed
      disallow: [
        // Administrative routes
        "/admin/",
        // Student dashboard / portal routes
        "/student/",
        // Generic dashboards / user configurations (future-proofing)
        "/dashboard/",
        "/profile/",
        "/settings/",
        // Authentication flows
        "/auth/",
        "/login",
        "/signup",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
        // Financial / checkout flows
        "/payment/",
        "/checkout/",
        "/orders/",
        // API / internal endpoints & webhooks
        "/api/",
        "/webhooks/",
        // Testing and development routes
        "/internal/",
        "/private/",
        "/temp/",
      ],
    },
  ];

  // 4. Optionally append rule blocking AI bots if requested
  if (blockAICrawlers) {
    if (Array.isArray(rules)) {
      rules.push({
        userAgent: ["GPTBot", "CCBot", "ClaudeBot", "Google-Extended"],
        disallow: ["/"],
      });
    }
  }

  return {
    rules,
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

