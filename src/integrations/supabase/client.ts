import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { brokeredPreviewStorage } from "./previewAuthStorage";

const FALLBACK_SUPABASE_URL = "https://oqnuwfeyszymfpcbgzww.supabase.co";
const FALLBACK_SUPABASE_KEY = "sb_publishable_EH8KbkOU9RDWaBYWYxGtjw_MS9K1U5m";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (
      isNewSupabaseApiKey(supabaseKey) &&
      headers.get("Authorization") === `Bearer ${supabaseKey}`
    ) {
      headers.delete("Authorization");
    }

    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

export function getSupabaseEnvConfig(): { url: string; key: string } {
  const env = (import.meta.env ?? {}) as Record<string, string | undefined>;
  const nodeEnv =
    typeof process !== "undefined" && process.env
      ? (process.env as Record<string, string | undefined>)
      : {};

  const url = (env["VITE_SUPABASE_URL"] || nodeEnv["SUPABASE_URL"] || FALLBACK_SUPABASE_URL).trim();

  const key = (
    env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    env["VITE_SUPABASE_ANON_KEY"] ||
    nodeEnv["SUPABASE_PUBLISHABLE_KEY"] ||
    nodeEnv["SUPABASE_ANON_KEY"] ||
    FALLBACK_SUPABASE_KEY
  ).trim();

  return { url, key };
}

function createSupabaseClient() {
  const { url, key } = getSupabaseEnvConfig();

  return createClient<Database>(url, key, {
    global: {
      fetch: createSupabaseFetch(key),
    },
    auth: {
      storage: brokeredPreviewStorage(),
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
