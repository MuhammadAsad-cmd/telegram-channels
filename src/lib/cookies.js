const AUTH_TOKEN_KEY = "auth_token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function setAuthCookie(token) {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

export function getAuthCookie() {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split("; ")
    .find((r) => r.startsWith(`${AUTH_TOKEN_KEY}=`))
    ?.split("=")[1];
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0`;
}
