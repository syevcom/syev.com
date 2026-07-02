/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Save, RotateCcw, Image as ImageIcon, Plus, Trash2, Check, Edit3, Settings, HelpCircle, FileText, Sparkles, Building, User, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Solution, Review, FAQ } from '../types';

interface CmsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  
  // Brand Logo and Menu Category configurations
  logoConfig: {
    text: string;
    subtitle: string;
    imageUrl: string;
    showCompanyName?: boolean;
    companyNameText?: string;
    companyNameFont?: string;
    companyNameWeight?: string;
    companyNameSize?: string;
    companyNameColor?: string;
  };
  onSaveLogoConfig: (config: any) => void;

  categoryLabels: {
    home: string;
    about: string;
    products: string;
    solutions: string;
    review: string;
    support: string;
  };
  onSaveCategoryLabels: (labels: any) => void;

  footerConfig: {
    phone: string;
    email: string;
    companyName: string;
    ceoName: string;
    businessNumber: string;
    address: string;
    teleSalesNumber: string;
    licenseInfo: string;
  };
  onSaveFooterConfig: (config: any) => void;

  snsConfig: {
    kakaoUrl: string;
    instagramUrl: string;
    blogUrl: string;
    showFloatingSns: boolean;
  };
  onSaveSnsConfig: (config: any) => void;

  quickMenuConfig: {
    showQuickMenu: boolean;
    items: Array<{ id: string; label: string; iconType: string; targetPage: any }>;
  };
  onSaveQuickMenuConfig: (config: any) => void;

  // States and setter props
  heroConfig: {
    badge: string;
    title: string;
    description: string;
    ctaButton: string;
    calcButton: string;
    imageUrl?: string;
    showHeroImage?: boolean;
    titleSize?: 'small' | 'medium' | 'large' | 'xlarge';
    descriptionSize?: 'small' | 'medium' | 'large';
    liveCountStart?: number;
    liveCountLabel?: string;
    liveCountSuffix?: string;
  };
  onSaveHeroConfig: (config: any) => void;

  aboutConfig: {
    ceoName: string;
    ceoRole: string;
    ceoGreeting: string;
    ceoMessage1: string;
    ceoMessage2: string;
    ceoMessage3: string;
    ceoImage: string;
  };
  onSaveAboutConfig: (config: any) => void;

  products: Product[];
  onSaveProducts: (products: Product[]) => void;

  solutions: Solution[];
  onSaveSolutions: (solutions: Solution[]) => void;

  reviews: Review[];
  onSaveReviews: (reviews: Review[]) => void;

  faqs: FAQ[];
  onSaveFaqs: (faqs: FAQ[]) => void;

  notices: any[];
  onSaveNotices: (notices: any[]) => void;

  onResetAll: () => void;
  initialTab?: 'brand' | 'hero' | 'about' | 'products' | 'solutions' | 'review' | 'support' | 'sync';
}

