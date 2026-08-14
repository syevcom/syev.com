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
  BookOpen,
  Search,
  ShoppingBag
} from 'lucide-react';
import { User as UserType, ActivePage, HeaderConfig } from '../types';
import { SearchModal } from './SearchModal';

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
    youtubeUrl?: string;
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
  selectedHomeServiceType?: string;
  onSelectHomeServiceType?: (serviceType: string) => void;
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
  cartCount?: number;
  onOpenCartModal?: () => void;
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
  logoConfig = { text: 'SY', subtitle: 'SY.com', showCompanyName: true, companyNameText: '(유)에스와이닷컴' },
  snsConfig = { kakaoUrl: 'https://pf.kakao.com/', instagramUrl: 'https://www.instagram.com/', blogUrl: 'https://section.blog.naver.com/', youtubeUrl: 'https://www.youtube.com/', showFloatingSns: true },
  footerConfig = { phone: '1588-SY01', email: 'sy.car.com@gmail.com' },
  selectedAptBrand = 'sk일렉링크',
  onSelectAptBrand,
  selectedHomePower = '7kW',
  onSelectHomePower,
  selectedHomeServiceType = '단말기 단품',
  onSelectHomeServiceType,
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
  },
  cartCount = 0,
  onOpenCartModal,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInquiryDropdownOpen, setIsInquiryDropdownOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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
      {/* Top Banner (Subtle, professional notification banner) */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs sm:text-[13px] py-1.5 px-4 text-center font-bold tracking-tight flex justify-center items-center gap-2 border-b border-emerald-500/20 shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse shrink-0" />
        <span className="truncate max-w-[90vw]">[공지] 2026년 하반기 전기차 충전기 국가 무상 보조금 한도 선착순 마감 임박! 지금 바로 견적 신청하세요.</span>
      </div>

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-x-4 relative">
        
        {/* 1. Left side: Brand Logo Container (Sleek, compact height) */}
        <div 
          onClick={() => handleMenuClick('home')}
          id="logo-container"
          className="flex flex-col items-start justify-center cursor-pointer group shrink-0 gap-0.5 text-left px-0"
        >
          {logoConfig.imageUrl ? (
            <img 
              src={logoConfig.imageUrl} 
              alt={logoConfig.subtitle} 
              style={{ height: logoConfig.height ? `${Math.min(logoConfig.height, 36)}px` : '34px' }}
              className="max-w-[180px] object-contain transition-transform group-hover:scale-103 shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <span className="font-black text-white text-sm tracking-tighter">{logoConfig.text}</span>
            </div>
          )}
          
          <div className="flex flex-col leading-none items-start pl-0.5">
            {!logoConfig.imageUrl && (
              <span className="font-black text-xs sm:text-sm tracking-tight text-stone-900 whitespace-nowrap">
                {logoConfig.subtitle || 'SY.com'}
              </span>
            )}
            {logoConfig.showCompanyName && logoConfig.companyNameText && (
              <span className="tracking-tight whitespace-nowrap text-[8.5px] sm:text-[9.5px] text-stone-500 font-bold mt-0.5">
                {logoConfig.companyNameText}
              </span>
            )}
          </div>
        </div>

        {/* 2. Navigation Links (Clean, horizontal distribution like reference site) */}
        <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1 max-w-2xl xl:max-w-3xl mx-2 lg:mx-4 shrink-0">
          {menuItems.map((item) => {
            const isActive = activePage === item.id || 
              (item.id === 'sol_residential' && activePage === 'solutions');
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`px-2.5 lg:px-3 py-1.5 text-xs lg:text-sm font-extrabold tracking-tight transition-all duration-150 cursor-pointer whitespace-nowrap relative rounded-lg ${
                  isActive
                    ? 'text-emerald-700 font-black bg-emerald-50/80 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2.5px] after:bg-emerald-600'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* 3. Right side: Compact Installation Shortcuts + Utility Icons */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0 pl-3 border-l border-stone-200/80 ml-auto">

          {/* Compact Horizontal Installation Shortcuts */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/80 shadow-xs">
            {/* 1. 아파트 */}
            <button
              onClick={() => onOpenQuoteWithPurpose ? onOpenQuoteWithPurpose('Commercial') : onOpenQuote()}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shadow-2xs whitespace-nowrap hover:bg-yellow-400 hover:text-slate-950 ${
                activePage === 'sol_commercial' 
                  ? 'bg-emerald-600 text-white font-black' 
                  : 'bg-white text-slate-800 hover:bg-emerald-50'
              }`}
              title="아파트 · 공동주택 충전기 설치문의"
            >
              {headerConfig.shortcutCommercialPc?.split('·')[0] || '⚡ 아파트'}
            </button>

            {/* 2. 가정용 */}
            <button
              onClick={() => onOpenQuoteWithPurpose ? onOpenQuoteWithPurpose('Residential') : onOpenQuote()}
              className="px-2.5 py-1 bg-white hover:bg-yellow-400 text-slate-800 hover:text-slate-950 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              title="가정용 · 개인 홈 충전기 설치문의"
            >
              {headerConfig.shortcutResidentialPc?.split('·')[0] || '🏠 가정용'}
            </button>

            {/* 3. 상업시설 */}
            <button
              onClick={() => onOpenQuoteWithPurpose ? onOpenQuoteWithPurpose('ParkingLot') : onOpenQuote()}
              className="px-2.5 py-1 bg-white hover:bg-yellow-400 text-slate-800 hover:text-slate-950 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              title="상업시설 · 수익형 충전기 설치문의"
            >
              {headerConfig.shortcutParkingPc?.split('·')[0] || '🏢 상업시설'}
            </button>

            {/* 메인 설치문의 버튼 */}
            <button
              onClick={() => isEditMode ? onOpenCms?.('brand') : onOpenQuote()}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-black transition-all cursor-pointer shadow-xs whitespace-nowrap ml-0.5"
            >
              ⚡ 무료견적
            </button>
          </div>

          {/* User Profile / Cart / Admin Quick links */}
          <div className="flex items-center gap-1.5 pl-1.5 shrink-0">
            {/* Search Icon Button */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              title="충전기 모델 / 용량 검색"
              className="p-1.5 rounded-lg bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 transition-all cursor-pointer border border-stone-200"
            >
              <Search className="w-3.5 h-3.5 text-stone-700" />
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={onOpenCartModal}
              title="관심 충전기 장바구니"
              className="relative p-1.5 rounded-lg bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 transition-all cursor-pointer border border-stone-200"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-stone-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white font-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-2xs">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <button
                onClick={onOpenMyPage}
                title="마이페이지"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold cursor-pointer shadow-2xs transition-all"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>마이페이지</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                title="로그인 / 회원가입"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer shadow-2xs transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>로그인</span>
              </button>
            )}

            {/* Admin control buttons */}
            {isEditMode ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={onToggleEditMode}
                  className="w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-md animate-pulse"
                  title="관리자 수정모드 (클릭시 비활성화)"
                >
                  <Settings className="w-3 h-3 animate-spin" />
                </button>
                <button
                  onClick={() => onPageChange('admin')}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 rounded-lg font-bold text-[10.5px] px-2 py-1 cursor-pointer transition-all shrink-0 shadow-xs flex items-center gap-0.5"
                  title="관리자 센터"
                >
                  <span>🔧 관리자</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onToggleEditMode}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-lg font-bold text-[10.5px] px-2 py-1 cursor-pointer transition-all shrink-0 flex items-center gap-1"
                title="관리자 로그인"
              >
                <Settings className="w-3 h-3 text-stone-500" />
                <span className="hidden xl:inline">관리자</span>
              </button>
            )}
          </div>

        </div>

        {/* 4. Mobile Hamburger Button & Search Button */}
        <div className="flex md:hidden items-center gap-1.5">
          {/* Mobile Cart button */}
          <button
            onClick={onOpenCartModal}
            className="relative w-8 h-8 rounded-full bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center shadow-xs cursor-pointer"
            title="장바구니"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Search button */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shadow-xs cursor-pointer"
            title="충전기 검색"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Admin Toggle on Mobile (Visible ONLY when isEditMode is true) */}
          {isEditMode && (
            <button
              onClick={onToggleEditMode}
              className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md cursor-pointer animate-pulse"
              title="관리자 모드 활성화됨"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

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
        <div 
          id="mobile-drawer-menu"
          className="md:hidden fixed inset-x-0 top-0 bottom-0 z-[999] bg-slate-950/70 backdrop-blur-md flex flex-col justify-end transition-opacity duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsMobileMenuOpen(false);
            }
          }}
        >
          <div className="bg-white w-full max-h-[85vh] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Drawer Top Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-xs">
                  ⚡
                </div>
                <span className="font-black text-slate-900 text-sm">{logoConfig.subtitle || 'SY.com'} 메뉴</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                title="메뉴 닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="p-5 space-y-6 overflow-y-auto overscroll-contain flex-1">
              {/* Mobile User Profile & Cart Header Bar */}
              <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-md">
                {user ? (
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-white truncate">{user.name} 님</div>
                      <div className="text-[10px] text-slate-300 truncate">{user.email}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-slate-300">
                    로그인하고 내역과 장바구니를 확인하세요.
                  </div>
                )}

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (user) onOpenMyPage();
                      else onOpenAuth();
                    }}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-sm cursor-pointer"
                  >
                    {user ? '마이페이지' : '로그인'}
                  </button>
                </div>
              </div>

              {/* Direct Installation Inquiry 3 Stacked Buttons */}
              <div className="space-y-2">
                <span 
                  onClick={() => isEditMode ? onOpenCms?.('brand') : onOpenQuote()}
                  className={`text-[14px] font-black text-emerald-900 tracking-wider block uppercase bg-emerald-50 border border-emerald-200/70 rounded-xl px-3 py-2.5 text-center select-none shadow-xs cursor-pointer transition-all duration-200 ${
                    isEditMode ? 'border-dashed border-2 animate-pulse border-emerald-500 bg-yellow-50 text-emerald-900' : ''
                  }`}
                  title={isEditMode ? '설치문의 실시간 편집 (관리자)' : '클릭하시면 무료 설치 상담 팝업창이 열립니다.'}
                >
                  {isEditMode ? `✏️ ${headerConfig.inquiryTitleMobile || '설치문의 실시간 편집'}` : (headerConfig.inquiryTitleMobile || '⚡ 전기차충전기 설치문의')}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => handleInquirySelect('Commercial')}
                    className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-between shadow-xs transition-colors cursor-pointer"
                  >
                    <span>{headerConfig.shortcutCommercialMobile || '⚡ 아파트 · 공동주택'}</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md">상담신청 →</span>
                  </button>
                  <button
                    onClick={() => handleInquirySelect('Residential')}
                    className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-between shadow-xs transition-colors cursor-pointer"
                  >
                    <span>{headerConfig.shortcutResidentialMobile || '🏠 가정용 · 개인 홈'}</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md">상담신청 →</span>
                  </button>
                  <button
                    onClick={() => handleInquirySelect('ParkingLot')}
                    className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-between shadow-xs transition-colors cursor-pointer"
                  >
                    <span>{headerConfig.shortcutParkingMobile || '🏢 상업시설 · 수익형'}</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md">상담신청 →</span>
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
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-between cursor-pointer ${
                        isActive 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'text-stone-800 hover:bg-stone-100 bg-stone-50/80 border border-stone-200/50'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`text-xs ${isActive ? 'text-white' : 'text-stone-400'}`}>›</span>
                    </button>
                  );
                })}
              </div>

              {/* User & Auth Links */}
              <div className="pt-4 border-t border-stone-200/60 space-y-3">
                {/* Social utilities */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <a 
                    href={snsConfig.blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-700 hover:text-emerald-600 text-xs font-bold border border-stone-200 py-2.5 rounded-xl bg-white shadow-xs text-center flex items-center justify-center"
                  >
                    네이버 블로그
                  </a>
                  <a 
                    href={snsConfig.youtubeUrl || 'https://www.youtube.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-700 hover:text-red-500 text-xs font-bold border border-stone-200 py-2.5 rounded-xl bg-white flex items-center justify-center gap-1 shadow-xs text-center"
                  >
                    <Youtube className="w-3.5 h-3.5 text-red-500" />
                    유튜브
                  </a>
                  <a 
                    href={`tel:${footerConfig.phone.split(' ')[0]}`}
                    className="text-emerald-700 hover:text-emerald-800 text-xs font-bold border border-emerald-200 py-2.5 rounded-xl bg-emerald-50/80 flex items-center justify-center gap-1 shadow-xs text-center"
                  >
                    <Phone className="w-3 h-3 text-emerald-600" />
                    전화문의
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-navigation bar for Brands (Only visible when 'sol_commercial' / Apartment Charger page is active) */}
      {activePage === 'sol_commercial' && (
        <div className="w-full bg-white/95 backdrop-blur-md border-t border-b border-slate-200/80 py-2 shadow-2xs">
          <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none whitespace-nowrap py-0.5 flex-1">
              <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">아파트 브랜드:</span>
              {[
                'sk일렉링크',
                '플러그링크',
                '이엘일렉트릭',
                '나이스차져',
                '에버온',
                'NICE인프라',
                '아이파킹',
                'LG유플러스볼트업'
              ].map((brand) => {
                const isSelected = selectedAptBrand === brand;
                return (
                  <button
                    key={brand}
                    onClick={() => {
                      onSelectAptBrand?.(brand);
                      setTimeout(() => {
                        const el = document.getElementById('apt-brand-section');
                        if (el) {
                          const yOffset = -120;
                          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
                        } else {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }, 50);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/20 scale-[1.02]'
                        : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60'
                    }`}
                  >
                    {brand}
                  </button>
                );
              })}
            </div>

            {/* Quick Charger Search Button */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              title="충전기 모델 / 용량 검색"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs shadow-yellow-400/20 shrink-0 hover:scale-103 active:scale-97 border border-yellow-300"
              id="btn-header-search"
            >
              <Search className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span className="whitespace-nowrap">🔍 충전기 검색</span>
            </button>
          </div>
        </div>
      )}

      {/* Sub-navigation bar for Home Charger (Price Type & Power Capacities) */}
      {activePage === 'sol_residential' && (
        <div className="w-full bg-white/95 backdrop-blur-md border-t border-b border-slate-200/80 py-2 shadow-2xs">
          <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 overflow-x-auto scrollbar-none whitespace-nowrap flex-1">
              {/* Price Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap">
                <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">구분:</span>
                {[
                  { id: '단말기 단품', label: '📦 단말기 단품' },
                  { id: '교체 시공', label: '🛠️ 교체 시공' },
                  { id: '신규 설치 포함', label: '⚡ 설치 포함 (신규)' }
                ].map((st) => {
                  const isSelected = selectedHomeServiceType === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => {
                        if (activePage !== 'sol_residential') {
                          onPageChange('sol_residential');
                        }
                        onSelectHomeServiceType?.(st.id);
                        setTimeout(() => {
                          const el = document.getElementById('home-options-section');
                          if (el) {
                            const yOffset = -110;
                            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
                          }
                        }, 60);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/20 scale-[1.02]'
                          : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60'
                      }`}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>

              {/* Power Capacity Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap border-l border-slate-200 pl-3">
                <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">용량:</span>
                {['5kW', '7kW', '11kW'].map((kw) => {
                  const isSelected = selectedHomePower === kw;
                  return (
                    <button
                      key={kw}
                      onClick={() => {
                        if (activePage !== 'sol_residential') {
                          onPageChange('sol_residential');
                        }
                        onSelectHomePower?.(kw);
                        setTimeout(() => {
                          const el = document.getElementById('home-options-section');
                          if (el) {
                            const yOffset = -110;
                            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
                          }
                        }, 60);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-xs shadow-amber-500/20 scale-[1.02]'
                          : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50/60'
                      }`}
                    >
                      ⚡ {kw}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Charger Search Button (Moved down 1 line as requested) */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              title="충전기 모델 / 용량 검색"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded-xl font-black text-xs transition-all cursor-pointer shadow-md shadow-yellow-400/20 shrink-0 hover:scale-103 active:scale-97 border border-yellow-300"
              id="btn-header-search"
            >
              <Search className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span className="whitespace-nowrap">🔍 충전기 검색</span>
            </button>
          </div>
        </div>
      )}

      {/* Sub-navigation bar for ParkingLot (Only visible when 'sol_parking' is active) */}
      {activePage === 'sol_parking' && (
        <div className="w-full bg-white/95 backdrop-blur-md border-t border-b border-slate-200/80 py-2 shadow-2xs">
          <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none whitespace-nowrap flex-1">
              <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">구분:</span>
              {[
                '공용 BIZ 충전기'
              ].map((cap) => {
                const isSelected = selectedParkingCapacity === cap;
                return (
                  <button
                    key={cap}
                    onClick={() => onSelectParkingCapacity?.(cap)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/20 scale-[1.02]'
                        : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60'
                    }`}
                  >
                    🏢 {cap}
                  </button>
                );
              })}
            </div>

            {/* Quick Charger Search Button */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              title="충전기 모델 / 용량 검색"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs shadow-amber-500/20 shrink-0 hover:scale-103 active:scale-97 border border-amber-400"
              id="btn-header-search"
            >
              <Search className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span className="whitespace-nowrap">🔍 충전기 검색</span>
            </button>
          </div>
        </div>
      )}

      {/* Sub-bar for Home, About, Review */}
      {(activePage === 'home' || activePage === 'about' || activePage === 'review') && (
        <div className="w-full bg-white/95 backdrop-blur-md border-t border-b border-slate-200/80 py-2 shadow-2xs">
          <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
              <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200/80 font-bold">원스톱 서비스</span>
              <span className="hidden sm:inline text-slate-600">전국 최대 네트워크! 원하는 전기차 충전기 모델과 용량을 원클릭으로 검색해보세요.</span>
            </div>

            {/* Quick Charger Search Button */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              title="충전기 모델 / 용량 검색"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs shadow-yellow-400/20 shrink-0 hover:scale-103 active:scale-97 border border-yellow-300"
              id="btn-header-search"
            >
              <Search className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span className="whitespace-nowrap">🔍 충전기 검색</span>
            </button>
          </div>
        </div>
      )}
      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onPageChange={onPageChange}
        onSelectHomePower={onSelectHomePower}
        onSelectParkingCapacity={onSelectParkingCapacity}
        onOpenQuoteWithPurpose={onOpenQuoteWithPurpose}
      />
    </header>
  );
}
