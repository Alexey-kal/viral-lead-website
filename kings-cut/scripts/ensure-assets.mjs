import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const assetsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
const required = [
  'barber-hero.mp4',
  'barber-pole.jpg',
  'barber-shave.jpg',
  'barber-shop.jpg',
  'barber-tools.jpg',
];

const missing = required.filter((name) => !existsSync(join(assetsDir, name)));

if (missing.length) {
  console.error(
    '\n[kings-cut] Missing media in assets/:\n  ' +
      missing.join('\n  ') +
      '\n\nRun locally: npm run optimize-assets\nOr copy files from barber/ into kings-cut/assets/\n',
  );
  process.exit(1);
}

console.log('[kings-cut] assets OK');
