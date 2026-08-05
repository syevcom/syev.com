/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { X, Share2, Heart, Star, Check, ShoppingBag, ShieldCheck, ChevronRight, Plus } from 'lucide-react';
import { Product, CartItem, ProductOptionGroup } from '../types';
import { DEFAULT_RESIDENTIAL_OPTION_GROUPS } from '../data';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, selectedOptions?: { groupTitle: string; optionName: string; optionPrice: number }[], totalPrice?: number) => void;
  onOpenQuoteWithPurpose?: (purpose: 'Commercial' | 'Residential' | 'ParkingLot', memoText?: string) => void;
  onSelectCategoryQuick?: (typeOrKw: string) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onOpenQuoteWithPurpose,
  onSelectCategoryQuick
}: ProductDetailModalProps) {
  if (!isOpen || !product) return null;

  // Selected option state: map of optionGroupId -> optionItemId
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [isLiked, setIsLiked] = useState(false);
  const [addedSuccessMsg, setAddedSuccessMsg] = useState(false);

  // Dynamic additional option groups state
  const [activeOptionGroups, setActiveOptionGroups] = useState<ProductOptionGroup[]>(() => {
    return product?.optionGroups && product.optionGroups.length > 0
      ? product.optionGroups
      : DEFAULT_RESIDENTIAL_OPTION_GROUPS;
  });

  useEffect(() => {
    if (product) {
      setActiveOptionGroups(
        product.optionGroups && product.optionGroups.length > 0
          ? product.optionGroups
          : DEFAULT_RESIDENTIAL_OPTION_GROUPS
      );
    }
  }, [product]);

  // State for adding a new custom option group
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newOpt1Name, setNewOpt1Name] = useState('');
  const [newOpt1Price, setNewOpt1Price] = useState(0);

  const handleAddNewOptionGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupTitle.trim()) return;

    const newGrp: ProductOptionGroup = {
      id: `custom-grp-${Date.now()}`,
      title: newGroupTitle.trim(),
      required: false,
      options: [
        { id: `opt-none-${Date.now()}`, name: '선택 안함', price: 0 }
      ]
    };

    if (newOpt1Name.trim()) {
      newGrp.options.push({
        id: `opt-1-${Date.now()}`,
        name: `${newOpt1Name.trim()}${newOpt1Price > 0 ? ` (+${newOpt1Price.toLocaleString()}원)` : ''}`,
        price: Number(newOpt1Price)
      });
    }

    setActiveOptionGroups((prev) => [...prev, newGrp]);
    setIsAddingGroup(false);
    setNewGroupTitle('');
    setNewOpt1Name('');
    setNewOpt1Price(0);
  };

  const primaryOptionGroup = activeOptionGroups[0];
  const secondaryOptionGroups = activeOptionGroups.slice(1);

  // Default value fallbacks matching user screenshots
  const brandName = product.brand || '스필';
  const manufacturer = product.manufacturer || '스필일렉트릭';
  const origin = product.origin || '대한민국';
  const modelName = product.modelName || 'DO-EVC-SEC7-C/K';
  const certNumber = product.certNumber || 'XD070158-25001A';
  const deliveryInfo = product.deliveryInfo || '택배(주문 시 결제)\n무료배송';
  const componentsInfo = product.componentsInfo || '제조사 별도 발송 / 설치비 미포함 상품';
  const rewardPointsInfo = product.rewardPointsInfo || '구매 ₩0';
  const descriptionTag = product.description || '[국내최초 무상A/S 4년] 가정용충전기,공장용충전기,회사용충전기,창고용충전기';

  const basePrice = product.price || 598000;
  const originalPrice = product.originalPrice || (product.price ? Math.round(product.price * 1.1) : 660000);
  const discountRate = product.discountRate || (originalPrice > basePrice ? Math.round(((originalPrice - basePrice) / originalPrice) * 100) : 10);

  // Calculate sum of selected option prices
  const selectedOptionDetails = useMemo(() => {
    if (!activeOptionGroups) return [];
    const result: { groupTitle: string; optionName: string; optionPrice: number; groupId: string }[] = [];

    activeOptionGroups.forEach((grp) => {
      const selectedItemId = selectedOptionsMap[grp.id];
      if (selectedItemId) {
        const item = grp.options.find((o) => o.id === selectedItemId);
        if (item && item.name !== '선택 안함') {
          result.push({
            groupId: grp.id,
            groupTitle: grp.title,
            optionName: item.name,
            optionPrice: item.price
          });
        }
      }
    });

    return result;
  }, [activeOptionGroups, selectedOptionsMap]);

  const optionsTotalPrice = useMemo(() => {
    return selectedOptionDetails.reduce((sum, opt) => sum + opt.optionPrice, 0);
  }, [selectedOptionDetails]);

  const singleUnitPrice = basePrice + optionsTotalPrice;
  const totalPrice = singleUnitPrice * quantity;

  const handleOptionChange = (groupId: string, optionItemId: string) => {
    setSelectedOptionsMap((prev) => ({
      ...prev,
      [groupId]: optionItemId
    }));
  };

  const handleRemoveSelectedOption = (groupId: string) => {
    setSelectedOptionsMap((prev) => {
      const next = { ...prev };
      delete next[groupId];
      return next;
    });
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(
        product,
        selectedOptionDetails.map(o => ({ groupTitle: o.groupTitle, optionName: o.optionName, optionPrice: o.optionPrice })),
        totalPrice
      );
      setAddedSuccessMsg(true);
      setTimeout(() => setAddedSuccessMsg(false), 2500);
    }
  };

  const handleRequestQuote = () => {
    const purpose = product.type === '스마트홈' || product.type === '완속' ? 'Residential' : 'Commercial';
    let memo = `[상품] ${product.name}\n[수량] ${quantity}개\n[총금액] ${totalPrice.toLocaleString()}원`;
    if (selectedOptionDetails.length > 0) {
      memo += `\n[선택 옵션]:\n` + selectedOptionDetails.map(o => `- ${o.groupTitle}: ${o.optionName}`).join('\n');
    }
    if (onOpenQuoteWithPurpose) {
      onOpenQuoteWithPurpose(purpose, memo);
    }
    onClose();
  };

  const handleQuickNav = (catOrKw: string) => {
    onClose();
    if (onSelectCategoryQuick) {
      onSelectCategoryQuick(catOrKw);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors cursor-pointer"
          title="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-7 md:p-8 space-y-6 max-h-[88vh] overflow-y-auto">
          
          {/* Top Breadcrumb & Category Quick Bar (Screenshot 1 top right: 홈 / 가정용 홈 충전기) */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 pr-10">
            <button
              onClick={() => handleQuickNav('sol_residential')}
              className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>홈</span>
              <span className="text-slate-300">/</span>
              <span className="font-extrabold text-slate-800 underline underline-offset-2">가정용 홈 충전기</span>
            </button>

            {/* Quick Filter Buttons to switch back directly */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">빠른이동:</span>
              {[
                { id: '교체 시공', label: '🛠️ 교체시공' },
                { id: '11kW', label: '⚡ 11kW' },
                { id: '7kW', label: '⚡ 7kW' },
                { id: '5kW', label: '⚡ 5kW' },
                { id: '단말기 단품', label: '📦 단품' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => handleQuickNav(btn.id)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 rounded-lg text-[11px] font-black transition-all cursor-pointer whitespace-nowrap"
                  title={`${btn.label} (으)로 이동`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Top Title & Subtitle matching Screenshot 1 */}
          <div className="space-y-2 border-b border-slate-100 pb-4 pr-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h2>
            <div className="text-xs sm:text-sm text-slate-500 font-bold flex flex-wrap items-center justify-between gap-2">
              <span>{descriptionTag}</span>
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => alert('상품 링크가 복사되었습니다!')} 
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-xs"
                >
                  <Share2 className="w-4 h-4" />
                  <span>공유</span>
                </button>
                <button 
                  onClick={() => setIsLiked(!isLiked)} 
                  className={`flex items-center gap-1 transition-colors cursor-pointer text-xs font-bold ${isLiked ? 'text-rose-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                  <span>찜</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
            
            {/* Left: Product Image & Badges */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative aspect-square bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
                
                {product.plcSupported && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    PLC 화재예방 모뎀
                  </span>
                )}

                <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-emerald-400 font-black text-xs px-2.5 py-1 rounded-md">
                  {product.power}
                </span>
              </div>

              {/* Highlighting bullets */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                <div className="text-xs font-black text-slate-700">핵심 시공 특장점</div>
                <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-600 font-bold">
                  {product.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Pricing & Meta Detail Table (Screenshot 1 Layout) */}
            <div className="md:col-span-7 space-y-5">
              
              {/* Pricing Display */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-slate-400 line-through">
                    ₩{originalPrice.toLocaleString()}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                    ₩{basePrice.toLocaleString()}
                  </div>
                </div>

                {/* Circular Discount Rate Badge matching screenshot 1 */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-base sm:text-lg shadow-md border border-slate-800">
                  {discountRate}%
                </div>
              </div>

              {/* Metadata Details Table matching screenshot 1 */}
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-100">
                  <span className="col-span-3 text-slate-400 font-bold">적립혜택</span>
                  <span className="col-span-9 font-extrabold text-slate-800">{rewardPointsInfo}</span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-100 items-start">
                  <span className="col-span-3 text-slate-400 font-bold">배송</span>
                  <div className="col-span-9 space-y-0.5">
                    <div className="font-extrabold text-slate-800">{deliveryInfo}</div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-100">
                  <span className="col-span-3 text-slate-400 font-bold">상품정보</span>
                  <span className="col-span-9 text-slate-600 font-medium flex items-center gap-1 cursor-pointer hover:text-slate-900">
                    우측 '자세히' 참조 <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-100">
                  <span className="col-span-3 text-slate-400 font-bold">상품후기</span>
                  <span className="col-span-9 font-extrabold text-slate-800 flex items-center gap-1">
                    1명
                    <span className="flex text-amber-400">
                      {'★'.repeat(5)}
                    </span>
                    <span className="text-slate-500 font-bold text-xs">(5/5)</span>
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-100">
                  <span className="col-span-3 text-slate-400 font-bold">브랜드</span>
                  <span className="col-span-9 font-extrabold text-slate-800">{brandName}</span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-100">
                  <span className="col-span-3 text-slate-400 font-bold">구성품</span>
                  <span className="col-span-9 font-extrabold text-slate-800">{componentsInfo}</span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-100">
                  <span className="col-span-3 text-slate-400 font-bold">원산지</span>
                  <span className="col-span-9 font-extrabold text-slate-800">{origin}</span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-100">
                  <span className="col-span-3 text-slate-400 font-bold">제조사</span>
                  <span className="col-span-9 font-extrabold text-slate-800">{manufacturer}</span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-100">
                  <span className="col-span-3 text-slate-400 font-bold">모델명</span>
                  <span className="col-span-9 font-extrabold text-slate-800">{modelName}</span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1">
                  <span className="col-span-3 text-slate-400 font-bold">인증번호</span>
                  <span className="col-span-9 font-extrabold text-slate-800">{certNumber}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Options Selection Section matching Screenshot 2 */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            
            {/* 1. 상품옵션 (Primary Option) */}
            {primaryOptionGroup && (
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-900 tracking-wide">
                  상품옵션
                </label>
                <select
                  value={selectedOptionsMap[primaryOptionGroup.id] || ''}
                  onChange={(e) => handleOptionChange(primaryOptionGroup.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
                >
                  <option value="">- {primaryOptionGroup.title} -</option>
                  {primaryOptionGroup.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 2. 추가구성 (Secondary Option Groups) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-slate-900 tracking-wide">
                  추가구성 ({secondaryOptionGroups.length}개 항목)
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingGroup(!isAddingGroup)}
                  className="text-[11px] font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>옵션 추가하기</span>
                </button>
              </div>

              {/* Add New Option Group Inline Form */}
              {isAddingGroup && (
                <form onSubmit={handleAddNewOptionGroup} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2.5 animate-fadeIn">
                  <span className="text-xs font-black text-emerald-950 block">➕ 새 추가구성 옵션 그룹 만들기</span>
                  <div>
                    <input
                      type="text"
                      placeholder="예: 보조케이블 5M / 스탠드높이 연장 / 접지봉"
                      value={newGroupTitle}
                      onChange={(e) => setNewGroupTitle(e.target.value)}
                      required
                      className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="옵션명 (예: 연장케이블 포함)"
                      value={newOpt1Name}
                      onChange={(e) => setNewOpt1Name(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold"
                    />
                    <input
                      type="number"
                      placeholder="추가금액 (원)"
                      value={newOpt1Price || ''}
                      onChange={(e) => setNewOpt1Price(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingGroup(false)}
                      className="px-2.5 py-1 text-xs font-bold bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-black bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white cursor-pointer shadow-xs"
                    >
                      옵션 저장하기
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2.5">
                {secondaryOptionGroups.map((grp) => (
                  <div key={grp.id}>
                    <select
                      value={selectedOptionsMap[grp.id] || ''}
                      onChange={(e) => handleOptionChange(grp.id, e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
                    >
                      <option value="">- {grp.title} -</option>
                      {grp.options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Options Summary List */}
            {selectedOptionDetails.length > 0 && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-black text-slate-700">선택된 옵션 목록:</div>
                <div className="space-y-1.5">
                  {selectedOptionDetails.map((opt) => (
                    <div key={opt.groupId} className="flex items-center justify-between text-xs font-bold text-slate-800 bg-white p-2 rounded-lg border border-slate-200/80">
                      <span>{opt.groupTitle}: <strong className="text-emerald-700">{opt.optionName}</strong></span>
                      <button
                        onClick={() => handleRemoveSelectedOption(opt.groupId)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="옵션 취소"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector matching Screenshot 1 */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs sm:text-sm font-black text-slate-900">수량</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-base transition-colors cursor-pointer select-none"
                  >
                    -
                  </button>
                  <span className="px-5 py-1.5 font-black text-slate-950 text-sm sm:text-base min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-base transition-colors cursor-pointer select-none"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  (최소주문수량 1개 이상)
                </span>
              </div>
            </div>

            {/* Total Price Section matching Screenshot 2 bottom right */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3">
              <div className="text-xs font-bold text-slate-500">
                개당 {singleUnitPrice.toLocaleString()}원 × {quantity}개
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-sm font-black text-slate-900">총 상품금액</span>
                <span className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  ₩{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Feedback notification when added to cart */}
            {addedSuccessMsg && (
              <div className="p-3 bg-emerald-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl text-center shadow-md animate-bounce">
                ✅ 장바구니에 상품과 옵션이 성공적으로 담겼습니다!
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-98"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>장바구니 담기</span>
              </button>

              <button
                onClick={handleRequestQuote}
                className="py-3.5 px-5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-slate-900/20 active:scale-98"
              >
                <span>무료 설치 / 구매 견적 문의</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
