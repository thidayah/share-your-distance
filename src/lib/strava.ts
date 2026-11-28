export function isValidStravaUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.port) {
      return false;
    }

    const hostname = url.hostname.toLowerCase();
    if (hostname === 'strava.app.link') {
      return /^\/[a-z\d_-]+\/?$/i.test(url.pathname);
    }

    return ['strava.com', 'www.strava.com'].includes(hostname)
      && /^\/athletes\/[a-z\d_-]+\/?$/i.test(url.pathname);
  } catch {
    return false;
  }
}
