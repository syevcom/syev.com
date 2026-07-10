/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, User, Building, Calendar, Clock, Hammer, CheckCircle2, ChevronRight, Wrench, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserType, Booking, ASRequest } from '../types';

interface MyPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  bookings: Booking[];
  asRequests: ASRequest[];
  onAddASRequest: (request: Omit<ASRequest, 'id' | 'userId' | 'createdAt' | 'status'>) => void;
  onLogout: () => void;
}

export default function MyPageModal({
  isOpen,
  onClose,
  user,
  bookings,
  asRequests,
  onAddASRequest,
  onLogout
}: MyPageModalProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'as' | 'profile'>('status');

  // AS Request input states
  const [isAddingAS, setIsAddingAS] = useState(false);
  const [productName, setProductName] = useState('SY-AC07 스마트 홈 & 완속');
  const [serialNumber, setSerialNumber] = useState('');
  const [symptom, setSymptom] = useState('');
  const [asSuccess, setAsSuccess] = useState('');
  const [asError, setAsError] = useState('');

  if (!isOpen) return null;

  // Filter bookings for this user
  const userBookings = bookings; 
  const userASRequests = asRequests;

  const handleASSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAsError('');
    setAsSuccess('');

    if (!productName || !symptom) {
      setAsError('기기명과 고장 증상을 정확히 작성해 주세요.');
      return;
    }

    onAddASRequest({
      productName,
      serialNumber: serialNumber || '일반 접수 (시리얼 확인 불가)',
      symptom
    });

    setAsSuccess('전국 A/S 접수가 완료되었습니다. 담당 기사님이 2시간 내로 해피콜 전화를 드립니다.');
    setSymptom('');
    setSerialNumber('');
    
    setTimeout(() => {
      setIsAddingAS(false);
      setAsSuccess('');
    }, 2500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '접수대기':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case '상담예약완료':
        return 'bg-cyan-50 text-cyan-600 border-cyan-100';
      case '시공설계중':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case '시공완료':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case '접수완료':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case '기사배정':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case '처리완료':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

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
        id="mypage-modal"
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="btn-close-mypage"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors z-10 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Hero Area */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 text-white relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
              {user.type === 'B2B' ? (
                <Building className="w-8 h-8 text-emerald-400" />
              ) : (
                <User className="w-8 h-8 text-emerald-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight leading-none">{user.name}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                  user.type === 'B2B' 
                    ? 'bg-indigo-500/10 text-indigo-350 border-indigo-500/30' 
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                }`}>
                  {user.type === 'B2B' ? '법인 파트너' : '개인회원'}
                </span>
              </div>
              <p className="text-xs text-slate-350 mt-1 font-semibold">{user.email}</p>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-3 gap-2.5 mt-6 pt-5 border-t border-white/10">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-bold block">진행 중인 설치 예약</span>
              <span className="text-lg font-black text-emerald-500">{userBookings.length}건</span>
            </div>
            <div className="text-center border-x border-white/10">
              <span className="text-[10px] text-slate-400 font-bold block">전국 무상 A/S 내역</span>
              <span className="text-lg font-black text-emerald-500">{userASRequests.length}건</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-bold block">B2B 맞춤 공급 단가</span>
              <span className="text-xs font-bold text-indigo-300 mt-1 block">
                {user.type === 'B2B' ? 'VIP 등급 (우대)' : '표준 요금제 적용'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6">
          <button
            onClick={() => setActiveTab('status')}
            id="tab-mypage-status"
            className={`py-3.5 text-xs font-extrabold border-b-2 transition-all mr-6 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'status'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            실시간 설치 및 시공 현황 ({userBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('as')}
            id="tab-mypage-as"
            className={`py-3.5 text-xs font-extrabold border-b-2 transition-all mr-6 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'as'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Wrench className="w-4 h-4" />
            전국 긴급 A/S 신청 ({userASRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            id="tab-mypage-profile"
            className={`py-3.5 text-xs font-extrabold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <User className="w-4 h-4" />
            회원정보 &amp; 혜택
          </button>
        </div>

        {/* Scrollable Main body */}
        <div className="overflow-y-auto p-6 flex-grow bg-white">
          <AnimatePresence mode="wait">
            {activeTab === 'status' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold text-slate-900">상담 및 설치 신청 리스트</h4>
                  <span className="text-[10px] text-slate-400 font-bold">최근 업데이트: 실시간 (2시간 이내 해피콜 지원)</span>
                </div>

                {userBookings.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
                    <Calendar className="w-10 h-10 text-slate-350 mx-auto mb-2" />
                    <p className="text-slate-500 text-xs font-bold">신청하신 설치 예약 내역이 없습니다.</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">상단의 "실시간 상담/예약" 버튼을 통해 빠르게 신청해 보세요!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userBookings.map((b, idx) => (
                      <div
                        key={b.id || idx}
                        className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-900">{b.name} 고객님</span>
                            <span className="text-[10px] text-slate-400 font-bold">| {b.location} ({b.purpose === 'Commercial' ? '기업/관공서' : b.purpose === 'Residential' ? '주거용' : '수익형 주차장'})</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                            신청 메모: {b.memo || '무상 설치 컨설팅 요청'}
                          </p>
                          {b.estimateCost && (
                            <p className="text-xs text-emerald-600 font-extrabold">
                              자가 부담금 가견적: {b.estimateCost}
                            </p>
                          )}
                          <div className="text-[10px] text-slate-450 flex items-center gap-1 pt-1 font-bold">
                            <Clock className="w-3 h-3" />
                            신청 일자: {b.createdAt}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start md:self-center">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${getStatusColor(b.status)}`}>
                            {b.status}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 hidden md:block" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'as' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-xs font-bold text-slate-900">전국 원스톱 A/S 접수 현황</h4>
                  {!isAddingAS && (
                    <button
                      onClick={() => setIsAddingAS(true)}
                      id="btn-mypage-as-new"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      A/S 긴급 접수하기
                    </button>
                  )}
                </div>

                {isAddingAS ? (
                  <form onSubmit={handleASSubmit} className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/10 space-y-3.5">
                    <h5 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">A/S 신규 접수 신청</h5>

                    {asError && (
                      <div className="p-2 text-xs bg-rose-50 border border-rose-100 text-rose-600 rounded-xl font-bold">
                        {asError}
                      </div>
                    )}
                    {asSuccess && (
                      <div className="p-2 text-xs bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl font-bold">
                        {asSuccess}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">고장 충전기 모델 선택</label>
                        <select
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          id="select-as-product"
                          className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold"
                        >
                          <option value="SY-AC07 스마트 홈 & 완속">SY-AC07 스마트 홈 &amp; 완속 (7kW)</option>
                          <option value="SY-AC11 프로 멀티 완속">SY-AC11 프로 멀티 완속 (11kW)</option>
                          <option value="SY-DC50 슬림 급속">SY-DC50 슬림 급속 (50kW)</option>
                          <option value="SY-FC200 하이퍼 초급속">SY-FC200 하이퍼 초급속 (200kW)</option>
                          <option value="SY-Home07 마이 박스">SY-Home07 마이 박스 (7kW)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">충전기 일련번호 (선택)</label>
                        <input
                          type="text"
                          value={serialNumber}
                          onChange={(e) => setSerialNumber(e.target.value)}
                          placeholder="예: SY-2026-1452"
                          id="input-as-serial"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">고장 증상 및 현장 상태</label>
                      <textarea
                        value={symptom}
                        onChange={(e) => setSymptom(e.target.value)}
                        placeholder="예: LCD 화면이 안 켜집니다 / 충전 커넥터 연결 후 대기 상태에서 넘어가지 않습니다"
                        rows={2.5}
                        id="textarea-as-symptom"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold resize-none"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingAS(false)}
                        id="btn-as-cancel"
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs text-slate-600 font-bold cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        id="btn-as-submit"
                        className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        A/S 출동 신청 접수
                      </button>
                    </div>
                  </form>
                ) : null}

                {userASRequests.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl">
                    <Hammer className="w-8 h-8 text-slate-350 mx-auto mb-2" />
                    <p className="text-slate-500 text-xs font-bold">접수된 긴급 A/S 정비 내역이 없습니다.</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">SY.com 전력 안전 관제망이 정상 가동 중입니다.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {userASRequests.map((req, idx) => (
                      <div
                        key={req.id || idx}
                        className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-900">{req.productName}</span>
                            <span className="text-[10px] text-slate-400 font-bold">일련번호: {req.serialNumber}</span>
                          </div>
                          <p className="text-xs text-slate-600 font-semibold">
                            증상: {req.symptom}
                          </p>
                          <span className="text-[9px] text-slate-450 block pt-0.5 font-bold">
                            접수 일시: {req.createdAt}
                          </span>
                        </div>

                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border self-start md:self-center ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl border border-slate-150 bg-slate-50/50 space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">계정 정보 상세</h4>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                    <div>
                      <span className="font-semibold text-slate-400 block mb-0.5">이름 (담당자)</span>
                      <span className="font-bold text-slate-800">{user.name}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400 block mb-0.5">이메일 계정</span>
                      <span className="font-bold text-slate-800">{user.email}</span>
                    </div>

                    {user.type === 'B2B' && (
                      <>
                        <div>
                          <span className="font-semibold text-slate-400 block mb-0.5">법인명 / 상호</span>
                          <span className="font-bold text-emerald-700">{user.companyName}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-400 block mb-0.5">사업자등록번호</span>
                          <span className="font-bold text-emerald-700">{user.businessNumber}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/10 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    {user.type === 'B2B' ? 'VIP 법인 회원 혜택 리스트' : 'SY.com 일반 회원 혜택'}
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 font-semibold">
                    {user.type === 'B2B' ? (
                      <>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>충전기 B2B 도매 가격 적용 (정가 대비 평균 15% 할인 혜택)</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>원격 관제 시스템 (SY-OCS) 월 사용료 평생 무상 면제</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>세금계산서 발행 및 현장 설치 적합성 보고서 무상 발급</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>무상 품질 보증 2년에서 3년으로 즉시 1년 연장 특전 제공</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>한전 신청 및 인입 설계 대행 수수료 100% 무상 면제</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>설치비 환경부/지자체 보조금 우선 매칭 가이드 제공</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>기기 하자 및 안전 이상 발생 시 2년간 무상 수리 출장 보증</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  id="btn-mypage-logout"
                  className="w-full py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
                >
                  로그아웃
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
