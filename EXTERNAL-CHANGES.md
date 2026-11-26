# External Changes & Infrastructure Log (For Repo Owner & AI Agents)

This file tracks infrastructure, SEO, and external updates made outside the primary build workflow so the repo owner (`@fender-del`) and any AI coding assistant (e.g. Claude) always stay in sync on future builds/updates.

> Note: This file sits at the repository root (outside `./site/`), so Cloudflare Workers Static Assets (`wrangler.jsonc`) does **not** deploy it publicly.

---

## 2026-11-26 — Google Search Console (GSC) Setup via Cloudflare DNS TXT

- **Editor:** Steve (DMI SEO / Marketing Ops)
- **Requested by:** Ed (tracking setup alongside the 5 new Journal articles)
- **Code files modified in `./site/` or `./worker/`:** **None** (0 code changes — intentionally avoided touching `site/src/shell.html` or `site/index.html` to prevent merge conflicts or overwrites during builds).

### What Was Configured
1. **GSC Domain Property Verified:** `sc-domain:miracledetail.co.uk`
   - Verified under the DMI Agency SEO GSC account (with Full User access granted to DMI Management).
   - **Verification method:** Cloudflare DNS `TXT` record (`@` -> `google-site-verification=...`) added in the DMI Cloudflare account DNS zone for `miracledetail.co.uk` (covers `http/https`, `www`, non-`www`, and subdomains).
2. **Sitemap Submitted:** `https://miracledetail.co.uk/sitemap.xml`
   - Status verified in GSC: **`Success` (25 discovered pages)**.
   - Legacy observation: 3 old pre-rebuild WordPress/Yoast sitemaps (`sitemap_index.xml` from 2016–2017) still appear in GSC history as `Couldn't fetch` (404). Optional future polish: add `/sitemap_index.xml /sitemap.xml 301` in `site/_redirects` if desired.

### Notes for `@fender-del` & AI Agents on Future Updates
- **Safe to rebuild freely:** Because GSC verification lives in **Cloudflare DNS TXT** (not in `<head>`), editing `site/src/shell.html`, running `node build.js`, or publishing Journal posts via the DMI CMS will **never** break GSC verification.
- **Keep DNS TXT record intact:** Do **not** delete the `google-site-verification=...` TXT record in Cloudflare DNS for `miracledetail.co.uk`.
- **Keep `sitemap.xml` auto-updated:** When publishing the 5 new Journal articles (and future posts), ensure `node build.js` includes all new Journal post URLs in `site/sitemap.xml` and keeps `Sitemap: https://miracledetail.co.uk/sitemap.xml` in `site/robots.txt`. GSC will pick up new URLs automatically (and SEO team will run URL Inspection / Request Indexing once live).
- **Future `<head>` tracking (GA4 / GTM):** Currently the live site only has the Cloudflare Web Analytics beacon (no GA4/GTM yet). If GA4 or GTM is added later, it must be injected into the source template `site/src/shell.html` (then rebuilt via `node build.js`) and logged here.
