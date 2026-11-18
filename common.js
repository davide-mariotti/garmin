// Condiviso da dashboard.html, piano.html, forza.html, analisi.html e wiki.html: formattazione, sidebar, tema dei grafici, helper ECharts.

// ---------- utilità ----------
const v = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const nf = (x, d = 0) => x == null || isNaN(x) ? '–' : Number(x).toLocaleString('it-IT', { maximumFractionDigits: d, minimumFractionDigits: d });
const hm = s => s == null ? '–' : `${Math.floor(s / 3600)}h ${String(Math.round(s % 3600 / 60)).padStart(2, '0')}m`;
const clock = s => { s = Math.round(s); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = String(s % 60).padStart(2, '0'); return h ? `${h}:${String(m).padStart(2, '0')}:${x}` : `${m}:${x}`; };
const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const monday = iso => addDays(iso, -((new Date(iso + 'T12:00:00Z').getUTCDay() + 6) % 7));
const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00:00Z') - new Date(a + 'T12:00:00Z')) / 864e5);
const fmtDay = x => typeof x === 'number'
  ? new Date(x).toLocaleString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  : new Date(x + 'T12:00:00Z').toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const dayMonth = iso => new Date(iso + 'T12:00:00Z').toLocaleDateString('it-IT', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const short = iso => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
const avg = a => { a = a.filter(x => x != null); return a.length ? a.reduce((s, x) => s + x, 0) / a.length : null; };
const sum = a => a.reduce((s, x) => s + (x || 0), 0);
const rolling = (arr, n) => arr.map((_, i) => avg(arr.slice(Math.max(0, i - n + 1), i + 1)));
const store = {
  get: k => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, x) => { try { localStorage.setItem(k, x); } catch {} },
};
const TODAY_REAL = new Date().toLocaleDateString('sv-SE');  // YYYY-MM-DD locale

// ---------- sport ----------
const SPORTS = [['Corsa', '--s1'], ['Bici', '--s2'], ['Nuoto', '--s3'], ['Altro', '--s4']];
const sport = a => { const k = a.activityType?.typeKey || ''; return /run/.test(k) ? 'Corsa' : /cycl|ride|bik/.test(k) ? 'Bici' : /swim/.test(k) ? 'Nuoto' : 'Altro'; };
const isRun = a => /run/.test(a.activityType?.typeKey || '');
const paceOf = a => {
  if (!a.averageSpeed) return '–';
  const s = sport(a);
  if (s === 'Corsa') return clock(1000 / a.averageSpeed) + ' /km';
  if (s === 'Nuoto') return clock(100 / a.averageSpeed) + ' /100m';
  return nf(a.averageSpeed * 3.6, 1) + ' km/h';
};

// ---------- sidebar ----------
const ICONS = {
  panoramica: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  allenamento: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  corsa: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  sonno: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  recupero: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  movimento: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  corpo: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  piano: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 16 2 2 4-4"/>',
  forza: '<path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>',
  wiki: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5Z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  analisi: '<path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  ext: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
};
const icon = name => `<svg class="ico" viewBox="0 0 24 24">${ICONS[name]}</svg>`;
// logo dm. del sito: tratti chiari, il puntino è l'unico verde
const LOGO = '<svg class="logo" viewBox="7.5 12.5 108.8 68" role="img" aria-label="dm."><path d="M45,20V73M45,58A15,15 0 1 1 45,57.99M45,54A11,11 0 0 1 67,54V73M67,54A11,11 0 0 1 89,54V73" fill="none" stroke="#ecf3ee" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><circle cx="107.7" cy="71.9" r="6.6" fill="#2fe37f"/></svg>';
const VIEWS = [['panoramica', 'Panoramica'], ['allenamento', 'Allenamento'], ['corsa', 'Corsa'], ['sonno', 'Sonno'], ['recupero', 'Recupero e stress'], ['movimento', 'Movimento'], ['corpo', 'Corpo']];
// page: 'dashboard', 'piano', 'forza', 'analisi' o 'wiki'
function renderSidebar(page, who, foot) {
  const base = page === 'dashboard' ? '' : 'dashboard.html' + location.search;
  const link = (id, label) => `<a href="${id}.html${location.search}" data-view="${id}"${page === id ? ' class="active"' : ''}>${icon(id)}${label}</a>`;
  $('#side').innerHTML = `
    <a class="brand" href="index.html" title="Tutti gli atleti">${LOGO}<span>Garmin<small>${esc(who || '')}</small></span></a>
    <nav class="nav">
      ${VIEWS.map(([id, label]) => `<a href="${base}#${id}" data-view="${id}">${icon(id)}${label}</a>`).join('')}
      <div class="sep"></div>
      ${window.PLAN ? link('piano', 'Piano gare') : ''}
      ${window.PLAN?.strength ? link('forza', 'Forza') : ''}
      ${link('analisi', 'Analisi')}
      ${link('wiki', 'Wiki')}
    </nav>
    <div class="side-foot"><span>${esc(foot || '')}</span>${window.garminSignOut ? '<button class="link" id="signout">Esci</button>' : ''}</div>`;
  $('#signout')?.addEventListener('click', window.garminSignOut);
  revealNav();
}
// su telefono la barra scorre in orizzontale: porta in vista la voce attiva
const revealNav = () => { const a = $('.nav a.active'); if (a) $('#side').scrollLeft = a.offsetLeft - 64; };

