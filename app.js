// Oberfläche. Der Kern (Vergleich, Szenen, Speicher, Audio, Whisper) liegt in eigenen Dateien.
import { evaluate, bestOption, OK_AB } from './core/compare.js';
import { SCENES, personalize } from './core/scenes.js';
import { store } from './store.js';
import { Asr, MODELS } from './asr.js';
import { startRecording, playSamples, toMono16k, speak, stopSpeaking, spanishVoices } from './audio.js';

// ---------------------------------------------------------------- Texte (ES Standard, DE umschaltbar)
const I = {
  es: {
    yourName: 'Tu nombre (para las frases)',
    hint: 'Pista', answerFree: 'Responde en español, con tus propias palabras.',
    noMatchFree: 'No he reconocido ninguna respuesta esperada. Inténtalo otra vez o pide una pista.',
    scenes: 'Conversaciones', custom: 'Frase propia', customSub: 'Escribe una frase y practícala',
    trouble: 'Palabras difíciles', troubleSub: 'Tus puntos débiles', settings: 'Ajustes',
    next: 'Siguiente', other: 'Otra respuesta', sayOne: 'Di una de estas respuestas en voz alta:',
    rec: 'Te escucho… toca para terminar', think: 'Analizando…', playing: 'Reproduciendo…',
    noSpeech: 'No he oído nada. Inténtalo otra vez.', micDenied: 'Sin acceso al micrófono. Actívalo en los ajustes de Safari.',
    needModel: 'Primero hay que cargar el reconocimiento de voz.', noMatch: 'No te he entendido bien. Inténtalo otra vez.',
    loadModel: 'Cargar reconocimiento de voz', loading: 'Cargando reconocimiento de voz…',
    modelInfo: 'Para evaluar tu pronunciación se descarga un modelo (una sola vez). Mejor con wifi.',
    modelErr: 'No se pudo cargar el modelo. ¿Hay conexión a internet?', retry: 'Reintentar',
    model: 'Modelo', mine: 'Mi voz', repeat: 'Repetir', slow: 'Lento',
    heard: 'He oído', heardNothing: 'No he oído nada claro.', missing: 'Falta',
    legend: 'Toca una palabra para escucharla', ok: 'bien', close: 'casi', wrong: 'mal', miss: 'falta',
    g1: '¡Excelente!', g2: '¡Muy bien!', g3: 'Casi. Repítelo.', g4: 'Inténtalo otra vez.',
    done: '¡Conversación terminada!', avg: 'Media', practiceHard: 'Practicar frases difíciles', finish: 'Terminar',
    allGood: '¡Todo correcto!', drill: 'Practicar', drillDone: '¡Práctica terminada!', of: 'de',
    customPh: 'Escribe una frase en español…', practice: 'Practicar', empty: 'Aún no hay palabras difíciles. ¡Buen trabajo!',
    practiceAll: 'Practicar todas', del: 'Quitar', voice: 'Voz', voiceNone: 'No hay voz española. En el iPhone: Ajustes › Accesibilidad › Contenido leído › Voces › Español.',
    modelSet: 'Modelo de reconocimiento', autoSpeak: 'Leer en voz alta al empezar', slowDefault: 'Leer despacio por defecto',
    reset: 'Borrar palabras difíciles', back: 'Atrás', best: 'mejor', translate: 'Traducir',
    persistent: 'Guardado en este iPhone', hello: 'Hablemos',
  },
  de: {
    yourName: 'Dein Name (für die Sätze)',
    hint: 'Hinweis', answerFree: 'Antworte auf Spanisch, mit eigenen Worten.',
    noMatchFree: 'Keine erwartete Antwort erkannt. Nochmal versuchen oder einen Hinweis holen.',
    scenes: 'Gespräche', custom: 'Eigener Satz', customSub: 'Satz eintippen und üben',
    trouble: 'Schwierige Wörter', troubleSub: 'Deine Schwachstellen', settings: 'Einstellungen',
    next: 'Weiter', other: 'Andere Antwort', sayOne: 'Sag eine dieser Antworten laut:',
    rec: 'Ich höre zu … zum Beenden tippen', think: 'Auswertung …', playing: 'Wiedergabe …',
    noSpeech: 'Nichts gehört. Bitte nochmal.', micDenied: 'Kein Zugriff aufs Mikrofon. In den Safari-Einstellungen erlauben.',
    needModel: 'Zuerst muss die Spracherkennung geladen werden.', noMatch: 'Das habe ich nicht verstanden. Bitte nochmal.',
    loadModel: 'Spracherkennung laden', loading: 'Spracherkennung wird geladen …',
    modelInfo: 'Zur Aussprache-Auswertung wird einmalig ein Modell geladen. Am besten mit WLAN.',
    modelErr: 'Modell konnte nicht geladen werden. Internetverbindung vorhanden?', retry: 'Nochmal',
    model: 'Vorbild', mine: 'Aufnahme', repeat: 'Wiederholen', slow: 'Langsam',
    heard: 'Gehört', heardNothing: 'Nichts Klares gehört.', missing: 'Fehlt',
    legend: 'Wort antippen zum Anhören', ok: 'richtig', close: 'fast', wrong: 'falsch', miss: 'fehlt',
    g1: 'Ausgezeichnet!', g2: 'Sehr gut!', g3: 'Fast. Nochmal sagen.', g4: 'Nochmal versuchen.',
    done: 'Gespräch beendet!', avg: 'Durchschnitt', practiceHard: 'Schwierige Sätze üben', finish: 'Fertig',
    allGood: 'Alles richtig!', drill: 'Üben', drillDone: 'Übung beendet!', of: 'von',
    customPh: 'Spanischen Satz eintippen …', practice: 'Üben', empty: 'Noch keine schwierigen Wörter. Gut gemacht!',
    practiceAll: 'Alle üben', del: 'Entfernen', voice: 'Stimme', voiceNone: 'Keine spanische Stimme. Am iPhone: Einstellungen › Bedienungshilfen › Gesprochene Inhalte › Stimmen › Spanisch.',
    modelSet: 'Erkennungsmodell', autoSpeak: 'Beim Start vorlesen', slowDefault: 'Standardmäßig langsam vorlesen',
    reset: 'Schwierige Wörter löschen', back: 'Zurück', best: 'Bestwert', translate: 'Übersetzen',
    persistent: 'Auf diesem iPhone gespeichert', hello: 'Hablemos',
  },
};
const lang = () => store.settings.lang;
const t = k => (I[lang()][k] ?? I.es[k] ?? k);
const showDe = () => lang() === 'de';

