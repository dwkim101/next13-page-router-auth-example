import { NextApiRequest, NextApiResponse } from 'next';
import { COOKIE_NAMES, setAuthCookies, clearAuthCookies } from '@/lib/cookies';
import { authService } from '@/lib/api/external';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const refreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token found' });
    }

    // apiClient를 사용한 토큰 갱신
    const data = await authService.refreshToken(refreshToken);

    // 새로운 accessToken으로 쿠키 설정
    setAuthCookies(res, data.accessToken);

    res.status(200).json({
      message: 'Token refreshed successfully'
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    
    // refresh 실패시 쿠키 정리
    clearAuthCookies(res);
    
    res.status(401).json({ 
      message: 'Token refresh failed. Please login again.',
      needsLogin: true 
    });
  }
}