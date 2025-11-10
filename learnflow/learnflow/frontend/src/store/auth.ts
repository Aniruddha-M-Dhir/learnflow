// src/store/auth.ts
import { create } from 'zustand';
import { api } from '@/lib/api';
// FIX: Importing the REAL function names from lib/auth.ts
import { saveTokens, clearTokens, getAccessToken } from '@/lib/auth';

type Role = 'instructor' | 'student' | null;
type User = { id: number; username: string; role: Role } | null;

type AuthState = {
  user: User;
  ready: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;
};

// FIX: Use the correct environment variable from your .env.local file
const BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

export const useAuth = create<AuthState>((set) => ({
  user: null,
  ready: false,

  login: async (username, password) => {
    // FIX: Use the BASE variable to contact the token endpoint
    const res = await fetch(`${BASE}/api/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error('Invalid credentials'); 
    
    const { access, refresh } = await res.json();
    
    // FIX: Use 'saveTokens' (the real function name)
    // The original code used 'setTokens', which does not exist.
    saveTokens(access, refresh);

    const me = await api('/api/me/');
    if (!me.ok) throw new Error('Failed to fetch user profile');
    
    const user = await me.json();
    set({ user });
  },

  logout: () => {
    // FIX: Use 'clearTokens'. The original code removed the wrong keys.
    clearTokens();
    set({ user: null });
  },

  hydrate: async () => {
    // FIX: This function was broken.
    const token = getAccessToken(); // from lib/auth.ts
    if (token) {
      try {
        const me = await api('/api/me/');
        if (me.ok) {
          set({ user: await me.json() });
        } else {
          set({ user: null });
          clearTokens(); // Token is bad, so clear it
        }
      } catch (e) {
        set({ user: null });
      }
    }
    set({ ready: true });
  },
}));