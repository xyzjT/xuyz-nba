/* ============ NBA 数据馆 · 应用逻辑 ============ */
(() => {
  const API = 'https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba';
  const CUR_SEASON = 2027; // 2026-27 赛季
  const LAST_SEASON = 2026; // 2025-26 赛季

  const $ = sel => document.querySelector(sel);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };

  const teams = NBA_DATA.teams || [];
  const liveIndex = (NBA_DATA.liveIndex || { teams: [], players: [] });
  const honors = NBA_DATA.honors || [];
  const legends = NBA_DATA.legends || [];
  const teamById = id => teams.find(t => t.id === id);

  /* ESPN 数字 ID ↔ 本地 slug 映射 */
  const teamByLiveId = {};  // ESPN id -> 本地球队
  const liveIdBySlug = {};  // 本地 slug -> ESPN id
  liveIndex.teams.forEach(lt => {
    const t = teams.find(x => x.en === lt.displayName);
    if (t) { teamByLiveId[lt.id] = t; liveIdBySlug[t.id] = lt.id; }
  });
  const liveTeamBySlug = slug => liveIndex.teams.find(x => x.id === liveIdBySlug[slug]) || {};

  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  /* ---------- API(带缓存与超时) ---------- */
  const apiCache = new Map();
  async function api(path, opts = {}) {
    const url = API + path;
    const ck = url + (opts.refresh ? '|' + Date.now() : '');
    if (!opts.refresh && apiCache.has(url)) return apiCache.get(url);
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    try {
      const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const j = await res.json();
      if (!opts.refresh) apiCache.set(url, j);
      return j;
    } finally { clearTimeout(t); }
  }
  const refId = r => r.$ref.split('/').slice(-1)[0].split('?')[0];

  /* ---------- 统计解析 ---------- */
  const STAT_LABELS = {
    gamesPlayed: '场次', points: '总得分', avgPoints: '场均得分', rebounds: '篮板', avgReb: '场均篮板',
    assists: '助攻', steals: '抢断', blocks: '盖帽', turnovers: '失误', minutes: '上场时间',
    fgPct: '投篮%', tpPct: '三分%', ftPct: '罚球%', avgMin: '场均时间',
  };

  function parseStats(j) {
    const sp = j.splits || {};
    const cats = {};
    for (const c of sp.categories || []) cats[c.name] = c;
    const val = (cat, name) => { const s = (cats[cat]?.stats || []).find(x => x.name === name); return s ? s.value : null; };
    const gp = val('general', 'gamesPlayed') || 0;
    const points = val('offensive', 'points') ?? 0;
    const or = val('general', 'offensiveRebounds') ?? 0;
    const dr = val('general', 'defensiveRebounds') ?? 0;
    const fgm = val('offensive', 'fieldGoalsMade') ?? 0;
    const fga = val('offensive', 'fieldGoalsAttempted') ?? 0;
    const tpm = val('offensive', 'threePointFieldGoalsMade') ?? 0;
    const tpa = val('offensive', 'threePointFieldGoalsAttempted') ?? 0;
    const ftm = val('offensive', 'freeThrowsMade') ?? 0;
    const fta = val('offensive', 'freeThrowsAttempted') ?? 0;
    const mins = val('general', 'minutes') ?? 0;
    return {
      gp, points, rebounds: or + dr, assists: val('offensive', 'assists') ?? 0,
      steals: val('defensive', 'steals') ?? 0, blocks: val('defensive', 'blocks') ?? 0,
      turnovers: val('general', 'turnovers') ?? 0, minutes: mins,
      fgPct: fga ? (fgm / fga * 100) : null, tpPct: tpa ? (tpm / tpa * 100) : null, ftPct: fta ? (ftm / fta * 100) : null,
      avgPoints: gp ? (points / gp) : null, avgReb: gp ? ((or + dr) / gp) : null,
      avgAst: gp ? ((val('offensive', 'assists') ?? 0) / gp) : null, avgMin: gp ? (mins / gp) : null,
    };
  }

  /* ---------- 视图渲染 ---------- */
  function render() {
    const hash = location.hash || '#/';
    const parts = hash.replace(/^#\//, '').split('/');
    const [kind, id] = parts;
    $('#search-suggest').classList.remove('open');
    if (kind === 'team') renderTeam(id);
    else if (kind === 'player') renderPlayer(id);
    else renderHome();
    window.scrollTo(0, 0);
  }

  /* 主页:分区球队卡片 */
  function renderHome() {
    $('#crumb-sep').hidden = true;
    $('#crumb-now').textContent = '';
    const view = $('#view');
    view.innerHTML = '';
    const liveTeam = liveTeamBySlug;
    for (const conf of ['东部', '西部']) {
      const confTeams = teams.filter(t => t.conf === conf);
      view.appendChild(el('div', 'conf-title', conf + '联盟'));
      const grid = el('div', 'team-grid');
      confTeams.forEach((t, i) => {
        const live = liveTeam(t.id);
        const card = el('div', 'team-card fade-in stagger-' + Math.min(3, i % 3 + 1));
        card.style.setProperty('--tc', t.colors[0]);
        card.appendChild(el('div', 'abbr', t.en.split(' ').pop().slice(0, 3).toUpperCase()));
        card.appendChild(el('div', 'tname', t.name));
        card.appendChild(el('div', 'tcity', t.en));
        const meta = el('div', 'tmeta');
        meta.appendChild(el('span', 'chip gold', '🏆 ' + (t.champs || 0) + ' 冠'));
        meta.appendChild(el('span', 'chip orange', '📍 ' + (live.arena || t.arena)));
        meta.appendChild(el('span', 'chip', t.div));
        card.appendChild(meta);
        card.onclick = () => { location.hash = '#/team/' + t.id; };
        grid.appendChild(card);
      });
      view.appendChild(grid);
    }
  }

  /* 球队详情 */
  async function renderTeam(id) {
    const t = teamById(id);
    const view = $('#view');
    if (!t) { view.innerHTML = ''; view.appendChild(el('div', 'error-box', '未找到该球队')); return; }
    $('#crumb-sep').hidden = false;
    $('#crumb-now').textContent = t.name;
    const live = liveTeamBySlug(id);

    view.innerHTML = '';
    const head = el('div', 'detail-head');
    head.style.setProperty('--tc', t.colors[0]);
    const badge = el('div', 'team-logo-badge', t.en.split(' ').pop().slice(0, 2).toUpperCase());
    head.appendChild(badge);
    const info = el('div', '');
    info.appendChild(el('h2', '', t.name));
    info.appendChild(el('div', 'en', t.en + ' · ' + t.city));
    const facts = el('div', 'facts');
    facts.appendChild(el('span', 'chip gold', '🏆 总冠军 ×' + t.champs));
    facts.appendChild(el('span', 'chip orange', '🏟️ ' + (live.arena || t.arena)));
    facts.appendChild(el('span', 'chip', '📅 成立于 ' + t.founded));
    facts.appendChild(el('span', 'chip', t.div + ' · ' + t.conf + '联盟'));
    info.appendChild(facts);
    info.appendChild(el('div', 'desc', t.desc));
    head.appendChild(info);
    view.appendChild(head);

    /* 阵容 */
    const roster = liveIndex.players.filter(p => p.team === (live.id || ''));
    view.appendChild(el('div', 'section-title', '🧑‍🎤 现役阵容 (' + roster.length + ' 人)'));
    if (!roster.length) {
      view.appendChild(el('div', 'hint-box', '名单索引中暂无该队球员,点击「刷新名单」从 ESPN 实时拉取'));
    } else {
      const grid = el('div', 'player-chip-grid');
      roster.forEach(p => {
        const chip = el('div', 'player-chip');
        chip.appendChild(el('span', 'jersey', '#' + (p.jersey || '–')));
        const nmWrap = el('div', '');
        nmWrap.appendChild(el('div', 'nm', p.name));
        if (p.zh) nmWrap.appendChild(el('div', 'zh', p.zh));
        chip.appendChild(nmWrap);
        chip.appendChild(el('span', 'ps', p.pos || ''));
        chip.onclick = () => { location.hash = '#/player/' + p.id; };
        grid.appendChild(chip);
      });
      view.appendChild(grid);
    }
    const note = el('div', 'note', '名单索引生成于 ' + (liveIndex.generatedAt || '—').slice(0, 10) + ' · 数据源 ESPN');
    view.appendChild(note);
  }

  /* 球员详情 */
  async function renderPlayer(id) {
    const view = $('#view');
    $('#crumb-sep').hidden = false;
    view.innerHTML = '';
    view.appendChild(el('div', 'loading', '正在拉取实时数据'));

    /* 名宿(本地数据) */
    const legIdx = id.startsWith('L') ? parseInt(id.slice(1), 10) : -1;
    if (legIdx >= 0 && legends[legIdx]) {
      renderLegend(legends[legIdx]);
      return;
    }

    const meta = liveIndex.players.find(p => p.id === id);
    if (!meta) {
      view.innerHTML = '';
      view.appendChild(el('div', 'error-box', '名单索引中未找到该球员(可能是新签约球员)。请稍后刷新名单或返回首页搜索。'));
      return;
    }
    $('#crumb-now').textContent = meta.name;

    /* 并行拉取:生涯 + 当赛季 + 上赛季 */
    const [careerJ, curJ, lastJ] = await Promise.allSettled([
      api('/athletes/' + id + '/statistics/0'),
      api('/seasons/' + CUR_SEASON + '/types/2/athletes/' + id + '/statistics'),
      api('/seasons/' + LAST_SEASON + '/types/2/athletes/' + id + '/statistics'),
    ]);
    const career = careerJ.status === 'fulfilled' ? parseStats(careerJ.value) : null;
    const cur = curJ.status === 'fulfilled' && curJ.value && !curJ.value.error ? parseStats(curJ.value) : null;
    const last = lastJ.status === 'fulfilled' && lastJ.value && !lastJ.value.error ? parseStats(lastJ.value) : null;

    const hn = honors.find(h => norm(h.name) === norm(meta.name)) || honors.find(h => norm(h.name).includes(norm(meta.name.split(' ')[1] || '')));

    view.innerHTML = '';
    const hero = el('div', 'player-hero');
    const team = teamByLiveId[meta.team];
    hero.style.setProperty('--tc', team ? team.colors[0] : '#e85d1f');
    hero.appendChild(el('div', 'avatar', (meta.name[0] || '?').toUpperCase()));
    const info = el('div', '');
    info.appendChild(el('h2', '', meta.name));
    const zhLine = el('div', 'zh-name', (meta.zh || hn?.zh || '') + (team ? ' · ' + team.name : ''));
    info.appendChild(zhLine);
    const ml = el('div', 'meta-line');
    ml.appendChild(el('span', 'chip orange', '位置 ' + (meta.pos || '—')));
    ml.appendChild(el('span', 'chip', '球衣 #' + (meta.jersey || '—')));
    ml.appendChild(el('span', 'chip gold', '🏀 实时数据'));
    info.appendChild(ml);
    hero.appendChild(info);
    view.appendChild(hero);

    /* 荣誉 */
    if (hn && hn.honors.length) {
      const strip = el('div', 'honor-strip');
      hn.honors.forEach(h => strip.appendChild(el('span', 'honor-badge', h)));
      view.appendChild(strip);
    }

    /* 统计卡片 */
    const cards = el('div', 'stats-cards');

    /* 当赛季 */
    const curCard = el('div', 'stats-card');
    curCard.appendChild(el('h3', '', '📡 当赛季 (2026-27)'));
    if (cur && cur.gp > 0) {
      curCard.appendChild(statGrid(cur, true));
      curCard.appendChild(el('div', 'note', '数据实时来自 ESPN · 常规赛进行中'));
    } else if (!cur) {
      curCard.appendChild(el('div', 'hint-box', '2026-27 常规赛尚未开赛(季前赛阶段),暂无当赛季数据。以下展示 2025-26 赛季数据:'));
      if (last && last.gp > 0) curCard.appendChild(statGrid(last, true));
      else curCard.appendChild(el('div', 'error-box', '上赛季数据暂不可用'));
    } else {
      curCard.appendChild(el('div', 'hint-box', '该球员本赛季暂无常规赛出场记录'));
      if (last && last.gp > 0) { curCard.appendChild(el('div', 'note', '最近一季 (2025-26):')); curCard.appendChild(statGrid(last, true)); }
    }
    cards.appendChild(curCard);

    /* 生涯 */
    const carCard = el('div', 'stats-card');
    carCard.appendChild(el('h3', '', '📜 生涯数据'));
    if (career && career.gp > 0) {
      carCard.appendChild(statGrid(career, false));
      const rows = el('div', 'stat-rows');
      rows.appendChild(statRow('生涯总得分', career.points.toLocaleString()));
      rows.appendChild(statRow('生涯总篮板', career.rebounds.toLocaleString()));
      rows.appendChild(statRow('生涯总助攻', career.assists.toLocaleString()));
      rows.appendChild(statRow('生涯总场次', career.gp));
      carCard.appendChild(rows);
      carCard.appendChild(el('div', 'note', '生涯总计 · 数据源 ESPN'));
    } else {
      carCard.appendChild(el('div', 'error-box', '生涯数据暂不可用'));
    }
    cards.appendChild(carCard);

    view.appendChild(cards);
  }

  function statGrid(s, perGame) {
    const g = el('div', 'stat-grid');
    const cell = (v, k) => { const c = el('div', 'stat-cell'); c.appendChild(el('div', 'v', v)); c.appendChild(el('div', 'k', k)); g.appendChild(c); };
    const r1 = x => x == null ? '–' : (Number.isInteger(x) ? x : x.toFixed(1));
    cell(perGame ? r1(s.avgPoints) : r1(s.points), perGame ? '场均得分' : '总得分');
    cell(perGame ? r1(s.avgReb) : r1(s.rebounds), perGame ? '场均篮板' : '总篮板');
    cell(perGame ? r1(s.avgAst) : r1(s.assists), perGame ? '场均助攻' : '总助攻');
    cell(s.gp, '场次');
    cell(r1(s.steals), '抢断');
    cell(r1(s.blocks), '盖帽');
    cell(r1(s.turnovers), '失误');
    cell(perGame ? r1(s.avgMin) : r1(s.minutes), '分钟');
    cell(s.fgPct == null ? '–' : s.fgPct.toFixed(1) + '%', '投篮%');
    cell(s.tpPct == null ? '–' : s.tpPct.toFixed(1) + '%', '三分%');
    cell(s.ftPct == null ? '–' : s.ftPct.toFixed(1) + '%', '罚球%');
    cell(perGame ? '' : r1(s.points), perGame ? '' : '生涯总得分');
    if (!perGame) g.removeChild(g.lastChild);
    return g;
  }
  function statRow(k, v) { const r = el('div', 'stat-row'); r.appendChild(el('span', '', k)); r.appendChild(el('b', '', String(v))); return r; }

  /* 名宿渲染(本地) */
  function renderLegend(L) {
    const view = $('#view');
    $('#crumb-now').textContent = L.name;
    view.innerHTML = '';
    const hero = el('div', 'player-hero');
    hero.appendChild(el('div', 'avatar', (L.name[0] || '?').toUpperCase()));
    const info = el('div', '');
    info.appendChild(el('h2', '', L.name));
    info.appendChild(el('div', 'zh-name', L.zh + ' · ' + L.team));
    const ml = el('div', 'meta-line');
    ml.appendChild(el('span', 'chip orange', '位置 ' + L.pos));
    ml.appendChild(el('span', 'chip', '已退役'));
    info.appendChild(ml);
    hero.appendChild(info);
    view.appendChild(hero);

    const strip = el('div', 'honor-strip');
    L.honors.forEach(h => strip.appendChild(el('span', 'honor-badge', h)));
    view.appendChild(strip);

    const cards = el('div', 'stats-cards');
    const carCard = el('div', 'stats-card');
    carCard.appendChild(el('h3', '', '📜 生涯数据(手工整理)'));
    const g = el('div', 'stat-grid');
    const cell = (v, k) => { const c = el('div', 'stat-cell'); c.appendChild(el('div', 'v', v)); c.appendChild(el('div', 'k', k)); g.appendChild(c); };
    cell(L.career.ppg, '场均得分'); cell(L.career.rpg, '场均篮板'); cell(L.career.apg, '场均助攻'); cell(L.career.seasons, '赛季数');
    cell(L.career.pts.toLocaleString(), '总得分'); cell(L.career.reb.toLocaleString(), '总篮板'); cell(L.career.ast.toLocaleString(), '总助攻'); cell('', '');
    g.removeChild(g.lastChild);
    carCard.appendChild(g);
    carCard.appendChild(el('div', 'note', '退役名宿数据为本地荣誉库整理'));
    cards.appendChild(carCard);
    view.appendChild(cards);
  }

  /* ---------- 搜索 ---------- */
  function search(q) {
    q = norm(q.trim());
    if (!q) return [];
    const out = [];
    for (const p of liveIndex.players) {
      if (norm(p.name).includes(q) || (p.zh && p.zh.includes(q))) out.push({ type: 'live', name: p.name, zh: p.zh, id: p.id, meta: (p.pos || '') + ' · ' + (teamByLiveId[p.team]?.name || '') });
      if (out.length >= 30) return out;
    }
    legends.forEach((L, i) => {
      if (out.length >= 30) return;
      if (norm(L.name).includes(q) || L.zh.includes(q)) out.push({ type: 'legend', name: L.name, zh: L.zh, id: 'L' + i, meta: '名宿 · ' + L.team });
    });
    return out;
  }

  const input = $('#search-input');
  const sugg = $('#search-suggest');
  input.addEventListener('input', () => {
    const rs = search(input.value);
    sugg.innerHTML = '';
    if (!rs.length) { sugg.classList.remove('open'); return; }
    rs.forEach(r => {
      const it = el('div', 'sug-item');
      it.appendChild(el('span', 'nm', r.name));
      if (r.zh) it.appendChild(el('span', 'zh', r.zh));
      it.appendChild(el('span', 'meta', r.meta));
      it.onclick = () => { location.hash = '#/player/' + r.id; input.value = ''; };
      sugg.appendChild(it);
    });
    sugg.classList.add('open');
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const rs = search(input.value);
      if (rs.length) { location.hash = '#/player/' + rs[0].id; input.value = ''; }
    } else if (e.key === 'Escape') { sugg.classList.remove('open'); }
  });
  document.addEventListener('click', e => { if (!e.target.closest('#search-wrap')) sugg.classList.remove('open'); });

  window.addEventListener('hashchange', render);
  render();
})();
