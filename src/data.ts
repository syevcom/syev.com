/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Solution, Review, FAQ } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'sy-ac07',
    name: '스필SE 7kW 비공용 완속 충전기',
    type: '완속',
    power: '7kW',
    price: 490000,
    detailCategory: '비공용완속',
    features: [
      '화재 감지 자동 전력 차단',
      'PLC 모뎀 탑재 (화재 예방 충전)',
      '스마트 부하 분배 (Dynamic Load Balancing)',
      'IP55 방수/방진 등급',
      '벽걸이 및 스탠드형 지원'
    ],
    specs: {
      '정격 입력': 'Single Phase AC 220V ± 10%, 50/60Hz',
      '충전 커넥터': 'Type 5핀 (국내 표준)',
      '통신 방식': 'LTE / Wi-Fi / Ethernet',
      '크기': '280 x 420 x 140 mm',
      '인증': 'KC 안전인증 및 계량 형식 승인 완료'
    },
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
    description: '공동주택 및 개인주택에 최적화된 스마트 완속 충전기입니다. 특허받은 실시간 온도 센서와 PLC 모뎀으로 화재 위험을 원천 차단합니다.',
    plcSupported: true
  },
  {
    id: 'sy-home07',
    name: '롯데 이브이시스 7kW 비공용 완속 충전기',
    type: '스마트홈',
    power: '7kW',
    price: 850000,
    detailCategory: '비공용완속',
    features: [
      '단독주택/빌라 개인 전용',
      '블루투스 간편 사용자 인증',
      '초소형 세련된 북유럽풍 미니멀 디자인',
      '친환경 고내구성 소재 적용',
      '전국 24시간 자가진단 알람'
    ],
    specs: {
      '정격 입력': 'Single Phase AC 220V, 50/60Hz',
      '설치 형태': '스탠드 또는 실내외 벽면 고정',
      '부가 기능': '예약 충전 (전기세 저렴한 경부하 시간대 자동 실행)',
      '크기': '220 x 300 x 110 mm',
      '정격 전류': '32A'
    },
    image: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&q=80&w=600',
    description: '나만의 프라이빗 주차 공간을 위한 인공지능 예약 충전 시스템입니다. 심야 전력 요금 스케줄링이 탑재되어 매달 전기차 충전 비용을 최대로 절감합니다.',
    plcSupported: true
  },
  {
    id: 'sy-ac11-bi',
    name: '스필SE 11kW 비공용 완속 충전기',
    type: '완속',
    power: '11kW',
    price: 650000,
    detailCategory: '비공용중속',
    features: [
      '속도가 빠른 11kW 중속 사양',
      '과열 감지 센서 연동 셧다운',
      '콤팩트한 메탈릭 하이글로시 마감',
      '자가 진단 디스플레이 탑재',
      '안심 KC 인증 100% 검증 완료'
    ],
    specs: {
      '정격 입력': 'Three Phase AC 380V, 50/60Hz',
      '충전 커넥터': 'Type 5핀 싱글 커넥터',
      '통신 방식': '4G LTE / Ethernet',
      '크기': '280 x 420 x 140 mm',
      '인증': 'KC 안전인증 및 전자기 적합성 인증 완료'
    },
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=600',
    description: '개인용 중속 사양에 충실한 11kW 충전 모델입니다. 단시간 내에 7kW 보다 약 1.5배 빠른 충전을 경제적인 단가로 시공할 수 있습니다.',
    plcSupported: true
  },
  {
    id: 'sy-ac11',
    name: '롯데 이브이시스 11kW 공용 완속 충전기',
    type: '완속',
    power: '11kW',
    price: 1250000,
    detailCategory: '공용완속',
    features: [
      '속도가 빠른 11kW 화재감지형',
      '과열 감지 스마트 디스플레이',
      'RFID / 모바일 앱 원격 결제',
      '동시 2대 분할 충전 (선택형)',
      'B2B 원격 관제 OCPP 1.6 연동'
    ],
    specs: {
      '정격 입력': 'Three Phase AC 380V ± 10%, 50/60Hz',
      '충전 커넥터': 'Type 5핀 듀얼 커넥터',
      '통신 방식': '4G LTE / Ethernet',
      '크기': '320 x 480 x 160 mm',
      '인증': '전력연구원 화재예방(PLC) 시험 합격'
    },
    image: 'https://images.unsplash.com/photo-1695653422718-97d137aac987?auto=format&fit=crop&q=80&w=600',
    description: '오피스 빌딩, 상업 주차장에 적합한 고성능 11kW 충전기입니다. 스마트 부하 매칭으로 빌딩 계약 전력 한도 내에서 효율적으로 운영됩니다.',
    plcSupported: true
  },
  {
    id: 'sy-dc50',
    name: 'SY-DC50 슬림형 공용 급속 충전기',
    type: '급속',
    power: '50kW',
    price: 9800000,
    detailCategory: '급속',
    features: [
      '30분 내 80% 쾌속 충전',
      'B2B 법인 원격 관제 및 정산 시스템 무상 지원',
      '10인치 대형 터치스크린 탑재',
      '강력한 실시간 안전 진단',
      '카드/회원권/소셜 페이 결제 모듈'
    ],
    specs: {
      '정격 입력': 'Three Phase AC 380V ± 10%, 50/60Hz',
      '충전 커넥터': 'DC 콤보 1선식',
      '효율': '94% 이상 고효율 모듈 탑재',
      '크기': '650 x 1650 x 500 mm',
      '동작 온도': '-25°C ~ 50°C'
    },
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=600',
    description: '도심지 빌딩, 마트, 소형 휴게소에 적합한 공간절약형 급속 충전기입니다. 탁월한 안정성으로 쉬운 수익 사업 창출을 도와드립니다.',
    plcSupported: false
  },
  {
    id: 'sy-fc200',
    name: 'SY-FC200 하이퍼 초급속 충전기',
    type: '급속',
    power: '200kW',
    price: 24000000,
    detailCategory: '급속',
    features: [
      '듀얼 디스펜서 100kW+100kW 동시 충전',
      '15분 이내 완벽 완충 설계',
      '수랭식 케이블로 높은 전류에서도 발열 최소화',
      '정부 보조금 우선 신청 대상 검증 완료',
      '국제 표준 OCPP 1.6 & 2.0.1 완벽 지원'
    ],
    specs: {
      '정격 입력': 'Three Phase AC 380V / 440V ± 10%',
      '충전 커넥터': 'DC 콤보 2선식 듀얼 디스펜서',
      '최대 출력': '최대 200kW (최고 전압 1000V)',
      '크기': '800 x 1950 x 850 mm',
      '보호 등급': 'IP54 / 충격 보호 IK10 등급'
    },
    image: 'https://images.unsplash.com/photo-1620859309999-ed665c53a1ed?auto=format&fit=crop&q=80&w=600',
    description: '고속도로 휴게소, 물류허브, 공영 차고지 전용 하이퍼 초급속 충전 모델입니다. 대용량 전기버스와 화물차량도 지체 없이 최상의 속도로 충전합니다.',
    plcSupported: false
  },
  {
    id: 'sy-stand-01',
    name: '프리미엄 세이프티 싱글형 스탠드 케이스',
    type: '스탠드',
    power: '7~11kW 호환',
    price: 250000,
    detailCategory: '스탠드',
    features: [
      '고정밀 부식방지 특수 분체도장 처리',
      '실외 자외선 및 우천 보호용 빗물 받이 탑재',
      '충전 케이블 자동 권취형 행거 설계',
      '하단 콘크리트 앵커 단단 마운트'
    ],
    specs: {
      '소재': '고강도 스틸 (Steel with Zinc powder)',
      '호환 사양': '완속 7kW 및 11kW 전 기종 호환',
      '크기': '300 x 1400 x 300 mm',
      '색상': '다크 차콜 메탈릭 에디션'
    },
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
    description: '실내 주차장 벽면에 설치하기 곤란한 야외 주차장이나 마당에 충전기를 독립형 스탠드로 단단하게 세워 고정할 때 필수적인 전용 정품 스탠드 프레임입니다.',
    plcSupported: false
  },
  {
    id: 'sy-canopy-01',
    name: '안도감 세이프 캐노피 보호부스',
    type: '스탠드',
    power: '전 기종 호환',
    price: 450000,
    detailCategory: '스탠드',
    features: [
      '눈, 비, 강풍 완벽 방풍 설계',
      '열 차단 선루프 및 안전 야간 LED 인지 패널',
      '혹한기 빙결 보호 설계',
      '초보 운전자 진입 안내 반사판 스티커'
    ],
    specs: {
      '소재': '알루미늄 프로파일 및 특수 폴리카보네이트 Canopy',
      '치수': '600 x 1500 x 600 mm',
      '적용 대상': '야외 설치 스탠드형 기기 일체'
    },
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    description: '눈보라나 폭우 속에서도 안심하고 커넥터를 연결할 수 있도록 사방을 막아주는 안전 캐노피형 보호 하우징입니다. 방진/방수 수명을 200% 늘립니다.',
    plcSupported: false
  }
];

