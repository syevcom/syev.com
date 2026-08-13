/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Review } from '../types';
import { REVIEWS } from '../data';
import { X, Check, Plus, Edit3, Trash2 } from 'lucide-react';

interface ReviewSectionProps {
  reviews?: Review[];
  isEditMode?: boolean;
  onOpenCms?: (tab: 'hero' | 'about' | 'products' | 'solutions' | 'review' | 'support') => void;
  onDeleteReview?: (id: string) => void;
  onSaveReviews?: (reviews: Review[]) => void;
}

export default function ReviewSection({
  reviews = [],
  isEditMode = false,
  onOpenCms,
  onDeleteReview,
  onSaveReviews
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

  // Inline edit state
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [formReview, setFormReview] = useState<Partial<Review>>({});

  const handleStartEdit = (rev: Review) => {
    setEditingReview(rev);
    setIsCreating(false);
    setFormReview({ ...rev });
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingReview(null);
    setFormReview({
      id: `rev-${Date.now()}`,
      title: '',
      location: '경기 성남시 분당구',
      category: 'Residential',
      date: new Date().toISOString().split('T')[0],
      rating: 5,
      beforeImg: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
      afterImg: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      author: '고객 후기',
      interview: '설치가 매우 빠르고 만족스럽습니다.',
      details: '7kW 완속 스마트 월박스 시공 완료',
      coordinates: { x: 50, y: 50 },
      blogUrl: '',
      blogName: '네이버 블로그',
      isBlogImported: true
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formReview.title) {
      alert('후기 제목을 입력해주세요.');
      return;
    }

    let updatedList: Review[] = [];
    if (isCreating) {
      const newRev = formReview as Review;
      updatedList = [newRev, ...displayReviews];
    } else if (editingReview) {
      updatedList = displayReviews.map((r) => (r.id === editingReview.id ? ({ ...r, ...formReview } as Review) : r));
    }

    if (onSaveReviews) {
      onSaveReviews(updatedList);
    } else {
      localStorage.setItem('sy_cms_reviews', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('sy_cms_products_update'));
    }

    setEditingReview(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-12 pt-6 md:pt-8 pb-12 relative group/review">
      {isEditMode && onOpenCms && (
        <button
          onClick={() => onOpenCms('review')}
          className="absolute top-2 right-2 z-30 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg transition-transform hover:scale-105 cursor-pointer"
        >
          ✏️ 전체 CMS 후기 설정
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
          {isEditMode && (
            <button
              onClick={handleStartCreate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>새 후기 추가</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedReviews.map((rev) => {
            return (
              <div
                key={rev.id}
                id={`card-review-list-${rev.id}`}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm transition-all cursor-pointer flex flex-col justify-between group/card hover:shadow-lg relative"
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

                    {/* Admin Action Overlay Buttons */}
                    {isEditMode && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 z-20">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(rev);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] px-2 py-1 rounded-lg shadow-md transition-transform hover:scale-105 cursor-pointer flex items-center gap-1"
                          title="이 후기 수정"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>수정</span>
                        </button>
                        {onDeleteReview && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('정말 이 후기를 삭제하시겠습니까?')) {
                                onDeleteReview(rev.id);
                              }
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-lg text-[10px] shadow-md transition-transform hover:scale-105 cursor-pointer"
                            title="이 후기 삭제"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] text-slate-500 font-extrabold block uppercase">
                        {rev.location ? rev.location.split(' ')[0] : ''} {rev.location ? rev.location.split(' ')[1] : ''}
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

                <div className="pt-3 mt-3 border-t border-slate-100">
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

      {/* In-Place Edit / Create Modal for Admin */}
      {(editingReview || isCreating) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => {
                setEditingReview(null);
                setIsCreating(false);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                ✏️
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {isCreating ? '새 설치후기 등록' : '설치후기 즉시 수정'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {isCreating ? '새로운 시공사례 후기를 등록합니다.' : '현장에서 직접 후기 내용을 수정할 수 있습니다.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 font-bold mb-1">후기 제목</label>
                <input
                  type="text"
                  value={formReview.title || ''}
                  onChange={(e) => setFormReview({ ...formReview, title: e.target.value })}
                  placeholder="예: [네이버 블로그] 분당 단독주택 7kW 전기차 충전기 시공후기!"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">설치 지역</label>
                <input
                  type="text"
                  value={formReview.location || ''}
                  onChange={(e) => setFormReview({ ...formReview, location: e.target.value })}
                  placeholder="예: 경기 성남시 분당구"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">설치 완료일</label>
                  <input
                    type="text"
                    value={formReview.date || ''}
                    onChange={(e) => setFormReview({ ...formReview, date: e.target.value })}
                    placeholder="2026-06-29"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">구분</label>
                  <select
                    value={formReview.category || 'Residential'}
                    onChange={(e) => setFormReview({ ...formReview, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Residential">주거 전용</option>
                    <option value="Commercial">기업/관공서</option>
                    <option value="ParkingLot">수익형 주차장</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">대표 시공 이미지 URL</label>
                <input
                  type="text"
                  value={formReview.afterImg || ''}
                  onChange={(e) => setFormReview({ ...formReview, afterImg: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">블로그 원문 URL (연동 시)</label>
                <input
                  type="text"
                  value={formReview.blogUrl || ''}
                  onChange={(e) => setFormReview({ ...formReview, blogUrl: e.target.value, isBlogImported: !!e.target.value })}
                  placeholder="https://blog.naver.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingReview(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 cursor-pointer"
                >
                  취소
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>저장 완료</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

