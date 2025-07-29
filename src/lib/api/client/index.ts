import axios from 'axios';

const authAxios = axios.create({
  withCredentials: true, // 모든 요청에 쿠키를 포함
});

// NOTE: 프로덕션 환경에서는 여러 요청이 동시에 401 에러를 반환할 때
// 토큰 갱신 요청이 여러 번 발생하는 Race Condition을 방지하기 위해 실패 큐 등 로직을 활용할 수 있습니다

authAxios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 401 에러이고, 이미 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 요청
        const res = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        const newAccessToken = res.data.accessToken; // 백엔드에서 새로운 액세스 토큰을 반환한다고 가정

        // 원래 요청 재시도
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return authAxios(originalRequest);
      } catch (refreshError: any) {
        // 토큰 갱신 실패 시 로그아웃 처리

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default authAxios;