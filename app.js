(() => {
  'use strict';

  // ---------- データ ----------
  // 画面の文。小学生は ひらがな多めの 子ども向け、中学生から上は ふつうの文
  const TEXT = {
    kid: {
      face: '🦉', faceDone: '😄',
      greetDone: 'きょうも がんばったね！', greetAgain: 'きょうも いっしょに おぼえよう！', greetFirst: 'はじめまして！ いっしょに 英語を おぼえよう',
      levelLine: (name, n) => `${name}レベル・${n}この ことば`,
      allMet: 'ぜんぶの ことばに であったよ！ おぼえた ことばを もういちど れんしゅうしよう。',
      again: 'もう 1回 やると、もっと しっかり おぼえられるよ。',
      lessonDesc: 'カードで おぼえて、クイズで たしかめよう。まちがえた ことばは もういちど でてくるよ。',
      stStreak: '🔥 れんぞく日', stLearned: '🏅 おぼえた', stSeen: '👀 であった',
      meter: (l, n) => `おぼえた ことば ${l} / ${n}`,
      lesson: 'きょうの レッスン', chipNew: n => `✨ あたらしい ことば ${n}こ`, chipReview: n => `🔁 ふくしゅう ${n}こ`, start: 'はじめる ▶',
      menuGames: 'あそぶ', menuZukan: 'ことば ずかん', menuStickers: 'シールちょう',
      settings: 'せってい', setKana: 'カタカナの よみかたを 出す', setSlow: '英語を ゆっくり よむ', setSfx: 'こうかおんを ならす',
      resetAsk: 'ほんとうに きろくを けす？', resetYes: 'けす', resetNo: 'やめる', resetLink: 'きろくを ぜんぶ けす',
      noSpeech: '※ この ブラウザでは 英語の 音声が ながれません。Chrome や Safari で ひらいてね。',
      newBadge: 'NEW あたらしい ことば', say: '🔊 きく', slow: '🐢 ゆっくり', mic: '🎤 いってみよう', exAria: 'れいぶんを きく', cardNext: 'おぼえた！ つぎへ ▶', kana: 'よみかた：',
      meaningTag: 'いみクイズ', meaningQ: 'この ことばの いみは どれ？', listenTag: 'きいてクイズ', listenQ: 'きこえた ことばは どれ？',
      spellTag: 'スペル', spellQ: 'えいごで かいてみよう', hint: '💡 ヒント', usageTag: 'つかいかた', usageQ: '＿＿ に はいる ことばは どれ？',
      praise: ['せいかい！', 'すごい！', 'やったね！', 'ばっちり！', 'いいね！'], miss: 'おしい！', answerIs: 'こたえは',
      retryLater: 'あとで もういちど でるよ', retryLast: 'つぎは できるよ！',
      spellPerfect: '1回で かけたね！', spellDone: 'かけたね！', hintUsed: 'ヒントを つかったので、',
      titles: ['かんぺき！', 'よくできました！', 'がんばったね！'], correctLine: (c, a) => `せいかい ${c} / ${a}`,
      okPill: '◎ できた', ngPill: '△ もういちど',
      gotSticker: '🏅 シールを もらったよ！', gotNames: (names, gold) => `${names} を ${gold ? 'マスターしたよ！' : 'おぼえたよ！'}`,
      nextDue: 'できた ことばは、わすれかけた ころに また でてくるよ。それで しっかり おぼえられるんだ。',
      againLesson: 'もう 1回 レッスン', againGame: 'もう 1回 あそぶ', home: 'ホームへ', result: 'けっか',
      games: [
        { id: 'meaning', icon: '🤔', name: 'いみクイズ', desc: '英語を見て、いみを えらぶ' },
        { id: 'listen', icon: '👂', name: 'きいてクイズ', desc: '音を きいて、ことばを えらぶ' },
        { id: 'spell', icon: '✏️', name: 'スペル', desc: 'ならべかえて、つづりを かく' },
        { id: 'usage', icon: '💬', name: 'つかいかた', desc: '文の あなに 合う ことばを えらぶ' },
        { id: 'mix', icon: '🎲', name: 'ミックス', desc: 'いろいろな もんだいが でる' },
      ],
      gamesPick: 'あそびを えらぶ', catPick: 'ことばの なかま', catAll: 'ぜんぶ', catSeen: 'であった ことば', gameStart: 'スタート ▶',
      gamesNote: 'あそびでは ⭐ が もらえるよ。シールは「きょうの レッスン」で もらえるよ。',
      step2: 'ステップ2', legend: '👀 であった　🏅 おぼえた　🥇 マスター',
      stickersCount: (l, n) => `${l} / ${n} まい`,
      stickersNote: 'レッスンで 何日か つづけて せいかいすると シールが もらえるよ。<br>もっと つづけると 金の シールに なるよ！', notYet: 'まだ',
      micListen: '🎤 きいているよ… いってみて！', micOk: '🎉 じょうず！ ちゃんと つたわったよ', micHeard: t => `「${t}」に きこえたよ。もういちど！`, micErr: 'マイクが つかえないみたい',
    },
    adult: {
      face: '📖', faceDone: '✅',
      greetDone: '今日の学習は完了しています', greetAgain: '今日も続けましょう', greetFirst: 'はじめましょう',
      levelLine: (name, n) => `${name}レベル・${n}語`,
      allMet: 'このレベルの単語はすべて学習済みです。習得した単語をランダムに復習します。',
      again: 'もう1回やると、記憶がさらに定着します。',
      lessonDesc: '新しい単語をカードで確認し、クイズで定着させます。間違えた単語はレッスン中にもう一度出題されます。',
      stStreak: '🔥 連続日数', stLearned: '🏅 習得', stSeen: '👀 学習済み',
      meter: (l, n) => `習得した単語 ${l} / ${n}`,
      lesson: '今日のレッスン', chipNew: n => `✨ 新出 ${n}語`, chipReview: n => `🔁 復習 ${n}語`, start: '始める ▶',
      menuGames: '練習する', menuZukan: '単語一覧', menuStickers: '習得バッジ',
      settings: '設定', setKana: 'カタカナの読みを表示（小学生レベルのみ）', setSlow: '英語をゆっくり読み上げる', setSfx: '効果音を鳴らす',
      resetAsk: '学習記録をすべて削除しますか？', resetYes: '削除する', resetNo: 'キャンセル', resetLink: '学習記録をすべて削除',
      noSpeech: '※ このブラウザでは英語の音声が再生されません。Chrome または Safari で開いてください。',
      newBadge: 'NEW 新出単語', say: '🔊 発音', slow: '🐢 ゆっくり', mic: '🎤 発音してみる', exAria: '例文を聞く', cardNext: '覚えた　次へ ▶', kana: '読み：',
      meaningTag: '意味', meaningQ: 'この単語の意味は？', listenTag: 'リスニング', listenQ: '聞こえた単語は？',
      spellTag: 'スペル', spellQ: 'つづりを完成させましょう', hint: '💡 ヒント', usageTag: '用法', usageQ: '空所に入る単語は？',
      praise: ['正解', 'その通り', 'お見事', '完璧です'], miss: '不正解', answerIs: '正解は',
      retryLater: 'このあともう一度出題します', retryLast: '次回の復習で確認しましょう',
      spellPerfect: 'ノーミスです', spellDone: '完成', hintUsed: 'ヒントを使ったため、',
      titles: ['完璧です', 'よくできました', 'おつかれさまでした'], correctLine: (c, a) => `正解 ${c} / ${a}`,
      okPill: '◎ 正解', ngPill: '△ 要復習',
      gotSticker: '🏅 バッジを獲得しました', gotNames: (names, gold) => `${names} を${gold ? '完全に定着させました' : '習得しました'}`,
      nextDue: '正解した単語は、1日後・3日後・7日後…と間隔をあけて復習に出ます（間隔反復）。',
      againLesson: 'もう1回レッスン', againGame: 'もう1回練習', home: 'ホームへ', result: '結果',
      games: [
        { id: 'meaning', icon: '🤔', name: '意味', desc: '英単語を見て、意味を選ぶ' },
        { id: 'listen', icon: '👂', name: 'リスニング', desc: '発音を聞いて、単語を選ぶ' },
        { id: 'spell', icon: '✏️', name: 'スペル', desc: '文字を並べて、つづりを完成させる' },
        { id: 'usage', icon: '💬', name: '用法', desc: '例文の空所に入る単語を選ぶ' },
        { id: 'mix', icon: '🎲', name: 'ミックス', desc: 'すべての形式から出題' },
      ],
      gamesPick: '練習の種類', catPick: 'カテゴリ', catAll: 'すべて', catSeen: '学習済みの単語', gameStart: '開始 ▶',
      gamesNote: '練習では ⭐ が増えます。習得バッジは「今日のレッスン」の結果で決まります。',
      step2: 'ステップ2', legend: '👀 学習済み　🏅 習得　🥇 定着',
      stickersCount: (l, n) => `${l} / ${n} 語`,
      stickersNote: 'レッスンで何日か続けて正解すると「習得」になります。<br>さらに続けると「定着」（金色）になります。', notYet: '未習得',
      micListen: '🎤 聞き取り中… 発音してください', micOk: '🎉 正しく聞き取れました', micHeard: t => `「${t}」と聞こえました。もう一度どうぞ`, micErr: 'マイクを使用できません',
    },
  };

  // レベル。小学生だけ カタカナの読みかたつき（中学生から上は [英単語, いみ, 絵文字, 例文, 例文のいみ]）
  const LEVELS = [
    { id: 'es', name: '小学生', icon: '🎒', cats: CATEGORIES, perLesson: 3, note: '' },
    { id: 'jhs', name: '中学生', icon: '📘', cats: WORDS_JHS, perLesson: 4, note: '中学で習う基本語（CEFR A1〜A2）' },
    { id: 'hs', name: '高校生', icon: '📗', cats: WORDS_HS, perLesson: 5, note: '大学入試・共通テストの頻出語（CEFR B1〜B2）' },
    { id: 'univ', name: '大学生', icon: '🎓', cats: WORDS_UNIV, perLesson: 5, note: 'TOEFL・IELTS・英語論文レベル（CEFR C1〜C2）' },
  ];
  const WORDS = [];
  LEVELS.forEach(L => L.cats.forEach(c => [c.words, c.more || []].forEach((list, level) => list.forEach(r => {
    const [w, ja, emoji, kana, ex, exJa, color] = L.id === 'es' ? r : [r[0], r[1], r[2], '', r[3], r[4]];
    WORDS.push({ w, ja, emoji, kana, ex, exJa, color, cat: c.id, level, lv: L.id });
  }))));
  const CAT = Object.fromEntries(LEVELS.flatMap(L => L.cats).map(c => [c.id, c]));

  // いま えらんでいるレベルの ことば（ALL）と なかま（CATS）
  let LV, ALL, CATS, T;
  function setLevel(id) {
    LV = LEVELS.find(L => L.id === id) || LEVELS[0];
    ALL = WORDS.filter(x => x.lv === LV.id);
    CATS = LV.cats;
    T = LV.id === 'es' ? TEXT.kid : TEXT.adult;
    document.body.classList.toggle('adult', LV.id !== 'es');
  }
  const freshCount = due => due >= 6 ? LV.perLesson - 1 : LV.perLesson;

  // ふくしゅうの間かく（日）。box が上がるほど、次に出るのがあとになる
  const INTERVALS = [0, 1, 3, 7, 14, 30];
  const LEARNED_BOX = 3; // ここまで来たら「おぼえた」シール
  const MASTER_BOX = 5;  // ここまで来たら金のシール
  const KEY = 'eitango-tomodachi-v1';

  // ---------- 保存 ----------
  const DEFAULT_SETTINGS = { slow: false, kana: true, sfx: true, level: 'es' };
  let S = load();
  setLevel(S.settings.level);
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
  // きほん（level 0）を ぜんぶ やってから ステップ2（level 1）へ
  const newWords = () => ALL.filter(x => !rec(x.w)).sort((a, b) => a.level - b.level);

  // ---------- 小さな道具 ----------
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  // 長い単語は 文字を小さくする（' long' / ' xlong'）
  const lenClass = (w, long, xlong) => w.length >= xlong ? ' xlong' : w.length >= long ? ' long' : '';
  // 4つの選択肢は いちばん長い単語に 文字の大きさを そろえる
  const choiceSize = opts => lenClass(opts.reduce((a, o) => o.w.length > a.length ? o.w : a, ''), 9, 12);
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
    try { r = new SR(); } catch (e) { out.textContent = T.micErr; return; }
    r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 5;
    out.textContent = T.micListen;
    r.onresult = e => {
      const alts = Array.from(e.results[0]).map(a => a.transcript.toLowerCase().trim());
      const ok = alts.some(a => a.replace(/[^a-z ]/g, '').split(/\s+/).includes(word.toLowerCase()));
      if (ok) { sfx.ok(); out.textContent = T.micOk; }
      else { out.textContent = T.micHeard(alts[0]); }
    };
    r.onerror = () => { out.textContent = T.micErr; };
    try { r.start(); } catch (e) { out.textContent = T.micErr; }
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
    const fresh = Math.min(newWords().length, freshCount(due));
    const learned = ALL.filter(x => isLearned(x.w)).length;
    const seen = ALL.filter(x => rec(x.w)).length;
    const doneToday = S.lastDay === today();
    const greet = doneToday ? T.greetDone : (seen ? T.greetAgain : T.greetFirst);

    let lessonText;
    if (due + fresh === 0) lessonText = T.allMet;
    else if (doneToday) lessonText = T.again;
    else lessonText = T.lessonDesc;

    $('#screen-home').innerHTML = `
      <div class="hello">
        <div class="hello-face" aria-hidden="true">${doneToday ? T.faceDone : T.face}</div>
        <div><h1>${greet}</h1><p>${T.levelLine(LV.name, ALL.length)}${LV.note ? `<br>${LV.note}` : ''}</p></div>
      </div>
      <div class="level-pick" role="radiogroup" aria-label="レベル">
        ${LEVELS.map(L => `<button class="level-btn" role="radio" aria-checked="${L.id === LV.id}" data-lv="${L.id}" type="button">
          <span class="lv-icon" aria-hidden="true">${L.icon}</span><span>${L.name}</span><small>${WORDS.filter(x => x.lv === L.id).length}語</small></button>`).join('')}
      </div>
      <div class="stats">
        <div class="stat"><b>${streakNow()}</b><span>${T.stStreak}</span></div>
        <div class="stat"><b>${learned}</b><span>${T.stLearned}</span></div>
        <div class="stat"><b>${seen}</b><span>${T.stSeen}</span></div>
      </div>
      <div>
        <div class="section-label">${T.meter(learned, ALL.length)}</div>
        <div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="${ALL.length}" aria-valuenow="${learned}"><div style="width:${learned / ALL.length * 100}%"></div></div>
      </div>
      <section class="lesson-card">
        <h2>🌟 ${T.lesson}</h2>
        <div class="lesson-chips">
          ${fresh ? `<span class="chip">${T.chipNew(fresh)}</span>` : ''}
          ${due ? `<span class="chip">${T.chipReview(Math.min(due, 6))}</span>` : ''}
        </div>
        <p>${lessonText}</p>
        <button class="btn btn-primary btn-big" id="go-lesson" type="button">${T.start}</button>
      </section>
      <div class="menu">
        <button class="btn" id="go-games" type="button"><span aria-hidden="true">🎮</span><span>${T.menuGames}</span></button>
        <button class="btn" id="go-zukan" type="button"><span aria-hidden="true">📚</span><span>${T.menuZukan}</span></button>
        <button class="btn" id="go-stickers" type="button"><span aria-hidden="true">🏅</span><span>${T.menuStickers}</span></button>
      </div>
      <section class="settings">
        <div class="section-label">${T.settings}</div>
        <label><input type="checkbox" id="set-kana" ${S.settings.kana ? 'checked' : ''}> ${T.setKana}</label>
        <label><input type="checkbox" id="set-slow" ${S.settings.slow ? 'checked' : ''}> ${T.setSlow}</label>
        <label><input type="checkbox" id="set-sfx" ${S.settings.sfx ? 'checked' : ''}> ${T.setSfx}</label>
        ${confirmReset
          ? `<div class="confirm">${T.resetAsk} <button class="btn" id="reset-yes" type="button">${T.resetYes}</button><button class="btn" id="reset-no" type="button">${T.resetNo}</button></div>`
          : `<button class="link-btn" id="reset" type="button">${T.resetLink}</button>`}
      </section>
      ${canSpeak ? '' : `<p class="kana">${T.noSpeech}</p>`}
    `;
    document.querySelectorAll('[data-lv]').forEach(b => {
      b.onclick = () => { S.settings.level = b.dataset.lv; save(); setLevel(S.settings.level); sfx.tap(); renderHome(); };
    });
    $('#go-lesson').onclick = startLesson;
    $('#go-games').onclick = renderGames;
    $('#go-zukan').onclick = () => renderZukan(CATS[0].id);
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
    const fresh = newWords().slice(0, freshCount(due.length));
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
    show('play', T.lesson);
    renderStep();
  }

  function startGame(type, catId) {
    let pool = catId === 'all' ? ALL : catId === 'seen' ? ALL.filter(x => rec(x.w)) : ALL.filter(x => x.cat === catId);
    if (pool.length < 4) pool = ALL;
    const qs = shuffle(pool).slice(0, 8).map(x => ({ type: type === 'mix' ? pick(['meaning', 'listen', 'spell', 'usage']) : type, x }));
    P = { mode: 'game', steps: qs, i: 0, results: {}, correct: 0, answered: 0, stars: 0, fresh: [], game: { type, catId } };
    show('play', T.games.find(g => g.id === type).name);
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

  // いみが重なる単語（「さらに」と「そのうえ」など）は、同じ問題の選択肢にしない
  const meaningKeys = x => x.ja.replace(/（[^）]*）/g, '').split(/[・、]/).map(t => t.replace(/[〜\s]/g, '')).filter(Boolean);
  const sameMeaning = (a, b) => { const ka = meaningKeys(a); return meaningKeys(b).some(t => ka.includes(t)); };

  function distractors(x, n) {
    const ok = y => y.w !== x.w && !sameMeaning(x, y);
    const same = shuffle(ALL.filter(y => y.cat === x.cat && ok(y)));
    const other = shuffle(ALL.filter(y => y.cat !== x.cat && ok(y)));
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

  const praise = () => pick(T.praise);
  const retryNote = step => (step.tries || 0) < 2 ? T.retryLater : T.retryLast;
  const answerLine = x => `<span class="en">${esc(x.w)}</span> ＝ ${esc(x.ja)} ${x.emoji}`;

  function kanaHtml(x) { return S.settings.kana && x.kana ? `<div class="kana">${T.kana}${esc(x.kana)}</div>` : ''; }
  function visual(x) {
    return x.color ? `<div class="swatch" style="background:${x.color}" aria-label="${esc(x.ja)}"></div>` : `<div class="emoji" aria-hidden="true">${x.emoji}</div>`;
  }

  // ----- カード（はじめてのことば） -----
  function cardHtml(x, isNew) {
    return `
      <div class="card">
        ${isNew ? `<span class="new-badge">${T.newBadge}</span>` : ''}
        ${visual(x)}
        <div class="big-word${lenClass(x.w, 9, 12)}"><span class="ruled">${esc(x.w)}</span></div>
        ${kanaHtml(x)}
        <div class="ja">${esc(x.ja)}</div>
        <div class="btn-row">
          <button class="btn" data-act="say" type="button">${T.say}</button>
          <button class="btn" data-act="slow" type="button">${T.slow}</button>
          ${SR ? `<button class="btn" data-act="mic" type="button">${T.mic}</button>` : ''}
        </div>
        <div class="say-result" aria-live="polite"></div>
        <div class="example">
          <button class="speak" data-act="ex" type="button" aria-label="${T.exAria}">🔊</button>
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
      <div class="btn-row"><button class="btn btn-primary btn-big" id="card-next" type="button">${T.cardNext}</button></div>`;
    bindCard(body, step.x);
    $('#card-next').onclick = () => { sfx.tap(); next(); };
    speak(step.x.w);
  }

  // ----- いみクイズ -----
  function renderMeaning(step) {
    const x = step.x;
    const opts = shuffle([x].concat(distractors(x, 3)));
    $('#play-body').innerHTML = `
      <div class="q-label"><span class="q-tag">${T.meaningTag}</span><br>${T.meaningQ}</div>
      <div class="prompt">
        <div class="big-word${lenClass(x.w, 9, 12)}"><span class="ruled">${esc(x.w)}</span></div>
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
      <div class="q-label"><span class="q-tag">${T.listenTag}</span><br>${T.listenQ}</div>
      <div class="prompt">
        <button class="speak speak-huge" id="q-say" type="button" aria-label="きく">🔊</button>
        <button class="btn" id="q-slow" type="button">${T.slow}</button>
      </div>
      <div class="choices" id="choices">
        ${opts.map((o, i) => `<button class="choice en-choice${choiceSize(opts)}" data-i="${i}" type="button">${esc(o.w)}</button>`).join('')}
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
        answer(step, ok, ok ? `<b>${praise()}</b><br>${answerLine(x)}` : `<b>${T.miss}</b> ${T.answerIs} ${answerLine(x)}<br><small>${retryNote(step)}</small>`);
        speak(x.w);
        if (ok && onOk) onOk();
      };
    });
  }

  // ----- スペル -----
  function renderSpell(step) {
    const x = step.x;
    const letters = x.w.split('');
    const extra = shuffle('abcdefghijklmnopqrstuvwxyz'.split('').filter(c => !x.w.toLowerCase().includes(c))).slice(0, x.w.length <= 3 ? 2 : 3);
    const tiles = shuffle(letters.concat(extra));
    let pos = 0, mistakes = 0, hinted = false;

    $('#play-body').innerHTML = `
      <div class="q-label"><span class="q-tag">${T.spellTag}</span><br>${T.spellQ}</div>
      <div class="prompt">
        ${visual(x)}
        <div class="ja">${esc(x.ja)}</div>
        <div class="btn-row"><button class="speak" id="q-say" type="button" aria-label="きく">🔊</button></div>
        <div class="slots${lenClass(x.w, 8, 12)}"><span class="ruled" id="slots">${letters.map((_, i) => `<span class="slot empty${i === 0 ? ' next' : ''}" data-s="${i}"></span>`).join('')}</span></div>
      </div>
      <div class="tiles" id="tiles">${tiles.map((c, i) => `<button class="tile" data-i="${i}" type="button">${c}</button>`).join('')}</div>
      <div class="btn-row"><button class="btn" id="q-hint" type="button">${T.hint}</button></div>`;

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
        ? `<b>${praise()}</b> ${T.spellPerfect}<br>${answerLine(x)}`
        : `<b>${T.spellDone}</b> ${answerLine(x)}<br><small>${hinted ? T.hintUsed : ''}${retryNote(step)}</small>`);
    }
    function onKey(e) {
      if ($('#screen-play').hidden) return;
      const k = e.key.toLowerCase();
      if (!/^[a-z]$/.test(k)) return;
      // 大文字（Monday など）も、キーボードは小文字のまま打てるように
      const open = tileEls.filter(b => !b.classList.contains('used') && b.textContent.toLowerCase() === k);
      const t = open.find(b => b.textContent === letters[pos]) || open[0];
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
      <div class="q-label"><span class="q-tag">${T.usageTag}</span><br>${T.usageQ}</div>
      <div class="prompt">
        <p class="sentence">${markSentence(x, 'blank')}</p>
        <p class="sentence-ja">${esc(x.exJa)}</p>
      </div>
      <div class="choices" id="choices">
        ${opts.map((o, i) => `<button class="choice en-choice${choiceSize(opts)}" data-i="${i}" type="button">${esc(o.w)}</button>`).join('')}
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
          : `<b>${T.miss}</b> ${T.answerIs} <span class="en">${esc(x.w)}</span>（${esc(x.ja)}）<br><small>${retryNote(step)}</small>`);
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
    const title = T.titles[rate >= 90 ? 0 : rate >= 70 ? 1 : 2];
    const rows = Object.entries(P.results).map(([w, ok]) => {
      const x = WORDS.find(y => y.w === w);
      const isNew = P.fresh.includes(w);
      return `<div class="word-row">
        <span class="wr-emoji" aria-hidden="true">${x.emoji}</span>
        <span class="wr-word">${esc(w)}<br><span class="wr-ja">${esc(x.ja)}</span></span>
        ${isNew ? '<span class="pill pill-new">NEW</span>' : ''}
        <span class="pill ${ok ? 'pill-ok' : 'pill-ng'}">${ok ? T.okPill : T.ngPill}</span>
      </div>`;
    }).join('');
    const stickerMsg = newly.length
      ? `<section class="lesson-card"><h2>${T.gotSticker}</h2>
          <div class="stickers" style="width:100%">${newly.map(n => { const x = WORDS.find(y => y.w === n.w); return `<div class="sticker got${n.gold ? ' gold' : ''} pop" title="${esc(n.w)}">${x.emoji}</div>`; }).join('')}</div>
          <p>${T.gotNames(newly.map(n => esc(n.w)).join('、'), newly.some(n => n.gold))}</p></section>`
      : '';
    const nextDue = P.mode === 'lesson' ? `<p class="kana">${T.nextDue}</p>` : '';

    $('#screen-result').innerHTML = `
      <div class="result-hero">
        <div class="big" aria-hidden="true">${face}</div>
        <h1>${title}</h1>
        <p>${T.correctLine(P.correct, P.answered)}　・　⭐ +${P.stars}</p>
      </div>
      ${stickerMsg}
      <div class="word-list">${rows}</div>
      ${nextDue}
      <div class="btn-row">
        <button class="btn btn-primary btn-big" id="res-again" type="button">${P.mode === 'lesson' ? T.againLesson : T.againGame}</button>
        <button class="btn btn-big" id="res-home" type="button">${T.home}</button>
      </div>`;
    const prev = P;
    $('#res-again').onclick = () => prev.mode === 'lesson' ? startLesson() : startGame(prev.game.type, prev.game.catId);
    $('#res-home').onclick = renderHome;
    show('result', T.result);
  }

  // ---------- あそぶ ----------
  let gameSel = { type: 'meaning', cat: 'all' };
  function renderGames() {
    const cats = [{ id: 'all', name: T.catAll, icon: '🌈' }].concat(
      ALL.filter(x => rec(x.w)).length >= 4 ? [{ id: 'seen', name: T.catSeen, icon: '👀' }] : [],
      CATS);
    if (!cats.some(c => c.id === gameSel.cat)) gameSel.cat = 'all';
    $('#screen-games').innerHTML = `
      <div class="section-label">${T.gamesPick}</div>
      <div class="game-list">
        ${T.games.map(g => `<button class="btn game-btn" data-g="${g.id}" aria-pressed="${g.id === gameSel.type}" type="button">
          <span class="g-icon" aria-hidden="true">${g.icon}</span><span>${g.name}<small>${g.desc}</small></span></button>`).join('')}
      </div>
      <div class="section-label">${T.catPick}</div>
      <div class="cat-tabs" style="flex-wrap:wrap">
        ${cats.map(c => `<button class="cat-tab" data-c="${c.id}" aria-pressed="${c.id === gameSel.cat}" type="button">${c.icon} ${c.name}</button>`).join('')}
      </div>
      <div class="btn-row"><button class="btn btn-primary btn-big" id="game-start" type="button">${T.gameStart}</button></div>
      <p class="kana">${T.gamesNote}</p>`;
    document.querySelectorAll('[data-g]').forEach(b => { b.onclick = () => { gameSel.type = b.dataset.g; renderGames(); }; });
    document.querySelectorAll('[data-c]').forEach(b => { b.onclick = () => { gameSel.cat = b.dataset.c; renderGames(); }; });
    $('#game-start').onclick = () => startGame(gameSel.type, gameSel.cat);
    if ($('#screen-games').hidden) show('games', T.menuGames);
  }

  // ---------- ずかん ----------
  function statusMark(w) { return isMaster(w) ? '🥇' : isLearned(w) ? '🏅' : rec(w) ? '👀' : ''; }
  function renderZukan(catId) {
    $('#screen-zukan').innerHTML = `
      <div class="cat-tabs" role="toolbar" aria-label="${T.catPick}">
        ${CATS.map(k => `<button class="cat-tab" data-c="${k.id}" aria-pressed="${k.id === catId}" type="button">${k.icon} ${k.name}</button>`).join('')}
      </div>
      <div class="grid">
        ${ALL.filter(x => x.cat === catId).map((x, i, list) => `${x.level && (i === 0 || !list[i - 1].level) ? `<div class="grid-label">${T.step2}</div>` : ''}
          <button class="word-tile" data-w="${esc(x.w)}" type="button">
          <span class="wt-mark" aria-hidden="true">${statusMark(x.w)}</span>
          <span class="wt-emoji" aria-hidden="true">${x.emoji}</span>
          <span class="wt-word${x.w.length >= 11 ? ' xlong' : x.w.length >= 9 ? ' long' : ''}">${esc(x.w)}</span><span class="wt-ja">${esc(x.ja)}</span></button>`).join('')}
      </div>
      <p class="kana">${T.legend}</p>`;
    document.querySelectorAll('#screen-zukan [data-c]').forEach(b => { b.onclick = () => renderZukan(b.dataset.c); });
    document.querySelectorAll('#screen-zukan [data-w]').forEach(b => { b.onclick = () => openCard(b.dataset.w); });
    if ($('#screen-zukan').hidden) show('zukan', T.menuZukan);
    const active = document.querySelector('#screen-zukan .cat-tab[aria-pressed="true"]');
    if (active) active.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  function openCard(w) {
    const x = WORDS.find(y => y.w === w);
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
        <h1>${T.stickersCount(learned, ALL.length)}</h1>
        <p class="kana">${T.stickersNote}</p></div>
      ${CATS.map(c => `<section class="sticker-group"><h3>${c.icon} ${c.name}</h3><div class="stickers">
        ${ALL.filter(x => x.cat === c.id).map(({ w, emoji }) => isLearned(w)
          ? `<button class="sticker got${isMaster(w) ? ' gold' : ''}" data-w="${esc(w)}" type="button" aria-label="${esc(w)}">${emoji}</button>`
          : `<div class="sticker" aria-label="${T.notYet}"><span class="q">？</span></div>`).join('')}
      </div></section>`).join('')}`;
    document.querySelectorAll('#screen-stickers [data-w]').forEach(b => { b.onclick = () => openCard(b.dataset.w); });
    show('stickers', T.menuStickers);
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
