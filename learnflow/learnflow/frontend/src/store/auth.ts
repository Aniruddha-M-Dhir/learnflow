// src/store/auth.ts
import { create } from 'zustand';
import { api, setTokens, loadTokens } from '@/lib/api';

type Role = 'instructor' | 'student' | null;
type User = { id: number; username: string; role: Role } | null;

type AuthState = {
  user: User;
  ready: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  ready: false,

  login: async (username, password) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error('Invalid credentials');
    const { access, refresh } = await res.json();
    setTokens(access, refresh);

    const me = await api('/api/me/');
    const user = await me.json();
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    set({ user: null });
  },

  hydrate: async () => {
    loadTokens();
    try {
      const me = await api('/api/me/');
      if (me.ok) set({ user: await me.json() });
    } catch {}
    set({ ready: true });
  },
}));
