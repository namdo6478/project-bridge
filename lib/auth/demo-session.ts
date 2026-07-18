export const DEMO_SESSION_KEY = "chuksan-market:demo-phone-session:v1";

export interface DemoPhoneSession {
  verified: true;
  phone: string;
  verifiedAt: string;
}

export function saveDemoPhoneSession(phone: string) {
  const session: DemoPhoneSession = {
    verified: true,
    phone,
    verifiedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
}

export function loadDemoPhoneSession(): DemoPhoneSession | null {
  if (typeof window === "undefined") return null;
  try {
    const value = JSON.parse(window.localStorage.getItem(DEMO_SESSION_KEY) ?? "null") as DemoPhoneSession | null;
    return value?.verified === true ? value : null;
  } catch {
    window.localStorage.removeItem(DEMO_SESSION_KEY);
    return null;
  }
}
