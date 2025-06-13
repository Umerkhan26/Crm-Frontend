// utils/auth.js
export function isTokenExpired(token) {
  if (!token) return true;

  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    const exp = decoded.exp;
    if (!exp) return true;

    const currentTime = Date.now() / 1000;
    return exp < currentTime;
  } catch (e) {
    return true;
  }
}
