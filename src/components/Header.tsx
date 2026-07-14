/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LogIn, 
  LogOut, 
  User, 
  CalendarDays, 
  Sparkles, 
  Settings, 
  Menu, 
  X, 
  Youtube, 
  Phone, 
  ChevronDown, 
  BookOpen 
} from 'lucide-react';
import { User as UserType, ActivePage, HeaderConfig } from '../types';

interface HeaderProps {
  user: UserType | null;
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  onOpenAuth: () => void;
  onOpenMyPage: () => void;
  onOpenQuote: () => void;
  onOpenQuoteWithPurpose?: (purpose: 'Commercial' | 'Residential' | 'ParkingLot') => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onOpenCms?: (tab?: 'brand' | 'hero' | 'about' | 'products' | 'solutions' | 'review' | 'support' | 'quote') => void;
  logoConfig?: {
    text: string;
    subtitle: string;
    imageUrl?: string;
    height?: number;
    showCompanyName?: boolean;
    companyNameText?: string;
    companyNameFont?: string;
    companyNameWeight?: string;
    companyNameSize?: string;
    companyNameColor?: string;
  };
  snsConfig?: {
    kakaoUrl: string;
    instagramUrl: string;
    blogUrl: string;
    showFloatingSns: boolean;
  };
  footerConfig?: {
    phone: string;
    email: string;
  };
  selectedAptBrand?: string;
  onSelectAptBrand?: (brand: string) => void;
  selectedHomePower?: string;
  onSelectHomePower?: (power: string) => void;
  selectedParkingCapacity?: string;
  onSelectParkingCapacity?: (capacity: string) => void;
  categoryLabels?: {
    home: string;
    about: string;
    products: string;
    solutions: string;
    review: string;
    support: string;
    sol_residential?: string;
    sol_commercial?: string;
    sol_parking?: string;
  };
  headerConfig?: HeaderConfig;
}

