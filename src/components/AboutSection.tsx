/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, ShieldCheck, Network, FileText, CheckCircle } from 'lucide-react';

interface AboutSectionProps {
  aboutConfig: {
    ceoName: string;
    ceoRole: string;
    ceoGreeting: string;
    ceoMessage1: string;
    ceoMessage2: string;
    ceoMessage3: string;
    ceoImage: string;
  };
  isEditMode?: boolean;
  onOpenCms?: (tab: 'hero' | 'about' | 'products' | 'solutions' | 'review' | 'support') => void;
}

export default function AboutSection({
  aboutConfig,
  isEditMode = false,
  onOpenCms
}: AboutSectionProps) {
  const regions = [
    { name: '서울/수도권 본부', locations: '강남, 영등포, 일산, 판교, 인천', tel: '1588-SY01' },
    { name: '강원 지사', locations: '춘천, 원주, 강릉', tel: '1588-SY02' },
    { name: '충청/대전 본부', locations: '대전, 청주, 천안', tel: '1588-SY03' },
    { name: '호남/광주 본부', locations: '광주, 전주, 목포', tel: '1588-SY04' },
    { name: '대구/경북 지사', locations: '대구, 구미, 포항', tel: '1588-SY05' },
    { name: '부산/경남 본부', locations: '부산, 울산, 창원', tel: '1588-SY06' },
    { name: '제주 특별 지사', locations: '제주, 서귀포', tel: '1588-SY07' }
  ];

  const patents = [
    { title: 'PLC 탑재 전기차 과열 차단 회로 설계 특허', agency: '특허청' },
    { title: '스마트 부하 매칭형 분배 장치 및 제어 알고리즘', agency: '특허청' },
    { title: '친환경 외함 보호형 전기차 충전 월박스 의장 등록', agency: '특허청' },
    { title: '환경부 정식 무상 보조금 대행 인가 및 적합성 통과', agency: '환경부' },
    { title: '기기 시설 안전 배상 책임 보험 10억원 가입', agency: '삼성화재' }
  ];

  return (
    <div className="space-y-16 py-12">
      {/* Intro Hero banner */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-12 border border-slate-800 shadow-xl">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-indigo-900 to-slate-950" />
        <div className="relative max-w-3xl space-y-4">
          <span className="text-blue-400 font-bold text-xs uppercase tracking-wider">Corporate Profile</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            대한민국 전기차 충전 인프라의 기준, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">SY.com이 만들어 가고 있습니다.</span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed font-medium">
            SY.com은 충전기 하드웨어 설계부터 정부 무상 보조금 지원 컨설팅, 한전 배선 허가, 정밀 시공 및 전국 실시간 AS망 구축까지 모든 단계를 원스톱으로 제공하는 친환경 모빌리티 솔루션 전문 기업입니다.
          </p>
        </div>
      </section>

      {/* CEO Message */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative group/about">
        {isEditMode && onOpenCms && (
          <button
            onClick={() => onOpenCms('about')}
            className="absolute top-2 right-2 z-30 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            ✏️ 대표자 및 회사 소개 실시간 편집
          </button>
        )}

        <div className="md:col-span-5 relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 h-80 md:h-[400px]">
          <img 
            src={aboutConfig.ceoImage} 
            alt="SY.com CEO" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 to-transparent p-6 text-white">
            <p className="font-extrabold text-lg">{aboutConfig.ceoName}</p>
            <p className="text-xs text-blue-400 font-bold">{aboutConfig.ceoRole}</p>
          </div>
        </div>
        <div className="md:col-span-7 space-y-5">
          <span className="text-blue-600 font-bold text-xs tracking-wider uppercase block">CEO Greeting</span>
          <h3 className="text-2xl font-black text-slate-950 tracking-tight leading-snug">
            {aboutConfig.ceoGreeting}
          </h3>
          <div className="text-slate-600 text-sm leading-relaxed space-y-4 font-medium">
            <p>{aboutConfig.ceoMessage1}</p>
            <p>{aboutConfig.ceoMessage2}</p>
            <p>{aboutConfig.ceoMessage3}</p>
          </div>
        </div>
      </section>

      {/* Corporate Vision & Values */}
      <section className="space-y-6">
        <div className="text-center">
          <span className="text-blue-600 font-bold text-xs tracking-wider uppercase">Our Core Value</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">SY.com이 지켜가는 3대 약속</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">1. 타협 없는 화재안전 예방</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              화재감지 알람 및 PLC 탑재 충전기로 안심 충전 환경을 실현합니다. 다중 온도 센서와 배상 책임 10억원 보험으로 안심을 보장합니다.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-5.5 h-5.5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">2. 원스톱 고객 행정 면제</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              한전 불입금 조회, 설치 동의서 패키지, 지자체 무상 국고 보조금 신청 대행까지 복잡한 서류 절차는 SY.com 전문가가 전부 대행합니다.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Network className="w-5.5 h-5.5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">3. 전국 무정지 인프라 약속</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              전국 24개 네트워크와 24시간 자가 진단 리셋 서비스. 기기 작동 장애 감지 시 24시간 이내 현장 정비 기사 매칭 약속을 보장합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Nationwide Network */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="lg:col-span-5 space-y-4">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block">Nationwide Infrastructure</span>
          <h3 className="text-2xl font-black text-slate-950 tracking-tight leading-tight">전국 24시간 실시간 유지 보수 원스톱 네트워크</h3>
          <p className="text-slate-600 text-xs leading-relaxed font-medium">
            SY.com은 대한민국 어느 지역이든 정비 출동이 가능하도록 전국 단위 전담 직영 서비스 망을 운영하고 있습니다. 소프트웨어 원격 제어로 1차 자동 복구 처리를 진행하며, 필요시 정비 차량이 바로 긴급 정비를 출동합니다.
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-1 font-semibold">
            <p>• <strong className="text-slate-700">전국 통합 기술 정비 콜센터:</strong> 1588-SY01</p>
            <p>• <strong className="text-slate-700">고객 케어 대응율:</strong> 99.8% 달성 완료</p>
            <p>• <strong className="text-slate-700">A/S 접수 보장:</strong> 당일 접수 시 익일 오전 내 출동 처리 완료</p>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {regions.map((reg) => (
            <div key={reg.name} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between hover:bg-slate-100/50 transition-colors">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block mb-1">{reg.name}</span>
                <span className="text-[10px] text-slate-400 font-bold block">{reg.locations}</span>
              </div>
              <span className="text-xs font-black text-blue-600 mt-2 block">{reg.tel}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications and Patents */}
      <section className="space-y-6">
        <div className="text-center">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">Credentials</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">인증 및 기술 특허 특전</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {patents.map((pat) => (
            <div key={pat.title} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-800 block truncate">{pat.title}</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{pat.agency} 정식 승인 및 검증 완료</span>
              </div>
              <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
