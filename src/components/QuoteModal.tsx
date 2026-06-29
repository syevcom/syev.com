/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Send, Calculator, ShieldCheck, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking } from '../types';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  initialPurpose?: 'Commercial' | 'Residential' | 'ParkingLot';
}

export default function QuoteModal({ isOpen, onClose, onSubmitBooking, initialPurpose = 'Residential' }: QuoteModalProps) {
  const [activeTab, setActiveTab] = useState<'quick' | 'calc'>('quick');
  
  // Quick booking state (Exactly 4 fields!)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('서울');
  const [purpose, setPurpose] = useState<'Commercial' | 'Residential' | 'ParkingLot'>(initialPurpose);
  const [memo, setMemo] = useState('');

  // 1-minute estimation state
  const [calcPower, setCalcPower] = useState<'7' | '11' | '50' | '100' | '200'>('7');
  const [calcQty, setCalcQty] = useState(1);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Simple location options
  const locations = [
    '서울', '경기', '인천', '강원', '충북', '충남/대전', '전북', '전남/광주', '경북/대구', '경남/부산/울산', '제주'
  ];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !phone || !location || !purpose) {
      setError('이름, 연락처, 설치 지역, 용도를 모두 정확히 입력해 주세요.');
      return;
    }

    // Basic phone validation
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9) {
      setError('올바른 연락처(휴대폰 번호)를 입력해 주세요.');
      return;
    }

    // Submit
    onSubmitBooking({
      name,
      phone,
      location,
      purpose,
      memo: memo || `${purpose === 'Commercial' ? '기업용' : purpose === 'Residential' ? '주거용' : '주차장용'} 무상 상담 신청`,
      estimateCost: activeTab === 'calc' ? `${calculateFinalCost().toLocaleString()}원` : undefined
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('');
      setMemo('');
      onClose();
    }, 2500);
  };

  // Helper calculation for 1-minute custom quotation
  const calculateCosts = () => {
    let unitCost = 0;
    let subsidyPerUnit = 0;

    switch (calcPower) {
      case '7':
        unitCost = 1500000;
        subsidyPerUnit = 1100000; // 70% ~ 80% subsidy
        break;
      case '11':
        unitCost = 2200000;
        subsidyPerUnit = 1600000;
        break;
      case '50':
        unitCost = 12000000;
        subsidyPerUnit = 8000000;
        break;
      case '100':
        unitCost = 25000000;
        subsidyPerUnit = 17000000;
        break;
      case '200':
        unitCost = 48000000;
        subsidyPerUnit = 32000000;
        break;
    }

    const totalCost = unitCost * calcQty;
    const totalSubsidy = subsidyPerUnit * calcQty;
    const finalCost = Math.max(0, totalCost - totalSubsidy);

    return { totalCost, totalSubsidy, finalCost };
  };

  const calculateFinalCost = () => {
    return calculateCosts().finalCost;
  };

  const { totalCost, totalSubsidy, finalCost } = calculateCosts();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
        id="quote-modal"
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="btn-close-quote"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors z-10 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Gradient Ribbon */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />

        {/* Scrollable Content wrapper */}
        <div className="overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-12 px-4 flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
                  <CheckCircle className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">상담 신청이 정상 접수되었습니다!</h3>
                <p className="text-slate-500 mt-2.5 max-w-sm text-xs font-semibold leading-relaxed">
                  올해 배정된 <strong>정부 보조금 잔여 한도 선점</strong>을 위해, <strong>2시간 이내</strong>에 담당 전문 컨설턴트가 기재해 주신 번호로 연락드리겠습니다.
                </p>
                <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs text-slate-500 w-full max-w-md font-bold">
                  <div className="grid grid-cols-2 gap-2">
                    <div>• <span className="text-slate-400">신청 고객:</span> {name}</div>
                    <div>• <span className="text-slate-400">연락처:</span> {phone}</div>
                    <div>• <span className="text-slate-400">설치 희망지:</span> {location}</div>
                    <div>• <span className="text-slate-400">구분:</span> {purpose === 'Commercial' ? '기업/관공서' : purpose === 'Residential' ? '주거용' : '수익형 주차장'}</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-1.5 text-blue-600 font-extrabold text-xs uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    정부보조금 마감 임박 혜택 우선 선점
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    무료 설치 상담 & 실시간 맞춤 견적
                  </h2>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-slate-200 mb-6">
                  <button
                    onClick={() => setActiveTab('quick')}
                    id="tab-quote-quick"
                    className={`pb-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all mr-6 cursor-pointer ${
                      activeTab === 'quick'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    30초 초간편 무료 상담 접수
                  </button>
                  <button
                    onClick={() => setActiveTab('calc')}
                    id="tab-quote-calc"
                    className={`pb-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all flex items-center gap-1 cursor-pointer ${
                      activeTab === 'calc'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Calculator className="w-4 h-4" />
                    1분 스마트 보조금 견적기
                  </button>
                </div>

                {/* Tab content */}
                {activeTab === 'quick' ? (
                  <form onSubmit={handleQuickSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">신청인 이름 / 법인 담당자</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="홍길동"
                          id="input-quote-name"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-bold transition-all"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">연락처 (휴대폰 번호)</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="010-1234-5678"
                          id="input-quote-phone"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-bold transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Location */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">설치 희망 지역</label>
                        <select
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          id="select-quote-location"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-bold transition-all"
                        >
                          {locations.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>

                      {/* Purpose */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">설치 용도 구분</label>
                        <select
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value as any)}
                          id="select-quote-purpose"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-bold transition-all"
                        >
                          <option value="Residential">주거용 (단독주택/빌라/아파트)</option>
                          <option value="Commercial">기업/관공서용 (사옥/공장/창고)</option>
                          <option value="ParkingLot">수익형 주차장 (호텔/마트/상가빌딩)</option>
                        </select>
                      </div>
                    </div>

                    {/* Memo (Optional) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">상담 희망 메모 (선택사항)</label>
                      <textarea
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="예: 아파트 입주위원회 설명 자료가 필요합니다 / 100kW 급속 1대 설치하고 싶습니다"
                        rows={3}
                        id="textarea-quote-memo"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-bold transition-all resize-none"
                      />
                    </div>

                    <div className="flex items-start gap-2 bg-blue-50/50 rounded-2xl p-4 border border-blue-100 text-[11px] text-slate-600 mt-4">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="font-semibold leading-relaxed">
                        <strong className="text-slate-800">안심 보증 정책:</strong> 입력하신 정보는 한전 한도 및 정부 무상 보조금 산정 용도로만 안전하게 활용되며, 전문 법률에 따라 개인정보보호법을 철저히 준수합니다.
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="btn-quote-submit"
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all text-center flex items-center justify-center gap-2 mt-6 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      👉 30초 만에 무료 설치 상담 예약하기
                    </button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {/* Calculator Config */}
                    <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">시뮬레이터 설정</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Power Select */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">선택 기기 출력</label>
                          <select
                            value={calcPower}
                            onChange={(e) => setCalcPower(e.target.value as any)}
                            id="select-calc-power"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                          >
                            <option value="7">7kW 스마트 완속 (주택, 빌라, 아파트)</option>
                            <option value="11">11kW 스마트 고속완속 (빌딩, 주차장)</option>
                            <option value="50">50kW 도심형 급속 (상가, 마트, 요식업)</option>
                            <option value="100">100kW 멀티 급속 (호텔, 빌딩 주차장)</option>
                            <option value="200">200kW 초급속 하이퍼 (물류창고, 지자체)</option>
                          </select>
                        </div>

                        {/* Qty Select */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">설치 수량 (대)</label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setCalcQty(Math.max(1, calcQty - 1))}
                              id="btn-calc-qty-dec"
                              className="w-10 h-10 bg-white border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="99"
                              value={calcQty}
                              onChange={(e) => setCalcQty(Math.max(1, parseInt(e.target.value) || 1))}
                              id="input-calc-qty"
                              className="w-16 h-10 bg-white border border-slate-200 rounded-xl text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                            />
                            <button
                              type="button"
                              onClick={() => setCalcQty(calcQty + 1)}
                              id="btn-calc-qty-inc"
                              className="w-10 h-10 bg-white border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cost Output Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">시공/설비 정가</span>
                        <span className="text-xs font-bold text-slate-500 line-through">
                          {totalCost.toLocaleString()}원
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                        <span className="text-[10px] text-blue-600 font-extrabold block mb-1">예상 정부 보조금</span>
                        <span className="text-xs font-black text-blue-600">
                          - {totalSubsidy.toLocaleString()}원
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
                        <span className="text-[10px] text-indigo-800 font-extrabold block mb-1">최종 자가 부담금</span>
                        <span className="text-xs font-black text-indigo-700">
                          {finalCost.toLocaleString()}원
                        </span>
                      </div>
                    </div>

                    {/* Explanatory text */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-4 border border-blue-200/50 text-xs text-slate-600 space-y-1.5 font-semibold">
                      <p className="font-extrabold text-slate-800 flex items-center gap-1.5 text-xs">
                        <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                        올해 정부보조금 선점 우선 신청 대상자 추가 혜택
                      </p>
                      <p>
                        * 상기 견적은 전국 평균 지자체 무상 지원 보조금을 기준으로 산출되었으며, 신청자의 지역 및 당해 한도에 따라 최대 100% 무상 시공까지 가능합니다.
                      </p>
                      <p>
                        * SY.com 한전 대행 수수료 무상 면제 프로모션 혜택이 적용되어 계량기 신설 비용이 최소화됩니다.
                      </p>
                    </div>

                    {/* Quick reservation direct form wrapper inside estimate tab */}
                    <div className="p-5 border border-slate-200 rounded-3xl space-y-3">
                      <h4 className="text-xs font-black text-slate-800">이 견적으로 바로 상담 및 보조금 예약 접수</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="이름 (예: 홍길동)"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          id="input-calc-name"
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-xs font-bold focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                          type="tel"
                          placeholder="연락처 (예: 010-1234-5678)"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          id="input-calc-phone"
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-xs font-bold focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          id="select-calc-location"
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-bold focus:ring-1 focus:ring-blue-500"
                        >
                          {locations.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                        <select
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value as any)}
                          id="select-calc-purpose"
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-bold focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Residential">주거용 (7kW 추천)</option>
                          <option value="Commercial">기업용 (급속/완속 추천)</option>
                          <option value="ParkingLot">수익형 주차장 (급속 추천)</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleQuickSubmit}
                        id="btn-calc-quote-submit"
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
                      >
                        👉 이 견적으로 보조금 선점 신청 접수하기
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