const CURATED_EV_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600', label: '완속 충전기 단독' },
  { url: 'https://images.unsplash.com/photo-1695653422718-97d137aac987?auto=format&fit=crop&q=80&w=600', label: '공용 주차장 충전' },
  { url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=600', label: '급속 주차 충전' },
  { url: 'https://images.unsplash.com/photo-1620859309999-ed665c53a1ed?auto=format&fit=crop&q=80&w=600', label: '초급속 충전소' },
  { url: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&q=80&w=600', label: '가정용 월박스' },
  { url: 'https://images.unsplash.com/photo-1521500857785-5a827418b62c?auto=format&fit=crop&q=80&w=600', label: '지하 주차 라인' },
  { url: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=600', label: '모던 고급 단독주택' },
  { url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=600', label: '상가 야외 주차장' }
];

const CURATED_CEO_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600', label: '남성 신뢰형 CEO' },
  { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600', label: '여성 세련된 CEO' },
  { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600', label: '캐주얼 테크형 CEO' }
];

function robustUrlDecode(s: string): string {
  let result = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '%') {
      const hex = s.substring(i + 1, i + 3);
      if (/^[0-9A-Fa-f]{2}$/.test(hex)) {
        try {
          result += decodeURIComponent('%' + hex);
        } catch (e) {
          result += s[i];
        }
        i += 2;
      } else {
        result += s[i];
      }
    } else {
      result += s[i];
    }
  }
  return result;
}

export default function CmsEditorModal({
  isOpen,
  onClose,
  logoConfig,
  onSaveLogoConfig,
  categoryLabels,
  onSaveCategoryLabels,
  footerConfig,
  onSaveFooterConfig,
  snsConfig,
  onSaveSnsConfig,
  quickMenuConfig,
  onSaveQuickMenuConfig,
  heroConfig,
  onSaveHeroConfig,
  aboutConfig,
  onSaveAboutConfig,
  products,
  onSaveProducts,
  solutions,
  onSaveSolutions,
  reviews,
  onSaveReviews,
  faqs,
  onSaveFaqs,
  notices,
  onSaveNotices,
  onResetAll,
  initialTab = 'brand'
}: CmsEditorModalProps) {
  const [activeTab, setActiveTab] = useState<typeof initialTab>(initialTab);
  const [saveStatus, setSaveStatus] = useState('');
  const [importCode, setImportCode] = useState('');

  // 0. Brand logo & Categories states
  const [logoText, setLogoText] = useState(logoConfig.text);
  const [logoSubtitle, setLogoSubtitle] = useState(logoConfig.subtitle);
  const [logoImageUrl, setLogoImageUrl] = useState(logoConfig.imageUrl || '');
  const [logoShowCompanyName, setLogoShowCompanyName] = useState(logoConfig.showCompanyName !== false);
  const [logoCompanyNameText, setLogoCompanyNameText] = useState(logoConfig.companyNameText || '');
  const [logoCompanyNameFont, setLogoCompanyNameFont] = useState(logoConfig.companyNameFont || 'noto');
  const [logoCompanyNameWeight, setLogoCompanyNameWeight] = useState(logoConfig.companyNameWeight || 'extrabold');
  const [logoCompanyNameSize, setLogoCompanyNameSize] = useState(logoConfig.companyNameSize || 'sm');
  const [logoCompanyNameColor, setLogoCompanyNameColor] = useState(logoConfig.companyNameColor || 'slate-700');
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isDraggingCeoImg, setIsDraggingCeoImg] = useState(false);
  const [isDraggingProdImg, setIsDraggingProdImg] = useState(false);
  const [isDraggingBeforeImg, setIsDraggingBeforeImg] = useState(false);
  const [isDraggingAfterImg, setIsDraggingAfterImg] = useState(false);
  const [isDraggingSolImage, setIsDraggingSolImage] = useState(false);
  const [isDraggingSolBlueprint, setIsDraggingSolBlueprint] = useState(false);
  const [isDraggingSolDetail, setIsDraggingSolDetail] = useState(false);

  const [menuHome, setMenuHome] = useState(categoryLabels.home);
  const [menuAbout, setMenuAbout] = useState(categoryLabels.about);
  const [menuProducts, setMenuProducts] = useState(categoryLabels.products);
  const [menuSolutions, setMenuSolutions] = useState(categoryLabels.solutions);
  const [menuReview, setMenuReview] = useState(categoryLabels.review);
  const [menuSupport, setMenuSupport] = useState(categoryLabels.support);

  // SNS State
  const [snsKakaoUrl, setSnsKakaoUrl] = useState(snsConfig.kakaoUrl || '');
  const [snsInstagramUrl, setSnsInstagramUrl] = useState(snsConfig.instagramUrl || '');
  const [snsBlogUrl, setSnsBlogUrl] = useState(snsConfig.blogUrl || '');
  const [snsShowFloating, setSnsShowFloating] = useState(snsConfig.showFloatingSns !== false);

  // Quick Menu State
  const [quickShowMenu, setQuickShowMenu] = useState(quickMenuConfig.showQuickMenu !== false);
  const [quickMenuItems, setQuickMenuItems] = useState(quickMenuConfig.items || []);

  // Footer State
  const [footerPhone, setFooterPhone] = useState(footerConfig.phone);
  const [footerEmail, setFooterEmail] = useState(footerConfig.email);
  const [footerCompanyName, setFooterCompanyName] = useState(footerConfig.companyName);
  const [footerCeoName, setFooterCeoName] = useState(footerConfig.ceoName);
  const [footerBusinessNumber, setFooterBusinessNumber] = useState(footerConfig.businessNumber);
  const [footerAddress, setFooterAddress] = useState(footerConfig.address);
  const [footerTeleSalesNumber, setFooterTeleSalesNumber] = useState(footerConfig.teleSalesNumber);
  const [footerLicenseInfo, setFooterLicenseInfo] = useState(footerConfig.licenseInfo);

  // 1. Hero Form State
  const [heroBadge, setHeroBadge] = useState(heroConfig.badge);
  const [heroTitle, setHeroTitle] = useState(heroConfig.title);
  const [heroDesc, setHeroDesc] = useState(heroConfig.description);
  const [heroCta, setHeroCta] = useState(heroConfig.ctaButton);
  const [heroCalc, setHeroCalc] = useState(heroConfig.calcButton);
  const [heroTitleSize, setHeroTitleSize] = useState(heroConfig.titleSize || 'large');
  const [heroDescriptionSize, setHeroDescriptionSize] = useState(heroConfig.descriptionSize || 'medium');
  const [heroLiveCountStart, setHeroLiveCountStart] = useState(heroConfig.liveCountStart || 14520);
  const [heroLiveCountLabel, setHeroLiveCountLabel] = useState(heroConfig.liveCountLabel || '현재 전국 SY.com 충전기 설치 현황');
  const [heroLiveCountSuffix, setHeroLiveCountSuffix] = useState(heroConfig.liveCountSuffix || '대 돌파');

  // 2. About Form State
  const [ceoName, setCeoName] = useState(aboutConfig.ceoName);
  const [ceoRole, setCeoRole] = useState(aboutConfig.ceoRole);
  const [ceoGreeting, setCeoGreeting] = useState(aboutConfig.ceoGreeting);
  const [ceoMsg1, setCeoMsg1] = useState(aboutConfig.ceoMessage1);
  const [ceoMsg2, setCeoMsg2] = useState(aboutConfig.ceoMessage2);
  const [ceoMsg3, setCeoMsg3] = useState(aboutConfig.ceoMessage3);
  const [ceoImg, setCeoImg] = useState(aboutConfig.ceoImage);

  // Sync state with props on open/change
  React.useEffect(() => {
    if (isOpen) {
      setLogoText(logoConfig.text);
      setLogoSubtitle(logoConfig.subtitle);
      setLogoImageUrl(logoConfig.imageUrl || '');
      setLogoShowCompanyName(logoConfig.showCompanyName !== false);
      setLogoCompanyNameText(logoConfig.companyNameText || '');
      setLogoCompanyNameFont(logoConfig.companyNameFont || 'noto');
      setLogoCompanyNameWeight(logoConfig.companyNameWeight || 'extrabold');
      setLogoCompanyNameSize(logoConfig.companyNameSize || 'sm');
      setLogoCompanyNameColor(logoConfig.companyNameColor || 'slate-700');

      setMenuHome(categoryLabels.home);
      setMenuAbout(categoryLabels.about);
      setMenuProducts(categoryLabels.products);
      setMenuSolutions(categoryLabels.solutions);
      setMenuReview(categoryLabels.review);
      setMenuSupport(categoryLabels.support);

      setSnsKakaoUrl(snsConfig.kakaoUrl || '');
      setSnsInstagramUrl(snsConfig.instagramUrl || '');
      setSnsBlogUrl(snsConfig.blogUrl || '');
      setSnsShowFloating(snsConfig.showFloatingSns !== false);

      setQuickShowMenu(quickMenuConfig.showQuickMenu !== false);
      setQuickMenuItems(quickMenuConfig.items || []);

      setFooterPhone(footerConfig.phone);
      setFooterEmail(footerConfig.email);
      setFooterCompanyName(footerConfig.companyName);
      setFooterCeoName(footerConfig.ceoName);
      setFooterBusinessNumber(footerConfig.businessNumber);
      setFooterAddress(footerConfig.address);
      setFooterTeleSalesNumber(footerConfig.teleSalesNumber);
      setFooterLicenseInfo(footerConfig.licenseInfo);

      setHeroBadge(heroConfig.badge);
      setHeroTitle(heroConfig.title);
      setHeroDesc(heroConfig.description);
      setHeroCta(heroConfig.ctaButton);
      setHeroCalc(heroConfig.calcButton);
      setHeroTitleSize(heroConfig.titleSize || 'large');
      setHeroDescriptionSize(heroConfig.descriptionSize || 'medium');
      setHeroLiveCountStart(heroConfig.liveCountStart || 14520);
      setHeroLiveCountLabel(heroConfig.liveCountLabel || '현재 전국 SY.com 충전기 설치 현황');
      setHeroLiveCountSuffix(heroConfig.liveCountSuffix || '대 돌파');

      setCeoName(aboutConfig.ceoName);
      setCeoRole(aboutConfig.ceoRole);
      setCeoGreeting(aboutConfig.ceoGreeting);
      setCeoMsg1(aboutConfig.ceoMessage1);
      setCeoMsg2(aboutConfig.ceoMessage2);
      setCeoMsg3(aboutConfig.ceoMessage3);
      setCeoImg(aboutConfig.ceoImage);
    }
  }, [isOpen, logoConfig, categoryLabels, footerConfig, snsConfig, quickMenuConfig, heroConfig, aboutConfig]);

  // 3. Products Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodType, setProdType] = useState<'완속' | '급속' | '초급속' | '스마트홈'>('완속');
  const [prodPower, setProdPower] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodPlc, setProdPlc] = useState(false);
  const [prodFeatures, setProdFeatures] = useState<string[]>([]);
  const [prodSpecs, setProdSpecs] = useState<{ [key: string]: string }>({});

  // 4. Solutions Form State
  const [editingSolutionId, setEditingSolutionId] = useState<string | null>(null);
  const [solTitle, setSolTitle] = useState('');
  const [solSubtitle, setSolSubtitle] = useState('');
  const [solDesc, setSolDesc] = useState('');
  const [solTarget, setSolTarget] = useState('');
  const [solPower, setSolPower] = useState('');
  const [solImage, setSolImage] = useState('');
  const [solBlueprintImageUrl, setSolBlueprintImageUrl] = useState('');
  const [solDetailImageUrl, setSolDetailImageUrl] = useState('');
  const [solBenefits, setSolBenefits] = useState<string[]>([]);

  // 5. Reviews Form State
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [revTitle, setRevTitle] = useState('');
  const [revLocation, setRevLocation] = useState('');
  const [revCategory, setRevCategory] = useState<'Commercial' | 'Residential' | 'ParkingLot'>('Residential');
  const [revRating, setRevRating] = useState(5);
  const [revAuthor, setRevAuthor] = useState('');
  const [revInterview, setRevInterview] = useState('');
  const [revDetails, setRevDetails] = useState('');
  const [revBeforeImg, setRevBeforeImg] = useState('');
  const [revAfterImg, setRevAfterImg] = useState('');
  const [revX, setRevX] = useState(50);
  const [revY, setRevY] = useState(50);

  // 6. FAQs Form State
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');
  const [faqCat, setFaqCat] = useState('보조금/비용');

  // 7. Notices Form State
  const [editingNoticeId, setEditingNoticeId] = useState<number | null>(null);
  const [notTitle, setNotTitle] = useState('');
  const [notDate, setNotDate] = useState('');
  const [notImp, setNotImp] = useState(false);

  if (!isOpen) return null;

  const showSaveSuccess = (message: string) => {
    setSaveStatus(message);
    setTimeout(() => setSaveStatus(''), 2500);
  };

  const handleSaveBrand = () => {
    onSaveLogoConfig({
      text: logoText,
      subtitle: logoSubtitle,
      imageUrl: logoImageUrl,
      showCompanyName: logoShowCompanyName,
      companyNameText: logoCompanyNameText,
      companyNameFont: logoCompanyNameFont,
      companyNameWeight: logoCompanyNameWeight,
      companyNameSize: logoCompanyNameSize,
      companyNameColor: logoCompanyNameColor
    });
    onSaveCategoryLabels({
      home: menuHome,
      about: menuAbout,
      products: menuProducts,
      solutions: menuSolutions,
      review: menuReview,
      support: menuSupport
    });
    onSaveFooterConfig({
      phone: footerPhone,
      email: footerEmail,
      companyName: footerCompanyName,
      ceoName: footerCeoName,
      businessNumber: footerBusinessNumber,
      address: footerAddress,
      teleSalesNumber: footerTeleSalesNumber,
      licenseInfo: footerLicenseInfo
    });
    onSaveSnsConfig({
      kakaoUrl: snsKakaoUrl,
      instagramUrl: snsInstagramUrl,
      blogUrl: snsBlogUrl,
      showFloatingSns: snsShowFloating
    });
    onSaveQuickMenuConfig({
      showQuickMenu: quickShowMenu,
      items: quickMenuItems
    });
    showSaveSuccess('⚙️ 브랜드 로고, 카테고리, 푸터 회사 정보 및 SNS, 퀵메뉴 설정이 즉시 저장되었습니다!');
  };

  const handleSaveHero = () => {
    onSaveHeroConfig({
      ...heroConfig,
      badge: heroBadge,
      title: heroTitle,
      description: heroDesc,
      ctaButton: heroCta,
      calcButton: heroCalc,
      titleSize: heroTitleSize,
      descriptionSize: heroDescriptionSize,
      liveCountStart: Number(heroLiveCountStart),
      liveCountLabel: heroLiveCountLabel,
      liveCountSuffix: heroLiveCountSuffix
    });
    showSaveSuccess('🏠 메인 히어로 텍스트, 크기 및 라이브 설치 현황 설정이 즉시 저장되었습니다!');
  };

  const handleSaveAbout = () => {
    onSaveAboutConfig({
      ceoName,
      ceoRole,
      ceoGreeting,
      ceoMessage1: ceoMsg1,
      ceoMessage2: ceoMsg2,
      ceoMessage3: ceoMsg3,
      ceoImage: ceoImg
    });
    showSaveSuccess('🏢 회사 소개 및 대표 인사말이 즉시 저장되었습니다!');
  };

  // Product actions
  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdType(p.type);
    setProdPower(p.power);
    setProdDesc(p.description);
    setProdImage(p.image);
    setProdPlc(p.plcSupported);
    setProdFeatures([...p.features]);
    setProdSpecs({ ...p.specs });
  };

  const handleUpdateProduct = () => {
    const updated = products.map((p) => {
      if (p.id === editingProductId) {
        return {
          ...p,
          name: prodName,
          type: prodType,
          power: prodPower,
          description: prodDesc,
          image: prodImage,
          plcSupported: prodPlc,
          features: prodFeatures,
          specs: prodSpecs
        };
      }
      return p;
    });
    onSaveProducts(updated);
    setEditingProductId(null);
    showSaveSuccess('⚡ 신제품 제품 정보가 완벽히 갱신되었습니다!');
  };

  // Solution actions
  const startEditSolution = (sol: Solution) => {
    setEditingSolutionId(sol.id);
    setSolTitle(sol.title);
    setSolSubtitle(sol.subtitle);
    setSolDesc(sol.description);
    setSolTarget(sol.target);
    setSolPower(sol.recommendedPower);
    setSolImage(sol.image);
    setSolBlueprintImageUrl(sol.blueprintImageUrl || '');
    setSolDetailImageUrl(sol.detailImageUrl || '');
    setSolBenefits([...sol.benefits]);
  };

  const handleUpdateSolution = () => {
    const updated = solutions.map((sol) => {
      if (sol.id === editingSolutionId) {
        return {
          ...sol,
          title: solTitle,
          subtitle: solSubtitle,
          description: solDesc,
          target: solTarget,
          recommendedPower: solPower,
          image: solImage,
          blueprintImageUrl: solBlueprintImageUrl,
          detailImageUrl: solDetailImageUrl,
          benefits: solBenefits
        };
      }
      return sol;
    });
    onSaveSolutions(updated);
    setEditingSolutionId(null);
    showSaveSuccess('🛠️ 솔루션 세부 데이터가 갱신되었습니다!');
  };

  // Review actions
  const startEditReview = (rev: Review) => {
    setEditingReviewId(rev.id);
    setRevTitle(rev.title);
    setRevLocation(rev.location);
    setRevCategory(rev.category);
    setRevRating(rev.rating);
    setRevAuthor(rev.author);
    setRevInterview(rev.interview);
    setRevDetails(rev.details);
    setRevBeforeImg(rev.beforeImg);
    setRevAfterImg(rev.afterImg);
    setRevX(rev.coordinates?.x ?? 50);
    setRevY(rev.coordinates?.y ?? 50);
  };

  const handleUpdateReview = () => {
    const updated = reviews.map((rev) => {
      if (rev.id === editingReviewId) {
        return {
          ...rev,
          title: revTitle,
          location: revLocation,
          category: revCategory,
          rating: revRating,
          author: revAuthor,
          interview: revInterview,
          details: revDetails,
          beforeImg: revBeforeImg,
          afterImg: revAfterImg,
          coordinates: { x: Number(revX), y: Number(revY) }
        };
      }
      return rev;
    });
    onSaveReviews(updated);
    setEditingReviewId(null);
    showSaveSuccess('📍 시공후기 지도 정보가 성공적으로 변경되었습니다!');
  };

  const handleAddReview = () => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      title: '새 시공 현장 후기 제목',
      location: '서울 강남구',
      category: 'Commercial',
      date: new Date().toISOString().slice(0, 10),
      rating: 5,
      beforeImg: 'https://images.unsplash.com/photo-1521500857785-5a827418b62c?auto=format&fit=crop&q=80&w=600',
      afterImg: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
      author: '홍길동 관리소장',
      interview: '새로 설치 후 전기차 타는 입주민들의 만족도가 아주 높습니다.',
      details: '완속 충전기 5대 신규 구축 및 안전 펜스 도장 완료',
      coordinates: { x: 35, y: 45 }
    };
    onSaveReviews([...reviews, newRev]);
    startEditReview(newRev);
    showSaveSuccess('➕ 새로운 시공 후기 항목이 생성되었습니다!');
  };

  const handleDeleteReview = (id: string) => {
    if (confirm('이 시공 후기를 정말 삭제하시겠습니까?')) {
      onSaveReviews(reviews.filter((r) => r.id !== id));
      if (editingReviewId === id) setEditingReviewId(null);
      showSaveSuccess('🗑️ 시공 후기가 성공적으로 삭제되었습니다.');
    }
  };

  // FAQ actions
  const startEditFaq = (faq: FAQ) => {
    setEditingFaqId(faq.id);
    setFaqQ(faq.question);
    setFaqA(faq.answer);
    setFaqCat(faq.category);
  };

  const handleUpdateFaq = () => {
    const updated = faqs.map((faq) => {
      if (faq.id === editingFaqId) {
        return { ...faq, question: faqQ, answer: faqA, category: faqCat };
      }
      return faq;
    });
    onSaveFaqs(updated);
    setEditingFaqId(null);
    showSaveSuccess('💬 FAQ 답변 데이터가 업데이트되었습니다!');
  };

  const handleAddFaq = () => {
    const newFaq: FAQ = {
      id: `faq-${Date.now()}`,
      question: '새 질문 내용을 입력해 주세요.',
      answer: '새 질문에 대한 상세 답변 내용을 작성해 주세요.',
      category: '보조금/비용'
    };
    onSaveFaqs([...faqs, newFaq]);
    startEditFaq(newFaq);
    showSaveSuccess('➕ 신규 FAQ 항목이 생성되었습니다!');
  };

  const handleDeleteFaq = (id: string) => {
    if (confirm('이 FAQ를 정말 삭제하시겠습니까?')) {
      onSaveFaqs(faqs.filter((f) => f.id !== id));
      if (editingFaqId === id) setEditingFaqId(null);
      showSaveSuccess('🗑️ FAQ가 삭제되었습니다.');
    }
  };

  // Notice actions
  const startEditNotice = (not: any) => {
    setEditingNoticeId(not.id);
    setNotTitle(not.title);
    setNotDate(not.date);
    setNotImp(not.important);
  };

  const handleUpdateNotice = () => {
    const updated = notices.map((not) => {
      if (not.id === editingNoticeId) {
        return { ...not, title: notTitle, date: notDate, important: notImp };
      }
      return not;
    });
    onSaveNotices(updated);
    setEditingNoticeId(null);
    showSaveSuccess('📢 공지사항이 수정되었습니다!');
  };

  const handleAddNotice = () => {
    const newNot = {
      id: Date.now(),
      title: '새로운 통합 공지사항 타이틀',
      date: new Date().toISOString().split('T')[0],
      important: false
    };
    onSaveNotices([newNot, ...notices]);
    startEditNotice(newNot);
    showSaveSuccess('➕ 신규 공지사항이 작성되었습니다!');
  };

  const handleDeleteNotice = (id: number) => {
    if (confirm('이 공지사항을 정말 삭제하시겠습니까?')) {
      onSaveNotices(notices.filter((n) => n.id !== id));
      if (editingNoticeId === id) setEditingNoticeId(null);
      showSaveSuccess('🗑️ 공지사항이 즉시 삭제되었습니다.');
    }
  };

  const handleRestoreDefault = () => {
    if (confirm('주의: 모든 에디터 편집 기록을 지우고 처음 SY.com의 고품격 기본 텍스트 및 이미지로 복원하시겠습니까?')) {
      onResetAll();
      showSaveSuccess('🔄 모든 홈페이지 콘텐츠가 초기값으로 복원되었습니다.');
      setTimeout(() => {
        onClose();
      }, 1000);
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
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
      />

      {/* Editor Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 20 }}
        transition={{ type: 'spring', duration: 0.4 }}
        id="cms-editor-modal"
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
      >
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
              <Settings className="w-5.5 h-5.5 text-blue-400 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight">SY.com 실시간 통합 홈페이지 에디터</h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  CMS Mode
                </span>
              </div>
              <p className="text-[11px] text-slate-350 font-bold mt-0.5">원하는 이미지를 Unsplash 클릭 한 번으로 고품격 EV 일러스트로 교체해 보세요!</p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="btn-cms-close"
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast Notification Bar */}
        <AnimatePresence>
          {saveStatus && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-emerald-50 border-b border-emerald-100 px-6 py-2.5 text-xs text-emerald-800 font-extrabold flex items-center gap-1.5 shrink-0"
            >
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveStatus}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto shrink-0 scrollbar-none px-6">
          {(['brand', 'hero', 'about', 'products', 'solutions', 'review', 'support', 'sync'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setEditingProductId(null);
                setEditingSolutionId(null);
                setEditingReviewId(null);
                setEditingFaqId(null);
                setEditingNoticeId(null);
              }}
              id={`tab-cms-${tab}`}
              className={`py-3.5 text-xs font-black border-b-2 transition-all mr-5 shrink-0 flex items-center gap-1 cursor-pointer ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-850'
              }`}
            >
              {tab === 'brand' && '⚙️ 로고 & 카테고리'}
              {tab === 'hero' && '🏠 메인 히어로'}
              {tab === 'about' && '🏢 회사 소개'}
              {tab === 'products' && '⚡ 신제품'}
              {tab === 'solutions' && '🛠️ 솔루션'}
              {tab === 'review' && '📍 후기 지도'}
              {tab === 'support' && '💬 FAQ & 공지'}
              {tab === 'sync' && '📲 기기간 동기화'}
            </button>
          ))}
          
          <button
            onClick={handleRestoreDefault}
            id="btn-cms-restore"
            className="ml-auto text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 py-3 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            전체 초기화 복원
          </button>
        </div>

        {/* Main Form Fields scroll box */}
        <div className="overflow-y-auto p-6 flex-grow bg-white text-slate-800">
          <AnimatePresence mode="wait">
            {/* 0. BRAND & CATEGORIES TAB */}
            {activeTab === 'brand' && (
              <motion.div
                key="tab-brand"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-xs font-black text-blue-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase">
                    <Settings className="w-4 h-4 text-blue-600" />
                    실시간 브랜드 로고 이미지 &amp; 텍스트 변경
                  </h4>
                  <p className="text-[11px] text-slate-500 font-bold mt-1.5 leading-relaxed">
                    홈페이지 상단 헤더와 하단 푸터에 노출되는 로고 문구 및 서브타이틀을 직접 변경할 수 있습니다. 로고에 텍스트 대신 회사 로고 전용 이미지 파일을 적용하려면 이미지 링크를 지정하세요.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">로고 대문자 영문/한글 약어 (예: SY)</label>
                      <input
                        type="text"
                        value={logoText}
                        onChange={(e) => setLogoText(e.target.value)}
                        placeholder="SY"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">로고 도메인/메인 브랜드명 (예: SY.com)</label>
                      <input
                        type="text"
                        value={logoSubtitle}
                        onChange={(e) => setLogoSubtitle(e.target.value)}
                        placeholder="SY.com"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <label className="block text-[11px] font-bold text-slate-700">대표 로고 이미지 설정 (업로드 또는 URL 링크)</label>
                    
                    {/* File Upload & Preview Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                      {/* Drag & Drop Area */}
                      <div className="md:col-span-8">
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingLogo(true);
                          }}
                          onDragLeave={() => setIsDraggingLogo(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingLogo(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) {
                              if (!file.type.startsWith('image/')) {
                                alert('이미지 파일만 업로드할 수 있습니다.');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setLogoImageUrl(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          onClick={() => document.getElementById('logo-file-input')?.click()}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
                            isDraggingLogo
                              ? 'border-blue-500 bg-blue-50/50'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="file"
                            id="logo-file-input"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setLogoImageUrl(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <Upload className="w-6 h-6 text-slate-400 mb-2" />
                          <p className="text-xs font-black text-slate-700">여기에 로고 이미지 파일을 드래그하거나 클릭하여 업로드</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">PNG, JPG, SVG, GIF 지원 (가로 비율 권장)</p>
                        </div>
                      </div>

                      {/* Preview Box */}
                      <div className="md:col-span-4 flex flex-col justify-center items-center p-4 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden min-h-[140px]">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest absolute top-2 left-2">PREVIEW</span>
                        {logoImageUrl ? (
                          <div className="flex flex-col items-center gap-2 w-full mt-2">
                            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 max-h-[70px] flex items-center justify-center">
                              <img
                                src={logoImageUrl}
                                alt="Logo Preview"
                                className="max-h-[50px] max-w-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setLogoImageUrl('')}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-650 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer border border-rose-150"
                            >
                              <Trash2 className="w-3 h-3" />
                              이미지 제거
                            </button>
                          </div>
                        ) : (
                          <div className="text-center text-slate-400 text-[11px] font-bold mt-2">
                            <ImageIcon className="w-5 h-5 mx-auto mb-1 opacity-40" />
                            <span>등록된 파일 없음</span>
                            <p className="text-[9px] text-slate-400 mt-0.5">기본 텍스트 로고 사용</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* URL Input Fallback */}
                    <div className="space-y-1 mt-2">
                      <label className="block text-[10px] font-bold text-slate-500">또는 로고 이미지 URL 직접 입력</label>
                      <input
                        type="text"
                        value={logoImageUrl}
                        onChange={(e) => setLogoImageUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-mono text-blue-600"
                      />
                      <span className="block text-[10px] text-slate-400 font-semibold mt-1">
                        ※ 이미지 파일을 업로드하면 자동으로 고화질 로컬 Base64 데이터로 인코딩되어 실시간으로 반영됩니다.
                      </span>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-2xl space-y-3 mt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-black text-blue-900">로고 옆 회사명 표시 설정</span>
                          <span className="block text-[10px] text-slate-500 font-bold">상단 헤더 로고 옆에 회사명을 함께 노출시킬지 설정합니다.</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={logoShowCompanyName} 
                            onChange={(e) => setLogoShowCompanyName(e.target.checked)} 
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      {logoShowCompanyName && (
                        <div className="space-y-4 pt-2 border-t border-blue-100">
                          <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-slate-600">노출할 회사명 텍스트</label>
                            <input
                              type="text"
                              value={logoCompanyNameText}
                              onChange={(e) => setLogoCompanyNameText(e.target.value)}
                              placeholder="주식회사 에스와이코리아"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-slate-600">글씨체 (폰트)</label>
                              <select
                                value={logoCompanyNameFont}
                                onChange={(e) => setLogoCompanyNameFont(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                              >
                                <option value="noto">Clean 고딕 (Noto Sans KR)</option>
                                <option value="nanumgothic">Soft 나눔고딕 (Nanum Gothic)</option>
                                <option value="gowun">Elegant 명조체 (Gowun Batang)</option>
                                <option value="songmyung">Classic 서예체 (Song Myung)</option>
                                <option value="dohyeon">Bold 배달의민족 도현체 (Do Hyeon)</option>
                                <option value="blackhan">Display 블랙한산스 (Black Han Sans)</option>
                                <option value="sans">기본 시스템 폰트 (Sans-serif)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-slate-600">글씨 두께 (굵기)</label>
                              <select
                                value={logoCompanyNameWeight}
                                onChange={(e) => setLogoCompanyNameWeight(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                              >
                                <option value="normal">Normal (가늘게)</option>
                                <option value="medium">Medium (보통)</option>
                                <option value="semibold">Semibold (약간 두껍게)</option>
                                <option value="bold">Bold (두껍게)</option>
                                <option value="extrabold">Extrabold (매우 두껍게)</option>
                                <option value="black">Black (가장 두껍게)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-slate-600">글씨 크기 (사이즈)</label>
                              <select
                                value={logoCompanyNameSize}
                                onChange={(e) => setLogoCompanyNameSize(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                              >
                                <option value="xs">XS (가장 작게 - 12px)</option>
                                <option value="sm">SM (표준 - 14px)</option>
                                <option value="base">BASE (약간 크게 - 16px)</option>
                                <option value="lg">LG (크게 - 18px)</option>
                                <option value="xl">XL (아주 크게 - 20px)</option>
                                <option value="2xl">2XL (극대화 - 24px)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-slate-600">글씨 색상 (컬러)</label>
                              <select
                                value={logoCompanyNameColor}
                                onChange={(e) => setLogoCompanyNameColor(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                              >
                                <option value="slate-700">Slate Gray (중후한 회색)</option>
                                <option value="slate-900">Charcoal Dark (세련된 차콜블랙)</option>
                                <option value="blue-600">Electric Blue (활기찬 블루)</option>
                                <option value="blue-900">Deep Ocean (신뢰의 남색)</option>
                                <option value="indigo-700">Premium Indigo (품격있는 자줏빛인디고)</option>
                                <option value="emerald-700">Eco Green (친환경 녹색)</option>
                                <option value="red-600">Active Red (강렬한 붉은색)</option>
                              </select>
                            </div>
                          </div>

                          {/* Live Preview Font Demonstration in CMS Editor Modal */}
                          <div className="bg-slate-100/60 p-3 rounded-xl border border-slate-200/50 space-y-1 text-center">
                            <span className="text-[10px] text-slate-400 font-bold block">글씨체 설정 실시간 미리보기 (Live Preview)</span>
                            <span className={`inline-block ${
                              logoCompanyNameFont === 'noto' ? 'font-noto' :
                              logoCompanyNameFont === 'gowun' ? 'font-gowun' :
                              logoCompanyNameFont === 'dohyeon' ? 'font-dohyeon' :
                              logoCompanyNameFont === 'blackhan' ? 'font-blackhan' :
                              logoCompanyNameFont === 'songmyung' ? 'font-songmyung' :
                              logoCompanyNameFont === 'nanumgothic' ? 'font-nanumgothic' : 'font-sans'
                            } ${
                              logoCompanyNameWeight === 'normal' ? 'font-normal' :
                              logoCompanyNameWeight === 'medium' ? 'font-medium' :
                              logoCompanyNameWeight === 'semibold' ? 'font-semibold' :
                              logoCompanyNameWeight === 'bold' ? 'font-bold' :
                              logoCompanyNameWeight === 'extrabold' ? 'font-extrabold' :
                              logoCompanyNameWeight === 'black' ? 'font-black' : 'font-extrabold'
                            } ${
                              logoCompanyNameSize === 'xs' ? 'text-xs' :
                              logoCompanyNameSize === 'sm' ? 'text-sm' :
                              logoCompanyNameSize === 'base' ? 'text-base' :
                              logoCompanyNameSize === 'lg' ? 'text-lg' :
                              logoCompanyNameSize === 'xl' ? 'text-xl' :
                              logoCompanyNameSize === '2xl' ? 'text-2xl' : 'text-sm'
                            } ${
                              logoCompanyNameColor === 'slate-900' ? 'text-slate-900' :
                              logoCompanyNameColor === 'blue-600' ? 'text-blue-600' :
                              logoCompanyNameColor === 'blue-900' ? 'text-blue-900' :
                              logoCompanyNameColor === 'indigo-700' ? 'text-indigo-700' :
                              logoCompanyNameColor === 'emerald-700' ? 'text-emerald-700' :
                              logoCompanyNameColor === 'red-600' ? 'text-red-600' : 'text-slate-700'
                            }`}>
                              {logoCompanyNameText || '회사명 테스트'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-black text-blue-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase">
                    <X className="w-4 h-4 text-blue-600 rotate-45" />
                    메인 메뉴 카테고리 탭 이름 사용자 정의 (6대 핵심 메뉴)
                  </h4>
                  <p className="text-[11px] text-slate-500 font-bold mt-1.5 leading-relaxed">
                    상단 내비게이션 탭의 각 카테고리 메뉴명을 비즈니스 특성에 맞게 원하는 대로 리네이밍할 수 있습니다.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">메뉴 1: 메인 홈</label>
                      <input
                        type="text"
                        value={menuHome}
                        onChange={(e) => setMenuHome(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">메뉴 2: 회사 소개</label>
                      <input
                        type="text"
                        value={menuAbout}
                        onChange={(e) => setMenuAbout(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">메뉴 3: 신제품소개 (Products)</label>
                      <input
                        type="text"
                        value={menuProducts}
                        onChange={(e) => setMenuProducts(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">메뉴 4: 용도별솔루션 (Solutions)</label>
                      <input
                        type="text"
                        value={menuSolutions}
                        onChange={(e) => setMenuSolutions(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">메뉴 5: 설치후기 (Reviews)</label>
                      <input
                        type="text"
                        value={menuReview}
                        onChange={(e) => setMenuReview(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">메뉴 6: 고객지원 (Support)</label>
                      <input
                        type="text"
                        value={menuSupport}
                        onChange={(e) => setMenuSupport(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-black text-blue-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase">
                    <Building className="w-4 h-4 text-blue-600" />
                    홈페이지 하단 회사 정보 및 푸터(Footer) 설정
                  </h4>
                  <p className="text-[11px] text-slate-500 font-bold mt-1.5 leading-relaxed">
                    홈페이지 맨 아래(Footer) 영역에 노출되는 사업자 정보, 상호, 대표자명, 주소, 대표전화 및 이메일 정보를 실시간으로 수정할 수 있습니다.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">상호명 / 회사명</label>
                      <input
                        type="text"
                        value={footerCompanyName}
                        onChange={(e) => setFooterCompanyName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">대표이사 이름</label>
                      <input
                        type="text"
                        value={footerCeoName}
                        onChange={(e) => setFooterCeoName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">사업자 등록번호</label>
                      <input
                        type="text"
                        value={footerBusinessNumber}
                        onChange={(e) => setFooterBusinessNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">전국 대표 전화번호</label>
                      <input
                        type="text"
                        value={footerPhone}
                        onChange={(e) => setFooterPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">사업 제휴 이메일 주소</label>
                      <input
                        type="text"
                        value={footerEmail}
                        onChange={(e) => setFooterEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">통신판매업 신고번호</label>
                      <input
                        type="text"
                        value={footerTeleSalesNumber}
                        onChange={(e) => setFooterTeleSalesNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-600">회사 본사 소재지 주소</label>
                      <input
                        type="text"
                        value={footerAddress}
                        onChange={(e) => setFooterAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2 md:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-600">전기공사업 면허 정보 및 하단 법적 고지 문구</label>
                      <textarea
                        value={footerLicenseInfo}
                        onChange={(e) => setFooterLicenseInfo(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 leading-normal"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-black text-blue-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase">
                    <Save className="w-4 h-4 text-blue-600" />
                    우측 플로팅 소셜 미디어(SNS) 연동 설정
                  </h4>
                  <p className="text-[11px] text-slate-500 font-bold mt-1.5 leading-relaxed">
                    화면 오른쪽에 고정되는 플로팅 카카오톡 상담, 인스타그램 링크, 네이버 블로그 링크를 실시간으로 직접 수정할 수 있습니다.
                  </p>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-4 mt-3">
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                      <div>
                        <span className="block text-xs font-black text-slate-800">우측 플로팅 SNS 버튼 노출</span>
                        <span className="block text-[10px] text-slate-500 font-bold">화면 우측에 소셜 미디어 플로팅 링크 바를 띄울지 결정합니다.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={snsShowFloating} 
                          onChange={(e) => setSnsShowFloating(e.target.checked)} 
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {snsShowFloating && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-600 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                            카카오톡 상담 링크 URL
                          </label>
                          <input
                            type="text"
                            value={snsKakaoUrl}
                            onChange={(e) => setSnsKakaoUrl(e.target.value)}
                            placeholder="https://pf.kakao.com/..."
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-700"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-600 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                            인스타그램 링크 URL
                          </label>
                          <input
                            type="text"
                            value={snsInstagramUrl}
                            onChange={(e) => setSnsInstagramUrl(e.target.value)}
                            placeholder="https://www.instagram.com/..."
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-700"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-600 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            네이버 블로그 링크 URL
                          </label>
                          <input
                            type="text"
                            value={snsBlogUrl}
                            onChange={(e) => setSnsBlogUrl(e.target.value)}
                            placeholder="https://blog.naver.com/..."
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-700"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-black text-blue-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase">
                    <Settings className="w-4 h-4 text-blue-600" />
                    서비스 간편 8대 목차 바로가기(퀵메뉴) 아이콘 및 문구 수정
                  </h4>
                  <p className="text-[11px] text-slate-500 font-bold mt-1.5 leading-relaxed">
                    메인 히어로 아래 노출되는 8가지 동그란 아이콘 형태의 바로가기 메뉴의 문구, 아이콘 디자인, 그리고 클릭 시 연결할 이동 탭 정보를 직접 설정할 수 있습니다.
                  </p>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-4 mt-3">
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                      <div>
                        <span className="block text-xs font-black text-slate-800">간편 퀵메뉴 영역 노출</span>
                        <span className="block text-[10px] text-slate-500 font-bold">메인 화면에 원형 간편 목차 바로가기 영역을 띄울지 결정합니다.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={quickShowMenu} 
                          onChange={(e) => setQuickShowMenu(e.target.checked)} 
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {quickShowMenu && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          {quickMenuItems.map((item, idx) => (
                            <div key={item.id} className="bg-white border border-slate-200/80 p-3 rounded-xl space-y-2">
                              <span className="text-[10px] font-black text-blue-600 font-mono">ITEM {idx + 1}</span>
                              
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-500">메뉴 노출 이름</label>
                                <input
                                  type="text"
                                  value={item.label}
                                  onChange={(e) => {
                                    const updated = [...quickMenuItems];
                                    updated[idx] = { ...item, label: e.target.value };
                                    setQuickMenuItems(updated);
                                  }}
                                  className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-500">아이콘 모양 선택</label>
                                <select
                                  value={item.iconType}
                                  onChange={(e) => {
                                    const updated = [...quickMenuItems];
                                    updated[idx] = { ...item, iconType: e.target.value };
                                    setQuickMenuItems(updated);
                                  }}
                                  className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                                >
                                  <option value="MapPin">📍 설치후기 (MapPin)</option>
                                  <option value="Building2">🏢 기업용 충전 (Building2)</option>
                                  <option value="Home">🏠 주택 비공용 (Home)</option>
                                  <option value="GraduationCap">🎓 학교/기관 (GraduationCap)</option>
                                  <option value="ParkingCircle">🅿️ 주차장 충전 (ParkingCircle)</option>
                                  <option value="Zap">⚡ 급속충전 (Zap)</option>
                                  <option value="RefreshCw">🔄 기기교체 (RefreshCw)</option>
                                  <option value="TrendingUp">📈 홍보수익형 (TrendingUp)</option>
                                  <option value="Phone">📞 전화상담 (Phone)</option>
                                  <option value="Wrench">🔧 정비관리 (Wrench)</option>
                                  <option value="ShieldCheck">🛡️ 품질보증 (ShieldCheck)</option>
                                  <option value="Sparkles">✨ 혜택/뱃지 (Sparkles)</option>
                                  <option value="Landmark">🏛️ 관공서 (Landmark)</option>
                                  <option value="Calculator">🧮 견적계산 (Calculator)</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-500">클릭 시 연결 탭</label>
                                <select
                                  value={item.targetPage}
                                  onChange={(e) => {
                                    const updated = [...quickMenuItems];
                                    updated[idx] = { ...item, targetPage: e.target.value };
                                    setQuickMenuItems(updated);
                                  }}
                                  className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                                >
                                  <option value="home">메인 홈</option>
                                  <option value="about">회사 소개</option>
                                  <option value="products">신제품소개</option>
                                  <option value="solutions">용도별솔루션</option>
                                  <option value="review">설치후기</option>
                                  <option value="support">고객지원</option>
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleSaveBrand}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/10"
                  >
                    <Save className="w-4 h-4" />
                    대표 로고, 회사명, SNS, 퀵메뉴 설정 저장
                  </button>
                </div>
              </motion.div>
            )}

            {/* 1. HERO TAB */}
            {activeTab === 'hero' && (
              <motion.div
                key="tab-hero"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="space-y-4"
              >
                <h4 className="text-xs font-black text-blue-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  메인 히어로 영역 텍스트 편집
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">히어로 상단 미니 뱃지 문구</label>
                    <input
                      type="text"
                      value={heroBadge}
                      onChange={(e) => setHeroBadge(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">메인 무료 상담 예약 버튼 문구</label>
                    <input
                      type="text"
                      value={heroCta}
                      onChange={(e) => setHeroCta(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">메인 대형 메인 카피 타이틀 (HTML 지원)</label>
                  <textarea
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">상세 설명 서브 단락 카피</label>
                  <textarea
                    value={heroDesc}
                    onChange={(e) => setHeroDesc(e.target.value)}
                    rows={3.5}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">보조금 간편 계산 버튼 문구</label>
                  <input
                    type="text"
                    value={heroCalc}
                    onChange={(e) => setHeroCalc(e.target.value)}
                    className="w-full max-w-md px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                {/* 1-1. HERO TEXT SIZES */}
                <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl space-y-3 mt-4">
                  <span className="block text-xs font-black text-amber-900 flex items-center gap-1">
                    🔍 글자 크기 (사이즈) 미세 조절 설정
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">메인 타이틀(제목) 글씨 크기</label>
                      <select
                        value={heroTitleSize}
                        onChange={(e) => setHeroTitleSize(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                      >
                        <option value="small">작게 (Small - 모바일에서 아담하게 노출)</option>
                        <option value="medium">보통 (Medium - 단정하고 깔끔한 느낌)</option>
                        <option value="large">크게 (Large - 웅장한 기본 크기)</option>
                        <option value="xlarge">매우 크게 (X-Large - 시원시원한 극대화 크기)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">상세 설명 서브 단락 글씨 크기</label>
                      <select
                        value={heroDescriptionSize}
                        onChange={(e) => setHeroDescriptionSize(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                      >
                        <option value="small">작게 (Small)</option>
                        <option value="medium">보통 (Medium - 기본값)</option>
                        <option value="large">크게 (Large)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 1-2. HERO LIVE COUNTER STATUS */}
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl space-y-3 mt-4">
                  <span className="block text-xs font-black text-blue-900 flex items-center gap-1.5">
                    📊 우측 라이브(LIVE) 설치현황 숫자 및 문구 직접 수정
                  </span>
                  <p className="text-[10px] text-slate-500 font-bold leading-normal">
                    전국 충전기 설치현황 전산 집계 수치의 실시간 시작값과 해당 영역의 문구들을 변경할 수 있습니다.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">누적 설치 시작 숫자 (숫자만 입력)</label>
                      <input
                        type="number"
                        value={heroLiveCountStart}
                        onChange={(e) => setHeroLiveCountStart(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-blue-700"
                        placeholder="14520"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600">설치 현황 안내 타이틀</label>
                      <input
                        type="text"
                        value={heroLiveCountLabel}
                        onChange={(e) => setHeroLiveCountLabel(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        placeholder="현재 전국 SY.com 충전기 설치 현황"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">수치 뒤 돌파 문구</label>
                      <input
                        type="text"
                        value={heroLiveCountSuffix}
                        onChange={(e) => setHeroLiveCountSuffix(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        placeholder="대 돌파"
                      />
                    </div>

                    {/* Quick Live Preview inside CMS */}
                    <div className="bg-slate-100/60 p-2.5 rounded-xl border border-slate-200/50 flex flex-col items-center justify-center text-center space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold">라이브 카운터 실시간 미리보기 (Live Preview)</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black bg-slate-900 text-white px-2.5 py-0.5 rounded font-mono">
                          {heroLiveCountStart}
                        </span>
                        <span className="text-xs font-extrabold text-slate-700">
                          {heroLiveCountSuffix || '대 돌파'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={handleSaveHero}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/10"
                  >
                    <Save className="w-4 h-4" />
                    히어로 설정 변경 즉시 저장
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. ABOUT TAB */}
            {activeTab === 'about' && (
              <motion.div
                key="tab-about"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="space-y-4"
              >
                <h4 className="text-xs font-black text-blue-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase">
                  <User className="w-4 h-4 text-blue-600" />
                  대표자 인사말 및 소개 이미지 수정
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">CEO 이름</label>
                      <input
                        type="text"
                        value={ceoName}
                        onChange={(e) => setCeoName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">CEO 직함 및 이력</label>
                      <input
                        type="text"
                        value={ceoRole}
                        onChange={(e) => setCeoRole(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[11px] font-bold text-slate-700">대표자 사진 설정 (업로드 또는 URL 링크)</label>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                      {/* Drag & Drop Area */}
                      <div className="md:col-span-8">
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingCeoImg(true);
                          }}
                          onDragLeave={() => setIsDraggingCeoImg(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingCeoImg(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) {
                              if (!file.type.startsWith('image/')) {
                                alert('이미지 파일만 업로드할 수 있습니다.');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setCeoImg(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          onClick={() => document.getElementById('ceo-file-input')?.click()}
                          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[120px] ${
                            isDraggingCeoImg
                              ? 'border-blue-500 bg-blue-50/50'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="file"
                            id="ceo-file-input"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setCeoImg(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <Upload className="w-5 h-5 text-slate-400 mb-1" />
                          <p className="text-[11px] font-black text-slate-700">대표자 사진 드래그 또는 클릭 업로드</p>
                          <p className="text-[9px] text-slate-400 font-bold mt-0.5">PNG, JPG, JPEG 지원</p>
                        </div>
                      </div>

                      {/* Preview Box */}
                      <div className="md:col-span-4 flex flex-col justify-center items-center p-3 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden min-h-[120px]">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest absolute top-1.5 left-1.5">PREVIEW</span>
                        {ceoImg ? (
                          <div className="flex flex-col items-center gap-1.5 w-full mt-2">
                            <img
                              src={ceoImg}
                              alt="CEO Preview"
                              className="max-h-[60px] max-w-[100px] object-cover rounded-lg border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                            <button
                              type="button"
                              onClick={() => setCeoImg('')}
                              className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-650 rounded-lg text-[9px] font-black transition-all flex items-center gap-1 cursor-pointer border border-rose-150"
                            >
                              제거
                            </button>
                          </div>
                        ) : (
                          <div className="text-center text-slate-400 text-[10px] font-bold mt-2">
                            <ImageIcon className="w-4 h-4 mx-auto mb-1 opacity-40" />
                            <span>등록 없음</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500">직접 입력 / 프리셋 선택</label>
                      <input
                        type="text"
                        value={ceoImg}
                        onChange={(e) => setCeoImg(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-blue-600 font-mono"
                      />
                      <div className="flex gap-1.5 pt-1 overflow-x-auto scrollbar-none">
                        {CURATED_CEO_IMAGES.map((img) => (
                          <button
                            key={img.url}
                            type="button"
                            onClick={() => setCeoImg(img.url)}
                            className={`p-1 border rounded-lg overflow-hidden shrink-0 transition-all ${
                              ceoImg === img.url ? 'border-blue-600 ring-2 ring-blue-600/10' : 'border-slate-200'
                            }`}
                          >
                            <img src={img.url} alt={img.label} className="w-12 h-8 object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">인사말 대표 캐치프레이즈 인용구</label>
                  <input
                    type="text"
                    value={ceoGreeting}
                    onChange={(e) => setCeoGreeting(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[11px] font-bold text-slate-700">인사말 장문 단락 (3단락 구성)</label>
                  <textarea
                    value={ceoMsg1}
                    onChange={(e) => setCeoMsg1(e.target.value)}
                    rows={2.5}
                    placeholder="단락 1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                  <textarea
                    value={ceoMsg2}
                    onChange={(e) => setCeoMsg2(e.target.value)}
                    rows={2.5}
                    placeholder="단락 2"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                  <textarea
                    value={ceoMsg3}
                    onChange={(e) => setCeoMsg3(e.target.value)}
                    rows={2.5}
                    placeholder="단락 3 (마무리 및 서명)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="pt-3">
                  <button
                    onClick={handleSaveAbout}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/10"
                  >
                    <Save className="w-4 h-4" />
                    회사 소개 및 인사말 저장하기
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. PRODUCTS TAB */}
            {activeTab === 'products' && (
              <motion.div
                key="tab-products"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="space-y-5"
              >
                {!editingProductId ? (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">신제품 충전기 라인업 관리</h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {products.map((p) => (
                        <div
                          key={p.id}
                          className="p-3.5 rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-slate-200/50" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-black">{p.type}</span>
                                <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded font-extrabold">{p.power}</span>
                              </div>
                              <h5 className="text-xs font-black text-slate-900 mt-1 truncate">{p.name}</h5>
                            </div>
                          </div>

                          <button
                            onClick={() => startEditProduct(p)}
                            className="px-3.5 py-1.5 border border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            상세 편집 / 이미지 수정
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 p-4 border border-blue-100 bg-blue-50/5 rounded-2xl">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h5 className="text-xs font-black text-blue-800 uppercase">⚡ 신제품 상세 프로필 편집</h5>
                      <button
                        onClick={() => setEditingProductId(null)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600"
                      >
                        돌아가기
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700">기기명 (모델명)</label>
                        <input
                          type="text"
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-700">구분 타입</label>
                          <select
                            value={prodType}
                            onChange={(e) => setProdType(e.target.value as any)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                          >
                            <option value="완속">완속</option>
                            <option value="급속">급속</option>
                            <option value="초급속">초급속</option>
                            <option value="스마트홈">스마트홈</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-700">출력 전력</label>
                          <input
                            type="text"
                            value={prodPower}
                            onChange={(e) => setProdPower(e.target.value)}
                            placeholder="예: 7kW, 11kW, 200kW"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="block text-[11px] font-bold text-slate-700">충전기 사진 설정 (업로드 또는 URL 링크)</label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                          {/* Drag & Drop Area */}
                          <div className="md:col-span-8">
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDraggingProdImg(true);
                              }}
                              onDragLeave={() => setIsDraggingProdImg(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDraggingProdImg(false);
                                const file = e.dataTransfer.files?.[0];
                                if (file) {
                                  if (!file.type.startsWith('image/')) {
                                    alert('이미지 파일만 업로드할 수 있습니다.');
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setProdImage(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              onClick={() => document.getElementById('prod-file-input')?.click()}
                              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[110px] ${
                                isDraggingProdImg
                                  ? 'border-blue-500 bg-blue-50/50'
                                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300'
                              }`}
                            >
                              <input
                                type="file"
                                id="prod-file-input"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setProdImage(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <Upload className="w-5 h-5 text-slate-400 mb-1" />
                              <p className="text-[11px] font-black text-slate-700">충전기 사진 드래그 또는 클릭 업로드</p>
                              <p className="text-[9px] text-slate-400 font-bold mt-0.5">PNG, JPG, JPEG 지원</p>
                            </div>
                          </div>

                          {/* Preview Box */}
                          <div className="md:col-span-4 flex flex-col justify-center items-center p-2.5 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden min-h-[110px]">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest absolute top-1.5 left-1.5">PREVIEW</span>
                            {prodImage ? (
                              <div className="flex flex-col items-center gap-1 w-full mt-2">
                                <img
                                  src={prodImage}
                                  alt="Product Preview"
                                  className="max-h-[50px] max-w-[80px] object-cover rounded-lg border border-slate-200"
                                  referrerPolicy="no-referrer"
                                />
                                <button
                                  type="button"
                                  onClick={() => setProdImage('')}
                                  className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-650 rounded-lg text-[9px] font-black transition-all flex items-center gap-1 cursor-pointer border border-rose-150"
                                >
                                  제거
                                </button>
                              </div>
                            ) : (
                              <div className="text-center text-slate-400 text-[10px] font-bold mt-2">
                                <ImageIcon className="w-4 h-4 mx-auto mb-1 opacity-40" />
                                <span>등록 없음</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-500">URL 직접 입력 / Unsplash 프리셋 선택</label>
                          <input
                            type="text"
                            value={prodImage}
                            onChange={(e) => setProdImage(e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-blue-600 font-mono"
                          />
                          <div className="grid grid-cols-4 gap-1.5 pt-1">
                            {CURATED_EV_IMAGES.map((item, idx) => (
                              <button
                                key={idx}
                                type="button"
                                title={item.label}
                                onClick={() => setProdImage(item.url)}
                                className={`h-10 rounded-lg border overflow-hidden shrink-0 relative transition-all ${
                                  prodImage === item.url ? 'border-blue-600 ring-2 ring-blue-600/15' : 'border-slate-200'
                                }`}
                              >
                                <img src={item.url} alt="preset" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3.5 pt-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={prodPlc}
                            onChange={(e) => setProdPlc(e.target.checked)}
                            id="chk-prod-plc"
                            className="w-4 h-4 text-blue-600 rounded border-slate-200 focus:ring-blue-500"
                          />
                          <label htmlFor="chk-prod-plc" className="text-xs font-bold text-slate-800">
                            환경부 화재 감지용 핵심 PLC 모뎀 탑재 모델 여부
                          </label>
                        </div>
                        
                        <p className="text-[10.5px] text-slate-400 leading-normal font-medium">
                          * PLC 모뎀 탑재 충전기는 충전 중인 전기차 내부의 BMS 데이터와 실시간 온도 통신을 수행하여 만충 전 전력을 자동 차단하는 최신 화재 예방 시스템입니다.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">충전기 상세 홍보 설명 문구</label>
                      <textarea
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        rows={2.5}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold leading-relaxed"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingProductId(null)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdateProduct}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black cursor-pointer shadow-md"
                      >
                        기기 변경 사항 적용
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 4. SOLUTIONS TAB */}
            {activeTab === 'solutions' && (
              <motion.div
                key="tab-solutions"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="space-y-4"
              >
                {!editingSolutionId ? (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">용도별 맞춤 전용 솔루션 편집</h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {solutions.map((sol) => (
                        <div
                          key={sol.id}
                          className="p-3.5 rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={sol.image} alt={sol.title} className="w-12 h-12 object-cover rounded-xl border border-slate-200/50" />
                            <div className="min-w-0">
                              <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded font-bold">{sol.category}</span>
                              <h5 className="text-xs font-black text-slate-900 mt-1 truncate">{sol.title}</h5>
                            </div>
                          </div>

                          <button
                            onClick={() => startEditSolution(sol)}
                            className="px-3.5 py-1.5 border border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            카드 및 이미지 편집
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 p-4 border border-blue-100 bg-blue-50/5 rounded-2xl">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h5 className="text-xs font-black text-blue-800 uppercase">🛠️ 솔루션 카드 상세 정보 편집</h5>
                      <button
                        onClick={() => setEditingSolutionId(null)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600"
                      >
                        돌아가기
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700">솔루션 대제목</label>
                        <input
                          type="text"
                          value={solTitle}
                          onChange={(e) => setSolTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700">서브 타이틀 / 주요 대상</label>
                        <input
                          type="text"
                          value={solSubtitle}
                          onChange={(e) => setSolSubtitle(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700">권장 충전 용량 사양</label>
                        <input
                          type="text"
                          value={solPower}
                          onChange={(e) => setSolPower(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700">주요 타겟 건축 공간</label>
                        <input
                          type="text"
                          value={solTarget}
                          onChange={(e) => setSolTarget(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>

                    {/* Representative Site Image Upload & Preview Section */}
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <label className="block text-[11px] font-bold text-slate-700">대표 현장 이미지 설정 (업로드 또는 URL 링크)</label>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                        {/* Drag & Drop Area */}
                        <div className="md:col-span-8">
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDraggingSolImage(true);
                            }}
                            onDragLeave={() => setIsDraggingSolImage(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDraggingSolImage(false);
                              const file = e.dataTransfer.files?.[0];
                              if (file) {
                                if (!file.type.startsWith('image/')) {
                                  alert('이미지 파일만 업로드할 수 있습니다.');
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setSolImage(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            onClick={() => document.getElementById('sol-img-file-input')?.click()}
                            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[120px] ${
                              isDraggingSolImage
                                ? 'border-blue-500 bg-blue-50/50'
                                : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="file"
                              id="sol-img-file-input"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setSolImage(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <Upload className="w-5 h-5 text-slate-400 mb-1" />
                            <p className="text-[11px] font-black text-slate-700">대표 현장 이미지 드래그 또는 클릭 업로드</p>
                            <p className="text-[9px] text-slate-400 font-bold mt-0.5">PNG, JPG, JPEG 지원</p>
                          </div>
                        </div>

                        {/* Preview Box */}
                        <div className="md:col-span-4 flex flex-col justify-center items-center p-3 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden min-h-[120px]">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest absolute top-1.5 left-1.5">PREVIEW</span>
                          {solImage ? (
                            <div className="flex flex-col items-center gap-1.5 w-full mt-2">
                              <img
                                src={solImage}
                                alt="Sol Image Preview"
                                className="max-h-[60px] max-w-[100px] object-cover rounded-lg border border-slate-200"
                                referrerPolicy="no-referrer"
                              />
                              <button
                                type="button"
                                onClick={() => setSolImage('')}
                                className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-650 rounded-lg text-[9px] font-black transition-all flex items-center gap-1 cursor-pointer border border-rose-150"
                              >
                                제거
                              </button>
                            </div>
                          ) : (
                            <div className="text-center text-slate-400 text-[10px] font-bold mt-2">
                              <ImageIcon className="w-4 h-4 mx-auto mb-1 opacity-40" />
                              <span>등록 없음</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500">이미지 직접 입력 / 프리셋 선택</label>
                        <input
                          type="text"
                          value={solImage}
                          onChange={(e) => setSolImage(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] text-blue-600 font-mono"
                        />
                        <div className="flex gap-2 pt-1 overflow-x-auto scrollbar-none">
                          {CURATED_EV_IMAGES.slice(4).map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSolImage(item.url)}
                              className={`p-1 border rounded-lg overflow-hidden shrink-0 transition-all ${
                                solImage === item.url ? 'border-blue-600 ring-2 ring-blue-600/10' : 'border-slate-200'
                              }`}
                            >
                              <img src={item.url} alt="preset" className="w-12 h-8 object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Blueprint / Infographic Image Upload & Preview Section */}
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <label className="block text-[11px] font-bold text-slate-700">📐 도면/인포그래픽 이미지 설정 (업로드 또는 URL 링크)</label>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                        {/* Drag & Drop Area */}
                        <div className="md:col-span-8">
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDraggingSolBlueprint(true);
                            }}
                            onDragLeave={() => setIsDraggingSolBlueprint(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDraggingSolBlueprint(false);
                              const file = e.dataTransfer.files?.[0];
                              if (file) {
                                if (!file.type.startsWith('image/')) {
                                  alert('이미지 파일만 업로드할 수 있습니다.');
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setSolBlueprintImageUrl(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            onClick={() => document.getElementById('sol-blueprint-file-input')?.click()}
                            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[120px] ${
                              isDraggingSolBlueprint
                                ? 'border-blue-500 bg-blue-50/50'
                                : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="file"
                              id="sol-blueprint-file-input"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setSolBlueprintImageUrl(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <Upload className="w-5 h-5 text-slate-400 mb-1" />
                            <p className="text-[11px] font-black text-slate-700">도면/인포그래픽 이미지 드래그 또는 클릭 업로드</p>
                            <p className="text-[9px] text-slate-400 font-bold mt-0.5">PNG, JPG, JPEG 지원</p>
                          </div>
                        </div>

                        {/* Preview Box */}
                        <div className="md:col-span-4 flex flex-col justify-center items-center p-3 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden min-h-[120px]">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest absolute top-1.5 left-1.5">PREVIEW</span>
                          {solBlueprintImageUrl ? (
                            <div className="flex flex-col items-center gap-1.5 w-full mt-2">
                              <img
                                src={solBlueprintImageUrl}
                                alt="Blueprint Preview"
                                className="max-h-[60px] max-w-[100px] object-cover rounded-lg border border-slate-200"
                                referrerPolicy="no-referrer"
                              />
                              <button
                                type="button"
                                onClick={() => setSolBlueprintImageUrl('')}
                                className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-650 rounded-lg text-[9px] font-black transition-all flex items-center gap-1 cursor-pointer border border-rose-150"
                              >
                                제거
                              </button>
                            </div>
                          ) : (
                            <div className="text-center text-slate-400 text-[10px] font-bold mt-2">
                              <ImageIcon className="w-4 h-4 mx-auto mb-1 opacity-40" />
                              <span>등록 없음</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500">이미지 직접 입력 URL</label>
                        <input
                          type="text"
                          value={solBlueprintImageUrl}
                          onChange={(e) => setSolBlueprintImageUrl(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] text-blue-600 font-mono"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    {/* Catalog Detailed Specs Image Upload & Preview Section */}
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <label className="block text-[11px] font-bold text-slate-700">📄 카탈로그 상세 사양표 이미지 설정 (업로드 또는 URL 링크)</label>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                        {/* Drag & Drop Area */}
                        <div className="md:col-span-8">
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDraggingSolDetail(true);
                            }}
                            onDragLeave={() => setIsDraggingSolDetail(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDraggingSolDetail(false);
                              const file = e.dataTransfer.files?.[0];
                              if (file) {
                                if (!file.type.startsWith('image/')) {
                                  alert('이미지 파일만 업로드할 수 있습니다.');
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setSolDetailImageUrl(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            onClick={() => document.getElementById('sol-detail-file-input')?.click()}
                            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[120px] ${
                              isDraggingSolDetail
                                ? 'border-blue-500 bg-blue-50/50'
                                : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="file"
                              id="sol-detail-file-input"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setSolDetailImageUrl(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <Upload className="w-5 h-5 text-slate-400 mb-1" />
                            <p className="text-[11px] font-black text-slate-700">카탈로그 상세 사양표 이미지 드래그 또는 클릭 업로드</p>
                            <p className="text-[9px] text-slate-400 font-bold mt-0.5">PNG, JPG, JPEG 지원</p>
                          </div>
                        </div>

                        {/* Preview Box */}
                        <div className="md:col-span-4 flex flex-col justify-center items-center p-3 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden min-h-[120px]">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest absolute top-1.5 left-1.5">PREVIEW</span>
                          {solDetailImageUrl ? (
                            <div className="flex flex-col items-center gap-1.5 w-full mt-2">
                              <img
                                src={solDetailImageUrl}
                                alt="Detail Spec Preview"
                                className="max-h-[60px] max-w-[100px] object-cover rounded-lg border border-slate-200"
                                referrerPolicy="no-referrer"
                              />
                              <button
                                type="button"
                                onClick={() => setSolDetailImageUrl('')}
                                className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-650 rounded-lg text-[9px] font-black transition-all flex items-center gap-1 cursor-pointer border border-rose-150"
                              >
                                제거
                              </button>
                            </div>
                          ) : (
                            <div className="text-center text-slate-400 text-[10px] font-bold mt-2">
                              <ImageIcon className="w-4 h-4 mx-auto mb-1 opacity-40" />
                              <span>등록 없음</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-500">이미지 직접 입력 URL</label>
                        <input
                          type="text"
                          value={solDetailImageUrl}
                          onChange={(e) => setSolDetailImageUrl(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] text-blue-600 font-mono"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">솔루션 메인 단락 카피 설명</label>
                      <textarea
                        value={solDesc}
                        onChange={(e) => setSolDesc(e.target.value)}
                        rows={3.5}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold leading-relaxed"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingSolutionId(null)}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdateSolution}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-md"
                      >
                        솔루션 데이터 업데이트
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 5. REVIEW TAB */}
            {activeTab === 'review' && (
              <motion.div
                key="tab-review"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="space-y-4"
              >
                {!editingReviewId ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">📍 생생한 설치 시공 후기 및 현장 전후 비교 이미지 관리</h4>
                      <button
                        onClick={handleAddReview}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        새 설치후기 등록
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-3.5 rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={rev.afterImg} alt={rev.title} className="w-12 h-12 object-cover rounded-xl border border-slate-200/50" />
                            <div className="min-w-0">
                              <span className="text-[10px] text-blue-600 font-extrabold">{rev.location} | {rev.author}</span>
                              <h5 className="text-xs font-black text-slate-900 mt-0.5 truncate">{rev.title}</h5>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditReview(rev)}
                              className="px-3 py-1.5 border border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteReview(rev.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-650 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-150 cursor-pointer transition-all"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4 text-rose-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 p-4 border border-blue-100 bg-blue-50/5 rounded-2xl">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h5 className="text-xs font-black text-blue-800 uppercase">📍 시공 후기 및 비포/애프터 슬라이더 수정</h5>
                      <button
                        onClick={() => setEditingReviewId(null)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600"
                      >
                        돌아가기
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700">후기 제목</label>
                        <input
                          type="text"
                          value={revTitle}
                          onChange={(e) => setRevTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700">고객명 / 직함</label>
                        <input
                          type="text"
                          value={revAuthor}
                          onChange={(e) => setRevAuthor(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700">시공 상세 지역</label>
                        <input
                          type="text"
                          value={revLocation}
                          onChange={(e) => setRevLocation(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700">솔루션 대분류</label>
                        <select
                          value={revCategory}
                          onChange={(e) => setRevCategory(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                        >
                          <option value="Commercial">기업/관공서</option>
                          <option value="Residential">주거 전용</option>
                          <option value="ParkingLot">수익형 주차장</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700">만족도 평점 (1~5)</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={revRating}
                          onChange={(e) => setRevRating(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Before Image URL editing */}
                      <div className="space-y-3 p-3.5 border border-slate-200 rounded-2xl bg-slate-50/50">
                        <span className="text-xs font-extrabold text-slate-800 uppercase block">1. 시공 전 (Before) 이미지 설정 (업로드 또는 URL)</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch">
                          <div className="sm:col-span-8">
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDraggingBeforeImg(true);
                              }}
                              onDragLeave={() => setIsDraggingBeforeImg(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDraggingBeforeImg(false);
                                const file = e.dataTransfer.files?.[0];
                                if (file) {
                                  if (!file.type.startsWith('image/')) {
                                    alert('이미지 파일만 업로드할 수 있습니다.');
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setRevBeforeImg(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              onClick={() => document.getElementById('before-file-input')?.click()}
                              className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[90px] ${
                                isDraggingBeforeImg
                                  ? 'border-red-400 bg-red-50/50'
                                  : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              <input
                                type="file"
                                id="before-file-input"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setRevBeforeImg(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <Upload className="w-4 h-4 text-slate-400 mb-0.5" />
                              <p className="text-[10px] font-black text-slate-700">시공 전 사진 업로드</p>
                            </div>
                          </div>

                          <div className="sm:col-span-4 flex flex-col justify-center items-center p-2 bg-white border border-slate-200 rounded-xl relative min-h-[90px]">
                            {revBeforeImg ? (
                              <div className="flex flex-col items-center gap-1 w-full text-center">
                                <img
                                  src={revBeforeImg}
                                  alt="Before Preview"
                                  className="max-h-[40px] max-w-full object-cover rounded border border-slate-200"
                                  referrerPolicy="no-referrer"
                                />
                                <button
                                  type="button"
                                  onClick={() => setRevBeforeImg('')}
                                  className="text-[9px] text-rose-600 font-bold hover:underline"
                                >
                                  제거
                                </button>
                              </div>
                            ) : (
                              <span className="text-[9px] text-slate-400 font-bold">등록 없음</span>
                            )}
                          </div>
                        </div>

                        <input
                          type="text"
                          value={revBeforeImg}
                          onChange={(e) => setRevBeforeImg(e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] text-rose-600 font-mono"
                          placeholder="시공 전 이미지 URL"
                        />
                        <div className="flex gap-1 overflow-x-auto scrollbar-none pt-0.5">
                          {CURATED_EV_IMAGES.slice(5).map((img, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setRevBeforeImg(img.url)}
                              className="w-8 h-6 rounded border overflow-hidden shrink-0"
                            >
                              <img src={img.url} alt="preset" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* After Image URL editing */}
                      <div className="space-y-3 p-3.5 border border-slate-200 rounded-2xl bg-slate-50/50">
                        <span className="text-xs font-extrabold text-slate-800 uppercase block">2. 시공 후 (After) 이미지 설정 (업로드 또는 URL)</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch">
                          <div className="sm:col-span-8">
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDraggingAfterImg(true);
                              }}
                              onDragLeave={() => setIsDraggingAfterImg(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDraggingAfterImg(false);
                                const file = e.dataTransfer.files?.[0];
                                if (file) {
                                  if (!file.type.startsWith('image/')) {
                                    alert('이미지 파일만 업로드할 수 있습니다.');
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setRevAfterImg(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              onClick={() => document.getElementById('after-file-input')?.click()}
                              className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[90px] ${
                                isDraggingAfterImg
                                  ? 'border-blue-400 bg-blue-50/50'
                                  : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              <input
                                type="file"
                                id="after-file-input"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setRevAfterImg(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <Upload className="w-4 h-4 text-slate-400 mb-0.5" />
                              <p className="text-[10px] font-black text-slate-700">시공 후 사진 업로드</p>
                            </div>
                          </div>

                          <div className="sm:col-span-4 flex flex-col justify-center items-center p-2 bg-white border border-slate-200 rounded-xl relative min-h-[90px]">
                            {revAfterImg ? (
                              <div className="flex flex-col items-center gap-1 w-full text-center">
                                <img
                                  src={revAfterImg}
                                  alt="After Preview"
                                  className="max-h-[40px] max-w-full object-cover rounded border border-slate-200"
                                  referrerPolicy="no-referrer"
                                />
                                <button
                                  type="button"
                                  onClick={() => setRevAfterImg('')}
                                  className="text-[9px] text-rose-600 font-bold hover:underline"
                                >
                                  제거
                                </button>
                              </div>
                            ) : (
                              <span className="text-[9px] text-slate-400 font-bold">등록 없음</span>
                            )}
                          </div>
                        </div>

                        <input
                          type="text"
                          value={revAfterImg}
                          onChange={(e) => setRevAfterImg(e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] text-blue-600 font-mono"
                          placeholder="시공 후 이미지 URL"
                        />
                        <div className="flex gap-1 overflow-x-auto scrollbar-none pt-0.5">
                          {CURATED_EV_IMAGES.slice(0, 4).map((img, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setRevAfterImg(img.url)}
                              className="w-8 h-6 rounded border overflow-hidden shrink-0"
                            >
                              <img src={img.url} alt="preset" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">고객 실제 생생 인터뷰 인용구</label>
                      <textarea
                        value={revInterview}
                        onChange={(e) => setRevInterview(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">시공 세부내역 설명</label>
                      <input
                        type="text"
                        value={revDetails}
                        onChange={(e) => setRevDetails(e.target.value)}
                        placeholder="예: SY-AC07 완속 4대 설치, LED 보강 도색 패키지 시공 완료"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-amber-900">시공지도 전국 핀 X좌표 위치 (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={revX}
                          onChange={(e) => setRevX(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        />
                        <span className="text-[9.5px] text-slate-400 block mt-0.5">※ 가로 위치: 왼쪽 0% ~ 오른쪽 100%</span>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-amber-900">시공지도 전국 핀 Y좌표 위치 (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={revY}
                          onChange={(e) => setRevY(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                        />
                        <span className="text-[9.5px] text-slate-400 block mt-0.5">※ 세로 위치: 위쪽 0% ~ 아래쪽 100%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(editingReviewId!)}
                        className="px-4 py-2 bg-rose-50 text-rose-650 hover:bg-rose-100 rounded-xl text-xs font-bold cursor-pointer transition-all border border-rose-150"
                      >
                        이 후기 삭제
                      </button>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingReviewId(null)}
                          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={handleUpdateReview}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-md"
                        >
                          후기 데이터 업데이트
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 6. SUPPORT & FAQS TAB */}
            {activeTab === 'support' && (
              <motion.div
                key="tab-support"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="space-y-6"
              >
                {/* FAQs Sub-editor */}
                <div className="space-y-3.5 border-b border-slate-100 pb-5">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      고객 자주 묻는 질문(FAQ) 원터치 관리
                    </h4>
                    {!editingFaqId && (
                      <button
                        onClick={handleAddFaq}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        새 FAQ 생성
                      </button>
                    )}
                  </div>

                  {!editingFaqId ? (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {faqs.map((faq) => (
                        <div key={faq.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0">
                            <span className="text-[9.5px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">{faq.category}</span>
                            <span className="font-bold text-slate-800 ml-2 truncate">{faq.question}</span>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => startEditFaq(faq)}
                              className="p-1 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 cursor-pointer"
                              title="수정"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteFaq(faq.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 cursor-pointer"
                              title="삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-blue-100 rounded-2xl space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-700">FAQ 카테고리 구분</label>
                          <select
                            value={faqCat}
                            onChange={(e) => setFaqCat(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                          >
                            <option value="보조금/비용">보조금/비용</option>
                            <option value="화재안전">화재안전</option>
                            <option value="설치과정">설치과정</option>
                            <option value="전기안전">전기안전</option>
                            <option value="사후관리(A/S)">사후관리(A/S)</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-700">자주 묻는 질문 제목</label>
                          <input
                            type="text"
                            value={faqQ}
                            onChange={(e) => setFaqQ(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700">자주 묻는 질문 답변내용</label>
                        <textarea
                          value={faqA}
                          onChange={(e) => setFaqA(e.target.value)}
                          rows={3.5}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium leading-relaxed"
                        />
                      </div>

                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setEditingFaqId(null)}
                          className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          취소
                        </button>
                        <button
                          onClick={handleUpdateFaq}
                          className="px-4 py-1 bg-blue-600 text-white rounded-lg text-xs font-black cursor-pointer"
                        >
                          FAQ 갱신 적용
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notices Sub-editor */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-600" />
                      실시간 새소식 &amp; 공지사항 관리
                    </h4>
                    {!editingNoticeId && (
                      <button
                        onClick={handleAddNotice}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        공지 작성
                      </button>
                    )}
                  </div>

                  {!editingNoticeId ? (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {notices.map((not) => (
                        <div key={not.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0 flex items-center gap-2">
                            {not.important && (
                              <span className="text-[9px] bg-rose-50 text-rose-600 border border-rose-100 font-extrabold px-1 py-0.5 rounded">중요</span>
                            )}
                            <span className="font-bold text-slate-800 truncate">{not.title}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[10px] text-slate-400 font-bold mr-1">{not.date}</span>
                            <button
                              onClick={() => startEditNotice(not)}
                              className="p-1 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 cursor-pointer"
                              title="수정"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteNotice(not.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 cursor-pointer"
                              title="삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-blue-100 rounded-2xl space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-700">공지 작성 일자</label>
                          <input
                            type="date"
                            value={notDate}
                            onChange={(e) => setNotDate(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                          <input
                            type="checkbox"
                            checked={notImp}
                            onChange={(e) => setNotImp(e.target.checked)}
                            id="chk-not-imp"
                            className="w-4 h-4 text-blue-600 rounded border-slate-200 focus:ring-blue-500"
                          />
                          <label htmlFor="chk-not-imp" className="text-xs font-bold text-slate-800">
                            중요 상단 고정 공지여부 (빨간색 중요 뱃지 부착)
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-700">공지사항 제목 텍스트</label>
                        <input
                          type="text"
                          value={notTitle}
                          onChange={(e) => setNotTitle(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                        />
                      </div>

                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setEditingNoticeId(null)}
                          className="px-3 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          취소
                        </button>
                        <button
                          onClick={handleUpdateNotice}
                          className="px-4 py-1 bg-blue-600 text-white rounded-lg text-xs font-black cursor-pointer"
                        >
                          공지사항 변경 적용
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* 8. SYNC / BACKUP TAB */}
            {activeTab === 'sync' && (
              <motion.div
                key="tab-sync"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-xs font-black text-blue-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase">
                    <Settings className="w-4 h-4 text-blue-600 animate-pulse" />
                    📲 스마트폰 - 컴퓨터 기기간 설정 완벽 동기화 (기기 연동)
                  </h4>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-900 font-bold leading-relaxed space-y-2.5 mt-3">
                    <p className="flex items-start gap-1.5">
                      <span className="text-sm">💡</span>
                      <span>
                        <strong>동기화가 필요한 이유:</strong> 관리자 모드에서 수정한 홈페이지 디자인 및 로고, 문구 등은 보안과 빠른 속도를 위해 각 브라우저의 <strong>로컬 스토리지(LocalStorage)</strong>에 개별 저장됩니다. 
                        따라서 <u>컴퓨터에서 수정한 내용은 핸드폰에 바로 나타나지 않으며, 핸드폰에서 수정한 내용 역시 컴퓨터에 바로 연동되지 않습니다.</u>
                      </span>
                    </p>
                    <p className="flex items-start gap-1.5 text-slate-600 font-semibold pl-4">
                      <span>•</span>
                      <span><strong>해결방법 1 (간편 기기 연동):</strong> 현재 컴퓨터의 모든 수정한 설정을 아래 [설정 내보내기] 버튼으로 복사하여 핸드폰 동기화 탭에 [가져오기]로 붙여넣으면 즉시 똑같아집니다!</span>
                    </p>
                    <p className="flex items-start gap-1.5 text-slate-600 font-semibold pl-4">
                      <span>•</span>
                      <span><strong>해결방법 2 (영구 서버 저장 - 가장 권장):</strong> 아래 동기화용 텍스트 코드를 복사해서 AI 어시스턴트(채팅창)에 <strong>"수정한 대로 코드에 영구 반영해줘"</strong>라고 전달해 주세요. 제가 개발자 권한으로 실제 소스코드에 바로 빌드해 드려, 모든 사용자에게 기본으로 노출되게 해 드립니다!</span>
                    </p>
                  </div>
                </div>

                {/* 1. Export Area */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3.5">
                  <div>
                    <h5 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      1단계: 현재 기기의 설정 코드 내보내기 (EXPORT)
                    </h5>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      현재 기기(PC 등)에서 작업한 모든 홈페이지 세팅 정보를 하나의 암호화 텍스트 코드로 변환해 복사합니다.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const keys = [
                          'sy_cms_logo',
                          'sy_cms_categories',
                          'sy_cms_footer',
                          'sy_cms_hero',
                          'sy_cms_about',
                          'sy_cms_products',
                          'sy_cms_solutions',
                          'sy_cms_reviews',
                          'sy_cms_faqs',
                          'sy_cms_notices',
                          'sy_cms_sns',
                          'sy_cms_quickmenu'
                        ];
                        const data: Record<string, string | null> = {};
                        keys.forEach(key => {
                          data[key] = localStorage.getItem(key);
                        });
                        const code = btoa(encodeURIComponent(JSON.stringify(data)));
                        navigator.clipboard.writeText(code).then(() => {
                          showSaveSuccess('📋 설정 동기화 코드가 클립보드에 완벽히 복사되었습니다!');
                        }).catch(() => {
                          // Fallback to direct download/selection
                          alert('클립보드 직접 복사가 거부되었습니다. 아래 표시된 긴 텍스트 코드를 전체 선택(Ctrl+A)하여 복사해 주세요!');
                        });
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      <span>📋 전체 설정 동기화 코드 클립보드 복사하기</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500">생성된 내보내기 코드 (전체 선택하여 복사해 대화창에 올려주셔도 됩니다)</label>
                    <textarea
                      readOnly
                      onClick={(e) => {
                        (e.target as HTMLTextAreaElement).select();
                      }}
                      value={(() => {
                        try {
                          const keys = [
                            'sy_cms_logo',
                            'sy_cms_categories',
                            'sy_cms_footer',
                            'sy_cms_hero',
                            'sy_cms_about',
                            'sy_cms_products',
                            'sy_cms_solutions',
                            'sy_cms_reviews',
                            'sy_cms_faqs',
                            'sy_cms_notices',
                            'sy_cms_sns',
                            'sy_cms_quickmenu'
                          ];
                          const data: Record<string, string | null> = {};
                          keys.forEach(key => {
                            data[key] = localStorage.getItem(key);
                          });
                          return btoa(encodeURIComponent(JSON.stringify(data)));
                        } catch (err) {
                          return '설정 데이터를 가져오지 못했습니다.';
                        }
                      })()}
                      rows={3}
                      className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-mono text-slate-500 cursor-text select-all focus:outline-none"
                    />
                  </div>
                </div>

                {/* 2. Import Area */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3.5">
                  <div>
                    <h5 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      2단계: 다른 기기에서 가져온 설정 코드 붙여넣기 (IMPORT)
                    </h5>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      PC나 다른 기기에서 복사한 동기화 코드를 아래에 붙여넣고 [설정 적용]을 누르면, 이 핸드폰 브라우저에 해당 디자인이 즉시 덮어씌워집니다.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <textarea
                      placeholder="여기에 다른 기기에서 복사한 동기화 코드를 붙여넣어 주세요..."
                      value={importCode}
                      onChange={(e) => setImportCode(e.target.value)}
                      rows={3.5}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-mono text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleImportSync(importCode, showSaveSuccess)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
                    >
                      <span>🔄 이 기기에 설정 즉시 적용하기 (가져오기)</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Area */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right flex justify-between items-center shrink-0">
          <p className="text-[10px] text-slate-400 font-bold leading-normal text-left max-w-md">
            ※ 관리자 에디터에서 변경한 텍스트 및 사진 링크는 사용자의 인터넷 브라우저 <strong>로컬 스토리지(LocalStorage)</strong>에 즉시 안전히 영구 저장되어 기기를 껐다 켜도 계속해서 유지됩니다.
          </p>
          
          <button
            onClick={onClose}
            id="btn-cms-finish"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl cursor-pointer"
          >
            편집 완료 후 나가기
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Helper robust JSON URL parser when loading sync settings
function handleImportSync(importCode: string, showSaveSuccess: (msg: string) => void) {
  if (!importCode.trim()) {
    alert('붙여넣을 동기화 코드를 입력해 주세요!');
    return;
  }
  try {
    const decoded = robustUrlDecode(atob(importCode.trim()));
    const data = JSON.parse(decoded);
    
    let importCount = 0;
    Object.entries(data).forEach(([key, val]) => {
      if (key.startsWith('sy_cms_')) {
        if (val === null) {
          localStorage.removeItem(key);
        } else if (typeof val === 'string') {
          localStorage.setItem(key, val);
        }
        importCount++;
      }
    });
    
    if (importCount === 0) {
      alert('가져올 유효한 설정 데이터가 없습니다.');
      return;
    }
    
    showSaveSuccess('🔄 다른 기기의 설정 데이터가 성공적으로 반영되었습니다! 웹페이지를 새로고침합니다.');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (err) {
    alert('동기화 코드가 올바르지 않거나 손상되었습니다. 복사가 제대로 되었는지 다시 확인해 주세요!');
  }
}
