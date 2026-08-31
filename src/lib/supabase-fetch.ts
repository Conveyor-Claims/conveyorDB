/** Always hit dest. Next.js must not cache cabinet GETs across /cases and /new-cases. */
export function noStoreFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  return fetch(input, { ...init, cache: "no-store" });
}
