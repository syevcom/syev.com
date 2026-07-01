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
import CmsEditorModal from './components/CmsEditorModal';
import AdminLoginModal from './components/AdminLoginModal';

import { PRODUCTS, SOLUTIONS, REVIEWS, FAQS, NOTICES } from './data';
import { ActivePage, User, Booking, ASRequest, Product, Solution, Review, FAQ } from './types';
import { CalendarDays, ShieldCheck, Heart, Sparkles, Phone, HelpCircle, Landmark, Instagram, ChevronUp, ChevronDown, MessageSquare } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [user, setUser] = useState<User | null>(null);

  // Modal Open States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  
  // Custom default purpose for Quote Modal
  const [quoteDefaultPurpose, setQuoteDefaultPurpose] = useState<'Commercial' | 'Residential' | 'ParkingLot'>('Residential');

  // Bookings and A/S records stored persistently in localStorage
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [asRequests, setAsRequests] = useState<ASRequest[]>([]);

  // CMS Live Editor states
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [cmsTab, setCmsTab] = useState<'brand' | 'hero' | 'about' | 'products' | 'solutions' | 'review' | 'support'>('brand');

  // Brand Logo & Categories config state
  const [logoConfig, setLogoConfig] = useState({
    text: 'SY',
    subtitle: 'SY.com',
    imageUrl: '',
    showCompanyName: true,
    companyNameText: '주식회사 에스와이코리아',
    companyNameFont: 'noto',
    companyNameWeight: 'extrabold',
    companyNameSize: 'sm',
    companyNameColor: 'slate-700'
  });

  const [categoryLabels, setCategoryLabels] = useState({
    home: '홈',
    about: '회사소개',
    products: '신제품소개',
    solutions: '용도별솔루션',
    review: '설치후기',
    support: '고객지원'
  });

  const [footerConfig, setFooterConfig] = useState({
    phone: '1588-SY01 (A/S 정비 전담 지원)',
    email: 'sy.car.com@gmail.com',
    companyName: '주식회사 에스와이코리아',
    ceoName: '김성윤',
    businessNumber: '123-45-67890',
    address: '서울특별시 강남구 테헤란로 OOO 타워 SY빌딩',
    teleSalesNumber: '제 2026-서울강남-1234호',
    licenseInfo: '모든 전기공사는 국가 정식 전기공사업 면허(제 OO-12345호) 보유 유자격 전담 시공팀이 직접 배정되어 법을 준수합니다.'
  });

  const [heroConfig, setHeroConfig] = useState({
    badge: '전국 최대 원스톱 설치 네트워크',
    title: '대한민국 어디든,<br />전기차가 멈추는 곳엔 <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">SY.com</span>',
    description: '전국 최대 전력 인프라망을 바탕으로 완벽 설계, 까다로운 지자체 정부 무상 보조금 신청 대행, 한전 계량기 수급 및 사후 24시간 철저 정비 관리까지 원스톱으로 명쾌하게 해결하세요.',
    ctaButton: '👉 30초 만에 무료 설치 상담 예약하기',
    calcButton: '1분 스마트 보조금 견적 내기',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200',
    showHeroImage: true
  });

  const [snsConfig, setSnsConfig] = useState({
    kakaoUrl: 'https://pf.kakao.com/',
    instagramUrl: 'https://www.instagram.com/',
    blogUrl: 'https://section.blog.naver.com/',
    showFloatingSns: true
  });

  const [quickMenuConfig, setQuickMenuConfig] = useState({
    showQuickMenu: true,
    items: [
      { id: 'q-1', label: '설치후기', iconType: 'MapPin', targetPage: 'review' },
      { id: 'q-2', label: '기업용 충전', iconType: 'Building2', targetPage: 'solutions' },
      { id: 'q-3', label: '주택 비공용', iconType: 'Home', targetPage: 'solutions' },
      { id: 'q-4', label: '학교&관공서', iconType: 'GraduationCap', targetPage: 'solutions' },
      { id: 'q-5', label: '주차장 충전', iconType: 'ParkingCircle', targetPage: 'solutions' },
      { id: 'q-6', label: '급속충전기', iconType: 'Zap', targetPage: 'products' },
      { id: 'q-7', label: '기기 교체', iconType: 'RefreshCw', targetPage: 'support' },
      { id: 'q-8', label: '홍보수익형', iconType: 'TrendingUp', targetPage: 'about' }
    ]
  });

  const [aboutConfig, setAboutConfig] = useState({
    ceoName: '김 성 윤 대표이사',
    ceoRole: 'SY.com Co., Ltd. Founder & CEO',
    ceoGreeting: '"지속 가능한 전기차 운전의 첫걸음, \n내 주차장에서 시작되는 안전과 편안함입니다."',
    ceoMessage1: '안녕하십니까, SY.com 대표이사 김성윤입니다. 대한민국 도로 위에 친환경 전기차가 급증하면서 이제 충전 인프라는 선택이 아닌 필수 주거/상업 복지 인프라가 되었습니다.',
    ceoMessage2: '하지만 최근 다중이용시설 및 주거지역 내 전기차 충전 중의 크고 작은 전기적 트러블과 화재 위험에 대한 우려로 입주민 협의를 보지 못하고 설치를 망설이시는 고객분들이 많습니다.',
    ceoMessage3: '저희 SY.com은 특허청에 등록된 차세대 화재감지 PLC 모뎀 차단 기술과 실시간 과열 진단 모니터링을 전 기종에 도입하여 완벽히 안전한 스마트 충전 생태계를 이룩했습니다. 설계부터 번거로운 관공서/한전/지자체 보조금 심사 서류 신청까지, SY.com 전 직원이 발로 뛰며 고객님의 편안함을 완성하겠습니다.',
    ceoImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600'
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [notices, setNotices] = useState<any[]>([]);

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

    // CMS Configurations
    const savedLogo = localStorage.getItem('sy_cms_logo');
    if (savedLogo) {
      try { setLogoConfig(JSON.parse(savedLogo)); } catch (e) { console.error(e); }
    }

    const savedCategories = localStorage.getItem('sy_cms_categories');
    if (savedCategories) {
      try { setCategoryLabels(JSON.parse(savedCategories)); } catch (e) { console.error(e); }
    }

    const savedFooter = localStorage.getItem('sy_cms_footer');
    if (savedFooter) {
      try { setFooterConfig(JSON.parse(savedFooter)); } catch (e) { console.error(e); }
    }

    const savedHero = localStorage.getItem('sy_cms_hero');
    if (savedHero) {
      try { setHeroConfig(JSON.parse(savedHero)); } catch (e) { console.error(e); }
    }

    const savedAbout = localStorage.getItem('sy_cms_about');
    if (savedAbout) {
      try { setAboutConfig(JSON.parse(savedAbout)); } catch (e) { console.error(e); }
    }

    const savedProducts = localStorage.getItem('sy_cms_products');
    if (savedProducts) {
      try { setProducts(JSON.parse(savedProducts)); } catch (e) { console.error(e); }
    } else {
      setProducts(PRODUCTS);
      localStorage.setItem('sy_cms_products', JSON.stringify(PRODUCTS));
    }

    const savedSolutions = localStorage.getItem('sy_cms_solutions');
    if (savedSolutions) {
      try { setSolutions(JSON.parse(savedSolutions)); } catch (e) { console.error(e); }
    } else {
      setSolutions(SOLUTIONS);
      localStorage.setItem('sy_cms_solutions', JSON.stringify(SOLUTIONS));
    }

    const savedReviews = localStorage.getItem('sy_cms_reviews');
    if (savedReviews) {
      try { setReviews(JSON.parse(savedReviews)); } catch (e) { console.error(e); }
    } else {
      setReviews(REVIEWS);
      localStorage.setItem('sy_cms_reviews', JSON.stringify(REVIEWS));
    }

    const savedFaqs = localStorage.getItem('sy_cms_faqs');
    if (savedFaqs) {
      try { setFaqs(JSON.parse(savedFaqs)); } catch (e) { console.error(e); }
    } else {
      setFaqs(FAQS);
      localStorage.setItem('sy_cms_faqs', JSON.stringify(FAQS));
    }

    const savedNotices = localStorage.getItem('sy_cms_notices');
    if (savedNotices) {
      try { setNotices(JSON.parse(savedNotices)); } catch (e) { console.error(e); }
    } else {
      setNotices(NOTICES);
      localStorage.setItem('sy_cms_notices', JSON.stringify(NOTICES));
    }

    const savedSns = localStorage.getItem('sy_cms_sns');
    if (savedSns) {
      try { setSnsConfig(JSON.parse(savedSns)); } catch (e) { console.error(e); }
    }

    const savedQuickMenu = localStorage.getItem('sy_cms_quickmenu');
    if (savedQuickMenu) {
      try { setQuickMenuConfig(JSON.parse(savedQuickMenu)); } catch (e) { console.error(e); }
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

  // CMS configuration save handlers
  const handleSaveLogoConfig = (config: any) => {
    setLogoConfig(config);
    localStorage.setItem('sy_cms_logo', JSON.stringify(config));
  };

  const handleSaveCategoryLabels = (labels: any) => {
    setCategoryLabels(labels);
    localStorage.setItem('sy_cms_categories', JSON.stringify(labels));
  };

  const handleSaveFooterConfig = (config: any) => {
    setFooterConfig(config);
    localStorage.setItem('sy_cms_footer', JSON.stringify(config));
  };

  const handleSaveHeroConfig = (config: any) => {
    setHeroConfig(config);
    localStorage.setItem('sy_cms_hero', JSON.stringify(config));
  };

  const handleSaveAboutConfig = (config: any) => {
    setAboutConfig(config);
    localStorage.setItem('sy_cms_about', JSON.stringify(config));
  };

  const handleSaveSnsConfig = (config: any) => {
    setSnsConfig(config);
    localStorage.setItem('sy_cms_sns', JSON.stringify(config));
  };

  const handleSaveQuickMenuConfig = (config: any) => {
    setQuickMenuConfig(config);
    localStorage.setItem('sy_cms_quickmenu', JSON.stringify(config));
  };

  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('sy_cms_products', JSON.stringify(newProducts));
  };

  const handleSaveSolutions = (newSolutions: Solution[]) => {
    setSolutions(newSolutions);
    localStorage.setItem('sy_cms_solutions', JSON.stringify(newSolutions));
  };

  const handleSaveReviews = (newReviews: Review[]) => {
    setReviews(newReviews);
    localStorage.setItem('sy_cms_reviews', JSON.stringify(newReviews));
  };

  const handleSaveFaqs = (newFaqs: FAQ[]) => {
    setFaqs(newFaqs);
    localStorage.setItem('sy_cms_faqs', JSON.stringify(newFaqs));
  };

  const handleSaveNotices = (newNotices: any[]) => {
    setNotices(newNotices);
    localStorage.setItem('sy_cms_notices', JSON.stringify(newNotices));
  };

  const handleResetAll = () => {
    localStorage.removeItem('sy_cms_logo');
    localStorage.removeItem('sy_cms_categories');
    localStorage.removeItem('sy_cms_footer');
    localStorage.removeItem('sy_cms_hero');
    localStorage.removeItem('sy_cms_about');
    localStorage.removeItem('sy_cms_products');
    localStorage.removeItem('sy_cms_solutions');
    localStorage.removeItem('sy_cms_reviews');
    localStorage.removeItem('sy_cms_faqs');
    localStorage.removeItem('sy_cms_notices');
    localStorage.removeItem('sy_cms_sns');
    localStorage.removeItem('sy_cms_quickmenu');

    setLogoConfig({
      text: 'SY',
      subtitle: 'SY.com',
      imageUrl: '',
      showCompanyName: true,
      companyNameText: '주식회사 에스와이코리아',
      companyNameFont: 'noto',
      companyNameWeight: 'extrabold',
      companyNameSize: 'sm',
      companyNameColor: 'slate-700'
    });

    setCategoryLabels({
      home: '홈',
      about: '회사소개',
      products: '신제품소개',
      solutions: '용도별솔루션',
      review: '설치후기',
      support: '고객지원'
    });

    setFooterConfig({
      phone: '1588-SY01 (A/S 정비 전담 지원)',
      email: 'sy.car.com@gmail.com',
      companyName: '주식회사 에스와이코리아',
      ceoName: '김성윤',
      businessNumber: '123-45-67890',
      address: '서울특별시 강남구 테헤란로 OOO 타워 SY빌딩',
      teleSalesNumber: '제 2026-서울강남-1234호',
      licenseInfo: '모든 전기공사는 국가 정식 전기공사업 면허(제 OO-12345호) 보유 유자격 전담 시공팀이 직접 배정되어 법을 준수합니다.'
    });

    setHeroConfig({
      badge: '전국 최대 원스톱 설치 네트워크',
      title: '대한민국 어디든,<br />전기차가 멈추는 곳엔 <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">SY.com</span>',
      description: '전국 최대 전력 인프라망을 바탕으로 완벽 설계, 까다로운 지자체 정부 무상 보조금 신청 대행, 한전 계량기 수급 및 사후 24시간 철저 정비 관리까지 원스톱으로 명쾌하게 해결하세요.',
      ctaButton: '👉 30초 만에 무료 설치 상담 예약하기',
      calcButton: '1분 스마트 보조금 견적 내기',
      imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200',
      showHeroImage: true
    });

    setSnsConfig({
      kakaoUrl: 'https://pf.kakao.com/',
      instagramUrl: 'https://www.instagram.com/',
      blogUrl: 'https://section.blog.naver.com/',
      showFloatingSns: true
    });

    setQuickMenuConfig({
      showQuickMenu: true,
      items: [
        { id: 'q-1', label: '설치후기', iconType: 'MapPin', targetPage: 'review' },
        { id: 'q-2', label: '기업용 충전', iconType: 'Building2', targetPage: 'solutions' },
        { id: 'q-3', label: '주택 비공용', iconType: 'Home', targetPage: 'solutions' },
        { id: 'q-4', label: '학교&관공서', iconType: 'GraduationCap', targetPage: 'solutions' },
        { id: 'q-5', label: '주차장 충전', iconType: 'ParkingCircle', targetPage: 'solutions' },
        { id: 'q-6', label: '급속충전기', iconType: 'Zap', targetPage: 'products' },
        { id: 'q-7', label: '기기 교체', iconType: 'RefreshCw', targetPage: 'support' },
        { id: 'q-8', label: '홍보수익형', iconType: 'TrendingUp', targetPage: 'about' }
      ]
    });

    setAboutConfig({
      ceoName: '김 성 윤 대표이사',
      ceoRole: 'SY.com Co., Ltd. Founder & CEO',
      ceoGreeting: '"지속 가능한 전기차 운전의 첫걸음, \n내 주차장에서 시작되는 안전과 편안함입니다."',
      ceoMessage1: '안녕하십니까, SY.com 대표이사 김성윤입니다. 대한민국 도로 위에 친환경 전기차가 급증하면서 이제 충전 인프라는 선택이 아닌 필수 주거/상업 복지 인프라가 되었습니다.',
      ceoMessage2: '하지만 최근 다중이용시설 및 주거지역 내 전기차 충전 중의 크고 작은 전기적 트러블과 화재 위험에 대한 우려로 입주민 협의를 보지 못하고 설치를 망설이시는 고객분들이 많습니다.',
      ceoMessage3: '저희 SY.com은 특허청에 등록된 차세대 화재감지 PLC 모뎀 차단 기술과 실시간 과열 진단 모니터링을 전 기종에 도입하여 완벽히 안전한 스마트 충전 생태계를 이룩했습니다. 설계부터 번거로운 관공서/한전/지자체 보조금 심사 서류 신청까지, SY.com 전 직원이 발로 뛰며 고객님의 편안함을 완성하겠습니다.',
      ceoImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600'
    });

    setProducts(PRODUCTS);
    setSolutions(SOLUTIONS);
    setReviews(REVIEWS);
    setFaqs(FAQS);
    setNotices(NOTICES);
  };

  const handleOpenCmsTab = (tab: typeof cmsTab) => {
    setCmsTab(tab);
    setIsCmsOpen(true);
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
            heroConfig={heroConfig}
            quickMenuConfig={quickMenuConfig}
            onPageChange={setActivePage}
            isEditMode={isEditMode}
            onOpenCms={handleOpenCmsTab}
            onOpenQuote={() => handleOpenQuoteWithPurpose('Residential')}
            onOpenQuoteWithPurpose={handleOpenQuoteWithPurpose}
            onOpenMyPageAS={handleOpenMyPageAS}
            onOpenAuth={() => setIsAuthOpen(true)}
            isLoggedIn={!!user}
          />
        );
      case 'about':
        return (
          <AboutSection 
            aboutConfig={aboutConfig} 
            isEditMode={isEditMode} 
            onOpenCms={handleOpenCmsTab} 
          />
        );
      case 'products':
        return (
          <ProductsSection 
            products={products}
            isEditMode={isEditMode}
            onOpenCms={handleOpenCmsTab}
            onOpenQuoteWithPurpose={handleOpenQuoteWithPurpose} 
          />
        );
      case 'solutions':
        return (
          <SolutionsSection 
            solutions={solutions}
            isEditMode={isEditMode}
            onOpenCms={handleOpenCmsTab}
            onOpenQuoteWithPurpose={handleOpenQuoteWithPurpose} 
          />
        );
      case 'review':
        return (
          <ReviewSection 
            reviews={reviews}
            isEditMode={isEditMode}
            onOpenCms={handleOpenCmsTab}
          />
        );
      case 'support':
        return (
          <SupportSection
            faqs={faqs}
            notices={notices}
            isEditMode={isEditMode}
            onOpenCms={handleOpenCmsTab}
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
          isEditMode={isEditMode}
          onToggleEditMode={() => {
            if (!isEditMode) {
              setIsAdminLoginOpen(true);
            } else {
              setIsEditMode(false);
            }
          }}
          onOpenCms={() => setIsCmsOpen(true)}
          logoConfig={logoConfig}
        />
        <Navbar activePage={activePage} onPageChange={setActivePage} categoryLabels={categoryLabels} />
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

      {/* Floating SNS & Quick Navigation Bar on the Right side (EVC1 Style but unique design) */}
      {snsConfig.showFloatingSns && (
        <div className="fixed right-4 bottom-24 sm:right-6 sm:bottom-28 z-40 flex flex-col gap-3 items-center">
          {/* Box Wrapper with elegant glassmorphism and shadow */}
          <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-slate-200/60 shadow-xl flex flex-col gap-2.5 items-center">
            
            {/* KakaoTalk URL */}
            <a
              href={snsConfig.kakaoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="카카오톡 실시간 상담"
              className="w-10 h-10 rounded-full bg-[#FEE500] hover:scale-110 active:scale-95 flex items-center justify-center text-[#191919] font-black shadow-md transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 animate-pulse" />
            </a>

            {/* Instagram URL */}
            <a
              href={snsConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="인스타그램 방문"
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 hover:scale-110 active:scale-95 flex items-center justify-center text-white shadow-md transition-all cursor-pointer"
            >
              <Instagram className="w-5 h-5" />
            </a>

            {/* Naver Blog URL */}
            <a
              href={snsConfig.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="공식 블로그 방문"
              className="w-10 h-10 rounded-full bg-[#03C75A] hover:scale-110 active:scale-95 flex items-center justify-center text-white text-[10px] font-black shadow-md transition-all cursor-pointer font-mono"
            >
              blog
            </a>
          </div>

          {/* Quick Scroll Top / Bottom buttons */}
          <div className="bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1.5 items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              title="맨 위로 가기"
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              title="맨 아래로 가기"
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
              <div className="flex items-center gap-2.5">
                {logoConfig.imageUrl ? (
                  <img 
                    src={logoConfig.imageUrl} 
                    alt={logoConfig.subtitle} 
                    className="h-8 max-w-[140px] object-contain brightness-0 invert opacity-90"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm tracking-tight">
                      {logoConfig.text}
                    </div>
                    <span className="font-extrabold text-white text-base tracking-tight">
                      {logoConfig.subtitle}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                {logoConfig.subtitle}은 대한민국 환경부 공식 대행 사업 파트너로서 친환경 과열감지 차단 기술 탑재 완속 및 초급속 충전기를 설계부터 국가보조금 지원까지 책임 시공합니다.
              </p>
              <div className="text-xs text-slate-500 space-y-0.5">
                <p>전국 통합 대표번호: {footerConfig.phone}</p>
                <p>사업 제휴 메일: {footerConfig.email}</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">주요 카테고리</h4>
              <ul className="text-xs space-y-2">
                <li><button onClick={() => setActivePage('about')} className="hover:text-white transition-colors">{categoryLabels.about} (회사소개)</button></li>
                <li><button onClick={() => setActivePage('products')} className="hover:text-white transition-colors">{categoryLabels.products} (신제품 라인업)</button></li>
                <li><button onClick={() => setActivePage('solutions')} className="hover:text-white transition-colors">{categoryLabels.solutions} (용도별 맞춤)</button></li>
                <li><button onClick={() => setActivePage('review')} className="hover:text-white transition-colors">{categoryLabels.review} (설치후기 지도)</button></li>
                <li><button onClick={() => setActivePage('support')} className="hover:text-white transition-colors">{categoryLabels.support} (고객센터 FAQ)</button></li>
              </ul>
            </div>

            {/* Legal and compliance footnotes */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">회사 정보 및 면책 고지</h4>
              <p className="text-[10px] text-slate-500 leading-normal">
                상호: {footerConfig.companyName} | 대표이사: {footerConfig.ceoName} | 사업자등록번호: {footerConfig.businessNumber} <br />
                주소: {footerConfig.address} <br />
                통신판매업신고번호: {footerConfig.teleSalesNumber} <br />
                {footerConfig.licenseInfo}
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-[10px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© 2026 {logoConfig.subtitle} Co., Ltd. All Rights Reserved.</p>
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

        {isCmsOpen && (
          <CmsEditorModal
            isOpen={isCmsOpen}
            onClose={() => setIsCmsOpen(false)}
            logoConfig={logoConfig}
            onSaveLogoConfig={handleSaveLogoConfig}
            categoryLabels={categoryLabels}
            onSaveCategoryLabels={handleSaveCategoryLabels}
            footerConfig={footerConfig}
            onSaveFooterConfig={handleSaveFooterConfig}
            snsConfig={snsConfig}
            onSaveSnsConfig={handleSaveSnsConfig}
            quickMenuConfig={quickMenuConfig}
            onSaveQuickMenuConfig={handleSaveQuickMenuConfig}
            heroConfig={heroConfig}
            onSaveHeroConfig={handleSaveHeroConfig}
            aboutConfig={aboutConfig}
            onSaveAboutConfig={handleSaveAboutConfig}
            products={products}
            onSaveProducts={handleSaveProducts}
            solutions={solutions}
            onSaveSolutions={handleSaveSolutions}
            reviews={reviews}
            onSaveReviews={handleSaveReviews}
            faqs={faqs}
            onSaveFaqs={handleSaveFaqs}
            notices={notices}
            onSaveNotices={handleSaveNotices}
            onResetAll={handleResetAll}
            initialTab={cmsTab}
          />
        )}

        {isAdminLoginOpen && (
          <AdminLoginModal
            isOpen={isAdminLoginOpen}
            onClose={() => setIsAdminLoginOpen(false)}
            onLoginSuccess={() => {
              setIsAdminLoginOpen(false);
              setIsEditMode(true);
              setIsCmsOpen(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
