/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import MainHero from './components/MainHero';
import AboutSection from './components/AboutSection';
import ProductsSection from './components/ProductsSection';
import SolutionsSection from './components/SolutionsSection';
import ReviewSection from './components/ReviewSection';
import SupportSection from './components/SupportSection';
import AuthModal from './components/AuthModal';
import QuoteModal from './components/QuoteModal';
import MyPageModal from './components/MyPageModal';

import { ActivePage, User, Booking, ASRequest } from './types';
import { CalendarDays, ShieldCheck, Heart, Sparkles, Phone, HelpCircle, Landmark } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [user, setUser] = useState<User | null>(null);

  // Modal Open States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  
  // Custom default purpose for Quote Modal
  const [quoteDefaultPurpose, setQuoteDefaultPurpose] = useState<'Commercial' | 'Residential' | 'ParkingLot'>('Residential');

  // Bookings and A/S records stored persistently in localStorage
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [asRequests, setAsRequests] = useState<ASRequest[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('sy_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }

    const savedBookings = localStorage.getItem('sy_bookings');
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (e) {
        console.error('Failed to parse bookings', e);
      }
    } else {
      // Seed pre-loaded bookings for first-time premium experience
      const initialBookings: Booking[] = [
        {
          id: 'b-seed-1',
          name: '김태우 소장',
          phone: '010-9876-5432',
          location: '서울',
          purpose: 'ParkingLot',
          memo: '테헤란로 오피스 빌딩 주차 면적 수익형 급속 충전 시공 설계',
          status: '시공완료',
          createdAt: '2026-06-12 10:20',
          estimateCost: '18,500,000원'
        }
      ];
      setBookings(initialBookings);
      localStorage.setItem('sy_bookings', JSON.stringify(initialBookings));
    }

    const savedAS = localStorage.getItem('sy_as');
    if (savedAS) {
      try {
        setAsRequests(JSON.parse(savedAS));
      } catch (e) {
        console.error('Failed to parse A/S', e);
      }
    } else {
      const initialAS: ASRequest[] = [
        {
          id: 'as-seed-1',
          userId: 'usr-seed',
          productName: 'SY-AC11 프로 멀티 완속',
          serialNumber: 'SY-2026-0811',
          symptom: '전원 상태 지시등 점멸 이상',
          status: '처리완료',
          createdAt: '2026-06-14 11:30'
        }
      ];
      setAsRequests(initialAS);
      localStorage.setItem('sy_as', JSON.stringify(initialAS));
    }
  }, []);

  // Sync state helpers
  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('sy_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sy_user');
    setIsMyPageOpen(false);
  };

  const handleAddBooking = (newBookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const freshBooking: Booking = {
      ...newBookingData,
      id: `booking-${Date.now()}`,
      status: '접수대기',
      createdAt: new Date().toLocaleString('ko-KR', { hour12: false }).replace(/\. /g, '-').replace(':', ':')
    };

    const updated = [freshBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('sy_bookings', JSON.stringify(updated));
  };

  const handleAddASRequest = (newASData: Omit<ASRequest, 'id' | 'userId' | 'createdAt' | 'status'>) => {
    const freshAS: ASRequest = {
      ...newASData,
      id: `as-${Date.now()}`,
      userId: user?.id || 'anonymous',
      status: '접수완료',
      createdAt: new Date().toLocaleString('ko-KR', { hour12: false }).replace(/\. /g, '-').replace(':', ':')
    };

    const updated = [freshAS, ...asRequests];
    setAsRequests(updated);
    localStorage.setItem('sy_as', JSON.stringify(updated));
  };

  // Dedicated Open quote with specific purpose pre-selected
  const handleOpenQuoteWithPurpose = (purpose: 'Commercial' | 'Residential' | 'ParkingLot') => {
    setQuoteDefaultPurpose(purpose);
    setIsQuoteOpen(true);
  };

  const handleOpenMyPageAS = () => {
    setIsMyPageOpen(true);
    // Note: We pre-select tab as 'as' inside the modal or let it boot cleanly
  };

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <MainHero
            onOpenQuote={() => handleOpenQuoteWithPurpose('Residential')}
            onOpenQuoteWithPurpose={handleOpenQuoteWithPurpose}
            onOpenMyPageAS={handleOpenMyPageAS}
            onOpenAuth={() => setIsAuthOpen(true)}
            isLoggedIn={!!user}
          />
        );
      case 'about':
        return <AboutSection />;
      case 'products':
        return <ProductsSection onOpenQuoteWithPurpose={handleOpenQuoteWithPurpose} />;
      case 'solutions':
        return <SolutionsSection onOpenQuoteWithPurpose={handleOpenQuoteWithPurpose} />;
      case 'review':
        return <ReviewSection />;
      case 'support':
        return (
          <SupportSection
            onOpenMyPageAS={handleOpenMyPageAS}
            onOpenAuth={() => setIsAuthOpen(true)}
            isLoggedIn={!!user}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/30 text-slate-900 font-sans flex flex-col justify-between">
      {/* Header & Navbar Top Navigation structure */}
      <div className="w-full">
        <Header
          user={user}
          activePage={activePage}
          onPageChange={setActivePage}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenMyPage={() => setIsMyPageOpen(true)}
          onOpenQuote={() => handleOpenQuoteWithPurpose('Residential')}
        />
        <Navbar activePage={activePage} onPageChange={setActivePage} />
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Urgent Bottom Call To Action Sticky Banner (Satisfying CTA Button "올해 마감 임박 정부 보조금 혜택 선점") */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-t border-slate-850 py-5 px-4 shadow-xl text-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-lg">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-white leading-snug">
                "지금 신청하시면, 올해 마감 임박한 정부 보조금 혜택을 우선 선점해 드립니다."
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold mt-0.5">
                지자체 예산 소진 전 한전 불입금 무료 대행과 특허 세이프티 시공 패키지를 즉시 확보하세요.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenQuoteWithPurpose('Residential')}
            id="btn-footer-sticky-cta"
            className="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-extrabold transition-all text-center flex items-center justify-center gap-1 shrink-0 shadow-lg cursor-pointer"
          >
            👉 30초 만에 무료 설치 상담 예약하기
          </button>
        </div>
      </div>

      {/* Footer (Premium, honest, and highly clean) */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Branding & description */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm tracking-tight">
                  SY
                </div>
                <span className="font-extrabold text-white text-base tracking-tight">
                  SY.com
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                SY.com은 대한민국 환경부 공식 대행 사업 파트너로서 친환경 과열감지 차단 기술 탑재 완속 및 초급속 충전기를 설계부터 국가보조금 지원까지 책임 시공합니다.
              </p>
              <div className="text-xs text-slate-500 space-y-0.5">
                <p>전국 통합 대표번호: 1588-SY01 (A/S 정비 전담 지원)</p>
                <p>사업 제휴 메일: sy.car.com@gmail.com</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">주요 카테고리</h4>
              <ul className="text-xs space-y-2">
                <li><button onClick={() => setActivePage('about')} className="hover:text-white transition-colors">ABOUT SY.com (회사소개)</button></li>
                <li><button onClick={() => setActivePage('products')} className="hover:text-white transition-colors">PRODUCTS (신제품 라인업)</button></li>
                <li><button onClick={() => setActivePage('solutions')} className="hover:text-white transition-colors">SOLUTIONS (용도별 맞춤)</button></li>
                <li><button onClick={() => setActivePage('review')} className="hover:text-white transition-colors">REVIEW (설치후기 지도)</button></li>
                <li><button onClick={() => setActivePage('support')} className="hover:text-white transition-colors">SUPPORT (고객센터 FAQ)</button></li>
              </ul>
            </div>

            {/* Legal and compliance footnotes */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">회사 정보 및 면책 고지</h4>
              <p className="text-[10px] text-slate-500 leading-normal">
                상호: 주식회사 에스와이코리아 | 대표이사: 김성윤 | 사업자등록번호: 123-45-67890 <br />
                주소: 서울특별시 강남구 테헤란로 OOO 타워 SY빌딩 <br />
                통신판매업신고번호: 제 2026-서울강남-1234호 <br />
                모든 전기공사는 국가 정식 전기공사업 면허(제 OO-12345호) 보유 유자격 전담 시공팀이 직접 배정되어 법을 준수합니다.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-[10px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© 2026 SY.com Co., Ltd. All Rights Reserved.</p>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:underline">개인정보처리방침</a>
              <a href="#terms" className="hover:underline">이용약관</a>
              <a href="#standard" className="hover:underline">한전 인입공사 표준</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals Container */}
      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onLoginSuccess={handleLogin}
          />
        )}
        
        {isQuoteOpen && (
          <QuoteModal
            isOpen={isQuoteOpen}
            onClose={() => setIsQuoteOpen(false)}
            onSubmitBooking={handleAddBooking}
            initialPurpose={quoteDefaultPurpose}
          />
        )}

        {user && isMyPageOpen && (
          <MyPageModal
            isOpen={isMyPageOpen}
            onClose={() => setIsMyPageOpen(false)}
            user={user}
            bookings={bookings}
            asRequests={asRequests}
            onAddASRequest={handleAddASRequest}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
