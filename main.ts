// Leonida Trophy Atlas — entrypoint (Node 22, standard library only).
// The guide itself is plain static files: app/ holds index.html, the
// styles, the scripts and the trophy data, and screenshots/ holds the
// renders of it running. This program hands both in: it copies them
// into the output directory and writes dossier.json there, the summary
// the judge reads, using the kit's vendored library. Nothing here is
// fetched over the network and nothing is built: the app runs as-is.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The grader runs it twice and requires both runs to write identical bytes.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the directory this file lives in.
const repoRoot = dirname(fileURLToPath(import.meta.url));

// The grader gives us /output; locally MAKEFUN_OUTPUT_DIR stands in for it.
const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

// Start from a clean output directory so a stale file can never leak in.
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

// The guide: every static file under app/, copied as-is.
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });

// The screenshots, if they are there yet (they are part of the entry).
const shotsDir = join(repoRoot, 'screenshots');
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });
}

// The dossier: the judge's view of the app and its screenshots. The caps
// below are the scorer's own — app/ at most 993 files and 48 MiB, each
// screenshot at most 256 KiB, at most 4 of them — so a dossier written
// here is one the scorer accepts.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
