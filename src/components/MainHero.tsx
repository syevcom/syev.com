/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { CalendarDays, Calculator, MapPin, Wrench, ShieldCheck, Sparkles, Building, Home, ParkingSquare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MainHeroProps {
  onOpenQuote: () => void;
  onOpenQuoteWithPurpose: (purpose: 'Commercial' | 'Residential' | 'ParkingLot') => void;
  onOpenMyPageAS: () => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
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
    solutionBlueSize?: 'small' | 'medium' | 'large' | 'xlarge';
    commercialBlueText?: string;
    residentialBlueText?: string;
    parkingBlueText?: string;
  };
  quickMenuConfig?: {
    showQuickMenu: boolean;
    items: Array<{ id: string; label: string; iconType: string; targetPage: any }>;
  };
  onPageChange?: (page: any) => void;
  isEditMode?: boolean;
  onOpenCms?: (tab: 'hero' | 'about' | 'products' | 'solutions' | 'review' | 'support' | 'brand') => void;
}

const QuickMenuIcon = ({ iconName, className = "w-6 h-6" }: { iconName: string; className?: string }) => {
  const IconComponent = (Icons as any)[iconName];
  if (!IconComponent) {
    return <Icons.HelpCircle className={className} />;
  }
  return <IconComponent className={className} />;
};

