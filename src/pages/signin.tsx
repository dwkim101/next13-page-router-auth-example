import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function SignInPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, error, signIn, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.push('/');
    return clearError;
  }, [isAuthenticated, router, clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await signIn(formData.email, formData.password);
      router.push('/');
    } catch {} finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="p-5">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="font-bold mb-2">로그인</h1>
          <p className="text-gray-600">계정에 로그인하여 계속하세요</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 mb-5">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 font-medium">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              required
              className="w-full p-3"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="block mb-2 font-medium">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
              className="w-full p-3"
            />
          </div>

          <button
            type="submit"
            disabled={!formData.email || !formData.password || isSubmitting || isLoading}
            className="w-full p-3 font-medium cursor-pointer mb-5 disabled:cursor-not-allowed"
          >
            {isSubmitting || isLoading ? '처리 중...' : '로그인'}
          </button>

          <p className="text-center">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="font-medium no-underline">
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export const getStaticProps = () => ({ props: {} });