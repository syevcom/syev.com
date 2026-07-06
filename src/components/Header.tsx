/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LogIn, LogOut, User, CalendarDays, Sparkles, MessageSquare, Settings } from 'lucide-react';
import { User as UserType, ActivePage } from '../types';

interface HeaderProps {
  user: UserType | null;
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  onOpenAuth: () => void;
  onOpenMyPage: () => void;
  onOpenQuote: () => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onOpenCms?: () => void;
  logoConfig?: {
    text: string;
    subtitle: string;
    imageUrl?: string;
    showCompanyName?: boolean;
    companyNameText?: string;
    companyNameFont?: string;
    companyNameWeight?: string;
    companyNameSize?: string;
    companyNameColor?: string;
  };
}

export default function Header({
  user,
  activePage,
  onPageChange,
  onOpenAuth,
  onOpenMyPage,
  onOpenQuote,
  isEditMode,
  onToggleEditMode,
  onOpenCms,
  logoConfig = { text: 'SY', subtitle: 'SY.com', showCompanyName: true, companyNameText: '주식회사 에스와이코리아' }
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner (Subtle, professional notification) */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-slate-900 text-white text-[11px] py-2 px-4 text-center font-semibold tracking-wide flex justify-center items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
        <span>[공지] 2026년 하반기 전기차 충전기 국가 무상 보조금 한도 선착순 마감 임박! 지금 바로 견적 신청하세요.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 relative flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left Action Buttons (e.g., Admin/Edit) */}
        <div className="flex items-center gap-1.5 sm:gap-3 order-2 sm:order-1 sm:absolute sm:left-4 lg:left-8 top-1/2 sm:-translate-y-1/2">
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100 rounded-full p-0.5 sm:p-1 border border-slate-200 shrink-0">
            <button
              onClick={onToggleEditMode}
              id="btn-header-edit-toggle"
              className={`flex items-center gap-0.5 sm:gap-1 py-1 px-1.5 sm:px-2.5 rounded-full text-[10px] font-black tracking-tight transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isEditMode
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Settings className={`w-3 h-3 shrink-0 ${isEditMode ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isEditMode ? '수정모드 On' : '관리자 에디터'}</span>
              <span className="sm:hidden whitespace-nowrap">{isEditMode ? '수정 On' : '관리자'}</span>
            </button>
            {isEditMode && onOpenCms && (
              <button
                onClick={onOpenCms}
                id="btn-header-cms-open"
                className="flex items-center gap-0.5 sm:gap-1 py-1 px-1.5 sm:px-2 bg-slate-900 text-white rounded-full text-[10px] font-black cursor-pointer hover:bg-slate-800 transition-all shadow-sm whitespace-nowrap shrink-0"
              >
                <span className="hidden sm:inline">✏️ CMS 대시보드</span>
                <span className="sm:hidden whitespace-nowrap">✏️ CMS</span>
              </button>
            )}
          </div>
        </div>

        {/* Centered Logo & 에스와이닷컴 */}
        <div 
          onClick={() => onPageChange('home')}
          id="logo-container"
          className="flex flex-col items-center justify-center cursor-pointer group order-1 sm:mx-auto text-center shrink-0"
        >
          {logoConfig.imageUrl ? (
            <img 
              src={logoConfig.imageUrl} 
              alt={logoConfig.subtitle} 
              className="h-9 max-w-[150px] object-contain transition-transform group-hover:scale-102 shrink-0 mb-1"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0 mb-1">
              <span className="font-black text-white text-xs tracking-tighter">{logoConfig.text}</span>
            </div>
          )}
          
          <div className="flex flex-col items-center leading-none">
            <span className="font-black text-sm sm:text-base tracking-tight text-blue-900 whitespace-nowrap">
              에스와이닷컴 <span className="text-blue-600 text-xs font-bold font-mono">({logoConfig.subtitle || 'SY.com'})</span>
            </span>
            {logoConfig.showCompanyName && logoConfig.companyNameText && (
              <span className={`tracking-tight whitespace-nowrap transition-all text-[9.5px] text-slate-400 font-bold mt-0.5 ${
                logoConfig.companyNameFont === 'noto' ? 'font-noto' :
                logoConfig.companyNameFont === 'gowun' ? 'font-gowun' :
                logoConfig.companyNameFont === 'dohyeon' ? 'font-dohyeon' :
                logoConfig.companyNameFont === 'blackhan' ? 'font-blackhan' :
                logoConfig.companyNameFont === 'songmyung' ? 'font-songmyung' :
                logoConfig.companyNameFont === 'nanumgothic' ? 'font-nanumgothic' : 'font-sans'
              }`}>
                {logoConfig.companyNameText}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons (Right) */}
        <div className="flex items-center gap-1.5 sm:gap-3 order-3 sm:absolute sm:right-4 lg:right-8 top-1/2 sm:-translate-y-1/2 shrink-0">
          {user ? (
            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
              {/* User Greeting (Desktop) */}
              <button
                onClick={onOpenMyPage}
                id="btn-header-mypage-user"
                className="hidden md:flex items-center gap-1.5 py-1 px-2.5 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 text-[10px] font-semibold text-slate-700 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping shrink-0" />
                <span className="max-w-[100px] truncate">{user.name}</span>
                <span className="text-[9px] text-slate-400">({user.type === 'B2B' ? 'B2B' : 'B2C'})</span>
              </button>

              <button
                onClick={onOpenMyPage}
                id="btn-header-mypage"
                className="flex items-center gap-1 py-1 px-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <User className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="hidden sm:inline">마이페이지</span>
                <span className="sm:hidden whitespace-nowrap">마이</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center shrink-0">
              <button
                onClick={onOpenAuth}
                id="btn-header-login"
                className="flex items-center gap-1 py-1 px-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <LogIn className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="hidden sm:inline">로그인 / 회원가입</span>
                <span className="sm:hidden whitespace-nowrap">로그인</span>
              </button>
            </div>
          )}

          {/* Emphasized Smart Consultation CTA Button */}
          <button
            onClick={onOpenQuote}
            id="btn-header-cta"
            className="relative overflow-hidden group py-1.5 sm:py-2 px-2.5 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[10px] sm:text-xs font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
          >
            {/* Subtle glow highlight */}
            <span className="absolute inset-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:animate-shine" />
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">실시간 상담/예약</span>
            <span className="sm:hidden whitespace-nowrap">상담/예약</span>
            <span className="text-[9px] bg-amber-400 text-amber-950 font-bold px-1 py-0.5 rounded animate-pulse shrink-0">💡</span>
          </button>
        </div>
      </div>
    </header>
  );
}
