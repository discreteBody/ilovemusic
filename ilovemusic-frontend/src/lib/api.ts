const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.ilovemusic.com';

const SPOTIFY_STATUS_URL = 'http://localhost:8080/api/auth/spotify/status';

type SpotifyStatusData = {
  spotify_connected: boolean;
  spotify_id: string;
  username: string;
  timestamp: number;
};

type SpotifyStatusResponse = {
  success: boolean;
  data: SpotifyStatusData;
};

type SpotifyStatusCheckResult =
  | { exists: true; connected: boolean; data: SpotifyStatusData }
  | { exists: false; error: string };

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export async function verifySpotifyStatusEndpoint(
  token: string,
  endpointUrl = SPOTIFY_STATUS_URL,
  timeoutMs = 5000,
): Promise<SpotifyStatusCheckResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    if (response.status === 200) {
      const payload: SpotifyStatusResponse = await response.json();
      const connected = Boolean(payload?.data?.spotify_connected);
      const username = payload?.data?.username ?? 'unknown';

      console.log(`✅ Endpoint verified - Connected: ${connected}, User: ${username}`);

      return {
        exists: true,
        connected,
        data: payload.data,
      };
    }

    if (response.status === 404) {
      console.log('❌ Endpoint not found');
      return { exists: false, error: 'Endpoint returned 404 Not Found' };
    }

    return {
      exists: false,
      error: `Unexpected response status: ${response.status}`,
    };
  } catch (error) {
    console.log('❌ Endpoint not found');

    if (error instanceof Error && error.name === 'AbortError') {
      return { exists: false, error: `Request timed out after ${timeoutMs}ms` };
    }

    return {
      exists: false,
      error: error instanceof Error ? error.message : 'Network error while checking endpoint',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

