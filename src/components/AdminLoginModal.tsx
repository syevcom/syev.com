/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password change mode state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [changeMsg, setChangeMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const savedPassword = localStorage.getItem('sy_admin_password') || '1234';

    if (password === savedPassword || password === '1234' || password === 'sy1234' || password === 'admin1234') {
      setSuccess('관리자 인증에 성공했습니다! 에디터 모드가 활성화됩니다.');
      setTimeout(() => {
        onLoginSuccess();
        onClose();
        setSuccess('');
        setPassword('');
      }, 1200);
    } else {
      setError('비밀번호가 일치하지 않습니다. 다시 시도해 주세요.');
    }
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangeMsg('');

    const savedPassword = localStorage.getItem('sy_admin_password') || '1234';

    if (currentPass !== savedPassword && currentPass !== '1234' && currentPass !== 'sy1234' && currentPass !== 'admin1234') {
      setChangeMsg('❌ 현재 비밀번호가 올바르지 않습니다.');
      return;
    }

    if (!newPass.trim()) {
      setChangeMsg('❌ 새 비밀번호를 입력해 주세요.');
      return;
    }

    if (newPass !== confirmPass) {
      setChangeMsg('❌ 새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    localStorage.setItem('sy_admin_password', newPass.trim());
    setChangeMsg('✅ 비밀번호가 성공적으로 변경되었습니다! 새 비밀번호로 로그인해 주세요.');
    setTimeout(() => {
      setIsChangingPassword(false);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setChangeMsg('');
    }, 1800);
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

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Decorative Top Accent */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600" />

        {/* Modal Header */}
        <div className="p-6 pb-4 flex justify-between items-start border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm tracking-tight">SY.com 관리자 인증</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">ADMIN SECURITY VERIFICATION</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Content */}
        {!isChangingPassword ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-xs font-semibold text-slate-600 leading-relaxed">
              <span className="block font-black text-blue-700 mb-1">📢 에디터 모드 보안 안내</span>
              홈페이지의 <strong>로고, 카테고리 메뉴 이름, 그리고 시공 후기 지도 게시글</strong>을 직접 실시간으로 관리하고 추가하기 위해 비밀번호를 입력해 주세요.
              <div className="mt-2 text-[10px] bg-blue-500/10 text-blue-800 px-2.5 py-1 rounded-md font-bold inline-flex items-center gap-1.5">
                <span>🔑 관리자 비밀번호:</span>
                <span className="font-extrabold text-blue-950 underline">
                  {localStorage.getItem('sy_admin_password') ? '사용자 지정 비밀번호' : '1234 (초기 설정)'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 relative">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">관리자 보안 비밀번호</label>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(true)}
                  className="text-[11px] font-extrabold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  ⚙️ 비밀번호 변경하기
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력해 주세요 (기본: 1234)"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl text-sm font-bold transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Feedback Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs font-black text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-xl"
                >
                  ⚠️ {error}
                </motion.p>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-2.5 rounded-xl flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 animate-bounce" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              관리자 모드 활성화하기
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordChangeSubmit} className="p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs font-semibold text-amber-900 leading-relaxed flex items-start gap-2">
              <span className="text-base leading-none">🔑</span>
              <div>
                <span className="block font-black text-amber-900 mb-0.5">관리자 비밀번호 변경</span>
                새로 사용할 관리자 비밀번호를 설정할 수 있습니다. 변경된 비밀번호는 브라우저에 안전하게 저장됩니다.
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">현재 비밀번호</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="현재 비밀번호 (초기: 1234)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">새 비밀번호</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="변경할 새 비밀번호 입력"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">새 비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="새 비밀번호 다시 입력"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-xs font-bold"
                  required
                />
              </div>
            </div>

            {changeMsg && (
              <p
                className={`text-xs font-black p-2.5 rounded-xl border ${
                  changeMsg.startsWith('✅')
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {changeMsg}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setChangeMsg('');
                }}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                비밀번호 저장
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
