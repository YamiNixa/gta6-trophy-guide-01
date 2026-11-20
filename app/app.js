// Leonida Trophy Atlas — boot + saved progress.
// Loads the trophy list and the roadmap, then hands rendering to
// guide.js (the checklist) and roadmap.js (roadmap, warnings, sources).
// Progress lives only in localStorage; export/import move it as JSON.
import { renderGuide, refreshProgress, attachControls } from './guide.js';
import { renderRoadmap } from './roadmap.js';

const STORE_KEY = 'leonida-trophy-atlas-v1';
const EXPORT_NAME = 'gta6-trophy-progress.json';

const state = {
  trophies: [],
  roadmap: null,
  earned: new Set(),
  kind: 'all',
  grade: 'all',
  earnedFilter: 'all',
  query: '',
  spoilersHidden: false,
};

function loadStoredProgress() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((n) => typeof n === 'string') : []);
  } catch {
    return new Set();
  }
}

function saveProgress() {
  localStorage.setItem(STORE_KEY, JSON.stringify([...state.earned]));
}

function toggleEarned(name) {
  if (state.earned.has(name)) state.earned.delete(name);
  else state.earned.add(name);
  saveProgress();
  refreshProgress(state);
  renderGuide(state, { keepDetail: true });
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...state.earned] }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = EXPORT_NAME;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

async function importProgress(file) {
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const names = Array.isArray(parsed) ? parsed : parsed.earned;
    if (!Array.isArray(names)) throw new Error('not a progress file');
    const known = new Set(state.trophies.map((t) => t.name));
    state.earned = new Set(names.filter((n) => known.has(n)));
    saveProgress();
    refreshProgress(state);
    renderGuide(state);
  } catch {
    alert('That file is not a Leonida Trophy Atlas progress export.');
  }
}

function resetProgress() {
  if (!state.earned.size) return;
  if (!confirm('Clear all earned trophies? This cannot be undone (unless you exported first).')) return;
  state.earned = new Set();
  saveProgress();
  refreshProgress(state);
  renderGuide(state);
}

async function boot() {
  const [trophyDoc, roadmapDoc] = await Promise.all([
    fetch('data/trophies.json').then((r) => r.json()),
    fetch('data/roadmap.json').then((r) => r.json()),
  ]);
  state.trophies = trophyDoc.trophies;
  state.roadmap = roadmapDoc;
  state.earned = loadStoredProgress();

  document.getElementById('export').addEventListener('click', exportProgress);
  document.getElementById('import').addEventListener('change', (e) => {
    importProgress(e.target.files[0]);
    e.target.value = '';
  });
  document.getElementById('reset').addEventListener('click', resetProgress);

  renderGuide(state, { onToggle: toggleEarned });
  attachControls(state);
  renderRoadmap(state);
  refreshProgress(state);
}

boot();