// ---------------------------------------------------------------- kleine Helfer
const $ = s => document.querySelector(s);
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(kid));
  return el;
}
const T = k => h('span', { 'data-k': k }, t(k));       // übersetzbarer Text, wird beim Umschalten aktualisiert
function relabel() {
  document.querySelectorAll('[data-k]').forEach(e => { e.textContent = t(e.dataset.k); });
  document.body.classList.toggle('de', showDe());
  $('#btnLang').textContent = lang().toUpperCase();
  document.documentElement.lang = lang() === 'de' ? 'de' : 'es';
  document.querySelectorAll('[data-ph]').forEach(e => { e.placeholder = t(e.dataset.ph); });
  refreshTitle();
  if (typeof asr !== 'undefined' && asr.state !== 'loading') updateBanner();
}
let toastTimer;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}
const pct = s => Math.round(s * 100);
const scoreClass = s => (s >= OK_AB ? 'g' : s >= 0.6 ? 'y' : 'r');
const grade = s => (s >= 0.95 ? 'g1' : s >= OK_AB ? 'g2' : s >= 0.6 ? 'g3' : 'g4');
const clean = w => w.replace(/[¿?¡!.,;:"()«»]/g, '');
const scrollEnd = () => requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));

// ---------------------------------------------------------------- Spracherkennung (Whisper)
const asr = new Asr({
  onState: (state) => {
    if (state === 'ready') store.markModelLoaded(store.settings.model);
    updateBanner();
  },
  onProgress: p => { const i = $('#banner .bar > i'); if (i) i.style.width = Math.round(p * 100) + '%'; },
});
window.__test = { fakeText: null };   // nur für automatische Tests
const asrReady = () => asr.state === 'ready' || window.__test.fakeText != null;

