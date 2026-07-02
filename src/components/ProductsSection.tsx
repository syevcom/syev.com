/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { Check, ShieldCheck, Cpu, Activity, FileDown } from 'lucide-react';

interface ProductsSectionProps {
  onOpenQuoteWithPurpose: (purpose: 'Commercial' | 'Residential' | 'ParkingLot') => void;
  products: Product[];
  isEditMode?: boolean;
  onOpenCms?: (tab: 'hero' | 'about' | 'products' | 'solutions' | 'review' | 'support') => void;
}

export default function ProductsSection({ 
  onOpenQuoteWithPurpose,
  products,
  isEditMode = false,
  onOpenCms
}: ProductsSectionProps) {
  const [filter, setFilter] = useState<'전체' | '비공용완속' | '비공용중속' | '공용완속' | '급속' | '스탠드'>('전체');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const currentSelected = products.find(p => p.id === selectedProductId) || products[0];

  const filteredProducts = products.filter((p) => {
    if (filter === '전체') return true;
    return p.detailCategory === filter;
  });

  const getPurposeByProductType = (type: string) => {
    if (type === '스마트홈') return 'Residential';
    if (type === '완속') return 'Residential';
    if (type === '급속' || type === '초급속') return 'ParkingLot';
    return 'Commercial';
  };

  const formatPrice = (price?: number) => {
    return price ? `${price.toLocaleString()}원` : '별도 견적 문의';
  };

  // Helper to choose color of the round power badge based on capacity
  const getPowerBadgeColor = (power: string) => {
    if (power.includes('7kW')) return 'bg-indigo-600';
    if (power.includes('11kW')) return 'bg-cyan-600';
    if (power.includes('50kW')) return 'bg-teal-600';
    if (power.includes('200kW')) return 'bg-pink-600';
    return 'bg-slate-700';
  };

  return (
    <div className="space-y-12 py-12 relative group/products">
      {isEditMode && onOpenCms && (
        <button
          onClick={() => onOpenCms('products')}
          className="absolute top-2 right-2 z-30 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg transition-transform hover:scale-105 cursor-pointer"
        >
          ✏️ 신제품 라인업 실시간 편집
        </button>
      )}

      {/* Promo banner highlighting high-tech features */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
        <div className="space-y-3.5">
          <span className="text-blue-400 font-bold text-xs tracking-wider uppercase bg-blue-400/10 px-2.5 py-1 rounded-md border border-blue-400/20">
            SY.com EXCLUSIVE SAFETY TECH
          </span>
          <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
            화재 감지 알람 및 차세대 PLC 모뎀 기본 탑재! <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">속도가 빠르고 안전한 완속/급속 충전 라인업</span>
          </h3>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl font-medium">
            전기자동차 충전 중 발생하는 과열 및 과충전 트러블을 실시간 감시하는 PLC(Power Line Communication) 모뎀을 장착하여, 화재 우려 없는 100% 안심 환경을 제공합니다.
          </p>
        </div>

        <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0 text-center">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex-1 md:flex-initial text-center min-w-[130px]">
            <Cpu className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 block font-semibold">화재예방 인증</span>
            <span className="text-xs font-bold text-white block mt-0.5">PLC 모뎀 탑재</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex-1 md:flex-initial text-center min-w-[130px]">
            <Activity className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 block font-semibold">스마트 부하제어</span>
            <span className="text-xs font-bold text-white block mt-0.5">전력 자동 조절</span>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 justify-center border-b border-slate-200 pb-2 md:pb-0">
        {[
          { key: '전체', label: '전체상품' },
          { key: '비공용완속', label: '비공용완속충전기' },
          { key: '비공용중속', label: '비공용중속충전기' },
          { key: '공용완속', label: '공용완속충전기' },
          { key: '급속', label: '급속충전기' },
          { key: '스탠드', label: '스탠드(캐노피)' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            id={`btn-product-filter-${tab.key}`}
            className={`px-4 py-2.5 text-xs sm:text-sm font-extrabold border-b-2 transition-all -mb-[1px] cursor-pointer ${
              filter === tab.key
                ? 'border-blue-600 text-blue-600 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedProductId(p.id)}
            id={`card-product-${p.id}`}
            className={`group rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between cursor-pointer bg-white ${
              currentSelected.id === p.id
                ? 'border-blue-600 ring-4 ring-blue-500/10 shadow-lg shadow-blue-500/5'
                : 'border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div>
              {/* Product Image Box */}
              <div className="relative h-56 bg-slate-50 overflow-hidden flex items-center justify-center p-3">
                <img
                  src={p.image}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Brand Logo - Top Right overlay */}
                <span className="absolute top-3 right-3 bg-[#e8f321] text-slate-950 font-black text-[9px] px-2 py-0.5 rounded shadow-sm border border-yellow-300 flex items-center gap-0.5 tracking-tighter">
                  ⚡ EVMoA
                </span>

                {/* Circular Power Badge - Overlaps Bottom Left corner */}
                <div className={`absolute bottom-3 left-3 w-12 h-12 flex flex-col items-center justify-center text-[10px] text-white font-black rounded-full shadow-md backdrop-blur-xs ${getPowerBadgeColor(p.power)}`}>
                  <span className="leading-none text-[11px]">{p.power}</span>
                </div>

                {p.plcSupported && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white font-bold text-[8px] px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    PLC 화재예방
                  </span>
                )}
              </div>

              {/* Product Body */}
              <div className="p-4 space-y-2">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {p.name}
                </h4>
                
                {/* Price Label matching Korean EVMoA styling */}
                <div className="pt-1 pb-1">
                  <div className="text-xs text-slate-400 font-bold">판매 단가</div>
                  <div className="text-sm sm:text-base font-black text-rose-600 flex items-baseline gap-1">
                    <span>{formatPrice(p.price)}</span>
                    {p.price && <span className="text-[10px] text-slate-400 font-normal">(설치 포함)</span>}
                  </div>
                  <div className="w-8 h-0.5 bg-blue-500 mt-1 rounded-full"></div>
                </div>

                <p className="text-[11px] text-slate-500 leading-normal line-clamp-2 font-medium">
                  {p.description}
                </p>

                {/* Features short-bullets */}
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  {p.features.slice(0, 3).map((f) => (
                    <div key={f} className="flex items-center gap-1 text-[10px] text-slate-600 font-bold">
                      <Check className="w-3 h-3 text-blue-600 shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 pt-0 mt-1 flex gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenQuoteWithPurpose(getPurposeByProductType(p.type));
                }}
                id={`btn-product-quote-${p.id}`}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold transition-all cursor-pointer"
              >
                무료 설치 견적 요청
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Technical Specification Detail Drawer/Table */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block">Spec Comparison</span>
            <h3 className="text-xl font-black text-slate-950 mt-1">상세 제원 기술 규격 ({currentSelected.name})</h3>
          </div>
          <button
            type="button"
            className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-1.5 transition-all self-start md:self-center cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-slate-400" />
            조달청 납품 규격서 다운로드
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-extrabold text-slate-700 w-1/3">구분 항목</th>
                <th className="p-4 font-extrabold text-slate-800">상세 규격 및 표준</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(currentSelected.specs).map(([key, val], idx) => (
                <tr key={key} className={idx % 2 === 0 ? 'bg-white border-b border-slate-100' : 'bg-slate-50/50 border-b border-slate-100'}>
                  <td className="p-4 font-bold text-slate-600">{key}</td>
                  <td className="p-4 text-slate-800 font-medium">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
