/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Review } from '../types';
import { MapPin, Star, Quote, ArrowLeftRight } from 'lucide-react';

interface ReviewSectionProps {
  reviews: Review[];
  isEditMode?: boolean;
  onOpenCms?: (tab: 'hero' | 'about' | 'products' | 'solutions' | 'review' | 'support') => void;
}

export default function ReviewSection({
  reviews,
  isEditMode = false,
  onOpenCms
}: ReviewSectionProps) {
  // Sort reviews by date descending (newest first)
  const sortedReviews = [...reviews].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const currentActiveReview = sortedReviews.find(r => r.id === activeReviewId) || sortedReviews[0];
  
  // Before / After slider state (0 to 100 percentage)
  const [sliderPos, setSliderPos] = useState<number>(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <div className="space-y-12 py-12 relative group/review">
      {isEditMode && onOpenCms && (
        <button
          onClick={() => onOpenCms('review')}
          className="absolute top-2 right-2 z-30 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg transition-transform hover:scale-105 cursor-pointer"
        >
          ✏️ 블로그 후기 및 시공사례 실시간 편집
        </button>
      )}

      {/* Top Header Copy */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Installation Gallery
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
          "이미 전국 1만 개 이상의 공간이 <br />SY.com과 함께하고 있습니다."
        </h2>
        <p className="text-xs md:text-sm text-slate-500 font-medium">
          깐깐한 지자체 관공서부터 대기업 지식산업센터 물류창고, 우리 동네 단독주택까지 실제 고객들이 직접 증명하고 증언해 주시는 만족도 98%의 현장입니다.
        </p>
      </section>

      {/* Grid of Other review cards list (Chronological - Sorted Newest First with blog Cover Thumbnail) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">전국 생생한 시공후기 목록 (최신순 - 클릭 시 아래 상세 비교 분석 연동)</h4>
          <span className="text-[11px] text-blue-600 font-bold">💡 후기 카드를 클릭해 보세요</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedReviews.map((rev) => {
            const isActive = currentActiveReview.id === rev.id;
            return (
              <div
                key={rev.id}
                onClick={() => setActiveReviewId(rev.id)}
                id={`card-review-list-${rev.id}`}
                className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group/card hover:shadow-md ${
                  isActive
                    ? 'border-blue-600 ring-2 ring-blue-600/10 shadow-md bg-blue-50/10'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  {/* Blog / Case Study Thumbnail Cover Image */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                    <img
                      src={rev.afterImg}
                      alt={rev.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
                    {rev.isBlogImported ? (
                      <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                        {rev.blogName || '네이버 블로그'}
                      </div>
                    ) : (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm">
                        시공사례
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] text-slate-400 font-extrabold block uppercase">
                        {rev.location.split(' ')[0]} {rev.location.split(' ')[1]}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold block">
                        {rev.date}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-950 block line-clamp-2 leading-snug group-hover/card:text-blue-600 transition-colors">
                      {rev.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-500 font-extrabold">{rev.author}</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="text-[10px] font-bold text-slate-700">{rev.rating}.0</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Active Review Card Display - Redesigned into a Beautiful 2-Column Grid (Map Removed) */}
      <section className="bg-slate-50/50 border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
        <div className="border-b border-slate-200 pb-2.5">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">🎯 선택된 시공 현장 상세 비교 및 인터뷰 분석</h4>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Before/After Comparison slider (Col: 6) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
                시공 전 / 후 현장 비교 슬라이더 (좌우로 드래그 해보세요)
              </span>

              {/* Slider Component */}
              <div className="relative h-72 md:h-[360px] w-full rounded-2xl overflow-hidden select-none shadow-md border border-slate-100">
                {/* Before Image (Background) */}
                <div className="absolute inset-0">
                  <img
                    src={currentActiveReview.beforeImg}
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
                    src={currentActiveReview.afterImg}
                    alt="시공 후"
                    referrerPolicy="no-referrer"
                    className="absolute inset-y-0 left-0 h-full w-full object-cover max-w-none"
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
          </div>

          {/* Right Column: Review details & Interview (Col: 6) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: currentActiveReview.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-slate-950 tracking-tight leading-snug">
                    {currentActiveReview.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-bold block">
                    📍 {currentActiveReview.location}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                    {currentActiveReview.category === 'Commercial' ? '기업/관공서' : currentActiveReview.category === 'Residential' ? '주거 전용' : '수익형 주차장'}
                  </span>
                  {currentActiveReview.isBlogImported && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {currentActiveReview.blogName || '네이버 블로그'}
                    </span>
                  )}
                </div>
              </div>

              {/* Customer Interview (Quotation box) */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 relative">
                <Quote className="absolute top-3 right-3 w-8 h-8 text-slate-200/50 pointer-events-none" />
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
                    {currentActiveReview.author ? currentActiveReview.author[0] : 'N'}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">{currentActiveReview.author}</span>
                    <span className="text-[10px] text-slate-400 block font-bold">실제 시공 의뢰 고객</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  "{currentActiveReview.interview}"
                </p>
              </div>

              {currentActiveReview.blogUrl && (
                <a
                  href={currentActiveReview.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-emerald-50 hover:bg-emerald-100/60 border border-emerald-100 rounded-2xl text-emerald-950 transition-all duration-300 group/blog shadow-xs hover:shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-extrabold text-[11px] shadow-sm">
                      N
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] text-emerald-700 font-bold block uppercase tracking-wider">Naver Blog</span>
                      <span className="text-xs font-black leading-tight text-emerald-800 flex items-center gap-1">
                        블로그에 작성된 실제 후기 원문 전체 보기
                        <span className="text-emerald-600 font-bold group-hover/blog:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-1 rounded-lg border border-emerald-200 group-hover/blog:border-emerald-300 transition-colors">
                    원문보기
                  </span>
                </a>
              )}
            </div>

            {/* Technical Case Details */}
            <div className="text-xs text-slate-500 space-y-1 bg-slate-50/50 rounded-2xl p-3 border border-slate-200">
              <p>• <strong className="text-slate-700">시공 내역 세부:</strong> {currentActiveReview.details}</p>
              <p>• <strong className="text-slate-700">설치 완료일:</strong> {currentActiveReview.date}</p>
              <p>• <strong className="text-slate-700">정부 지원 보조율:</strong> 평균 75% 국고 보조 적용 매칭 완료</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
