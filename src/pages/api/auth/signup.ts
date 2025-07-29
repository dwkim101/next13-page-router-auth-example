import { NextApiRequest, NextApiResponse } from 'next';
import { authService } from '@/lib/api/external';
import { setAuthCookies } from '@/lib/cookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const signUpData = req.body;

    // 입력 데이터 검증
    if (!signUpData.email || !signUpData.nickname || !signUpData.password || !signUpData.passwordConfirmation) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (signUpData.password !== signUpData.passwordConfirmation) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // 외부 API 호출
    const authResponse = await authService.signUp(signUpData);

    // 쿠키 설정
    setAuthCookies(res, authResponse.accessToken, authResponse.refreshToken);

    // 클라이언트에는 토큰을 제외한 사용자 정보만 반환
    res.status(200).json({
      user: authResponse.user,
      message: 'Sign up successful'
    });

  } catch (error) {
    console.error('Sign up error:', error);
    
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = message.includes('email') || message.includes('exists') ? 409 : 500;
    
    res.status(statusCode).json({ message });
  }
}