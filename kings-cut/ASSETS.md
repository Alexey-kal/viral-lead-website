# Kings Cut — media files

Compressed images and video live in **`assets/`** (~3 MB total). They are committed to Git so **Vercel** and other clones work without extra steps.

## Re-compress from originals (optional, local only)

If you replace files in `../barber/`:

```bash
npm install
npm run optimize-assets
```

Then commit the updated files in `assets/`.
