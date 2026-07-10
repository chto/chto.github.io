/* ─── ADS Publications — shared loader for index.html and publications.html ── */

const ADS_TOKEN  = 'aMmpli0HIi6KU2BCj1DJ1wPjxoamrzDSQlfjb8n3';
const ADS_API    = 'https://api.adsabs.harvard.edu/v1/search/query';
const ADS_QUERY  = 'author:"To, Chun-Hao" database:astronomy';
const ADS_FIELDS = 'title,author,year,bibcode,abstract,identifier,pub,volume,page';
const AUTHOR_RE  = /^to,\s*c(hun|\.)/i;

/* ── Research topic categories (matched against title, first-wins) ─── */
const TOPICS = [
    {
        name: 'Gravitational Lensing',
        color: '#7aaee0',
        re: /weak.?lens|gravitational.?lens|\bshear\b|convergence|lensing.*mass|galaxy.galaxy.len|CMB.*len|len.*CMB|strong.?len|lensing.*ACT|non-local.*len|3.{0,3}2pt|\bn\(z\)\b|clustering.redshift/i,
    },
    {
        name: 'Cluster Cosmology',
        color: '#d4a853',
        re: /\bcluster|sunyaev|zel.dovich|\btSZ\b|redmapper|richness|cluster.abund|mass.function|cluster.*cosmol/i,
    },
    {
        name: 'Simulations & Methods',
        color: '#80c494',
        re: /galaxy.halo|halo.occup|\bHOD\b|dwarf.galax|satellite.galax|central.galax|stellar.mass.*halo|abundance.match|\bsimulat|emulat|\bmock\b|N-body|machine.learn|neural.net|\binference\b|\blikelihood\b|pipeline|source.code|\bsoftware\b|algorithm|LINNA|GODMAX|SlimFarmer|Cardinal|photo.?z|photometric.red|normaliz.*flow|CombineHarv|\bRoman\b|LSST|Rubin|Euclid|space.telescope.*survey|survey.*space.telescope/i,
    },
    {
        name: 'Large-Scale Structure',
        color: '#c07878',
        re: /dark.energy|equation.of.state|power.spec|angular.correl|baryon.acoustic|large.scale|correlation.func|two.point|\bBAO\b|baryonic|H_?0\b|Hubble.const|cosmolog.*param|type.ia|supernovae|supernova|\bSN.?Ia\b|probing.grav|growth.*geometr|splitting.growth|DGP|CMB.cold|sound.horizon/i,
    },
    { name: 'Other', color: '#666677', re: null },
];

function categorizePaper(paper) {
    const title = (paper.title?.[0] ?? '').toLowerCase();
    for (const t of TOPICS) {
        if (!t.re || t.re.test(title)) return t.name;
    }
    return 'Other';
}

/* ── ADS fetch ──────────────────────────────────────────────────────── */
async function fetchPapers() {
    const params = new URLSearchParams({
        q:    ADS_QUERY,
        fl:   ADS_FIELDS,
        sort: 'date desc',
        rows: 250,
    });
    const resp = await fetch(`${ADS_API}?${params}`, {
        headers: { Authorization: `Bearer ${ADS_TOKEN}` },
    });
    if (!resp.ok) throw new Error(`ADS ${resp.status}`);
    const data = await resp.json();
    return data.response.docs;
}

/* ═══════════════════════════════════════════════════════════════════
   INDEX PAGE — donut chart + stats
   ═══════════════════════════════════════════════════════════════════ */
