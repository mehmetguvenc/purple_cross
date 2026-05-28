// I only expose the $fetch options I need today. More fields can be added later on.
export interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  query?: object;
  headers?: object;
}

// Wraps $fetch with the API base URL so I don't pass it on every call
export function api<T>(path: string, opts?: ApiOptions): Promise<T> {
  return $fetch<T>(path, {
    baseURL: useRuntimeConfig().public.apiBase,
    ...opts,
  } as Parameters<typeof $fetch>[1]);
}
