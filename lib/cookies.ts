import Cookies from "js-cookie";

const VIEWED_KEY = "bethora_viewed";
const SESSION_KEY = "bethora_session";
const CONSENT_KEY = "bethora_cookie_consent";

export function hasCookieConsent(): boolean {
  return Cookies.get(CONSENT_KEY) === "accepted";
}

export function setCookieConsent() {
  Cookies.set(CONSENT_KEY, "accepted", { expires: 365 });
}

export function trackProductView(productId: string) {
  const viewed = getViewedProducts();
  const updated = [productId, ...viewed.filter((id) => id !== productId)].slice(0, 20);
  Cookies.set(VIEWED_KEY, JSON.stringify(updated), { expires: 30 });
}

export function getViewedProducts(): string[] {
  try { return JSON.parse(Cookies.get(VIEWED_KEY) || "[]"); } catch { return []; }
}

export function getOrCreateSessionId(): string {
  let id = Cookies.get(SESSION_KEY);
  if (!id) { id = crypto.randomUUID(); Cookies.set(SESSION_KEY, id, { expires: 365 }); }
  return id;
}

export function logActivity(event: string, meta?: Record<string, unknown>) {
  const sessionId = getOrCreateSessionId();
  if (typeof window !== "undefined") {
    console.log("[activity]", { sessionId, event, meta, ts: Date.now() });
    // TODO: write to Firestore activityLogs collection in production
  }
}