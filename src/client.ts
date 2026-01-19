const HUB_URL = "https://huggingface.co";
const DATASETS_SERVER_URL =
  process.env.HF_DATASETS_SERVER ?? "https://datasets-server.huggingface.co";
const TOKEN = process.env.HF_TOKEN ?? process.env.HUGGINGFACE_HUB_TOKEN ?? "";

function authHeaders(): HeadersInit {
  return TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
}

export async function fetchHub<T>(
  path: string,
  params: Record<string, string | number | string[] | undefined>
): Promise<T> {
  const url = new URL(path, HUB_URL);
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined) return;
    if (Array.isArray(v)) {
      v.forEach((item) => url.searchParams.append(k, item));
    } else {
      url.searchParams.set(k, String(v));
    }
  });

  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export async function fetchDatasetViewer<T>(
  path: string,
  params: Record<string, string | number | undefined>
): Promise<T> {
  const url = new URL(path, DATASETS_SERVER_URL);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) url.searchParams.set(k, String(v));
  });

  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}
