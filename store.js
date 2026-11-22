// Speicher auf dem Gerät (localStorage). Alles in try/catch, weil der Zugriff im privaten Modus fehlschlagen kann.
const KEY = 'hablemos.v1';

const DEFAULTS = {
  settings: { lang: 'es', model: 'base', voiceURI: '', slow: false, autoSpeak: true, name: '', bromas: true },
  bromaIn: 0,         // Runden bis zum nächsten Scherz (0 = noch nicht gesetzt)
  bromaSeen: [],      // schon gezeigte Scherze
  trouble: {},        // wort -> { raw, fails, streak, last, example }
  modelLoaded: {},    // modellname -> true, wenn schon einmal geladen
  best: {},           // szenen-id -> bester Durchschnitt
};

let data = structuredClone(DEFAULTS);

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      data = { ...structuredClone(DEFAULTS), ...p, settings: { ...DEFAULTS.settings, ...(p.settings || {}) } };
    }
  } catch {}
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {} }
load();

export const store = {
  get settings() { return data.settings; },
  setSetting(k, v) { data.settings[k] = v; save(); },

  modelLoaded(m) { return !!data.modelLoaded[m]; },
  markModelLoaded(m) { data.modelLoaded[m] = true; save(); },

  trouble() {
    return Object.entries(data.trouble)
      .map(([norm, v]) => ({ norm, ...v }))
      .sort((a, b) => b.fails - a.fails || b.last - a.last);
  },
  // Wort wurde falsch gesprochen
  fail(norm, raw, example) {
    const t = data.trouble[norm] || { raw, fails: 0, streak: 0, last: 0, example: '' };
    t.fails++; t.streak = 0; t.last = Date.now(); t.raw = raw.replace(/[¿?¡!.,;:"()]/g, '');
    if (example) t.example = example;
    data.trouble[norm] = t; save();
  },
  // Wort wurde richtig gesprochen: nach 3 Treffern in Folge gilt es als gelernt
  pass(norm) {
    const t = data.trouble[norm];
    if (!t) return;
    t.streak++;
    if (t.streak >= 3) delete data.trouble[norm];
    save();
  },
  removeTrouble(norm) { delete data.trouble[norm]; save(); },
  clearTrouble() { data.trouble = {}; save(); },

  // Zählt eine abgeschlossene Runde. Gibt true zurück, wenn jetzt ein Scherz dran ist (alle 10 bis 15 Runden).
  tickBroma() {
    if (!data.bromaIn) data.bromaIn = 10 + Math.floor(Math.random() * 6);
    data.bromaIn--;
    save();
    return data.bromaIn <= 0;
  },
  markBroma(id, reset) {
    data.bromaSeen = reset ? [id] : [...data.bromaSeen, id];
    data.bromaIn = 10 + Math.floor(Math.random() * 6);
    save();
  },
  get bromaSeen() { return data.bromaSeen; },

  setBest(id, score) { data.best[id] = Math.max(score, data.best[id] || 0); save(); },
  best(id) { return data.best[id] || 0; },
};
