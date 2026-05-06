// SITE_MODE controls what index.astro renders:
// "coming-soon" → minimal landing, no docs links (production default)
// "live"        → full docs landing with components & features
//
// Set via Vercel environment variable SITE_MODE.
// Production env: SITE_MODE=coming-soon
// Preview env:    SITE_MODE=live (to review full site before launch)

export const SITE_MODE = (import.meta.env.SITE_MODE ?? "coming-soon") as "coming-soon" | "live";
