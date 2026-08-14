/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Mail, Lock, User, Building, Landmark, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
  onOpenAdminLogin?: () => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess, onOpenAdminLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'B2C' | 'B2B'>('B2C');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSocialLogin = (provider: 'google' | 'kakao' | 'naver') => {
    if (provider === 'google') {
      const googleClientId = '889311235329-ovmo1867vanikg7ert7gero2d75k9f06.apps.googleusercontent.com';

      if ((window as any).google && (window as any).google.accounts && (window as any).google.accounts.oauth2) {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: (response: any) => {
            if (response && response.access_token) {
              fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` }
              })
                .then(res => res.json())
                .then(data => {
                  const loggedInUser: UserType = {
                    id: `usr-google-${data.sub || Date.now()}`,
                    email: data.email || '',
                    name: data.name || data.given_name || (data.email ? data.email.split('@')[0] : '구글 사용자'),
                    profileImage: data.picture || '',
                    type: 'B2C'
                  };
                  onLoginSuccess(loggedInUser);
                  setSuccess('구글 로그인 성공!');
                  setTimeout(() => {
                    onClose();
                    setSuccess('');
                  }, 800);
                })
                .catch(err => {
                  console.error('Google Userinfo Error:', err);
                  setError('구글 프로필 정보를 가져오는 중 오류가 발생했습니다.');
                });
            }
          }
        });
        client.requestAccessToken();
        return;
      } else {
        // Direct OAuth Redirect fallback for Google
        const redirectUri = encodeURIComponent(window.location.origin.replace(/\/$/, ''));
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile`;
        sessionStorage.setItem('google_auth_pending', 'true');
        window.location.href = googleAuthUrl;
        return;
      }
    }

    if (provider === 'naver') {
      const naverClientId = '70CVfYxs3pmZjg_kATOJ';
      const redirectUri = encodeURIComponent(window.location.origin.replace(/\/$/, ''));
      const state = Math.random().toString(36).substring(2, 11);
      sessionStorage.setItem('naver_oauth_state', state);

      const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}&redirect_uri=${redirectUri}&state=${state}`;
      
      sessionStorage.setItem('naver_auth_pending', 'true');
      window.location.href = naverAuthUrl;
      return;
    }

    if (provider === 'kakao') {
      alert('카카오 로그인은 현재 서비스 준비 중입니다. 네이버 또는 구글 로그인을 이용해 주세요.');
      return;
    }
  };

  const handleBusinessVerify = () => {
    if (!businessNumber || businessNumber.replace(/[^0-9]/g, '').length < 10) {
      setError('올바른 사업자등록번호 10자리를 입력해 주세요.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해 주세요.');
      return;
    }

    if (!isLogin && !name) {
      setError('이름을 입력해 주세요.');
      return;
    }

    if (!isLogin && userType === 'B2B') {
      if (!companyName) {
        setError('회사명(법인명)을 입력해 주세요.');
        return;
      }
      if (!handleBusinessVerify()) {
        return;
      }
    }

    // Get stored accounts or create a clean real session
    const storedUsersStr = localStorage.getItem('sy_registered_users');
    const storedUsers: Record<string, any> = storedUsersStr ? JSON.parse(storedUsersStr) : {};

    if (isLogin) {
      // Check registered users
      const existing = storedUsers[email.toLowerCase()];
      if (existing) {
        if (existing.password !== password) {
          setError('비밀번호가 일치하지 않습니다.');
          return;
        }
        onLoginSuccess(existing.user);
        setSuccess('성공적으로 로그인되었습니다.');
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 800);
        return;
      }

      // Default real email login
      const loggedUser: UserType = {
        id: `usr-${Date.now()}`,
        email,
        name: email.split('@')[0],
        type: 'B2C'
      };
      
      onLoginSuccess(loggedUser);
      setSuccess('성공적으로 로그인되었습니다.');
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 800);
    } else {
      // Register
      const newUser: UserType = {
        id: `usr-${Date.now()}`,
        email,
        name,
        type: userType,
        companyName: userType === 'B2B' ? companyName : undefined,
        businessNumber: userType === 'B2B' ? businessNumber : undefined
      };

      storedUsers[email.toLowerCase()] = { password, user: newUser };
      localStorage.setItem('sy_registered_users', JSON.stringify(storedUsers));
      
      onLoginSuccess(newUser);
      setSuccess('SY.com 회원가입이 완료되었습니다!');
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
        id="auth-modal"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="btn-close-auth"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors z-10 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Accent bar */}
        <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-slate-950 tracking-tight leading-tight">
              {isLogin ? 'SY.com에 오신 것을 환영합니다' : 'SY.com 통합 회원가입'}
            </h2>
            <p className="text-xs text-slate-500 mt-1.5 font-semibold">
              {isLogin ? '전국 최대 전기차 충전 솔루션 파트너' : '무상 보조금 신청 및 스마트 관제 무상 혜택'}
            </p>
          </div>

          {/* Social Logins */}
          {isLogin && (
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('naver')}
                  id="btn-naver-login"
                  className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <span className="w-5 h-5 bg-[#03C75A] text-white font-bold flex items-center justify-center text-[10px] rounded-full mr-1.5">N</span>
                  네이버
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('kakao')}
                  id="btn-kakao-login"
                  className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-slate-200 bg-[#FEE500] hover:bg-[#FCD800] text-xs font-bold text-slate-900 transition-colors cursor-pointer"
                >
                  <span className="w-5 h-5 bg-[#3C1E1E] text-[#FEE500] font-bold flex items-center justify-center text-[10px] rounded-full mr-1.5">K</span>
                  카카오
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  id="btn-google-login"
                  className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <span className="w-5 h-5 bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-[10px] rounded-full mr-1.5">G</span>
                  구글
                </button>
              </div>
              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold">또는 이메일 계정</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>
            </div>
          )}

          {/* Tab Selection for Sign Up */}
          {!isLogin && (
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setUserType('B2C')}
                id="tab-signup-b2c"
                className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  userType === 'B2C'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-850'
                }`}
              >
                <User className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />
                일반 고객 (B2C)
              </button>
              <button
                type="button"
                onClick={() => setUserType('B2B')}
                id="tab-signup-b2b"
                className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  userType === 'B2B'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-850'
                }`}
              >
                <Building className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />
                법인/사업자 (B2B)
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-100 rounded-xl text-rose-600 font-bold">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-xs bg-blue-50 border border-blue-100 rounded-xl text-blue-600 font-bold flex items-center gap-1.5">
                <Check className="h-4 w-4" />
                {success}
              </div>
            )}

            {/* Email input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">이메일 주소</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  id="input-auth-email"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-bold transition-all"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">비밀번호</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  id="input-auth-password"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-bold transition-all"
                />
              </div>
            </div>

            {/* Registration Additional Fields */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-1"
              >
                {/* Full name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {userType === 'B2B' ? '담당자 이름' : '이름'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="홍길동"
                      id="input-auth-name"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-bold transition-all"
                    />
                  </div>
                </div>

                {/* B2B Dedicated Fields */}
                {userType === 'B2B' && (
                  <div className="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-150">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">법인명 / 회사명</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                          <Building className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="(유)에스와이닷컴"
                          id="input-auth-company"
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus:border-blue-600 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-slate-700">사업자등록번호</label>
                        <span className="text-[10px] text-slate-400 font-bold">추후 세금계산서 무상 발행용</span>
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                          <Landmark className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          value={businessNumber}
                          onChange={(e) => setBusinessNumber(e.target.value)}
                          placeholder="123-45-67890"
                          id="input-auth-business"
                          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus:border-blue-600 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              id="btn-auth-submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all mt-6 cursor-pointer"
            >
              {isLogin ? '로그인하기' : '회원가입 완료'}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-6 text-center text-xs text-slate-500 font-semibold">
            {isLogin ? (
              <p>
                아직 SY.com 계정이 없으신가요?{' '}
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                  }}
                  id="btn-switch-register"
                  className="font-bold text-blue-600 hover:text-blue-500 hover:underline ml-1 cursor-pointer"
                >
                  회원가입
                </button>
              </p>
            ) : (
              <p>
                이미 계정이 있으신가요?{' '}
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                  }}
                  id="btn-switch-login"
                  className="font-bold text-blue-600 hover:text-blue-500 hover:underline ml-1 cursor-pointer"
                >
                  로그인
                </button>
              </p>
            )}
          </div>

          {/* Admin Login Link */}
          {onOpenAdminLogin && (
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminLogin();
                }}
                className="text-[11px] font-bold text-slate-400 hover:text-blue-600 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>🔒 관리자 전용 계정 로그인</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
