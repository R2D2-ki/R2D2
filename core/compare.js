// Vergleichskern: Soll-Satz gegen erkannten Text, Wort für Wort.
// Reine Funktionen, keine Oberfläche, keine Browser-Abhängigkeit (läuft auch in Node).

const ZAHLEN = ['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez',
  'once','doce','trece','catorce','quince','dieciseis','diecisiete','dieciocho','diecinueve','veinte'];

// Akzente weg (á→a, ü→u), aber ñ bleibt: n und ñ klingen verschieden.
export function normWord(w) {
  let s = w.toLowerCase().replace(/ñ/g, '\u0001');
  s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  s = s.replace(/\u0001/g, 'ñ').replace(/[^a-zñ0-9]/g, '');
  if (/^\d+$/.test(s) && Number(s) <= 20) s = ZAHLEN[Number(s)];
  return s;
}

export function tokenize(text) {
  return text.split(/\s+/).map(normWord).filter(Boolean);
}

// Anzeige-Wörter des Soll-Satzes (mit Satzzeichen, wie geschrieben) und ihre Normalform.
export function displayWords(text) {
  return text.split(/\s+/).filter(Boolean).map(raw => ({ raw, norm: normWord(raw) })).filter(w => w.norm);
}

function lev(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

// 1 = gleich, 0 = völlig verschieden
export function similarity(a, b) {
  if (a === b) return 1;
  const d = lev(a, b);
  return Math.max(0, 1 - d / Math.max(a.length, b.length));
}

export const OK_AB = 0.85;     // ab hier gilt das Wort als richtig
export const NAHE_AB = 0.55;   // ab hier „fast“

function statusVon(score) {
  return score >= OK_AB ? 'ok' : score >= NAHE_AB ? 'close' : 'wrong';
}

// Richtet Soll-Wörter und gehörte Wörter per Minimalkosten-Abgleich aus.
// Ergebnis: Eintrag je Soll-Wort + überzählige gehörte Wörter + Gesamtwert 0..1.
export function evaluate(targetText, heardText) {
  const target = displayWords(targetText);
  const heard = tokenize(heardText || '');
  const T = target.length, H = heard.length;

  const cost = Array.from({ length: T + 1 }, () => new Array(H + 1).fill(0));
  const back = Array.from({ length: T + 1 }, () => new Array(H + 1).fill(''));
  for (let i = 1; i <= T; i++) { cost[i][0] = i; back[i][0] = 'D'; }
  for (let j = 1; j <= H; j++) { cost[0][j] = j; back[0][j] = 'I'; }
  for (let i = 1; i <= T; i++) {
    for (let j = 1; j <= H; j++) {
      const sub = cost[i - 1][j - 1] + (1 - similarity(target[i - 1].norm, heard[j - 1]));
      const del = cost[i - 1][j] + 1;
      const ins = cost[i][j - 1] + 1;
      const best = Math.min(sub, del, ins);
      cost[i][j] = best;
      back[i][j] = best === sub ? 'S' : best === del ? 'D' : 'I';
    }
  }

  const words = new Array(T);
  const extra = [];
  let i = T, j = H;
  while (i > 0 || j > 0) {
    const step = back[i][j];
    if (i > 0 && j > 0 && step === 'S') {
      const score = similarity(target[i - 1].norm, heard[j - 1]);
      words[i - 1] = { raw: target[i - 1].raw, norm: target[i - 1].norm, heard: heard[j - 1], score, status: statusVon(score) };
      i--; j--;
    } else if (i > 0 && (j === 0 || step === 'D')) {
      words[i - 1] = { raw: target[i - 1].raw, norm: target[i - 1].norm, heard: null, score: 0, status: 'missing' };
      i--;
    } else {
      extra.unshift(heard[j - 1]);
      j--;
    }
  }

  const score = T ? words.reduce((s, w) => s + w.score, 0) / T : 0;
  return { words, extra, score, heardText: heardText || '' };
}

// Wählt aus mehreren möglichen Antworten diejenige, die zum Gehörten am besten passt.
// So bleibt das Gespräch etwas frei: du suchst dir eine Antwort aus und sprichst sie.
export function bestOption(heardText, optionsEs) {
  let best = { index: -1, result: null };
  optionsEs.forEach((opt, index) => {
    const result = evaluate(opt, heardText);
    // Überzählige Wörter leicht abwerten, damit kurze Treffer nicht gewinnen
    const adj = result.score - 0.03 * result.extra.length;
    if (!best.result || adj > best.adj) best = { index, result, adj };
  });
  return best;
}

export function summary(result) {
  const n = { ok: 0, close: 0, wrong: 0, missing: 0 };
  result.words.forEach(w => n[w.status]++);
  return n;
}
