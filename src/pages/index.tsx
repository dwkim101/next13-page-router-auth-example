import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  // 로그인된 경우 - 내 정보 표시
  if (isAuthenticated && user) {
    return (
      <div>
        <header className="px-5">
          <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
            <h1 className="font-semibold">내 정보</h1>
            <button 
              onClick={handleLogout}
              className="py-2 px-4 cursor-pointer"
            >
              로그아웃
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto py-10 px-5">
          <div>
            <h2 className="font-semibold mb-5">사용자 정보</h2>
            <div className="flex items-center gap-5">
              <div>
                <h3 className="font-bold mb-2">
                  {user.nickname}
                </h3>
                <p className="mb-2">{user.email}</p>
                <p className="mb-1">
                  팀 ID: {user.teamId}
                </p>
                <p>
                  가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 로그인되지 않은 경우
  return (
    <div className="p-5">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="mb-4">🍷</h1>
          <h2 className="font-extrabold mb-2">와인 리뷰</h2>
          <p>쿠키 기반 인증 시스템</p>
        </div>

        <div>
          <h3 className="text-center mb-5">시작하기</h3>
          <div className="flex flex-col gap-3">
            <Link href="/signin">
              <button className="w-full p-3 cursor-pointer">
                로그인
              </button>
            </Link>
            <Link href="/signup">
              <button className="w-full p-3 cursor-pointer">
                회원가입
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}