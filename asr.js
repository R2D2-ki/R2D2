// Brücke zum Whisper-Worker.
export const MODELS = {
  tiny:  { id: 'Xenova/whisper-tiny',  mb: 40,  label: { es: 'Rápido, menos preciso', de: 'Schnell, ungenauer' } },
  base:  { id: 'Xenova/whisper-base',  mb: 80,  label: { es: 'Recomendado', de: 'Empfohlen' } },
  small: { id: 'Xenova/whisper-small', mb: 250, label: { es: 'Preciso, más lento', de: 'Genauer, langsamer' } },
};

// Sätze, die Whisper bei Stille gerne erfindet
const HALLUZINATION = /amara\.org|subt[ií]tulos|gracias por ver|suscr[ií]b|thanks for watching/i;

export class Asr {
  constructor({ onState, onProgress } = {}) {
    this.onState = onState || (() => {});
    this.onProgress = onProgress || (() => {});
    this.state = 'idle';           // idle | loading | ready | error
    this.worker = null;
    this.pending = new Map();
    this.nextId = 1;
    this.files = new Map();
  }

  _set(state, extra) { this.state = state; this.onState(state, extra); }

  load(modelKey) {
    const model = MODELS[modelKey]?.id || MODELS.base.id;
    if (this.worker) { this.worker.terminate(); this.worker = null; }
    this.files.clear();
    this._set('loading');
    return new Promise((resolve, reject) => {
      let w;
      try { w = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }); }
      catch (e) { this._set('error', String(e)); reject(e); return; }
      this.worker = w;
      w.onmessage = ev => {
        const m = ev.data;
        if (m.type === 'progress') {
          const p = m.p;
          if (p.file && p.total) this.files.set(p.file, { loaded: p.loaded || 0, total: p.total });
          let l = 0, t = 0;
          for (const f of this.files.values()) { l += f.loaded; t += f.total; }
          this.onProgress(t ? l / t : 0);
        } else if (m.type === 'ready') {
          this._set('ready');
          resolve();
        } else if (m.type === 'result') {
          this.pending.get(m.id)?.resolve(m.text);
          this.pending.delete(m.id);
        } else if (m.type === 'error') {
          if (m.id && this.pending.has(m.id)) { this.pending.get(m.id).reject(new Error(m.message)); this.pending.delete(m.id); }
          else { this._set('error', m.message); reject(new Error(m.message)); }
        }
      };
      w.onerror = ev => { this._set('error', ev.message || 'Worker-Fehler'); reject(new Error(ev.message)); };
      w.postMessage({ type: 'load', model });
    });
  }

  transcribe(audio16k) {
    if (!this.worker || this.state !== 'ready') return Promise.reject(new Error('Modell nicht bereit'));
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, {
        resolve: text => resolve(HALLUZINATION.test(text) ? '' : text),
        reject,
      });
      this.worker.postMessage({ type: 'transcribe', id, audio: audio16k });
    });
  }
}
