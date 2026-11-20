// Leonida Trophy Atlas — the trophy checklist.
// Renders every trophy as a card with its official name, description and
// grade, its guide and cited sources, kind tags and a missable flag.
// Filters: kind chips, grade, earned state, text search. The spoiler
// toggle blurs story-trophy names and descriptions until they are earned.
const KIND_LABELS = {
  all: 'All kinds',
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
  side: 'Side quests',
  robbery: 'Robberies',
  exploration: 'Exploration',
  money: 'Money',
  secrets: 'Secrets',
  completion: 'Completion',
};

const KIND_ORDER = ['all', 'story', 'missable', 'collectibles', 'activities', 'online', 'side', 'robbery', 'exploration', 'money', 'secrets', 'completion'];

const listEl = document.getElementById('trophy-list');
const metaEl = document.getElementById('list-meta');
const emptyEl = document.getElementById('empty-note');
const chipsEl = document.getElementById('kind-chips');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const earnedFilterEl = document.getElementById('earned-filter');
const spoilerEl = document.getElementById('spoiler');

let openDetail = null;
let onToggle = null;

function trophyMatches(t, s) {
  if (s.kind !== 'all') {
    if (s.kind === 'online') return false; // no online trophies: the list is all single-player
    if (!t.kinds.includes(s.kind)) return false;
  }
  if (s.grade !== 'all' && t.grade !== s.grade) return false;
  if (s.earnedFilter === 'done' && !s.earned.has(t.name)) return false;
  if (s.earnedFilter === 'todo' && s.earned.has(t.name)) return false;
  if (s.query) {
    const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
    if (!hay.includes(s.query)) return false;
  }
  return true;
}

function spoilerApplies(t, s) {
  return s.spoilersHidden && t.kinds.includes('story') && !s.earned.has(t.name);
}

function sourceLink(src) {
  const li = document.createElement('li');
  if (src.url) {
    const a = document.createElement('a');
    a.href = src.url;
    a.textContent = src.name;
    a.target = '_blank';
    a.rel = 'noopener';
    li.append(a);
  } else {
    li.textContent = src.name;
  }
  return li;
}

function buildCard(t, s) {
  const card = document.createElement('article');
  card.className = 'trophy';
  card.dataset.name = t.name;
  if (s.earned.has(t.name)) card.classList.add('earned');
  if (t.missable) card.classList.add('missable-flag');
  if (spoilerApplies(t, s)) card.classList.add('spoiler-hidden');

  const head = document.createElement('div');
  head.className = 'trophy-head';

  const checkWrap = document.createElement('label');
  checkWrap.className = 'trophy-check';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = s.earned.has(t.name);
  box.setAttribute('aria-label', `Mark ${t.name} as earned`);
  box.addEventListener('change', () => onToggle(t.name));
  checkWrap.append(box);

  const titles = document.createElement('div');
  titles.className = 'trophy-titles';
  const name = document.createElement('h3');
  name.className = 'trophy-name';
  const nameText = document.createElement('span');
  nameText.className = 'trophy-name-text';
  nameText.textContent = t.name;
  name.append(nameText);
  if (t.hidden) {
    const hiddenTag = document.createElement('span');
    hiddenTag.className = 'hidden-tag';
    hiddenTag.textContent = 'Hidden on PS5';
    name.append(hiddenTag);
  }
  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  desc.textContent = t.description;
  titles.append(name, desc);

  const pill = document.createElement('span');
  pill.className = `grade-pill grade-${t.grade}`;
  pill.textContent = t.grade;

  head.append(checkWrap, titles, pill);
  card.append(head);

  const tags = document.createElement('div');
  tags.className = 'trophy-tags';
  for (const kind of t.kinds) {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = KIND_LABELS[kind] ?? kind;
    tags.append(tag);
  }
  if (t.missable) {
    const tag = document.createElement('span');
    tag.className = 'tag tag-missable';
    tag.textContent = 'Possibly missable';
    tags.append(tag);
  }
  card.append(tags);

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'trophy-guide-toggle';
  const isOpen = openDetail === t.name;
  toggle.textContent = isOpen ? 'Hide guide ▲' : 'Read the guide ▼';
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.addEventListener('click', () => {
    openDetail = openDetail === t.name ? null : t.name;
    renderGuide(s, { keepDetail: true });
  });
  card.append(toggle);

  if (isOpen) {
    const detail = document.createElement('div');
    detail.className = 'trophy-detail';
    const heading = document.createElement('h3');
    heading.textContent = 'How to earn it';
    const guide = document.createElement('p');
    if (t.guide.startsWith('UNCONFIRMED METHOD')) guide.className = 'unconfirmed';
    guide.textContent = t.guide;
    const srcHeading = document.createElement('h3');
    srcHeading.textContent = 'Sources';
    const sources = document.createElement('ul');
    sources.className = 'trophy-sources';
    for (const src of t.sources) sources.append(sourceLink(src));
    detail.append(heading, guide, srcHeading, sources);
    card.append(detail);
  }

  return card;
}