function startModelLoad() {
  asr.load(store.settings.model).catch(() => {});
}
function updateBanner() {
  const b = $('#banner');
  b.replaceChildren();
  const m = MODELS[store.settings.model];
  if (asr.state === 'ready') { b.hidden = true; return; }
  b.hidden = false;
  if (asr.state === 'loading') {
    b.append(T('loading'), h('div', { class: 'bar' }, h('i')));
  } else if (asr.state === 'error') {
    b.append(T('modelErr'), h('div', {}, h('button', { class: 'btn small', onclick: startModelLoad }, T('retry'))));
  } else {
    b.append(`${t('modelInfo')} (≈ ${m.mb} MB)`, h('div', {}, h('button', { class: 'btn small', onclick: startModelLoad }, T('loadModel'))));
  }
}

// ---------------------------------------------------------------- Aufnahme-/Wiedergabe-Steuerung (Dock)
let active = null;           // { targets[], locked: Index|null, rec, result, attempts, onResult(), onNoMatch() }
let busy = null;             // null | 'rec' | 'think' | 'play'
let recHandle = null, token = 0, curPlay = null;

const dock = { el: $('#dock'), model: $('#dModel'), mine: $('#dMine'), mic: $('#dMic'), repeat: $('#dRepeat'), slow: $('#dSlow'), status: $('#dStatus') };

function setActive(a) {
  active = a;
  updateDock();
}
function updateDock() {
  const has = !!active;
  dock.el.hidden = !has;
  document.body.classList.toggle('has-dock', has);
  if (!has) return;
  const idle = busy == null || busy === 'play';
  dock.model.disabled = !idle;
  dock.mine.disabled = !(idle && active.rec);
  dock.repeat.disabled = !(idle && active.locked != null && active.rec);
  dock.mic.disabled = busy === 'think';
  dock.mic.classList.toggle('rec', busy === 'rec');
  dock.mic.classList.toggle('think', busy === 'think');
  dock.slow.classList.toggle('on', store.settings.slow);
  dock.status.textContent = busy === 'rec' ? t('rec') : busy === 'think' ? t('think') : busy === 'play' ? t('playing') : '';
}

function stopAudio() {
  token++;
  curPlay?.stop(); curPlay = null;
  stopSpeaking();
  if (busy === 'play') { busy = null; updateDock(); }
}
async function playSeq(steps) {
  const my = ++token;
  busy = 'play'; updateDock();
  for (const s of steps) {
    if (my !== token) return false;
    curPlay = s();
    await curPlay.done;
  }
  if (my !== token) return false;
  busy = null; curPlay = null; updateDock();
  return true;
}
const rate = () => (store.settings.slow ? 0.65 : 1);
const sayStep = (text, r = rate()) => () => speak(text, { rate: r, voiceURI: store.settings.voiceURI });
function say(text, r) { return playSeq([sayStep(text, r)]); }

async function runListen() {
  if (!active) return false;
  const fake = window.__test.fakeText;
  let rec, text = '';
  if (fake != null) {
    rec = { samples: new Float32Array(16000), sampleRate: 16000, durationSec: 1, peak: 0.5, hadSpeech: true };
    busy = 'think'; updateDock();
    text = fake;
  } else {
    busy = 'rec'; updateDock();
    try {
      recHandle = await startRecording({ onLevel: v => dock.mic.style.setProperty('--lvl', Math.min(1, v * 6).toFixed(2)) });
    } catch (e) {
      busy = null; recHandle = null; updateDock(); toast(t('micDenied')); return false;
    }
    rec = await recHandle.done;
    recHandle = null;
    dock.mic.style.setProperty('--lvl', 0);
    if (!rec.hadSpeech) { busy = null; updateDock(); toast(t('noSpeech')); return false; }
    busy = 'think'; updateDock();
    try { text = await asr.transcribe(await toMono16k(rec.samples, rec.sampleRate)); }
    catch (e) { busy = null; updateDock(); toast(String(e.message || e)); return false; }
  }
  busy = null;
  if (!active) { updateDock(); return false; }
  applyHeard(rec, text);
  return true;
}

