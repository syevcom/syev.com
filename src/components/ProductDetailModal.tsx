/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { X, Share2, Heart, Star, Check, ShoppingBag, ShieldCheck, ChevronRight } from 'lucide-react';
import { Product, CartItem } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, selectedOptions?: { groupTitle: string; optionName: string; optionPrice: number }[], totalPrice?: number) => void;
  onOpenQuoteWithPurpose?: (purpose: 'Commercial' | 'Residential' | 'ParkingLot', memoText?: string) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onOpenQuoteWithPurpose
}: ProductDetailModalProps) {
  if (!isOpen || !product) return null;

  // Selected option state: map of optionGroupId -> optionItemId
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<Record<string, string>>({});
  const [isLiked, setIsLiked] = useState(false);
  const [addedSuccessMsg, setAddedSuccessMsg] = useState(false);

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
    if (!product.optionGroups) return [];
    const result: { groupTitle: string; optionName: string; optionPrice: number; groupId: string }[] = [];

    product.optionGroups.forEach((grp) => {
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
  }, [product.optionGroups, selectedOptionsMap]);

  const optionsTotalPrice = useMemo(() => {
    return selectedOptionDetails.reduce((sum, opt) => sum + opt.optionPrice, 0);
  }, [selectedOptionDetails]);

  const totalPrice = basePrice + optionsTotalPrice;

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
    let memo = `[상품] ${product.name}\n[기본금액] ${totalPrice.toLocaleString()}원`;
    if (selectedOptionDetails.length > 0) {
      memo += `\n[선택 옵션]:\n` + selectedOptionDetails.map(o => `- ${o.groupTitle}: ${o.optionName}`).join('\n');
    }
    if (onOpenQuoteWithPurpose) {
      onOpenQuoteWithPurpose(purpose, memo);
    }
    onClose();
  };

  // Divide option groups into "상품옵션" (first option group if present) and "추가구성" (remaining option groups)
  const optionGroups = product.optionGroups || [];
  const primaryOptionGroup = optionGroups.length > 0 ? optionGroups[0] : null;
  const secondaryOptionGroups = optionGroups.length > 1 ? optionGroups.slice(1) : [];

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
            {secondaryOptionGroups.length > 0 && (
              <div className="space-y-3 pt-1">
                <label className="block text-xs font-black text-slate-900 tracking-wide">
                  추가구성
                </label>
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
            )}

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

            {/* Total Price Section matching Screenshot 2 bottom right */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3">
              <div className="text-xs font-bold text-slate-500">
                기본 상품가: {basePrice.toLocaleString()}원 {optionsTotalPrice > 0 && `+ 옵션 ${optionsTotalPrice.toLocaleString()}원`}
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
