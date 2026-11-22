// Audio: Aufnahme (rohes PCM, ohne MediaRecorder), Wiedergabe, Spanisch vorlesen.
// Kein MediaRecorder, weil dieser auf dem iPhone Fehler macht (leere Aufnahmen, Abbruch nach ~30 s).

let ctx = null;

export function audioCtx() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    ctx = new C();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// ---------- Aufnahme ----------
// Gibt ein Handle zurück: { stop(), done: Promise<rec> }
// Stoppt von selbst, wenn nach dem Sprechen eine Pause kommt, oder nach maxSec.
export async function startRecording({ maxSec = 20, onLevel } = {}) {
  const c = audioCtx();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
  });
  const src = c.createMediaStreamSource(stream);
  const proc = c.createScriptProcessor(4096, 1, 1);
  const mute = c.createGain();
  mute.gain.value = 0;

  const chunks = [];
  let elapsed = 0, floorSum = 0, floorN = 0, thresh = 0.02;
  let speaking = false, speechMs = 0, silenceMs = 0, peak = 0;
  let finished = false, resolveDone;
  const done = new Promise(r => (resolveDone = r));

  function finish() {
    if (finished) return;
    finished = true;
    proc.onaudioprocess = null;
    try { src.disconnect(); proc.disconnect(); mute.disconnect(); } catch {}
    stream.getTracks().forEach(t => t.stop());
    const total = chunks.reduce((n, a) => n + a.length, 0);
    const samples = new Float32Array(total);
    let o = 0;
    for (const a of chunks) { samples.set(a, o); o += a.length; }
    resolveDone({
      samples, sampleRate: c.sampleRate, durationSec: total / c.sampleRate,
      peak, hadSpeech: speechMs >= 250,
    });
  }

  proc.onaudioprocess = e => {
    if (finished) return;
    const d = e.inputBuffer.getChannelData(0);
    chunks.push(new Float32Array(d));
    let sum = 0;
    for (let i = 0; i < d.length; i++) {
      const v = d[i];
      sum += v * v;
      const a = v < 0 ? -v : v;
      if (a > peak) peak = a;
    }
    const rms = Math.sqrt(sum / d.length);
    const ms = (d.length / c.sampleRate) * 1000;
    elapsed += ms;
    onLevel && onLevel(rms);

    // Grundrauschen aus den ersten 400 ms schätzen
    if (elapsed <= 400) { floorSum += rms; floorN++; thresh = Math.max(0.02, (floorSum / floorN) * 3); return; }

    if (rms > thresh) { speaking = true; speechMs += ms; silenceMs = 0; }
    else if (speaking) { silenceMs += ms; if (silenceMs >= 1400) finish(); }
    if (!speaking && elapsed > 9000) finish();      // lange nichts gesagt
    if (elapsed >= maxSec * 1000) finish();
  };

  src.connect(proc);
  proc.connect(mute);
  mute.connect(c.destination);
  return { stop: finish, done };
}

// ---------- Wiedergabe der eigenen Aufnahme ----------
export function playSamples(samples, sampleRate) {
  const c = audioCtx();
  // leise Aufnahmen für die Wiedergabe anheben
  let peak = 0;
  for (let i = 0; i < samples.length; i++) { const a = Math.abs(samples[i]); if (a > peak) peak = a; }
  const gain = peak > 0 ? Math.min(8, 0.9 / peak) : 1;
  const buf = c.createBuffer(1, samples.length, sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < samples.length; i++) ch[i] = samples[i] * gain;
  const s = c.createBufferSource();
  s.buffer = buf;
  s.connect(c.destination);
  const done = new Promise(r => { s.onended = r; });
  s.start();
  return { done, stop() { try { s.stop(); } catch {} } };
}

// ---------- Umrechnen für Whisper (16 kHz mono) ----------
export async function toMono16k(samples, sampleRate) {
  if (sampleRate === 16000) return samples;
  const len = Math.ceil((samples.length * 16000) / sampleRate);
  const oc = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, len, 16000);
  const b = oc.createBuffer(1, samples.length, sampleRate);
  b.copyToChannel(samples, 0);
  const s = oc.createBufferSource();
  s.buffer = b;
  s.connect(oc.destination);
  s.start();
  const out = await oc.startRendering();
  return out.getChannelData(0);
}

// ---------- Spanisch vorlesen ----------
let voices = [];
function loadVoices() { voices = (window.speechSynthesis?.getVoices() || []); }
if ('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}

const isEs = v => /^es[-_]/i.test(v.lang);

export function spanishVoices() {
  loadVoices();
  const es = voices.filter(isEs);
  // Spanien zuerst
  return es.sort((a, b) => (/es[-_]ES/i.test(b.lang) ? 1 : 0) - (/es[-_]ES/i.test(a.lang) ? 1 : 0));
}

function chooseVoice(voiceURI) {
  const list = spanishVoices();
  if (voiceURI) { const v = list.find(x => x.voiceURI === voiceURI); if (v) return v; }
  const spain = list.filter(v => /es[-_]ES/i.test(v.lang));
  const pool = spain.length ? spain : list;
  return pool.find(v => /premium|enhanced|erweitert|mejorada/i.test(v.name)) || pool[0] || null;
}

let currentUtter = null;

export function speak(text, { rate = 1, voiceURI } = {}) {
  const synth = window.speechSynthesis;
  if (!synth) return { done: Promise.resolve(), stop() {} };
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'es-ES';
  const v = chooseVoice(voiceURI);
  if (v) { u.voice = v; u.lang = v.lang.replace('_', '-'); }
  u.rate = rate;
  currentUtter = u;
  let resolved = false, resolveFn;
  const done = new Promise(r => { resolveFn = () => { if (!resolved) { resolved = true; r(); } }; });
  u.onend = resolveFn;
  u.onerror = resolveFn;
  // Sicherung: auf dem iPhone bleibt onend manchmal aus
  setTimeout(resolveFn, Math.max(2500, (text.length * 130) / rate + 2000));
  synth.speak(u);
  return { done, stop() { synth.cancel(); resolveFn(); } };
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel();
}
