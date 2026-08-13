/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Review } from '../types';
import { REVIEWS } from '../data';
import { Star } from 'lucide-react';

interface ReviewSectionProps {
  reviews?: Review[];
  isEditMode?: boolean;
  onOpenCms?: (tab: 'hero' | 'about' | 'products' | 'solutions' | 'review' | 'support') => void;
  onDeleteReview?: (id: string) => void;
}

export default function ReviewSection({
  reviews = [],
  isEditMode = false,
  onOpenCms,
  onDeleteReview
}: ReviewSectionProps) {
  // Fallback to REVIEWS if provided reviews is empty
  const rawReviews = (reviews && reviews.length > 0) ? reviews : REVIEWS;

  // Filter out any placeholder/test review title
  const filteredReviews = rawReviews.filter(
    (r) => r && r.title && r.title !== '새 시공 현장 후기 제목' && !r.title.includes('새 시공 현장 후기') && r.author !== '홍길동 관리소장'
  );

  const displayReviews = filteredReviews.length > 0 ? filteredReviews : REVIEWS;

  // Sort reviews by date descending (newest first)
  const sortedReviews = [...displayReviews].sort((a, b) => {
    return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
  });

  return (
    <div className="space-y-12 pt-6 md:pt-8 pb-12 relative group/review">
      {isEditMode && onOpenCms && (
        <button
          onClick={() => onOpenCms('review')}
          className="absolute top-2 right-2 z-30 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg transition-transform hover:scale-105 cursor-pointer"
        >
          ✏️ 블로그 후기 및 시공사례 실시간 편집
        </button>
      )}

      {/* Top Header Copy */}
      <section className="text-center max-w-2xl mx-auto space-y-3 pt-2">
        <span className="text-blue-600 font-bold text-xs uppercase tracking-wider bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100/80 inline-block">
          Installation Gallery
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
          "전국 방방곡곡 다양한 공간에서 <br className="hidden sm:inline" />
          SY.com의 검증된 충전 솔루션이 함께합니다."
        </h2>
        <p className="text-xs md:text-sm text-slate-500 font-medium">
          지자체 관공서부터 대기업 지식산업센터, 단독주택까지 실제 설치 고객님들이 직접 전해주시는 생생한 시공 후기입니다.
        </p>
      </section>

      {/* Grid of Other review cards list (Chronological - Sorted Newest First with blog Cover Thumbnail) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">전국 생생한 시공후기 목록</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedReviews.map((rev) => {
            return (
              <div
                key={rev.id}
                id={`card-review-list-${rev.id}`}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm transition-all cursor-pointer flex flex-col justify-between group/card hover:shadow-lg"
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
                      <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {rev.blogName || '네이버 블로그'}
                      </div>
                    ) : (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                        시공사례
                      </div>
                    )}
                    {isEditMode && onDeleteReview && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteReview(rev.id);
                        }}
                        className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-md text-[10px] shadow-md z-10 transition-transform hover:scale-110 cursor-pointer"
                        title="이 후기 삭제"
                      >
                        🗑️
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] text-slate-500 font-extrabold block uppercase">
                        {rev.location.split(' ')[0]} {rev.location.split(' ')[1]}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold block">
                        {rev.date}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-black text-slate-950 block line-clamp-2 leading-snug group-hover/card:text-emerald-700 transition-colors">
                      {rev.title}
                    </span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-extrabold">{rev.author}</span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="text-[10px] font-bold text-slate-700">{rev.rating}.0</span>
                    </div>
                  </div>

                  {/* Direct Blog / Detail Link Button */}
                  {rev.blogUrl ? (
                    <a
                      href={rev.blogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-1.5 px-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white text-[11px] font-black rounded-xl border border-emerald-200 hover:border-emerald-600 transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer group/btn"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover/btn:bg-white" />
                      <span>네이버 블로그 글 보기 🔗</span>
                    </a>
                  ) : (
                    <div className="w-full py-1 px-2 bg-slate-50 text-slate-500 text-[10px] font-extrabold rounded-xl text-center">
                      시공 완료 현장
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
