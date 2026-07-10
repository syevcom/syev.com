/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Solution, ActivePage } from '../types';
import { Check, ArrowRight, Zap, RefreshCw, Building2, Home, ParkingCircle, Layers, Image, FileText, Trash2, Upload, ExternalLink } from 'lucide-react';
import { PRODUCTS } from '../data';
import PdfImageRenderer from './PdfImageRenderer';

const BRAND_METADATA: Record<string, {
  name: string;
  slogan: string;
  description: string;
  highlights: string[];
  logoBg: string;
  icon: string;
  benefits: string[];
}> = {
  'sk일렉링크': {
    name: 'sk일렉링크 (SK electlink)',
    slogan: 'SK그룹의 신뢰도 높은 전국 최대 급속/완속 충전 네트워크',
    description: 'SK일렉링크는 대기업의 강력한 인프라와 높은 보안 수준을 바탕으로 고속 충전 및 지능형 완속 전력 제어 장치를 공급하며, 전국 1위의 가동률과 원격 고장 복구 시스템을 자랑합니다.',
    highlights: ['대기업 대규모 인프라망', '실시간 스마트 전력 분배', '24시간 무인 모니터링'],
    logoBg: 'bg-red-50 text-red-600 border-red-100',
    icon: '⚡',
    benefits: ['SK 멤버십 할인 혜택 연동', '100% 무상 설치 지원 (정부보조금)', 'PLC 화재 예방 안심 모뎀 기본 탑재']
  },
  '플러그링크': {
    name: '플러그링크 (pluglink)',
    slogan: 'IT 기술 기반의 혁신적인 스마트 로드 밸런싱 충전 기술',
    description: '플러그링크는 스마트 분배 제어 솔루션으로 한전 전력 승압 비용을 최소화하며, 깔끔한 스페이스 그레이 메탈 월박스 디자인으로 아파트 가치를 한층 드높입니다.',
    highlights: ['스마트 로드 밸런싱 특허', '스페이스 그레이 메탈 디자인', '카카오톡 연동 간편 요금 결제'],
    logoBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    icon: '🔌',
    benefits: ['단일 회선 전력 5대 분배 시공', '자가 부담금 ZERO 무상 설치', '업계 유일 100% 친환경 재생에너지 요금제']
  },
  '이엘일렉트릭': {
    name: '이엘일렉트릭 (EL Electric)',
    slogan: '온도센서 연동형 화재 안심 스마트 제어 기술의 절대 강자',
    description: '이EL일렉트릭은 완속 충전기 자체의 복합 온도 측정 센서와 과열 자동 차단 회로를 보유하여 화재 예방에 가장 안전한 1등 품질 신뢰 아파트 충전 모델입니다.',
    highlights: ['온도 센서 내장 화재 예방', '실시간 과전류 3중 차단', '안전 안심 시공 가이드 준수'],
    logoBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    icon: '🛡️',
    benefits: ['화재 예방 충전기 우선 보조금 적용', '전기 안전 사고 책임 보증 보험 가입', '무상 현장 정밀 안전 진단']
  },
  '나이스차져': {
    name: '나이스차져 (NICE Charger)',
    slogan: 'NICE 홀딩스 금융 인프라의 투명하고 편리한 과금 수납 솔루션',
    description: '나이스차져는 국내 최고 신용평가 그룹인 NICE 그룹의 정밀 무인 금융 단말 수납 기술을 탑재하여 365일 실시간 투명한 요금 정산과 안전한 보안 인증을 완료했습니다.',
    highlights: ['금융 등급 보안 정산망', 'NICE 간편 결제 완벽 지원', '365일 24시간 CS 콜센터'],
    logoBg: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    icon: '💳',
    benefits: ['신용카드 단말기 탑재 가능 모델', '아파트 관리비 고지서 연동 수납', '정부 승인 공식 보조금 시공']
  },
  '에버온': {
    name: '에버온 (Everon)',
    slogan: '대한민국 누적 시공 실적 1위에 빛나는 대표 완속 파트너',
    description: '에버온은 오랜 충전 비즈니스 역사와 폭넓은 현장 데이터베이스를 기반으로 어떤 구옥/신축 아파트 주차 현장에도 완벽한 전력선 인입과 최적 충전 구역 선정을 보장합니다.',
    highlights: ['누적 설치량 1위의 노하우', '가장 저렴한 표준 충전 단가', '전국 직영 A/S 기술망 구축'],
    logoBg: 'bg-amber-50 text-amber-700 border-amber-100',
    icon: '🌟',
    benefits: ['24시간 원격 복구 솔루션 무상 제공', '최첨단 슬림형 LED 디스플레이', '입주민 대상 100% 무상 설치 지원']
  },
  '현대엔지니어링': {
    name: '현대엔지니어링 (HEC Charger)',
    slogan: '현대자동차그룹의 정식 전기차 충전 서비스 시공 공식 사업자',
    description: '현대엔지니어링은 국내 최고의 대기업 주택건설 역량과 자본금을 활용해 최고 품질의 하이엔드형 아파트 완속/급속 충전 기기 및 프리미엄 전기공사를 제공합니다.',
    highlights: ['현대자동차그룹 공식 파트너', '1군 건설사 명품 프리미엄 시공', '고품격 통합 회원 혜택 연동'],
    logoBg: 'bg-blue-50 text-blue-700 border-blue-100',
    icon: '🚙',
    benefits: ['현대/기아 멤버십 포인트 사용 연동', '100% 하이엔드 신뢰성 부품 사용', '전국 한전 용량 사전 무상 대관 컨설팅']
  },
  '아이파킹': {
    name: '아이파킹 EV (iParking EV)',
    slogan: '무인 주차 시스템 전국 1위 연동 고효율 충전 제어 서비스',
    description: '아이파킹 EV는 무인 주차 정산 선두 주자 파킹클라우드의 IT 기술력을 기반으로 주차 정산기, 주차장 입출입 차단 시스템과 유기적으로 연동하여 충전 요금 주차비 사전 할인 및 통합 결제 편의성을 극대화합니다.',
    highlights: ['주차관제 시스템 연동', '자동 차량 번호 인식', '주차요금 감면 혜택'],
    logoBg: 'bg-orange-50 text-orange-600 border-orange-100',
    icon: '🚗',
    benefits: ['충전 완료 시 주차요금 즉시 자동 감면', '주차 앱 하나로 할인권 및 충전 원스톱 결제', '24시간 무인 안심 주차-충전 관제 모니터링']
  },
  'LG유플러스볼트업': {
    name: 'LG유플러스 볼트업 (VoltUp)',
    slogan: 'LG그룹의 최고 신뢰성 망 인프라 기반 프리미엄 충전망',
    description: 'LG유플러스 볼트업은 3대 통신사의 강력하고 안정적인 모바일 통신 회선을 기본 무상 장착하고, 전국 직영 24시간 철저한 원격 제어 및 현장 긴급 출동 긴급 복구 시스템으로 압도적인 운용 신뢰성을 보장합니다.',
    highlights: ['대기업 전용 통신망 연동', 'U+ 통신 요금 멤버십 할인', '24시간 관제 센터 가동'],
    logoBg: 'bg-pink-50 text-pink-600 border-pink-100',
    icon: '🔌',
    benefits: ['LG U+ 모바일 고객 충전 요금 상시 10% 추가 할인', '365일 실시간 안전 감지 및 원격 셧다운 기능', '전 입주민 자가부담금 ZERO 완전 무상 설치 시공']
  }
};

