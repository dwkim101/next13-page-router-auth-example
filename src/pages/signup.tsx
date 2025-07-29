import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUpPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, error, signUp, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirmation: '',
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
      await signUp(
        formData.email,
        formData.nickname,
        formData.password,
        formData.passwordConfirmation
      );
      router.push('/');
    } catch {} finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = 
    formData.email &&
    formData.nickname &&
    formData.password &&
    formData.passwordConfirmation &&
    formData.password === formData.passwordConfirmation;

  if (isAuthenticated) return null;

  return (
    <div className="p-5">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="font-bold mb-2">회원가입</h1>
          <p>새 계정을 만들어 시작해보세요</p>
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

          <div className="mb-5">
            <label htmlFor="nickname" className="block mb-2 font-medium">
              닉네임
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
              required
              className="w-full p-3"
            />
          </div>

          <div className="mb-5">
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

          <div className="mb-5">
            <label htmlFor="passwordConfirmation" className="block mb-2 font-medium">
              비밀번호 확인
            </label>
            <input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              value={formData.passwordConfirmation}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
              className="w-full p-3"
            />
            {formData.password && formData.passwordConfirmation && formData.password !== formData.passwordConfirmation && (
              <p className="mt-2">비밀번호가 일치하지 않습니다</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full p-3 font-medium cursor-pointer mb-5 disabled:cursor-not-allowed"
          >
            {isSubmitting || isLoading ? '처리 중...' : '회원가입'}
          </button>

          <p className="text-center">
            이미 계정이 있으신가요?{' '}
            <Link href="/signin" className="font-medium no-underline">
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}