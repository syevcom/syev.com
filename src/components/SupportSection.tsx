/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Bell, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface Notice {
  id: string;
  title: string;
  date: string;
  important: boolean;
}

interface SupportSectionProps {
  onOpenMyPageAS: () => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  faqs: FAQ[];
  notices: Notice[];
  isEditMode?: boolean;
  onOpenCms?: (tab: 'hero' | 'about' | 'products' | 'solutions' | 'review' | 'support') => void;
}

export default function SupportSection({ 
  onOpenMyPageAS, 
  onOpenAuth, 
  isLoggedIn,
  faqs,
  notices,
  isEditMode = false,
  onOpenCms
}: SupportSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaq, setSelectedFaq] = useState<string | null>(null);
  const [faqCategory, setFaqCategory] = useState<'전체' | '보조금/비용' | '화재안전' | '설치과정' | '전기안전' | '사후관리(A/S)'>('전체');

  // 1:1 online inquiry form state
  const [title, setTitle] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  // Filter FAQs
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = faqCategory === '전체' || faq.category === faqCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryError('');

    if (!title || !contact || !message) {
      setInquiryError('제목, 연락처, 상세 내용을 정확히 기재해 주세요.');
      return;
    }

    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setTitle('');
      setContact('');
      setMessage('');
    }, 2500);
  };

  const handleASButton = () => {
    if (isLoggedIn) {
      onOpenMyPageAS();
    } else {
      alert('전국 긴급 A/S 접수는 본인 확인용 회원 로그인이 필수입니다. 1초 간편 로그인 후 즉시 접수됩니다.');
      onOpenAuth();
    }
  };

  return (
    <div className="space-y-16 py-12 relative group/support">
      {isEditMode && onOpenCms && (
        <button
          onClick={() => onOpenCms('support')}
          className="absolute top-2 right-2 z-30 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg transition-transform hover:scale-105 cursor-pointer"
        >
          ✏️ 공지사항 및 FAQ 실시간 편집
        </button>
      )}

      {/* Notices Board Section (Top widget) */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-blue-600 shrink-0" />
          SY.com 정식 공지사항 &amp; 새소식
        </h3>

        <div className="space-y-2.5">
          {notices.map((not) => (
            <div
              key={not.id}
              className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-100/50 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-2 min-w-0">
                {not.important && (
                  <span className="bg-rose-50 border border-rose-100 text-rose-600 font-extrabold text-[9px] px-2 py-0.5 rounded shrink-0">
                    중요
                  </span>
                )}
                <span className="text-xs font-bold text-slate-800 truncate">{not.title}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold shrink-0">{not.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block">Frequently Asked Questions</span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">자주 묻는 질문 (FAQ)</h3>
          <p className="text-xs text-slate-500">궁금하신 전기차 화재 안전성 및 보조금 심사 자격을 빠르게 찾아보세요.</p>
        </div>

        {/* Search & Categories */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="예: 보조금, 화재, 안전, 아파트, 계량기..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="input-faq-search"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 text-xs focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center">
            {(['전체', '보조금/비용', '화재안전', '설치과정', '전기안전', '사후관리(A/S)'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFaqCategory(cat)}
                id={`btn-faq-cat-${cat}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  faqCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/10'
                    : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordions */}
        <div className="max-w-3xl mx-auto space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-xs font-semibold">검색 결과에 맞는 자주 묻는 질문이 없습니다.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = selectedFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  id={`faq-item-${faq.id}`}
                  className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setSelectedFaq(isOpen ? null : faq.id)}
                    id={`btn-faq-toggle-${faq.id}`}
                    className="w-full p-4 text-left flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg whitespace-nowrap">
                        {faq.category}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        {faq.question}
                      </span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-slate-100 bg-slate-50/50"
                      >
                        <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold space-y-2">
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Online 1:1 Query and A/S dispatch cards (Double block) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* A/S Dispatch guidance */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col justify-between border border-slate-800 shadow-xl space-y-6">
          <div className="space-y-4">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-wider block">Instant A/S Service</span>
            <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
              기기 고장 및 충전 트러러블 발생 시 <br />
              <span className="text-blue-400">전국 통합 긴급 사후관리(A/S) 접수</span>
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              SY.com은 24시간 실시간 전기안전 모니터링 관제 센터를 운영 중입니다. 기기의 동작 정지 또는 물리적 파손, 입주민 충전 정산 카드 미인식 등 긴급 상황 발생 시 아래 버튼을 클릭하여 즉시 긴급 출동을 신청해 주세요.
            </p>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] text-slate-300 space-y-1.5 font-semibold">
              <p>• <span className="text-slate-400">무상 보증 기간:</span> 정식 설치 완료 후 2년간 (소모품/외벽 파손 제외)</p>
              <p>• <span className="text-slate-400">정비 출동 지침:</span> 당일 오후 4시 전 접수 시 익일 오전 내 기사님 현장 밀착 조치 완료</p>
            </div>
          </div>

          <button
            onClick={handleASButton}
            id="btn-support-as-cta"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/10"
          >
            🚨 실시간 전국 A/S 긴급 신청하기 (로그인 필수)
          </button>
        </div>

        {/* 1:1 Inquiry Form */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block">Online Customer Desk</span>
            <h3 className="text-lg font-black text-slate-950">온라인 1:1 고객지원실</h3>
            <p className="text-[11px] text-slate-400 leading-normal font-medium">
              설치 보조금 자격 검수 이외의 사업 제휴, OEM 충전기 제조 문의, 단체 공급 입찰 제안 등 궁금하신 내용을 편하게 남겨 주시면 24시간 이내에 성실히 서면 또는 유선 회신을 드립니다.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {inquirySuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-12 text-center flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-full border border-blue-100 flex items-center justify-center text-blue-600 mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">1:1 온라인 접수가 완료되었습니다.</h4>
                <p className="text-slate-400 text-[10px] mt-1 font-semibold">남겨 주신 연락처로 담당 부서에서 신속히 안내 회신을 전달하겠습니다.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                {inquiryError && (
                  <div className="p-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-xs">
                    {inquiryError}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">문의 제목</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 지식산업센터 단체 주차장 시공 협약 제안"
                    id="input-support-title"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">회신받으실 연락처 / 이메일</label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="예: 010-1234-5678 또는 name@corp.com"
                    id="input-support-contact"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">문의 내용 상세</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="세부적인 현장 상황 및 문의 세부 제안 내용을 간략히 작성해 주세요."
                    rows={3}
                    id="textarea-support-message"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 text-slate-800 resize-none font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-start gap-1.5 text-[10px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">동의 사항: 수집된 고객 연락정보는 1:1 온라인 고객 상담 답변 및 회신 용도로만 안전하게 일시 저장 후 파기됩니다.</span>
                </div>

                <button
                  type="submit"
                  id="btn-support-submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  온라인 1:1 문의 접수하기
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
