import { NextApiRequest, NextApiResponse } from 'next';
import { authService } from '@/lib/api/external';
import { COOKIE_NAMES } from '@/lib/cookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 쿠키 확인
    const accessToken = req.cookies[COOKIE_NAMES.ACCESS_TOKEN];

    if (!accessToken) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // 외부 API에서 사용자 정보 가져오기
    const user = await authService.getMe(accessToken);

    res.status(200).json(user);

  } catch (error) {
    console.error('Get user info error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
}