export default function MainHero({
  onOpenQuote,
  onOpenQuoteWithPurpose,
  onOpenMyPageAS,
  onOpenAuth,
  isLoggedIn,
  heroConfig,
  quickMenuConfig,
  onPageChange,
  isEditMode = false,
  onOpenCms
}: MainHeroProps) {
  // Mechanical Counting live state
  const [count, setCount] = useState(heroConfig.liveCountStart || 14520);
  
  const getBlueSizeClass = (size?: 'small' | 'medium' | 'large' | 'xlarge') => {
    switch (size) {
      case 'small': return 'text-xs md:text-sm';
      case 'large': return 'text-base md:text-xl';
      case 'xlarge': return 'text-lg md:text-2xl';
      case 'medium':
      default:
        return 'text-sm md:text-lg';
    }
  };
  
  // Interactive "Near me charger finder" modal/state simulation
  const [isSearchingCharger, setIsSearchingCharger] = useState(false);
  const [searchRegion, setSearchRegion] = useState('서울 강남구');
  const [chargerList, setChargerList] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    setCount(heroConfig.liveCountStart || 14520);
  }, [heroConfig.liveCountStart]);

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
    <div className="space-y-0 pb-16">
      
      {/* 100% FULL-WIDTH CINEMATIC HERO BANNER */}
      <div className="relative rounded-none overflow-hidden min-h-[500px] md:min-h-[620px] flex items-center bg-slate-950 group/hero w-full">
        {isEditMode && onOpenCms && (
          <button
            onClick={() => onOpenCms('hero')}
            className="absolute top-4 right-4 z-30 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            ✏️ 히어로 영역 실시간 편집
          </button>
        )}

        {/* Cinematic Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroConfig.imageUrl || "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1920&auto=format&fit=crop"} 
            alt="Eco-friendly EV Charging Cinematic Background" 
            className="w-full h-full object-cover brightness-[0.45] contrast-[1.05] scale-100 group-hover/hero:scale-[1.03] transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          {/* Subtle Ambient Vignette & Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-3xl px-8 md:px-12 py-12 text-white space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            {heroConfig.badge}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={`${
              heroConfig.titleSize === 'small' ? 'text-2xl md:text-4xl' :
              heroConfig.titleSize === 'medium' ? 'text-3xl md:text-5xl' :
              heroConfig.titleSize === 'xlarge' ? 'text-5xl md:text-7xl' :
              'text-4xl md:text-6xl'
            } font-black tracking-tight leading-tight md:leading-tight text-white`}
            dangerouslySetInnerHTML={{ __html: heroConfig.title }}
          />

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`${
              heroConfig.descriptionSize === 'small' ? 'text-xs md:text-sm' :
              heroConfig.descriptionSize === 'large' ? 'text-base md:text-lg' :
              'text-sm md:text-base'
            } text-slate-200 leading-relaxed font-semibold max-w-xl`}
          >
            {heroConfig.description}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <button
              onClick={onOpenQuote}
              id="btn-hero-quote-cta"
              className="py-3.5 px-7 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-2xl text-xs sm:text-sm font-black shadow-xl shadow-amber-500/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-102 active:scale-98"
            >
              {heroConfig.ctaButton}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Boxed Content Area for the rest of the page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-8">

      {/* Hand-crafted 3-Column Premium Category Shortcuts (As requested by user in image mockup) */}
      <section className="py-8 sm:py-12 bg-white rounded-3xl border border-slate-100/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-stretch">
            
            {/* Column 1: 주택비공용 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              {/* Custom Vector Illustration */}
              <div className="w-full max-w-[280px] h-[200px] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 350 250" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* House Base Shadow */}
                  <ellipse cx="175" cy="235" rx="110" ry="12" fill="#e2e8f0" opacity="0.6" />
                  
                  {/* Chimney */}
                  <rect x="220" y="85" width="16" height="35" fill="#475569" />
                  <rect x="216" y="80" width="24" height="6" fill="#1e293b" />

                  {/* Roof (Blue/Green gable) */}
                  <polygon points="175,50 85,140 265,140" fill="#064e3b" />
                  
                  {/* Main House Body */}
                  <rect x="95" y="140" width="160" height="90" fill="#f0fdf4" rx="2" />
                  
                  {/* Windows */}
                  <rect x="115" y="155" width="22" height="22" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" rx="2" />
                  <line x1="126" y1="155" x2="126" y2="177" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="115" y1="166" x2="137" y2="166" stroke="#10b981" strokeWidth="1.5" />

                  <rect x="164" y="155" width="22" height="22" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" rx="2" />
                  <line x1="175" y1="155" x2="175" y2="177" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="164" y1="166" x2="186" y2="166" stroke="#10b981" strokeWidth="1.5" />

                  <rect x="213" y="155" width="22" height="22" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" rx="2" />
                  <line x1="224" y1="155" x2="224" y2="177" stroke="#10b981" strokeWidth="1.5" />
                  <line x1="213" y1="166" x2="235" y2="166" stroke="#10b981" strokeWidth="1.5" />
                  
                  {/* Door on bottom right */}
                  <rect x="213" y="190" width="22" height="40" fill="#064e3b" rx="1" />
                  <circle cx="218" cy="210" r="2" fill="#fef08a" />
                  
                  {/* Garage & Car on left */}
                  <rect x="110" y="190" width="65" height="40" fill="#e2e8f0" rx="3" />
                  {/* Car */}
                  <rect x="117" y="198" width="50" height="28" fill="#059669" rx="6" />
                  <circle cx="128" cy="226" r="5" fill="#1e293b" />
                  <circle cx="156" cy="226" r="5" fill="#1e293b" />
                  <rect x="122" y="202" width="40" height="12" fill="#d1fae5" rx="2" />
                  {/* Headlights */}
                  <circle cx="122" cy="212" r="2" fill="#fef08a" />
                  <circle cx="162" cy="212" r="2" fill="#fef08a" />
                  
                  {/* Charger wire looping out to a charger block */}
                  <path d="M 167,215 C 185,215 180,185 195,185" stroke="#059669" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  <rect x="192" y="177" width="10" height="15" fill="#059669" rx="2" />
                  <circle cx="197" cy="184" r="2" fill="#ffffff" />
                  
                  {/* Small Bushes on side */}
                  <circle cx="260" cy="225" r="12" fill="#059669" />
                  <circle cx="268" cy="228" r="8" fill="#047857" />
                </svg>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-xl font-black text-emerald-950 tracking-tight">아파트</h4>
                <p className="text-sm font-semibold text-slate-500 leading-relaxed whitespace-pre-line">
                  아파트 단지, 입주민 공용{"\n"}환경부 무상 보조금 최적 설계
                </p>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={() => onPageChange?.('sol_commercial')}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg hover:scale-105 cursor-pointer"
                >
                  자세히 보기
                </button>
              </div>
            </div>

            {/* Column 2: 기업용 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              {/* Custom Vector Illustration */}
              <div className="w-full max-w-[280px] h-[200px] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 350 250" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Base Shadow */}
                  <ellipse cx="175" cy="235" rx="120" ry="12" fill="#e2e8f0" opacity="0.6" />
                  
                  {/* Office Building Base Grid */}
                  <rect x="110" y="60" width="130" height="170" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" rx="4" />
                  {/* Roof Structure */}
                  <rect x="105" y="50" width="140" height="10" fill="#475569" rx="3" />
                  
                  {/* Blue/Green solar decoration dots */}
                  <circle cx="140" cy="55" r="2.5" fill="#059669" />
                  <circle cx="150" cy="55" r="2.5" fill="#059669" />
                  <circle cx="160" cy="55" r="2.5" fill="#059669" />
                  <circle cx="170" cy="55" r="2.5" fill="#059669" />
                  <circle cx="180" cy="55" r="2.5" fill="#059669" />

                  {/* Windows with alternating colors */}
                  {/* Row 1 */}
                  <rect x="125" y="75" width="20" height="16" fill="#334155" rx="1.5" />
                  <rect x="152" y="75" width="20" height="16" fill="#10b981" rx="1.5" />
                  <rect x="179" y="75" width="20" height="16" fill="#334155" rx="1.5" />
                  <rect x="206" y="75" width="20" height="16" fill="#10b981" rx="1.5" />
                  
                  {/* Row 2 */}
                  <rect x="125" y="100" width="20" height="16" fill="#10b981" rx="1.5" />
                  <rect x="152" y="100" width="20" height="16" fill="#334155" rx="1.5" />
                  <rect x="179" y="100" width="20" height="16" fill="#10b981" rx="1.5" />
                  <rect x="206" y="100" width="20" height="16" fill="#334155" rx="1.5" />
                  
                  {/* Row 3 */}
                  <rect x="125" y="125" width="20" height="16" fill="#334155" rx="1.5" />
                  <rect x="152" y="125" width="20" height="16" fill="#10b981" rx="1.5" />
                  <rect x="179" y="125" width="20" height="16" fill="#334155" rx="1.5" />
                  <rect x="206" y="125" width="20" height="16" fill="#10b981" rx="1.5" />
                  
                  {/* Row 4 */}
                  <rect x="125" y="150" width="20" height="16" fill="#10b981" rx="1.5" />
                  <rect x="152" y="150" width="20" height="16" fill="#334155" rx="1.5" />
                  <rect x="179" y="150" width="20" height="16" fill="#10b981" rx="1.5" />
                  <rect x="206" y="150" width="20" height="16" fill="#334155" rx="1.5" />

                  {/* Grand Entrance */}
                  <rect x="160" y="185" width="30" height="45" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
                  <line x1="175" y1="185" x2="175" y2="230" stroke="#475569" strokeWidth="2" />
                  
                  {/* Standing Chargers in front on side lanes */}
                  {/* Charger Left 1 */}
                  <rect x="70" y="195" width="10" height="35" fill="#f8fafc" stroke="#059669" strokeWidth="2" rx="1" />
                  <circle cx="75" cy="203" r="2" fill="#10b981" />
                  <line x1="75" y1="210" x2="75" y2="230" stroke="#64748b" strokeWidth="1" />

                  {/* Charger Left 2 */}
                  <rect x="88" y="195" width="10" height="35" fill="#f8fafc" stroke="#059669" strokeWidth="2" rx="1" />
                  <circle cx="93" cy="203" r="2" fill="#10b981" />
                  <line x1="93" y1="210" x2="93" y2="230" stroke="#64748b" strokeWidth="1" />

                  {/* Charger Right 1 */}
                  <rect x="252" y="195" width="10" height="35" fill="#f8fafc" stroke="#059669" strokeWidth="2" rx="1" />
                  <circle cx="257" cy="203" r="2" fill="#10b981" />
                  <line x1="257" y1="210" x2="257" y2="230" stroke="#64748b" strokeWidth="1" />

                  {/* Charger Right 2 */}
                  <rect x="270" y="195" width="10" height="35" fill="#f8fafc" stroke="#059669" strokeWidth="2" rx="1" />
                  <circle cx="275" cy="203" r="2" fill="#10b981" />
                  <line x1="275" y1="210" x2="275" y2="230" stroke="#64748b" strokeWidth="1" />
                </svg>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-xl font-black text-emerald-950 tracking-tight">가정용 홈</h4>
                <p className="text-sm font-semibold text-slate-500 leading-relaxed whitespace-pre-line">
                  단독주택, 빌라, 개인용 주차장{"\n"}7kW 개인 완속 스마트홈 홈충전기
                </p>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={() => onPageChange?.('sol_residential')}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg hover:scale-105 cursor-pointer"
                >
                  자세히 보기
                </button>
              </div>
            </div>

            {/* Column 3: 공공기관 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              {/* Custom Vector Illustration */}
              <div className="w-full max-w-[280px] h-[200px] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 350 250" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Base Shadow */}
                  <ellipse cx="175" cy="235" rx="130" ry="12" fill="#e2e8f0" opacity="0.6" />
                  
                  {/* Left wing of Public Hall */}
                  <rect x="65" y="130" width="55" height="100" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
                  <rect x="75" y="145" width="14" height="22" fill="#334155" rx="1" />
                  <rect x="97" y="145" width="14" height="22" fill="#334155" rx="1" />
                  <rect x="75" y="180" width="14" height="22" fill="#334155" rx="1" />
                  <rect x="97" y="180" width="14" height="22" fill="#334155" rx="1" />

                  {/* Right wing of Public Hall */}
                  <rect x="230" y="130" width="55" height="100" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
                  <rect x="240" y="145" width="14" height="22" fill="#334155" rx="1" />
                  <rect x="262" y="145" width="14" height="22" fill="#334155" rx="1" />
                  <rect x="240" y="180" width="14" height="22" fill="#334155" rx="1" />
                  <rect x="262" y="180" width="14" height="22" fill="#334155" rx="1" />

                  {/* Tall Symmetrical Center Block */}
                  <rect x="120" y="80" width="110" height="150" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                  
                  {/* Symmetrical Top Triangle Spire */}
                  <polygon points="120,80 175,40 230,80" fill="#475569" />
                  
                  {/* Central flag pole & flag */}
                  <rect x="173" y="15" width="4" height="25" fill="#475569" />
                  <polygon points="177,15 208,22 177,30" fill="#059669" />
                  
                  {/* Symmetrical High-tech Lightning logo in center dome */}
                  <circle cx="175" cy="62" r="12" fill="#059669" />
                  <path d="M175,55 L169,63 L174,63 L173,69 L181,61 L176,61 Z" fill="#ffffff" />

                  {/* Center windows */}
                  <rect x="135" y="100" width="18" height="26" fill="#334155" rx="1" />
                  <rect x="166" y="100" width="18" height="26" fill="#334155" rx="1" />
                  <rect x="197" y="100" width="18" height="26" fill="#334155" rx="1" />
                  
                  <rect x="135" y="140" width="18" height="26" fill="#334155" rx="1" />
                  <rect x="166" y="140" width="18" height="18" fill="#10b981" rx="1" /> {/* Charging system indicator */}
                  <rect x="197" y="140" width="18" height="26" fill="#334155" rx="1" />

                  {/* Symmetrical Entrance Gate */}
                  <rect x="150" y="180" width="50" height="50" fill="#e2e8f0" rx="4" stroke="#475569" strokeWidth="2" />
                  <rect x="160" y="190" width="30" height="40" fill="#064e3b" rx="1" />
                  <line x1="175" y1="190" x2="175" y2="230" stroke="#f0f9ff" strokeWidth="1" />

                  {/* Symmetrical Outer charger towers on left & right road borders */}
                  <rect x="42" y="200" width="10" height="35" fill="#f8fafc" stroke="#059669" strokeWidth="2" rx="1" />
                  <circle cx="47" cy="208" r="2" fill="#10b981" />

                  <rect x="298" y="200" width="10" height="35" fill="#f8fafc" stroke="#059669" strokeWidth="2" rx="1" />
                  <circle cx="303" cy="208" r="2" fill="#10b981" />
                </svg>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-xl font-black text-emerald-950 tracking-tight">상업시설 수익형</h4>
                <p className="text-sm font-semibold text-slate-500 leading-relaxed whitespace-pre-line">
                  호텔, 마트, 대형 상가 빌딩{"\n"}수익형 완속/급속 충전소 구축
                </p>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={() => onPageChange?.('sol_parking')}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg hover:scale-105 cursor-pointer"
                >
                  자세히 보기
                </button>
              </div>
            </div>

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
                <span className="text-emerald-600 font-bold text-[10px] tracking-wider uppercase block">GPS Location Simulator</span>
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
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shrink-0 hover:bg-emerald-700"
                >
                  조회
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {isScanning ? (
                  <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center justify-center space-y-2">
                    <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-emerald-500 animate-spin" />
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
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-stone-100 text-stone-600 border border-stone-200'
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
      </div> {/* Closing Boxed Content Area */}
    </div>
  );
}
