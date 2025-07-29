import { NextApiRequest, NextApiResponse } from 'next';
import { authService } from '@/lib/api/external';
import { setAuthCookies } from '@/lib/cookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const signInData = req.body;

    // 입력 데이터 검증
    if (!signInData.email || !signInData.password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 외부 API 호출
    const authResponse = await authService.signIn(signInData);

    // 쿠키 설정
    setAuthCookies(res, authResponse.accessToken, authResponse.refreshToken);

    // 클라이언트에는 토큰을 제외한 사용자 정보만 반환
    res.status(200).json({
      user: authResponse.user,
      message: 'Sign in successful'
    });

  } catch (error) {
    console.error('Sign in error:', error);
    
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = message.includes('credentials') || message.includes('password') || message.includes('email') ? 401 : 500;
    
    res.status(statusCode).json({ message });
  }
}