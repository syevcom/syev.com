import React, { useState } from 'react';
import { X, ShieldCheck, RefreshCw, FileText, Lock, AlertCircle, Phone, Mail, Clock, HelpCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type LegalTabType = 'refund' | 'terms' | 'privacy' | 'escrow';

interface LegalTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTabType;
}

export default function LegalTermsModal({
  isOpen,
  onClose,
  initialTab = 'refund'
}: LegalTermsModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTabType>(initialTab);

  // Update tab when modal re-opens with different initialTab
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>법적 고지 및 정책 안내</span>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  전자상거래 표준 규정
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                에스와이닷컴(SY.com)의 이용약관, 개인정보처리방침 및 환불/취소 정책 안내입니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/90 px-4 pt-3 gap-2 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('refund')}
            className={`pb-3 px-4 rounded-t-xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 border-b-2 ${
              activeTab === 'refund'
                ? 'bg-white text-emerald-700 border-emerald-600 shadow-2xs'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <span>환불 및 취소 / 청약철회 정책</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 px-4 rounded-t-xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 border-b-2 ${
              activeTab === 'terms'
                ? 'bg-white text-emerald-700 border-emerald-600 shadow-2xs'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>서비스 이용약관</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-4 rounded-t-xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 border-b-2 ${
              activeTab === 'privacy'
                ? 'bg-white text-emerald-700 border-emerald-600 shadow-2xs'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>개인정보처리방침</span>
          </button>

          <button
            onClick={() => setActiveTab('escrow')}
            className={`pb-3 px-4 rounded-t-xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 border-b-2 ${
              activeTab === 'escrow'
                ? 'bg-white text-emerald-700 border-emerald-600 shadow-2xs'
                : 'text-slate-500 border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>에스크로 / 구매안전서비스</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-slate-700 text-xs sm:text-sm leading-relaxed space-y-6">
          {/* 1. REFUND / CANCELLATION TAB */}
          {activeTab === 'refund' && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2">
                <h4 className="text-emerald-950 font-black text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  전자상거래 등에서의 소비자보호에 관한 법률 제17조 준수
                </h4>
                <p className="text-emerald-900 text-xs font-medium">
                  에스와이닷컴은 관련 법령에 따라 소비자의 정당한 청약철회권 및 환불 권리를 적극 보장합니다.
                </p>
              </div>

              <section className="space-y-3">
                <h5 className="font-black text-slate-900 text-sm border-l-4 border-emerald-500 pl-3">
                  제1조 (청약철회 및 취소 가능 기간)
                </h5>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2">
                  <li><strong>단품 기기(배송 상품):</strong> 상품을 배송받은 날로부터 <strong>7일 이내</strong> 청약철회(반품/환불)를 신청하실 수 있습니다.</li>
                  <li><strong>설치/시공 패키지:</strong> 현장 실측 전 또는 시공 공사 착공 전까지는 전액 결제 취소 및 환불이 가능합니다.</li>
                  <li><strong>표시·광고 내용과 다른 경우:</strong> 공급받은 날로부터 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날로부터 30일 이내에 청약철회가 가능합니다.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h5 className="font-black text-slate-900 text-sm border-l-4 border-emerald-500 pl-3">
                  제2조 (청약철회가 제한되는 경우)
                </h5>
                <p className="text-slate-600">
                  전자상거래법 제17조 제2항에 따라 다음의 경우 청약철회가 제한될 수 있습니다:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2">
                  <li>소비자의 책임 있는 사유로 상품 등이 멸실되거나 훼손된 경우</li>
                  <li>소비자의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우</li>
                  <li>시간의 경과에 의하여 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우</li>
                  <li><strong>전기공사/인입공사가 착공 또는 완료된 경우:</strong> 이미 투입된 전기 자재비, 한전 납입금 및 현장 기술 시공 인건비 실비는 공제 후 환불될 수 있습니다.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h5 className="font-black text-slate-900 text-sm border-l-4 border-emerald-500 pl-3">
                  제3조 (반품/교환 배송비)
                </h5>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2">
                  <li><strong>고객 단순 변심:</strong> 왕복 반품 택배비(기본 8,000원, 중량물에 따라 상이)는 고객님 부담입니다.</li>
                  <li><strong>상품 불량 및 오배송:</strong> 반품 및 교환에 소요되는 모든 배송비는 에스와이닷컴이 전액 부담합니다.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h5 className="font-black text-slate-900 text-sm border-l-4 border-emerald-500 pl-3">
                  제4조 (환불 절차 및 소요 기간)
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-extrabold text-slate-900 block">신용/체크카드 결제</span>
                    <p className="text-slate-600">
                      반품 접수 및 제품 입고 확인 후 <strong>영업일 기준 3~5일 이내</strong> 카드사 승인취소가 완료됩니다.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-extrabold text-slate-900 block">실시간 계좌이체 / 가상계좌</span>
                    <p className="text-slate-600">
                      취소 승인일로부터 <strong>영업일 기준 1~2일 이내</strong> 고객님의 환불 계좌로 입금됩니다.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h5 className="font-black text-slate-900 text-sm border-l-4 border-emerald-500 pl-3">
                  제5조 (제품 무상 보증 및 A/S 규정)
                </h5>
                <p className="text-slate-600">
                  모든 정품 충전기 기기는 <strong>기본 2년 무상 품질보증(A/S)</strong>을 제공하며, 본사 시공 설치 건은 <strong>설치 하자 1년 무상 보증</strong>이 적용됩니다.
                </p>
              </section>

              <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <p className="font-extrabold text-slate-900">📞 취소/반품/환불 접수 및 고객지원센터</p>
                <div className="flex flex-wrap gap-4 text-slate-600">
                  <span><strong>전화:</strong> 1588-0000 / 010-8647-7975</span>
                  <span><strong>이메일:</strong> sy.car.com@gmail.com</span>
                  <span><strong>운영시간:</strong> 평일 09:00 ~ 18:00 (주말/공휴일 휴무)</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. TERMS OF SERVICE TAB */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <section className="space-y-3">
                <h5 className="font-black text-slate-900 text-sm border-l-4 border-emerald-500 pl-3">
                  제1조 (목적)
                </h5>
                <p className="text-slate-600">
                  본 약관은 에스와이닷컴(이하 "회사")이 운영하는 전기차 충전기 판매 및 시공 플랫폼(이하 "서비스")을 이용함에 있어 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              <section className="space-y-3">
                <h5 className="font-black text-slate-900 text-sm border-l-4 border-emerald-500 pl-3">
                  제2조 (용어의 정의)
                </h5>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2">
                  <li>"서비스"란 회사가 제공하는 충전기 상품 판매, 온라인 견적 산출, 설치 시공 중개 및 유지보수 관리 일체를 말합니다.</li>
                  <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
                  <li>"구매계약"이란 이용자가 상품 또는 시공 서비스를 주문하고 결제를 완료하여 성립하는 계약을 말합니다.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h5 className="font-black text-slate-900 text-sm border-l-4 border-emerald-500 pl-3">
                  제3조 (주문 및 결제)
                </h5>
                <p className="text-slate-600">
                  이용자는 회사가 제공하는 신용카드, 실시간 계좌이체, 무통장입금(가상계좌), 간편결제(카카오페이, 네이버페이) 등의 결제수단을 통해 구매 대금을 결제할 수 있습니다.
                </p>
              </section>

              <section className="space-y-3">
                <h5 className="font-black text-slate-900 text-sm border-l-4 border-emerald-500 pl-3">
                  제4조 (계약의 해제 및 분쟁의 해결)
                </h5>
                <p className="text-slate-600">
                  이용자는 전자상거래법에 따라 계약 체결 후 7일 이내에 청약철회를 할 수 있으며, 서비스 이용 중 발생한 분쟁은 관계 법령 및 소비자분쟁해결기준에 따릅니다.
                </p>
              </section>
            </div>
          )}

          {/* 3. PRIVACY POLICY TAB */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <section className="space-y-3">
                <h5 className="font-black text-slate-900 text-sm border-l-4 border-emerald-500 pl-3">
                  1. 개인정보의 수집 및 이용 목적
                </h5>
                <p className="text-slate-600">
                  회사는 다음의 목적을 위해 개인정보를 수집 및 이용합니다:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                  <li>충전기 설치 견적 산출 및 현장 실측 예약 처리</li>
                  <li>상품 주문, 결제 승인, 배송 및 시공 설치 진행</li>
                  <li>고객 상담, 불만 처리 및 하자보수 A/S 지원</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h5 className="font-black text-slate-900 text-sm border-l-4 border-emerald-500 pl-3">
                  2. 수집하는 개인정보 항목
                </h5>
                <p className="text-slate-600">
                  - <strong>필수항목:</strong> 성명, 연락처(휴대전화번호), 설치/배송 희망 주소, 결제 정보<br />
                  - <strong>선택항목:</strong> 차량 모델명, 이메일 주소, 요청 메모
                </p>
              </section>

              <section className="space-y-3">
                <h5 className="font-black text-slate-900 text-sm border-l-4 border-emerald-500 pl-3">
                  3. 개인정보의 보유 및 이용 기간
                </h5>
                <p className="text-slate-600">
                  원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 전자상거래 등에서의 소비자보호에 관한 법률 등 관련 법령에 의하여 보존할 필요가 있는 경우 법정 기간 동안 보관합니다:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                  <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                  <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                  <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                </ul>
              </section>
            </div>
          )}

          {/* 4. ESCROW TAB */}
          {activeTab === 'escrow' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-2">
                <h4 className="text-blue-950 font-black text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  포트원 및 결제대행사(PG) 구매안전(에스크로) 서비스 적용
                </h4>
                <p className="text-blue-900 text-xs font-medium">
                  에스와이닷컴은 소비자의 안전한 전자상거래를 위하여 전자상거래법 제24조에 따른 결제대금예치(에스크로) 서비스를 제공하고 있습니다.
                </p>
              </div>

              <section className="space-y-3">
                <h5 className="font-black text-slate-900 text-sm border-l-4 border-blue-500 pl-3">
                  구매안전서비스란?
                </h5>
                <p className="text-slate-600">
                  고객님이 결제하신 결제대금을 공신력 있는 금융기관(PG사)이 예치하고 있다가, 상품 배송 및 시공 설치가 안전하게 완료된 후 판매자에게 대금을 지급하는 소비자 안심 결제 보호 제도입니다.
                </p>
              </section>

              <section className="space-y-3">
                <h5 className="font-black text-slate-900 text-sm border-l-4 border-blue-500 pl-3">
                  보호 대상 거래
                </h5>
                <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                  <li>에스와이닷컴 온라인 몰을 통해 진행되는 모든 현금성(계좌이체/가상계좌) 및 카드 결제 건</li>
                  <li>소비자 피해 보상 보험 가입을 통해 안전한 거래를 100% 보장합니다.</li>
                </ul>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </motion.div>
    </div>
  );
}