export const SOLUTIONS: Solution[] = [
  {
    id: 'sol-commercial',
    title: '아파트 단지 공용 안심 솔루션',
    category: 'Commercial',
    subtitle: '아파트 단지, 공동주택, 입주민 공용 구역',
    description: '아파트 입주민 전용 및 공동 이용 충전 공간의 갈등과 부족 문제를 완벽히 해결합니다. 지자체 및 환경부 정부 무상 보조금 우선 신청 혜택을 밀착 대행하고, 복잡한 관리사무소 설치 협의 및 입주자 동의 절차를 무상으로 완벽 지원해 드립니다.',
    target: '아파트 동대표회, 아파트 입주자 대표 회의, 관리사무소 소장 및 주민 위원회',
    recommendedPower: '공용 완속(11kW 화재감지형) + 공용 급속(50kW~100kW)',
    benefits: [
      '환경부 무상 보조금 전액 매칭 지원 및 신청 서류 대행',
      '입주자 전용 RFID 충전 카드 발급 및 모바일 터치 자동 과금',
      '화재 조기 감지 및 충전 도중 과열 시 3단계 자동 충전 셧다운 연동',
      '전국 최저 수준의 아파트 특화 경부하 심야 충전 요금 자동 셋업'
    ],
    subsidyProcess: [
      '1단계: 아파트 입주민 30초 상담 신청 및 담당 전문 설계 컨설턴트 무료 배정',
      '2단계: 아파트 단지 주차 구역 무료 실사 및 도면 설계, 한전 계약 전력 진단',
      '3단계: 환경부 무상 설치 보조금 정식 서류 신청 및 행정 승인 대행',
      '4단계: 정식 면허 보유 전문 시공팀의 소음/먼지 최소화 특허 안전 보강 공사'
    ],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    detailImageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
    blueprintImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
    recommendedProducts: ['sy-ac11', 'sy-dc50', 'sy-fc200']
  },
  {
    id: 'sol-residential',
    title: '가정용 홈 안심 솔루션',
    category: 'Residential',
    subtitle: '단독주택, 빌라, 개인용 비공용 주차장',
    description: '집에 도착하는 즉시 나만의 자리에 충전 커넥터를 꽂으세요. 블루투스 또는 전용 안심 RFID 인증으로 외부인의 무단 도용을 완전 방지하며, 누진세 걱정 없이 심야 경부하 시간대에 최저 가격으로 예약 충전할 수 있습니다.',
    target: '단독주택 소유주, 빌라 거주자, 개인 전용 차고를 보유한 전기차 오너',
    recommendedPower: '개인용/비공용 스마트홈 완속(7kW)',
    benefits: [
      '업계 최초 플러그 과열/과부하 스파크 자동 정밀 전류 차단 모듈 탑재',
      '예약 충전 시스템으로 누진 요금 구역을 피해 가장 저렴한 심야 시간 예약 충전',
      '한전 수급 불입금 납부 대행 및 한전 정식 계량기 신규 개설 원스톱 진행',
      '비바람과 자외선에 뛰어난 IP55 실외 맞춤 설치 및 전용 스탠드 제공'
    ],
    subsidyProcess: [
      '1단계: 주거 형태 및 주차 공간 사진 업로드 (또는 30초 간편 상담)',
      '2단계: 거주 환경 분석 후 아파트/빌라 협의회 전용 맞춤 카탈로그 제공',
      '3단계: 한전 불입금 납부 및 한전 계량기 수급 정식 신청',
      '4단계: 깔끔하고 안전한 케이블 트레이 및 특허 세이프티 가드 시공'
    ],
    image: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=800',
    detailImageUrl: 'https://images.unsplash.com/photo-1594535182308-8ffef9412388?auto=format&fit=crop&q=80&w=1200',
    blueprintImageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200',
    recommendedProducts: ['sy-ac07', 'sy-home07']
  },
  {
    id: 'sol-parkinglot',
    title: '상업시설 수익형 솔루션',
    category: 'ParkingLot',
    subtitle: '상가 빌딩, 대형 마트, 호텔, 병원, 유료 주차장',
    description: '유휴 주차 면적을 매달 자동 현금이 들어오는 연금형 수익 자산으로 업그레이드 하세요. 방문 고객에게 최고의 초급속 충전 인프라를 무상 지원하여 고정 단골 고객을 추가 유치하고, 충전 이용 요금 매출의 최대 40%를 공유받아 건물의 가치를 향상시킵니다.',
    target: '종합 상가, 프랜차이즈 및 대형 음식점 소유주, 호텔/리조트 대표, 오피스 빌딩 건물주 및 자산 관리자',
    recommendedPower: '급속(100kW) + 초급속(200kW) 복합 수익형 구성',
    benefits: [
      '상업 빌딩 내 입점 매장 구매 고객 대상 충전 할인 쿠폰 및 무료 주차 연동',
      '초기 기기 및 설치 비용 전액 무상 지원 매칭 보조금 프로그램 연동 지원',
      '24시간 무인 모바일 스마트 관제 센터를 통한 오류 원격 자동 감지 복구',
      '국가 표준 화재 안심 시험 통과 모델 적용 및 10억 원 영업 배상 보험 무상 가입'
    ],
    subsidyProcess: [
      '1단계: 건물 주차장 주소 입력 및 예상 연간 충전 수익 리포트 무료 발급',
      '2단계: 유휴 계약 전력 한도 조회 및 충전기 최적 배치 수량 시뮬레이션',
      '3단계: 충전 인프라 무상 지원 보조금 매칭 신청',
      '4단계: 통합 모바일 앱 등록 및 충전 전용 안내선, LED 보강 등 디자인 시공'
    ],
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=800',
    detailImageUrl: 'https://images.unsplash.com/photo-1558441719-ff34b0524a24?auto=format&fit=crop&q=80&w=1200',
    blueprintImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    recommendedProducts: ['sy-ac11', 'sy-dc50', 'sy-fc200']
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    title: '강남 대형 오피스 타워 고효율 주차장 시공',
    location: '서울 강남구 테헤란로 OOO 타워',
    category: 'ParkingLot',
    date: '2026-05-14',
    rating: 5,
    beforeImg: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
    author: '김태우 관리소장',
    interview: '처음엔 입주민들의 화재 우려와 한도 전력 문제 때문에 고민이 많았습니다. SY.com에서 스마트 전력 부하 관리와 PLC 탑재 화재 안심 충전기를 제안해 주셔서 건물 관리위원회도 쉽게 통과했습니다. 설치 후 매달 충전기 자체에서 발생하는 부가 수익도 짭짤해 아주 만족스럽습니다.',
    details: '급속 100kW 2대, 완속 11kW 6대 시공. 스마트 부하 매칭으로 빌딩 최대 전력을 한전 규제치 이내로 컨트롤.',
    coordinates: { x: 35, y: 48 }
  },
  {
    id: 'rev-2',
    title: 'RE100 추진 물류창고 화물차 급속 충전 솔루션',
    location: '경기 여주 OOO 물류센터',
    category: 'Commercial',
    date: '2026-06-02',
    rating: 5,
    beforeImg: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1620859309999-ed665c53a1ed?auto=format&fit=crop&q=80&w=600',
    author: '박정훈 인프라본부장',
    interview: '화물 트럭들이 야간에 일제히 충전해야 해서 안정성이 최우선이었습니다. SY.com의 200kW 초급속 수랭식 디스펜서 충전기를 도입한 뒤 배송 출발 지연이 0%로 줄었습니다. 지자체 보조금도 80% 지원받아 대폭적인 설비 절감을 거뒀습니다.',
    details: '초급속 200kW 3대 설치. 대형 전기 트럭 전전류 충전 안정성 테스트 100% 통과.',
    coordinates: { x: 42, y: 55 }
  },
  {
    id: 'rev-3',
    title: '단독주택 주차장 개인 스마트홈 충전기 설치',
    location: '제주 애월읍 OOO 펜션 및 주택',
    category: 'Residential',
    date: '2026-06-20',
    rating: 5,
    beforeImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&q=80&w=600',
    author: '이지은 건축주',
    interview: '단독주택이라 한전에서 전기 신설 신청을 직접 해야 하는 줄 알고 눈앞이 캄캄했는데, SY.com에서 기사님이 현장 견적 내러 오셔서 원스톱으로 서류 신청부터 시공까지 사흘 만에 다 끝내주셨어요. 북유럽풍 벽걸이형 디자인도 집 외관과 찰떡이라 펜션 손님들도 다들 예쁘다고 칭찬해요!',
    details: 'SY-Home07 7kW 월박스 설치. 한전 인입선 신설 및 야간 저렴한 예약 충전 연동 셋업 완료.',
    coordinates: { x: 25, y: 88 }
  },
  {
    id: 'rev-4',
    title: '종합 상가 주차 면적 유휴 공간 수익 극대화',
    location: '부산 해운대구 센텀 OOO 타운',
    category: 'ParkingLot',
    date: '2026-06-25',
    rating: 5,
    beforeImg: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1695653422718-97d137aac987?auto=format&fit=crop&q=80&w=600',
    author: '최현우 건물관리 대표',
    interview: '공실 상가 주차 구역이라 방치되어 있었는데 충전소로 바꾸고 나니 건물을 오가는 통행량 자체가 크게 늘었습니다. 충전하러 온 차량 고객들이 상가 식음료 매장을 추가 이용하는 낙수 효과도 엄청나며, 정산도 완전히 자동화되어 관리비 인건비 부담이 전혀 없습니다.',
    details: '급속 50kW 1대, 완속 7kW 4대 설치. LED 안내 패널 및 충전 주차 도색 완비.',
    coordinates: { x: 68, y: 72 }
  },
  {
    id: 'rev-blog-seed',
    title: '[네이버 블로그] 분당 단독주택 7kW 전기차 충전기 무상보조금 전액지원 설치후기!',
    location: '경기 성남시 분당구',
    category: 'Residential',
    date: '2026-06-29',
    rating: 5,
    beforeImg: 'https://images.unsplash.com/photo-1521500857785-5a827418b62c?auto=format&fit=crop&q=80&w=600',
    afterImg: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
    author: '블로거 달콤한초코',
    interview: '드디어 블로그에 자랑하고 싶던 전기차 홈충전기를 에스와이코리아(SY.com)에서 국고지원금 매칭 받아서 대만족하며 완공했어요! 복잡한 한전 보조금 서류 신청부터 대행까지 전부 무상으로 처리해주셔서 저는 그냥 구경만 했네요. 상세한 내용은 제 네이버 블로그 글에서 직접 확인하세요!',
    details: '7kW 완속 스마트 월박스 시공 완료. 환경부 화재예방 PLC 탑재 적용 모델 선정.',
    coordinates: { x: 38, y: 52 },
    blogUrl: 'https://blog.naver.com/sy_car_com/223490181201',
    isBlogImported: true,
    blogName: '네이버 블로그'
  }
];

