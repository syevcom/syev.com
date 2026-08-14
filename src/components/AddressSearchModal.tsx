import React, { useEffect, useRef } from 'react';
import { X, MapPin, Search } from 'lucide-react';

interface AddressSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (data: {
    zonecode: string;
    address: string;
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
    fullAddress: string;
  }) => void;
  title?: string;
}

export default function AddressSearchModal({
  isOpen,
  onClose,
  onSelectAddress,
  title = '설치 / 배송지 주소 검색'
}: AddressSearchModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const runPostcode = () => {
      if (containerRef.current && (window as any).daum && (window as any).daum.Postcode) {
        // Clear previous content
        containerRef.current.innerHTML = '';
        
        new (window as any).daum.Postcode({
          oncomplete: function (data: any) {
            const roadAddr = data.roadAddress || '';
            const jibunAddr = data.jibunAddress || '';
            const selectedAddr = roadAddr || jibunAddr || data.address || '';
            const building = data.buildingName ? ` (${data.buildingName})` : '';
            const full = `${selectedAddr}${building}`;

            onSelectAddress({
              zonecode: data.zonecode || '',
              address: data.address || selectedAddr,
              roadAddress: roadAddr,
              jibunAddress: jibunAddr,
              buildingName: data.buildingName || '',
              fullAddress: full,
            });
            onClose();
          },
          width: '100%',
          height: '100%',
        }).embed(containerRef.current);
      }
    };

    if ((window as any).daum && (window as any).daum.Postcode) {
      setTimeout(runPostcode, 100);
    } else {
      const scriptId = 'daum-postcode-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.body.appendChild(script);
      }
      script.onload = () => {
        setTimeout(runPostcode, 100);
      };
    }
  }, [isOpen, onClose, onSelectAddress]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">{title}</h3>
              <p className="text-[10px] text-slate-500 font-medium">도로명, 건물명, 지번을 검색하세요</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
            title="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Helper Banner */}
        <div className="p-2.5 bg-blue-50/80 border-b border-blue-100/80 text-[11px] text-blue-900 font-bold flex items-center justify-center gap-1.5 text-center">
          <Search className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>원하시는 도로명 주소 또는 동(읍/면) + 건물명을 입력해 주세요</span>
        </div>

        {/* Daum Postcode Embed Container */}
        <div className="p-2 bg-white min-h-[440px] max-h-[500px] relative overflow-hidden flex-1">
          <div ref={containerRef} className="w-full h-full min-h-[420px]" />
        </div>
      </div>
    </div>
  );
}