// ---------- ECharts ----------
// Geist, da app.css; in Node (check-plan.js, garmin-export.js) non c'è il DOM
const FONT = (typeof getComputedStyle === 'function' && getComputedStyle(document.documentElement).getPropertyValue('--font').trim()) || 'system-ui, sans-serif';
const MONO = (typeof getComputedStyle === 'function' && getComputedStyle(document.documentElement).getPropertyValue('--mono').trim()) || 'monospace';
// tema unico (scuro, come il sito): assi in Geist Mono, griglia appena visibile, tooltip vetro scuro
function registerTheme() {
  if (!window.echarts) return;  // wiki.html e forza.html non hanno grafici
  const lbl = { color: v('--muted'), fontFamily: MONO, fontSize: 10.5 };
  const ax = { axisLine: { lineStyle: { color: v('--axis') } }, axisTick: { show: false }, axisLabel: { ...lbl, hideOverlap: true }, splitLine: { lineStyle: { color: v('--grid') } }, nameTextStyle: lbl };
  echarts.registerTheme('g', {
    color: ['--s1', '--s2', '--s3', '--s4', '--s5', '--s7', '--s8'].map(v),
    backgroundColor: 'transparent',
    textStyle: { fontFamily: FONT, color: v('--text-2') },
    legend: { textStyle: { color: v('--text-2'), fontSize: 12 }, pageIconColor: v('--accent'), pageIconInactiveColor: v('--faint'), pageTextStyle: lbl },
    tooltip: { backgroundColor: 'rgba(17,23,20,.94)', borderColor: v('--line-strong'), borderWidth: 1, padding: [9, 12], textStyle: { color: v('--text-1'), fontSize: 12, fontFamily: FONT },
      extraCssText: 'border-radius:12px;box-shadow:0 16px 40px -10px rgba(0,0,0,.7);backdrop-filter:blur(10px)' },
    toolbox: { iconStyle: { borderColor: v('--faint') }, emphasis: { iconStyle: { borderColor: v('--accent'), textFill: v('--text-2') } } },
    categoryAxis: { ...ax, splitLine: { show: false } },
    valueAxis: { ...ax, axisLine: { show: false } },
    timeAxis: { ...ax, splitLine: { show: false } },
    line: { symbol: 'none', lineStyle: { width: 2 } },
  });
}
// tooltip ad asse: valore in evidenza, nome serie dopo; le serie "_x" sono di servizio
const tipAxis = fmt => ps => fmtDay(ps[0].axisValue) + ps
  .filter(p => p.value != null && !p.seriesName.startsWith('_'))
  .map(p => `<div class="tt"><i style="background:${p.color}"></i><b>${fmt(Array.isArray(p.value) ? p.value[1] : p.value)}</b><span>${p.seriesName}</span></div>`).join('');