export const FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: '충전기 설치 시 정말 정부 보조금 신청을 지원해 주나요?',
    answer: '네, 그렇습니다! SY.com은 환경부 승인 및 공식 보조금 사업 파트너로서 매년 지자체별/환경부별 남은 예산을 모니터링하여 우선적으로 보조금 혜택을 선점할 수 있도록 복잡한 구비 서류 작성과 행정 신고 절차를 무상으로 전부 대행해 드립니다. 개인 주택뿐만 아니라 기업용 대규모 단지 보조금 신청도 완벽 지원합니다.',
    category: '보조금/비용'
  },
  {
    id: 'faq-2',
    question: '최근 이슈가 되는 전기차 화재가 걱정되는데, 안전 기술이 적용되어 있나요?',
    answer: 'SY.com은 최고의 전기차 화재 안전 기술력을 탑재하고 있습니다. 자사 모든 신제품 모델에는 최고 사양의 과열 센서 및 전기 스파크(아크) 미세 차단 알고리즘이 내장되어 있습니다. 특히 SY-AC07/AC11 모델에는 환경부 공식 화재 감지용 핵심 모듈인 PLC 모뎀이 기본 탑재되어, 차량의 배터리 충전 상태(SoC)를 실시간 모니터링하여 만충 도달 전 또는 이상 고열 시 충전을 강제로 종료시키는 다중 예방 안전망을 구축하고 있습니다.',
    category: '화재안전'
  },
  {
    id: 'faq-3',
    question: '아파트나 다세대 주택의 경우 입주민 동의 절차가 필요하지 않나요?',
    answer: '맞습니다. 공동주택 주차 공간의 경우 관리사무소 협의 및 주민대표위원회 승인이 선결 과제입니다. SY.com은 이를 위해 다년간 축적한 전문 상담 자료를 보완 제공합니다. 입주민들이 가장 걱정하시는 전기료 공용화 우려를 씻어줄 RFID 개인별 결제 시스템 자료 및 정부 화재예방 특허 증빙서류를 묶은 전용 동의 설명서 패키지를 상담 직후 전달드리며, 필요시 기술 지원 상담사가 원격 및 방문 설명 협조를 드립니다.',
    category: '설치과정'
  },
  {
    id: 'faq-4',
    question: '한전 계량기 신설은 무엇이며 추가 요금이 발생하나요?',
    answer: '전기차 충전기는 기본 가정용 또는 상업용 가전제품과 달리 전력 소모량이 매우 큽니다(최소 7,000W 이상). 이에 따라 별도의 계량기를 한전에 신청하여 독립적인 전용 요금제를 매칭해야 누진세를 피하고 요금을 절감할 수 있습니다. SY.com에서는 이 한전 신청 접수 및 내선 설비 설계 일체를 자체 공인 전력기술팀이 무료로 대행하며, 국가가 부과하는 한전 불입금 외 설계 인건비는 받지 않습니다.',
    category: '전기안전'
  },
  {
    id: 'faq-5',
    question: '설치 후 사후관리(A/S) 기간과 전국 네트워크는 어떻게 되나요?',
    answer: 'SY.com은 전국 8개 광역본부 산하 24개의 전담 기술 정비 서비스망을 상시 보유하고 있습니다. 설치 후 무상 A/S 기간은 기본 2년(연장 시 최대 5년)이 보장되며, 24시간 원격 모니터링을 통해 고장 신호 감지 시 방문 기사가 출동하기 전에 1차 소프트웨어 자동 리셋 복구 처리를 진행합니다. 현장 처리가 필요한 경우 접수 당일 또는 익일 오전까지 100% 방문 수리를 원칙으로 삼고 있습니다.',
    category: '사후관리(A/S)'
  }
];

export const NOTICES = [
  {
    id: 1,
    title: '[긴급] 2026년 하반기 지자체별 전기차 충전기 무상 보조금 한도 조기 소진 안내 (마감 임박)',
    date: '2026-06-25',
    important: true
  },
  {
    id: 2,
    title: 'SY.com 업계 최초 화재감지 차세대 PLC 모뎀 완속 충전기 11kW KC 형식승인 획득',
    date: '2026-06-18',
    important: false
  },
  {
    id: 3,
    title: '[서비스] 장마철 및 폭염 대비 야외 전기차 충전기 무상 침수방지 방진캡 안전 점검 캠페인 안내',
    date: '2026-06-10',
    important: false
  },
  {
    id: 4,
    title: 'B2B 파트너 대상: 유휴 주차 면적 수익 전환 원격 관제 플랫폼 (SY-OCS v2.1) 업데이트 배포',
    date: '2026-05-30',
    important: false
  }
];
