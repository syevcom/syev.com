import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Award, FileText, CheckCircle2 } from 'lucide-react';
import { SPEEL_11KW_REPRESENTATIVE_IMAGE } from '../data';

export interface HomePopupConfig {
  enabled: boolean;
  title: string;
  badgeText: string;
  mainText: string;
  subText: string;
  buttonText: string;
  naverFormUrl: string;
  imageUrl: string;
  tab1Label: string;
  tab1Url: string;
  tab2Label: string;
  tab2Url: string;
  tab3Label: string;
  tab3Url: string;
  noticeText: string;
}

export const DEFAULT_HOME_POPUP_CONFIG: HomePopupConfig = {
  enabled: true,
  title: '품질보증서',
  badgeText: '★ 4년 보증 ★ SE Charger',
  mainText: '스필일렉트릭 구매 및 설치후 꼭 정품보증서를 발급받으세요',
  subText: '무상4년 A/S를 위해 꼭 받아두세요',
  buttonText: '보증서 발급받기',
  naverFormUrl: 'https://form.naver.com/', // 네이버폼 연결 URL (관리자페이지에서 변경 가능)
  imageUrl: SPEEL_11KW_REPRESENTATIVE_IMAGE,
  tab1Label: '포토리뷰이벤트',
  tab1Url: '',
  tab2Label: '정품등록',
  tab2Url: '',
  tab3Label: '상담시간연장',
  tab3Url: '',
  noticeText: '1. 본 제품의 보증 기간은 구입일로부터 4년입니다.\n2. 보증 기간 내에 부품이나 제조상의 결함이 있을 경우에는 무상으로 수리 또는 교체하여 드립니다.\n3. 이 보증서는 국내(대한민국)에서만 유효합니다.\n4. 무상 보증기간 이내라 하더라도 사용자 과실 시 유상 처리됩니다.\n[AS 접수문의: 031-898-1111]'
};

interface HomePopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: HomePopupConfig;
  onOpenQuoteModal?: () => void;
}

export const HomePopupModal: React.FC<HomePopupModalProps> = ({
  isOpen,
  onClose,
  config = DEFAULT_HOME_POPUP_CONFIG,
  onOpenQuoteModal
}) => {
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2' | 'tab3'>('tab2');

  if (!isOpen) return null;

  const handleDontShowToday = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    try {
      localStorage.setItem('sy_popup_hide_date', todayStr);
    } catch (e) {
      console.error(e);
    }
    onClose();
  };

  const handleCtaClick = () => {
    if (config.naverFormUrl && config.naverFormUrl.trim()) {
      window.open(config.naverFormUrl.trim(), '_blank', 'noopener,noreferrer');
    } else {
      alert('연결된 네이버폼 URL이 없습니다. 관리자 설정에서 URL을 입력해 주세요.');
    }
  };

  const handleTabClick = (tabKey: 'tab1' | 'tab2' | 'tab3', url?: string) => {
    setActiveTab(tabKey);
    if (url && url.trim()) {
      window.open(url.trim(), '_blank', 'noopener,noreferrer');
    } else if (tabKey === 'tab1' && onOpenQuoteModal) {
      onOpenQuoteModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-purple-200 flex flex-col max-h-[92vh] font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button (X) */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 z-20 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors shadow-md"
          title="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main Banner Body */}
        <div className="relative overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-purple-950 via-purple-900 to-indigo-950 text-white p-5 text-center">
          
          {/* Top Gold Seal / Badge */}
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 text-amber-950 font-black text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-lg border border-amber-100 mb-3 tracking-tight">
            <Award className="w-4 h-4 mr-1 text-amber-900 fill-amber-300" />
            {config.badgeText || '★ 4년 보증 ★ SE Charger'}
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 drop-shadow-sm">
            {config.title || '품질보증서'}
          </h2>

          {/* Product Graphic + Card Wrapper */}
          <div className="relative my-3 bg-white/95 rounded-2xl p-4 sm:p-5 text-slate-900 shadow-xl border border-white/50 backdrop-blur-md">
            
            {/* Background Charger Image / Graphic */}
            <div className="flex justify-center mb-3">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center">
                <img
                  src={config.imageUrl || SPEEL_11KW_REPRESENTATIVE_IMAGE}
                  alt="품질보증서 대상 충전기"
                  className="w-full h-full object-contain p-1"
                />
                <div className="absolute top-1 right-1 bg-purple-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  4년 무상 A/S
                </div>
              </div>
            </div>

            {/* Headline Banner Text */}
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug break-keep mb-1.5">
              {config.mainText || '스필일렉트릭 구매 및 설치후 꼭 정품보증서를 발급받으세요'}
            </h3>
            
            <p className="text-xs sm:text-sm font-bold text-purple-700 mb-4">
              {config.subText || '무상4년 A/S를 위해 꼭 받아두세요'}
            </p>

            {/* Prominent CTA Button to Naver Form */}
            <button
              onClick={handleCtaClick}
              className="w-full py-3.5 px-4 bg-purple-900 hover:bg-purple-950 text-white font-black text-sm sm:text-base rounded-full shadow-lg hover:shadow-purple-900/40 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 border border-purple-500/30 cursor-pointer"
            >
              <span>{config.buttonText || '보증서 발급받기'}</span>
              <ExternalLink className="w-4 h-4 text-purple-200" />
            </button>
          </div>

          {/* Notice / Terms */}
          <div className="mt-3 text-left bg-black/20 rounded-lg p-3 text-[10px] sm:text-[11px] text-purple-200/90 leading-relaxed border border-purple-800/40 whitespace-pre-line">
            <div className="font-bold text-amber-300 mb-1 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              보증 서비스 안내
            </div>
            {config.noticeText}
          </div>

          <div className="mt-2 text-right text-[10px] text-purple-300 font-medium">
            AS 접수 : 031-898-1111
          </div>
        </div>

        {/* Bottom Tabs */}
        <div className="grid grid-cols-3 bg-slate-100 border-t border-slate-200">
          <button
            onClick={() => handleTabClick('tab1', config.tab1Url)}
            className={`py-2.5 px-2 text-xs font-bold transition-colors border-r border-slate-200 ${
              activeTab === 'tab1' 
                ? 'bg-slate-700 text-white font-extrabold' 
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {config.tab1Label || '포토리뷰이벤트'}
          </button>

          <button
            onClick={() => handleTabClick('tab2', config.tab2Url)}
            className={`py-2.5 px-2 text-xs font-bold transition-colors border-r border-slate-200 ${
              activeTab === 'tab2' 
                ? 'bg-slate-700 text-white font-extrabold' 
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {config.tab2Label || '정품등록'}
          </button>

          <button
            onClick={() => handleTabClick('tab3', config.tab3Url)}
            className={`py-2.5 px-2 text-xs font-bold transition-colors ${
              activeTab === 'tab3' 
                ? 'bg-slate-700 text-white font-extrabold' 
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {config.tab3Label || '상담시간연장'}
          </button>
        </div>

        {/* Bottom Bar (Dont show today / Close) */}
        <div className="flex items-center justify-between bg-slate-800 text-slate-300 text-xs px-4 py-2.5 font-bold">
          <button
            onClick={handleDontShowToday}
            className="hover:text-white transition-colors cursor-pointer flex items-center py-0.5"
          >
            <span>오늘 하루 이 창을 열지 않음</span>
          </button>
          <button
            onClick={onClose}
            className="hover:text-white transition-colors cursor-pointer px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-200"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePopupModal;