async function initChart() {
    const canvas   = document.getElementById('pub-chart');
    const totalEl  = document.getElementById('pub-chart-total');
    const legendEl = document.getElementById('pub-chart-legend');
    const statsEl  = document.getElementById('pub-overview-stats');
    if (!canvas) return;

    let papers;
    try {
        papers = await fetchPapers();
    } catch (e) {
        statsEl.innerHTML = '<p style="opacity:.5">Could not reach ADS.</p>';
        console.error(e);
        return;
    }

    // Count by topic
    const counts = {};
    TOPICS.forEach(t => { counts[t.name] = 0; });
    papers.forEach(p => { counts[categorizePaper(p)]++; });

    const activeTopics = TOPICS.filter(t => counts[t.name] > 0);
    const labels  = activeTopics.map(t => t.name);
    const values  = activeTopics.map(t => counts[t.name]);
    const colors  = activeTopics.map(t => t.color);

    totalEl.textContent = papers.length;

    // ── Chart.js doughnut ──
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: colors.map(c => c + 'cc'),   // 80% opacity fill
                borderColor:     colors,
                borderWidth: 2,
                hoverBorderWidth: 3,
                hoverBackgroundColor: colors,
            }],
        },
        options: {
            cutout: '68%',
            responsive: true,
            maintainAspectRatio: true,
            animation: { duration: 900, easing: 'easeInOutQuart' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label(ctx) {
                            const pct = ((ctx.parsed / papers.length) * 100).toFixed(0);
                            return `  ${ctx.parsed} papers (${pct}%)`;
                        },
                    },
                    backgroundColor: 'rgba(15,19,30,0.92)',
                    titleColor: '#fff',
                    bodyColor: 'rgba(224,220,212,0.85)',
                    borderColor: 'rgba(255,255,255,0.12)',
                    borderWidth: 1,
                    padding: 10,
                },
            },
            onClick(evt, elements) {
                if (!elements.length) return;
                const topic = labels[elements[0].index];
                window.location.href = `publications.html?topic=${encodeURIComponent(topic)}`;
            },
            onHover(evt, elements) {
                canvas.style.cursor = elements.length ? 'pointer' : 'default';
            },
        },
    });

    // ── HTML legend ──
    legendEl.innerHTML = activeTopics.map((t, i) => `
        <div class="pub-legend-item" data-topic="${esc(t.name)}" onclick="window.location='publications.html?topic=${encodeURIComponent(t.name)}'">
            <span class="pub-legend-dot" style="background:${t.color}"></span>
            <span class="pub-legend-name">${esc(t.name)}</span>
            <span class="pub-legend-count">${counts[t.name]}</span>
        </div>`).join('');

    // ── Summary stats ──
    const years = papers.map(p => parseInt(p.year)).filter(Boolean);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    statsEl.innerHTML = `
        <div class="pub-stat-grid">
            <div class="pub-stat-item">
                <div class="pub-stat-number">${papers.length}</div>
                <div class="pub-stat-desc">Total papers</div>
            </div>
            <div class="pub-stat-item">
                <div class="pub-stat-number">${minYear}&ndash;${maxYear}</div>
                <div class="pub-stat-desc">Year range</div>
            </div>
        </div>`;
}

/* ═══════════════════════════════════════════════════════════════════
   PUBLICATIONS PAGE — full card list
   ═══════════════════════════════════════════════════════════════════ */
let allPapers = [];

async function initList() {
    const listEl    = document.getElementById('pub-list');
    const statsEl   = document.getElementById('pub-stats');
    const filtersEl = document.getElementById('pub-year-filters');
    const searchEl  = document.getElementById('pub-search');
    if (!listEl) return;

    try {
        allPapers = await fetchPapers();
    } catch (e) {
        listEl.innerHTML =
            `<div class="pub-error">Could not load publications. ` +
            `<a href="https://ui.adsabs.harvard.edu/search/q=author%3A%22To%2C%20Chun-Hao%22" target="_blank">View on ADS</a></div>`;
        console.error(e);
        return;
    }

    // Year filter buttons
    const years = [...new Set(allPapers.map(p => p.year))].sort((a, b) => b - a);
    filtersEl.appendChild(makeBtn('All', true, applyFilters));
    years.forEach(yr => filtersEl.appendChild(makeBtn(yr, false, applyFilters)));

    // Pre-select topic from URL param (click from chart)
    const urlTopic = new URLSearchParams(window.location.search).get('topic');

    statsEl.textContent = `${allPapers.length} publications`;
    renderPapers(urlTopic ? allPapers.filter(p => categorizePaper(p) === urlTopic) : allPapers, urlTopic);
    if (urlTopic) statsEl.textContent =
        `${allPapers.filter(p => categorizePaper(p) === urlTopic).length} of ${allPapers.length} publications — ${urlTopic}`;

    searchEl.addEventListener('input', applyFilters);
}

