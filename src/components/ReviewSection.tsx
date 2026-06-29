/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { REVIEWS } from '../data';
import { Review } from '../types';
import { MapPin, Star, Quote, ArrowLeftRight } from 'lucide-react';

export default function ReviewSection() {
  const [activeReview, setActiveReview] = useState<Review>(REVIEWS[0]);
  
  // Before / After slider state (0 to 100 percentage)
  const [sliderPos, setSliderPos] = useState<number>(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <div className="space-y-16 py-12">
      {/* Top Header Copy */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Social Proof
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
          "이미 전국 1만 개 이상의 공간이 <br />SY.com과 함께하고 있습니다."
        </h2>
        <p className="text-xs md:text-sm text-slate-500 font-medium">
          깐깐한 지자체 관공서부터 대기업 지식산업센터 물류창고, 우리 동네 단독주택까지 실제 고객들이 직접 증명하고 증언해 주시는 만족도 98%의 현장입니다.
        </p>
      </section>

      {/* Interactive Map & Active Review Card Display */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive map visualization (Col: 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              전국구 실시간 시공 커버리지 지도
            </h4>
            <p className="text-[10px] text-slate-400 mb-3 font-medium">
              지도의 활성화 핀을 클릭하시면 해당 지역의 실제 생생한 시공 후기 및 고객 인터뷰를 우측에서 확인하실 수 있습니다.
            </p>

            {/* Custom SVG/HTML Map Container */}
            <div className="relative h-96 bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/60 shadow-inner flex items-center justify-center">
              {/* Fake abstract Korea Map Outline */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="w-64 h-80 relative flex items-center justify-center text-slate-300 font-black text-xs select-none pointer-events-none">
                {/* Korea stylized boundary representation */}
                <div className="absolute top-10 left-20 w-16 h-12 bg-slate-300/40 rounded-full blur-xl" />
                <div className="absolute top-28 left-16 w-24 h-40 bg-slate-300/40 rounded-full blur-2xl" />
                <div className="absolute bottom-10 left-28 w-16 h-12 bg-slate-300/30 rounded-full blur-xl" />
                
                <span className="absolute top-12 left-28 text-[9px] text-slate-400 font-bold tracking-widest">SEOUL</span>
                <span className="absolute top-44 left-36 text-[9px] text-slate-400 font-bold tracking-widest">BUSAN</span>
                <span className="absolute bottom-12 left-16 text-[9px] text-slate-400 font-bold tracking-widest">JEJU</span>
              </div>

              {/* Real Active Pins from Reviews data */}
              {REVIEWS.map((rev) => {
                const isActive = activeReview.id === rev.id;
                return (
                  <button
                    key={rev.id}
                    onClick={() => setActiveReview(rev)}
                    id={`btn-map-pin-${rev.id}`}
                    className="absolute group transition-transform hover:scale-110"
                    style={{ left: `${rev.coordinates.x}%`, top: `${rev.coordinates.y}%` }}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className={`absolute inline-flex rounded-full opacity-75 ${
                        isActive ? 'animate-ping h-8 w-8 bg-blue-400' : 'h-4 w-4 bg-slate-400/30'
                      }`} />
                      <div className={`p-2 rounded-full shadow-lg border relative z-10 ${
                        isActive 
                          ? 'bg-blue-600 text-white border-blue-400' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-600'
                      }`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      
                      {/* Name tag popup */}
                      <span className="absolute top-10 whitespace-nowrap bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        {rev.location.split(' ')[1]} {rev.location.split(' ')[2]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Review Details (Col: 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: activeReview.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <h3 className="text-lg font-extrabold text-slate-950 tracking-tight leading-snug">
                  {activeReview.title}
                </h3>
                <span className="text-[11px] text-slate-400 font-bold block">
                  📍 {activeReview.location}
                </span>
              </div>

              <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                {activeReview.category === 'Commercial' ? '기업/관공서' : activeReview.category === 'Residential' ? '주거 전용' : '수익형 주차장'}
              </span>
            </div>

            {/* Before After Interactive Comparison slider */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
                시공 전 / 후 현장 비교 슬라이더 (좌우로 드래그 해보세요)
              </span>

              {/* Slider Component */}
              <div className="relative h-64 w-full rounded-2xl overflow-hidden select-none shadow-md border border-slate-100">
                {/* Before Image (Background) */}
                <div className="absolute inset-0">
                  <img
                    src={activeReview.beforeImg}
                    alt="시공 전"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-rose-900/80 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                    설치 전 (유휴지)
                  </div>
                </div>

                {/* After Image (Slide foreground) */}
                <div 
                  className="absolute inset-y-0 left-0 right-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={activeReview.afterImg}
                    alt="시공 후"
                    referrerPolicy="no-referrer"
                    className="absolute inset-y-0 left-0 h-64 w-full object-cover max-w-none"
                    style={{ width: '100%' }}
                  />
                  <div className="absolute bottom-3 left-3 bg-blue-950/80 text-white font-bold text-[10px] px-2 py-0.5 rounded whitespace-nowrap">
                    설치 후 (SY.com 시공 완료)
                  </div>
                </div>

                {/* Slide line separator */}
                <div 
                  className="absolute inset-y-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-lg"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-white text-white flex items-center justify-center text-xs shadow-md">
                    ⇄
                  </div>
                </div>

                {/* HTML Range Input Overlay */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={handleSliderChange}
                  id="range-review-slider"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />
              </div>
            </div>

            {/* Customer Interview (Quotation box) */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 relative">
              <Quote className="absolute top-3 right-3 w-8 h-8 text-slate-200/50 pointer-events-none" />
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
                  {activeReview.author[0]}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">{activeReview.author}</span>
                  <span className="text-[10px] text-slate-400 block font-bold">실제 시공 의뢰 고객</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                "{activeReview.interview}"
              </p>
            </div>

            {/* Technical Case Details */}
            <div className="text-xs text-slate-500 space-y-1 bg-slate-50/50 rounded-2xl p-3 border border-slate-200">
              <p>• <strong className="text-slate-700">시공 내역 세부:</strong> {activeReview.details}</p>
              <p>• <strong className="text-slate-700">설치 완료일:</strong> {activeReview.date}</p>
              <p>• <strong className="text-slate-700">정부 지원 보조율:</strong> 평균 75% 국고 보조 적용 매칭 완료</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Other review cards list */}
      <section className="space-y-4">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">기타 전국 생생한 시공 목록</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              onClick={() => setActiveReview(rev)}
              id={`card-review-list-${rev.id}`}
              className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                activeReview.id === rev.id
                  ? 'border-blue-600 shadow-md bg-blue-50/10'
                  : 'border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-400 font-extrabold block uppercase">
                  {rev.location.split(' ')[0]} {rev.location.split(' ')[1]}
                </span>
                <span className="text-xs font-bold text-slate-900 block line-clamp-2 leading-snug">
                  {rev.title}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold">{rev.author}</span>
                <div className="flex items-center gap-0.5 text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span className="text-[10px] font-bold text-slate-700">{rev.rating}.0</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
