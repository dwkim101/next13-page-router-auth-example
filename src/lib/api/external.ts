import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://your-api-base-url.com';
const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID || '1234-1';

export interface User {
  id: number;
  email: string;
  nickname: string;
  teamId: string;
  updatedAt: string;
  createdAt: string;
  image: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}


// 간단한 axios 인스턴스
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const authService = {
  async signUp(data: { email: string; nickname: string; password: string; passwordConfirmation: string }) {
    const res = await api.post<AuthResponse>(`/${TEAM_ID}/auth/signUp`, data);
    return res.data;
  },

  async signIn(data: { email: string; password: string }) {
    const res = await api.post<AuthResponse>(`/${TEAM_ID}/auth/signIn`, data);
    return res.data;
  },

  async getMe(token: string) {
    const res = await api.get<User>(`/${TEAM_ID}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },


  async refreshToken(refreshToken: string) {
    const res = await api.post<{ accessToken: string }>(`/${TEAM_ID}/auth/refresh-token`, {
      refreshToken,
    });
    return res.data;
  },
};