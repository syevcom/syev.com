/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Solution, ActivePage } from '../types';
import { Check, ArrowRight, Zap, RefreshCw, Building2, Home, ParkingCircle, Layers, Image, FileText, Trash2, Upload, ExternalLink, X, Plus, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../data';
import PdfImageRenderer from './PdfImageRenderer';
import { saveBrandPdf, deleteBrandPdf, loadAllBrandPdfs } from '../lib/indexedDb';

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

export interface SolutionProduct {
  id: string;
  name: string;
  description: string;
  regularPrice: number;
  price: number;
  discount: number;
  image: string;
  tags: string[];
  hasASBadge?: boolean;
  hasPromoRibbon?: boolean;
  summaryInfo?: string;
  deliveryMethod?: string;
  shippingFee?: string;
  paymentMethod?: string;
  optionLabel?: string;
  options?: { id: string; label: string; price: number }[];
}

export const HOME_PRODUCTS_DATA: Record<string, SolutionProduct[]> = {
  '5kW': [
    {
      id: 'res-5kw-spil',
      name: '스필 5kW 개인용 전기차 충전기 무상AS 4년',
      description: '[국내최초 무상A/S 4년] 가정용충전기, 공장용충전기, 회사용충전기, 창고용충전기',
      regularPrice: 543636,
      price: 460000,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
      tags: ['MD CHOICE', 'HIT'],
      hasASBadge: true,
      hasPromoRibbon: true
    },
    {
      id: 'res-5kw-electree',
      name: '일렉트리 5kW 개인용 전기차 충전기',
      description: '가정용충전기, 공장용충전기, 회사용충전기, 창고용충전기',
      regularPrice: 436364,
      price: 370000,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=600',
      tags: ['MD CHOICE', 'HIT']
    },
    {
      id: 'res-5kw-convenient',
      name: '편리 5kW 개인용 전기차 충전기',
      description: '가정용충전기, 공장용충전기, 회사용충전기, 창고용충전기',
      regularPrice: 409091,
      price: 350000,
      discount: 14,
      image: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&q=80&w=600',
      tags: ['MD CHOICE']
    },
    {
      id: 'res-5kw-chargego',
      name: '차지고 5kW 개인용 전기차 충전기',
      description: '[예약충전 기능] 충전본체 분해없이 설치가능, 자가교체 가능한 커플러',
      regularPrice: 409091,
      price: 350000,
      discount: 14,
      image: 'https://images.unsplash.com/photo-1695653422718-97d137aac987?auto=format&fit=crop&q=80&w=600',
      tags: ['HIT']
    },
    {
      id: 'res-5kw-safe',
      name: '안심 5kW 컴팩트 실속형 홈 충전기',
      description: '한전 승압 불필요, 전기 안전 제어 센서 탑재 초소형 컴팩트 기종',
      regularPrice: 380000,
      price: 330000,
      discount: 13,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
      tags: ['실속형']
    }
  ],
  '7kW': [
    {
      id: 'res-7kw-spil',
      name: '스필 7kW 개인용 전기차 충전기 무상AS 4년',
      description: '[국내최초 무상A/S 4년] 화재 감지 자동 전력 차단 가정용 완속 충전 베스트셀러',
      regularPrice: 580000,
      price: 490000,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
      tags: ['MD CHOICE', 'HIT'],
      hasASBadge: true,
      hasPromoRibbon: true
    },
    {
      id: 'res-7kw-evsis',
      name: '롯데 이브이시스 7kW 스마트홈 충전기',
      description: '초소형 세련된 북유럽풍 미니멀 디자인, 블루투스 인증 예약 충전 기능',
      regularPrice: 980000,
      price: 850000,
      discount: 13,
      image: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&q=80&w=600',
      tags: ['PREMIUM', 'BEST']
    },
    {
      id: 'res-7kw-convenient',
      name: '편리 7kW 스마트 예약 홈충전기',
      description: '안정적인 출력 제어, 고휘도 직관적 LED 상태 표시 및 과전류 방지 센서',
      regularPrice: 480000,
      price: 410000,
      discount: 14,
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=600',
      tags: ['MD CHOICE']
    },
    {
      id: 'res-7kw-chargego',
      name: '차지고 7kW 콤팩트 완속 충전기',
      description: '가정 및 빌라 실외 설치용 고강도 방수/방진 IP55 인증 최적화 하드웨어',
      regularPrice: 470000,
      price: 400000,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1695653422718-97d137aac987?auto=format&fit=crop&q=80&w=600',
      tags: ['HIT']
    },
    {
      id: 'res-7kw-safe',
      name: '안심 7kW 표준형 실속 홈 충전기',
      description: '베이직 가성비 홈 충전 솔루션, 5m 난연 실리콘 고품질 케이블 기본 증정',
      regularPrice: 445000,
      price: 380000,
      discount: 14,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
      tags: ['실속형']
    },
    {
      id: 'res-7kw-hyundai',
      name: '현대 전기차 홈 7kW 슬림형 충전기',
      description: '현대/기아 공식 협력사 품질 인증, 고감도 자가 진단 및 화재 감지 안심 충전',
      regularPrice: 520000,
      price: 440000,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=600',
      tags: ['공식인증', 'HIT']
    },
    {
      id: 'res-7kw-pylon',
      name: '파일런 7kW 컴팩트 고효율 충전기',
      description: '벽부형 및 스탠드 겸용, 야외 가혹 환경에서도 든든한 IP56 등급 완전 방수 설계',
      regularPrice: 460000,
      price: 390000,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&q=80&w=600',
      tags: ['가성비', 'IP56방수']
    }
  ],
  '11kW': [
    {
      id: 'res-11kw-spil',
      name: '스필 11kW 프리미엄 개인용 충전기 무상AS 4년',
      description: '[국내최초 무상A/S 4년] 3상 11kW 초고속 완속 프리미엄 특화 모델',
      regularPrice: 780000,
      price: 650000,
      discount: 16,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
      tags: ['MD CHOICE', 'HIT'],
      hasASBadge: true,
      hasPromoRibbon: true
    },
    {
      id: 'res-11kw-evsis',
      name: '롯데 이브이시스 11kW 스마트 프리미엄',
      description: 'OCPP 1.6 통신 모듈, 스마트 RFID 본인 인증 및 예약 제어 시스템',
      regularPrice: 1450000,
      price: 1250000,
      discount: 13,
      image: 'https://images.unsplash.com/photo-1695653422718-97d137aac987?auto=format&fit=crop&q=80&w=600',
      tags: ['PREMIUM', 'BEST']
    }
  ]
};

export const PARKING_PRODUCTS_DATA: Record<string, SolutionProduct[]> = {
  '공용 BIZ 충전기': [
    {
      id: 'park-11kw-evsis',
      name: '롯데 이브이시스 11kW 수익형 완속 충전기',
      description: 'RFID 및 전용 앱 정산 수수료 정산 관제망 탑재, 사업 수익 정산용 고효율 모델',
      regularPrice: 1450000,
      price: 1250000,
      discount: 13,
      image: 'https://images.unsplash.com/photo-1695653422718-97d137aac987?auto=format&fit=crop&q=80&w=600',
      tags: ['BEST', 'HIT'],
      hasPromoRibbon: true
    },
    {
      id: 'park-11kw-spil',
      name: '스필 11kW 공용 수익형 완속 충전기',
      description: 'OCPP 1.6 국토부 공인 프로토콜 적용 및 스마트 부하 배분(DLB) 탑재',
      regularPrice: 1200000,
      price: 1020000,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
      tags: ['MD CHOICE', 'HIT']
    },
    {
      id: 'park-11kw-convenient',
      name: '편리 11kW 수익형 스마트 완속 충전기',
      description: '상업용 간편 QR 정산 연동, 소상공인 펜션 식당 주차장 설치 시 최강의 부가수익 창출',
      regularPrice: 1120000,
      price: 980000,
      discount: 12,
      image: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&q=80&w=600',
      tags: ['QR간편정산']
    },
    {
      id: 'park-50kw-sy',
      name: 'SY-DC50 슬림형 공용 수익형 급속 충전기',
      description: '30분 초단기 80% 완벽 급속 충전, 대형 터치 모니터 및 회원/비회원 간편 결제',
      regularPrice: 11500000,
      price: 9800000,
      discount: 14,
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=600',
      tags: ['MD CHOICE', 'HIT'],
      hasPromoRibbon: true
    }
  ]
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
  selectedParkingCapacity?: string;
  onSelectParkingCapacity?: (capacity: string) => void;
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
  onSelectHomePower,
  selectedParkingCapacity = '공용 BIZ 충전기',
  onSelectParkingCapacity
 }: SolutionsSectionProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'Commercial' | 'Residential' | 'ParkingLot'>(defaultActiveTab);
  const [selectedProductIds, setSelectedProductIds] = useState<Record<string, string>>({});
  const [visualViewerMode, setVisualViewerMode] = useState<Record<string, 'product' | 'catalog'>>({});
  const [solutionTabs, setSolutionTabs] = useState<Record<string, 'specs' | 'infographic'>>({});
  const [localBannerModes, setLocalBannerModes] = useState<Record<string, 'cover' | 'unfold'>>({});
  const [localDetailModes, setLocalDetailModes] = useState<Record<string, 'scroll' | 'unfold'>>({});
  const [sortBy, setSortBy] = useState<'new' | 'priceAsc' | 'priceDesc' | 'popular'>('new');
  const [activeDetailProduct, setActiveDetailProduct] = useState<SolutionProduct | null>(null);
  const [productDetails, setProductDetails] = useState<Record<string, { pdfUrl?: string; pdfName?: string }>>({});
  
  const [selectedConnector, setSelectedConnector] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isDetailEditing, setIsDetailEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editRegularPrice, setEditRegularPrice] = useState(0);
  const [editDiscount, setEditDiscount] = useState(0);
  const [editDelivery, setEditDelivery] = useState('');
  const [editShipping, setEditShipping] = useState('');
  const [editPayment, setEditPayment] = useState('');
  const [editOptionLabel, setEditOptionLabel] = useState('');
  const [editOptions, setEditOptions] = useState<{ id: string; label: string; price: number }[]>([]);
  const [isDraggingProductImage, setIsDraggingProductImage] = useState(false);

  useEffect(() => {
    setSelectedConnector('');
    setQuantity(1);
    setIsDetailEditing(false);
  }, [activeDetailProduct]);

  useEffect(() => {
    if (activeDetailProduct) {
      setEditName(activeDetailProduct.name || '');
      setEditImage(activeDetailProduct.image || '');
      setEditSummary(activeDetailProduct.summaryInfo || activeDetailProduct.description || '');
      setEditPrice(activeDetailProduct.price || 0);
      setEditRegularPrice(activeDetailProduct.regularPrice || 0);
      setEditDiscount(activeDetailProduct.discount || 0);
      setEditDelivery(activeDetailProduct.deliveryMethod || '택배');
      setEditShipping(activeDetailProduct.shippingFee || '무료');
      setEditPayment(activeDetailProduct.paymentMethod || '무통장입금');
      setEditOptionLabel(activeDetailProduct.optionLabel || '커넥터길이');
      setEditOptions(activeDetailProduct.options || [
        { id: '5m', label: '5m 커넥터 일체형 (기본 장착)', price: 0 },
        { id: '7m', label: '7m 연장형 (+30,000원)', price: 30000 },
        { id: '10m', label: '10m 최장 전용선 (+50,000원)', price: 50000 }
      ]);
    }
  }, [activeDetailProduct, isDetailEditing]);

  const handleSaveProductDetails = () => {
    if (!activeDetailProduct) return;
    updateProductDetails(activeDetailProduct.id, {
      name: editName,
      image: editImage,
      description: editSummary,
      summaryInfo: editSummary,
      price: editPrice,
      regularPrice: editRegularPrice,
      discount: editDiscount,
      deliveryMethod: editDelivery,
      shippingFee: editShipping,
      paymentMethod: editPayment,
      optionLabel: editOptionLabel,
      options: editOptions
    });
    setIsDetailEditing(false);
    setToastMessage('💾 상품 수정 정보와 커넥터 옵션이 성공적으로 저장되었습니다!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [homeProducts, setHomeProducts] = useState<Record<string, SolutionProduct[]>>(() => {
    const saved = localStorage.getItem('sy_cms_home_products_v3_fixed');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return HOME_PRODUCTS_DATA;
      }
    }
    return HOME_PRODUCTS_DATA;
  });

  const [parkingProducts, setParkingProducts] = useState<Record<string, SolutionProduct[]>>(() => {
    const saved = localStorage.getItem('sy_cms_parking_products_v4_fixed');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return PARKING_PRODUCTS_DATA;
      }
    }
    return PARKING_PRODUCTS_DATA;
  });

  // Product CRUD states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SolutionProduct | null>(null);
  const [editingProductType, setEditingProductType] = useState<'home' | 'parking'>('home');
  const [editingCategory, setEditingCategory] = useState<string>('7kW');

  // Product Form states
  const [prodFormName, setProdFormName] = useState('');
  const [prodFormRegularPrice, setProdFormRegularPrice] = useState(0);
  const [prodFormPrice, setProdFormPrice] = useState(0);
  const [prodFormDiscount, setProdFormDiscount] = useState(0);
  const [prodFormImage, setProdFormImage] = useState('');
  const [prodFormTags, setProdFormTags] = useState('');
  const [prodFormHasASBadge, setProdFormHasASBadge] = useState(false);
  const [prodFormHasPromoRibbon, setProdFormHasPromoRibbon] = useState(false);

  // Sync to activeDetailProduct if it changed or was updated in real-time
  useEffect(() => {
    if (activeDetailProduct) {
      // Find up-to-date info if it was edited
      let found: SolutionProduct | undefined = undefined;
      if (activeDetailProduct.id.startsWith('res-')) {
        Object.values(homeProducts).forEach((arr) => {
          const typedArr = arr as SolutionProduct[];
          const match = typedArr.find(p => p.id === activeDetailProduct.id);
          if (match) found = match;
        });
      } else {
        Object.values(parkingProducts).forEach((arr) => {
          const typedArr = arr as SolutionProduct[];
          const match = typedArr.find(p => p.id === activeDetailProduct.id);
          if (match) found = match;
        });
      }
      if (found) {
        setActiveDetailProduct(found);
      }
    }
  }, [homeProducts, parkingProducts]);

  const saveHomeProducts = (data: Record<string, SolutionProduct[]>) => {
    setHomeProducts(data);
    try {
      localStorage.setItem('sy_cms_home_products_v3_fixed', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save home products to localStorage:', e);
    }
  };

  const saveParkingProducts = (data: Record<string, SolutionProduct[]>) => {
    setParkingProducts(data);
    try {
      localStorage.setItem('sy_cms_parking_products_v4_fixed', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save parking products to localStorage:', e);
    }
  };

  const updateProductDetails = (productId: string, updatedFields: Partial<SolutionProduct>) => {
    if (productId.startsWith('res-')) {
      const updated = { ...homeProducts };
      let found = false;
      Object.keys(updated).forEach((category) => {
        const arr = [...(updated[category] || [])];
        const index = arr.findIndex(p => p.id === productId);
        if (index !== -1) {
          arr[index] = { ...arr[index], ...updatedFields };
          updated[category] = arr;
          found = true;
        }
      });
      if (found) {
        saveHomeProducts(updated);
        setActiveDetailProduct(prev => prev && prev.id === productId ? { ...prev, ...updatedFields } : prev);
      }
    } else {
      const updated = { ...parkingProducts };
      let found = false;
      Object.keys(updated).forEach((category) => {
        const arr = [...(updated[category] || [])];
        const index = arr.findIndex(p => p.id === productId);
        if (index !== -1) {
          arr[index] = { ...arr[index], ...updatedFields };
          updated[category] = arr;
          found = true;
        }
      });
      if (found) {
        saveParkingProducts(updated);
        setActiveDetailProduct(prev => prev && prev.id === productId ? { ...prev, ...updatedFields } : prev);
      }
    }
  };

  const [brands, setBrands] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem('sy_cms_brands');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Automatically clean up heavy base64 pdfUrls from localStorage to free up quota
        let hasHeavy = false;
        const cleaned: Record<string, any> = {};
        Object.keys(parsed).forEach(k => {
          cleaned[k] = { ...parsed[k] };
          if (cleaned[k].pdfUrl) {
            cleaned[k].pdfUrl = undefined;
            hasHeavy = true;
          }
        });
        if (hasHeavy) {
          try {
            localStorage.setItem('sy_cms_brands', JSON.stringify(cleaned));
          } catch (err) {
            console.error('Failed to save cleaned brands to localStorage:', err);
          }
        }
        return { ...BRAND_METADATA, ...cleaned };
      } catch (e) {
        return BRAND_METADATA;
      }
    }
    return BRAND_METADATA;
  });

  // Load PDFs from IndexedDB on component mount to merge with metadata state
  useEffect(() => {
    let isMounted = true;
    const loadPdfs = async () => {
      try {
        const storedPdfs = await loadAllBrandPdfs();
        if (isMounted && Object.keys(storedPdfs).length > 0) {
          const brandPdfs: Record<string, any> = {};
          const prodDetails: Record<string, any> = {};
          
          Object.keys(storedPdfs).forEach(key => {
            if (key.startsWith('product-')) {
              prodDetails[key] = storedPdfs[key];
            } else {
              brandPdfs[key] = storedPdfs[key];
            }
          });

          setBrands(prev => {
            const updated = { ...prev };
            Object.keys(brandPdfs).forEach(brandKey => {
              if (updated[brandKey]) {
                updated[brandKey] = {
                  ...updated[brandKey],
                  pdfUrl: brandPdfs[brandKey].pdfUrl,
                  pdfName: brandPdfs[brandKey].pdfName
                };
              }
            });
            return updated;
          });

          setProductDetails(prodDetails);
        }
      } catch (err) {
        console.error('Error loading brand PDFs from IndexedDB:', err);
      }
    };
    loadPdfs();
    return () => {
      isMounted = false;
    };
  }, []);

  const [isDraggingProductPdf, setIsDraggingProductPdf] = useState<Record<string, boolean>>({});

  const handleProductPdfUpload = (productId: string, file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (!isPdf && !isImage) {
      alert('PDF 파일 또는 이미지 파일(PNG/JPG/JPEG)만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result as string;
      const key = `product-${productId}`;
      try {
        await saveBrandPdf(key, dataUrl, file.name);
        setProductDetails(prev => ({
          ...prev,
          [key]: {
            pdfUrl: dataUrl,
            pdfName: file.name
          }
        }));
      } catch (dbError) {
        console.error('Failed to save product detail to IndexedDB:', dbError);
        alert('데이터 저장에 실패했습니다. 프라이빗 브라우징 모드를 해제해 주십시오.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteProductPdf = async (productId: string) => {
    const key = `product-${productId}`;
    try {
      await deleteBrandPdf(key);
      setProductDetails(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    } catch (dbError) {
      console.error('Failed to delete product detail from IndexedDB:', dbError);
    }
  };

  const startAddProduct = (type: 'home' | 'parking', category: string) => {
    setEditingProduct(null);
    setEditingProductType(type);
    setEditingCategory(category);
    
    setProdFormName('');
    setProdFormRegularPrice(500000);
    setProdFormPrice(400000);
    setProdFormDiscount(20);
    setProdFormImage('https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600');
    setProdFormTags(type === 'home' ? 'MD CHOICE, HIT' : 'BEST, HIT');
    setProdFormHasASBadge(type === 'home');
    setProdFormHasPromoRibbon(false);
    
    setIsProductModalOpen(true);
  };

  const startEditProduct = (product: SolutionProduct, type: 'home' | 'parking', category: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setEditingProduct(product);
    setEditingProductType(type);
    setEditingCategory(category);

    setProdFormName(product.name);
    setProdFormRegularPrice(product.regularPrice);
    setProdFormPrice(product.price);
    setProdFormDiscount(product.discount);
    setProdFormImage(product.image);
    setProdFormTags(product.tags.join(', '));
    setProdFormHasASBadge(!!product.hasASBadge);
    setProdFormHasPromoRibbon(!!product.hasPromoRibbon);

    setIsProductModalOpen(true);
  };

  const deleteProduct = (productId: string, type: 'home' | 'parking', category: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!window.confirm('정말 이 상품을 삭제하시겠습니까?')) {
      return;
    }

    if (type === 'home') {
      const updated = { ...homeProducts };
      if (updated[category]) {
        updated[category] = updated[category].filter(p => p.id !== productId);
        saveHomeProducts(updated);
      }
    } else {
      const updated = { ...parkingProducts };
      if (updated[category]) {
        updated[category] = updated[category].filter(p => p.id !== productId);
        saveParkingProducts(updated);
      }
    }
  };

  const saveProductForm = () => {
    if (!prodFormName.trim()) {
      alert('상품명을 입력해 주세요.');
      return;
    }

    const tagsArray = prodFormTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const calculatedDiscount = prodFormRegularPrice > 0 
      ? Math.round(((prodFormRegularPrice - prodFormPrice) / prodFormRegularPrice) * 100)
      : prodFormDiscount;

    if (editingProduct) {
      // Edit mode
      if (editingProductType === 'home') {
        const updated = { ...homeProducts };
        if (updated[editingCategory]) {
          updated[editingCategory] = updated[editingCategory].map(p => {
            if (p.id === editingProduct.id) {
              return {
                ...p,
                name: prodFormName,
                regularPrice: Number(prodFormRegularPrice),
                price: Number(prodFormPrice),
                discount: calculatedDiscount,
                image: prodFormImage,
                tags: tagsArray,
                hasASBadge: prodFormHasASBadge,
                hasPromoRibbon: prodFormHasPromoRibbon
              };
            }
            return p;
          });
          saveHomeProducts(updated);
        }
      } else {
        const updated = { ...parkingProducts };
        if (updated[editingCategory]) {
          updated[editingCategory] = updated[editingCategory].map(p => {
            if (p.id === editingProduct.id) {
              return {
                ...p,
                name: prodFormName,
                regularPrice: Number(prodFormRegularPrice),
                price: Number(prodFormPrice),
                discount: calculatedDiscount,
                image: prodFormImage,
                tags: tagsArray,
                hasASBadge: prodFormHasASBadge,
                hasPromoRibbon: prodFormHasPromoRibbon
              };
            }
            return p;
          });
          saveParkingProducts(updated);
        }
      }
    } else {
      // Add mode
      const newId = `${editingProductType === 'home' ? 'res' : 'park'}-custom-${Date.now()}`;
      const newProduct: SolutionProduct = {
        id: newId,
        name: prodFormName,
        description: editingProductType === 'home' ? '가정용충전기, 공장용충전기, 회사용충전기, 창고용충전기' : '상업용 간편 QR 정산 연동 부가수익 창출',
        regularPrice: Number(prodFormRegularPrice),
        price: Number(prodFormPrice),
        discount: calculatedDiscount,
        image: prodFormImage,
        tags: tagsArray,
        hasASBadge: prodFormHasASBadge,
        hasPromoRibbon: prodFormHasPromoRibbon
      };

      if (editingProductType === 'home') {
        const updated = { ...homeProducts };
        if (!updated[editingCategory]) updated[editingCategory] = [];
        updated[editingCategory] = [...updated[editingCategory], newProduct];
        saveHomeProducts(updated);
      } else {
        const updated = { ...parkingProducts };
        if (!updated[editingCategory]) updated[editingCategory] = [];
        updated[editingCategory] = [...updated[editingCategory], newProduct];
        saveParkingProducts(updated);
      }
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const [isDraggingPdf, setIsDraggingPdf] = useState<Record<string, boolean>>({});

  const handlePdfUpload = (brandKey: string, file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (!isPdf && !isImage) {
      alert('PDF 파일 또는 이미지 파일(PNG/JPG/JPEG)만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result as string;
      try {
        // 1. Save to IndexedDB (virtually unlimited size)
        await saveBrandPdf(brandKey, dataUrl, file.name);

        // 2. Update local react state
        setBrands(prev => {
          const updated = {
            ...prev,
            [brandKey]: {
              ...prev[brandKey],
              pdfUrl: dataUrl,
              pdfName: file.name
            }
          };

          // 3. Sync to localStorage, completely stripping heavy pdfUrl values to prevent quota issues
          try {
            const lightweight: Record<string, any> = {};
            Object.keys(updated).forEach(k => {
              lightweight[k] = {
                ...updated[k],
                pdfUrl: undefined, // never store heavy file strings in localStorage
                pdfName: updated[k].pdfName
              };
            });
            localStorage.setItem('sy_cms_brands', JSON.stringify(lightweight));
          } catch (storageError) {
            console.error('Failed to save brand metadata to localStorage:', storageError);
          }
          return updated;
        });
      } catch (dbError) {
        console.error('Failed to save to IndexedDB:', dbError);
        alert('브라우저 데이터베이스(IndexedDB) 저장에 실패했습니다. 프라이빗 브라우징 모드를 해제해 주십시오.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePdf = async (brandKey: string) => {
    try {
      // 1. Delete from IndexedDB
      await deleteBrandPdf(brandKey);

      // 2. Update react state
      setBrands(prev => {
        const updated = {
          ...prev,
          [brandKey]: {
            ...prev[brandKey],
            pdfUrl: undefined,
            pdfName: undefined
          }
        };

        // 3. Update localStorage
        try {
          const lightweight: Record<string, any> = {};
          Object.keys(updated).forEach(k => {
            lightweight[k] = {
              ...updated[k],
              pdfUrl: undefined,
              pdfName: undefined
            };
          });
          localStorage.setItem('sy_cms_brands', JSON.stringify(lightweight));
        } catch (storageError) {
          console.error('Failed to update localStorage on delete:', storageError);
        }
        return updated;
      });
    } catch (dbError) {
      console.error('Failed to delete from IndexedDB:', dbError);
    }
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

  if (activeDetailProduct) {
    const productPurpose = activeDetailProduct.id.startsWith('res-') ? 'Residential' : 'ParkingLot';
    const detailKey = `product-${activeDetailProduct.id}`;
    const detailData = productDetails[detailKey];
    
    // Extract power to display correct specs dynamically
    let powerKey = '7kW';
    if (activeDetailProduct.name.includes('5kW')) powerKey = '5kW';
    else if (activeDetailProduct.name.includes('11kW')) powerKey = '11kW';
    else if (activeDetailProduct.name.includes('50kW')) powerKey = '50kW 급속';
    else if (activeDetailProduct.name.includes('100kW')) powerKey = '100kW+ 초급속';

    const formatPrice = (val: number) => val.toLocaleString() + '원';

    const defaultOptions = [
      { id: '5m', label: '5m 커넥터 일체형 (기본 장착)', price: 0 },
      { id: '7m', label: '7m 연장형', price: 30000 },
      { id: '10m', label: '10m 최장 전용선', price: 50000 }
    ];

    const productOptions = activeDetailProduct.options || defaultOptions;
    const optionLabel = activeDetailProduct.optionLabel || '커넥터길이';

    // Calculate dynamic extra price based on option
    const selectedOptObj = productOptions.find(o => o.id === selectedConnector);
    const extraOptionPrice = selectedOptObj ? selectedOptObj.price : 0;

    const totalPrice = (activeDetailProduct.price + extraOptionPrice) * quantity;

    const handleBuyNow = () => {
      if (!selectedConnector) {
        setToastMessage('⚠️ [필수] 커넥터 길이 옵션을 선택해 주세요.');
        return;
      }
      setToastMessage('✅ 신청 페이지로 이동합니다. 견적서 정보가 연동됩니다.');
      setTimeout(() => {
        onOpenQuoteWithPurpose(productPurpose);
      }, 500);
    };

    const handleBulkInquiry = () => {
      setToastMessage('📋 대량 구매 및 설치 특별 견적 문의서로 이동합니다.');
      setTimeout(() => {
        onOpenQuoteWithPurpose(productPurpose === 'Residential' ? 'Residential' : 'Commercial');
      }, 500);
    };

    const handleAddToCart = () => {
      if (!selectedConnector) {
        setToastMessage('⚠️ [필수] 커넥터 길이 옵션을 선택해 주세요.');
        return;
      }
      setToastMessage(`🛒 장바구니에 ${activeDetailProduct.name} (${selectedConnector}) ${quantity}개가 담겼습니다.`);
    };

    const handleAddToWishlist = () => {
      setToastMessage(`❤️ 관심 상품으로 등록되었습니다.`);
    };

    return (
      <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fadeIn relative">
        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-black px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700/50 backdrop-blur-md"
            >
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back navigation & Category indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <button
            type="button"
            onClick={() => setActiveDetailProduct(null)}
            className="inline-flex items-center gap-1.5 text-xs font-black text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            ← 전체 상품 리스트로 돌아가기
          </button>
        </div>

        {/* Admin CMS Product Edit Control Bar */}
        {isEditMode && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🛠️</span>
              <div>
                <p className="text-xs font-black text-amber-900">관리자 상품 상세 편집 모드</p>
                <p className="text-[11px] text-amber-700 font-medium">상품명, 가격, 요약설명, 커넥터 옵션, 배송 사양 등을 자유롭게 수정할 수 있습니다.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDetailEditing(!isDetailEditing)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-sm border ${
                isDetailEditing 
                  ? 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700' 
                  : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
              }`}
            >
              {isDetailEditing ? '💾 편집 취소 (상세보기 확인)' : '✍️ 상품 정보 및 옵션 편집하기'}
            </button>
          </div>
        )}

        {isDetailEditing ? (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">✍️</span>
                <h4 className="text-base sm:text-lg font-black text-slate-900">상품 상세 정보 및 커넥터 옵션 직접 수정</h4>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsDetailEditing(false)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-all"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSaveProductDetails}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-md shadow-emerald-500/10"
                >
                  저장하기
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Section: Basic product fields */}
              <div className="space-y-4">
                <span className="text-xs font-extrabold text-blue-600 tracking-wider uppercase block">
                  기본 상품 정보 (Basic Info)
                </span>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5 font-bold">상품명</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-800"
                    placeholder="상품명을 입력해 주세요"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700 font-bold">상품 대표 이미지</label>
                  
                  {editImage ? (
                    <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center p-4">
                      <img 
                        src={editImage} 
                        alt="Preview" 
                        className="max-h-40 object-contain rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const fileInput = document.getElementById('product-image-file-input');
                            fileInput?.click();
                          }}
                          className="px-3 py-1.5 bg-white text-slate-800 rounded-lg text-xs font-black hover:bg-slate-100 transition-all cursor-pointer shadow-sm"
                        >
                          이미지 변경
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditImage('')}
                          className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-black hover:bg-rose-700 transition-all cursor-pointer shadow-sm"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingProductImage(true);
                      }}
                      onDragLeave={() => {
                        setIsDraggingProductImage(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingProductImage(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file && file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          alert('이미지 파일(PNG, JPG, JPEG, GIF 등)만 업로드할 수 있습니다.');
                        }
                      }}
                      onClick={() => document.getElementById('product-image-file-input')?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
                        isDraggingProductImage
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-300 bg-slate-50 hover:bg-slate-100/50 hover:border-blue-400'
                      }`}
                    >
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-xs font-extrabold text-slate-700">
                        클릭하거나 이미지를 드래그하여 드롭하세요
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">
                        지원형식: PNG, JPG, JPEG, WebP, GIF
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    id="product-image-file-input"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />

                  {/* Optional URL Input field at the bottom */}
                  <div className="pt-1">
                    <details className="group">
                      <summary className="text-[11px] text-slate-500 hover:text-slate-700 cursor-pointer list-none flex items-center gap-1 font-bold">
                        <span className="transition-transform group-open:rotate-90">▶</span>
                        이미지 링크(URL) 직접 입력하기
                      </summary>
                      <div className="mt-2 pl-3 border-l-2 border-slate-200">
                        <input
                          type="text"
                          value={editImage}
                          onChange={(e) => setEditImage(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                          placeholder="https://example.com/image.jpg 형식의 URL 직접 입력"
                        />
                      </div>
                    </details>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5 font-bold">상품 요약 정보 (설명)</label>
                  <textarea
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    rows={3}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                    placeholder="상품에 대한 간단한 설명을 적어주세요"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5 font-bold">정상 가격 (원)</label>
                    <input
                      type="number"
                      value={editRegularPrice}
                      onChange={(e) => setEditRegularPrice(Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5 font-bold">공급 혜택가 (원)</label>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5 font-bold">할인율 (%)</label>
                    <input
                      type="number"
                      value={editDiscount}
                      onChange={(e) => setEditDiscount(Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-rose-600"
                    />
                  </div>
                </div>
              </div>

              {/* Right Section: Specs & Custom Options */}
              <div className="space-y-4">
                <span className="text-xs font-extrabold text-blue-600 tracking-wider uppercase block">
                  상세 사양 및 커넥터 옵션 설정
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5 font-bold">배송방법</label>
                    <input
                      type="text"
                      value={editDelivery}
                      onChange={(e) => setEditDelivery(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5 font-bold">배송비</label>
                    <input
                      type="text"
                      value={editShipping}
                      onChange={(e) => setEditShipping(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5 font-bold">결제수단</label>
                    <input
                      type="text"
                      value={editPayment}
                      onChange={(e) => setEditPayment(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5 font-bold">옵션 대분류명 (예: 커넥터길이, 충전선 사양)</label>
                  <input
                    type="text"
                    value={editOptionLabel}
                    onChange={(e) => setEditOptionLabel(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-black text-slate-700 font-bold">옵션 선택 리스트 항목</label>
                    <button
                      type="button"
                      onClick={() => {
                        const newId = `opt-${Date.now()}`;
                        setEditOptions([...editOptions, { id: newId, label: '새 옵션 항목', price: 0 }]);
                      }}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-[10px] font-black border border-blue-200 transition-colors cursor-pointer"
                    >
                      + 항목 추가
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[180px] overflow-y-auto border border-slate-200 rounded-xl p-3 bg-white shadow-inner">
                    {editOptions.length === 0 ? (
                      <p className="text-[11px] text-slate-400 text-center py-4 font-bold">등록된 옵션 항목이 없습니다.</p>
                    ) : (
                      editOptions.map((opt, idx) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={opt.label}
                            onChange={(e) => {
                              const updated = [...editOptions];
                              updated[idx] = { ...updated[idx], label: e.target.value };
                              setEditOptions(updated);
                            }}
                            className="flex-[2] px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white font-medium"
                            placeholder="옵션 명칭 (예: 7m 연장)"
                          />
                          <div className="flex-1 flex items-center gap-1">
                            <input
                              type="number"
                              value={opt.price}
                              onChange={(e) => {
                                const updated = [...editOptions];
                                updated[idx] = { ...updated[idx], price: Number(e.target.value) };
                                setEditOptions(updated);
                              }}
                              className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-right bg-slate-50 focus:bg-white font-bold"
                              placeholder="추가금"
                            />
                            <span className="text-[10px] text-slate-400 shrink-0 font-bold">원</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editOptions.filter((_, i) => i !== idx);
                              setEditOptions(updated);
                            }}
                            className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-600 rounded-lg border border-transparent hover:border-rose-100 cursor-pointer text-xs font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsDetailEditing(false)}
                className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-all"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveProductDetails}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-md shadow-emerald-500/15"
              >
                💾 설정 저장하기
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: Image & Gallery Thumbnail Strip */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square bg-[#f3f4f6] rounded-2xl border border-slate-200/50 flex items-center justify-center p-8 overflow-hidden shadow-xs">
              <img
                src={activeDetailProduct.image}
                alt={activeDetailProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[380px] hover:scale-105 transition-transform duration-300"
              />
              
              {/* Overlaid Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <div className="px-3 py-1.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] tracking-wide shadow-sm uppercase border border-emerald-500">
                  {powerKey} 공식 승인 기기
                </div>
                {activeDetailProduct.hasASBadge && (
                  <div className="px-3 py-1.5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] tracking-wide shadow-sm border border-rose-500">
                    무상 A/S 4년 보장
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery Row */}
            <div className="flex items-center gap-2.5 mt-2.5 justify-start">
              {/* Left Arrow */}
              <button
                type="button"
                className="w-8 h-12 border border-slate-200 text-slate-400 hover:text-slate-800 flex items-center justify-center cursor-pointer select-none hover:bg-slate-50 transition-colors rounded-lg font-bold"
              >
                &lt;
              </button>
              
              {/* Thumbnail 1 (Active) */}
              <div className="w-14 h-14 border-2 border-stone-950 flex items-center justify-center p-1 bg-white cursor-pointer rounded-lg shadow-xs">
                <img src={activeDetailProduct.image} alt="thumbnail active" className="w-full h-full object-contain" />
              </div>

              {/* Thumbnail 2 (Simulated subview) */}
              <div className="w-14 h-14 border border-slate-200 flex items-center justify-center p-1 bg-white cursor-pointer hover:border-stone-400 transition-colors rounded-lg shadow-xs">
                <img src={activeDetailProduct.image} alt="thumbnail secondary" className="w-full h-full object-contain opacity-50 grayscale-20 hover:grayscale-0 hover:opacity-100 transition-all" />
              </div>

              {/* Right Arrow */}
              <button
                type="button"
                className="w-8 h-12 border border-slate-200 text-slate-400 hover:text-slate-800 flex items-center justify-center cursor-pointer select-none hover:bg-slate-50 transition-colors rounded-lg font-bold"
              >
                &gt;
              </button>
            </div>
          </div>

          {/* RIGHT: Spec Detail Block */}
          <div className="lg:col-span-6 space-y-6">
            {/* Top Row: Breadcrumb & Title */}
            <div className="space-y-2">
              <div className="flex justify-end text-[11px] text-slate-400 font-extrabold tracking-wider">
                <span>홈 / {productPurpose === 'Residential' ? '가정용 홈 충전기' : '공용 BIZ 충전기'}</span>
              </div>
              
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {activeDetailProduct.name}
                </h3>
                <div className="w-10 h-10 rounded-full bg-stone-950 text-white font-extrabold text-xs flex items-center justify-center shadow-md shrink-0">
                  {activeDetailProduct.discount}%
                </div>
              </div>
            </div>

            {/* Bold boundary divider */}
            <div className="border-t-2 border-slate-900 my-2"></div>

            {/* Specification Grid (Matches styling from user screenshot) */}
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-12 gap-y-3.5 text-xs">
                <div className="col-span-3 font-extrabold text-slate-600 self-start">상품요약정보</div>
                <div className="col-span-9 text-slate-700 font-medium leading-relaxed">
                  {activeDetailProduct.description || `${powerKey} 고안전 초고속 탑재 스마트 전기차 충전 솔루션`}
                </div>

                <div className="col-span-12 border-t border-slate-100 my-1"></div>

                <div className="col-span-3 font-extrabold text-slate-600 self-center">B2B공급가</div>
                <div className="col-span-9 text-blue-600 font-black text-base sm:text-lg">
                  {formatPrice(activeDetailProduct.price)}
                </div>

                <div className="col-span-12 border-t border-slate-100 my-1"></div>

                <div className="col-span-3 font-extrabold text-slate-600 self-center">배송방법</div>
                <div className="col-span-9 text-slate-700 font-medium">택배</div>

                <div className="col-span-12 border-t border-slate-100 my-1"></div>

                <div className="col-span-3 font-extrabold text-slate-600 self-center">배송비</div>
                <div className="col-span-9 text-slate-700 font-medium">무료</div>

                <div className="col-span-12 border-t border-slate-100 my-1"></div>

                <div className="col-span-3 font-extrabold text-slate-600 self-center">결제수단</div>
                <div className="col-span-9 text-slate-700 font-medium">무통장입금</div>
              </div>
            </div>

            <div className="border-t border-slate-200 my-4"></div>

            {/* Options Interactive Block */}
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-3 text-xs font-extrabold text-slate-600">커넥터길이</div>
                <div className="col-span-9">
                  <select
                    value={selectedConnector}
                    onChange={(e) => setSelectedConnector(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer rounded-lg"
                  >
                    <option value="">- [필수] 옵션을 선택해 주세요 -</option>
                    <option value="5m">5m 커넥터 일체형 (기본 장착)</option>
                    <option value="7m">7m 연장형 (+30,000원)</option>
                    <option value="10m">10m 최장 전용선 (+50,000원)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center pt-2">
                <div className="col-span-3 text-xs font-extrabold text-slate-600 font-black">수량</div>
                <div className="col-span-9">
                  <div className="flex flex-col space-y-1">
                    <div className="inline-flex items-center border border-slate-300 rounded-lg w-max overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-3 py-1.5 hover:bg-slate-50 cursor-pointer font-bold select-none text-slate-500 border-r border-slate-300"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold select-none text-slate-800 text-xs">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(q => q + 1)}
                        className="px-3 py-1.5 hover:bg-slate-50 cursor-pointer font-bold select-none text-slate-500 border-l border-slate-300"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">
                      (최소주문수량 1개 이상)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200/80 my-4"></div>

            {/* Dynamic Total Price Block */}
            <div className="flex items-end justify-between py-1">
              <span className="text-xs font-extrabold text-slate-500 tracking-wider">TOTAL (QUANTITY)</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {selectedConnector ? (
                  <>
                    <span className="text-blue-600">{formatPrice(totalPrice)}</span>
                    <span className="text-xs text-slate-500 font-bold ml-1.5">({quantity}개)</span>
                  </>
                ) : (
                  '0원 (0개)'
                )}
              </span>
            </div>

            {/* Shopping Action Buttons */}
            <div className="space-y-2 pt-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-[2] py-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-black rounded-xl uppercase tracking-wider text-center select-none cursor-pointer transition-all border border-stone-950 shadow-md shadow-stone-900/10 active:scale-99"
                >
                  BUY IT NOW
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl text-center select-none cursor-pointer transition-all active:scale-99"
                >
                  CART
                </button>
                <button
                  type="button"
                  onClick={handleAddToWishlist}
                  className="flex-1 py-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl text-center select-none cursor-pointer transition-all active:scale-99"
                >
                  WISH LIST
                </button>
              </div>

              <button
                type="button"
                onClick={handleBulkInquiry}
                className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-black py-3.5 tracking-wider text-center rounded-xl cursor-pointer select-none transition-all active:scale-99 shadow-xs"
              >
                대량구매문의
              </button>
            </div>
          </div>
        </div>
        )}

        {/* BOTTOM: Long Catalog Brochure Details */}
        <div className="border-t border-slate-200/80 pt-10">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h5 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
                  📄 상세 설명 카탈로그 및 이미지 정보
                </h5>
              </div>
              {detailData?.pdfUrl && isEditMode && (
                <button
                  type="button"
                  onClick={() => handleDeleteProductPdf(activeDetailProduct.id)}
                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-xl text-[10px] font-black flex items-center gap-1 transition-colors cursor-pointer border border-rose-200"
                >
                  <Trash2 className="w-3 h-3" />
                  상세페이지 이미지 삭제
                </button>
              )}
            </div>

            {/* Brochure render or upload zone */}
            {detailData?.pdfUrl ? (
              <div className="space-y-4">
                <PdfImageRenderer 
                  fileUrl={detailData.pdfUrl} 
                  fileName={detailData.pdfName || 'product-catalog.pdf'} 
                  brandName={activeDetailProduct.name} 
                  isAdmin={isEditMode}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {isEditMode ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingProductPdf(prev => ({ ...prev, [activeDetailProduct.id]: true }));
                    }}
                    onDragLeave={() => {
                      setIsDraggingProductPdf(prev => ({ ...prev, [activeDetailProduct.id]: false }));
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingProductPdf(prev => ({ ...prev, [activeDetailProduct.id]: false }));
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        handleProductPdfUpload(activeDetailProduct.id, file);
                      }
                    }}
                    onClick={() => document.getElementById(`product-detail-upload-${activeDetailProduct.id}`)?.click()}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[260px] ${
                      isDraggingProductPdf[activeDetailProduct.id]
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-300 bg-slate-50 hover:bg-slate-100/50 hover:border-blue-400'
                    }`}
                  >
                    <input
                      type="file"
                      id={`product-detail-upload-${activeDetailProduct.id}`}
                      accept="application/pdf, image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleProductPdfUpload(activeDetailProduct.id, file);
                        }
                      }}
                    />
                    <Upload className="w-10 h-10 text-slate-400 mb-3 animate-pulse" />
                    <p className="text-xs sm:text-sm font-black text-slate-800">
                      여기에 <span className="text-blue-600">[{activeDetailProduct.name}]</span> 제품의 상세 설명 이미지(PNG, JPG, JPEG) 또는 카탈로그 PDF를 드래그하거나 클릭하여 등록해 주세요.
                    </p>
                    <p className="text-[11px] text-slate-400 font-bold mt-2">
                      권장: 고해상도 상세페이지 길쭉한 통 이미지 등록 시 고화질로 렌더링되어 제품 정보 전달력이 대폭 상승합니다!
                    </p>
                  </div>
                ) : (
                  <div className="py-16 text-center bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-3">
                    <FileText className="w-10 h-10 text-slate-400" />
                    <p className="text-xs sm:text-sm text-slate-800 font-extrabold">본 제품의 고화질 상세 설명 이미지가 업로드 준비 중입니다.</p>
                    <p className="text-[11px] text-slate-500 font-bold max-w-sm leading-relaxed mx-auto">
                      1분 무료 자격 심사 상담 신청을 완료해 주시면, 담당 엔지니어가 카탈로그 사양서 전달 및 지자체 지원금 승인 조회를 신속하게 진행해 드립니다.
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenQuoteWithPurpose(productPurpose)}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs mt-2"
                    >
                      ⚡ 실시간 무상설치 자격 문의하기
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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
          <span className="text-blue-600 font-black text-sm uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            SOLUTIONS DIRECTORY
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            어떤 공간에 충전기를 설치하시겠습니까?
          </h3>
          <p className="text-sm text-slate-500 max-w-xl mx-auto font-bold">
            설치 현장 용도에 맞춰 보조금 신청 절차와 권장 기기 라인업을 한눈에 비교해 보세요.
          </p>

          {/* Tab Selection Row */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex flex-wrap sm:flex-nowrap justify-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl max-w-full overflow-x-auto scrollbar-none shadow-inner border border-slate-200/50">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-5 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer min-h-[44px] ${
                  activeTab === 'ALL'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span>전체 솔루션</span>
              </button>
              {solutions.map((sol) => (
                <button
                  key={sol.id}
                  onClick={() => setActiveTab(sol.category)}
                  className={`px-5 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer min-h-[44px] ${
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
              className="p-8 md:p-10 bg-white border border-slate-200/80 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="space-y-6">
                {/* 1. Header Text & Benefits Block (Top) */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-blue-600 font-extrabold text-xs tracking-widest uppercase block">
                      {sol.category === 'Commercial' ? '🏢 아파트·공동주택·공용시설 맞춤' : sol.category === 'Residential' ? '🏡 가정용·홈·개인소유지' : '🅿️ 상업시설·수익형 주차장'}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight leading-snug">
                      {sol.title}
                    </h3>
                  </div>
                  
                  {sol.category !== 'Residential' && sol.category !== 'ParkingLot' && (
                    <p className="text-base text-slate-700 leading-relaxed font-bold max-w-4xl">
                      {sol.description}
                    </p>
                  )}

                  {sol.category !== 'Residential' && sol.category !== 'ParkingLot' && (
                    /* Grid benefits */
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                      {sol.benefits.map((b) => (
                        <div key={b} className="flex items-start gap-2.5 text-sm md:text-base text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 shadow-xs">
                          <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span className="font-extrabold leading-relaxed">{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {sol.category === 'Commercial' && (() => {
                  const brandData = brands[selectedAptBrand] || brands['sk일렉링크'];
                  return (
                    <div className="p-8 bg-gradient-to-b from-emerald-600 to-emerald-700 text-white rounded-3xl border border-emerald-500/30 space-y-6 shadow-xl relative overflow-hidden group/brand">
                      {/* Decorative Background Glow */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
                      
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-emerald-500/30 pb-4 relative z-10">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">{brandData.icon}</span>
                            <span className="text-xs font-extrabold text-yellow-300 tracking-wider uppercase block bg-emerald-800/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                              SY.com 아파트 브랜드 공식 파트너
                            </span>
                          </div>
                          <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                            {brandData.name}
                          </h4>
                          <p className="text-sm text-emerald-100 font-bold">
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
                                className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
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
                          <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-bold">
                            {brandData.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {brandData.highlights.map((hl) => (
                              <span key={hl} className="text-xs font-black bg-emerald-800/50 text-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-500/20">
                                ✓ {hl}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3 bg-emerald-800/40 p-5 rounded-2xl border border-emerald-500/30">
                          <span className="text-xs font-extrabold text-yellow-300 tracking-wider uppercase block">
                            🎁 SY.com 무상 설치 공식 혜택
                          </span>
                          <div className="space-y-2.5">
                            {brandData.benefits.map((benefit, bIdx) => (
                              <div key={bIdx} className="flex items-start gap-2 text-sm text-emerald-50">
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
                            <h5 className="text-sm font-black text-white uppercase tracking-wider">
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
                  const productsList = homeProducts[selectedHomePower] || [];
                  
                  // Sort productsList based on sortBy
                  const sortedProducts = [...productsList].sort((a, b) => {
                    if (sortBy === 'priceAsc') return a.price - b.price;
                    if (sortBy === 'priceDesc') return b.price - a.price;
                    if (sortBy === 'popular') {
                      const scoreA = (a.tags.includes('MD CHOICE') ? 2 : 0) + (a.tags.includes('HIT') ? 1 : 0);
                      const scoreB = (b.tags.includes('MD CHOICE') ? 2 : 0) + (b.tags.includes('HIT') ? 1 : 0);
                      return scoreB - scoreA;
                    }
                    return 0; // 'new' keeps default order
                  });

                  return (
                    <div className="space-y-6 pt-2">
                      {/* Product Section Header */}
                      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xl font-black text-slate-950 tracking-tight">
                            홈충전기 {selectedHomePower}
                          </h4>
                          <span className="text-xs text-slate-500 font-extrabold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                            총 {sortedProducts.length}개의 상품이 있습니다.
                          </span>
                          
                          {isEditMode && (
                            <button
                              type="button"
                              onClick={() => startAddProduct('home', selectedHomePower)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1 transition-all shadow-md shadow-blue-600/10 cursor-pointer ml-2"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              새 {selectedHomePower} 충전기 추가
                            </button>
                          )}
                        </div>
                        
                        {/* Sorting select */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3.5 py-1.5 border border-slate-300 rounded-xl text-xs font-black bg-white text-slate-700 shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                          >
                            <option value="new">신상품</option>
                            <option value="popular">인기상품순</option>
                            <option value="priceAsc">낮은가격순</option>
                            <option value="priceDesc">높은가격순</option>
                          </select>
                        </div>
                      </div>

                      {/* Products Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sortedProducts.map((p) => {
                          const formatPrice = (val: number) => val.toLocaleString() + '원';
                          return (
                            <div
                              key={p.id}
                              onClick={() => setActiveDetailProduct(p)}
                              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                            >
                              <div>
                                {/* Top Image Area */}
                                <div className="relative aspect-square bg-slate-100/60 flex items-center justify-center p-6 overflow-hidden border-b border-slate-100">
                                  {/* Dynamic Image */}
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                  />
                                  
                                  {/* Round Power Badge (Left overlay) */}
                                  <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-extrabold text-[11px] flex items-center justify-center border border-blue-200 shadow-xs ring-4 ring-blue-500/10">
                                    {selectedHomePower}
                                  </div>

                                  {/* Black discount circular badge (Right overlay) */}
                                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-slate-900 text-white font-extrabold text-[11px] flex items-center justify-center shadow-md">
                                    {p.discount}%
                                  </div>

                                  {/* Left visual ribbons/badges */}
                                  {p.hasASBadge && (
                                    <div className="absolute top-15 left-3 bg-rose-500 text-white font-black text-[9px] px-2 py-1 rounded shadow-sm z-10 animate-pulse">
                                      무상A/S 4년
                                    </div>
                                  )}

                                  {p.hasPromoRibbon && (
                                    <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-[9px] font-black px-2.5 py-1 rounded shadow-sm z-10">
                                      기획상품
                                    </div>
                                  )}
                                </div>

                                {/* Body Information */}
                                <div className="p-4 space-y-2">
                                  <h5 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                    {p.name}
                                  </h5>
                                  
                                  {/* Price Section */}
                                  <div className="pt-1">
                                    <span className="text-[10px] text-slate-400 line-through block leading-none mb-1">
                                      {formatPrice(p.regularPrice)}
                                    </span>
                                    <span className="text-sm sm:text-base font-black text-rose-600">
                                      {formatPrice(p.price)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Footer Badges and Direct CTA */}
                              <div className="p-4 pt-0 space-y-3">
                                {p.tags && p.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 border-t border-slate-100 pt-3">
                                    {p.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                                          tag === 'MD CHOICE'
                                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                            : tag === 'HIT'
                                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                                        }`}
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                {/* 상세보기 버튼 제거 (카드 클릭으로 상세페이지 이동 대체) */}

                                {isEditMode && (
                                  <div className="flex gap-1.5 mt-1.5 pt-1.5 border-t border-slate-100">
                                    <button
                                      onClick={(e) => startEditProduct(p, 'home', selectedHomePower, e)}
                                      className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 rounded-lg text-[10px] font-black border border-amber-200/50 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      수정
                                    </button>
                                    <button
                                      onClick={(e) => deleteProduct(p.id, 'home', selectedHomePower, e)}
                                      className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-lg text-[10px] font-black border border-rose-200/50 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      삭제
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {sol.category === 'ParkingLot' && (() => {
                  const productsList = parkingProducts[selectedParkingCapacity] || [];
                  
                  // Sort productsList based on sortBy
                  const sortedProducts = [...productsList].sort((a, b) => {
                    if (sortBy === 'priceAsc') return a.price - b.price;
                    if (sortBy === 'priceDesc') return b.price - a.price;
                    if (sortBy === 'popular') {
                      const scoreA = (a.tags.includes('BEST') ? 2 : 0) + (a.tags.includes('HIT') ? 1 : 0);
                      const scoreB = (b.tags.includes('BEST') ? 2 : 0) + (b.tags.includes('HIT') ? 1 : 0);
                      return scoreB - scoreA;
                    }
                    return 0; // 'new' keeps default order
                  });

                  return (
                    <div className="space-y-6 pt-2">
                      {/* Product Section Header */}
                      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xl font-black text-slate-950 tracking-tight">
                            수익형 충전기 {selectedParkingCapacity}
                          </h4>
                          <span className="text-xs text-slate-500 font-extrabold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                            총 {sortedProducts.length}개의 상품이 있습니다.
                          </span>
                          
                          {isEditMode && (
                            <button
                              type="button"
                              onClick={() => startAddProduct('parking', selectedParkingCapacity)}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center gap-1 transition-all shadow-md shadow-indigo-600/10 cursor-pointer ml-2"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              새 {selectedParkingCapacity} 수익형 충전기 추가
                            </button>
                          )}
                        </div>
                        
                        {/* Sorting select */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3.5 py-1.5 border border-slate-300 rounded-xl text-xs font-black bg-white text-slate-700 shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                          >
                            <option value="new">신상품</option>
                            <option value="popular">인기상품순</option>
                            <option value="priceAsc">낮은가격순</option>
                            <option value="priceDesc">높은가격순</option>
                          </select>
                        </div>
                      </div>

                      {/* Products Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sortedProducts.map((p) => {
                          const formatPrice = (val: number) => val.toLocaleString() + '원';
                          return (
                            <div
                              key={p.id}
                              onClick={() => setActiveDetailProduct(p)}
                              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                            >
                              <div>
                                {/* Top Image Area */}
                                <div className="relative aspect-square bg-slate-100/60 flex items-center justify-center p-6 overflow-hidden border-b border-slate-100">
                                  {/* Dynamic Image */}
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                  />
                                  
                                  {/* Round Power Badge (Left overlay) */}
                                  <div className="absolute top-3 left-3 px-2.5 h-10 rounded-full bg-blue-50 text-indigo-600 font-extrabold text-[10px] flex items-center justify-center border border-indigo-200 shadow-xs ring-4 ring-indigo-500/10 whitespace-nowrap">
                                    {selectedParkingCapacity.split(' ')[0]}
                                  </div>

                                  {/* Black discount circular badge (Right overlay) */}
                                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-slate-900 text-white font-extrabold text-[11px] flex items-center justify-center shadow-md">
                                    {p.discount}%
                                  </div>

                                  {/* Left visual ribbons/badges */}
                                  {p.hasPromoRibbon && (
                                    <div className="absolute bottom-2 left-2 bg-indigo-600 text-white text-[9px] font-black px-2.5 py-1 rounded shadow-sm z-10">
                                      수익성 최고
                                    </div>
                                  )}
                                </div>

                                {/* Body Information */}
                                <div className="p-4 space-y-2">
                                  <h5 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                    {p.name}
                                  </h5>
                                  
                                  {/* Price Section */}
                                  <div className="pt-1">
                                    <span className="text-[10px] text-slate-400 line-through block leading-none mb-1">
                                      {formatPrice(p.regularPrice)}
                                    </span>
                                    <span className="text-sm sm:text-base font-black text-rose-600">
                                      {formatPrice(p.price)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Footer Badges and Direct CTA */}
                              <div className="p-4 pt-0 space-y-3">
                                {p.tags && p.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 border-t border-slate-100 pt-3">
                                    {p.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                                          tag === 'BEST'
                                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                            : tag === 'HIT'
                                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                                        }`}
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                {/* 상세보기 버튼 제거 (카드 클릭으로 상세페이지 이동 대체) */}

                                {isEditMode && (
                                  <div className="flex gap-1.5 mt-1.5 pt-1.5 border-t border-slate-100">
                                    <button
                                      onClick={(e) => startEditProduct(p, 'parking', selectedParkingCapacity, e)}
                                      className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 rounded-lg text-[10px] font-black border border-amber-200/50 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      수정
                                    </button>
                                    <button
                                      onClick={(e) => deleteProduct(p.id, 'parking', selectedParkingCapacity, e)}
                                      className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-lg text-[10px] font-black border border-rose-200/50 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      삭제
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* 정부 보조금 및 설치 대행 프로세스 (01단계 ~ 04단계) - 글 아래인 상단으로 이동 */}
                {sol.category !== 'Residential' && sol.category !== 'ParkingLot' && (
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
                )}

                {sol.category !== 'Residential' && sol.category !== 'ParkingLot' && (
                  <div className="pt-3 pb-6 flex flex-col items-center justify-center text-center gap-3 py-6 border-b border-slate-100">
                    <button
                      onClick={() => onOpenQuoteWithPurpose(sol.category)}
                      id={`btn-solution-cta-${sol.id}`}
                      className={`w-full sm:w-auto min-w-[280px] sm:min-w-[420px] py-4 px-10 font-black shadow-md rounded-2xl text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer text-white ${
                        sol.category === 'Commercial'
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
                )}

                {/* 2. Visuals & Details Block */}
                <div id={`brochure-view-${sol.id}`} className="space-y-6 pt-2 scroll-mt-20">
                  {sol.category !== 'Residential' && sol.category !== 'ParkingLot' && (
                    <>
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
                    </>
                  )}

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

      {/* 3. Product Create / Edit Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] z-10 font-sans"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-200/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {editingProductType === 'home' ? '가정용 홈 충전기' : '수익형 충전기'} ({editingCategory})
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {editingProduct ? '상품 정보 수정하기' : '새 상품 등록하기'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-700 text-sm">
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">상품명</label>
                  <input
                    type="text"
                    value={prodFormName}
                    onChange={(e) => setProdFormName(e.target.value)}
                    placeholder="예: SK일렉링크 7kW 프리미엄 충전기"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-extrabold text-xs"
                  />
                </div>

                {/* Regular Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700">정상 소비자 가격 (원)</label>
                    <input
                      type="number"
                      value={prodFormRegularPrice}
                      onChange={(e) => setProdFormRegularPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs font-extrabold"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700">특가 혜택 가격 (원)</label>
                    <input
                      type="number"
                      value={prodFormPrice}
                      onChange={(e) => setProdFormPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs font-extrabold"
                    />
                  </div>
                </div>

                {/* Product Image URL */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-slate-700">상품 이미지 URL</label>
                    <button
                      type="button"
                      onClick={() => {
                        const urls = [
                          'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
                          'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600',
                          'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
                          'https://images.unsplash.com/photo-1558441719-ff34b0524a24?auto=format&fit=crop&q=80&w=600'
                        ];
                        const randomUrl = urls[Math.floor(Math.random() * urls.length)];
                        setProdFormImage(randomUrl);
                      }}
                      className="text-[10px] text-blue-600 font-black hover:underline cursor-pointer"
                    >
                      랜덤 고화질 이미지 채우기
                    </button>
                  </div>
                  <input
                    type="text"
                    value={prodFormImage}
                    onChange={(e) => setProdFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono"
                  />
                  {prodFormImage && (
                    <div className="mt-2 w-24 h-24 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center bg-slate-50">
                      <img
                        src={prodFormImage}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as any).src = 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=240';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">태그 (쉼표로 구분)</label>
                  <input
                    type="text"
                    value={prodFormTags}
                    onChange={(e) => setProdFormTags(e.target.value)}
                    placeholder="예: MD CHOICE, HIT, BEST"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-extrabold text-xs"
                  />
                </div>

                {/* Checkboxes */}
                <div className="pt-2 grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prodFormHasASBadge}
                      onChange={(e) => setProdFormHasASBadge(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="text-left">
                      <span className="text-xs font-black text-slate-800 block">무상 A/S 4년</span>
                      <span className="text-[10px] text-slate-400 block font-bold">배지 노출 여부</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prodFormHasPromoRibbon}
                      onChange={(e) => setProdFormHasPromoRibbon(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="text-left">
                      <span className="text-xs font-black text-slate-800 block">기획상품 리본</span>
                      <span className="text-[10px] text-slate-400 block font-bold">리본 배지 노출 여부</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black rounded-xl cursor-pointer transition-colors"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={saveProductForm}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-md shadow-slate-900/10"
                >
                  {editingProduct ? '수정 완료' : '등록 완료'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