function renderChips(s) {
  chipsEl.replaceChildren();
  for (const kind of KIND_ORDER) {
    const count = kind === 'all'
      ? s.trophies.length
      : kind === 'online'
        ? 0
        : s.trophies.filter((t) => t.kinds.includes(kind)).length;
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.setAttribute('aria-pressed', String(s.kind === kind));
    chip.innerHTML = '';
    const label = document.createElement('span');
    label.textContent = KIND_LABELS[kind];
    const num = document.createElement('span');
    num.className = 'count';
    num.textContent = ` ${count}`;
    chip.append(label, num);
    chip.addEventListener('click', () => {
      s.kind = kind;
      renderGuide(s, { keepDetail: true });
    });
    chipsEl.append(chip);
  }
}

export function renderGuide(s, opts = {}) {
  if (opts.onToggle) onToggle = opts.onToggle;
  renderChips(s);
  const shown = s.trophies.filter((t) => trophyMatches(t, s));
  listEl.replaceChildren();
  for (const t of shown) listEl.append(buildCard(t, s));
  emptyEl.hidden = shown.length > 0;
  metaEl.textContent = s.kind === 'online'
    ? 'Showing 0 of 55 — there are no online trophies. Every trophy in GTA VI is single-player (PowerPyx).'
    : `Showing ${shown.length} of ${s.trophies.length} trophies${s.earned.size ? ` · ${s.earned.size} earned` : ''}.`;
}

export function refreshProgress(s) {
  const total = s.trophies.length;
  const done = s.earned.size;
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById('earned-count').textContent = String(done);
  document.getElementById('earned-pct').textContent = `${pct}%`;
  const fill = document.getElementById('progress-fill');
  fill.style.width = `${pct}%`;
  const bar = document.getElementById('progress-bar');
  bar.setAttribute('aria-valuenow', String(done));
  const byGrade = {};
  for (const t of s.trophies) {
    if (s.earned.has(t.name)) byGrade[t.grade] = (byGrade[t.grade] ?? 0) + 1;
  }
  const parts = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const have = byGrade[g] ?? 0;
    const want = s.trophies.filter((t) => t.grade === g).length;
    return `${have}/${want} ${g}`;
  });
  document.getElementById('progress-grades').textContent = parts.join(' · ');
}

// The controls are wired up by attachControls (called from app.js boot),
// which reads the shared state object and re-renders the list.
export function attachControls(s) {
  searchEl.addEventListener('input', () => {
    s.query = searchEl.value.trim().toLowerCase();
    renderGuide(s, { keepDetail: true });
  });
  gradeEl.addEventListener('change', () => {
    s.grade = gradeEl.value;
    renderGuide(s, { keepDetail: true });
  });
  earnedFilterEl.addEventListener('change', () => {
    s.earnedFilter = earnedFilterEl.value;
    renderGuide(s, { keepDetail: true });
  });
  spoilerEl.addEventListener('change', () => {
    s.spoilersHidden = spoilerEl.checked;
    renderGuide(s, { keepDetail: true });
  });
}
