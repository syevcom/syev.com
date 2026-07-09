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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === '1234' || password === 'sy1234' || password === 'admin1234') {
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-xs font-semibold text-slate-600 leading-relaxed">
            <span className="block font-black text-blue-700 mb-1">📢 에디터 모드 보안 안내</span>
            홈페이지의 <strong>로고, 카테고리 메뉴 이름, 그리고 시공 후기 지도 게시글</strong>을 직접 실시간으로 관리하고 추가하기 위해 비밀번호를 입력해 주세요.
            <div className="mt-2 text-[10px] bg-blue-500/10 text-blue-800 px-2 py-1 rounded-md font-bold inline-block">
              🔑 초기 관리자 비밀번호: <span className="font-extrabold text-blue-950 underline">1234</span>
            </div>
          </div>

          <div className="space-y-1.5 relative">
            <label className="block text-xs font-bold text-slate-700">관리자 보안 비밀번호</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 4자리를 입력해 주세요"
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
      </motion.div>
    </div>
  );
}