const HOME_POWER_METADATA: Record<string, {
  name: string;
  slogan: string;
  description: string;
  highlights: string[];
  logoBg: string;
  icon: string;
  benefits: string[];
  specs: { label: string; value: string }[];
}> = {
  '5kW': {
    name: '5kW 슬림형 스마트 홈 충전기',
    slogan: '단상 220V 소형 계약 전력 및 구옥 주택용 최적화 모델',
    description: '한전 승압 공사 요금이 부담스럽거나 기본 전기 요금을 절감하고 싶은 단독주택 소유주분들을 위한 실속형 충전 시스템입니다. 기존 7kW 대비 승압 추가 비용 부담 없이 간편한 전기 인입으로 야간 수면 중 안전하게 완충이 가능합니다.',
    highlights: ['승압 기본요금 절약', '플러그 앤 플레이 지원', '소형 컴팩트 디자인'],
    logoBg: 'bg-teal-50 text-teal-600 border-teal-100',
    icon: '🔋',
    benefits: ['한전 기본요금 월 약 1만원 영구 절감 효과', '자가부담 최소화 맞춤 실속 시공', '과전류/과온도 방지 오토 제어 센서'],
    specs: [
      { label: '최대 출력 용량', value: '5kW (단상 220V)' },
      { label: '완충 소요 시간', value: '84kWh 기준 약 16.5시간 (기본 야간 주차 시 충분)' },
      { label: '권장 설치 환경', value: '단독주택, 농어촌 주택, 계약전력 5kW 이하 공간' },
      { label: '케이블 길이', value: '기본 5m 고품질 난연 케이블 제공 (최대 7m 연장 가능)' }
    ]
  },
  '7kW': {
    name: '7kW 표준형 스마트 홈 충전기',
    slogan: '대한민국 보급률 1위! 가장 표준적이고 든든한 고성능 홈 충전 표준',
    description: '단독주택, 빌라, 개인 전용 차고지에 가장 많이 시공되는 베스트셀러 표준 용량입니다. 퇴근 후 주차하여 밤사이(8~10시간) 충전해 두면, 다음날 상쾌한 기분으로 100% 완전 충전된 차량을 주행할 수 있어 최상의 가성비와 충전 만족도를 자랑합니다.',
    highlights: ['대한민국 표준기 규격', '방수/방진 IP55 최고 등급', '예약 시간 충전 스마트 칩'],
    logoBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    icon: '⚡',
    benefits: ['심야 시간 할인 전기요금 자동 예약 세팅', '100% 한전 한도 사전 대관 무료 대행', 'KC 국가안전인증 및 전자파 무해 입증'],
    specs: [
      { label: '최대 출력 용량', value: '7kW (단상 220V)' },
      { label: '완충 소요 시간', value: '84kWh 기준 약 12시간 (야간 1회 주차로 100% 완충)' },
      { label: '권장 설치 환경', value: '일반 단독주택, 신축 빌라, 개인 상가 소유 주차장' },
      { label: '케이블 길이', value: '기본 5m 고강도 내한성 실리콘 케이블 기본 탑재' }
    ]
  },
  '11kW': {
    name: '11kW 고속형 3상 프리미엄 홈 충전기',
    slogan: '3상 380V 고전력 인입 전용, 고출력 수입/대형 EV 특화 시스템',
    description: '3상 380V 동력 전기를 활용할 수 있는 단독주택이나 준공공 시설, 개인 사업장에 완벽하게 대응하는 하이엔드 모델입니다. 테슬라, 아우디 e-tron, 타이칸 등 대용량 고전압 배터리를 탑재한 수입/국산 프리미엄 전기차를 7kW 대비 최대 1.5배 이상 신속하게 완충합니다.',
    highlights: ['3상 동력 11kW 초고속 완속', '수입/대용량 EV 충전 완벽 호환', '고급 LED 지능형 디스플레이'],
    logoBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    icon: '🚀',
    benefits: ['7kW 대비 약 4.5시간 이상 시간 단축 효과', '기기 가동 상태 실시간 LED 직관 모니터링', '업계 최고 5억 생산물 배상 책임 보험 가입'],
    specs: [
      { label: '최대 출력 용량', value: '11kW (3상 380V)' },
      { label: '완충 소요 시간', value: '84kWh 기준 단 7.5시간 (급속 못지않은 완속 속도)' },
      { label: '권장 설치 환경', value: '3상 동력 전기 사용 주택, 개인 법인 사옥, 프리미엄 차고지' },
      { label: '케이블 길이', value: '기본 5m 일체형 하이그레이드 커넥터 제공' }
    ]
  }
};

