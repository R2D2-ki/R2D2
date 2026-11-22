// Whisper läuft hier im Hintergrund (Web Worker), damit die Oberfläche flüssig bleibt.
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1';

env.allowLocalModels = false;
env.useBrowserCache = true;   // Modell wird nach dem ersten Download im Browser gespeichert

let asr = null;
let loadedModel = null;

self.onmessage = async e => {
  const m = e.data;
  try {
    if (m.type === 'load') {
      if (asr && loadedModel === m.model) { self.postMessage({ type: 'ready', model: m.model }); return; }
      asr = null;
      asr = await pipeline('automatic-speech-recognition', m.model, {
        device: 'wasm',
        dtype: 'q8',
        progress_callback: p => self.postMessage({ type: 'progress', p }),
      });
      loadedModel = m.model;
      self.postMessage({ type: 'ready', model: m.model });
    } else if (m.type === 'transcribe') {
      if (!asr) throw new Error('Modell nicht geladen');
      const out = await asr(m.audio, {
        language: 'spanish',
        task: 'transcribe',
        chunk_length_s: 30,
        return_timestamps: false,
      });
      self.postMessage({ type: 'result', id: m.id, text: (out.text || '').trim() });
    }
  } catch (err) {
    self.postMessage({ type: 'error', id: m.id, message: String(err && err.message || err) });
  }
};
