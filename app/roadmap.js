// Leonida Trophy Atlas — roadmap, missable warnings and the sources page.
// Renders the three-stage platinum roadmap, the fact grid and the warning
// cards from data/roadmap.json, and builds the source list from every
// source cited by a trophy guide (deduplicated, in first-use order).
function stageTrophyNames(stage, trophies) {
  const byId = new Map(trophies.map((t) => [t.id, t.name]));
  return stage.trophies.map((id) => byId.get(id)).filter(Boolean);
}

function renderFacts(roadmap) {
  const grid = document.getElementById('fact-grid');
  grid.replaceChildren();
  for (const fact of roadmap.facts) {
    const wrap = document.createElement('div');
    const term = document.createElement('dt');
    term.textContent = fact.label;
    const value = document.createElement('dd');
    value.textContent = fact.value;
    wrap.append(term, value);
    grid.append(wrap);
  }
}

function renderStages(roadmap, trophies) {
  const holder = document.getElementById('stages');
  holder.replaceChildren();
  for (const stage of roadmap.stages) {
    const card = document.createElement('article');
    card.className = 'stage';
    const heading = document.createElement('h3');
    heading.textContent = stage.title;
    const hours = document.createElement('p');
    hours.className = 'stage-hours';
    hours.textContent = stage.hours;
    const steps = document.createElement('ol');
    for (const step of stage.steps) {
      const li = document.createElement('li');
      li.textContent = step;
      steps.append(li);
    }
    const names = document.createElement('p');
    names.className = 'stage-trophies';
    const label = document.createElement('strong');
    label.textContent = 'Trophies in this stage: ';
    names.append(label, document.createTextNode(stageTrophyNames(stage, trophies).join(' · ')));
    card.append(heading, hours, steps, names);
    holder.append(card);
  }
}

function renderWarnings(roadmap) {
  const holder = document.getElementById('warnings');
  holder.replaceChildren();
  for (const warning of roadmap.warnings) {
    const card = document.createElement('article');
    card.className = 'warning';
    const heading = document.createElement('h3');
    heading.textContent = warning.title;
    const text = document.createElement('p');
    text.textContent = warning.text;
    card.append(heading, text);
    holder.append(card);
  }
}

function renderSources(trophies) {
  const holder = document.getElementById('source-list');
  holder.replaceChildren();
  const seen = new Set();
  for (const t of trophies) {
    for (const src of t.sources) {
      const key = src.url ?? src.name;
      if (seen.has(key)) continue;
      seen.add(key);
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
      holder.append(li);
    }
  }
}

export function renderRoadmap(state) {
  renderFacts(state.roadmap);
  renderStages(state.roadmap, state.trophies);
  renderWarnings(state.roadmap);
  renderSources(state.trophies);
}
