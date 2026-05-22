const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<{ data: T | null; error: string | null; status: number }> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    const raw = await res.text();
    let data: T | null = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      return { data: null, error: raw || res.statusText, status: res.status };
    }

    if (!res.ok) {
      const errMsg = (data as Record<string, unknown>)?.error as string || res.statusText;
      return { data: null, error: errMsg, status: res.status };
    }

    return { data, error: null, status: res.status };
  } catch (err) {
    return { data: null, error: 'Network error', status: 0 };
  }
}
