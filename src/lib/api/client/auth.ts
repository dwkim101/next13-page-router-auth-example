import authAxios from '../client';
import { User } from '../external'; // User 인터페이스 임포트

interface AuthResponse {
  user: User;
  message: string;
}

const authApi = {
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await authAxios.post<AuthResponse>('/api/auth/signin', { email, password });
    return data;
  },

  signUp: async (email: string, nickname: string, password: string, passwordConfirmation: string): Promise<AuthResponse> => {
    const { data } = await authAxios.post<AuthResponse>('/api/auth/signup', { email, nickname, password, passwordConfirmation });
    return data;
  },

  logout: async (): Promise<void> => {
    await authAxios.post('/api/auth/logout', {});
  },

  getMe: async (): Promise<User> => {
    const { data } = await authAxios.get<User>('/api/auth/me');
    return data;
  },
};

export default authApi;
