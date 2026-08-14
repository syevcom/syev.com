import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CreditCard,
  Landmark,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  User as UserIcon,
  Phone,
  MapPin,
  FileText,
  Sparkles,
  ShoppingBag,
  UserCheck,
  UserX,
  Lock,
  ChevronRight,
  Mail,
  Check,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, User, ActivePage } from '../types';

interface CheckoutPageProps {
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
  onPageChange: (page: ActivePage) => void;
  onOpenAuthModal: () => void;
  onOpenMyPage?: () => void;
  onOpenLegalModal?: (tab: 'refund' | 'terms' | 'privacy' | 'escrow') => void;
}

export default function CheckoutPage({
  items,
  user,
  onPaymentSuccess,
  onPageChange,
  onOpenAuthModal,
  onOpenMyPage,
  onOpenLegalModal,
}: CheckoutPageProps) {
  // Step state: 'choice' (Guest vs Member) | 'form' (Order Form) | 'complete' (Order Success)
  const [step, setStep] = useState<'choice' | 'form' | 'complete'>(() => {
    return user ? 'form' : 'choice';
  });

  const [orderType, setOrderType] = useState<'member' | 'guest'>(user ? 'member' : 'guest');

  // Automatically transition to form if user logs in while on choice step
  useEffect(() => {
    if (user) {
      setOrderType('member');
      if (step === 'choice') {
        setStep('form');
      }
    }
  }, [user, step]);

  // Form Fields
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [memo, setMemo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'trans' | 'vbank' | 'kakaopay' | 'naverpay'>('card');
  const [taxInvoice, setTaxInvoice] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Auto fill user data when user logs in
  useEffect(() => {
    if (user) {
      if (!buyerName) setBuyerName(user.name || '');
      if (!buyerPhone) setBuyerPhone(user.phone || '');
      if (!buyerEmail) setBuyerEmail(user.email || '');
    }
  }, [user]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

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
    if (!agreeTerms) {
      alert('구매조건 확인 및 개인정보 처리 동의에 체크해 주세요.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const methodLabels: Record<string, string> = {
        card: '신용/체크카드 결제',
        trans: '실시간 계좌이체',
        vbank: '무통장 입금 (가상계좌)',
        kakaopay: '카카오페이',
        naverpay: '네이버페이',
      };

      const orderData = {
        orderId: `SY-ORD-${Date.now().toString().slice(-7)}`,
        totalAmount: totalItemAmount,
        items,
        buyerName,
        buyerPhone,
        buyerEmail,
        address,
        memo,
        paymentMethod: methodLabels[paymentMethod] || '신용/체크카드',
        taxInvoice,
        orderType,
        createdAt: new Date().toLocaleString('ko-KR'),
      };

      setCompletedOrder(orderData);
      setIsProcessing(false);
      setStep('complete');
      onPaymentSuccess(orderData);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  // 1. ORDER COMPLETE SCREEN
  if (step === 'complete' && completedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 text-center"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              주문 및 결제가 성공적으로 완료되었습니다!
            </h1>
            <p className="text-sm font-medium text-slate-600 mb-8">
              SY.com 전문 해피콜 팀이 안내전화 및 설치 일정을 위해 곧 연락드리겠습니다.
            </p>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left mb-8 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-slate-500">주문 번호</span>
                <span className="text-sm font-black font-mono text-blue-600">{completedOrder.orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">주문자 성함</span>
                <span className="text-sm font-extrabold text-slate-800">{completedOrder.buyerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">연락처</span>
                <span className="text-sm font-extrabold text-slate-800">{completedOrder.buyerPhone}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 shrink-0 mt-0.5">배송/설치 주소</span>
                <span className="text-xs font-bold text-slate-800 text-right">{completedOrder.address}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">결제 수단</span>
                <span className="text-xs font-bold text-slate-800">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-xs font-black text-slate-900">최종 결제 금액</span>
                <span className="text-lg font-black text-blue-600">
                  ₩{completedOrder.totalAmount.toLocaleString()}원
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => onPageChange('home')}
                className="py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl cursor-pointer transition-colors shadow-md"
              >
                메인 홈으로 이동
              </button>
              <button
                type="button"
                onClick={() => onPageChange('cart')}
                className="py-3.5 px-6 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-extrabold text-sm rounded-2xl cursor-pointer transition-colors"
              >
                장바구니 확인
              </button>
              {user && onOpenMyPage && (
                <button
                  type="button"
                  onClick={onOpenMyPage}
                  className="py-3.5 px-6 bg-blue-50 text-blue-700 hover:bg-blue-100 font-extrabold text-sm rounded-2xl cursor-pointer transition-colors"
                >
                  마이페이지 주문내역
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // 2. GUEST VS MEMBER SELECTION SCREEN ('choice')
  if (step === 'choice' && !user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => onPageChange('cart')}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="장바구니로 돌아가기"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">주문 방식 선택</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                회원 주문으로 다양한 혜택을 받으시거나, 비회원으로 빠르게 결제하실 수 있습니다.
              </p>
            </div>
          </div>

          {/* Items Summary Header Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">주문 예정 상품 ({totalQuantity}개)</p>
                <p className="text-sm font-black text-slate-800 line-clamp-1">
                  {items.length > 0 ? items[0].name : '선택된 상품 없음'}
                  {items.length > 1 && ` 외 ${items.length - 1}건`}
                </p>
              </div>
            </div>
            <div className="text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
              <span className="text-xs text-slate-500 block">총 결제예정금액</span>
              <span className="text-lg font-black text-blue-600">₩{totalItemAmount.toLocaleString()}원</span>
            </div>
          </div>

          {/* Choice Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Log in & Order */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white border-2 border-blue-600/80 rounded-3xl p-6 sm:p-8 shadow-lg relative flex flex-col justify-between"
            >
              <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-[11px] font-black px-3 py-1 rounded-full">
                추천 (할인/적립)
              </div>

              <div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-5 shadow-md">
                  <UserCheck className="w-6 h-6" />
                </div>

                <h2 className="text-xl font-black text-slate-900 mb-2">회원 로그인 / 가입 후 주문</h2>
                <p className="text-xs text-slate-600 font-medium mb-6 leading-relaxed">
                  로그인 후 주문하시면 주문 내역 관리, 무상 A/S 보증 등록 및 회원 전용 혜택을 이용하실 수 있습니다.
                </p>

                <div className="space-y-2.5 mb-8 text-xs font-bold text-slate-700 bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>실시간 설치/배송 상태 및 이력 조회</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>회원 전용 할인 쿠폰 및 사후 정비 지원</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>카카오/네이버 3초 간편 로그인 지원</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenAuthModal}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2 group"
              >
                <span>로그인하고 주문하기</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Card 2: Guest Order */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mb-5">
                  <UserX className="w-6 h-6" />
                </div>

                <h2 className="text-xl font-black text-slate-900 mb-2">비회원으로 바로 주문</h2>
                <p className="text-xs text-slate-600 font-medium mb-6 leading-relaxed">
                  회원 가입 없이 필수 주문자 정보 및 주소만 입력하여 손쉽게 주문 및 결제를 진행합니다.
                </p>

                <div className="space-y-2.5 mb-8 text-xs font-bold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>가입 없이 빠른 주문 완료</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>주문번호와 휴대폰 번호로 비회원 조회</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>동일한 1:1 전담 해피콜 및 무료 진단 제공</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setOrderType('guest');
                  setStep('form');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 group"
              >
                <span>비회원으로 주문하기</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // 3. FULL ORDER FORM VIEW ('form')
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!user) {
                  setStep('choice');
                } else {
                  onPageChange('cart');
                }
              }}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="뒤로 가기"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">주문 / 결제 작성</h1>
              <p className="text-xs text-slate-500 font-medium">
                배송 및 설치 정보를 확인하신 후 결제를 진행해 주세요.
              </p>
            </div>
          </div>

          {/* User Status Pill */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {user ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>회원 주문 ({user.name}님)</span>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <UserX className="w-3.5 h-3.5 text-amber-600" />
                  비회원 주문
                </span>
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="underline hover:text-amber-900 font-extrabold cursor-pointer ml-1"
                >
                  로그인 전환
                </button>
              </div>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-base font-bold text-slate-700 mb-4">주문할 상품이 선택되지 않았습니다.</p>
            <button
              onClick={() => onPageChange('products')}
              className="px-6 py-3 bg-blue-600 text-white font-black text-xs rounded-xl hover:bg-blue-700 cursor-pointer"
            >
              상품 둘러보기
            </button>
          </div>
        ) : (
          <form onSubmit={handleProcessPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Inputs & Options (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {/* SECTION 1: Orderer Info */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-black text-slate-900">1. 주문자 정보</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      주문자 성함 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="홍길동"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      연락처(휴대폰 번호) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="010-1234-5678"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      이메일 주소 <span className="text-slate-400 font-normal">(견적서 및 주문 안내 발송)</span>
                    </label>
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Shipping & Installation Address */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-black text-slate-900">2. 설치 및 배송지 정보</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      설치/배송 희망 주소 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="예: 광주광역시 동구 금남로 161-11 또는 아파트/건물명"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      배송 / 설치 현장 요청사항
                    </label>
                    <input
                      type="text"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="예: 방문 전 미리 연락주세요. 지하주차장 B2 구역 설치 희망"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all mb-2"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        '방문 전 미리 전화 주세요',
                        '지하주차장 설치 희망',
                        '스탠드형 거치대 추가 문의',
                        '한전 보조금 신청 대행 요청',
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setMemo(preset)}
                          className="text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Payment Method */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-black text-slate-900">3. 결제 수단 선택</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  {[
                    { id: 'card', name: '신용/체크카드', icon: CreditCard },
                    { id: 'kakaopay', name: '카카오페이', icon: Sparkles },
                    { id: 'naverpay', name: '네이버페이', icon: Smartphone },
                    { id: 'trans', name: '실시간 계좌이체', icon: Landmark },
                    { id: 'vbank', name: '무통장 입금', icon: FileText },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between h-20 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-extrabold shadow-sm ring-2 ring-blue-600/20'
                            : 'border-slate-200 bg-white text-slate-700 font-bold hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                        </div>
                        <span className="text-xs">{method.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tax invoice option */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={taxInvoice}
                      onChange={(e) => setTaxInvoice(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      세금계산서 또는 현금영수증 발급 신청 (사업자등록증 접수)
                    </span>
                  </label>
                  {taxInvoice && (
                    <p className="text-[11px] text-slate-500 font-medium mt-2 pl-6">
                      ※ 주문 완료 후 해피콜 진행 시 사업자등록증 사본 전달 또는 이메일로 발행해 드립니다.
                    </p>
                  )}
                </div>
              </div>

              {/* SECTION 4: Terms & Policies */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                {/* 3일 내 상담 / 7일 내 착공 배너 */}
                <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-black shrink-0">
                    ⚡
                  </div>
                  <div className="text-xs space-y-1.5">
                    <p className="font-extrabold text-emerald-950">
                      [본사 직영 책임시공] 결제 후 3일 내 상담 연락 · 7일 내 착공
                    </p>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      결제 완료 시 영업일 <strong>3일 이내</strong> 전담 기술진이 설치 환경 상담 연락을 드리며, 일정 협의 후 <strong>7일 이내 직영 시공 착공</strong>에 들어갑니다. (착공 전 100% 무상 취소/환불 보장)
                    </p>
                    <p className="text-[10.5px] text-amber-800 bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200/60 leading-relaxed">
                      ※ 한전 인입/증설 인허가 승인 일정, 현장 장거리 배선/굴착, 관리사무소 협의 등 현장 여건에 따라 착공 일정이 상호 협의 하에 조정될 수 있습니다.
                    </p>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 shrink-0 mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-black text-slate-900 block">
                      [필수] 주문 내용 확인 및 환불·청약철회 정책, 이용약관 동의
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium leading-relaxed block mt-1">
                      전자상거래법 제17조에 따라 상품 수령 또는 착공 전 7일 이내 무상 청약철회가 가능하며, 본사 직영 시공 조건 및 환불 규정에 동의합니다.
                    </span>
                  </div>
                </label>

                {onOpenLegalModal && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 pl-8">
                    <button
                      type="button"
                      onClick={() => onOpenLegalModal('refund')}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      🔄 환불 / 취소 정책 보기
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenLegalModal('terms')}
                      className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      이용약관 보기
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenLegalModal('privacy')}
                      className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      개인정보처리방침
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenLegalModal('escrow')}
                      className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      에스크로 안내
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Cart Summary Sidebar (4 cols) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-lg sticky top-28 space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-black text-slate-900">주문 상품 요약 ({totalQuantity}개)</h2>
                </div>

                {/* Items list */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-slate-400">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate">{item.name}</p>
                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                          <p className="text-[10px] text-slate-500 truncate font-medium">
                            {Object.values(item.selectedOptions).join(', ')}
                          </p>
                        )}
                        <p className="text-xs font-extrabold text-blue-600 mt-0.5">
                          ₩{item.price.toLocaleString()}원 × {item.quantity}개
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Amount breakdown */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2.5 text-xs font-bold text-slate-600">
                  <div className="flex justify-between items-center">
                    <span>총 상품금액</span>
                    <span className="text-slate-900 font-extrabold">₩{totalItemAmount.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>배송/설치 진단비</span>
                    <span className="text-emerald-600 font-extrabold">₩0원 (무료)</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-dashed border-slate-300 pt-2.5">
                    <span className="text-sm font-black text-slate-900">최종 결제 금액</span>
                    <span className="text-xl font-black text-blue-600 tracking-tight">
                      ₩{totalItemAmount.toLocaleString()}원
                    </span>
                  </div>
                </div>

                {/* Guarantee badge */}
                <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-2xl text-[11px] text-blue-800 font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>특허 화재 차단 솔루션 및 정식 전력 시공 보증</span>
                </div>

                {/* Submit Pay Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-xl transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>안전한 PG 결제 처리 중...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>₩{totalItemAmount.toLocaleString()}원 결제하기</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
