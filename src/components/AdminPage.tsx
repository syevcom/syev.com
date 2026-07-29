import React, { useState } from 'react';
import { Product, Solution, Review, FAQ, Booking, ASRequest, ActivePage } from '../types';
import { 
  Package, 
  Building2, 
  ClipboardList, 
  Settings, 
  Plus, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  ArrowLeft, 
  Search, 
  Image as ImageIcon,
  Zap,
  Save,
  Phone,
  MessageSquare,
  Globe,
  Youtube,
  Instagram,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminPageProps {
  products: Product[];
  onSaveProducts: (products: Product[]) => void;
  brands: Record<string, any>;
  onSaveBrands: (brands: Record<string, any>) => void;
  bookings: Booking[];
  asRequests: ASRequest[];
  snsConfig: {
    kakaoUrl: string;
    instagramUrl: string;
    blogUrl: string;
    youtubeUrl?: string;
    showFloatingSns: boolean;
  };
  onSaveSnsConfig: (config: any) => void;
  footerConfig: {
    phone: string;
    email: string;
    companyName: string;
    ceoName: string;
    businessNumber: string;
  };
  onSaveFooterConfig: (config: any) => void;
  onNavigateHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  onSaveProducts,
  brands,
  onSaveBrands,
  bookings,
  asRequests,
  snsConfig,
  onSaveSnsConfig,
  footerConfig,
  onSaveFooterConfig,
  onNavigateHome
}) => {
  const [adminTab, setAdminTab] = useState<'products' | 'brands' | 'inquiries' | 'settings'>('products');
  
  // Local working copy of products for batch editing
  const [productList, setProductList] = useState<Product[]>(products);
  const [productSearch, setProductSearch] = useState('');
  const [powerFilter, setPowerFilter] = useState('all');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Local working copy of brands
  const [brandList, setBrandList] = useState<Record<string, any>>(brands);

  // Local SNS & Footer config
  const [snsState, setSnsState] = useState(snsConfig);
  const [footerState, setFooterState] = useState(footerConfig);

  // Handle Product Field Edit
  const handleProductChange = (index: number, field: keyof Product, value: any) => {
    const updated = [...productList];
    updated[index] = { ...updated[index], [field]: value };
    setProductList(updated);
  };

  // Handle Product Image File Upload (Directly convert local photo file to Data URL)
  const handleProductImageUpload = (index: number, file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 파일 크기가 너무 큽니다. 5MB 이하의 JPG/PNG 이미지를 선택해 주세요.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        handleProductChange(index, 'image', dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Add New Product
  const handleAddProduct = () => {
    const newProd: Product = {
      id: `custom-prod-${Date.now()}`,
      name: '새 전기차 충전기 모델',
      type: '완속',
      power: '7kW',
      features: ['PLC 화재 차단 기능', '무상 A/S 지원'],
      specs: { '설치방식': '벽부형 / 스탠드' },
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800',
      description: '새로 추가된 고급 전기차 충전기 제품입니다.',
      plcSupported: true,
      price: 650000,
      originalPrice: 850000,
      discountRate: 23,
      brand: 'SY.com',
      manufacturer: '에스와이코리아',
      detailCategory: '비공용완속'
    };
    setProductList([newProd, ...productList]);
  };

  // Delete Product
  const handleDeleteProduct = (id: string) => {
    if (confirm('이 상품을 관리자 목록에서 삭제하시겠습니까?')) {
      setProductList(productList.filter(p => p.id !== id));
    }
  };

  // Save All Products
  const handleSaveAllProducts = () => {
    onSaveProducts(productList);
    setSaveSuccessMsg('전체 상품 정보 및 변경된 대표 이미지가 성공적으로 저장되었습니다!');
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // Save All Brands
  const handleSaveAllBrands = () => {
    onSaveBrands(brandList);
    setSaveSuccessMsg('아파트 브랜드 정보가 성공적으로 저장되었습니다!');
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // Save Site Settings
  const handleSaveSiteSettings = () => {
    onSaveSnsConfig(snsState);
    onSaveFooterConfig(footerState);
    setSaveSuccessMsg('사이트 설정 및 퀵채널 SNS 링크가 저장되었습니다!');
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // Filter products by search & power
  const filteredProducts = productList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          (p.modelName && p.modelName.toLowerCase().includes(productSearch.toLowerCase())) ||
                          (p.brand && p.brand.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesPower = powerFilter === 'all' || p.power.includes(powerFilter);
    return matchesSearch && matchesPower;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-24">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="p-2 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-extrabold"
              title="쇼핑몰 메인으로 이동"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>메인 쇼핑몰</span>
            </button>
            <div className="h-4 w-px bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider">
                ADMIN CENTER
              </span>
              <h1 className="text-base font-black tracking-tight text-white hidden sm:block">
                SY.com 통합 관리자 대시보드
              </h1>
            </div>
          </div>

          <button
            onClick={onNavigateHome}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>사용자 화면에서 확인</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Success Alert Banner */}
        {saveSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-emerald-600 text-white flex items-center justify-between shadow-lg font-bold text-sm"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          </motion.div>
        )}

        {/* Dashboard Tab Bar */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setAdminTab('products')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              adminTab === 'products'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>📦 전체 상품 목록 & 사진 관리 ({productList.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('brands')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              adminTab === 'brands'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>🏢 아파트 브랜드 충전기</span>
          </button>

          <button
            onClick={() => setAdminTab('inquiries')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              adminTab === 'inquiries'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>📋 견적 & A/S 접수 내역 ({bookings.length + asRequests.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('settings')}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              adminTab === 'settings'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>⚙️ 사이트 정보 & 퀵채널</span>
          </button>
        </div>

        {/* TAB 1: BATCH PRODUCTS MANAGER */}
        {adminTab === 'products' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  전체 상품 일괄 편집 및 이미지 즉시 변경
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  모든 충전기 상품의 대표 이미지 파일(JPG/PNG 업로드), 모델명, 가격, 할인율, PLC 화재차단 여부를 한곳에서 수정할 수 있습니다.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>신규 상품 추가</span>
                </button>

                <button
                  onClick={handleSaveAllProducts}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer animate-bounce-short"
                >
                  <Save className="w-4 h-4" />
                  <span>전체 변경사항 저장</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="상품명, 모델명 또는 브랜드 검색..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs font-black text-slate-500 shrink-0">출력 필터:</span>
                {['all', '5kW', '7kW', '11kW', '14kW', 'BIZ'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPowerFilter(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer shrink-0 ${
                      powerFilter === p
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p === 'all' ? '전체 보기' : p}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Table Card List */}
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const realIndex = productList.findIndex(p => p.id === product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                      
                      {/* Image Preview & Upload Column */}
                      <div className="lg:col-span-3 flex flex-col items-center sm:items-start gap-2">
                        <div className="relative w-36 h-36 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden group flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-2"
                          />
                          <label
                            htmlFor={`upload-img-${product.id}`}
                            className="absolute inset-0 bg-slate-900/70 text-white font-extrabold text-xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer p-2 text-center"
                          >
                            <Upload className="w-5 h-5 mb-1 text-amber-400" />
                            <span>내 컴퓨터에서</span>
                            <span className="text-[10px] text-slate-300">사진 파일 선택 (JPG/PNG)</span>
                          </label>
                        </div>

                        <input
                          type="file"
                          id={`upload-img-${product.id}`}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleProductImageUpload(realIndex, e.target.files[0]);
                            }
                          }}
                        />

                        <div className="w-full flex items-center gap-1.5">
                          <label
                            htmlFor={`upload-img-${product.id}`}
                            className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11px] font-black text-center cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                            <span>사진 파일 업로드</span>
                          </label>
                        </div>

                        <input
                          type="text"
                          placeholder="또는 이미지 URL 직접 입력"
                          value={product.image.startsWith('data:') ? 'Local Image File Loaded' : product.image}
                          onChange={(e) => handleProductChange(realIndex, 'image', e.target.value)}
                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-mono text-slate-600 truncate"
                        />
                      </div>

                      {/* Product Details Column */}
                      <div className="lg:col-span-6 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500">상품명 (표시 이름)</label>
                            <input
                              type="text"
                              value={product.name}
                              onChange={(e) => handleProductChange(realIndex, 'name', e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500">브랜드 / 제조사</label>
                            <input
                              type="text"
                              value={product.brand || 'SY.com'}
                              onChange={(e) => handleProductChange(realIndex, 'brand', e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500">충전 타입</label>
                            <select
                              value={product.type}
                              onChange={(e) => handleProductChange(realIndex, 'type', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                            >
                              <option value="완속">완속</option>
                              <option value="급속">급속</option>
                              <option value="초급속">초급속</option>
                              <option value="스마트홈">스마트홈</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500">출력 용량</label>
                            <input
                              type="text"
                              value={product.power}
                              onChange={(e) => handleProductChange(realIndex, 'power', e.target.value)}
                              placeholder="예: 5kW, 7kW"
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-blue-700"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500">PLC 화재 차단</label>
                            <button
                              type="button"
                              onClick={() => handleProductChange(realIndex, 'plcSupported', !product.plcSupported)}
                              className={`w-full py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                                product.plcSupported
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                  : 'bg-slate-100 border-slate-200 text-slate-500'
                              }`}
                            >
                              {product.plcSupported ? '⚡ 지원함 (안전)' : '미지원'}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500">간단 설명</label>
                          <input
                            type="text"
                            value={product.description}
                            onChange={(e) => handleProductChange(realIndex, 'description', e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                          />
                        </div>
                      </div>

                      {/* Pricing & Action Column */}
                      <div className="lg:col-span-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60 space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500">기존 정가 (원)</label>
                          <input
                            type="number"
                            value={product.originalPrice || 0}
                            onChange={(e) => handleProductChange(realIndex, 'originalPrice', Number(e.target.value) || 0)}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-400 line-through"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500">실제 할인가격 (원)</label>
                          <input
                            type="number"
                            value={product.price || 0}
                            onChange={(e) => handleProductChange(realIndex, 'price', Number(e.target.value) || 0)}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-black text-rose-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500">할인율 (%)</label>
                          <input
                            type="number"
                            value={product.discountRate || 0}
                            onChange={(e) => handleProductChange(realIndex, 'discountRate', Number(e.target.value) || 0)}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-black text-rose-600"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>이 상품 삭제</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Save Bar */}
            <div className="sticky bottom-4 z-30 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-800">
              <span className="text-xs font-extrabold text-slate-300">
                총 {productList.length}개 상품 설정중 (수정 후 반드시 [저장]을 눌러주세요)
              </span>
              <button
                onClick={handleSaveAllProducts}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>전체 상품 변경사항 일괄 저장하기</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: APARTMENT BRANDS MANAGER */}
        {adminTab === 'brands' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  아파트 충전기 브랜드 정보 일괄 수정
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  아파트 브랜드 섹션에 노출되는 충전 브랜드를 한눈에 관리합니다.
                </p>
              </div>

              <button
                onClick={handleSaveAllBrands}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>브랜드 설정 저장</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(brandList).map(([brandName, brandRaw]) => {
                const brandData = brandRaw as any;
                return (
                  <div key={brandName} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-sm font-black text-slate-900">{brandName}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-bold">
                        아파트 공식 제휴
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500">브랜드 정식 명칭</label>
                      <input
                        type="text"
                        value={brandData?.name || brandName}
                        onChange={(e) => {
                          const updated = { ...brandList };
                          updated[brandName] = { ...updated[brandName], name: e.target.value };
                          setBrandList(updated);
                        }}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500">슬로건 / 한줄 소개</label>
                      <input
                        type="text"
                        value={brandData?.subtitle || brandData?.slogan || ''}
                        onChange={(e) => {
                          const updated = { ...brandList };
                          updated[brandName] = { ...updated[brandName], subtitle: e.target.value };
                          setBrandList(updated);
                        }}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500">상세 안내 문구</label>
                      <textarea
                        rows={2}
                        value={brandData?.description || ''}
                        onChange={(e) => {
                          const updated = { ...brandList };
                          updated[brandName] = { ...updated[brandName], description: e.target.value };
                          setBrandList(updated);
                        }}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: INQUIRIES & A/S DASHBOARD */}
        {adminTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-indigo-600" />
                고객 설치 견적 신청 및 A/S 접수 현황
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                사이트를 통해 실시간으로 접수된 전기차 충전기 견적 상담 및 정비/AS 신청 목록입니다.
              </p>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-900 text-white font-black text-xs flex items-center justify-between">
                <span>⚡ 충전기 무상설치 / 견적 상담 신청 목록 ({bookings.length}건)</span>
              </div>
              {bookings.length === 0 ? (
                <div className="p-8 text-center text-xs font-bold text-slate-400">
                  아직 접수된 상담 신청이 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 overflow-x-auto">
                  {bookings.map((b) => (
                    <div key={b.id} className="p-4 hover:bg-slate-50 flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900">{b.name}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">{b.phone}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">{b.purpose}</span>
                        </div>
                        <p className="text-slate-600 font-medium mt-1">주소: {b.address || '미입력'}</p>
                        {b.notes && <p className="text-slate-500 font-normal mt-0.5">요청사항: {b.notes}</p>}
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-slate-400 font-mono">{b.createdAt || '오늘'}</span>
                        <span className="inline-block mt-1 px-2.5 py-1 bg-amber-100 text-amber-800 font-extrabold rounded-lg text-[10px]">
                          상담 진행중
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AS Requests Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-900 text-white font-black text-xs flex items-center justify-between">
                <span>🔧 긴급 A/S 및 기기 정비 접수 목록 ({asRequests.length}건)</span>
              </div>
              {asRequests.length === 0 ? (
                <div className="p-8 text-center text-xs font-bold text-slate-400">
                  접수된 A/S 건이 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 overflow-x-auto">
                  {asRequests.map((req) => (
                    <div key={req.id} className="p-4 hover:bg-slate-50 flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900">{req.userName}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">{req.phone}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold">{req.issueType}</span>
                        </div>
                        <p className="text-slate-600 font-medium mt-1">설치장소: {req.locationAddress}</p>
                        <p className="text-slate-500 font-normal mt-0.5">증상: {req.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-slate-400 font-mono">{req.date}</span>
                        <span className="inline-block mt-1 px-2.5 py-1 bg-rose-100 text-rose-800 font-extrabold rounded-lg text-[10px]">
                          A/S 전담 기사 배치중
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SITE SETTINGS & SNS QUICK CHANNELS */}
        {adminTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-600" />
                  사이트 대표 정보 및 SNS 퀵채널 링크 관리
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  헤더/푸터 대표 연락처, 카카오톡, 유튜브, 인스타그램, 네이버 블로그 링크를 수정합니다.
                </p>
              </div>

              <button
                onClick={handleSaveSiteSettings}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>설정 저장</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SNS Channels */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
                  📲 퀵채널 & SNS 공식 링크
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                    카카오톡 플러스친구 URL
                  </label>
                  <input
                    type="text"
                    value={snsState.kakaoUrl}
                    onChange={(e) => setSnsState({ ...snsState, kakaoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                    <Youtube className="w-4 h-4 text-red-600" />
                    유튜브 채널 URL
                  </label>
                  <input
                    type="text"
                    value={snsState.youtubeUrl || ''}
                    onChange={(e) => setSnsState({ ...snsState, youtubeUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    인스타그램 URL
                  </label>
                  <input
                    type="text"
                    value={snsState.instagramUrl}
                    onChange={(e) => setSnsState({ ...snsState, instagramUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    네이버 블로그 URL
                  </label>
                  <input
                    type="text"
                    value={snsState.blogUrl}
                    onChange={(e) => setSnsState({ ...snsState, blogUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
                  🏢 회사 대표 연락처 & 사업자 정보
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">대표 전화번호</label>
                  <input
                    type="text"
                    value={footerState.phone}
                    onChange={(e) => setFooterState({ ...footerState, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">대표 이메일</label>
                  <input
                    type="text"
                    value={footerState.email}
                    onChange={(e) => setFooterState({ ...footerState, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">상호명</label>
                  <input
                    type="text"
                    value={footerState.companyName}
                    onChange={(e) => setFooterState({ ...footerState, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">대표자명</label>
                  <input
                    type="text"
                    value={footerState.ceoName}
                    onChange={(e) => setFooterState({ ...footerState, ceoName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};
