/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PRODUCTS } from '../data';
import { Product } from '../types';
import { Check, ShieldCheck, Cpu, Activity, FileDown } from 'lucide-react';

interface ProductsSectionProps {
  onOpenQuoteWithPurpose: (purpose: 'Commercial' | 'Residential' | 'ParkingLot') => void;
}

export default function ProductsSection({ onOpenQuoteWithPurpose }: ProductsSectionProps) {
  const [filter, setFilter] = useState<'전체' | '완속' | '급속' | '스마트홈'>('전체');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);

  const filteredProducts = PRODUCTS.filter((p) => {
    if (filter === '전체') return true;
    if (filter === '완속') return p.type === '완속';
    if (filter === '스마트홈') return p.type === '스마트홈';
    if (filter === '급속') return p.type === '급속' || p.type === '초급속';
    return true;
  });

  const getPurposeByProductType = (type: string) => {
    if (type === '스마트홈') return 'Residential';
    if (type === '완속') return 'Residential';
    if (type === '급속') return 'ParkingLot';
    return 'Commercial';
  };

  return (
    <div className="space-y-12 py-12">
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
      <div className="flex justify-center border-b border-slate-200">
        {(['전체', '완속', '급속', '스마트홈'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            id={`btn-product-filter-${tab}`}
            className={`px-5 py-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all -mb-[1px] cursor-pointer ${
              (filter === tab)
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab === '급속' ? '급속 / 초급속' : tab}
          </button>
        ))}
      </div>

      {/* Grid of Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedProduct(p)}
            id={`card-product-${p.id}`}
            className={`group rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              selectedProduct.id === p.id
                ? 'border-blue-600 ring-2 ring-blue-600/10 shadow-lg'
                : 'border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div>
              {/* Product Image Box */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md">
                  {p.power} 출력
                </span>

                {p.plcSupported && (
                  <span className="absolute top-3 right-3 bg-blue-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3 h-3" />
                    화재감지 PLC
                  </span>
                )}
              </div>

              {/* Product Body */}
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase border border-slate-200 px-1.5 py-0.5 rounded">
                    {p.type}
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-950 group-hover:text-blue-600 transition-colors">
                  {p.name}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {p.description}
                </p>

                {/* Features short-bullets */}
                <div className="pt-3 space-y-1">
                  {p.features.slice(0, 3).map((f) => (
                    <div key={f} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-5 pt-0 mt-2 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenQuoteWithPurpose(getPurposeByProductType(p.type));
                }}
                id={`btn-product-quote-${p.id}`}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
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
            <h3 className="text-xl font-black text-slate-950 mt-1">상세 제원 기술 규격 ({selectedProduct.name})</h3>
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
              {Object.entries(selectedProduct.specs).map(([key, val], idx) => (
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
