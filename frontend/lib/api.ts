export interface LoginResponse {
  token: string;
  tokenType: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'The backend could not authenticate this session.');
  }
  return response.json() as Promise<LoginResponse>;
}
