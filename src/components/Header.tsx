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
  logoConfig = { text: 'SY', subtitle: 'SY.com', showCompanyName: true, companyNameText: '주식회사 에스와이코리아' },
  snsConfig = { kakaoUrl: 'https://pf.kakao.com/', instagramUrl: 'https://www.instagram.com/', blogUrl: 'https://section.blog.naver.com/', showFloatingSns: true },
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
      {/* Top Banner (Subtle, professional notification with premium bright emerald theme) */}
      <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white text-[13px] sm:text-[14px] md:text-[15px] py-2.5 px-4 text-center font-black tracking-normal flex justify-center items-center gap-2 border-b border-emerald-400/20">
        <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse shrink-0" />
        <span>[공지] 2026년 하반기 전기차 충전기 국가 무상 보조금 한도 선착순 마감 임박! 지금 바로 견적 신청하세요.</span>
      </div>

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-x-4 relative">
        
        {/* 1. Left side: Brand Logo Container (Far Left, anchored, never overflows left) */}
        <div 
          onClick={() => handleMenuClick('home')}
          id="logo-container"
          className="flex flex-col items-start justify-center cursor-pointer group shrink-0 gap-1 text-left px-0"
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

        {/* 2. Navigation Links (Evenly distributed across middle space) */}
        <nav className="hidden lg:flex items-center justify-between flex-1 max-w-3xl mx-auto px-4 lg:px-8 xl:px-10 shrink-0">
          {menuItems.map((item) => {
            const isActive = activePage === item.id || 
              (item.id === 'sol_residential' && activePage === 'solutions');
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`px-3 lg:px-3.5 xl:px-4 py-2 text-[14px] lg:text-[15px] xl:text-[16px] 2xl:text-[17px] font-black tracking-tight transition-all duration-200 cursor-pointer whitespace-nowrap relative ${
                  isActive
                    ? 'text-emerald-600 font-black after:absolute after:bottom-[-4px] after:left-2 after:right-2 after:h-[3px] after:bg-emerald-600'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 rounded-lg'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* 3. Right side: Premium Inquiry CTA + Utility */}
        <div className="hidden md:flex items-center gap-2.5 lg:gap-3.5 shrink-0 pl-2 ml-auto">

          {/* 3 Premium Stacked Installation Inquiry Buttons with Unified Green Theme */}
          <div className="flex flex-col gap-1 w-[210px] lg:w-[240px] xl:w-[250px] 2xl:w-[270px] shrink-0">
            {/* 상단 통합 레이블 */}
            <div 
              onClick={() => isEditMode ? onOpenCms?.('brand') : onOpenQuote()}
              className={`text-[13px] lg:text-[14px] xl:text-[15px] 2xl:text-[17px] font-black text-emerald-800 hover:text-white text-center tracking-wider bg-emerald-50 hover:bg-yellow-500 border border-emerald-100/60 hover:border-yellow-500 rounded-md py-1.5 mb-1 select-none shadow-xs cursor-pointer transition-all duration-200 ${
                isEditMode ? 'border-dashed border-2 animate-pulse border-emerald-500 bg-yellow-50 text-emerald-900' : ''
              }`}
              title={isEditMode ? '설치문의 실시간 편집 (관리자)' : '클릭하시면 무료 설치 상담 팝업창이 열립니다.'}
            >
              {isEditMode ? `✏️ ${headerConfig.inquiryTitlePc || '설치문의 실시간 편집'}` : (headerConfig.inquiryTitlePc || '⚡ 전기차충전기 설치문의')}
            </div>

            {/* 1. 아파트 전기차 충전기 설치문의 (녹색으로 통일) */}
            <button
              onClick={() => onOpenQuoteWithPurpose ? onOpenQuoteWithPurpose('Commercial') : onOpenQuote()}
              className={`flex items-center justify-center px-3 py-1.5 rounded-md text-[11px] lg:text-[11.5px] 2xl:text-[12.5px] font-black transition-all cursor-pointer shadow-sm group shrink hover:bg-yellow-500 hover:text-white ${
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
              className="flex items-center justify-center px-3 py-1.5 bg-emerald-600 hover:bg-yellow-500 text-white hover:text-white border border-emerald-500/10 rounded-md text-[11px] lg:text-[11.5px] 2xl:text-[12.5px] font-black transition-all cursor-pointer shadow-sm group shrink"
              id="btn-header-shortcut-home"
            >
              <span className="truncate">{headerConfig.shortcutResidentialPc || '🏠 가정용 · 개인 홈'}</span>
            </button>

            {/* 3. 상업시설 · 수익형 전기차 충전기 설치문의 */}
            <button
              onClick={() => onOpenQuoteWithPurpose ? onOpenQuoteWithPurpose('ParkingLot') : onOpenQuote()}
              className="flex items-center justify-center px-3 py-1.5 bg-emerald-600 hover:bg-yellow-500 text-white hover:text-white border border-emerald-500/10 rounded-md text-[11px] lg:text-[11.5px] 2xl:text-[12.5px] font-black transition-all cursor-pointer shadow-sm group shrink"
              id="btn-header-shortcut-commercial"
            >
              <span className="truncate">{headerConfig.shortcutParkingPc || '🏢 상업시설 · 수익형'}</span>
            </button>
          </div>

          {/* User Profile / Cart / Admin Quick links */}
          <div className="flex items-center gap-2 pl-2 border-l border-stone-200 shrink-0">
            {/* Cart Button with Count Badge */}
            <button
              onClick={onOpenCartModal}
              title="관심 충전기 장바구니"
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-all cursor-pointer border border-slate-200"
            >
              <ShoppingBag className="w-4 h-4 text-slate-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <button
                onClick={onOpenMyPage}
                title="마이페이지"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black cursor-pointer shadow-sm transition-all"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate max-w-[80px]">{user.name} 님</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                title="로그인 / 회원가입"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>로그인</span>
              </button>
            )}

            {/* Admin control buttons (Visible ONLY when logged in as Admin with isEditMode=true) */}
            {isEditMode && (
              <>
                <button
                  onClick={onToggleEditMode}
                  className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-md animate-pulse"
                  title="관리자 수정모드 (클릭시 비활성화)"
                >
                  <Settings className="w-3.5 h-3.5 animate-spin" />
                </button>
                {onOpenCms && (
                  <button
                    onClick={() => onOpenCms()}
                    className="bg-indigo-900 hover:bg-indigo-950 text-white border border-indigo-700 rounded-full font-black text-[10px] px-2.5 py-1 cursor-pointer transition-all shrink-0 shadow-md flex items-center gap-1"
                  >
                    <span>📁 CMS 관리자</span>
                  </button>
                )}
              </>
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
        <div className="md:hidden fixed inset-x-0 top-[115px] bottom-0 z-40 bg-white/85 backdrop-blur-lg flex flex-col p-5 space-y-6 overflow-y-auto border-t border-slate-200/80">
          
          {/* Mobile User Profile & Cart Header Bar */}
          <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-md">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">{user.name} 님</div>
                  <div className="text-[10px] text-slate-300">{user.email}</div>
                </div>
              </div>
            ) : (
              <div className="text-xs font-bold text-slate-300">
                로그인하고 나만의 견적내역과 장바구니를 확인하세요.
              </div>
            )}

            <div className="flex items-center gap-2">
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
        <div className="w-full bg-slate-900 border-t border-slate-800/80 py-2.5 shadow-inner">
          <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none whitespace-nowrap py-0.5 flex-1">
              <span className="text-xs font-black text-emerald-400 shrink-0 hidden md:inline">아파트 브랜드:</span>
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
                    className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
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

      {/* Sub-navigation bar for Home Charger (Price Type & Power Capacities) */}
      {activePage === 'sol_residential' && (
        <div className="w-full bg-emerald-950 border-t border-emerald-900/40 py-2.5 shadow-inner">
          <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 overflow-x-auto scrollbar-none whitespace-nowrap flex-1">
              {/* Price Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap">
                <span className="text-[11px] font-black text-emerald-400 mr-1 hidden sm:inline">구분:</span>
                {[
                  { id: '단말기 단품', label: '📦 단말기 단품' },
                  { id: '교체 시공', label: '🛠️ 교체 시공' },
                  { id: '신규 설치 포함', label: '⚡ 설치 포함 (신규)' }
                ].map((st) => {
                  const isSelected = selectedHomeServiceType === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => onSelectHomeServiceType?.(st.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/30 font-black scale-105'
                          : 'text-emerald-100 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>

              {/* Power Capacity Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap border-l border-emerald-800/60 pl-3">
                <span className="text-[11px] font-black text-amber-300 mr-1 hidden sm:inline">용량:</span>
                {['5kW', '7kW', '11kW'].map((kw) => {
                  const isSelected = selectedHomePower === kw;
                  return (
                    <button
                      key={kw}
                      onClick={() => onSelectHomePower?.(kw)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-yellow-400 text-slate-950 shadow-md shadow-yellow-400/30 font-black scale-105'
                          : 'text-emerald-100 hover:text-white hover:bg-white/10'
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
        <div className="w-full bg-slate-900 border-t border-slate-800 py-2.5 shadow-inner">
          <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none whitespace-nowrap flex-1">
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

      {/* Sub-bar for Home, About, Review (Moves search button 1 line down cleanly) */}
      {(activePage === 'home' || activePage === 'about' || activePage === 'review') && (
        <div className="w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 py-2 shadow-sm">
          <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
              <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-md border border-emerald-500/30 font-black">원스톱 서비스</span>
              <span className="hidden sm:inline text-slate-300">전국 최대 네트워크! 원하는 전기차 충전기 모델과 용량을 원클릭으로 검색해보세요.</span>
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