function applyHeard(rec, text) {
  let index, result;
  if (active.locked != null) {
    index = active.locked;
    result = evaluate(active.targets[index], text);
  } else {
    const b = bestOption(text, active.targets);
    if (!text.trim() || b.result.score < (active.minMatch ?? 0.3)) { updateDock(); toast(t('noMatch')); active.onNoMatch?.(text, rec); return; }
    index = b.index; result = b.result; active.locked = index;
  }
  active.rec = rec; active.result = result; active.attempts = (active.attempts || 0) + 1;
  const target = active.targets[index];
  for (const w of result.words) {
    if (w.status === 'wrong' || w.status === 'missing') store.fail(w.norm, w.raw, target);
    else if (w.status === 'ok') store.pass(w.norm);
  }
  updateDock();
  active.onResult({ index, result, rec, text, attempt: active.attempts });
}

dock.mic.addEventListener('click', async () => {
  if (!active) return;
  if (busy === 'rec') { recHandle?.stop(); return; }
  if (busy === 'think') return;
  if (!asrReady()) { toast(t('needModel')); updateBanner(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  stopAudio();
  await runListen();
});
dock.model.addEventListener('click', async () => {
  if (!active) return;
  if (busy === 'play') { stopAudio(); return; }
  if (active.locked != null) { say(active.targets[active.locked]); return; }
  // Noch keine Antwort gewählt: die Frage nochmal vorlesen (Antworten werden nicht verraten)
  say(active.prompt || active.targets[0]);
});
dock.mine.addEventListener('click', () => {
  if (!active?.rec) return;
  if (busy === 'play') { stopAudio(); return; }
  playSeq([() => playSamples(active.rec.samples, active.rec.sampleRate)]);
});
dock.repeat.addEventListener('click', async () => {
  if (!active || active.locked == null || !active.rec) return;
  if (!asrReady()) { toast(t('needModel')); return; }
  stopAudio();
  const a = active;
  const ok = await playSeq([
    () => playSamples(a.rec.samples, a.rec.sampleRate),
    sayStep(a.targets[a.locked]),
  ]);
  if (ok && active === a) await runListen();
});
dock.slow.addEventListener('click', () => {
  store.setSetting('slow', !store.settings.slow);
  updateDock();
});

// ---------------------------------------------------------------- Anzeige-Bausteine
function markedSentence(result) {
  const s = h('div', { class: 'sent' });
  for (const w of result.words) {
    s.append(h('span', { class: 'w ' + w.status, onclick: () => say(clean(w.raw), 0.7) }, w.raw), ' ');
  }
  return s;
}
function plainSentence(text) {
  const s = h('div', { class: 'sent' });
  for (const w of text.split(/\s+/).filter(Boolean)) s.append(h('span', { class: 'w plain', onclick: () => say(clean(w), 0.7) }, w), ' ');
  return s;
}
function resultBlock(result, heardText) {
  const miss = result.words.filter(w => w.status === 'missing').map(w => clean(w.raw));
  const heard = heardText.trim()
    ? h('div', { class: 'heard' }, h('b', {}, T('heard')), ': «', heardText, '»')
    : h('div', { class: 'heard' }, T('heardNothing'));
  // Ein falsches oder fehlendes Wort verhindert ein "Sehr gut", auch wenn der Durchschnitt hoch ist
  const hasErr = result.words.some(w => w.status === 'wrong' || w.status === 'missing');
  const g = hasErr && result.score >= OK_AB ? 'g3' : grade(result.score);
  const cls = hasErr && result.score >= OK_AB ? 'y' : scoreClass(result.score);
  return h('div', {},
    markedSentence(result),
    h('div', { style: 'margin-top:6px' },
      h('span', { class: 'score ' + cls }, pct(result.score) + ' %'),
      h('b', {}, T(g))),
    heard,
    miss.length ? h('div', { class: 'heard' }, h('b', {}, T('missing')), ': ', miss.join(', ')) : null,
  );
}
function legend() {
  return h('div', { class: 'legend' },
    h('span', { class: 'w ok' }, T('ok')), h('span', { class: 'w close' }, T('close')),
    h('span', { class: 'w wrong' }, T('wrong')), h('span', { class: 'w missing' }, T('miss')),
    h('span', { class: 'muted' }, ' · ', T('legend')));
}
function bubble(cls, es, de, { speakBtn = true } = {}) {
  const b = h('div', { class: 'bub ' + cls });
  const top = h('div', { class: 'top' }, h('div', { class: 'txt' }, es));
  if (speakBtn) top.append(h('button', { class: 'mini', 'aria-label': 'Escuchar', onclick: () => say(es) }, '🔊'));
  if (de) top.append(h('button', { class: 'mini', 'aria-label': 'Übersetzen', onclick: e => { b.classList.toggle('show-de'); e.currentTarget.classList.toggle('on'); } }, '🌐'));
  b.append(top);
  if (de) b.append(h('div', { class: 'de' }, de));
  return b;
}

// ---------------------------------------------------------------- Navigation
const view = $('#view');
let stack = [];           // Rücksprung-Funktionen
let titleSrc = 'hello';
function refreshTitle() { $('#title').textContent = typeof titleSrc === 'string' ? t(titleSrc) : titleSrc[lang()]; }
function setTitle(src) { titleSrc = src; refreshTitle(); }
function reset() {
  stopAudio(); recHandle?.stop();
  setActive(null);
  view.replaceChildren();
  window.scrollTo(0, 0);
  $('#btnBack').hidden = stack.length === 0;
}
function push(fn) { stack.push(fn); }
function goBack() { const fn = stack.pop(); (fn || home)(); }
$('#btnBack').addEventListener('click', goBack);
$('#btnLang').addEventListener('click', () => { store.setSetting('lang', lang() === 'es' ? 'de' : 'es'); relabel(); });
$('#btnSet').addEventListener('click', () => { push(currentScreen); settings(); });
let currentScreen = () => home();
function screen(fn) { currentScreen = fn; }

// ---------------------------------------------------------------- Start
const sceneList = () => personalize(SCENES, store.settings.name);

function home() {
  stack = [];
  screen(home); reset(); setTitle('hello');
  view.append(h('h2', { class: 'sec' }, T('scenes')));
  const grid = h('div', { class: 'grid' });
  for (const sc of sceneList()) {
    const best = store.best(sc.id);
    grid.append(h('button', { class: 'tile', onclick: () => { push(home); sceneScreen(sc); } },
      h('div', { class: 'e' }, sc.icon),
      h('div', {}, h('div', { class: 'n' }, sc.title.es),
        h('div', { class: 's de', }, sc.title.de),
        best ? h('div', { class: 's' }, `${t('best')}: ${pct(best)} %`) : null)));
  }
  grid.append(
    h('button', { class: 'tile wide', onclick: () => { push(home); customScreen(); } },
      h('div', { class: 'e' }, '✍️'), h('div', {}, h('div', { class: 'n' }, T('custom')), h('div', { class: 's' }, T('customSub')))),
    h('button', { class: 'tile wide', onclick: () => { push(home); troubleScreen(); } },
      h('div', { class: 'e' }, '🎯'), h('div', {}, h('div', { class: 'n' }, T('trouble'), ` (${store.trouble().length})`), h('div', { class: 's' }, T('troubleSub')))));
  view.append(grid);
  relabel();
}

// ---------------------------------------------------------------- Gespräch
function sceneScreen(sc) {
  screen(() => sceneScreen(sc)); reset(); setTitle(sc.title);
  const chat = h('div', { class: 'chat' });
  view.append(chat, legend());
  const results = [];
  let idx = 0;

  // Antwortmöglichkeiten sind erst einmal verborgen: du antwortest aus dem Kopf.
  // Die App ordnet das Gesagte der ähnlichsten erwarteten Antwort zu. Der Hinweis-Knopf zeigt sie an.
  function optionsCard(turn) {
    const list = h('div', { hidden: true, style: 'margin-top:10px' },
      turn.options.map(o => h('div', { class: 'opt' }, h('div', { class: 'es' }, o.es), h('div', { class: 'de' }, o.de))));
    const note = h('div', { class: 'heard' });
    const btn = h('button', { class: 'btn small ghost', onclick: () => { list.hidden = false; btn.hidden = true; scrollEnd(); } }, '💡 ', T('hint'));
    const card = h('div', { class: 'opts' }, h('div', { class: 'hint' }, T('answerFree')), btn, list, note);
    card.noteEl = note;
    return card;
  }

  function nextTurn() {
    const turn = sc.turns[idx];
    chat.append(bubble('', turn.partner.es, turn.partner.de));
    const opts = optionsCard(turn);
    chat.append(opts);
    let me = null;
    if (store.settings.autoSpeak) say(turn.partner.es);
    relabel(); scrollEnd();

    setActive({
      targets: turn.options.map(o => o.es), locked: null, rec: null, result: null,
      prompt: turn.partner.es, minMatch: 0.5,
      onNoMatch: text => {
        opts.noteEl.replaceChildren(text.trim() ? h('div', {}, h('b', {}, T('heard')), ': «', text, '»') : '', h('div', {}, T('noMatchFree')));
        relabel(); scrollEnd();
      },
      onResult: ({ index, result, text }) => {
        results[idx] = { target: turn.options[index].es, result };
        const body = h('div', {},
          resultBlock(result, text),
          h('div', { class: 'row', style: 'margin-top:10px' },
            h('button', { class: 'btn small', onclick: () => advance(me) }, T('next'), ' →'),
            h('button', { class: 'btn small ghost', onclick: () => { me.replaceWith(opts); active.locked = null; active.rec = null; active.result = null; updateDock(); } }, T('other'))));
        const nb = h('div', { class: 'bub me' }, body);
        if (me) me.replaceWith(nb); else opts.replaceWith(nb);
        me = nb;
        relabel(); scrollEnd();
      },
    });
  }

  function advance(me) {
    me.querySelector('.row')?.remove();
    idx++;
    if (idx < sc.turns.length) nextTurn(); else finish();
  }

  function finish() {
    const scores = results.map(r => r.result.score);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    store.setBest(sc.id, avg);
    setActive(null);
    const weak = results.filter(r => r.result.score < OK_AB || r.result.words.some(w => w.status === 'wrong' || w.status === 'missing'));
    chat.append(h('div', { class: 'card' },
      h('h3', {}, T('done')),
      h('p', {}, T('avg'), ': ', h('span', { class: 'score ' + scoreClass(avg) }, pct(avg) + ' %')),
      results.map(r => h('div', { class: 'item' }, h('div', { class: 'grow' }, markedSentence(r.result)),
        h('span', { class: 'score ' + scoreClass(r.result.score) }, pct(r.result.score) + ' %'))),
      weak.length === 0 ? h('p', {}, h('b', {}, T('allGood'))) : null,
      h('div', { class: 'row', style: 'margin-top:8px' },
        weak.length ? h('button', { class: 'btn', onclick: () => { push(() => sceneScreen(sc)); drillScreen(weak.map(w => w.target)); } }, T('practiceHard')) : null,
        h('button', { class: 'btn ghost', onclick: () => { stack = []; home(); } }, T('finish')))));
    relabel(); scrollEnd();
  }

  nextTurn();
}

// ---------------------------------------------------------------- Üben (Sätze oder Wörter nacheinander)
function drillScreen(targets) {
  screen(() => drillScreen(targets)); reset(); setTitle('drill');
  const holder = h('div');
  view.append(holder, legend());
  let i = 0;

  function show() {
    if (i >= targets.length) {
      setActive(null);
      holder.replaceChildren(h('div', { class: 'card' }, h('h3', {}, T('drillDone')),
        h('div', { class: 'row', style: 'margin-top:10px' }, h('button', { class: 'btn', onclick: goBack }, T('finish')))));
      relabel(); return;
    }
    const target = targets[i];
    const slot = h('div', {}, plainSentence(target));
    const card = h('div', { class: 'card' },
      h('div', { class: 'muted small' }, `${i + 1} ${t('of')} ${targets.length}`),
      slot,
      h('div', { class: 'row', style: 'margin-top:10px' },
        h('button', { class: 'btn small', onclick: () => { i++; show(); } }, T('next'), ' →')));
    holder.replaceChildren(card);
    setActive({
      targets: [target], locked: 0, rec: null, result: null,
      onResult: ({ result, text }) => { slot.replaceChildren(resultBlock(result, text)); relabel(); },
    });
    say(target);
    relabel();
  }
  show();
}

// ---------------------------------------------------------------- Eigener Satz
function customScreen() {
  screen(customScreen); reset(); setTitle('custom');
  const ta = h('textarea', { 'data-ph': 'customPh', placeholder: t('customPh'), enterkeyhint: 'go', autocapitalize: 'sentences', spellcheck: 'false' });
  view.append(h('div', { class: 'card' }, ta,
    h('div', { class: 'row', style: 'margin-top:10px' },
      h('button', { class: 'btn', onclick: () => { const s = ta.value.trim(); if (s) { push(customScreen); drillScreen([s]); } } }, T('practice')))));
  relabel();
}

// ---------------------------------------------------------------- Schwierige Wörter
function troubleScreen() {
  screen(troubleScreen); reset(); setTitle('trouble');
  const list = store.trouble();
  if (!list.length) { view.append(h('div', { class: 'card' }, T('empty'))); relabel(); return; }
  view.append(h('div', { class: 'row', style: 'margin-bottom:10px' },
    h('button', { class: 'btn', onclick: () => { push(troubleScreen); drillScreen(list.map(w => w.raw)); } }, T('practiceAll'))));
  const card = h('div', { class: 'card' });
  for (const w of list) {
    card.append(h('div', { class: 'item' },
      h('div', { class: 'grow' }, h('div', { style: 'font-size:20px;font-weight:600' }, w.raw),
        w.example ? h('div', { class: 'muted small' }, w.example) : null),
      h('span', { class: 'muted small' }, '×' + w.fails),
      h('button', { class: 'mini', onclick: () => say(w.raw, 0.7) }, '🔊'),
      h('button', { class: 'mini', onclick: () => { push(troubleScreen); drillScreen([w.raw, ...(w.example ? [w.example] : [])]); } }, '🎤'),
      h('button', { class: 'mini', 'aria-label': t('del'), onclick: () => { store.removeTrouble(w.norm); troubleScreen(); } }, '✕')));
  }
  view.append(card);
  relabel();
}

// ---------------------------------------------------------------- Einstellungen
function settings() {
  screen(settings); reset(); setTitle('settings');
  const s = store.settings;
  const modelCard = h('div', { class: 'card' }, h('h3', { style: 'margin-bottom:6px' }, T('modelSet')));
  for (const [key, m] of Object.entries(MODELS)) {
    modelCard.append(h('label', { class: 'opt-row' },
      h('input', { type: 'radio', name: 'm', checked: s.model === key, onchange: () => { store.setSetting('model', key); startModelLoad(); } }),
      h('span', {}, h('b', {}, key), ` · ≈ ${m.mb} MB · `, h('span', { class: 'muted' }, m.label[lang()]))));
  }
  const voices = spanishVoices();
  const sel = h('select', { onchange: e => store.setSetting('voiceURI', e.target.value) },
    h('option', { value: '' }, 'Auto'),
    voices.map(v => h('option', { value: v.voiceURI, selected: v.voiceURI === s.voiceURI }, `${v.name} (${v.lang})`)));
  const voiceCard = h('div', { class: 'card' }, h('h3', { style: 'margin-bottom:6px' }, T('voice')), sel,
    h('div', { class: 'row', style: 'margin-top:8px' }, h('button', { class: 'btn small ghost', onclick: () => say('Hola, ¿qué tal? Me llamo Mónica.') }, '🔊 Test')),
    voices.length ? null : h('p', { class: 'muted small' }, T('voiceNone')));
  const nameCard = h('div', { class: 'card' }, h('h3', { style: 'margin-bottom:6px' }, T('yourName')),
    h('input', { type: 'text', id: 'nameInput', value: s.name || '', placeholder: 'María', autocomplete: 'off', autocapitalize: 'words', spellcheck: 'false',
      onchange: e => store.setSetting('name', e.target.value.trim()) }));
  const optCard = h('div', { class: 'card' },
    h('label', { class: 'opt-row' }, h('input', { type: 'checkbox', checked: s.autoSpeak, onchange: e => store.setSetting('autoSpeak', e.target.checked) }), T('autoSpeak')),
    h('label', { class: 'opt-row' }, h('input', { type: 'checkbox', checked: s.slow, onchange: e => store.setSetting('slow', e.target.checked) }), T('slowDefault')),
    h('div', { class: 'row', style: 'margin-top:6px' }, h('button', { class: 'btn small ghost', onclick: () => { store.clearTrouble(); toast('✓'); } }, T('reset'))),
    h('p', { class: 'muted small' }, T('persistent')));
  view.append(nameCard, modelCard, voiceCard, optCard);
  relabel();
}

// ---------------------------------------------------------------- Start der App
relabel();
home();
updateBanner();
if (store.modelLoaded(store.settings.model)) startModelLoad();    // schon einmal geladen: im Hintergrund wieder aufwecken

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
