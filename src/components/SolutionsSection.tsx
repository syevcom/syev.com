/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Solution, ActivePage } from '../types';
import { Check, ArrowRight, Zap, RefreshCw, Building2, Home, ParkingCircle, Layers, Image } from 'lucide-react';
import { PRODUCTS } from '../data';

interface SolutionsSectionProps {
  key?: React.Key;
  onOpenQuoteWithPurpose: (purpose: 'Commercial' | 'Residential' | 'ParkingLot') => void;
  solutions: Solution[];
  isEditMode?: boolean;
  onOpenCms?: (tab: 'brand' | 'hero' | 'about' | 'products' | 'solutions' | 'review' | 'support' | 'sync') => void;
  onPageChange?: (page: ActivePage) => void;
  defaultActiveTab?: 'ALL' | 'Commercial' | 'Residential' | 'ParkingLot';
}

export default function SolutionsSection({ 
  onOpenQuoteWithPurpose,
  solutions,
  isEditMode = false,
  onOpenCms,
  onPageChange,
  defaultActiveTab = 'ALL'
 }: SolutionsSectionProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'Commercial' | 'Residential' | 'ParkingLot'>(defaultActiveTab);
  const [selectedProductIds, setSelectedProductIds] = useState<Record<string, string>>({});
  const [visualViewerMode, setVisualViewerMode] = useState<Record<string, 'product' | 'catalog'>>({});
  const [solutionTabs, setSolutionTabs] = useState<Record<string, 'specs' | 'infographic'>>({});
  const [localBannerModes, setLocalBannerModes] = useState<Record<string, 'cover' | 'unfold'>>({});
  const [localDetailModes, setLocalDetailModes] = useState<Record<string, 'scroll' | 'unfold'>>({});

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
          className="absolute top-2 right-2 z-30 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg transition-transform hover:scale-105 cursor-pointer"
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
                        : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'
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
                  {sol.recommendedProducts && sol.recommendedProducts.length > 0 && (() => {
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
                                      ? 'bg-amber-100 text-amber-800'
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
