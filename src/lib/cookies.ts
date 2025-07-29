import { NextApiResponse } from 'next';

export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'whyne_access_token',
  REFRESH_TOKEN: 'whyne_refresh_token',
} as const;

// 쿠키 설정
export function setAuthCookies(res: NextApiResponse, accessToken: string, refreshToken?: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const cookies = [
    `${COOKIE_NAMES.ACCESS_TOKEN}=${accessToken}; Path=/; Max-Age=${60*60*24*7}; SameSite=strict; HttpOnly${secure}`,
  ];
  
  if (refreshToken) {
    cookies.push(`${COOKIE_NAMES.REFRESH_TOKEN}=${refreshToken}; Path=/; Max-Age=${60*60*24*30}; SameSite=strict; HttpOnly${secure}`);
  }
  
  res.setHeader('Set-Cookie', cookies);
}

// 쿠키 삭제
export function clearAuthCookies(res: NextApiResponse) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const cookies = [
    `${COOKIE_NAMES.ACCESS_TOKEN}=; Path=/; Max-Age=0; HttpOnly${secure}`,
    `${COOKIE_NAMES.REFRESH_TOKEN}=; Path=/; Max-Age=0; HttpOnly${secure}`,
  ];
  res.setHeader('Set-Cookie', cookies);
}
