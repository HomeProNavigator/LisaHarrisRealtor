# Images

The agent headshot and Fair Housing + REALTOR logo are currently at the repository root:

- `Lisa Work Pic.jpg`
- `Fair housing and Realtor Logo.jpg`

The site HTML currently references them as `/images/lisa-work-pic.jpg` and `/images/fair-housing-realtor-logo.jpg`.

**Quick fix options:**
1. Rename/move the two root images into this `images/` folder with the clean filenames, **or**
2. Update the `src` attributes in the HTML to point to the root filenames.

Either works. Netlify will serve them correctly once the paths match.
