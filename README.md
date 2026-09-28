# ACD Yard Care and Landscaping — website

Plain HTML, CSS and JavaScript. No frameworks, no build step, no Node.
Open `index.html` in any browser to view it, or in any text editor to change it.

```
index.html   all the page content
style.css    all the colours, fonts and layout
script.js    menu, animations, before/after slider, quote form
assets/      favicon and images
```

## First things to change

1. **Phone number** — it appears in `index.html` (search for `0765800121`) and once
   in the `CONFIG` block at the top of `script.js`.
2. **Photos** — the images in `assets/images/` are placeholder illustrations, not real
   projects. Replace them with ACD's own photos. The easiest way: save your photos with
   the same names (`hero.jpg`, `work-1.jpg` … `work-6.jpg`, `before.jpg`, `after.jpg`,
   `about.jpg`), then update the `.svg` file names to `.jpg` in `index.html`.
   - `hero` — wide landscape photo, at least 1600px across
   - `before` / `after` — the same spot photographed from the same position
   - `work-1` … `work-6` — finished jobs
3. **Text** — anything that needs the owner's input is marked with an
   `EDIT` comment in `index.html`. Nothing on the page claims experience, awards,
   reviews or statistics, so nothing needs to be walked back.
4. **Trading hours** — there's a commented-out block in the contact section. Delete the
   `<!--` and `-->` around it and fill in the real hours.

## Colours and fonts

Everything lives at the top of `style.css` under `:root`. Change `--leaf-700` to change
the main green across every button, heading and link.

## The quote form

The form doesn't need a server. When someone submits it, their details open in WhatsApp
ready to send. If you'd rather receive enquiries by email, follow the note inside
`script.js` (search for "TO EMAIL ENQUIRIES INSTEAD").

## Google Map

The contact section has an address card with a link to Google Maps. To embed a live map
instead, open Google Maps, search the address, choose **Share → Embed a map → Copy HTML**,
and paste it inside the `<div class="map">` block in `index.html`.

## Putting it online

Upload the whole folder to any host (Netlify, Vercel, cPanel, GitHub Pages, Afrihost).
`index.html` must sit at the top level. There is nothing to install or compile.