function applyFilters() {
    const activeBtn = document.querySelector('.pub-year-btn.active');
    const year   = activeBtn?.dataset.year || null;
    const search = document.getElementById('pub-search').value.trim().toLowerCase();

    const filtered = allPapers.filter(p => {
        const matchYear   = !year   || p.year === year;
        const matchSearch = !search ||
            (p.title?.[0]  ?? '').toLowerCase().includes(search) ||
            (p.author ?? []).some(a => a.toLowerCase().includes(search));
        return matchYear && matchSearch;
    });

    const statsEl = document.getElementById('pub-stats');
    statsEl.textContent = filtered.length === allPapers.length
        ? `${allPapers.length} publications`
        : `${filtered.length} of ${allPapers.length} publications`;

    renderPapers(filtered);
}

function makeBtn(label, active, handler) {
    const btn = document.createElement('button');
    btn.className   = 'pub-year-btn' + (active ? ' active' : '');
    btn.textContent = label;
    if (label !== 'All') btn.dataset.year = label;
    btn.addEventListener('click', () => {
        document.querySelectorAll('.pub-year-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        handler();
    });
    return btn;
}

function renderPapers(papers, activeTopic) {
    const listEl = document.getElementById('pub-list');
    if (!papers.length) {
        listEl.innerHTML = '<div class="pub-loading">No papers match your filter.</div>';
        return;
    }
    listEl.innerHTML = papers.map(cardHtml).join('');
    listEl.querySelectorAll('.pub-abstract-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const abstract = btn.closest('.pub-card').querySelector('.pub-abstract');
            const isOpen   = abstract.style.display === 'block';
            abstract.style.display = isOpen ? 'none' : 'block';
            btn.textContent = isOpen ? 'Abstract ▾' : 'Abstract ▴';
            btn.classList.toggle('open', !isOpen);
        });
    });
}

function cardHtml(paper) {
    const adsUrl  = `https://ui.adsabs.harvard.edu/abs/${paper.bibcode}`;
    const arxivId = (paper.identifier ?? []).find(id => /^arXiv:/i.test(id));
    const arxivUrl = arxivId
        ? `https://arxiv.org/abs/${arxivId.replace(/^arXiv:/i, '')}`
        : null;

    const authors     = paper.author ?? [];
    const isFirstAuth = AUTHOR_RE.test(authors[0] ?? '');
    const topic       = categorizePaper(paper);
    const topicColor  = TOPICS.find(t => t.name === topic)?.color ?? '#888';

    return `
<div class="pub-card${isFirstAuth ? ' first-author' : ''}">
  <div class="pub-topic-dot" style="background:${topicColor}" title="${esc(topic)}"></div>
  <div class="pub-card-body">
    <div class="pub-title"><a href="${adsUrl}" target="_blank" rel="noopener">${esc(paper.title?.[0] ?? '')}</a></div>
    <div class="pub-authors">${formatAuthors(authors)}</div>
    <div class="pub-journal">${esc(formatJournal(paper))}</div>
    <div class="pub-badges">
      <a href="${adsUrl}" class="pub-badge ads" target="_blank" rel="noopener">ADS</a>
      ${arxivUrl ? `<a href="${arxivUrl}" class="pub-badge arxiv" target="_blank" rel="noopener">arXiv</a>` : ''}
      ${paper.abstract ? '<button class="pub-abstract-btn">Abstract ▾</button>' : ''}
    </div>
    ${paper.abstract ? `<div class="pub-abstract">${esc(paper.abstract)}</div>` : ''}
  </div>
</div>`.trim();
}

function formatAuthors(authors) {
    const MAX = 8;
    const fmt = a => AUTHOR_RE.test(a) ? `<strong>${esc(a)}</strong>` : esc(a);
    if (authors.length <= MAX) return authors.map(fmt).join(', ');
    const toIdx = authors.findIndex(a => AUTHOR_RE.test(a));
    const shown = authors.slice(0, MAX);
    if (toIdx >= MAX) shown.push(authors[toIdx]);
    return shown.map(fmt).join(', ') + `, <em>et al.</em>`;
}

function formatJournal(paper) {
    const parts = [];
    if (paper.pub)       parts.push(paper.pub);
    if (paper.volume)    parts.push(paper.volume);
    if (paper.page?.[0]) parts.push(paper.page[0]);
    if (paper.year)      parts.push(`(${paper.year})`);
    return parts.join(' ');
}

function esc(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── Route on load ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('pub-chart'))  initChart();
    if (document.getElementById('pub-list'))   initList();
});
