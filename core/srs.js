// Wiederholung nach Plan (Leitner-Kästchen) und Tagesserie. Reine Funktionen, ohne Oberfläche.

export const DAY = 86400000;
// Abstand bis zur nächsten Wiederholung je Kästchen (in Tagen). Kästchen 0 = neu.
export const INTERVALS = [0, 1, 2, 4, 8, 16, 32];
export const MAX_BOX = INTERVALS.length - 1;
export const RETRY_MIN = 10;          // falsch beantwortet: nach 10 Minuten wieder fällig

// Stufen von leicht nach schwer: Anfänger, Grundkenntnisse, Mittelstufe, Fortgeschritten, Profi.
export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

// Neuer Zustand einer Karte nach einer Antwort.
// Ein neues Wort, das gleich beim ersten Mal richtig ist, kannte man schon: es springt gleich auf Kästchen 2.
export function review(card, correct, now = Date.now()) {
  const box = correct ? Math.min(card ? (card.box || 0) + 1 : 2, MAX_BOX) : 1;
  const due = correct ? now + INTERVALS[box] * DAY : now + RETRY_MIN * 60000;
  return { box, due, seen: (card?.seen || 0) + 1, last: now };
}

// Wählt die Karten für eine Runde: erst fällige (die am längsten überfälligen zuerst, aus allen Stufen),
// dann neue Wörter genau aus der gewählten Stufe (höchstens newMax).
export function pickSession(words, state, { level = 'A1', size = 10, newMax = 5, now = Date.now() } = {}) {
  const due = words
    .filter(w => state[w.es] && state[w.es].due <= now)
    .sort((a, b) => state[a.es].due - state[b.es].due);
  const fresh = words.filter(w => !state[w.es] && w.lvl === level);
  const picked = due.slice(0, size);
  const room = Math.min(newMax, size - picked.length);
  return [...picked, ...fresh.slice(0, Math.max(0, room))];
}

export function counts(words, state, { level = 'A1', now = Date.now() } = {}) {
  const due = words.filter(w => state[w.es] && state[w.es].due <= now).length;
  const fresh = words.filter(w => !state[w.es] && w.lvl === level).length;
  const total = words.filter(w => w.lvl === level).length;
  const learned = words.filter(w => w.lvl === level && state[w.es] && state[w.es].box >= 4).length;
  return { due, fresh, learned, total };
}

// Übungsart je Kästchen: anfangs nur erkennen (hören, Bedeutung wählen), später selbst sprechen.
export const exerciseFor = card => ((card?.box || 0) <= 1 ? 'listen' : 'speak');

// ---------- Tagesserie ----------
export const dayKey = (d = new Date()) => d.toLocaleDateString('sv-SE');     // JJJJ-MM-TT, lokale Zeit
export const yesterdayKey = (today = dayKey()) => {
  const [y, m, d] = today.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d - 1));
};

// Serie nach erreichtem Tagesziel. lastGoalDay = letzter Tag mit erreichtem Ziel.
export function streakAfter(lastGoalDay, streak, today = dayKey()) {
  if (lastGoalDay === today) return streak;
  if (lastGoalDay === yesterdayKey(today)) return streak + 1;
  return 1;
}
// Serie, wie sie heute angezeigt wird: gestern erreicht zählt noch, älter ist abgerissen.
export function streakNow(lastGoalDay, streak, today = dayKey()) {
  return lastGoalDay === today || lastGoalDay === yesterdayKey(today) ? streak : 0;
}

// ---------- Einstufung ----------
// bands: { A1: [Werte 0..1], A2: [...], ... } -> höchste Stufe, deren Sätze der Reihe nach noch gut gelingen.
// Stufen ohne Werte (nicht mehr gefragt) zählen nicht. Mindestens A1.
export function placeLevel(bands, ok = 0.75) {
  const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
  let level = 'A1';
  for (const l of LEVELS) {
    const b = bands[l];
    if (!b || !b.length || avg(b) < ok) break;
    level = l;
  }
  return level;
}
