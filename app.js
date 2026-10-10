/* ============ 四球数据馆 · 应用逻辑(篮球/足球/乒乓球/羽毛球) ============ */
(() => {
  const API_BASE = {
    basketball: 'https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba',
    football: 'https://sports.core.api.espn.com/v2/sports/soccer/leagues',
  };
  const CUR_SEASON = 2027;   // 篮球 2026-27
  const FOOT_SEASON = '2026'; // 足球 ESPN 最新有数据赛季(2025-26)

  const $ = sel => document.querySelector(sel);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };

  const teams = NBA_DATA.teams || [];               // 篮球球队(静态)
  const liveIndex = (NBA_DATA.liveIndex || { teams: [], players: [] }); // 篮球球员索引
  const honors = NBA_DATA.honors || [];             // 篮球荣誉
  const legends = NBA_DATA.legends || [];           // 篮球名宿
  const soccerIndex = (NBA_DATA.soccerIndex || { leagues: [], players: [] }); // 足球索引
  const soccerHonors = NBA_DATA.soccerHonors || []; // 足球荣誉
  const soccerLegends = NBA_DATA.soccerLegends || []; // 足球名宿
  const soccerPeriods = NBA_DATA.soccerPeriods || {}; // 巨星分时期数据(ESPN 实时)
  const soccerPeriodsExtra = NBA_DATA.soccerPeriodsExtra || {}; // 历史时期人工补充
  const portraits = NBA_DATA.portraits || {}; // 维基照片(自托管)
  /* 合并:同联赛实时优先,人工补全缺失时期,按赛季排序 */
  function mergedPeriods(name) {
    const live = soccerPeriods[name] || [];
    const extra = soccerPeriodsExtra[name] || [];
    const byLeague = new Map();
    for (const p of extra) byLeague.set(p.league, p);
    for (const p of live) byLeague.set(p.league, p);
    return [...byLeague.values()].sort((a, b) => (a.seasons || '').localeCompare(b.seasons || ''));
  }
  const soccerZh = NBA_DATA.soccerTeamsZh || {};    // 足球球队中文名(displayName -> zh)
  const ttPlayers = NBA_DATA.tt || [];              // 乒乓球
  const bdPlayers = NBA_DATA.bd || [];              // 羽毛球

  const SPORTS = {
    basketball: { label: '篮球', icon: '🏀' },
    football: { label: '足球', icon: '⚽' },
    tt: { label: '乒乓球', icon: '🏓' },
    bd: { label: '羽毛球', icon: '🏸' },
  };
  let sport = 'basketball';

  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  /* 主页 PK 对战台 */
  function renderPkPanel(view) {
    const panel = el('div', 'pk-panel');
    panel.appendChild(el('div', 'pk-panel-title', '⚔️ 球星 PK 对战台'));
    const makeBox = (label) => {
      const box = el('div', 'pk-box');
      const input = el('input', 'pk-box-input');
      input.type = 'text';
      input.placeholder = label;
      const sugg = el('div', 'pk-suggest');
      input.addEventListener('input', () => {
        const rs = search(input.value).slice(0, 6);
        sugg.innerHTML = '';
        if (!rs.length) { sugg.classList.remove('open'); return; }
        for (const r of rs) {
          const it = el('div', 'sug-item');
          it.appendChild(el('span', 'nm', r.name));
          if (r.zh) it.appendChild(el('span', 'zh', r.zh));
          it.appendChild(el('span', 'meta', r.meta));
          it.onclick = () => {
            if (r.slot) addPkSlot(r.slot);
            input.value = r.name;
            sugg.classList.remove('open');
          };
          sugg.appendChild(it);
        }
        sugg.classList.add('open');
      });
      input.addEventListener('focus', () => { if (input.value) { const e2 = new Event('input'); input.dispatchEvent(e2); } });
      document.addEventListener('click', e => { if (!e.target.closest('.pk-box')) sugg.classList.remove('open'); });
      box.appendChild(input);
      box.appendChild(sugg);
      return box;
    };
    panel.appendChild(makeBox('搜索球员 A(如:勒布朗)'));
    panel.appendChild(el('span', 'pk-vs', 'VS'));
    panel.appendChild(makeBox('搜索球员 B(如:库里)'));
    const go = el('button', 'btn-main', '开始 PK');
    go.onclick = () => {
      if (pkSlots.length < 2) { updatePkBar(); return; }
      location.hash = '#/pk';
    };
    panel.appendChild(go);
    view.appendChild(panel);
  }

  /* ---------- 球星 PK(内存态,同运动对战) ---------- */
  let pkSlots = [];
  function addPkSlot(slot) {
    if (pkSlots.some(s => s.hash === slot.hash)) return; // 已在槽中
    if (pkSlots.length >= 2) pkSlots = [];
    if (pkSlots.length && pkSlots[0].sport !== slot.sport) pkSlots = []; // 跨运动则重置
    pkSlots.push(slot);
    updatePkBar();
  }
  function removePkSlot(hash) {
    pkSlots = pkSlots.filter(s => s.hash !== hash);
    updatePkBar();
  }
  function updatePkBar() {
    let bar = $('#pk-bar');
    if (!pkSlots.length) { if (bar) bar.remove(); return; }
    if (!bar) {
      bar = el('div');
      bar.id = 'pk-bar';
      document.body.appendChild(bar);
    }
    bar.innerHTML = '';
    bar.appendChild(el('span', 'pk-title', '⚔️ 球星 PK'));
    for (const s of pkSlots) {
      const chip = el('span', 'pk-slot');
      chip.appendChild(el('span', '', s.zh || s.name));
      const rm = el('span', 'pk-remove', '✕');
      chip.appendChild(rm);
      chip.onclick = e => {
        if (e.target.classList.contains('pk-remove')) removePkSlot(s.hash);
      };
      bar.appendChild(chip);
    }
    const go = el('button', 'btn-main', '开始 PK');
    go.disabled = pkSlots.length < 2;
    go.onclick = () => { location.hash = '#/pk'; };
    bar.appendChild(go);
  }

  /* 球员页 PK 按钮:返回可复用的按钮节点 */
  function pkButton(slot) {
    const inSlots = pkSlots.some(s => s.hash === slot.hash);
    const btn = el('button', 'btn-main fav-btn', inSlots ? '✓ 已选入 PK' : '⚔️ 选入 PK');
    btn.onclick = () => {
      if (inSlots) removePkSlot(slot.hash);
      else addPkSlot(slot);
    };
    return btn;
  }

  /* 足球球队中文名模糊匹配(去重音/大小写),兜底英文 */
  const soccerZhNorm = {};
  for (const k in soccerZh) soccerZhNorm[norm(k)] = soccerZh[k];
  const zhOf = n => soccerZh[n] || soccerZhNorm[norm(n)] || n;

  /* ESPN 篮球数字 ID ↔ 本地 slug 映射 */
  const teamByLiveId = {};
  const liveIdBySlug = {};
  liveIndex.teams.forEach(lt => {
    const t = teams.find(x => x.en === lt.displayName);
    if (t) { teamByLiveId[lt.id] = t; liveIdBySlug[t.id] = lt.id; }
  });
  const liveTeamBySlug = slug => liveIndex.teams.find(x => x.id === liveIdBySlug[slug]) || {};

  /* ---------- API(缓存 + 超时) ---------- */
  const apiCache = new Map();
  async function api(base, path, opts = {}) {
    const url = base + path;
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

  /* ---------- 统计解析:篮球 ---------- */
  function parseBasketball(j) {
    const sp = j.splits || {};
    const cats = {};
    for (const c of sp.categories || []) cats[c.name] = c;
    const val = (cat, name) => { const s = (cats[cat]?.stats || []).find(x => x.name === name); return s ? s.value : null; };
    const gp = val('general', 'gamesPlayed') || 0;
    const points = val('offensive', 'points') ?? 0;
    const rebounds = val('general', 'rebounds') ?? val('general', 'totalRebounds') ?? 0;
    const assists = val('offensive', 'assists') ?? 0;
    const steals = val('defensive', 'steals') ?? 0;
    const blocks = val('defensive', 'blocks') ?? 0;
    const turnovers = val('offensive', 'turnovers') ?? 0;
    const mins = val('general', 'minutes') ?? 0;
    const fgm = val('offensive', 'fieldGoalsMade') ?? 0;
    const fga = val('offensive', 'fieldGoalsAttempted') ?? 0;
    const tpm = val('offensive', 'threePointFieldGoalsMade') ?? 0;
    const tpa = val('offensive', 'threePointFieldGoalsAttempted') ?? 0;
    const ftm = val('offensive', 'freeThrowsMade') ?? 0;
    const fta = val('offensive', 'freeThrowsAttempted') ?? 0;
    return {
      gp, points, rebounds, assists, steals, blocks, turnovers, minutes: mins,
      fgPct: fga ? (fgm / fga * 100) : null, tpPct: tpa ? (tpm / tpa * 100) : null, ftPct: fta ? (ftm / fta * 100) : null,
      avgPoints: gp ? (points / gp) : null, avgReb: gp ? (rebounds / gp) : null,
      avgAst: gp ? (assists / gp) : null, avgMin: gp ? (mins / gp) : null,
    };
  }

  /* ---------- 统计解析:足球 ---------- */
  function parseFootball(j) {
    const sp = j.splits || {};
    const cats = {};
    for (const c of sp.categories || []) cats[c.name] = c;
    const val = (cat, name) => { const s = (cats[cat]?.stats || []).find(x => x.name === name); return s ? s.value : null; };
    return {
      gp: val('general', 'appearances') ?? 0,
      goals: val('offensive', 'totalGoals') ?? 0,
      yellow: val('general', 'yellowCards') ?? 0,
      red: val('general', 'redCards') ?? 0,
    };
  }

  /* ---------- 球员画像背景 ---------- */
  let backdropEl = null;
  function setPlayerBackdrop(url) {
    if (!url) {
      if (backdropEl) { backdropEl.remove(); backdropEl = null; }
      return;
    }
    if (!backdropEl) {
      backdropEl = el('div');
      backdropEl.id = 'player-backdrop';
      document.body.appendChild(backdropEl);
    }
    const img = el('img');
    img.alt = '';
    img.onload = () => backdropEl.classList.add('loaded');
    img.onerror = () => { if (backdropEl) { backdropEl.remove(); backdropEl = null; } };
    backdropEl.innerHTML = '';
    backdropEl.appendChild(img);
    img.src = url; // 先绑事件再设 src,避免缓存命中时错过 onload
    if (img.complete && img.naturalWidth > 0) backdropEl.classList.add('loaded');
  }

  /* ---------- 视图路由 ---------- */
  function render() {
    const hash = location.hash || '#/';
    const parts = hash.replace(/^#\//, '').split('/');
    const view = parts[0] || 'home';
    let sid = null;
    if (view === 'pk') { renderPk(); return; }
    if (view === 'team' || view === 'player') {
      if (parts.length >= 3 && SPORTS[parts[1]]) { sport = parts[1]; sid = parts.slice(2).join('/'); }
      else { sport = 'basketball'; sid = parts[1]; } // 兼容旧链接
    }
    /* 首页:保留当前运动状态(由运动标签切换设置) */
    $('#search-suggest').classList.remove('open');
    setPlayerBackdrop(null);
    syncSportTabs();
    if (view === 'team') renderTeam(sid);
    else if (view === 'player') renderPlayer(sid);
    else renderHome();
    window.scrollTo(0, 0);
  }

  function syncSportTabs() {
    document.querySelectorAll('#sport-tabs .sport-tab').forEach(b => {
      b.classList.toggle('active', b.dataset.sport === sport);
    });
    const sp = SPORTS[sport];
    $('#search-input').placeholder = `搜索${sp.label}运动员(支持中英文)`;
  }

  /* ---------- 首页 ---------- */
  function renderHome() {
    $('#crumb-sep').hidden = true;
    $('#crumb-now').textContent = '';
    const view = $('#view');
    view.innerHTML = '';
    renderPkPanel(view);
    if (sport === 'basketball') renderBasketballHome(view);
    else if (sport === 'football') renderFootballHome(view);
    else renderRacketHome(view); // 乒乓球/羽毛球
  }

  function renderBasketballHome(view) {
    /* 控制条:搜索 + 排序 */
    const controls = el('div', 'home-controls');
    const search = el('input', 'team-search');
    search.type = 'text';
    search.placeholder = '🔍 搜索球队(如:湖人 / Lakers)';
    const sortSel = el('select', 'team-sort');
    const sortOpts = [['default', '默认排序'], ['champs', '冠军数 ↓'], ['founded', '成立年份 ↑'], ['conf', '按赛区']];
    for (const [v, label] of sortOpts) {
      const o = el('option', '', label);
      o.value = v;
      sortSel.appendChild(o);
    }
    controls.appendChild(search);
    controls.appendChild(sortSel);
    view.appendChild(controls);

    const area = el('div');
    view.appendChild(area);

    function drawGrid() {
      area.innerHTML = '';
      const q = norm(search.value);
      let list = teams.filter(t => !q || norm(t.name).includes(q) || norm(t.en).includes(q) || norm(t.city || '').includes(q));
      const sortBy = sortSel.value;
      if (sortBy === 'champs') list = [...list].sort((a, b) => (b.champs || 0) - (a.champs || 0));
      else if (sortBy === 'founded') list = [...list].sort((a, b) => a.founded - b.founded);
      else if (sortBy === 'conf') list = [...list].sort((a, b) => (a.conf + a.div).localeCompare(b.conf + b.div));
      if (sortBy === 'conf' || sortBy === 'default') {
        for (const conf of ['东部', '西部']) {
          const sub = list.filter(t => t.conf === conf);
          if (!sub.length) continue;
          area.appendChild(el('div', 'conf-title', conf + '联盟'));
          area.appendChild(buildTeamGrid(sub, t => '#/team/' + t.id));
        }
      } else {
        area.appendChild(buildTeamGrid(list, t => '#/team/' + t.id));
      }
    }
    search.addEventListener('input', drawGrid);
    sortSel.addEventListener('change', drawGrid);
    drawGrid();
  }

  function buildTeamGrid(list, hashOf) {
    const grid = el('div', 'team-grid');
    list.forEach((t, i) => {
      const live = liveTeamBySlug(t.id);
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
      card.onclick = () => { location.hash = hashOf(t); };
      grid.appendChild(card);
    });
    return grid;
  }

  function renderFootballHome(view) {
    /* 控制条:搜索 + 排序 */
    const controls = el('div', 'home-controls');
    const search = el('input', 'team-search');
    search.type = 'text';
    search.placeholder = '🔍 搜索球队(如:皇马 / 迈阿密 / Real)';
    const sortSel = el('select', 'team-sort');
    const sortOpts = [['league', '按联赛(默认)'], ['name', '按队名']];
    for (const [v, label] of sortOpts) {
      const o = el('option', '', label);
      o.value = v;
      sortSel.appendChild(o);
    }
    controls.appendChild(search);
    controls.appendChild(sortSel);
    view.appendChild(controls);

    const area = el('div');
    view.appendChild(area);

    function drawGrid() {
      area.innerHTML = '';
      const q = norm(search.value);
      const all = [];
      for (const lg of soccerIndex.leagues)
        for (const t of lg.teams) {
          const zh = zhOf(t.displayName);
          const id = lg.id + ':' + t.id;
          const rosterN = soccerIndex.players.filter(p => p.league === lg.id && p.team === t.id).length;
          const aliases = NBA_DATA.soccerTeamAliases || {};
          const aliasHit = aliases[q] && aliases[q] === zh;
          if (q && !(norm(zh).includes(q) || norm(t.displayName).includes(q) || aliasHit)) continue;
          all.push({ lg, t, zh, id, rosterN });
        }
      if (sortSel.value === 'name') all.sort((a, b) => a.zh.localeCompare(b.zh, 'zh-Hans-CN'));
      else all.sort((a, b) => a.lg.zh.localeCompare(b.lg.zh, 'zh-Hans-CN'));
      /* 分组渲染 */
      let lastLg = null, grid = null;
      for (const item of all) {
        if (item.lg.id !== lastLg) {
          lastLg = item.lg.id;
          area.appendChild(el('div', 'conf-title', item.lg.zh + ' · ' + item.lg.teams.length + ' 队'));
          grid = el('div', 'team-grid');
          area.appendChild(grid);
        }
        const card = el('div', 'team-card');
        card.style.setProperty('--tc', '#c95a24');
        card.appendChild(el('div', 'abbr', (item.t.abbreviation || item.t.name).slice(0, 3).toUpperCase()));
        card.appendChild(el('div', 'tname', item.zh));
        card.appendChild(el('div', 'tcity', item.t.displayName));
        const meta = el('div', 'tmeta');
        meta.appendChild(el('span', 'chip orange', '📍 ' + (item.t.arena || item.t.location || '')));
        meta.appendChild(el('span', 'chip', '👥 ' + item.rosterN + ' 人'));
        card.appendChild(meta);
        card.onclick = () => { location.hash = '#/team/football/' + item.id; };
        grid.appendChild(card);
      }
    }
    search.addEventListener('input', drawGrid);
    sortSel.addEventListener('change', drawGrid);
    drawGrid();
  }

  function renderRacketHome(view) {
    const data = sport === 'tt' ? ttPlayers : bdPlayers;
    const title = sport === 'tt' ? '中国乒乓 & 世界名将' : '羽坛名将';
    view.appendChild(el('div', 'conf-title', title));
    const controls = el('div', 'home-controls');
    const search = el('input', 'team-search');
    search.type = 'text';
    search.placeholder = '🔍 搜索名将(如:马龙 / 林丹)';
    controls.appendChild(search);
    view.appendChild(controls);
    const grid = el('div', 'player-chip-grid');
    function drawGrid() {
      grid.innerHTML = '';
      const q = norm(search.value);
      data.filter(p => !q || norm(p.name).includes(q) || norm(p.zh).includes(q) || norm(p.team).includes(q))
        .forEach((p, idx) => {
          const realIdx = data.indexOf(p);
          const chip = el('div', 'player-chip fade-in stagger-' + Math.min(3, idx % 3 + 1));
          chip.appendChild(portraitThumb(p.name));
          chip.appendChild(el('span', 'jersey', p.sex === '女' ? '♀' : '♂'));
          const nmWrap = el('div', '');
          nmWrap.appendChild(el('div', 'nm', p.zh + ' · ' + p.name));
          nmWrap.appendChild(el('div', 'zh', p.team + (p.event ? ' · ' + p.event : '')));
          chip.appendChild(nmWrap);
          chip.appendChild(el('span', 'ps', p.career.peakRank));
          chip.onclick = () => { location.hash = '#/player/' + sport + '/' + realIdx; };
          grid.appendChild(chip);
        });
    }
    search.addEventListener('input', drawGrid);
    drawGrid();
    view.appendChild(grid);
  }

  /* ---------- 球队详情 ---------- */
  function renderTeam(id) {
    if (sport === 'football') return renderFootballTeam(id);
    const t = teams.find(x => x.id === id);
    const view = $('#view');
    if (!t) { view.innerHTML = ''; view.appendChild(el('div', 'error-box', '未找到该球队')); return; }
    $('#crumb-sep').hidden = false;
    $('#crumb-now').textContent = t.name;
    const live = liveTeamBySlug(id);
    view.innerHTML = '';
    const head = el('div', 'detail-head');
    head.style.setProperty('--tc', t.colors[0]);
    head.appendChild(el('div', 'team-logo-badge', t.en.split(' ').pop().slice(0, 2).toUpperCase()));
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

    const roster = liveIndex.players.filter(p => p.team === (live.id || ''));
    view.appendChild(el('div', 'section-title', '🧑‍🎤 现役阵容 (' + roster.length + ' 人)'));
    if (!roster.length) {
      view.appendChild(el('div', 'hint-box', '名单索引中暂无该队球员'));
    } else {
      const grid = el('div', 'player-chip-grid');
      roster.forEach(p => {
        const chip = el('div', 'player-chip');
        chip.appendChild(headshotThumb(p, 'nba'));
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
  }

  function renderFootballTeam(id) {
    const [lgId, tId] = String(id).split(':');
    const lg = soccerIndex.leagues.find(l => l.id === lgId);
    const t = lg ? lg.teams.find(x => x.id === tId) : null;
    const view = $('#view');
    if (!t) { view.innerHTML = ''; view.appendChild(el('div', 'error-box', '未找到该球队')); return; }
    $('#crumb-sep').hidden = false;
    $('#crumb-now').textContent = zhOf(t.displayName);
    view.innerHTML = '';
    const head = el('div', 'detail-head');
    head.style.setProperty('--tc', '#c95a24');
    head.appendChild(el('div', 'team-logo-badge', (t.abbreviation || t.name).slice(0, 2).toUpperCase()));
    const info = el('div', '');
    info.appendChild(el('h2', '', zhOf(t.displayName)));
    info.appendChild(el('div', 'en', t.displayName + ' · ' + lg.zh));
    const facts = el('div', 'facts');
    facts.appendChild(el('span', 'chip orange', '🏟️ ' + (t.arena || t.location || '—')));
    facts.appendChild(el('span', 'chip', '联赛: ' + lg.zh));
    info.appendChild(facts);
    const zhT = zhOf(t.displayName);
    head.appendChild(info);
    view.appendChild(head);

    const roster = soccerIndex.players.filter(p => p.league === lgId && p.team === tId);
    view.appendChild(el('div', 'section-title', '👥 现役阵容 (' + roster.length + ' 人)'));
    const grid = el('div', 'player-chip-grid');
    roster.forEach(p => {
      const chip = el('div', 'player-chip');
      chip.appendChild(headshotThumb(p, 'soccer'));
      chip.appendChild(el('span', 'jersey', '#' + (p.jersey || '–')));
      const nmWrap = el('div', '');
      nmWrap.appendChild(el('div', 'nm', p.name));
      if (p.zh) nmWrap.appendChild(el('div', 'zh', p.zh));
      chip.appendChild(nmWrap);
      chip.appendChild(el('span', 'ps', p.pos || ''));
      chip.onclick = () => { location.hash = '#/player/football/' + p.league + ':' + p.id; };
      grid.appendChild(chip);
    });
    view.appendChild(grid);
  }

  /* ---------- 球员详情 ---------- */
  async function renderPlayer(id) {
    const view = $('#view');
    $('#crumb-sep').hidden = false;
    view.innerHTML = '';
    view.appendChild(el('div', 'loading', '正在拉取数据'));

    if (sport === 'tt' || sport === 'bd') {
      const data = sport === 'tt' ? ttPlayers : bdPlayers;
      const p = data[parseInt(id, 10)];
      if (p) renderRacketPlayer(p);
      else { view.innerHTML = ''; view.appendChild(el('div', 'error-box', '未找到该运动员')); }
      return;
    }
    if (sport === 'football') { await renderFootballPlayer(id); return; }

    /* ---- 篮球 ---- */
    const legIdx = id.startsWith('L') ? parseInt(id.slice(1), 10) : -1;
    if (legIdx >= 0 && legends[legIdx]) { renderLegend(legends[legIdx]); return; }
    const meta = liveIndex.players.find(p => p.id === id);
    if (!meta) {
      view.innerHTML = '';
      view.appendChild(el('div', 'error-box', '名单索引中未找到该球员。'));
      return;
    }
    $('#crumb-now').textContent = meta.name;

    const [careerJ, curJ, lastJ, detailJ] = await Promise.allSettled([
      api(API_BASE.basketball, '/athletes/' + id + '/statistics/0'),
      api(API_BASE.basketball, '/seasons/' + CUR_SEASON + '/types/2/athletes/' + id + '/statistics'),
      api(API_BASE.basketball, '/seasons/' + (CUR_SEASON - 1) + '/types/2/athletes/' + id + '/statistics'),
      api(API_BASE.basketball, '/athletes/' + id),
    ]);
    if (detailJ.status === 'fulfilled' && detailJ.value?.headshot?.href) setPlayerBackdrop(detailJ.value.headshot.href);
    else if (portraits[meta.name]) setPlayerBackdrop(portraits[meta.name].file);
    const career = careerJ.status === 'fulfilled' ? parseBasketball(careerJ.value) : null;
    const cur = curJ.status === 'fulfilled' && curJ.value && !curJ.value.error ? parseBasketball(curJ.value) : null;
    const last = lastJ.status === 'fulfilled' && lastJ.value && !lastJ.value.error ? parseBasketball(lastJ.value) : null;

    const hn = honors.find(h => norm(h.name) === norm(meta.name)) || honors.find(h => norm(h.name).includes(norm(meta.name.split(' ')[1] || '')));

    view.innerHTML = '';
    const hero = el('div', 'player-hero');
    const team = teamByLiveId[meta.team];
    hero.style.setProperty('--tc', team ? team.colors[0] : '#c95a24');
    hero.appendChild(el('div', 'avatar', (meta.name[0] || '?').toUpperCase()));
    const info = el('div', '');
    info.appendChild(el('h2', '', meta.name));
    info.appendChild(el('div', 'zh-name', (meta.zh || hn?.zh || '') + (team ? ' · ' + team.name : '')));
    const ml = el('div', 'meta-line');
    ml.appendChild(el('span', 'chip orange', '位置 ' + (meta.pos || '—')));
    ml.appendChild(el('span', 'chip', '球衣 #' + (meta.jersey || '—')));
    ml.appendChild(el('span', 'chip gold', '🏀 实时数据'));
    info.appendChild(ml);
    info.appendChild(pkButton({ sport: 'basketball', kind: 'bb', id: meta.id, name: meta.name, zh: meta.zh || hn?.zh || '', hash: '#/player/' + meta.id }));
    hero.appendChild(info);
    view.appendChild(hero);

    if (hn && hn.honors.length) {
      const strip = el('div', 'honor-strip');
      hn.honors.forEach(h => strip.appendChild(el('span', 'honor-badge', h)));
      view.appendChild(strip);
    }

    const cards = el('div', 'stats-cards');
    const curCard = el('div', 'stats-card');
    curCard.appendChild(el('h3', '', '📡 当赛季 (2026-27)'));
    if (cur && cur.gp > 0) {
      curCard.appendChild(basketballGrid(cur, true));
      curCard.appendChild(el('div', 'note', '数据实时来自 ESPN · 常规赛进行中'));
    } else if (!cur) {
      curCard.appendChild(el('div', 'hint-box', '2026-27 常规赛尚未开赛,以下为 2025-26 赛季数据:'));
      if (last && last.gp > 0) curCard.appendChild(basketballGrid(last, true));
      else curCard.appendChild(el('div', 'error-box', '上赛季数据暂不可用'));
    } else {
      curCard.appendChild(el('div', 'hint-box', '该球员本赛季暂无常规赛出场记录'));
      if (last && last.gp > 0) { curCard.appendChild(el('div', 'note', '最近一季 (2025-26):')); curCard.appendChild(basketballGrid(last, true)); }
    }
    cards.appendChild(curCard);

    const carCard = el('div', 'stats-card');
    carCard.appendChild(el('h3', '', '📜 生涯数据'));
    if (career && career.gp > 0) {
      carCard.appendChild(basketballGrid(career, false));
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

  async function renderFootballPlayer(id) {
    const view = $('#view');
    /* 足球名宿(本地数据) */
    const legIdx = id.startsWith('L') ? parseInt(id.slice(1), 10) : -1;
    if (legIdx >= 0 && soccerLegends[legIdx]) {
      renderSoccerLegend(soccerLegends[legIdx]);
      return;
    }
    const [lgId, pid] = String(id).split(':');
    const meta = soccerIndex.players.find(p => p.league === lgId && p.id === pid);
    if (!meta) {
      view.innerHTML = '';
      view.appendChild(el('div', 'error-box', '未找到该球员。'));
      return;
    }
    $('#crumb-now').textContent = meta.name;

    const statsJ = await Promise.allSettled([
      api(API_BASE.football, '/' + lgId + '/athletes/' + pid + '/statistics/0'),
      api(API_BASE.football, '/' + lgId + '/athletes/' + pid),
    ]);
    const stats = statsJ[0].status === 'fulfilled' ? parseFootball(statsJ[0].value) : null;
    if (statsJ[1].status === 'fulfilled' && statsJ[1].value?.headshot?.href) setPlayerBackdrop(statsJ[1].value.headshot.href);
    else if (portraits[meta.name]) setPlayerBackdrop(portraits[meta.name].file);
    const hn = soccerHonors.find(h => norm(h.name) === norm(meta.name)) || soccerHonors.find(h => norm(h.name).includes(norm(meta.name.split(' ')[1] || '')));

    view.innerHTML = '';
    const hero = el('div', 'player-hero');
    hero.style.setProperty('--tc', '#c95a24');
    hero.appendChild(el('div', 'avatar', (meta.name[0] || '?').toUpperCase()));
    const info = el('div', '');
    info.appendChild(el('h2', '', meta.name));
    info.appendChild(el('div', 'zh-name', (meta.zh || hn?.zh || '') + ' · ' + meta.teamName + ' · ' + meta.leagueZh));
    const ml = el('div', 'meta-line');
    ml.appendChild(el('span', 'chip orange', '位置 ' + (meta.pos || '—')));
    ml.appendChild(el('span', 'chip', '球衣 #' + (meta.jersey || '—')));
    ml.appendChild(el('span', 'chip gold', '⚽ 实时数据'));
    info.appendChild(ml);
    info.appendChild(pkButton({ sport: 'football', kind: 'fb', id: pid, lg: lgId, lgZh: meta.leagueZh, name: meta.name, zh: meta.zh || hn?.zh || '', hash: '#/player/football/' + lgId + ':' + pid }));
    hero.appendChild(info);
    view.appendChild(hero);

    if (hn && hn.honors.length) {
      const strip = el('div', 'honor-strip');
      hn.honors.forEach(h => strip.appendChild(el('span', 'honor-badge', h)));
      view.appendChild(strip);
    }

    const cards = el('div', 'stats-cards');
    const carCard = el('div', 'stats-card');
    carCard.appendChild(el('h3', '', '📜 现役联赛生涯(ESPN 实时)'));
    if (stats && stats.gp > 0) {
      const g = el('div', 'stat-grid');
      const cell = (v, k) => { const c = el('div', 'stat-cell'); c.appendChild(el('div', 'v', v)); c.appendChild(el('div', 'k', k)); g.appendChild(c); };
      cell(stats.gp, '出场'); cell(stats.goals, '总进球'); cell(stats.yellow, '黄牌'); cell(stats.red, '红牌');
      carCard.appendChild(g);
      carCard.appendChild(el('div', 'note', '注意:ESPN 足球数据按联赛分账,此处仅「' + meta.leagueZh + '」时期 · 足球接口不含助攻字段'));
    } else {
      carCard.appendChild(el('div', 'error-box', '生涯数据暂不可用'));
    }
    cards.appendChild(carCard);

    /* 分时期数据(跨联赛全生涯) */
    const periods = mergedPeriods(meta.name);
    if (periods && periods.length >= 1) {
      const pCard = el('div', 'stats-card');
      pCard.appendChild(el('h3', '', '📅 分时期全记录(跨联赛)'));
      const rows = el('div', 'stat-rows');
      for (const p of periods) {
        const r = el('div', 'stat-row');
        r.appendChild(el('span', '', p.league + ' · ' + p.seasons + (p.curated ? ' *' : '')));
        r.appendChild(el('b', '', p.apps + ' 场 · ' + p.goals + ' 球'));
        rows.appendChild(r);
      }
      pCard.appendChild(rows);
      pCard.appendChild(el('div', 'note', '* 为人工整理的历史时期(ESPN 历史窗口外的记录);其余为 ESPN 实时数据'));
      cards.appendChild(pCard);
    }
    view.appendChild(cards);
  }

  function renderSoccerLegend(L) {
    const view = $('#view');
    $('#crumb-now').textContent = L.zh;
    view.innerHTML = '';
    const pt = portraits[L.name];
    if (pt) setPlayerBackdrop(pt.file);
    const hero = el('div', 'player-hero');
    hero.style.setProperty('--tc', '#c95a24');
    hero.appendChild(el('div', 'avatar', L.zh[0]));
    const info = el('div', '');
    info.appendChild(el('h2', '', L.zh + ' · ' + L.name));
    info.appendChild(el('div', 'zh-name', L.pos + ' · ' + L.team + ' · 已退役'));
    const ml = el('div', 'meta-line');
    ml.appendChild(el('span', 'chip gold', '⚽ 足球名宿'));
    info.appendChild(ml);
    info.appendChild(pkButton({ sport: 'basketball', kind: 'legend', hash: location.hash, name: L.name, zh: L.zh, static: L }));
    hero.appendChild(info);
    view.appendChild(hero);

    const strip = el('div', 'honor-strip');
    L.honors.forEach(h => strip.appendChild(el('span', 'honor-badge', h)));
    view.appendChild(strip);

    const cards = el('div', 'stats-cards');
    const carCard = el('div', 'stats-card');
    carCard.appendChild(el('h3', '', '📜 生涯数据(人工整理)'));
    const g = el('div', 'stat-grid');
    const cell = (v, k) => { const c = el('div', 'stat-cell'); c.appendChild(el('div', 'v', v)); c.appendChild(el('div', 'k', k)); g.appendChild(c); };
    cell(L.career.goals || '—', '生涯进球'); cell(L.pos, '位置');
    carCard.appendChild(g);
    const rows = el('div', 'stat-rows');
    rows.appendChild(statRow('国家队记录', L.career.intl));
    rows.appendChild(statRow('生涯点评', L.career.note));
    carCard.appendChild(rows);
    carCard.appendChild(el('div', 'note', '名宿数据为本地名宿库整理(生涯进球为约数)'));
    cards.appendChild(carCard);

    /* 名宿也有分时期记录(C罗/内马尔等) */
    const periods = mergedPeriods(L.name);
    if (periods && periods.length) {
      const pCard = el('div', 'stats-card');
      pCard.appendChild(el('h3', '', '📅 分时期全记录(跨联赛)'));
      const prows = el('div', 'stat-rows');
      for (const p of periods) {
        const r = el('div', 'stat-row');
        r.appendChild(el('span', '', p.league + ' · ' + p.seasons + (p.curated ? ' *' : '')));
        r.appendChild(el('b', '', p.apps + ' 场 · ' + p.goals + ' 球'));
        prows.appendChild(r);
      }
      pCard.appendChild(prows);
      pCard.appendChild(el('div', 'note', '* 为人工整理的历史时期;其余为 ESPN 实时数据'));
      cards.appendChild(pCard);
    }
    view.appendChild(cards);
  }

  function renderRacketPlayer(p) {
    const view = $('#view');
    $('#crumb-now').textContent = p.zh;
    view.innerHTML = '';
    const pt = portraits[p.name];
    if (pt) setPlayerBackdrop(pt.file);
    const hero = el('div', 'player-hero');
    hero.style.setProperty('--tc', '#c95a24');
    hero.appendChild(el('div', 'avatar', p.zh[0]));
    const info = el('div', '');
    info.appendChild(el('h2', '', p.zh + ' · ' + p.name));
    info.appendChild(el('div', 'zh-name', p.team + ' · ' + (p.event || (p.sex === '女' ? '女子' : '男子'))));
    const ml = el('div', 'meta-line');
    ml.appendChild(el('span', 'chip orange', (p.style || p.event || '')));
    ml.appendChild(el('span', 'chip gold', (sport === 'tt' ? '🏓' : '🏸') + ' ' + SPORTS[sport].label + '名将'));
    info.appendChild(ml);
    info.appendChild(pkButton({ sport, kind: 'racket', hash: '#/player/' + sport + '/' + id, name: p.name, zh: p.zh, static: p }));
    hero.appendChild(info);
    view.appendChild(hero);

    const strip = el('div', 'honor-strip');
    p.honors.forEach(h => strip.appendChild(el('span', 'honor-badge', h)));
    view.appendChild(strip);

    const cards = el('div', 'stats-cards');
    const carCard = el('div', 'stats-card');
    carCard.appendChild(el('h3', '', '📜 生涯战绩(人工整理)'));
    const g = el('div', 'stat-grid');
    const cell = (v, k) => { const c = el('div', 'stat-cell'); c.appendChild(el('div', 'v', v)); c.appendChild(el('div', 'k', k)); g.appendChild(c); };
    cell(p.career.olympicGold, '奥运金牌'); cell(p.career.worldTitles, '世界冠军数'); cell(p.career.peakRank, '最高排名'); cell(p.sex === '女' ? '女子' : '男子', '组别');
    carCard.appendChild(g);
    const rows = el('div', 'stat-rows');
    rows.appendChild(statRow('所属协会', p.team));
    rows.appendChild(statRow('技术特点', p.style || p.event || '—'));
    rows.appendChild(statRow('生涯点评', p.note));
    carCard.appendChild(rows);
    carCard.appendChild(el('div', 'note', '乒乓球/羽毛球无公开实时数据接口,荣誉与战绩为人工整理'));
    cards.appendChild(carCard);
    view.appendChild(cards);
  }

  function renderLegend(L) {
    const view = $('#view');
    $('#crumb-now').textContent = L.name;
    view.innerHTML = '';
    const pt = portraits[L.name];
    if (pt) setPlayerBackdrop(pt.file);
    const hero = el('div', 'player-hero');
    hero.appendChild(el('div', 'avatar', (L.name[0] || '?').toUpperCase()));
    const info = el('div', '');
    info.appendChild(el('h2', '', L.name));
    info.appendChild(el('div', 'zh-name', L.zh + ' · ' + L.team));
    const ml = el('div', 'meta-line');
    ml.appendChild(el('span', 'chip orange', '位置 ' + L.pos));
    ml.appendChild(el('span', 'chip', '已退役'));
    info.appendChild(ml);
    info.appendChild(pkButton({ sport: 'football', kind: 'legend', hash: location.hash, name: L.name, zh: L.zh, static: L }));
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

  /* ---------- 组件 ---------- */
  function basketballGrid(s, perGame) {
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
  /* 头像缩略图回退链:ESPN 索引内 URL → 维基自托管照片 → NBA 固定模式 → 首字母 */
  function headshotThumb(p, sport) {
    const wrap = el('div', 'ph');
    wrap.appendChild(el('span', '', (p.name || '?')[0].toUpperCase()));
    const url = p.local
      || p.hs
      || (portraits[p.name] ? portraits[p.name].file : null)
      || (sport === 'nba' ? `https://a.espncdn.com/i/headshots/nba/players/full/${p.id}.png` : null);
    if (!url) { wrap.classList.add('fail'); return wrap; }
    const img = el('img');
    img.loading = 'lazy';
    img.alt = '';
    img.onload = () => wrap.classList.add('ok');
    img.onerror = () => { wrap.classList.add('fail'); };
    wrap.appendChild(img);
    img.src = url;
    if (img.complete && img.naturalWidth > 0) wrap.classList.add('ok');
    return wrap;
  }
  /* 维基自托管照片:缩略图(名宿/乒乓/羽毛球用) */
  function portraitThumb(name) {
    const pt = portraits[name];
    const wrap = el('div', 'ph');
    wrap.appendChild(el('span', '', (name || '?')[0].toUpperCase()));
    if (!pt) { wrap.classList.add('fail'); return wrap; }
    const img = el('img');
    img.loading = 'lazy';
    img.alt = '';
    img.onload = () => wrap.classList.add('ok');
    img.onerror = () => { wrap.classList.add('fail'); };
    wrap.appendChild(img);
    img.src = pt.file;
    if (img.complete && img.naturalWidth > 0) wrap.classList.add('ok');
    return wrap;
  }


  /* ---------- PK 对战视图 ---------- */
  async function renderPk() {
    const view = $('#view');
    $('#crumb-sep').hidden = false;
    $('#crumb-now').textContent = '球星 PK';
    view.innerHTML = '';
    if (pkSlots.length < 2) {
      view.appendChild(el('div', 'hint-box', '请先在球员页选择两位「⚔️ 选入 PK」的同运动球员'));
      return;
    }
    view.appendChild(el('div', 'loading', '数据加载中'));

    /* 汇总两方数据 */
    const rows = []; // {label, a, b, lowerBetter}
    const heads = [];
    for (const s of pkSlots) {
      let head = { name: s.name, zh: s.zh || '', sub: s.kind };
      if (s.kind === 'bb') {
        const j = await api(API_BASE.basketball, '/athletes/' + s.id + '/statistics/0');
        const st = parseBasketball(j);
        s.st = st;
        head.sub = '篮球 · 生涯数据';
      } else if (s.kind === 'fb') {
        const j = await api(API_BASE.football, '/' + s.lg + '/athletes/' + s.id + '/statistics/0');
        s.st = parseFootball(j);
        head.sub = '足球 · ' + s.lgZh + '生涯';
      }
      heads.push(head);
    }
    const [A, B] = pkSlots;

    function row(label, get, lowerBetter) {
      rows.push({ label, a: get(A), b: get(B), lowerBetter });
    }
    if (A.kind === 'bb' && B.kind === 'bb') {
      row('场均得分', s => s.st.avgPoints ?? 0);
      row('场均篮板', s => s.st.avgReb ?? 0);
      row('场均助攻', s => s.st.avgAst ?? 0);
      row('投篮命中率', s => s.st.fgPct ?? 0);
      row('生涯总得分', s => s.st.points);
      row('生涯总篮板', s => s.st.rebounds);
      row('生涯总助攻', s => s.st.assists);
      row('生涯场次', s => s.st.gp);
    } else if (A.kind === 'fb' && B.kind === 'fb') {
      row('出场', s => s.st.gp);
      row('总进球', s => s.st.goals);
      row('黄牌', s => s.st.yellow, true);
      row('红牌', s => s.st.red, true);
    } else if (A.kind === 'racket' && B.kind === 'racket') {
      row('奥运金牌', s => s.static.career.olympicGold);
      row('世界冠军数', s => s.static.career.worldTitles);
    } else if (A.kind === 'legend' && B.kind === 'legend') {
      if (A.sport === 'basketball') {
        row('场均得分', s => s.static.career.ppg);
        row('场均篮板', s => s.static.career.rpg);
        row('场均助攻', s => s.static.career.apg);
        row('生涯总得分', s => s.static.career.pts);
      } else {
        row('生涯进球', s => s.static.career.goals);
      }
    }
    if (A.sport === B.sport) {
      const honorsCount = s => (s.static && s.static.honors ? s.static.honors.length : (s.kind === 'bb' || s.kind === 'fb' ? (s.kind === 'bb' ? (honors.find(h => norm(h.name) === norm(s.name))?.honors.length || 0) : (soccerHonors.find(h => norm(h.name) === norm(s.name))?.honors.length || 0)) : 0));
      row('荣誉数量', honorsCount);
    }

    view.innerHTML = '';
    const grid = el('div', 'pk-grid');
    for (const [i, s] of [A, B].entries()) {
      const card = el('div', 'pk-hero');
      const pt = portraits[s.name];
      if (pt) {
        const ph = el('img', 'pk-photo');
        ph.src = pt.file;
        card.appendChild(ph);
      }
      card.appendChild(el('h2', '', s.zh || s.name));
      card.appendChild(el('div', 'zh-name', heads[i].sub));
      grid.appendChild(card);
    }
    view.appendChild(grid);

    const table = el('div', 'pk-compare');
    table.appendChild(el('div', 'pk-row pk-head', ''));
    for (const r of rows) {
      const tr = el('div', 'pk-row');
      tr.appendChild(el('span', 'pk-label', r.label));
      const va = el('span', 'pk-val'); va.textContent = fmtPk(r.a);
      const vb = el('span', 'pk-val'); vb.textContent = fmtPk(r.b);
      if (r.a !== r.b) {
        if (r.lowerBetter ? r.a < r.b : r.a > r.b) va.classList.add('win');
        else vb.classList.add('win');
      }
      tr.appendChild(va);
      tr.appendChild(vb);
      table.appendChild(tr);
    }
    view.appendChild(table);
    const back = el('button', 'btn-main', '← 返回');
    back.onclick = () => { location.hash = '#/'; };
    view.appendChild(back);
  }
  function fmtPk(v) {
    if (v == null) return '–';
    if (typeof v === 'number' && !Number.isInteger(v)) return v.toFixed(1);
    return String(v);
  }
  /* ---------- 搜索 ---------- */
  function search(q) {
    q = norm(q.trim());
    if (!q) return [];
    const out = [];
    if (sport === 'basketball') {
      for (const p of liveIndex.players) {
        if (norm(p.name).includes(q) || (p.zh && p.zh.includes(q))) {
          const hash = '#/player/' + p.id;
          out.push({ name: p.name, zh: p.zh, meta: (p.pos || '') + ' · ' + (teamByLiveId[p.team]?.name || ''), hash,
            slot: { sport: 'basketball', kind: 'bb', id: p.id, name: p.name, zh: p.zh || '', hash } });
        }
        if (out.length >= 30) return out;
      }
      legends.forEach((L, i) => {
        if (out.length >= 30) return;
        if (norm(L.name).includes(q) || norm(L.zh).includes(q)) {
          const hash = '#/player/L' + i;
          out.push({ name: L.name, zh: L.zh, meta: '名宿 · ' + L.team, hash,
            slot: { sport: 'basketball', kind: 'legend', name: L.name, zh: L.zh, hash, static: L } });
        }
      });
    } else if (sport === 'football') {
      for (const p of soccerIndex.players) {
        if (norm(p.name).includes(q) || (p.zh && p.zh.includes(q))) {
          const hash = '#/player/football/' + p.league + ':' + p.id;
          out.push({ name: p.name, zh: p.zh, meta: (p.pos || '') + ' · ' + p.teamName, hash,
            slot: { sport: 'football', kind: 'fb', id: p.id, lg: p.league, lgZh: p.leagueZh, name: p.name, zh: p.zh || '', hash } });
        }
        if (out.length >= 30) return out;
      }
      soccerLegends.forEach((L, i) => {
        if (out.length >= 30) return;
        if (norm(L.name).includes(q) || norm(L.zh).includes(q)) {
          const hash = '#/player/football/L' + i;
          out.push({ name: L.zh + ' · ' + L.name, zh: '名宿 · ' + L.team, meta: L.pos, hash,
            slot: { sport: 'football', kind: 'legend', name: L.name, zh: L.zh, hash, static: L } });
        }
      });
    } else {
      const data = sport === 'tt' ? ttPlayers : bdPlayers;
      data.forEach((p, i) => {
        if (norm(p.name).includes(q) || norm(p.zh).includes(q) || (p.team && norm(p.team).includes(q))) {
          const hash = '#/player/' + sport + '/' + i;
          out.push({ name: p.zh + ' · ' + p.name, zh: p.team + (p.event ? ' · ' + p.event : ''), meta: p.career.peakRank, hash,
            slot: { sport, kind: 'racket', name: p.name, zh: p.zh, hash, static: p } });
        }
      });
    }
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
      it.onclick = () => { location.hash = r.hash; input.value = ''; };
      sugg.appendChild(it);
    });
    sugg.classList.add('open');
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const rs = search(input.value);
      if (rs.length) { location.hash = rs[0].hash; input.value = ''; }
    } else if (e.key === 'Escape') { sugg.classList.remove('open'); }
  });
  document.addEventListener('click', e => { if (!e.target.closest('#search-wrap')) sugg.classList.remove('open'); });

  /* 运动切换 */
  document.querySelectorAll('.sport-tab').forEach(b => {
    b.addEventListener('click', () => {
      sport = b.dataset.sport;
      location.hash = '#/';
      if (location.hash === '#/' || location.hash === '') render();
    });
  });

  window.addEventListener('hashchange', render);
  render();
})();
