import React, { useState } from 'react';
import { X, CreditCard, Landmark, Smartphone, CheckCircle2, ShieldCheck, ArrowRight, User as UserIcon, Phone, MapPin, FileText, Sparkles, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, User } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  user: User | null;
  onPaymentSuccess: (orderData: {
    orderId: string;
    totalAmount: number;
    items: CartItem[];
    buyerName: string;
    buyerPhone: string;
    address: string;
    memo: string;
    paymentMethod: string;
    taxInvoice: boolean;
  }) => void;
  onOpenMyPage?: () => void;
  onOpenLegalModal?: (tab: 'refund' | 'terms' | 'privacy' | 'escrow') => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  items,
  user,
  onPaymentSuccess,
  onOpenMyPage,
  onOpenLegalModal,
}: PaymentModalProps) {
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [memo, setMemo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'trans' | 'vbank' | 'kakaopay' | 'naverpay'>('card');
  const [taxInvoice, setTaxInvoice] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  if (!isOpen) return null;

  const totalItemAmount = items.reduce((sum, item) => {
    const itemPrice = item.price || 0;
    return sum + itemPrice * item.quantity;
  }, 0);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!buyerName.trim()) {
      alert('주문자 성함을 입력해 주세요.');
      return;
    }
    if (!buyerPhone.trim()) {
      alert('연락처(휴대폰 번호)를 입력해 주세요.');
      return;
    }
    if (!address.trim()) {
      alert('설치/배송 희망 주소를 입력해 주세요.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const methodLabels: Record<string, string> = {
        card: '신용/체크카드 결제',
        trans: '실시간 계좌이체',
        vbank: '무통장 입금 (가상계좌)',
        kakaopay: '카카오페이',
        naverpay: '네이버페이'
      };

      const orderData = {
        orderId: `SY-ORD-${Date.now().toString().slice(-7)}`,
        totalAmount: totalItemAmount,
        items,
        buyerName,
        buyerPhone,
        address,
        memo,
        paymentMethod: methodLabels[paymentMethod] || '신용카드',
        taxInvoice,
        createdAt: new Date().toLocaleString('ko-KR')
      };

      setCompletedOrder(orderData);
      setIsProcessing(false);
      setIsSuccess(true);
      onPaymentSuccess(orderData);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={isProcessing ? undefined : onClose}
        className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight flex items-center gap-2">
                주문 / 결제하기
                <span className="text-[10px] bg-blue-500 text-white font-black px-2 py-0.5 rounded-full">
                  안심 결제
                </span>
              </h3>
              <p className="text-[11px] text-slate-300 font-medium">에스와이 차아저 공식 전자상거래 주문 수납 서비스</p>
            </div>
          </div>
          {!isProcessing && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isSuccess && completedOrder ? (
            /* SUCCESS VIEW */
            <div className="py-6 text-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs rounded-full">
                  주문 및 결제 신청 완료
                </span>
                <h3 className="text-xl font-black text-slate-900">결제가 성공적으로 접수되었습니다!</h3>
                <p className="text-xs text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                  에스와이 전담 엔지니어가 24시간 이내에 직접 안내 전화를 드려 설치 현장 정밀 진단 및 상세 출고 일정을 안내해 드립니다.
                </p>
              </div>

              {/* Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3.5 max-w-lg mx-auto">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-bold">주문 번호</span>
                  <span className="font-black text-slate-900 font-mono">{completedOrder.orderId}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-bold">결제 일시</span>
                  <span className="font-semibold text-slate-800">{completedOrder.createdAt}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-bold">주문자 / 연락처</span>
                  <span className="font-semibold text-slate-800">{completedOrder.buyerName} ({completedOrder.buyerPhone})</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-bold">설치 희망 주소</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[220px]">{completedOrder.address}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-bold">결제 수단</span>
                  <span className="font-bold text-blue-600">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="font-black text-slate-900">최종 결제 금액</span>
                  <span className="font-black text-blue-600 text-lg">
                    ₩{completedOrder.totalAmount.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-lg mx-auto">
                {onOpenMyPage && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenMyPage();
                    }}
                    className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>마이페이지에서 주문 내역 확인</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all cursor-pointer"
                >
                  쇼핑 계속하기
                </button>
              </div>
            </div>
          ) : (
            /* PAYMENT FORM VIEW */
            <form onSubmit={handleProcessPayment} className="space-y-6">
              {/* 1. Order Items Summary */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    주문 상품 정보 ({totalQuantity}개)
                  </h4>
                  <span className="text-xs font-black text-blue-600">
                    합계: ₩{totalItemAmount.toLocaleString()}원
                  </span>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-150">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                          ⚡
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-black text-slate-900 truncate">{item.name}</h5>
                        <div className="flex flex-wrap items-center gap-1 mt-0.5">
                          <span className="text-[10px] text-slate-500 font-medium">수량 {item.quantity}개</span>
                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                            <span className="text-[10px] text-blue-600 font-bold">
                              · 옵션: {item.selectedOptions.map(o => o.optionName).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-slate-900">
                          ₩{((item.price || 0) * item.quantity).toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Customer & Delivery Address Form */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                  주문자 및 설치 희망지 정보
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 mb-1">
                      주문자 성함 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="홍길동"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-700 mb-1">
                      연락처 (휴대폰) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="010-1234-5678"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    이메일 주소 (선택)
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="example@domain.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    설치/배송 희망 주소 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="아파트/주택 상세 주소를 입력하세요 (예: 서울시 강남구 테헤란로 123 에스와이타워)"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    배송 및 설치 요청사항 (선택)
                  </label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="예: 방문 전 사전 연락 부탁드립니다 / 아파트 지하주차장 설치"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* 3. Payment Method Selection */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    결제 수단 선택
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">보안 PG 수납 암호화 연결</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-black">신용/체크카드</div>
                      <div className="text-[10px] opacity-75">무이자 할부 지원</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vbank')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                      paymentMethod === 'vbank'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Landmark className={`w-5 h-5 ${paymentMethod === 'vbank' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-black">무통장 입금</div>
                      <div className="text-[10px] opacity-75">가상계좌 발급</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('kakaopay')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                      paymentMethod === 'kakaopay'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-950 ring-2 ring-yellow-400/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Smartphone className={`w-5 h-5 ${paymentMethod === 'kakaopay' ? 'text-yellow-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-black">카카오페이</div>
                      <div className="text-[10px] opacity-75">간편 결제</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('naverpay')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                      paymentMethod === 'naverpay'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Sparkles className={`w-5 h-5 ${paymentMethod === 'naverpay' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-black">네이버페이</div>
                      <div className="text-[10px] opacity-75">네이버 포인트 적립</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('trans')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 col-span-2 sm:col-span-2 ${
                      paymentMethod === 'trans'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Landmark className={`w-5 h-5 ${paymentMethod === 'trans' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-black">실시간 계좌이체</div>
                      <div className="text-[10px] opacity-75">은행 즉시 이체</div>
                    </div>
                  </button>
                </div>

                {paymentMethod === 'vbank' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                    <p className="font-extrabold flex items-center gap-1">
                      🏦 에스와이 입금 전용 계좌 안내
                    </p>
                    <p className="text-[11px] font-semibold text-amber-800">
                      국민은행 <span className="font-mono font-black">812701-04-123456</span> (주)에스와이이비
                    </p>
                    <p className="text-[10px] text-amber-700 opacity-90">
                      * 주문 완료 후 안내된 계좌로 입금해 주시면 확인 즉시 현장 엔지니어가 배정됩니다.
                    </p>
                  </div>
                )}

                {/* Tax Invoice checkbox */}
                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={taxInvoice}
                      onChange={(e) => setTaxInvoice(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span>지출증빙 세금계산서 / 현금영수증 발행 신청</span>
                  </label>
                </div>
              </div>

              {/* 4. Terms and Refund Policy Agreement */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    required
                    defaultChecked
                    id="agreePaymentModal"
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 shrink-0 mt-0.5"
                  />
                  <label htmlFor="agreePaymentModal" className="text-xs text-slate-700 leading-snug cursor-pointer">
                    <span className="font-bold text-slate-900">[필수] 주문 내용 확인 및 환불·청약철회 정책 동의</span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      전자상거래법 제17조 준수 (상품 수령/착공 전 7일 이내 무상 청약철회 가능)
                    </span>
                  </label>
                </div>

                {onOpenLegalModal && (
                  <div className="flex flex-wrap gap-2 pt-1.5 border-t border-slate-200/60 pl-6">
                    <button
                      type="button"
                      onClick={() => onOpenLegalModal('refund')}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    >
                      🔄 환불정책 전문 보기
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenLegalModal('terms')}
                      className="text-[10px] font-bold text-slate-600 hover:text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 transition-colors cursor-pointer"
                    >
                      이용약관
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenLegalModal('privacy')}
                      className="text-[10px] font-bold text-slate-600 hover:text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 transition-colors cursor-pointer"
                    >
                      개인정보처리방침
                    </button>
                  </div>
                )}
              </div>

              {/* 5. Payment Submit Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-xl transition-all transform hover:scale-[1.005] active:scale-[0.995] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>보안 결제 진행 중입니다...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>총 ₩{totalItemAmount.toLocaleString()}원 안전 결제하기</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-400 font-medium text-center mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  SSL 256bit 암호화 안전 수납 시스템 적용
                </p>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
