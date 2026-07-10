import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, FileText, LayoutGrid, List, Sparkles, RefreshCw } from 'lucide-react';

interface PdfImageRendererProps {
  fileUrl: string;
  fileName?: string;
  brandName?: string;
  isAdmin?: boolean;
}

export default function PdfImageRenderer({ fileUrl, fileName = 'document.pdf', brandName = '브랜드', isAdmin = false }: PdfImageRendererProps) {
  const isPdf = fileUrl.startsWith('data:application/pdf') || fileName.toLowerCase().endsWith('.pdf');
  
  if (!isPdf) {
    // If it's a standard image file, render it natively with premium frame and zoom
    return <ImageCatalogViewer imageUrl={fileUrl} fileName={fileName} brandName={brandName} isAdmin={isAdmin} />;
  }

  return <PdfCatalogViewer pdfUrl={fileUrl} fileName={fileName} brandName={brandName} isAdmin={isAdmin} />;
}

// 1. Native Image Viewer (for JPG, PNG uploads)
function ImageCatalogViewer({ imageUrl, fileName, brandName, isAdmin }: { imageUrl: string; fileName: string; brandName: string; isAdmin: boolean }) {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoom(100);

  const displayName = isAdmin ? fileName : '공식 사양서 및 카탈로그';

  return (
    <div className="relative border border-slate-800 bg-slate-950/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header Controls */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[9px] font-black uppercase">
            IMAGE
          </span>
          <span className="text-xs font-bold text-slate-200 truncate max-w-[200px]" title={displayName}>
            {displayName}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-xl">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="축소"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span 
            onClick={handleResetZoom}
            className="text-[10px] font-mono text-slate-300 font-bold min-w-[36px] text-center cursor-pointer hover:text-emerald-400 select-none"
            title="줌 초기화"
          >
            {zoom}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="확대"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>전체화면</span>
        </button>
      </div>

      {/* Main Image Stage - Unlimited height for natural vertical scrolling */}
      <div className="bg-slate-900/40 p-4 overflow-visible flex items-center justify-center min-h-[400px] h-auto relative">
        <div 
          className="transition-all duration-200 ease-out shadow-2xl rounded-lg bg-white overflow-hidden"
          style={{ width: `${zoom}%`, maxWidth: '100%', minWidth: '30%' }}
        >
          <img
            src={imageUrl}
            alt={`${brandName} 카탈로그 이미지`}
            className="w-full h-auto object-contain block pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex justify-between items-center text-[10px] font-bold text-slate-500">
        <span>이미지 카탈로그 뷰어</span>
        <span className="text-emerald-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 animate-pulse" />
          100% 모바일/웹 최적화 렌더링 완료
        </span>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col">
          <div className="p-4 bg-slate-950/90 border-b border-slate-800/60 flex justify-between items-center px-6">
            <span className="text-xs font-black text-white">{brandName} 카탈로그 전체화면</span>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black cursor-pointer"
            >
              닫기 (ESC)
            </button>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center p-6">
            <img
              src={imageUrl}
              alt="Full Catalog"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// 2. High-Tech PDF Canvas Renderer using Mozilla PDF.js (CDN-loaded) - Continuous Scroll Only
function PdfCatalogViewer({ pdfUrl, fileName, brandName, isAdmin }: { pdfUrl: string; fileName: string; brandName: string; isAdmin: boolean }) {
  const [pdfLibLoaded, setPdfLibLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(120); // crisp high-quality standard zoom
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Script Loader for PDF.js
  useEffect(() => {
    if ((window as any).pdfjsLib) {
      setPdfLibLoaded(true);
      return;
    }

    const scriptId = 'pdfjs-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
      script.async = true;
      document.head.appendChild(script);
    }

    const handleScriptLoad = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        setPdfLibLoaded(true);
      }
    };

    script.addEventListener('load', handleScriptLoad);
    return () => {
      script.removeEventListener('load', handleScriptLoad);
    };
  }, []);

  // Load PDF Document
  useEffect(() => {
    if (!pdfLibLoaded || !pdfUrl) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadDocument = async () => {
      try {
        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) throw new Error('PDF.js 라이브러리 로드 실패');

        let dataInput: any = pdfUrl;
        if (pdfUrl.startsWith('data:')) {
          const base64Parts = pdfUrl.split(',');
          const base64Data = base64Parts[1] || base64Parts[0];
          const binaryString = window.atob(base64Data);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          dataInput = { data: bytes };
        }

        const loadingTask = pdfjsLib.getDocument(dataInput);
        const doc = await loadingTask.promise;

        if (isMounted) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('PDF.js load error:', err);
        if (isMounted) {
          setError('PDF 파일을 해독하는 데 실패했습니다. 파일이 손상되었거나 브라우저 보안 제약이 있을 수 있습니다.');
          setLoading(false);
        }
      }
    };

    loadDocument();

    return () => {
      isMounted = false;
    };
  }, [pdfLibLoaded, pdfUrl]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 20, 240));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 20, 60));
  const handleResetZoom = () => setZoom(120);

  const displayName = isAdmin ? fileName : '공식 사양서 및 카탈로그';

  return (
    <div className="relative border border-slate-800 bg-slate-950/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Controller Bar */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-[9px] font-black uppercase">
            PDF
          </span>
          <span className="text-xs font-bold text-slate-200 truncate max-w-[150px] sm:max-w-[200px]" title={displayName}>
            {displayName}
          </span>
        </div>

        {/* Info Label instead of Toggles */}
        <div className="text-[10px] text-slate-400 font-bold bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl flex items-center gap-1.5">
          <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
          <span>모든 페이지 스크롤 뷰 ({numPages} Pages)</span>
        </div>

        {/* Zoom Controls */}
        {!loading && !error && (
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-xl">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="축소"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span
              onClick={handleResetZoom}
              className="text-[10px] font-mono text-slate-300 font-bold min-w-[36px] text-center cursor-pointer hover:text-amber-400 select-none"
              title="줌 초기화"
            >
              {zoom}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="확대"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Fullscreen Button */}
        {!loading && !error && (
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>전체화면</span>
          </button>
        )}
      </div>

      {/* Main Content Render Area - Unlimited height for natural vertical scrolling down the page */}
      <div 
        ref={containerRef}
        className="bg-slate-900/40 p-4 overflow-visible flex flex-col items-center min-h-[420px] h-auto relative scroll-smooth"
      >
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-slate-950/80 z-20">
            <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-amber-400 animate-spin" />
            <p className="text-xs font-bold text-slate-300">PDF 디지털 엔진 가동 및 기기 사양서 로딩 중...</p>
            <p className="text-[10px] text-slate-500">브라우저 내 자체 고해상도 이미지 렌더링 진행 중</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-950/90 z-20">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <FileText className="w-6 h-6 text-rose-500" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h5 className="text-sm font-black text-white">PDF 직접 렌더링 불가 안내</h5>
              <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
            </div>
            <div className="flex gap-2">
              <a
                href={pdfUrl}
                download={fileName}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-lg transition-all"
              >
                📥 파일 즉시 다운로드
              </a>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-black transition-all"
              >
                🖥️ 새 창에서 보기
              </a>
            </div>
          </div>
        )}

        {/* All Pages Continuous Scroll View */}
        {!loading && !error && pdfDoc && (
          <div className="space-y-6 w-full max-w-2xl py-4 flex flex-col items-center">
            {Array.from({ length: numPages }).map((_, i) => (
              <ScrollPageItem
                key={i}
                pdfDoc={pdfDoc}
                pageNum={i + 1}
                zoom={zoom}
                brandName={brandName}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Log */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-bold text-slate-500">
        <div className="flex items-center gap-2">
          <span>{brandName} 공식 브로셔</span>
          <span>•</span>
          <span className="font-mono text-slate-400">
            {isAdmin ? `${fileName} (${numPages} Pages)` : `${numPages} Pages`}
          </span>
        </div>
        <span className="text-amber-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 animate-pulse" />
          고선명 스마트 이미지 컨버팅 완료 (PDF.js Engine)
        </span>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col">
          <div className="p-4 bg-slate-950/90 border-b border-slate-800/60 flex justify-between items-center px-6">
            <span className="text-xs font-black text-white">{brandName} 카탈로그 전체화면 (전체 스크롤)</span>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black cursor-pointer"
            >
              닫기
            </button>
          </div>
          <div className="flex-1 overflow-auto bg-neutral-900/40 p-6 flex flex-col items-center justify-start scrollbar-thin">
            <div className="space-y-8 w-full max-w-4xl py-6 flex flex-col items-center">
              {Array.from({ length: numPages }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-slate-400 font-mono text-xs font-bold mb-2">PAGE {i + 1}</span>
                  <FullscreenPageItem pdfDoc={pdfDoc} pageNum={i + 1} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent to render individual page inside scroll view mode safely
function ScrollPageItem({ pdfDoc, pageNum, zoom, brandName, isAdmin }: { pdfDoc: any; pageNum: number; zoom: number; brandName: string; isAdmin?: boolean; key?: React.Key }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const render = async () => {
      if (!pdfDoc || !canvasRef.current) return;
      try {
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const page = await pdfDoc.getPage(pageNum);
        const scale = (zoom / 100) * (window.devicePixelRatio || 1) * 0.9; // slightly smaller in list
        const viewport = page.getViewport({ scale: scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / (window.devicePixelRatio || 1)}px`;
        canvas.style.height = `${viewport.height / (window.devicePixelRatio || 1)}px`;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
        if (isMounted) {
          setRendered(true);
        }
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.error(`Page ${pageNum} render error:`, err);
        }
      }
    };

    render();

    return () => {
      isMounted = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNum, zoom]);

  return (
    <div className="flex flex-col items-center space-y-1.5 w-full">
      <div className="shadow-lg rounded-lg bg-white overflow-hidden border border-slate-800 select-none relative">
        <canvas ref={canvasRef} className="block max-w-full" />
        {!rendered && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
          </div>
        )}
      </div>
      <span className="text-[9px] font-mono font-bold text-slate-500">
        {isAdmin ? `${brandName} Catalog - Page ${pageNum}` : `페이지 ${pageNum}`}
      </span>
    </div>
  );
}

// Fullscreen high-res render page
function FullscreenPageItem({ pdfDoc, pageNum }: { pdfDoc: any; pageNum: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    const render = async () => {
      if (!pdfDoc || !canvasRef.current) return;
      try {
        const page = await pdfDoc.getPage(pageNum);
        const scale = 2.0; // static high resolution for full screen
        const viewport = page.getViewport({ scale: scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = '100%';
        canvas.style.maxHeight = '80vh';

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
      } catch (err: any) {
        console.error(`Page ${pageNum} fullscreen render error:`, err);
      }
    };

    render();

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNum]);

  return (
    <div className="shadow-2xl rounded-lg bg-white overflow-hidden select-none max-w-full max-h-[80vh]">
      <canvas ref={canvasRef} className="block object-contain max-h-[80vh]" />
    </div>
  );
}
