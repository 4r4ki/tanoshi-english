(() => {
  'use strict';

  // ---------- データ ----------
  const ALL = [];
  CATEGORIES.forEach(c => c.words.forEach(([w, ja, emoji, kana, ex, exJa, color]) => {
    ALL.push({ w, ja, emoji, kana, ex, exJa, color, cat: c.id });
  }));
  const CAT = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

  // ふくしゅうの間かく（日）。box が上がるほど、次に出るのがあとになる
  const INTERVALS = [0, 1, 3, 7, 14, 30];
  const LEARNED_BOX = 3; // ここまで来たら「おぼえた」シール
  const MASTER_BOX = 5;  // ここまで来たら金のシール
  const KEY = 'eitango-tomodachi-v1';

  // ---------- 保存 ----------
  const DEFAULT_SETTINGS = { slow: false, kana: true, sfx: true };
  let S = load();
  function load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* 保存できない環境でも動かす */ }
    s = Object.assign({ words: {}, stars: 0, streak: 0, lastDay: null }, s || {});
    s.settings = Object.assign({}, DEFAULT_SETTINGS, s.settings || {});
    return s;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* noop */ }
  }

  function today() {
    const d = new Date();
    return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
  }
  const rec = w => S.words[w];
  const isLearned = w => !!rec(w) && rec(w).box >= LEARNED_BOX;
  const isMaster = w => !!rec(w) && rec(w).box >= MASTER_BOX;
  const streakNow = () => (S.lastDay !== null && S.lastDay >= today() - 1) ? S.streak : 0;

  function dueWords() {
    const t = today();
    return ALL.filter(x => rec(x.w) && rec(x.w).due <= t).sort((a, b) => rec(a.w).due - rec(b.w).due);
  }
  const newWords = () => ALL.filter(x => !rec(x.w));

  // ---------- 小さな道具 ----------
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const wordRe = w => new RegExp('\\b(' + w + ')\\b', 'i');

  // 例文のなかの単語に印をつける / 空らんにする
  function markSentence(x, mode) {
    const html = esc(x.ex);
    return html.replace(wordRe(x.w), m => mode === 'blank' ? '<span class="blank" id="blank">&nbsp;</span>' : '<mark>' + m + '</mark>');
  }

  // ---------- 音 ----------
  let voice = null;
  const canSpeak = 'speechSynthesis' in window;
  function pickVoice() {
    const vs = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang));
    voice = vs.find(v => /en[-_]US/i.test(v.lang) && /(Samantha|Google|Jenny|Aria|Ava|Zira)/i.test(v.name))
      || vs.find(v => /en[-_]US/i.test(v.lang)) || vs[0] || null;
  }
  if (canSpeak) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(text, slow) {
    if (!canSpeak) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    if (voice) u.voice = voice;
    u.rate = (slow || S.settings.slow) ? 0.6 : 0.9;
    speechSynthesis.speak(u);
  }

  let actx = null;
  function tone(freqs, dur, type, gap) {
    if (!S.settings.sfx) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = actx.currentTime;
      freqs.forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain();
        const t = t0 + i * gap;
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(actx.destination);
        o.start(t); o.stop(t + dur + 0.05);
      });
    } catch (e) { /* noop */ }
  }
  const sfx = {
    ok: () => tone([660, 880], 0.16, 'triangle', 0.1),
    ng: () => tone([233, 196], 0.2, 'sine', 0.15),
    tap: () => tone([560], 0.06, 'triangle', 0),
    fanfare: () => tone([523, 659, 784, 1047], 0.24, 'triangle', 0.13),
  };

  function confetti() {
    const box = $('#confetti');
    const colors = ['#FF7F32', '#FFBE2E', '#23955F', '#3B7BE0', '#F28DB2'];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = pick(colors);
      p.style.animationDelay = Math.random() * 0.5 + 's';
      box.appendChild(p);
      setTimeout(() => p.remove(), 2400);
    }
  }

  // 声で言ってみる（ブラウザが対応しているときだけ）
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  function trySay(word, out) {
    if (!SR) return;
    let r;
    try { r = new SR(); } catch (e) { out.textContent = 'マイクが つかえないみたい'; return; }
    r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 5;
    out.textContent = '🎤 きいているよ… いってみて！';
    r.onresult = e => {
      const alts = Array.from(e.results[0]).map(a => a.transcript.toLowerCase().trim());
      const ok = alts.some(a => a.replace(/[^a-z ]/g, '').split(/\s+/).includes(word));
      if (ok) { sfx.ok(); out.textContent = '🎉 じょうず！ ちゃんと つたわったよ'; }
      else { out.textContent = '「' + alts[0] + '」に きこえたよ。もういちど！'; }
    };
    r.onerror = () => { out.textContent = 'マイクが つかえないみたい'; };
    try { r.start(); } catch (e) { out.textContent = 'マイクが つかえないみたい'; }
  }

  // ---------- 画面 ----------
  const SCREENS = ['home', 'play', 'result', 'zukan', 'stickers', 'games'];
  function show(name, title) {
    SCREENS.forEach(s => { $('#screen-' + s).hidden = s !== name; });
    $('#bar-title').textContent = title || 'えいたんご ともだち';
    $('#btn-home').hidden = name === 'home';
    hideFeedback();
    window.scrollTo(0, 0);
  }
  function updateStars() { $('#star-count').textContent = S.stars; }

  // ----- ホーム -----
  let confirmReset = false;
  function renderHome() {
    const due = dueWords().length;
    const fresh = Math.min(newWords().length, due >= 6 ? 2 : 3);
    const learned = ALL.filter(x => isLearned(x.w)).length;
    const seen = Object.keys(S.words).length;
    const doneToday = S.lastDay === today();
    const greet = doneToday ? 'きょうも がんばったね！' : (seen ? 'きょうも いっしょに おぼえよう！' : 'はじめまして！ いっしょに 英語を おぼえよう');

    let lessonText;
    if (due + fresh === 0) lessonText = 'ぜんぶの ことばに であったよ！ おぼえた ことばを もういちど れんしゅうしよう。';
    else if (doneToday) lessonText = 'もう 1回 やると、もっと しっかり おぼえられるよ。';
    else lessonText = 'カードで おぼえて、クイズで たしかめよう。まちがえた ことばは もういちど でてくるよ。';

    $('#screen-home').innerHTML = `
      <div class="hello">
        <div class="hello-face" aria-hidden="true">${doneToday ? '😄' : '🦉'}</div>
        <div><h1>${greet}</h1><p>${ALL.length}この まいにち つかう ことば</p></div>
      </div>
      <div class="stats">
        <div class="stat"><b>${streakNow()}</b><span>🔥 れんぞく日</span></div>
        <div class="stat"><b>${learned}</b><span>🏅 おぼえた</span></div>
        <div class="stat"><b>${seen}</b><span>👀 であった</span></div>
      </div>
      <div>
        <div class="section-label">おぼえた ことば ${learned} / ${ALL.length}</div>
        <div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="${ALL.length}" aria-valuenow="${learned}"><div style="width:${learned / ALL.length * 100}%"></div></div>
      </div>
      <section class="lesson-card">
        <h2>🌟 きょうの レッスン</h2>
        <div class="lesson-chips">
          ${fresh ? `<span class="chip">✨ あたらしい ことば ${fresh}こ</span>` : ''}
          ${due ? `<span class="chip">🔁 ふくしゅう ${Math.min(due, 6)}こ</span>` : ''}
        </div>
        <p>${lessonText}</p>
        <button class="btn btn-primary btn-big" id="go-lesson" type="button">はじめる ▶</button>
      </section>
      <div class="menu">
        <button class="btn" id="go-games" type="button"><span aria-hidden="true">🎮</span><span>あそぶ</span></button>
        <button class="btn" id="go-zukan" type="button"><span aria-hidden="true">📚</span><span>ことば ずかん</span></button>
        <button class="btn" id="go-stickers" type="button"><span aria-hidden="true">🏅</span><span>シールちょう</span></button>
      </div>
      <section class="settings">
        <div class="section-label">せってい</div>
        <label><input type="checkbox" id="set-kana" ${S.settings.kana ? 'checked' : ''}> カタカナの よみかたを 出す</label>
        <label><input type="checkbox" id="set-slow" ${S.settings.slow ? 'checked' : ''}> 英語を ゆっくり よむ</label>
        <label><input type="checkbox" id="set-sfx" ${S.settings.sfx ? 'checked' : ''}> こうかおんを ならす</label>
        ${confirmReset
          ? `<div class="confirm">ほんとうに きろくを けす？ <button class="btn" id="reset-yes" type="button">けす</button><button class="btn" id="reset-no" type="button">やめる</button></div>`
          : `<button class="link-btn" id="reset" type="button">きろくを ぜんぶ けす</button>`}
      </section>
      ${canSpeak ? '' : '<p class="kana">※ この ブラウザでは 英語の 音声が ながれません。Chrome や Safari で ひらいてね。</p>'}
    `;
    $('#go-lesson').onclick = startLesson;
    $('#go-games').onclick = renderGames;
    $('#go-zukan').onclick = () => renderZukan('greet');
    $('#go-stickers').onclick = renderStickers;
    $('#set-kana').onchange = e => { S.settings.kana = e.target.checked; save(); };
    $('#set-slow').onchange = e => { S.settings.slow = e.target.checked; save(); };
    $('#set-sfx').onchange = e => { S.settings.sfx = e.target.checked; save(); };
    if (confirmReset) {
      $('#reset-yes').onclick = () => { S = load(); S.words = {}; S.stars = 0; S.streak = 0; S.lastDay = null; save(); confirmReset = false; updateStars(); renderHome(); };
      $('#reset-no').onclick = () => { confirmReset = false; renderHome(); };
    } else {
      $('#reset').onclick = () => { confirmReset = true; renderHome(); };
    }
    show('home');
  }

  // ---------- レッスンの組み立て ----------
  // 新しいことばは「見てわかる」→「書ける・つかえる」の順に。ふくしゅうは box に合わせてむずかしくする
  function typeForBox(box) {
    if (box <= 1) return pick(['meaning', 'listen']);
    if (box <= 3) return pick(['listen', 'spell', 'usage']);
    return pick(['spell', 'usage']);
  }

  function spreadOut(qs) {
    // 同じことばが となりに ならばないように
    for (let i = 1; i < qs.length; i++) {
      if (qs[i].x.w === qs[i - 1].x.w) {
        const j = qs.findIndex((q, k) => k > i && q.x.w !== qs[i].x.w && (!qs[k + 1] || qs[k + 1].x.w !== qs[i].x.w));
        if (j > 0) [qs[i], qs[j]] = [qs[j], qs[i]];
      }
    }
    return qs;
  }

  let P = null; // いまのプレイ
  let keyHandler = null; // スペル問題のキーボード入力
  function setKeyHandler(fn) {
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler = fn;
    if (fn) document.addEventListener('keydown', fn);
  }

  function startLesson() {
    const due = dueWords().slice(0, 6);
    const fresh = newWords().slice(0, due.length >= 6 ? 2 : 3);
    let review = due;
    if (!due.length && !fresh.length) review = shuffle(ALL).slice(0, 6);
    const steps = fresh.map(x => ({ type: 'card', x }));
    let qs = [];
    fresh.forEach(x => {
      qs.push({ type: pick(['meaning', 'listen']), x });
      qs.push({ type: pick(['spell', 'usage']), x });
    });
    review.forEach(x => qs.push({ type: typeForBox(rec(x.w) ? rec(x.w).box : 0), x }));
    qs = spreadOut(shuffle(qs));
    P = { mode: 'lesson', steps: steps.concat(qs), i: 0, results: {}, correct: 0, answered: 0, stars: 0, fresh: fresh.map(x => x.w) };
    show('play', 'きょうの レッスン');
    renderStep();
  }

  function startGame(type, catId) {
    let pool = catId === 'all' ? ALL : catId === 'seen' ? ALL.filter(x => rec(x.w)) : ALL.filter(x => x.cat === catId);
    if (pool.length < 4) pool = ALL;
    const qs = shuffle(pool).slice(0, 8).map(x => ({ type: type === 'mix' ? pick(['meaning', 'listen', 'spell', 'usage']) : type, x }));
    P = { mode: 'game', steps: qs, i: 0, results: {}, correct: 0, answered: 0, stars: 0, fresh: [], game: { type, catId } };
    show('play', GAMES.find(g => g.id === type).name);
    renderStep();
  }

  function renderStep() {
    $('#progress-fill').style.width = (P.i / P.steps.length * 100) + '%';
    if (P.i >= P.steps.length) return finish();
    const step = P.steps[P.i];
    hideFeedback();
    setKeyHandler(null);
    ({ card: renderCardStep, meaning: renderMeaning, listen: renderListen, spell: renderSpell, usage: renderUsage })[step.type](step);
  }

  function next() { P.i++; renderStep(); }

  function distractors(x, n) {
    const same = shuffle(ALL.filter(y => y.cat === x.cat && y.w !== x.w && y.ja !== x.ja));
    const other = shuffle(ALL.filter(y => y.cat !== x.cat));
    return same.concat(other).slice(0, n);
  }

  // こたえあわせ
  function answer(step, ok, msgHtml) {
    const w = step.x.w;
    P.answered++;
    if (ok) {
      P.correct++; P.stars++; S.stars++; save(); updateStars();
      if (P.results[w] === undefined) P.results[w] = true;
      sfx.ok();
    } else {
      P.results[w] = false;
      sfx.ng();
      // まちがえたら、少しあとで もういちど
      if ((step.tries || 0) < 2) {
        const again = Object.assign({}, step, { tries: (step.tries || 0) + 1 });
        P.steps.splice(Math.min(P.i + 3, P.steps.length), 0, again);
      }
    }
    showFeedback(ok, msgHtml);
  }

  function showFeedback(ok, html) {
    const f = $('#feedback');
    f.className = 'feedback ' + (ok ? 'is-ok' : 'is-ng');
    $('#feedback-msg').innerHTML = html;
    f.hidden = false;
    $('#feedback-next').focus({ preventScroll: true });
  }
  function hideFeedback() { $('#feedback').hidden = true; }
  $('#feedback-next').onclick = () => { sfx.tap(); next(); };

  const praise = () => pick(['せいかい！', 'すごい！', 'やったね！', 'ばっちり！', 'いいね！']);
  const retryNote = step => (step.tries || 0) < 2 ? 'あとで もういちど でるよ' : 'つぎは できるよ！';
  const answerLine = x => `<span class="en">${esc(x.w)}</span> ＝ ${esc(x.ja)} ${x.emoji}`;

  function kanaHtml(x) { return S.settings.kana ? `<div class="kana">よみかた：${esc(x.kana)}</div>` : ''; }
  function visual(x) {
    return x.color ? `<div class="swatch" style="background:${x.color}" aria-label="${esc(x.ja)}"></div>` : `<div class="emoji" aria-hidden="true">${x.emoji}</div>`;
  }

  // ----- カード（はじめてのことば） -----
  function cardHtml(x, isNew) {
    return `
      <div class="card">
        ${isNew ? '<span class="new-badge">NEW あたらしい ことば</span>' : ''}
        ${visual(x)}
        <div class="big-word"><span class="ruled">${esc(x.w)}</span></div>
        ${kanaHtml(x)}
        <div class="ja">${esc(x.ja)}</div>
        <div class="btn-row">
          <button class="btn" data-act="say" type="button">🔊 きく</button>
          <button class="btn" data-act="slow" type="button">🐢 ゆっくり</button>
          ${SR ? '<button class="btn" data-act="mic" type="button">🎤 いってみよう</button>' : ''}
        </div>
        <div class="say-result" aria-live="polite"></div>
        <div class="example">
          <button class="speak" data-act="ex" type="button" aria-label="れいぶんを きく">🔊</button>
          <div><p class="en">${markSentence(x)}</p><p class="ex-ja">${esc(x.exJa)}</p></div>
        </div>
      </div>`;
  }
  function bindCard(root, x) {
    root.querySelector('[data-act="say"]').onclick = () => speak(x.w);
    root.querySelector('[data-act="slow"]').onclick = () => speak(x.w, true);
    root.querySelector('[data-act="ex"]').onclick = () => speak(x.ex);
    const mic = root.querySelector('[data-act="mic"]');
    if (mic) mic.onclick = () => trySay(x.w, root.querySelector('.say-result'));
  }

  function renderCardStep(step) {
    const body = $('#play-body');
    body.innerHTML = `<div class="prompt">${cardHtml(step.x, true)}</div>
      <div class="btn-row"><button class="btn btn-primary btn-big" id="card-next" type="button">おぼえた！ つぎへ ▶</button></div>`;
    bindCard(body, step.x);
    $('#card-next').onclick = () => { sfx.tap(); next(); };
    speak(step.x.w);
  }

  // ----- いみクイズ -----
  function renderMeaning(step) {
    const x = step.x;
    const opts = shuffle([x].concat(distractors(x, 3)));
    $('#play-body').innerHTML = `
      <div class="q-label"><span class="q-tag">いみクイズ</span><br>この ことばの いみは どれ？</div>
      <div class="prompt">
        <div class="big-word"><span class="ruled">${esc(x.w)}</span></div>
        <button class="speak" id="q-say" type="button" aria-label="もういちど きく">🔊</button>
      </div>
      <div class="choices" id="choices">
        ${opts.map((o, i) => `<button class="choice" data-i="${i}" type="button"><span class="c-emoji" aria-hidden="true">${o.emoji}</span>${esc(o.ja)}</button>`).join('')}
      </div>`;
    $('#q-say').onclick = () => speak(x.w);
    bindChoices(step, opts, () => speak(x.w));
    speak(x.w);
  }

  // ----- きいてクイズ -----
  function renderListen(step) {
    const x = step.x;
    const opts = shuffle([x].concat(distractors(x, 3)));
    $('#play-body').innerHTML = `
      <div class="q-label"><span class="q-tag">きいてクイズ</span><br>きこえた ことばは どれ？</div>
      <div class="prompt">
        <button class="speak speak-huge" id="q-say" type="button" aria-label="きく">🔊</button>
        <button class="btn" id="q-slow" type="button">🐢 ゆっくり</button>
      </div>
      <div class="choices" id="choices">
        ${opts.map((o, i) => `<button class="choice en-choice" data-i="${i}" type="button">${esc(o.w)}</button>`).join('')}
      </div>`;
    $('#q-say').onclick = () => speak(x.w);
    $('#q-slow').onclick = () => speak(x.w, true);
    bindChoices(step, opts);
    setTimeout(() => speak(x.w), 250);
  }

  function bindChoices(step, opts, onOk) {
    const x = step.x;
    const box = $('#choices');
    box.querySelectorAll('.choice').forEach(btn => {
      btn.onclick = () => {
        if (box.classList.contains('answered')) return;
        box.classList.add('answered');
        const o = opts[+btn.dataset.i];
        const ok = o.w === x.w;
        box.querySelectorAll('.choice').forEach(b => { if (opts[+b.dataset.i].w === x.w) b.classList.add('is-ok'); });
        if (!ok) btn.classList.add('is-ng');
        answer(step, ok, ok ? `<b>${praise()}</b><br>${answerLine(x)}` : `<b>おしい！</b> こたえは ${answerLine(x)}<br><small>${retryNote(step)}</small>`);
        speak(x.w);
        if (ok && onOk) onOk();
      };
    });
  }

  // ----- スペル -----
  function renderSpell(step) {
    const x = step.x;
    const letters = x.w.split('');
    const extra = shuffle('abcdefghijklmnopqrstuvwxyz'.split('').filter(c => !letters.includes(c))).slice(0, x.w.length <= 3 ? 2 : 3);
    const tiles = shuffle(letters.concat(extra));
    let pos = 0, mistakes = 0, hinted = false;

    $('#play-body').innerHTML = `
      <div class="q-label"><span class="q-tag">スペル</span><br>えいごで かいてみよう</div>
      <div class="prompt">
        ${visual(x)}
        <div class="ja">${esc(x.ja)}</div>
        <div class="btn-row"><button class="speak" id="q-say" type="button" aria-label="きく">🔊</button></div>
        <div class="slots"><span class="ruled" id="slots">${letters.map((_, i) => `<span class="slot empty${i === 0 ? ' next' : ''}" data-s="${i}"></span>`).join('')}</span></div>
      </div>
      <div class="tiles" id="tiles">${tiles.map((c, i) => `<button class="tile" data-i="${i}" type="button">${c}</button>`).join('')}</div>
      <div class="btn-row"><button class="btn" id="q-hint" type="button">💡 ヒント</button></div>`;

    const slotEls = Array.from(document.querySelectorAll('.slot'));
    const tileEls = Array.from(document.querySelectorAll('.tile'));
    $('#q-say').onclick = () => speak(x.w);
    $('#q-hint').onclick = () => {
      hinted = true;
      const t = tileEls.find(b => !b.classList.contains('used') && b.textContent === letters[pos]);
      if (t) { t.classList.add('hint'); }
      speak(x.w, true);
    };
    function tap(btn) {
      if (pos >= letters.length || btn.classList.contains('used')) return;
      if (btn.textContent === letters[pos]) {
        sfx.tap();
        btn.classList.add('used');
        const s = slotEls[pos];
        s.textContent = letters[pos]; s.classList.remove('empty', 'next');
        pos++;
        if (slotEls[pos]) slotEls[pos].classList.add('next');
        if (pos === letters.length) done();
      } else {
        mistakes++;
        btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake');
        sfx.ng();
      }
    }
    function done() {
      setKeyHandler(null);
      $('#q-hint').disabled = true;
      tileEls.forEach(b => { b.disabled = true; });
      const perfect = mistakes === 0 && !hinted;
      speak(x.w);
      $('#slots').classList.add('pop');
      answer(step, perfect, perfect
        ? `<b>${praise()}</b> 1回で かけたね！<br>${answerLine(x)}`
        : `<b>かけたね！</b> ${answerLine(x)}<br><small>${hinted ? 'ヒントを つかったので、' : ''}${retryNote(step)}</small>`);
    }
    function onKey(e) {
      if ($('#screen-play').hidden) return;
      const k = e.key.toLowerCase();
      if (!/^[a-z]$/.test(k)) return;
      const t = tileEls.find(b => !b.classList.contains('used') && b.textContent === k && k === letters[pos])
        || tileEls.find(b => !b.classList.contains('used') && b.textContent === k);
      if (t) tap(t);
    }
    tileEls.forEach(b => { b.onclick = () => tap(b); });
    setKeyHandler(onKey);
    speak(x.w);
  }

  // ----- つかいかた（あなうめ） -----
  function renderUsage(step) {
    const x = step.x;
    const opts = shuffle([x].concat(distractors(x, 3)));
    $('#play-body').innerHTML = `
      <div class="q-label"><span class="q-tag">つかいかた</span><br>＿＿ に はいる ことばは どれ？</div>
      <div class="prompt">
        <p class="sentence">${markSentence(x, 'blank')}</p>
        <p class="sentence-ja">${esc(x.exJa)}</p>
      </div>
      <div class="choices" id="choices">
        ${opts.map((o, i) => `<button class="choice en-choice" data-i="${i}" type="button">${esc(o.w)}</button>`).join('')}
      </div>`;
    const box = $('#choices');
    box.querySelectorAll('.choice').forEach(btn => {
      btn.onclick = () => {
        if (box.classList.contains('answered')) return;
        box.classList.add('answered');
        const ok = opts[+btn.dataset.i].w === x.w;
        box.querySelectorAll('.choice').forEach(b => { if (opts[+b.dataset.i].w === x.w) b.classList.add('is-ok'); });
        if (!ok) btn.classList.add('is-ng');
        const blank = $('#blank');
        blank.textContent = x.ex.match(wordRe(x.w))[0];
        blank.classList.add('pop');
        speak(x.ex);
        answer(step, ok, ok
          ? `<b>${praise()}</b><br><span class="en">${esc(x.ex)}</span>`
          : `<b>おしい！</b> こたえは <span class="en">${esc(x.w)}</span>（${esc(x.ja)}）<br><small>${retryNote(step)}</small>`);
      };
    });
  }

  // ---------- おわり ----------
  function finish() {
    hideFeedback();
    const t = today();
    const newly = [];
    if (P.mode === 'lesson') {
      Object.entries(P.results).forEach(([w, ok]) => {
        const r = S.words[w] || { box: 0, due: t, ok: 0, ng: 0 };
        const before = r.box;
        if (ok) { r.box = Math.min(r.box + 1, MASTER_BOX); r.ok++; } else { r.box = 0; r.ng++; }
        r.due = t + INTERVALS[r.box];
        S.words[w] = r;
        if (ok && before < LEARNED_BOX && r.box >= LEARNED_BOX) newly.push({ w, gold: false });
        if (ok && before < MASTER_BOX && r.box >= MASTER_BOX) newly.push({ w, gold: true });
      });
      if (S.lastDay !== t) { S.streak = S.lastDay === t - 1 ? S.streak + 1 : 1; S.lastDay = t; }
    }
    save();
    sfx.fanfare();
    confetti();

    const rate = P.answered ? Math.round(P.correct / P.answered * 100) : 100;
    const face = rate >= 90 ? '🏆' : rate >= 70 ? '🎉' : '💪';
    const title = rate >= 90 ? 'かんぺき！' : rate >= 70 ? 'よくできました！' : 'がんばったね！';
    const rows = Object.entries(P.results).map(([w, ok]) => {
      const x = ALL.find(y => y.w === w);
      const isNew = P.fresh.includes(w);
      return `<div class="word-row">
        <span class="wr-emoji" aria-hidden="true">${x.emoji}</span>
        <span class="wr-word">${esc(w)}<br><span class="wr-ja">${esc(x.ja)}</span></span>
        ${isNew ? '<span class="pill pill-new">NEW</span>' : ''}
        <span class="pill ${ok ? 'pill-ok' : 'pill-ng'}">${ok ? '◎ できた' : '△ もういちど'}</span>
      </div>`;
    }).join('');
    const stickerMsg = newly.length
      ? `<section class="lesson-card"><h2>🏅 シールを もらったよ！</h2>
          <div class="stickers" style="width:100%">${newly.map(n => { const x = ALL.find(y => y.w === n.w); return `<div class="sticker got${n.gold ? ' gold' : ''} pop" title="${esc(n.w)}">${x.emoji}</div>`; }).join('')}</div>
          <p>${newly.map(n => esc(n.w)).join('、')} を ${newly.some(n => n.gold) ? 'マスターしたよ！' : 'おぼえたよ！'}</p></section>`
      : '';
    const nextDue = P.mode === 'lesson' ? '<p class="kana">できた ことばは、わすれかけた ころに また でてくるよ。それで しっかり おぼえられるんだ。</p>' : '';

    $('#screen-result').innerHTML = `
      <div class="result-hero">
        <div class="big" aria-hidden="true">${face}</div>
        <h1>${title}</h1>
        <p>せいかい ${P.correct} / ${P.answered}　・　⭐ +${P.stars}</p>
      </div>
      ${stickerMsg}
      <div class="word-list">${rows}</div>
      ${nextDue}
      <div class="btn-row">
        <button class="btn btn-primary btn-big" id="res-again" type="button">${P.mode === 'lesson' ? 'もう 1回 レッスン' : 'もう 1回 あそぶ'}</button>
        <button class="btn btn-big" id="res-home" type="button">ホームへ</button>
      </div>`;
    const prev = P;
    $('#res-again').onclick = () => prev.mode === 'lesson' ? startLesson() : startGame(prev.game.type, prev.game.catId);
    $('#res-home').onclick = renderHome;
    show('result', 'けっか');
  }

  // ---------- あそぶ ----------
  const GAMES = [
    { id: 'meaning', icon: '🤔', name: 'いみクイズ', desc: '英語を見て、いみを えらぶ' },
    { id: 'listen', icon: '👂', name: 'きいてクイズ', desc: '音を きいて、ことばを えらぶ' },
    { id: 'spell', icon: '✏️', name: 'スペル', desc: 'ならべかえて、つづりを かく' },
    { id: 'usage', icon: '💬', name: 'つかいかた', desc: '文の あなに 合う ことばを えらぶ' },
    { id: 'mix', icon: '🎲', name: 'ミックス', desc: 'いろいろな もんだいが でる' },
  ];
  let gameSel = { type: 'meaning', cat: 'all' };
  function renderGames() {
    const cats = [{ id: 'all', name: 'ぜんぶ', icon: '🌈' }].concat(
      Object.keys(S.words).length >= 4 ? [{ id: 'seen', name: 'であった ことば', icon: '👀' }] : [],
      CATEGORIES);
    if (!cats.some(c => c.id === gameSel.cat)) gameSel.cat = 'all';
    $('#screen-games').innerHTML = `
      <div class="section-label">あそびを えらぶ</div>
      <div class="game-list">
        ${GAMES.map(g => `<button class="btn game-btn" data-g="${g.id}" aria-pressed="${g.id === gameSel.type}" type="button">
          <span class="g-icon" aria-hidden="true">${g.icon}</span><span>${g.name}<small>${g.desc}</small></span></button>`).join('')}
      </div>
      <div class="section-label">ことばの なかま</div>
      <div class="cat-tabs" style="flex-wrap:wrap">
        ${cats.map(c => `<button class="cat-tab" data-c="${c.id}" aria-pressed="${c.id === gameSel.cat}" type="button">${c.icon} ${c.name}</button>`).join('')}
      </div>
      <div class="btn-row"><button class="btn btn-primary btn-big" id="game-start" type="button">スタート ▶</button></div>
      <p class="kana">あそびでは ⭐ が もらえるよ。シールは「きょうの レッスン」で もらえるよ。</p>`;
    document.querySelectorAll('[data-g]').forEach(b => { b.onclick = () => { gameSel.type = b.dataset.g; renderGames(); }; });
    document.querySelectorAll('[data-c]').forEach(b => { b.onclick = () => { gameSel.cat = b.dataset.c; renderGames(); }; });
    $('#game-start').onclick = () => startGame(gameSel.type, gameSel.cat);
    if ($('#screen-games').hidden) show('games', 'あそぶ');
  }

  // ---------- ずかん ----------
  function statusMark(w) { return isMaster(w) ? '🥇' : isLearned(w) ? '🏅' : rec(w) ? '👀' : ''; }
  function renderZukan(catId) {
    const c = CAT[catId];
    $('#screen-zukan').innerHTML = `
      <div class="cat-tabs" role="toolbar" aria-label="ことばの なかま">
        ${CATEGORIES.map(k => `<button class="cat-tab" data-c="${k.id}" aria-pressed="${k.id === catId}" type="button">${k.icon} ${k.name}</button>`).join('')}
      </div>
      <div class="grid">
        ${c.words.map(([w]) => { const x = ALL.find(y => y.w === w); return `<button class="word-tile" data-w="${esc(w)}" type="button">
          <span class="wt-mark" aria-hidden="true">${statusMark(w)}</span>
          <span class="wt-emoji" aria-hidden="true">${x.emoji}</span>
          <span class="wt-word">${esc(w)}</span><span class="wt-ja">${esc(x.ja)}</span></button>`; }).join('')}
      </div>
      <p class="kana">👀 であった　🏅 おぼえた　🥇 マスター</p>`;
    document.querySelectorAll('#screen-zukan [data-c]').forEach(b => { b.onclick = () => renderZukan(b.dataset.c); });
    document.querySelectorAll('#screen-zukan [data-w]').forEach(b => { b.onclick = () => openCard(b.dataset.w); });
    if ($('#screen-zukan').hidden) show('zukan', 'ことば ずかん');
    const active = document.querySelector('#screen-zukan .cat-tab[aria-pressed="true"]');
    if (active) active.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  function openCard(w) {
    const x = ALL.find(y => y.w === w);
    const body = $('#modal-body');
    body.innerHTML = cardHtml(x, false);
    bindCard(body, x);
    $('#modal').hidden = false;
    $('#modal-close').focus({ preventScroll: true });
    speak(x.w);
  }
  function closeModal() { $('#modal').hidden = true; }
  $('#modal-close').onclick = closeModal;
  $('#modal').onclick = e => { if (e.target.id === 'modal') closeModal(); };

  // ---------- シールちょう ----------
  function renderStickers() {
    const learned = ALL.filter(x => isLearned(x.w)).length;
    $('#screen-stickers').innerHTML = `
      <div class="result-hero"><div class="big" aria-hidden="true">🏅</div>
        <h1>${learned} / ${ALL.length} まい</h1>
        <p class="kana">レッスンで 何日か つづけて せいかいすると シールが もらえるよ。<br>もっと つづけると 金の シールに なるよ！</p></div>
      ${CATEGORIES.map(c => `<section class="sticker-group"><h3>${c.icon} ${c.name}</h3><div class="stickers">
        ${c.words.map(([w, , emoji]) => isLearned(w)
          ? `<button class="sticker got${isMaster(w) ? ' gold' : ''}" data-w="${esc(w)}" type="button" aria-label="${esc(w)}">${emoji}</button>`
          : `<div class="sticker" aria-label="まだ"><span class="q">？</span></div>`).join('')}
      </div></section>`).join('')}`;
    document.querySelectorAll('#screen-stickers [data-w]').forEach(b => { b.onclick = () => openCard(b.dataset.w); });
    show('stickers', 'シールちょう');
  }

  // ---------- キーボード ----------
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !$('#modal').hidden) closeModal();
    if (e.key === 'Enter' && !$('#feedback').hidden && document.activeElement !== $('#feedback-next')) { e.preventDefault(); next(); }
  });

  $('#btn-home').onclick = () => { if (canSpeak) speechSynthesis.cancel(); closeModal(); renderHome(); };

  updateStars();
  renderHome();
})();
