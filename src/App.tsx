/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
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
import { CalendarDays, ShieldCheck, Heart, Sparkles, Phone, HelpCircle, Landmark, Instagram, ChevronUp, ChevronDown, MessageSquare, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const DEFAULT_FIELDS = {
  Residential: [
    { id: 'name', label: '신청인 이름 / 법인 담당자', type: 'text', placeholder: '홍길동', required: true },
    { id: 'phone', label: '연락처 (휴대폰 번호)', type: 'tel', placeholder: '010-1234-5678', required: true },
    { id: 'location', label: '설치 희망 지역', type: 'select', required: true, options: ['서울', '경기', '인천', '강원', '충북', '충남/대전', '전북', '전남/광주', '경북/대구', '경남/부산/울산', '제주'] },
    { id: 'residenceType', label: '주거 형태', type: 'select', required: true, options: ['아파트(공용)', '아파트(개인)', '단독주택', '빌라/연립', '기타'] },
    { id: 'memo', label: '상담 희망 메모 (선택사항)', type: 'text', placeholder: '기타 상세한 요구 사항을 적어주세요.', required: false }
  ],
  Commercial: [
    { id: 'companyName', label: '아파트명 (건물명)', type: 'text', placeholder: '예: 에스와이 1차 아파트', required: true },
    { id: 'location', label: '주소', type: 'address', placeholder: '설치지 상세 주소를 입력 또는 검색해 주세요.', required: true },
    { id: 'parkingCount', label: '보유 주차면수', type: 'text', placeholder: '예: 150면', required: true },
    { id: 'quantity', label: '설치 희망 수량 (대)', type: 'number', placeholder: '예: 10', required: true },
    { id: 'ownedChargers', label: '보유 충전기 수량 (대)', type: 'number', placeholder: '예: 2 (없을 시 0 입력)', required: true },
    { id: 'name', label: '신청자명', type: 'text', placeholder: '홍길동', required: true },
    { id: 'phone', label: '연락처 (휴대폰 번호)', type: 'tel', placeholder: '010-1234-5678', required: true },
    { id: 'email', label: '이메일 주소', type: 'text', placeholder: 'example@domain.com', required: true },
    { id: 'memo', label: '문의 상세 사항 (선택사항)', type: 'text', placeholder: '기타 추가 질문이나 특이사항을 입력해 주세요.', required: false }
  ],
  ParkingLot: [
    { id: 'parkingName', label: '주차장 상호 / 빌딩명', type: 'text', placeholder: '강남 타워 주차장', required: true },
    { id: 'name', label: '담당자 이름', type: 'text', placeholder: '홍길동', required: true },
    { id: 'phone', label: '연락처 (휴대폰 번호)', type: 'tel', placeholder: '010-1234-5678', required: true },
    { id: 'location', label: '설치 희망 지역', type: 'select', required: true, options: ['서울', '경기', '인천', '강원', '충북', '충남/대전', '전북', '전남/광주', '경북/대구', '경남/부산/울산', '제주'] },
    { id: 'parkingCount', label: '총 주차 가능 면수', type: 'text', placeholder: '예: 50면', required: true },
    { id: 'operatingType', label: '주차장 운영 방식', type: 'select', required: true, options: ['유료 주차장', '무료 주차장', '일부 유료/혼합', '기타'] },
    { id: 'memo', label: '추가 상담 사항 (선택사항)', type: 'text', placeholder: '희망하는 운영 방식이나 질문을 기재해 주세요.', required: false }
  ]
};

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
  const [selectedAptBrand, setSelectedAptBrand] = useState<string>('sk일렉링크');
  const [selectedHomePower, setSelectedHomePower] = useState<string>('7kW');

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
    products: '가정용',
    solutions: '아파트',
    review: '설치후기',
    support: '상업시설',
    sol_commercial: '아파트',
    sol_residential: '가정용 홈',
    sol_parking: '상업시설 수익형'
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
    title: '대한민국 어디든,<br />전기차가 멈추는 곳엔 <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">SY.com</span>',
    description: '전국 최대 전력 인프라망을 바탕으로 완벽 설계, 까다로운 지자체 정부 무상 보조금 신청 대행, 한전 계량기 수급 및 사후 24시간 철저 정비 관리까지 원스톱으로 명쾌하게 해결하세요.',
    ctaButton: '👉 30초 만에 무료 설치 상담 예약하기',
    calcButton: '1분 스마트 보조금 견적 내기',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200',
    showHeroImage: true,
    titleSize: 'large' as 'small' | 'medium' | 'large' | 'xlarge',
    descriptionSize: 'medium' as 'small' | 'medium' | 'large',
    liveCountStart: 14520,
    liveCountLabel: '현재 전국 SY.com 충전기 설치 현황',
    liveCountSuffix: '대 돌파',
    solutionBlueSize: 'medium' as 'small' | 'medium' | 'large' | 'xlarge',
    commercialBlueText: '회사 사옥, 물류창고, 공장, 관공서 전용',
    residentialBlueText: '단독주택, 빌라, 아파트(개인/공용) 전용',
    parkingBlueText: '대형 마트, 호텔, 빌딩, 공영주차장 맞춤',
    quickContact1: '환경부지원 아파트 무상설치 문의 ⚡',
    quickContact2: '가정용 · 홈 충전기 설치문의 🏠',
    quickContact3: '상업시설 · 수익형 충전기 설치문의 🏢'
  });

  const [quoteConfig, setQuoteConfig] = useState<{
    badge: string;
    title: string;
    submitButton: string;
    successTitle: string;
    successDesc: string;
    privacyNotice: string;
    directPhone?: string;
    directKakaoUrl?: string;
    purposeLabels?: {
      Residential: string;
      Commercial: string;
      ParkingLot: string;
    };
    fields?: {
      Residential: any[];
      Commercial: any[];
      ParkingLot: any[];
    };
  }>({
    badge: '정부보조금 마감 임박 혜택 우선 선점',
    title: '무료 설치 상담 & 실시간 맞춤 견적',
    submitButton: '👉 30초 만에 무료 설치 상담 예약하기',
    successTitle: '상담 신청이 정상 접수되었습니다!',
    successDesc: '올해 배정된 정부 보조금 잔여 한도 선점을 위해, 2시간 이내에 담당 전문 컨설턴트가 기재해 주신 번호로 연락드리겠습니다.',
    privacyNotice: '안심 보증 정책: 입력하신 정보는 한전 한도 및 정부 무상 보조금 산정 용도로만 안전하게 활용되며, 전문 법률에 따라 개인정보보호법을 철저히 준수합니다.',
    directPhone: '1588-SY01',
    directKakaoUrl: 'https://pf.kakao.com/',
    purposeLabels: {
      Residential: '가정용 홈 (단독주택/빌라/개인)',
      Commercial: '아파트용 (공동주택/공용시설)',
      ParkingLot: '상업시설 수익형 (호텔/마트/상가빌딩)'
    },
    fields: DEFAULT_FIELDS
  });

  // Dynamic sub-navigation tabs default filtering state
  const [solutionsDefaultTab, setSolutionsDefaultTab] = useState<'ALL' | 'Commercial' | 'Residential' | 'ParkingLot'>('ALL');
  const [productsDefaultTab, setProductsDefaultTab] = useState<string>('ALL');

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
      { id: 'q-2', label: '아파트 충전', iconType: 'Building2', targetPage: 'solutions' },
      { id: 'q-3', label: '가정용 홈', iconType: 'Home', targetPage: 'solutions' },
      { id: 'q-4', label: '학교&관공서', iconType: 'GraduationCap', targetPage: 'solutions' },
      { id: 'q-5', label: '상업시설 수익형', iconType: 'ParkingCircle', targetPage: 'solutions' },
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
      try {
        const parsed = JSON.parse(savedCategories);
        if (parsed) {
          if (!parsed.sol_commercial) parsed.sol_commercial = '아파트';
          if (!parsed.sol_residential) parsed.sol_residential = '가정용 홈';
          if (!parsed.sol_parking) parsed.sol_parking = '상업시설 수익형';
        }
        setCategoryLabels(parsed);
      } catch (e) { console.error(e); }
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

    const savedQuote = localStorage.getItem('sy_cms_quote');
    if (savedQuote) {
      try {
        const parsed = JSON.parse(savedQuote);
        if (parsed) {
          let migrated = false;
          if (parsed.purposeLabels) {
            if (parsed.purposeLabels.Residential && (parsed.purposeLabels.Residential.includes('비공용') || parsed.purposeLabels.Residential.includes('주거용'))) {
              parsed.purposeLabels.Residential = '가정용 홈 (단독주택/빌라/개인)';
              migrated = true;
            }
            if (parsed.purposeLabels.Commercial && (parsed.purposeLabels.Commercial.includes('기업/관공서') || parsed.purposeLabels.Commercial.includes('기업용'))) {
              parsed.purposeLabels.Commercial = '아파트용 (공동주택/공용시설)';
              migrated = true;
            }
            if (parsed.purposeLabels.ParkingLot && (parsed.purposeLabels.ParkingLot.includes('수익형 주차장') || parsed.purposeLabels.ParkingLot.includes('수익형 상가'))) {
              parsed.purposeLabels.ParkingLot = '상업시설 수익형 (호텔/마트/상가빌딩)';
              migrated = true;
            }
          }
          
          if (!parsed.fields || !parsed.fields.Commercial || parsed.fields.Commercial.some((f: any) => f.id === 'powerCapacity') || !parsed.fields.Commercial.some((f: any) => f.id === 'ownedChargers')) {
            parsed.fields = {
              ...parsed.fields,
              Commercial: DEFAULT_FIELDS.Commercial
            };
            migrated = true;
          }

          if (migrated) {
            localStorage.setItem('sy_cms_quote', JSON.stringify(parsed));
          }
        }
        setQuoteConfig(parsed);
      } catch (e) { console.error(e); }
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

  const handleSaveQuoteConfig = (config: any) => {
    setQuoteConfig(config);
    localStorage.setItem('sy_cms_quote', JSON.stringify(config));
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
    localStorage.removeItem('sy_cms_quote');

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
      products: '가정용',
      solutions: '아파트',
      review: '설치후기',
      support: '상업시설'
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
      title: '대한민국 어디든,<br />전기차가 멈추는 곳엔 <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">SY.com</span>',
      description: '전국 최대 전력 인프라망을 바탕으로 완벽 설계, 까다로운 지자체 정부 무상 보조금 신청 대행, 한전 계량기 수급 및 사후 24시간 철저 정비 관리까지 원스톱으로 명쾌하게 해결하세요.',
      ctaButton: '👉 30초 만에 무료 설치 상담 예약하기',
      calcButton: '1분 스마트 보조금 견적 내기',
      imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200',
      showHeroImage: true,
      titleSize: 'large' as 'small' | 'medium' | 'large' | 'xlarge',
      descriptionSize: 'medium' as 'small' | 'medium' | 'large',
      liveCountStart: 14520,
      liveCountLabel: '현재 전국 SY.com 충전기 설치 현황',
      liveCountSuffix: '대 돌파',
      solutionBlueSize: 'medium' as 'small' | 'medium' | 'large' | 'xlarge',
      commercialBlueText: '회사 사옥, 물류창고, 공장, 관공서 전용',
      residentialBlueText: '단독주택, 빌라, 아파트(개인/공용) 전용',
      parkingBlueText: '대형 마트, 호텔, 빌딩, 공영주차장 맞춤',
      quickContact1: '환경부지원 아파트 무상설치 문의 ⚡',
      quickContact2: '가정용 · 홈 충전기 설치문의 🏠',
      quickContact3: '상업시설 · 수익형 충전기 설치문의 🏢'
    });

    setQuoteConfig({
      badge: '정부보조금 마감 임박 혜택 우선 선점',
      title: '무료 설치 상담 & 실시간 맞춤 견적',
      submitButton: '👉 30초 만에 무료 설치 상담 예약하기',
      successTitle: '상담 신청이 정상 접수되었습니다!',
      successDesc: '올해 배정된 정부 보조금 잔여 한도 선점을 위해, 2시간 이내에 담당 전문 컨설턴트가 기재해 주신 번호로 연락드리겠습니다.',
      privacyNotice: '안심 보증 정책: 입력하신 정보는 한전 한도 및 정부 무상 보조금 산정 용도로만 안전하게 활용되며, 전문 법률에 따라 개인정보보호법을 철저히 준수합니다.',
      directPhone: '1588-SY01',
      directKakaoUrl: 'https://pf.kakao.com/',
      purposeLabels: {
        Residential: '가정용 홈 (단독주택/빌라/개인)',
        Commercial: '아파트용 (공동주택/공용시설)',
        ParkingLot: '상업시설 수익형 (호텔/마트/상가빌딩)'
      },
      fields: DEFAULT_FIELDS
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
        { id: 'q-2', label: '아파트 충전', iconType: 'Building2', targetPage: 'solutions' },
        { id: 'q-3', label: '가정용 홈', iconType: 'Home', targetPage: 'solutions' },
        { id: 'q-4', label: '학교&관공서', iconType: 'GraduationCap', targetPage: 'solutions' },
        { id: 'q-5', label: '상업시설 수익형', iconType: 'ParkingCircle', targetPage: 'solutions' },
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
      case 'solutions':
      case 'sol_residential':
        return (
          <SolutionsSection 
            key="sol_residential"
            solutions={solutions}
            isEditMode={isEditMode}
            onOpenCms={handleOpenCmsTab}
            onOpenQuoteWithPurpose={handleOpenQuoteWithPurpose} 
            onPageChange={setActivePage}
            defaultActiveTab="Residential"
            selectedHomePower={selectedHomePower}
            onSelectHomePower={setSelectedHomePower}
          />
        );
      case 'sol_commercial':
        return (
          <SolutionsSection 
            key="sol_commercial"
            solutions={solutions}
            isEditMode={isEditMode}
            onOpenCms={handleOpenCmsTab}
            onOpenQuoteWithPurpose={handleOpenQuoteWithPurpose} 
            onPageChange={setActivePage}
            defaultActiveTab="Commercial"
            selectedAptBrand={selectedAptBrand}
            onSelectAptBrand={setSelectedAptBrand}
          />
        );
      case 'sol_parking':
        return (
          <SolutionsSection 
            key="sol_parking"
            solutions={solutions}
            isEditMode={isEditMode}
            onOpenCms={handleOpenCmsTab}
            onOpenQuoteWithPurpose={handleOpenQuoteWithPurpose} 
            onPageChange={setActivePage}
            defaultActiveTab="ParkingLot"
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
      {/* Spacer container to match the fixed Header height and prevent page content overlap */}
      <div className={`w-full shrink-0 ${
        activePage === 'sol_commercial' || activePage === 'sol_residential'
          ? 'h-[165px] sm:h-[180px] md:h-[190px] xl:h-[210px]'
          : 'h-[120px] sm:h-[135px] md:h-[145px] xl:h-[155px]'
      }`}>
        <Header
          user={user}
          activePage={activePage}
          onPageChange={setActivePage}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenMyPage={() => setIsMyPageOpen(true)}
          onOpenQuote={() => handleOpenQuoteWithPurpose('Residential')}
          onOpenQuoteWithPurpose={handleOpenQuoteWithPurpose}
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
          snsConfig={snsConfig}
          footerConfig={footerConfig}
          selectedAptBrand={selectedAptBrand}
          onSelectAptBrand={setSelectedAptBrand}
          selectedHomePower={selectedHomePower}
          onSelectHomePower={setSelectedHomePower}
        />



      </div>

      {/* Main Container */}
      <main className={`flex-grow w-full ${
        activePage === 'home' 
          ? 'py-0' 
          : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'
      }`}>
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
      <div className="bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-900 border-t border-emerald-700/40 py-5 px-4 shadow-xl text-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 shadow-lg">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-white leading-snug">
                "지금 신청하시면, 올해 마감 임박한 정부 보조금 혜택을 우선 선점해 드립니다."
              </p>
              <p className="text-[10px] sm:text-xs text-slate-300 font-bold mt-0.5">
                지자체 예산 소진 전 한전 불입금 무료 대행과 특허 세이프티 시공 패키지를 즉시 확보하세요.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenQuoteWithPurpose('Residential')}
            id="btn-footer-sticky-cta"
            className="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 active:scale-98 text-slate-950 rounded-xl text-xs sm:text-sm font-black transition-all text-center flex items-center justify-center gap-1 shrink-0 shadow-lg cursor-pointer"
          >
            👉 30초 만에 무료 설치 상담 예약하기
          </button>
        </div>
      </div>

      {/* Footer (Premium, honest, and highly clean) */}
      <footer className="bg-gradient-to-b from-[#0a2e21] to-[#041610] text-slate-200 py-12 border-t border-emerald-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Branding & description */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                {logoConfig.imageUrl ? (
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={logoConfig.imageUrl} 
                      alt={logoConfig.subtitle} 
                      className="h-8 max-w-[140px] object-contain brightness-0 invert opacity-95"
                      referrerPolicy="no-referrer"
                    />
                    {logoConfig.companyNameText && (
                      <span className="font-extrabold text-white text-sm sm:text-base tracking-tight pl-2.5 border-l border-emerald-800/80">
                        {logoConfig.companyNameText}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm tracking-tight">
                      {logoConfig.text}
                    </div>
                    <span className="font-extrabold text-white text-base tracking-tight">
                      {logoConfig.subtitle}
                    </span>
                    {logoConfig.companyNameText && (
                      <span className="font-medium text-slate-200 text-xs sm:text-sm tracking-tight pl-2.5 border-l border-emerald-800/80">
                        {logoConfig.companyNameText}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                {logoConfig.subtitle}은 대한민국 환경부 공식 대행 사업 파트너로서 친환경 과열감지 차단 기술 탑재 완속 및 초급속 충전기를 설계부터 국가보조금 지원까지 책임 시공합니다.
              </p>
              <div className="text-xs text-slate-300 space-y-1">
                <p><span className="text-slate-400">전국 통합 대표번호:</span> <span className="text-white font-bold">{footerConfig.phone}</span></p>
                <p><span className="text-slate-400">사업 제휴 메일:</span> <span className="text-white font-bold">{footerConfig.email}</span></p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider">주요 카테고리</h4>
              <ul className="text-xs space-y-2 text-left">
                <li><button onClick={() => setActivePage('about')} className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer">{categoryLabels.about || '회사소개'}</button></li>
                <li><button onClick={() => setActivePage('sol_commercial')} className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer">{categoryLabels.sol_commercial || '아파트'} 솔루션</button></li>
                <li><button onClick={() => setActivePage('sol_residential')} className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer">{categoryLabels.sol_residential || '가정용 홈'} 솔루션</button></li>
                <li><button onClick={() => setActivePage('sol_parking')} className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer">{categoryLabels.sol_parking || '상업시설 수익형'} 솔루션</button></li>
                <li><button onClick={() => setActivePage('review')} className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer">{categoryLabels.review || '설치후기'}</button></li>
                <li><button onClick={() => setActivePage('support')} className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer">고객지원</button></li>
              </ul>
            </div>

            {/* Legal and compliance footnotes */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider">회사 정보 및 면책 고지</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                <span className="text-slate-400">상호:</span> {footerConfig.companyName} | <span className="text-slate-400">대표이사:</span> {footerConfig.ceoName} | <span className="text-slate-400">사업자등록번호:</span> {footerConfig.businessNumber} <br />
                <span className="text-slate-400">주소:</span> {footerConfig.address} <br />
                <span className="text-slate-400">통신판매업신고번호:</span> {footerConfig.teleSalesNumber} <br />
                <span className="text-slate-400">{footerConfig.licenseInfo}</span>
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-emerald-900/30 text-center text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© 2026 {logoConfig.subtitle} Co., Ltd. All Rights Reserved.</p>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:text-emerald-400 hover:underline">개인정보처리방침</a>
              <a href="#terms" className="hover:text-emerald-400 hover:underline">이용약관</a>
              <a href="#standard" className="hover:text-emerald-400 hover:underline">한전 인입공사 표준</a>
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
            initialBrand={selectedAptBrand}
            initialHomePower={selectedHomePower}
            quoteConfig={quoteConfig}
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
            quoteConfig={quoteConfig}
            onSaveQuoteConfig={handleSaveQuoteConfig}
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
