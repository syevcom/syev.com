/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Solution } from '../types';
import { Check, ArrowRight } from 'lucide-react';

interface SolutionsSectionProps {
  onOpenQuoteWithPurpose: (purpose: 'Commercial' | 'Residential' | 'ParkingLot') => void;
  solutions: Solution[];
  isEditMode?: boolean;
  onOpenCms?: (tab: 'hero' | 'about' | 'products' | 'solutions' | 'review' | 'support') => void;
}

export default function SolutionsSection({ 
  onOpenQuoteWithPurpose,
  solutions,
  isEditMode = false,
  onOpenCms
}: SolutionsSectionProps) {
  return (
    <div className="space-y-16 py-12 relative group/solutions">
      {isEditMode && onOpenCms && (
        <button
          onClick={() => onOpenCms('solutions')}
          className="absolute top-2 right-2 z-30 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg transition-transform hover:scale-105 cursor-pointer"
        >
          ✏️ 용도별 솔루션 실시간 편집
        </button>
      )}

      {/* Category detail block cards */}
      {solutions.map((sol, index) => {
        const isEven = index % 2 === 0;
        return (
          <section
            key={sol.id}
            id={`solution-section-${sol.id}`}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
              isEven ? '' : 'lg:flex-row-reverse'
            }`}
          >
            {/* Visual block */}
            <div className={`lg:col-span-5 relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 h-80 md:h-96 ${
              isEven ? 'lg:order-1' : 'lg:order-2'
            }`}>
              <img
                src={sol.image}
                alt={sol.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-md inline-block mb-2">
                  RECOMMENDED
                </span>
                <p className="font-bold text-base md:text-lg">{sol.subtitle}</p>
                <p className="text-xs text-slate-200 mt-1">권장 사양: {sol.recommendedPower}</p>
              </div>
            </div>

            {/* Info block */}
            <div className={`lg:col-span-7 space-y-5 ${
              isEven ? 'lg:order-2' : 'lg:order-1'
            }`}>
              <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block">
                {sol.category === 'Commercial' ? '기업/관공서 전용' : sol.category === 'Residential' ? '주택/아파트 전용' : '수익형 주차 빌딩'}
              </span>
              <h3 className="text-2xl font-black text-slate-950 tracking-tight leading-tight">
                {sol.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {sol.description}
              </p>

              {/* Grid benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {sol.benefits.map((b) => (
                  <div key={b} className="flex items-start gap-2 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="font-semibold">{b}</span>
                  </div>
                ))}
              </div>

              {/* Subsidy Process Row */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-3xl space-y-2.5">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide block">
                  실시간 정부 보조금 진행 절차 (SY.com 원스톱 대행)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
                  {sol.subsidyProcess.map((step, sIdx) => (
                    <div key={step} className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm relative">
                      <span className="text-[9px] font-extrabold text-blue-600 block mb-1">0{sIdx+1}단계</span>
                      <span className="font-bold leading-normal block text-slate-700">{step.split(': ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenQuoteWithPurpose(sol.category)}
                  id={`btn-solution-cta-${sol.id}`}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>{sol.subtitle} 맞춤 보조금 무료 상담 예약하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        );
      })}

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