export default function Header({
  user,
  activePage,
  onPageChange,
  onOpenAuth,
  onOpenMyPage,
  onOpenQuote,
  onOpenQuoteWithPurpose,
  isEditMode,
  onToggleEditMode,
  onOpenCms,
  logoConfig = { text: 'SY', subtitle: 'SY.com', showCompanyName: true, companyNameText: '주식회사 에스와이코리아' },
  snsConfig = { kakaoUrl: 'https://pf.kakao.com/', instagramUrl: 'https://www.instagram.com/', blogUrl: 'https://section.blog.naver.com/', showFloatingSns: true },
  footerConfig = { phone: '1588-SY01', email: 'sy.car.com@gmail.com' },
  selectedAptBrand = 'sk일렉링크',
  onSelectAptBrand,
  selectedHomePower = '7kW',
  onSelectHomePower,
  selectedParkingCapacity = '50kW 급속',
  onSelectParkingCapacity,
  categoryLabels,
  headerConfig = {
    inquiryTitlePc: '⚡ 전기차충전기 설치문의',
    shortcutCommercialPc: '⚡ 아파트 · 공동주택',
    shortcutResidentialPc: '🏠 가정용 · 개인 홈',
    shortcutParkingPc: '🏢 상업시설 · 수익형',
    inquiryTitleMobile: '⚡ 전기차충전기 설치문의',
    shortcutCommercialMobile: '⚡ 아파트 · 공동주택',
    shortcutResidentialMobile: '🏠 가정용 · 개인 홈',
    shortcutParkingMobile: '🏢 상업시설 · 수익형',
    syncMobileWithPc: true
  }
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInquiryDropdownOpen, setIsInquiryDropdownOpen] = useState(false);

  const getMenuLabel = (id: ActivePage) => {
    switch (id) {
      case 'home': return categoryLabels?.home || '홈';
      case 'about': return categoryLabels?.about || '회사소개';
      case 'sol_commercial': {
        const val = categoryLabels?.sol_commercial || '아파트';
        return val.includes('충전기') ? val : `${val}충전기`;
      }
      case 'sol_residential': {
        const val = categoryLabels?.sol_residential || '가정용 홈';
        return val.includes('충전기') ? val : `${val} 충전기`;
      }
      case 'sol_parking': {
        const val = categoryLabels?.sol_parking || '상업시설 수익형';
        return val.includes('충전기') ? val : `${val} 충전기`;
      }
      case 'review': return categoryLabels?.review || '설치후기';
      default: return '';
    }
  };

  const menuItems: { id: ActivePage; label: string }[] = [
    { id: 'home', label: getMenuLabel('home') },
    { id: 'about', label: getMenuLabel('about') },
    { id: 'sol_commercial', label: getMenuLabel('sol_commercial') },
    { id: 'sol_residential', label: getMenuLabel('sol_residential') },
    { id: 'sol_parking', label: getMenuLabel('sol_parking') },
    { id: 'review', label: getMenuLabel('review') }
  ];

  const handleMenuClick = (pageId: ActivePage) => {
    onPageChange(pageId);
    setIsMobileMenuOpen(false);
  };

  const handleInquirySelect = (purpose: 'Commercial' | 'Residential' | 'ParkingLot') => {
    if (onOpenQuoteWithPurpose) {
      onOpenQuoteWithPurpose(purpose);
    } else {
      onOpenQuote();
    }
    setIsInquiryDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/75 backdrop-blur-lg border-b border-slate-200/80 shadow-md shadow-slate-900/5">
      {/* Top Banner (Subtle, professional notification with premium bright emerald theme) */}
      <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white text-[11px] py-2 px-4 text-center font-bold tracking-wide flex justify-center items-center gap-1.5 border-b border-emerald-400/20">
        <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse shrink-0" />
        <span>[공지] 2026년 하반기 전기차 충전기 국가 무상 보조금 한도 선착순 마감 임박! 지금 바로 견적 신청하세요.</span>
      </div>

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between relative">
        
        {/* 1. Left side: Brand Logo Container (Stacked Vertically, Shifted Left, Left-Aligned) */}
        <div 
          onClick={() => handleMenuClick('home')}
          id="logo-container"
          className="flex flex-col items-start justify-center cursor-pointer group shrink-0 gap-1 text-left px-0 -ml-1 sm:-ml-2"
        >
          {logoConfig.imageUrl ? (
            <img 
              src={logoConfig.imageUrl} 
              alt={logoConfig.subtitle} 
              style={{ height: logoConfig.height ? `${logoConfig.height}px` : '44px' }}
              className="max-w-[240px] object-contain transition-transform group-hover:scale-103 shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform shrink-0">
              <span className="font-black text-white text-base tracking-tighter">{logoConfig.text}</span>
            </div>
          )}
          
          <div className="flex flex-col leading-none items-start mt-0.5 pl-0.5">
            {!logoConfig.imageUrl && (
              <span className="font-black text-[14px] sm:text-[16px] tracking-tight text-stone-900 whitespace-nowrap">
                {logoConfig.subtitle || 'SY.com'}
              </span>
            )}
            {logoConfig.showCompanyName && logoConfig.companyNameText && (
              <span className="tracking-tight whitespace-nowrap text-[9px] sm:text-[10px] text-stone-600 font-bold mt-1">
                {logoConfig.companyNameText}
              </span>
            )}
          </div>
        </div>

        {/* 2. Center: Elegant Navigation Links (No background box, elegant under-line) */}
        <nav className="hidden xl:flex items-center gap-x-6 lg:gap-x-8 xl:gap-x-12 2xl:gap-x-16 shrink-0">
          {menuItems.map((item) => {
            const isActive = activePage === item.id || 
              (item.id === 'sol_residential' && activePage === 'solutions');
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`px-5 lg:px-7 py-3 text-[16px] lg:text-[18px] font-black tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap relative ${
                  isActive
                    ? 'text-emerald-600 font-black after:absolute after:bottom-[-8px] after:left-5 after:right-5 after:h-[3px] after:bg-emerald-600'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-lg'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* 3. Right side: Premium Inquiry CTA + Utility */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4 shrink">

          {/* 3 Premium Stacked Installation Inquiry Buttons with Unified Green Theme */}
          <div className="flex flex-col gap-1 w-[240px] lg:w-[270px] shrink">
            {/* 상단 통합 레이블 */}
            <div 
              onClick={() => isEditMode ? onOpenCms?.('brand') : onOpenQuote()}
              className={`text-[15px] lg:text-[17px] font-black text-emerald-800 hover:text-white text-center tracking-wider bg-emerald-50 hover:bg-yellow-500 border border-emerald-100/60 hover:border-yellow-500 rounded-md py-1.5 mb-1 select-none shadow-xs cursor-pointer transition-all duration-200 ${
                isEditMode ? 'border-dashed border-2 animate-pulse border-emerald-500 bg-yellow-50 text-emerald-900' : ''
              }`}
              title={isEditMode ? '설치문의 실시간 편집 (관리자)' : '클릭하시면 무료 설치 상담 팝업창이 열립니다.'}
            >
              {isEditMode ? `✏️ ${headerConfig.inquiryTitlePc || '설치문의 실시간 편집'}` : (headerConfig.inquiryTitlePc || '⚡ 전기차충전기 설치문의')}
            </div>

            {/* 1. 아파트 전기차 충전기 설치문의 (녹색으로 통일) */}
            <button
              onClick={() => onOpenQuoteWithPurpose ? onOpenQuoteWithPurpose('Commercial') : onOpenQuote()}
              className={`flex items-center justify-center px-3 py-1.5 rounded-md text-[11.5px] lg:text-[12.5px] font-black transition-all cursor-pointer shadow-sm group shrink hover:bg-yellow-500 hover:text-white ${
                activePage === 'sol_commercial' 
                  ? 'bg-emerald-500 text-white animate-pulse' 
                  : 'bg-emerald-600 text-white'
              }`}
              id="btn-header-shortcut-apt"
            >
              <span className="truncate">
                {headerConfig.shortcutCommercialPc || '⚡ 아파트 · 공동주택'}
              </span>
            </button>

            {/* 2. 가정용 홈 전기차 충전기 */}
            <button
              onClick={() => onOpenQuoteWithPurpose ? onOpenQuoteWithPurpose('Residential') : onOpenQuote()}
              className="flex items-center justify-center px-3 py-1.5 bg-emerald-600 hover:bg-yellow-500 text-white hover:text-white border border-emerald-500/10 rounded-md text-[11.5px] lg:text-[12.5px] font-black transition-all cursor-pointer shadow-sm group shrink"
              id="btn-header-shortcut-home"
            >
              <span className="truncate">{headerConfig.shortcutResidentialPc || '🏠 가정용 · 개인 홈'}</span>
            </button>

            {/* 3. 상업시설 · 수익형 전기차 충전기 설치문의 */}
            <button
              onClick={() => onOpenQuoteWithPurpose ? onOpenQuoteWithPurpose('ParkingLot') : onOpenQuote()}
              className="flex items-center justify-center px-3 py-1.5 bg-emerald-600 hover:bg-yellow-500 text-white hover:text-white border border-emerald-500/10 rounded-md text-[11.5px] lg:text-[12.5px] font-black transition-all cursor-pointer shadow-sm group shrink"
              id="btn-header-shortcut-commercial"
            >
              <span className="truncate">{headerConfig.shortcutParkingPc || '🏢 상업시설 · 수익형'}</span>
            </button>
          </div>

          {/* User Profile / Admin Quick links */}
          <div className="flex items-center gap-2 pl-2 border-l border-stone-200 shrink-0">
            {user ? (
              <button
                onClick={onOpenMyPage}
                title="마이페이지"
                className="w-7 h-7 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center text-xs cursor-pointer shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                title="로그인 / 회원가입"
                className="w-7 h-7 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center text-xs cursor-pointer shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Admin toggle directly visible */}
            <button
              onClick={onToggleEditMode}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                isEditMode 
                  ? 'bg-emerald-500 text-white shadow-md animate-pulse' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              title={isEditMode ? "수정모드 켜짐" : "관리자 에디터 열기"}
            >
              <Settings className={`w-3.5 h-3.5 ${isEditMode ? 'animate-spin' : ''}`} />
            </button>
            {isEditMode && onOpenCms && (
              <button
                onClick={onOpenCms}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-black text-[9px] px-2 py-1 cursor-pointer transition-all shrink-0 animate-bounce"
              >
                CMS
              </button>
            )}
          </div>

        </div>

        {/* 4. Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Admin Toggle on Mobile for quick access */}
          <button
            onClick={onToggleEditMode}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isEditMode ? 'bg-emerald-500 text-white shadow-md' : 'bg-stone-100 text-stone-600 border border-stone-200 shadow-sm'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-9 h-9 bg-stone-100 text-stone-800 border border-stone-200 rounded-lg flex items-center justify-center hover:bg-stone-200 transition-colors cursor-pointer shadow-sm"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* 5. Mobile Drawer Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[115px] bottom-0 z-40 bg-white/85 backdrop-blur-lg flex flex-col p-5 space-y-6 overflow-y-auto border-t border-slate-200/80">
          
          {/* Direct Installation Inquiry 3 Stacked Buttons */}
          <div className="space-y-2">
            <span 
              onClick={() => isEditMode ? onOpenCms?.('brand') : onOpenQuote()}
              className={`text-[14.5px] sm:text-[15.5px] font-black text-emerald-800 hover:text-white tracking-wider block uppercase bg-emerald-50 hover:bg-yellow-500 border border-emerald-100/60 hover:border-yellow-500 rounded-xl px-2.5 py-2.5 text-center select-none shadow-xs cursor-pointer transition-all duration-200 ${
                isEditMode ? 'border-dashed border-2 animate-pulse border-emerald-500 bg-yellow-50 text-emerald-900' : ''
              }`}
              title={isEditMode ? '설치문의 실시간 편집 (관리자)' : '클릭하시면 무료 설치 상담 팝업창이 열립니다.'}
            >
              {isEditMode ? `✏️ ${headerConfig.inquiryTitleMobile || '설치문의 실시간 편집'}` : (headerConfig.inquiryTitleMobile || '⚡ 전기차충전기 설치문의')}
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleInquirySelect('Commercial')}
                className="w-full px-4 py-3 bg-emerald-600 hover:bg-yellow-500 text-white hover:text-white border border-emerald-500 hover:border-yellow-500 rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-sm transition-colors"
              >
                <span>{headerConfig.shortcutCommercialMobile || '⚡ 아파트 · 공동주택'}</span>
              </button>
              <button
                onClick={() => handleInquirySelect('Residential')}
                className="w-full px-4 py-3 bg-emerald-600 hover:bg-yellow-500 text-white hover:text-white border border-emerald-500 hover:border-yellow-500 rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-sm transition-colors"
              >
                <span>{headerConfig.shortcutResidentialMobile || '🏠 가정용 · 개인 홈'}</span>
              </button>
              <button
                onClick={() => handleInquirySelect('ParkingLot')}
                className="w-full px-4 py-3 bg-emerald-600 hover:bg-yellow-500 text-white hover:text-white border border-emerald-500 hover:border-yellow-500 rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-sm transition-colors"
              >
                <span>{headerConfig.shortcutParkingMobile || '🏢 상업시설 · 수익형'}</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-stone-500 tracking-wider block uppercase">전체 카테고리</span>
            {menuItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-black transition-all ${
                    isActive 
                      ? 'bg-emerald-600/10 text-emerald-700 border-l-4 border-emerald-600 pl-3' 
                      : 'text-stone-700 hover:bg-stone-200/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* User & Auth Links */}
          <div className="pt-4 border-t border-stone-200/50 space-y-3">
            <div className="flex gap-3">
              {user ? (
                <>
                  <button
                    onClick={() => handleMenuClick('home')} // triggers mypage in app
                    className="flex-1 py-2.5 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 rounded-xl text-xs font-bold border border-stone-200 text-center shadow-sm"
                  >
                    마이페이지 ({user.name})
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center shadow-sm"
                >
                  로그인 / 회원가입
                </button>
              )}
            </div>

            {/* Social utilities */}
            <div className="flex justify-center gap-4 pt-2">
              <a 
                href={snsConfig.blogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-600 hover:text-emerald-600 text-xs font-black border border-stone-200 px-3 py-1.5 rounded-lg bg-white shadow-sm"
              >
                네이버 블로그
              </a>
              <a 
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-600 hover:text-red-500 text-xs font-black border border-stone-200 px-3 py-1.5 rounded-lg bg-white flex items-center gap-1 shadow-sm"
              >
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                유튜브 채널
              </a>
              <a 
                href={`tel:${footerConfig.phone.split(' ')[0]}`}
                className="text-stone-600 hover:text-emerald-600 text-xs font-black border border-stone-200 px-3 py-1.5 rounded-lg bg-white flex items-center gap-1 shadow-sm"
              >
                <Phone className="w-3 h-3 text-emerald-600" />
                전화문의
              </a>
            </div>
          </div>

        </div>
      )}

      {/* Sub-navigation bar for Brands (Only visible when 'sol_commercial' / Apartment Charger page is active) */}
      {activePage === 'sol_commercial' && (
        <div className="w-full bg-slate-900 border-t border-slate-800/80 py-3 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none whitespace-nowrap">
            {[
              'sk일렉링크',
              '플러그링크',
              '이엘일렉트릭',
              '나이스차져',
              '에버온',
              '현대엔지니어링',
              '아이파킹',
              'LG유플러스볼트업'
            ].map((brand) => {
              const isSelected = selectedAptBrand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => onSelectAptBrand?.(brand)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 font-black scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-navigation bar for Home Power Capacities (Only visible when 'sol_residential' is active) */}
      {activePage === 'sol_residential' && (
        <div className="w-full bg-emerald-950 border-t border-emerald-900/40 py-3 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none whitespace-nowrap">
            {[
              '5kW',
              '7kW',
              '11kW'
            ].map((kw) => {
              const isSelected = selectedHomePower === kw;
              return (
                <button
                  key={kw}
                  onClick={() => onSelectHomePower?.(kw)}
                  className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/35 font-black scale-105'
                      : 'text-emerald-100 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {kw} (가정용 홈충전기)
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-navigation bar for ParkingLot (Only visible when 'sol_parking' is active) */}
      {activePage === 'sol_parking' && (
        <div className="w-full bg-slate-900 border-t border-slate-800 py-3 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none whitespace-nowrap">
            {[
              '공용 BIZ 충전기'
            ].map((cap) => {
              const isSelected = selectedParkingCapacity === cap;
              return (
                <button
                  key={cap}
                  onClick={() => onSelectParkingCapacity?.(cap)}
                  className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/35 font-black scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cap}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
