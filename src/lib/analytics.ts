export function trackEvent(name: string, properties: Record<string, unknown> = {}) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log("[analytics]", name, properties);
  }
}
