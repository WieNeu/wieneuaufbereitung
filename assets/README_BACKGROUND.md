# Background image for the site

This repository will use a custom background image for the hero / page background.
I couldn't access the uploaded binary image from the chat to create the image files automatically, so please add the image files below to the `assets/` directory in the repository.

Required files (please upload):
- `assets/background.jpg`  — high-quality JPEG/PNG used by the CSS (desktop)
- `assets/background.webp` — WebP version for smaller size and better performance (recommended)
- Optional: `assets/background-small.webp` — smaller mobile variant (<=1200px width)

How to create a WebP copy locally (example using cwebp):

```bash
# install webp tools (macOS: brew install webp)
# convert and set quality (80 is a good starting point)
cwebp -q 80 assets/background.jpg -o assets/background.webp
# create a smaller mobile variant (resize to 1000px width)
ffmpeg -i assets/background.jpg -vf scale=1000:-1 -qscale:v 2 assets/background-small.jpg
cwebp -q 80 assets/background-small.jpg -o assets/background-small.webp
```

After you upload `assets/background.jpg` and `assets/background.webp`, the new `css/styles.css` (committed in this change) will automatically use `/assets/background.jpg` as the hero background. To enable the mobile file, uncomment or add the following media query to `css/styles.css`:

```css
@media (max-width: 768px) {
  .hero::before {
    background-image: linear-gradient(90deg, rgba(251,249,247,0.95) 0%, rgba(251,249,247,0.65) 45%, rgba(255,255,255,0.0) 80%), url('/assets/background-small.webp');
    background-position: center center;
  }
}
```

If you'd like, you can paste a public URL to your image here and I will fetch it and add `background.jpg` and `background.webp` for you, then update the repo again.
