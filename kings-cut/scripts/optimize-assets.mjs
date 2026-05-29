/**
 * Compress barber media into kings-cut/assets (same filenames, smaller files).
 * Run: npm run optimize-assets
 */
import { spawnSync } from 'child_process';
import { existsSync, renameSync, unlinkSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const barberDir = join(root, '..', 'barber');
const assetsDir = join(root, 'assets');

const images = [
  'barber-shave.jpg',
  'barber-pole.jpg',
  'barber-shop.jpg',
  'barber-tools.jpg',
];

function sourcePath(name) {
  const barber = join(barberDir, name);
  const local = join(assetsDir, name);
  if (existsSync(barber)) return barber;
  if (existsSync(local)) return local;
  throw new Error(`Missing source: ${name} (expected in barber/ or assets/)`);
}

async function optimizeImages() {
  for (const name of images) {
    const src = sourcePath(name);
    const dest = join(assetsDir, name);
    const tmp = `${dest}.tmp`;
    await sharp(src)
      .rotate()
      .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(tmp);
    if (existsSync(dest)) unlinkSync(dest);
    renameSync(tmp, dest);
    console.log('image', name);
  }
}

function optimizeVideo() {
  const name = 'barber-hero.mp4';
  const src = sourcePath(name);
  const dest = join(assetsDir, name);
  const tmp = `${dest}.tmp.mp4`;

  const result = spawnSync(
    ffmpegPath,
    [
      '-y',
      '-i',
      src,
      '-c:v',
      'libx264',
      '-crf',
      '28',
      '-preset',
      'medium',
      '-vf',
      'scale=1280:-2',
      '-an',
      '-movflags',
      '+faststart',
      tmp,
    ],
    { stdio: 'inherit' },
  );

  if (result.status !== 0) throw new Error('ffmpeg failed');
  if (existsSync(dest)) unlinkSync(dest);
  renameSync(tmp, dest);
  console.log('video', name);
}

await optimizeImages();
optimizeVideo();
console.log('Done — optimized files in assets/');
