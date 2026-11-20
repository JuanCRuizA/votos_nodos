// ⚠️ Pega aquí la URL de tu aplicación web de Apps Script (termina en /exec)
const API_URL = 'https://script.google.com/macros/s/AKfycbz_WAh6d439dUfMdPPYt6fpx-8LIqOy4RAoSAGaqf_v_5ayvGvdInAjkUzDBmdWH42d-A/exec';

class ApiError extends Error {
  constructor(msg, reintentar) { super(msg); this.reintentar = reintentar; }
}

/**
 * Llama a la API. Usa Content-Type text/plain para evitar el bloqueo CORS de Apps Script.
 * Reintenta ante fallas de red o cuando el servidor está ocupado.
 */
async function api(action, payload = {}, { reintentos = 2 } = {}) {
  if (API_URL.startsWith('PEGA_AQUI')) throw new ApiError('Falta configurar API_URL en config.js');
  for (let intento = 0; ; intento++) {
    try {
      const r = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, ...payload })
      });
      const j = await r.json();
      if (!j.ok) throw new ApiError(j.error || 'Error desconocido', j.reintentar);
      return j.data;
    } catch (e) {
      const reintentable = !(e instanceof ApiError) || e.reintentar;
      if (!reintentable || intento >= reintentos) {
        if (!(e instanceof ApiError)) throw new ApiError('No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.');
        throw e;
      }
      await new Promise(res => setTimeout(res, 1500 * (intento + 1)));
    }
  }
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const ESTADOS = {
  preparacion: 'Aún no inicia',
  abierta: 'Votación abierta',
  cerrada: 'Votación cerrada'
};

function nombreRonda(r) { return r === 1 ? 'Primera vuelta' : r === 2 ? 'Segunda vuelta' : `Ronda ${r}`; }