interface SolutionsSectionProps {
  key?: React.Key;
  onOpenQuoteWithPurpose: (purpose: 'Commercial' | 'Residential' | 'ParkingLot') => void;
  solutions: Solution[];
  isEditMode?: boolean;
  onOpenCms?: (tab: 'brand' | 'hero' | 'about' | 'products' | 'solutions' | 'review' | 'support' | 'sync') => void;
  onPageChange?: (page: ActivePage) => void;
  defaultActiveTab?: 'ALL' | 'Commercial' | 'Residential' | 'ParkingLot';
  selectedAptBrand?: string;
  onSelectAptBrand?: (brand: string) => void;
  selectedHomePower?: string;
  onSelectHomePower?: (power: string) => void;
}

export default function SolutionsSection({ 
  onOpenQuoteWithPurpose,
  solutions,
  isEditMode = false,
  onOpenCms,
  onPageChange,
  defaultActiveTab = 'ALL',
  selectedAptBrand = 'sk일렉링크',
  onSelectAptBrand,
  selectedHomePower = '7kW',
  onSelectHomePower
 }: SolutionsSectionProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'Commercial' | 'Residential' | 'ParkingLot'>(defaultActiveTab);
  const [selectedProductIds, setSelectedProductIds] = useState<Record<string, string>>({});
  const [visualViewerMode, setVisualViewerMode] = useState<Record<string, 'product' | 'catalog'>>({});
  const [solutionTabs, setSolutionTabs] = useState<Record<string, 'specs' | 'infographic'>>({});
  const [localBannerModes, setLocalBannerModes] = useState<Record<string, 'cover' | 'unfold'>>({});
  const [localDetailModes, setLocalDetailModes] = useState<Record<string, 'scroll' | 'unfold'>>({});

  const [brands, setBrands] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem('sy_cms_brands');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...BRAND_METADATA, ...parsed };
      } catch (e) {
        return BRAND_METADATA;
      }
    }
    return BRAND_METADATA;
  });

  const [isDraggingPdf, setIsDraggingPdf] = useState<Record<string, boolean>>({});

  const handlePdfUpload = (brandKey: string, file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (!isPdf && !isImage) {
      alert('PDF 파일 또는 이미지 파일(PNG/JPG/JPEG)만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = {
        ...brands,
        [brandKey]: {
          ...brands[brandKey],
          pdfUrl: reader.result as string,
          pdfName: file.name
        }
      };
      setBrands(updated);
      localStorage.setItem('sy_cms_brands', JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePdf = (brandKey: string) => {
    const updated = {
      ...brands,
      [brandKey]: {
        ...brands[brandKey],
        pdfUrl: undefined,
        pdfName: undefined
      }
    };
    setBrands(updated);
    localStorage.setItem('sy_cms_brands', JSON.stringify(updated));
  };

  const filteredSolutions = solutions.filter(sol => {
    if (activeTab === 'ALL') return true;
    return sol.category === activeTab;
  });

  const getTabIcon = (category: string) => {
    switch (category) {
      case 'Commercial':
        return <Building2 className="w-4 h-4 shrink-0" />;
      case 'Residential':
        return <Home className="w-4 h-4 shrink-0" />;
      case 'ParkingLot':
        return <ParkingCircle className="w-4 h-4 shrink-0" />;
      default:
        return <Layers className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <div className="space-y-12 py-10 relative group/solutions">
      {isEditMode && onOpenCms && (
        <button
          onClick={() => onOpenCms('solutions')}
          className="absolute top-2 right-2 z-30 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg transition-transform hover:scale-105 cursor-pointer"
        >
          ✏️ 용도별 솔루션 실시간 편집
        </button>
      )}

      {/* Modern responsive category menu (목차) - Only show when no specific default tab is defined */}
      {defaultActiveTab === 'ALL' && (
        <div className="space-y-4 text-center">
          <span className="text-blue-600 font-black text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            SOLUTIONS DIRECTORY
          </span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            어떤 공간에 충전기를 설치하시겠습니까?
          </h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto font-medium">
            설치 현장 용도에 맞춰 보조금 신청 절차와 권장 기기 라인업을 한눈에 비교해 보세요.
          </p>

          {/* Tab Selection Row */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex flex-wrap sm:flex-nowrap justify-center gap-1 bg-slate-100 p-1.5 rounded-2xl max-w-full overflow-x-auto scrollbar-none shadow-inner border border-slate-200/50">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer min-h-[40px] ${
                  activeTab === 'ALL'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>전체 솔루션</span>
              </button>
              {solutions.map((sol) => (
                <button
                  key={sol.id}
                  onClick={() => setActiveTab(sol.category)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer min-h-[40px] ${
                    activeTab === sol.category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {getTabIcon(sol.category)}
                  <span>{sol.category === 'Commercial' ? '아파트' : sol.category === 'Residential' ? '가정용 홈' : '상업시설 수익형'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category detail block cards */}
      <div className="space-y-16">
        {filteredSolutions.map((sol, index) => {
          return (
            <section
              key={sol.id}
              id={`solution-section-${sol.id}`}
              className="p-6 md:p-8 bg-white border border-slate-200/80 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="space-y-6">
                {/* 1. Header Text & Benefits Block (Top) */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-blue-600 font-extrabold text-[10px] tracking-widest uppercase block">
                      {sol.category === 'Commercial' ? '🏢 아파트·공동주택·공용시설 맞춤' : sol.category === 'Residential' ? '🏡 가정용·홈·개인소유지' : '🅿️ 상업시설·수익형 주차장'}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight leading-snug">
                      {sol.title}
                    </h3>
                  </div>
                  
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium max-w-4xl">
                    {sol.description}
                  </p>

                  {/* Grid benefits */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {sol.benefits.map((b) => (
                      <div key={b} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 shadow-xs">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="font-semibold leading-relaxed">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {sol.category === 'Commercial' && (() => {
                  const brandData = brands[selectedAptBrand] || brands['sk일렉링크'];
                  return (
                    <div className="p-6 bg-gradient-to-b from-emerald-600 to-emerald-700 text-white rounded-3xl border border-emerald-500/30 space-y-6 shadow-xl relative overflow-hidden group/brand">
                      {/* Decorative Background Glow */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
                      
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-emerald-500/30 pb-4 relative z-10">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">{brandData.icon}</span>
                            <span className="text-[10px] font-extrabold text-yellow-300 tracking-wider uppercase block bg-emerald-800/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                              SY.com 아파트 브랜드 공식 파트너
                            </span>
                          </div>
                          <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
                            {brandData.name}
                          </h4>
                          <p className="text-xs text-emerald-100 font-bold">
                            {brandData.slogan}
                          </p>
                        </div>
                        <div className="flex gap-1.5 overflow-x-auto max-w-full pb-1 lg:pb-0 scrollbar-none self-stretch lg:self-auto">
                          {Object.keys(brands).map((b) => {
                            const isSel = selectedAptBrand === b;
                            return (
                              <button
                                key={b}
                                type="button"
                                onClick={() => onSelectAptBrand?.(b)}
                                className={`px-3 py-2 rounded-xl text-[11px] font-black transition-all cursor-pointer whitespace-nowrap ${
                                  isSel
                                    ? 'bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/30 scale-103'
                                    : 'bg-emerald-800/80 text-emerald-100 hover:text-white hover:bg-emerald-700/80'
                                }`}
                              >
                                {b}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="space-y-4">
                          <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-semibold">
                            {brandData.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {brandData.highlights.map((hl) => (
                              <span key={hl} className="text-[10px] font-black bg-emerald-800/50 text-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-500/20">
                                ✓ {hl}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3 bg-emerald-800/40 p-4 rounded-2xl border border-emerald-500/30">
                          <span className="text-[10px] font-extrabold text-yellow-300 tracking-wider uppercase block">
                            🎁 SY.com 무상 설치 공식 혜택
                          </span>
                          <div className="space-y-2">
                            {brandData.benefits.map((benefit, bIdx) => (
                              <div key={bIdx} className="flex items-start gap-2 text-xs text-emerald-50">
                                <span className="text-yellow-400 font-bold mt-0.5">•</span>
                                <span className="font-bold leading-relaxed">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Brand PDF Catalog & Inline Document Viewer */}
                      <div className="border border-emerald-500/20 bg-emerald-800/20 rounded-2xl p-5 space-y-4 relative z-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-500/30 pb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-amber-300 animate-pulse" />
                            <h5 className="text-xs font-black text-white uppercase tracking-wider">
                              📄 {brandData.name} 공식 사양서 및 카탈로그
                             </h5>
                          </div>
                          {brandData.pdfUrl && (
                            <div className="flex items-center gap-1.5 self-end sm:self-auto">
                              {isEditMode && (
                                <button
                                  type="button"
                                  onClick={() => handleDeletePdf(selectedAptBrand)}
                                  className="px-2.5 py-1.5 bg-rose-900/80 hover:bg-rose-800 text-rose-100 rounded-lg text-[10px] font-black flex items-center gap-1 transition-colors cursor-pointer border border-rose-700/50"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  브로셔 삭제
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {brandData.pdfUrl ? (
                          <div className="space-y-2">
                            <PdfImageRenderer 
                              fileUrl={brandData.pdfUrl} 
                              fileName={brandData.pdfName || 'catalog.pdf'} 
                              brandName={brandData.name} 
                              isAdmin={isEditMode}
                            />
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {isEditMode ? (
                              <div
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setIsDraggingPdf(prev => ({ ...prev, [selectedAptBrand]: true }));
                                }}
                                onDragLeave={() => {
                                  setIsDraggingPdf(prev => ({ ...prev, [selectedAptBrand]: false }));
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  setIsDraggingPdf(prev => ({ ...prev, [selectedAptBrand]: false }));
                                  const file = e.dataTransfer.files?.[0];
                                  if (file) {
                                    handlePdfUpload(selectedAptBrand, file);
                                  }
                                }}
                                onClick={() => document.getElementById(`pdf-file-input-${selectedAptBrand}`)?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
                                  isDraggingPdf[selectedAptBrand]
                                    ? 'border-yellow-400 bg-yellow-500/10'
                                    : 'border-emerald-500/40 bg-emerald-800/20 hover:bg-emerald-700/40 hover:border-emerald-400'
                                }`}
                              >
                                <input
                                  type="file"
                                  id={`pdf-file-input-${selectedAptBrand}`}
                                  accept="application/pdf, image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handlePdfUpload(selectedAptBrand, file);
                                    }
                                  }}
                                />
                                <Upload className="w-7 h-7 text-emerald-100 mb-2" />
                                <p className="text-xs font-black text-white">
                                  여기에 <span className="text-yellow-300">[{brandData.name}]</span> 브랜드 카탈로그 PDF 또는 이미지 파일을 드래그하거나 클릭하여 업로드
                                </p>
                                <p className="text-[10px] text-emerald-200 font-bold mt-1">
                                  PDF 파일 또는 이미지 형식(PNG, JPG, JPEG) 모두 완벽 지원 및 자동 고선명 실시간 렌더링
                                </p>
                              </div>
                            ) : (
                              <div className="py-8 text-center bg-emerald-800/20 border border-emerald-500/20 rounded-xl flex flex-col items-center justify-center space-y-1.5">
                                <FileText className="w-6 h-6 text-emerald-200" />
                                <p className="text-xs text-white font-bold">현재 등록된 브랜드 공식 카탈로그가 없습니다.</p>
                                <p className="text-[10px] text-emerald-100">우측 상단의 '실시간 편집 모드'를 활성화하면 PDF 또는 이미지 브로셔를 직접 등록하실 수 있습니다.</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-4 bg-emerald-800/30 p-4 rounded-2xl border border-emerald-500/20 relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping shrink-0"></span>
                          <p className="text-[11px] sm:text-xs text-white font-bold">
                            지금 문의하시면 <span className="text-yellow-300 font-black">{brandData.name}</span> 정부 및 지자체 무상 지원 자격을 즉시 심사 매칭해 드립니다.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onOpenQuoteWithPurpose('Commercial')}
                          className="w-full md:w-auto px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-slate-950 text-xs font-black rounded-xl cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-center gap-1 shrink-0 shadow-md shadow-yellow-500/20"
                        >
                          ⚡ {selectedAptBrand} 무상설치 문의하기
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {sol.category === 'Residential' && (() => {
                  const powerData = HOME_POWER_METADATA[selectedHomePower] || HOME_POWER_METADATA['7kW'];
                  return (
                    <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800/80 space-y-6 shadow-xl relative overflow-hidden group/brand">
                      {/* Decorative Background Glow */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                      
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">{powerData.icon}</span>
                            <span className="text-[10px] font-extrabold text-emerald-400 tracking-wider uppercase block bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-900/40">
                              가정용 홈충전기 상세 스펙 비교
                            </span>
                          </div>
                          <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
                            {powerData.name}
                          </h4>
                          <p className="text-xs text-slate-400 font-bold">
                            {powerData.slogan}
                          </p>
                        </div>
                        
                        {/* Interactive kW selection tabs */}
                        <div className="flex gap-1.5 overflow-x-auto max-w-full pb-1 lg:pb-0 scrollbar-none self-stretch lg:self-auto">
                          {Object.keys(HOME_POWER_METADATA).map((p) => {
                            const isSel = selectedHomePower === p;
                            return (
                              <button
                                key={p}
                                type="button"
                                onClick={() => onSelectHomePower?.(p)}
                                className={`px-4 py-2.5 rounded-xl text-[12px] font-black transition-all cursor-pointer whitespace-nowrap ${
                                  isSel
                                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-103 font-black'
                                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700/80'
                                }`}
                              >
                                {p} 충전기
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
                        {/* Left column (7/12) */}
                        <div className="lg:col-span-7 space-y-4">
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                            {powerData.description}
                          </p>
                          
                          {/* Highlights */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {powerData.highlights.map((hl) => (
                              <span key={hl} className="text-[10px] font-black bg-slate-800/80 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700/40">
                                ✓ {hl}
                              </span>
                            ))}
                          </div>

                          {/* Technical specs card */}
                          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                            <span className="text-[10px] font-extrabold text-emerald-400 tracking-wider uppercase block">
                              📊 {selectedHomePower} 기술 세부 사양 (Technical Specifications)
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {powerData.specs.map((spec, sIdx) => (
                                <div key={sIdx} className="space-y-0.5 border-l border-emerald-500/20 pl-2">
                                  <span className="text-[10px] text-slate-400 font-extrabold block">{spec.label}</span>
                                  <span className="text-xs text-slate-200 font-bold">{spec.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right column (5/12) */}
                        <div className="lg:col-span-5 space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
                          <div className="space-y-3">
                            <span className="text-[10px] font-extrabold text-emerald-400 tracking-wider uppercase block">
                              🎁 SY.com 가정용 무상 설치 공식 특전
                            </span>
                            <div className="space-y-2">
                              {powerData.benefits.map((benefit, bIdx) => (
                                <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-200">
                                  <span className="text-emerald-500 font-bold mt-0.5">•</span>
                                  <span className="font-bold leading-relaxed">{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-800/60 text-xs text-slate-400 leading-relaxed font-medium">
                            💡 <span className="text-slate-300 font-bold">자가 소유지 단독주택</span> 뿐만 아니라, 빌라 주차장 및 아파트 개인 배정 주차면 내 설치 가능 여부를 무료로 사전 분석해 드립니다.
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/50 relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
                          <p className="text-[11px] sm:text-xs text-slate-300 font-bold">
                            지금 문의하시면 <span className="text-amber-400 font-black">{powerData.name}</span> 정부 및 지자체 무상 인입 자격을 즉시 심사 매칭해 드립니다.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onOpenQuoteWithPurpose('Residential')}
                          className="w-full md:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black rounded-xl cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-center gap-1 shrink-0 shadow-md shadow-emerald-500/20"
                        >
                          ⚡ {selectedHomePower} 무상설치 문의하기
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 정부 보조금 및 설치 대행 프로세스 (01단계 ~ 04단계) - 글 아래인 상단으로 이동 */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    정부 보조금 및 설치 대행 프로세스 (원스톱 무료 대행 서비스)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
                    {sol.subsidyProcess.map((step, sIdx) => (
                      <div key={step} className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs relative flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-black text-blue-600 block mb-1">0{sIdx+1}단계</span>
                          <span className="font-extrabold leading-relaxed block text-slate-800 text-xs sm:text-[11px]">{step.split(': ')[1]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                 <div className="pt-3 pb-6 flex flex-col items-center justify-center text-center gap-3 py-6 border-b border-slate-100">
                  <button
                    onClick={() => onOpenQuoteWithPurpose(sol.category)}
                    id={`btn-solution-cta-${sol.id}`}
                    className={`w-full sm:w-auto min-w-[280px] sm:min-w-[420px] py-4 px-10 font-black shadow-md rounded-2xl text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer text-white ${
                      sol.category === 'Residential'
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                        : sol.category === 'Commercial'
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25'
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25'
                    }`}
                  >
                    <span>{sol.subtitle} 맞춤 상담 예약하기</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 animate-pulse" />
                  </button>
                  <span className="text-[11px] text-slate-400 font-bold block">
                    * 국고 보조금 예산 마감 전 신청을 적극 권장드립니다.
                  </span>
                </div>

                {/* 2. Visuals & Details Block */}
                <div className="space-y-6 pt-2">
                  <div className="space-y-1">
                    <span className="text-blue-600 font-extrabold text-[10px] tracking-widest uppercase block">SOLUTION DETAIL BROCHURE</span>
                    <h4 className="text-base font-black text-slate-900">{sol.title} 상세안내 카탈로그</h4>
                  </div>

                  {/* Adaptive Detail / Brochure Viewer (Fully expanded single page design - 100% height object-contain) */}
                  <div className="flex flex-col rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-950 w-full group/banner relative">
                    <div className="w-full h-auto flex flex-col items-center justify-center bg-slate-950 p-1">
                      <img
                        src={sol.detailImageUrl || sol.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200'}
                        alt={`${sol.title} 상세페이지 카탈로그`}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto object-contain rounded-2xl"
                      />
                    </div>
                  </div>

                  {/* Recommended Products & Specifications Grid */}
                  {sol.recommendedProducts && sol.recommendedProducts.length > 0 && sol.category !== 'Commercial' && (() => {
                    const activeProdId = selectedProductIds[sol.id] || sol.recommendedProducts[0];
                    const selectedProd = PRODUCTS.find(p => p.id === activeProdId) || PRODUCTS.find(p => p.id === sol.recommendedProducts[0]);
                    const viewerMode = visualViewerMode[sol.id] || 'product';

                    return (
                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
                          <span className="text-[10px] text-blue-600 font-extrabold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 self-start sm:self-center leading-relaxed">
                            💡 {sol.subtitle}에 추천하는 대표 기종의 실물과 스펙을 비교해 보세요.
                          </span>
                        </div>

                        {/* Product Model Selection Tab Buttons */}
                        <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-200/60">
                          {sol.recommendedProducts.map(prodId => {
                            const prod = PRODUCTS.find(p => p.id === prodId);
                            if (!prod) return null;
                            const isSelected = activeProdId === prodId;
                            return (
                              <button
                                key={prod.id}
                                onClick={() => setSelectedProductIds(prev => ({ ...prev, [sol.id]: prodId }))}
                                className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                }`}
                              >
                                <Zap className={`w-3 h-3 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
                                <span>{prod.name.replace('SY-', '')}</span>
                                <span className={`text-[9px] font-bold px-1 rounded ${
                                  isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-500'
                                }`}>
                                  {prod.power}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Interactive Detail Catalogue Frame */}
                        {selectedProd && (
                          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 p-4 bg-slate-50/50 border border-slate-200/60 rounded-3xl">
                            {/* Left View Column (Product Image OR Long Infographic Blueprint) */}
                            <div className="xl:col-span-5 space-y-3">
                              {/* Visual Toggle Tabs */}
                              <div className="grid grid-cols-2 gap-1 bg-slate-200/60 p-1 rounded-xl">
                                <button
                                  onClick={() => setVisualViewerMode(prev => ({ ...prev, [sol.id]: 'product' }))}
                                  className={`py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                    viewerMode === 'product'
                                      ? 'bg-white text-slate-950 shadow-sm'
                                      : 'text-slate-500 hover:text-slate-800'
                                  }`}
                                >
                                  📸 실물 상세 사진
                                </button>
                                <button
                                  onClick={() => setVisualViewerMode(prev => ({ ...prev, [sol.id]: 'catalog' }))}
                                  className={`py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                    viewerMode === 'catalog'
                                      ? 'bg-blue-600 text-white shadow-sm'
                                      : 'text-slate-500 hover:text-slate-800'
                                  }`}
                                >
                                  📐 긴 사양서·시공 도면
                                </button>
                              </div>

                              {/* Interactive Canvas Container */}
                              <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-white h-72 md:h-80 shadow-inner flex flex-col justify-center items-center">
                                {viewerMode === 'product' ? (
                                  <>
                                    <img
                                      src={selectedProd.image}
                                      alt={selectedProd.name}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-contain p-4 transition-transform hover:scale-105 duration-500"
                                    />
                                    <div className="absolute top-3 left-3 bg-slate-900/80 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                                      정품 촬영 실사컷
                                    </div>
                                  </>
                                ) : (
                                  <div className="w-full h-full overflow-y-auto scrollbar-thin p-1.5 space-y-2 relative bg-slate-950">
                                    <img
                                      src={sol.blueprintImageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200'}
                                      alt={`${selectedProd.name} 상세 스펙 도면`}
                                      referrerPolicy="no-referrer"
                                      className="w-full object-contain"
                                    />
                                    {/* Additional detailed catalog specs card drawn inside the viewer dynamically to act as a long catalog */}
                                    <div className="p-3 bg-slate-900 text-white rounded-xl space-y-2 text-[9px] border border-white/10 font-mono">
                                      <p className="text-blue-400 font-extrabold border-b border-white/10 pb-1">⚡ SYSTEM WIRING SCHEMA</p>
                                      <div className="space-y-1 text-slate-300">
                                        <p>• 설계유형: {sol.subtitle} 최적형 전력 분기반 설계</p>
                                        <p>• 권장차단기: {selectedProd.power === '7kW' ? 'ELB 2P 40A' : selectedProd.power === '11kW' ? 'ELB 4P 32A' : 'MCCB 3P 150A이상'}</p>
                                        <p>• 권장케이블: {selectedProd.power === '7kW' ? 'F-CV 6sq x 2C' : selectedProd.power === '11kW' ? 'F-CV 6sq x 4C' : 'F-CV 35sq 이상'}</p>
                                        <p>• 스마트 부하 매칭 제어: Dynamic DLB v2.4 자동 제어 모듈 활성화</p>
                                      </div>
                                    </div>
                                    <div className="absolute bottom-2 left-2 right-2 bg-blue-600/95 text-white font-bold text-[8px] py-1 px-2 rounded-md text-center shadow-lg backdrop-blur-xs">
                                      💡 마우스 스크롤 또는 터치로 상세 설명과 시공 상세도를 보실 수 있습니다.
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right Description & Specs Column */}
                            <div className="xl:col-span-7 space-y-3.5 flex flex-col justify-between">
                              <div className="space-y-2.5">
                                {/* Badges */}
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-[9px] font-black px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                                    {selectedProd.power} 출력
                                  </span>
                                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                                    selectedProd.type === '급속' || selectedProd.type === '초급속'
                                      ? 'bg-indigo-100 text-indigo-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}>
                                    {selectedProd.type}형 모델
                                  </span>
                                  {selectedProd.plcSupported && (
                                    <span className="text-[9px] font-black px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 rounded-md flex items-center gap-0.5">
                                      🔥 화재예방 완벽 대응 (PLC탑재)
                                    </span>
                                  )}
                                </div>

                                {/* Title & Text */}
                                <div>
                                  <h5 className="font-extrabold text-sm md:text-base text-slate-900 tracking-tight flex items-center gap-1.5">
                                    {selectedProd.name}
                                  </h5>
                                  <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
                                    {selectedProd.description}
                                  </p>
                                </div>

                                {/* Features Checklist */}
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase">
                                    🔑 정품 특허 및 주요 탑재 기능 설명
                                  </span>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                    {selectedProd.features.map(feat => (
                                      <div key={feat} className="flex items-center gap-1.5 text-[10px] text-slate-700 bg-white/80 p-1.5 rounded-lg border border-slate-200/50 shadow-2xs font-bold">
                                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                        <span>{feat}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Detailed Technical Specifications Grid Table */}
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase">
                                    📋 상세 기기 엔지니어링 규격표
                                  </span>
                                  <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                                    <table className="w-full text-left border-collapse text-[10px]">
                                      <tbody>
                                        {Object.entries(selectedProd.specs).map(([key, value], idx) => (
                                          <tr key={key} className={`border-b border-slate-100 last:border-0 ${idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}`}>
                                            <td className="px-3 py-2 font-black text-slate-500 w-1/3 border-r border-slate-100">{key}</td>
                                            <td className="px-3 py-2 font-bold text-slate-800">{value}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>

                              {/* Link directly to dedicated products segment for more reviews */}
                              <div className="pt-2 text-right">
                                <button
                                  onClick={() => {
                                    if (onPageChange) {
                                      onPageChange('products');
                                      setTimeout(() => {
                                        const el = document.getElementById(`product-card-${selectedProd.id}`);
                                        if (el) {
                                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                          el.classList.add('ring-4', 'ring-blue-500', 'ring-offset-2');
                                          setTimeout(() => {
                                            el.classList.remove('ring-4', 'ring-blue-500', 'ring-offset-2');
                                          }, 2000);
                                        }
                                      }, 300);
                                    }
                                  }}
                                  className="text-[10px] font-black text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <span>이 충전기의 더 자세한 시공 견적 &amp; 상품 리뷰 보러가기</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Capacity & Standard selection FAQ help banner */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6 shadow-xl">
        <div className="max-w-2xl">
          <span className="text-blue-400 font-bold text-xs uppercase tracking-wider block">GUIDE &amp; INFORMATION</span>
          <h3 className="text-xl md:text-2xl font-black tracking-tight mt-1">우리 현장에 알맞은 충전 용량은 얼마일까요?</h3>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed font-medium">
            건물의 계약 전력 상태와 방문자 체류 시간에 따라 최적의 충전 용량 설계가 달라집니다. 충전기를 잘못 시공하면 추가적인 전력 증설 공사비(한전 불입금)가 수천만 원까지 청구될 수 있으므로, 반드시 전문가 진단을 거쳐야 합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="font-extrabold text-sm block border-b border-white/10 pb-2 mb-2 text-blue-400">7kW 완속 충전</span>
            <p className="text-xs text-slate-300 leading-normal mb-2 font-medium">
              주거 공간(아파트, 주택), 오피스 빌딩 장기 주차 구역에 설치. 완충 시간 약 8~10시간.
            </p>
            <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded font-bold">일반 가전 계량기 신설 추천</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="font-extrabold text-sm block border-b border-white/10 pb-2 mb-2 text-indigo-400">11kW 고성능 완속</span>
            <p className="text-xs text-slate-300 leading-normal mb-2 font-medium">
              상가 빌딩, 호텔, 기업 사옥 등 주차 시간이 약 4~6시간 내외로 유동적인 상업지 맞춤형 사양.
            </p>
            <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded font-bold">스마트 분배 부하제어 탑재</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="font-extrabold text-sm block border-b border-white/10 pb-2 mb-2 text-cyan-400">50kW~200kW 급속</span>
            <p className="text-xs text-slate-300 leading-normal mb-2 font-medium">
              물류허브, 화물차 차고지, 대형 쇼핑몰 등 30분 내외의 회전율과 충전 수익 창출이 주 목적인 곳.
            </p>
            <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded font-bold">무상 원격 정산관제 제공</span>
          </div>
        </div>
      </section>
    </div>
  );
}
