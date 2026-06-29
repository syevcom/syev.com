/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LogIn, LogOut, User, CalendarDays, Sparkles, MessageSquare } from 'lucide-react';
import { User as UserType, ActivePage } from '../types';

interface HeaderProps {
  user: UserType | null;
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  onOpenAuth: () => void;
  onOpenMyPage: () => void;
  onOpenQuote: () => void;
}

export default function Header({
  user,
  activePage,
  onPageChange,
  onOpenAuth,
  onOpenMyPage,
  onOpenQuote
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner (Subtle, professional notification) */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-slate-900 text-white text-[11px] py-2 px-4 text-center font-semibold tracking-wide flex justify-center items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
        <span>[공지] 2026년 하반기 전기차 충전기 국가 무상 보조금 한도 선착순 마감 임박! 지금 바로 견적 신청하세요.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onPageChange('home')}
          id="logo-container"
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <span className="font-black text-white text-base tracking-tighter">SY</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tighter text-blue-900 leading-none">SY<span className="text-blue-600">.com</span></span>
            <span className="text-[9px] text-slate-400 font-bold tracking-wider mt-0.5 uppercase">EV Charging Solution</span>
          </div>
        </div>

        {/* Action Buttons (Right) */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {user ? (
            <div className="flex items-center gap-2.5">
              {/* User Greeting (Desktop) */}
              <button
                onClick={onOpenMyPage}
                id="btn-header-mypage-user"
                className="hidden md:flex items-center gap-1.5 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping shrink-0" />
                <span className="max-w-[120px] truncate">{user.name}</span>
                <span className="text-[10px] text-slate-400">({user.type === 'B2B' ? 'B2B' : 'B2C'})</span>
              </button>

              <button
                onClick={onOpenMyPage}
                id="btn-header-mypage"
                className="flex items-center gap-1.5 py-2 px-3 text-slate-600 hover:text-slate-950 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <User className="h-4 w-4 text-slate-500" />
                <span>마이페이지</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenAuth}
                id="btn-header-login"
                className="flex items-center gap-1.5 py-2 px-3 text-slate-600 hover:text-slate-950 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <LogIn className="h-4 w-4 text-slate-400" />
                <span>로그인 / 회원가입</span>
              </button>
            </div>
          )}

          {/* Emphasized Smart Consultation CTA Button */}
          <button
            onClick={onOpenQuote}
            id="btn-header-cta"
            className="relative overflow-hidden group py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {/* Subtle glow highlight */}
            <span className="absolute inset-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:animate-shine" />
            <CalendarDays className="h-4 w-4" />
            <span>실시간 상담/예약</span>
            <span className="text-[10px] bg-amber-400 text-amber-950 font-bold px-1.5 py-0.5 rounded-md animate-pulse">💡</span>
          </button>
        </div>
      </div>
    </header>
  );
}
