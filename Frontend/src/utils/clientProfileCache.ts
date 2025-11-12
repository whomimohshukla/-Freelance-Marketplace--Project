const KEY = 'clientProfile';

export type ClientProfile = any;

export function getClientProfileFromCache(): ClientProfile | null {
  try {
    const raw = localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setClientProfileCache(profile: ClientProfile, remember = true) {
  try {
    const json = JSON.stringify(profile);
    if (remember) {
      localStorage.setItem(KEY, json);
      sessionStorage.removeItem(KEY);
    } else {
      sessionStorage.setItem(KEY, json);
    }
  } catch {}
}

export function clearClientProfileCache() {
  try { localStorage.removeItem(KEY); } catch {}
  try { sessionStorage.removeItem(KEY); } catch {}
}
