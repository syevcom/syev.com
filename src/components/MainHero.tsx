/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CalendarDays, Calculator, MapPin, Wrench, ShieldCheck, Sparkles, Building, Home, ParkingSquare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MainHeroProps {
  onOpenQuote: () => void;
  onOpenQuoteWithPurpose: (purpose: 'Commercial' | 'Residential' | 'ParkingLot') => void;
  onOpenMyPageAS: () => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export default function MainHero({
  onOpenQuote,
  onOpenQuoteWithPurpose,
  onOpenMyPageAS,
  onOpenAuth,
  isLoggedIn
}: MainHeroProps) {
  // Mechanical Counting live state
  const [count, setCount] = useState(14520);
  
  // Interactive "Near me charger finder" modal/state simulation
  const [isSearchingCharger, setIsSearchingCharger] = useState(false);
  const [searchRegion, setSearchRegion] = useState('서울 강남구');
  const [chargerList, setChargerList] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Slowly tick up live counter to maximize trust and brand dynamics
    const interval = setInterval(() => {
      setCount((prev) => prev + (Math.random() > 0.6 ? 1 : 0));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleASQuickMenu = () => {
    if (isLoggedIn) {
      onOpenMyPageAS();
    } else {
      alert('A/S 신청은 안전한 고객 관리를 위해 로그인이 필요합니다.');
      onOpenAuth();
    }
  };

  const startFakeScan = () => {
    setIsScanning(true);
    setChargerList([]);
    setTimeout(() => {
      setIsScanning(false);
      setChargerList([
        { name: 'SY-AC11 테헤란로 빌딩 공용', status: '충전가능', distance: '120m', power: '11kW 완속' },
        { name: 'SY-FC200 강남 세무서 입구', status: '충전중', distance: '340m', power: '200kW 초급속' },
        { name: 'SY-DC50 역삼 소형 주차장', status: '충전가능', distance: '550m', power: '50kW 급속' }
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-12 py-6">
      
      {/* MASTER BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Bento Module: Large Hero Block & Quick Icons */}
        <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
          
          {/* Hero Section (Large Box) */}
          <div className="bg-slate-900 rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col justify-between text-white shadow-xl border border-slate-800 min-h-[380px] lg:flex-grow">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <svg width="280" height="280" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>

            {/* Top Row inside Hero */}
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                전국 최대 원스톱 설치 네트워크
              </div>

              <h1 className="text-3xl md:text-5.5xl font-black tracking-tight leading-tight md:leading-tight">
                대한민국 어디든,<br />
                전기차가 멈추는 곳엔 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">SY.com</span>
              </h1>

              <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-medium max-w-lg">
                전국 최대 전력 인프라망을 바탕으로 완벽 설계, 까다로운 지자체 정부 무상 보조금 신청 대행, 한전 계량기 수급 및 사후 24시간 철저 정비 관리까지 원스톱으로 명쾌하게 해결하세요.
              </p>
            </div>

            {/* Bottom Row inside Hero */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 pt-6">
              <button
                onClick={onOpenQuote}
                id="btn-hero-quote-cta"
                className="py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xl shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                👉 30초 만에 무료 설치 상담 예약하기
              </button>
              <button
                onClick={() => onOpenQuoteWithPurpose('ParkingLot')}
                id="btn-hero-calc-cta"
                className="py-3 px-5 bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Calculator className="w-4 h-4 text-blue-400" />
                1분 스마트 보조금 견적 내기
              </button>
            </div>
          </div>

          {/* Quick Menu Icons (Bento Row Grid) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setIsSearchingCharger(true)}
              id="btn-quick-find"
              className="p-4 rounded-3xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all text-center flex flex-col items-center justify-center gap-2 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 block">내 주변 충전기 찾기</span>
            </button>

            <button
              onClick={onOpenQuote}
              id="btn-quick-quote"
              className="p-4 rounded-3xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all text-center flex flex-col items-center justify-center gap-2 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 block">1분 맞춤 견적</span>
            </button>

            <button
              onClick={onOpenQuote}
              id="btn-quick-booking"
              className="p-4 rounded-3xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all text-center flex flex-col items-center justify-center gap-2 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CalendarDays className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 block">설치 예약</span>
            </button>

            <button
              onClick={handleASQuickMenu}
              id="btn-quick-as"
              className="p-4 rounded-3xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all text-center flex flex-col items-center justify-center gap-2 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 block">A/S 긴급 신청</span>
            </button>
          </div>

        </div>

        {/* Right Bento Module: Real-time Counter Status & Urgent Promo Banner */}
        <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
          
          {/* Real-time Counter (LIVE Status Card) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[220px] lg:h-1/2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">LIVE STATUS</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-bold">실시간 동기화 중</span>
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="py-2 space-y-1.5">
              <p className="text-slate-500 text-xs font-semibold">현재 전국 SY.com 충전기 설치 현황</p>
              
              {/* Mechanical Odometer Display */}
              <div className="flex items-center gap-1">
                {count.toString().split('').map((char, index) => (
                  <div
                    key={index}
                    className="w-8 h-12 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center text-xl font-black text-white"
                  >
                    <span>{char}</span>
                  </div>
                ))}
                <span className="text-slate-800 text-sm font-extrabold ml-1.5">대 돌파</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[78%] rounded-full" />
              </div>
              <p className="text-[9.5px] text-slate-400 font-medium leading-tight">
                * 전국 8개 광역 지사 및 특허 기술 시공팀의 검수 완료 실시간 전산 집계 결과입니다.
              </p>
            </div>
          </div>

          {/* Call to Action Banner (Orange-to-Red with Badge) */}
          <div className="bg-gradient-to-br from-orange-400 via-rose-500 to-red-500 rounded-3xl p-6 md:p-8 text-white flex flex-col justify-between relative shadow-lg overflow-hidden min-h-[220px] lg:h-1/2 border border-red-500/20">
            {/* Urgent rotating Stamp Badge */}
            <div className="absolute -top-1 -right-1 bg-white text-red-600 text-[10px] font-black px-2.5 py-1.5 rounded-bl-xl border-b border-l border-red-200 rotate-3 z-10 shadow-sm animate-pulse">
              올해 마감 임박! 🚨
            </div>

            <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-orange-100">정부 보조금 우선 선점 혜택</p>
              <h4 className="text-lg md:text-xl font-black leading-snug">
                지금 신청하시면 한전 인입 불입금 무료 대행과 화재감지 세이프 패키지를 선점합니다.
              </h4>
            </div>

            <button
              onClick={() => onOpenQuoteWithPurpose('Residential')}
              id="btn-bento-cta-booking"
              className="w-full bg-white hover:bg-slate-50 text-red-600 py-3 rounded-xl font-extrabold text-xs md:text-sm shadow-md transition-all text-center flex items-center justify-center gap-1 cursor-pointer mt-4 relative z-10"
            >
              <span>30초 무료 상담 신청하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Purpose Shortcuts / Solutions Section */}
      <section className="space-y-6 pt-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block">Custom Solutions</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">용도별 맞춤 충전 솔루션</h2>
          <p className="text-xs text-slate-500">설치 환경에 알맞은 정부 지원 정책과 최적의 충전 기술을 직접 확인해 보세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Commercial */}
          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-950">기업용 (Commercial)</h4>
                <p className="text-[10px] text-blue-600 font-bold mt-0.5">회사 사옥, 물류창고, 공장, 관공서 전용</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  "비어있는 주차 면적, SY.com을 만나면 가장 스마트한 수익원이 됩니다. 빌딩 가치는 올리고 고정 고객은 확보하세요."
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenQuoteWithPurpose('Commercial')}
              id="btn-shortcut-commercial"
              className="mt-6 py-2.5 px-4 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border border-transparent"
            >
              <span>기업 제안서 및 견적 요청</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Residential */}
          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-950">주거용 (Residential)</h4>
                <p className="text-[10px] text-blue-600 font-bold mt-0.5">단독주택, 빌라, 아파트(개인/공용) 전용</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  "집에 도착하는 순간, 충전 스트레스는 끝납니다. 화재 안심 센서 탑재! 까다로운 아파트 주민 협의 대행 지원."
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenQuoteWithPurpose('Residential')}
              id="btn-shortcut-residential"
              className="mt-6 py-2.5 px-4 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border border-transparent"
            >
              <span>주거용 7kW 신청 상담</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Parking Lot */}
          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <ParkingSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-950">주차장용 (Parking Lot)</h4>
                <p className="text-[10px] text-blue-600 font-bold mt-0.5">대형 마트, 호텔, 빌딩, 공영주차장 맞춤</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  "주차 공간을 최고의 부가 수익원으로 전환해 드립니다. 원격 관제 및 정산 연동 무상 지원 솔루션 매칭 완료."
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenQuoteWithPurpose('ParkingLot')}
              id="btn-shortcut-parking"
              className="mt-6 py-2.5 px-4 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border border-transparent"
            >
              <span>수익성 계산 및 상담 예약</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Near me Charger Finder Slide Drawer Simulation Dialog */}
      <AnimatePresence>
        {isSearchingCharger && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchingCharger(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              id="charger-finder-dialog"
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4"
            >
              <button
                onClick={() => setIsSearchingCharger(false)}
                id="btn-close-finder"
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
              >
                ✕
              </button>

              <div className="space-y-1">
                <span className="text-blue-600 font-bold text-[10px] tracking-wider uppercase block">GPS Location Simulator</span>
                <h4 className="text-base font-extrabold text-slate-950">내 주변 실시간 SY.com 충전기 찾기</h4>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchRegion}
                  onChange={(e) => setSearchRegion(e.target.value)}
                  placeholder="예: 서울 강남구 테헤란로"
                  id="input-finder-region"
                  className="flex-grow px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
                <button
                  type="button"
                  onClick={startFakeScan}
                  id="btn-finder-scan"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shrink-0 hover:bg-blue-700"
                >
                  조회
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {isScanning ? (
                  <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center justify-center space-y-2">
                    <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
                    <span>실시간 한전 전력망 및 기기 가동 여부 조회 중...</span>
                  </div>
                ) : chargerList.length > 0 ? (
                  chargerList.map((ch, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">{ch.name}</span>
                        <span className="text-[10px] text-slate-400 block">{ch.power} • 거리 {ch.distance}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ch.status === '충전가능' 
                          ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {ch.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-slate-400 text-xs">
                    지역을 기재하신 후 조회 버튼을 클릭하시면 30km 반경 내 SY.com 완속/급속 가동 현황이 실시간 검색됩니다.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