function opt(o, fmt = x => nf(x, 1)) {
  const named = (o.series || []).filter(s => s.name && !s.name.startsWith('_')).map(s => s.name);
  return {
    grid: { left: 4, right: 14, top: named.length > 1 ? 38 : 22, bottom: 4, containLabel: true },
    tooltip: { trigger: 'axis', formatter: tipAxis(fmt), axisPointer: { type: 'line', lineStyle: { color: 'rgba(47,227,127,.45)' } } },
    legend: { show: named.length > 1, type: 'scroll', top: 0, left: 0, width: '85%', icon: 'roundRect', itemWidth: 10, itemHeight: 10, itemGap: 14, data: named },  // il 15% a destra resta alla toolbox
    toolbox: {
      right: 0, top: -2, itemSize: 13,
      feature: {
        dataView: { readOnly: true, title: 'Tabella', lang: ['Dati', 'Chiudi', 'Aggiorna'], backgroundColor: v('--surface'), textColor: v('--text-1'), textareaColor: v('--surface'), textareaBorderColor: v('--border'), buttonColor: v('--accent'), buttonTextColor: v('--on-ink') },
        saveAsImage: { title: 'Salva PNG', backgroundColor: v('--surface') },
      },
    },
    ...o,
  };
}
const BAR = { type: 'bar', barMaxWidth: 24, itemStyle: { borderRadius: [4, 4, 0, 0] } };
// barre impilate: 2px di stacco color superficie (solo se c'è spazio), arrotondato solo il segmento in cima
const stack = (names, colors, rows) => names.map((n, i) => ({
  ...BAR, name: n, stack: 's', data: rows[i],
  itemStyle: { color: v(colors[i]), borderColor: v('--surface'), borderWidth: rows[0].length > 60 ? 0 : 1, borderRadius: i === names.length - 1 ? [4, 4, 0, 0] : 0 },
}));
const lineS = (name, data, color = '--s1', extra = {}) => ({ type: 'line', name, data, connectNulls: true, itemStyle: { color: v(color) }, lineStyle: { color: v(color), width: 2 }, ...extra });
// sfumatura sotto la linea, dal colore della serie al trasparente
const alpha = (hex, a) => { const n = parseInt(hex.replace('#', ''), 16); return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${a})`; };
const area = color => ({ areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: alpha(v(color), .3) }, { offset: 1, color: alpha(v(color), 0) }] } } });

// registro grafici: ogni pagina registra builder (id -> opzioni|null) e li disegna quando servono
const CHARTS = {};
const chart = (id, build) => { CHARTS[id] = build; };
const note = (id, text) => { document.getElementById(id).closest('.card').querySelector('.sub').textContent = text; };
function drawCharts(root, reinit = false) {
  for (const [id, build] of Object.entries(CHARTS)) {
    const el = document.getElementById(id);
    if (!el || !root.contains(el)) continue;
    const card = el.closest('.card');
    let o = null;
    try { o = build(); } catch (e) { console.error(id, e); }  // un grafico rotto non blocca gli altri
    card.hidden = !o;
    if (!o) continue;
    if (reinit) echarts.getInstanceByDom(el)?.dispose();
    const { onClick, ...option } = o;
    const c = echarts.getInstanceByDom(el) || echarts.init(el, 'g', { locale: 'IT' });
    c.setOption(option, true);
    c.off('click');
    if (onClick) c.on('click', onClick);
    c.resize();
  }
}
addEventListener('resize', () => document.querySelectorAll('[_echarts_instance_]').forEach(el => echarts.getInstanceByDom(el)?.resize()));
// luce che segue il puntatore sulle card, come .spot sul sito (--x, --y in app.css)
if (typeof addEventListener === 'function') addEventListener('pointermove', e => {
  const c = e.target.closest?.('.card, .kpis'); if (!c) return;
  const r = c.getBoundingClientRect();
  c.style.setProperty('--x', `${e.clientX - r.left}px`); c.style.setProperty('--y', `${e.clientY - r.top}px`);
}, { passive: true });
