# Lisa Harris — Premium Las Vegas / Henderson Real Estate Website

Cinematic, SEO-focused solo agent website built as a fully static JAMstack site ready for Netlify deployment.

## Overview

- **Design**: Dark luxury Las Vegas night aesthetic (near-black backgrounds, electric neon blue accent `#00d4ff`, refined serif + clean sans typography)
- **Hero**: Three.js atmospheric particle/neon scene with mouse parallax (respects `prefers-reduced-motion` and low-power devices)
- **IDX**: Exact MLS Matrix iframe on `/search.html` — source URL unmodified
- **SEO**: Keyword-rich pages, proper hierarchy, schema.org RealEstateAgent + Place markup, Open Graph, canonical tags, sitemap, robots.txt
- **Forms**: Netlify Forms on the contact page + Free Home Valuation form on Sell page
- **Performance**: Pure static HTML/CSS/JS, lazy Three.js load, aggressive caching headers via netlify.toml

## Live Structure

```
/
├── index.html              # Homepage with cinematic hero
├── search.html             # Full-page IDX search (exact iframe)
├── about.html
├── sell.html               # Includes Free Home Valuation form
├── contact.html            # Netlify Form
├── thank-you.html
├── neighborhoods/
│   ├── index.html          # Hub
│   ├── summerlin.html
│   ├── green-valley.html
│   ├── anthem.html
│   ├── macdonald-highlands.html
│   └── (extend with remaining neighborhoods)
├── css/styles.css
├── js/hero.js + main.js
├── images/
│   ├── lisa-work-pic.jpg
│   └── fair-housing-realtor-logo.jpg
├── netlify.toml
├── robots.txt
└── sitemap.xml
```

## Deployment (Netlify)

1. Connect this repository in Netlify (New site from Git).
2. Build settings:
   - **Build command**: leave empty
   - **Publish directory**: `.` (root)
3. Enable Netlify Forms (automatic detection of `data-netlify="true"`).
4. Set form notification emails to `Lisah2072@cs.com`.
5. Add custom domain and enable HTTPS.

## Agent Details (already in place)

- **Name**: Lisa Harris
- **Phone**: (702) 523-3336
- **Email**: Lisah2072@cs.com
- **License**: NV S.0059389 (Salesperson)
- **Company**: SimpliHOM Nevada LLC
- **Address**: 170 S. Green Valley Pkwy, Suite 300, Henderson, NV 89012

## Next Steps

- Expand remaining neighborhood pages using the existing templates.
- Add more photography as needed.
- Optional: migrate to Astro later for content collections if desired.
