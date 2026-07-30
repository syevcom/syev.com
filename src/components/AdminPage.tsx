import React, { useState } from 'react';
import { Product, Solution, Review, FAQ, Booking, ASRequest, ActivePage, ProductOptionGroup, ProductOptionItem } from '../types';
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
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X
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

  // Track expanded option sections per product ID
  const [expandedOptions, setExpandedOptions] = useState<Record<string, boolean>>({});

  const toggleExpandOption = (id: string) => {
    setExpandedOptions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAllOptions = () => {
    const next: Record<string, boolean> = {};
    productList.forEach(p => { next[p.id] = true; });
    setExpandedOptions(next);
  };

  const collapseAllOptions = () => {
    setExpandedOptions({});
  };

  // Add Option Group
  const handleAddOptionGroup = (productIndex: number) => {
    const updated = [...productList];
    const target = updated[productIndex];
    const currentGroups = target.optionGroups || [];
    const grpCount = currentGroups.length;

    let defaultTitle = '커넥터길이';
    let defaultOptions: ProductOptionItem[] = [
      { id: `opt-${Date.now()}-1`, name: '5m 커넥터 일체형 (기본 장착)', price: 0 },
      { id: `opt-${Date.now()}-2`, name: '7m 연장형 (+30,000원)', price: 30000 },
      { id: `opt-${Date.now()}-3`, name: '10m 최장 전용선 (+50,000원)', price: 50000 }
    ];

    if (grpCount === 1) {
      defaultTitle = '거치대 및 스탠드 사양';
      defaultOptions = [
        { id: `opt-${Date.now()}-1`, name: '선택 안 함 (벽부형 기본)', price: 0 },
        { id: `opt-${Date.now()}-2`, name: '자립형 독립 스탠드 (+120,000원)', price: 120000 }
      ];
    } else if (grpCount >= 2) {
      defaultTitle = `추가 옵션 그룹 ${grpCount + 1}`;
      defaultOptions = [
        { id: `opt-${Date.now()}-1`, name: '선택 안 함 (기본)', price: 0 },
        { id: `opt-${Date.now()}-2`, name: '추가 구성품 포함', price: 20000 }
      ];
    }

    const newGroup: ProductOptionGroup = {
      id: `grp-${Date.now()}`,
      title: defaultTitle,
      required: false,
      options: defaultOptions
    };
    updated[productIndex] = {
      ...target,
      optionGroups: [...currentGroups, newGroup]
    };
    setProductList(updated);
    setExpandedOptions(prev => ({ ...prev, [target.id]: true }));
  };

  // Delete Option Group
  const handleDeleteOptionGroup = (productIndex: number, groupIdx: number) => {
    const updated = [...productList];
    const target = updated[productIndex];
    const currentGroups = [...(target.optionGroups || [])];
    currentGroups.splice(groupIdx, 1);
    updated[productIndex] = { ...target, optionGroups: currentGroups };
    setProductList(updated);
  };

  // Update Option Group Title
  const handleUpdateOptionGroupTitle = (productIndex: number, groupIdx: number, title: string) => {
    const updated = [...productList];
    const target = updated[productIndex];
    const currentGroups = [...(target.optionGroups || [])];
    currentGroups[groupIdx] = { ...currentGroups[groupIdx], title };
    updated[productIndex] = { ...target, optionGroups: currentGroups };
    setProductList(updated);
  };

  // Add Option Choice Item
  const handleAddOptionItem = (productIndex: number, groupIdx: number) => {
    const updated = [...productList];
    const target = updated[productIndex];
    const currentGroups = [...(target.optionGroups || [])];
    const grp = currentGroups[groupIdx];
    const newOpt: ProductOptionItem = {
      id: `opt-${Date.now()}`,
      name: '새 추가 옵션 항목',
      price: 10000
    };
    currentGroups[groupIdx] = { ...grp, options: [...grp.options, newOpt] };
    updated[productIndex] = { ...target, optionGroups: currentGroups };
    setProductList(updated);
  };

  // Delete Option Choice Item
  const handleDeleteOptionItem = (productIndex: number, groupIdx: number, optIdx: number) => {
    const updated = [...productList];
    const target = updated[productIndex];
    const currentGroups = [...(target.optionGroups || [])];
    const grp = currentGroups[groupIdx];
    const nextOpts = grp.options.filter((_, idx) => idx !== optIdx);
    currentGroups[groupIdx] = { ...grp, options: nextOpts };
    updated[productIndex] = { ...target, optionGroups: currentGroups };
    setProductList(updated);
  };

  // Update Option Choice Item
  const handleUpdateOptionItem = (
    productIndex: number, 
    groupIdx: number, 
    optIdx: number, 
    field: 'name' | 'price', 
    val: any
  ) => {
    const updated = [...productList];
    const target = updated[productIndex];
    const currentGroups = [...(target.optionGroups || [])];
    const grp = currentGroups[groupIdx];
    const nextOpts = [...grp.options];
    nextOpts[optIdx] = { ...nextOpts[optIdx], [field]: val };
    currentGroups[groupIdx] = { ...grp, options: nextOpts };
    updated[productIndex] = { ...target, optionGroups: currentGroups };
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
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="상품명, 모델명 또는 브랜드 검색..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={expandAllOptions}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-extrabold transition-all cursor-pointer shrink-0"
                  >
                    📂 모든 옵션 펼치기
                  </button>
                  <button
                    type="button"
                    onClick={collapseAllOptions}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-extrabold transition-all cursor-pointer shrink-0"
                  >
                    📁 모두 접기
                  </button>
                </div>

                <div className="h-4 w-[1px] bg-slate-200 hidden sm:block mx-1" />

                <span className="text-xs font-black text-slate-500 shrink-0">출력 필터:</span>
                {['all', '5kW', '7kW', '11kW', '14kW', 'BIZ'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPowerFilter(p)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer shrink-0 ${
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

                    {/* Expandable Options & Delivery Settings Section */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleExpandOption(product.id)}
                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                          >
                            <Settings className="w-3.5 h-3.5 text-amber-400" />
                            <span>상세 사양 및 커넥터 옵션 설정</span>
                            <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded text-[10px] font-bold">
                              {(product.optionGroups || []).length}개 그룹
                            </span>
                            {expandedOptions[product.id] ? (
                              <ChevronUp className="w-3.5 h-3.5 text-slate-300" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                            )}
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddOptionGroup(realIndex)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ 새 옵션 대분류 추가</span>
                        </button>
                      </div>

                      {/* Expanded Options Panel */}
                      {expandedOptions[product.id] && (
                        <div className="p-4 bg-blue-50/40 border border-blue-200/80 rounded-2xl space-y-4">
                          
                          {/* 1. Delivery & Payment Information */}
                          <div className="space-y-2">
                            <h6 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                              <span>🚚 배송 방법 및 결제/구성품 정보</span>
                            </h6>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500">배송방법 / 배송비</label>
                                <input
                                  type="text"
                                  value={product.deliveryInfo || '택배(주문 시 결제) / 무료배송'}
                                  onChange={(e) => handleProductChange(realIndex, 'deliveryInfo', e.target.value)}
                                  placeholder="예: 택배 / 무료배송"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500">구성품 및 설치비 안내</label>
                                <input
                                  type="text"
                                  value={product.componentsInfo || '제조사 별도 발송 / 설치비 미포함 상품'}
                                  onChange={(e) => handleProductChange(realIndex, 'componentsInfo', e.target.value)}
                                  placeholder="예: 설치비 미포함 상품"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-500">포인트 / 적립금 안내</label>
                                <input
                                  type="text"
                                  value={product.rewardPointsInfo || '구매 ₩0'}
                                  onChange={(e) => handleProductChange(realIndex, 'rewardPointsInfo', e.target.value)}
                                  placeholder="예: 구매 ₩0"
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                                />
                              </div>
                            </div>
                          </div>

                          {/* 2. Option Groups & Option Choice List */}
                          <div className="space-y-3 pt-2 border-t border-blue-100">
                            <div className="flex items-center justify-between">
                              <h6 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                                <Settings className="w-3.5 h-3.5 text-blue-600" />
                                <span>옵션 대분류 및 선택 리스트 (커넥터 길이, 거치대 사양 등)</span>
                              </h6>
                              <button
                                type="button"
                                onClick={() => handleAddOptionGroup(realIndex)}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-extrabold flex items-center gap-1 cursor-pointer shadow-xs transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ 대분류 추가</span>
                              </button>
                            </div>

                            {(!product.optionGroups || product.optionGroups.length === 0) ? (
                              <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-2">
                                <p className="text-xs font-bold text-slate-500">등록된 옵션 대분류가 없습니다.</p>
                                <button
                                  type="button"
                                  onClick={() => handleAddOptionGroup(realIndex)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold cursor-pointer"
                                >
                                  + 커넥터 길이 등 기본 옵션 그룹 자동 생성
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {product.optionGroups.map((grp, grpIdx) => (
                                  <div
                                    key={grp.id || grpIdx}
                                    className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs"
                                  >
                                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                                      <div className="flex-1 flex items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                                          대분류 {grpIdx + 1}
                                        </span>
                                        <input
                                          type="text"
                                          value={grp.title}
                                          onChange={(e) => handleUpdateOptionGroupTitle(realIndex, grpIdx, e.target.value)}
                                          placeholder="옵션 대분류명 (예: 커넥터길이, 거치대/스탠드)"
                                          className="flex-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black text-slate-900 focus:bg-white"
                                        />
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteOptionGroup(realIndex, grpIdx)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-all cursor-pointer"
                                        title="옵션 대분류 삭제"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {/* Option Choices Items */}
                                    <div className="space-y-2 pl-1">
                                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                                        <span>옵션 선택 리스트 항목</span>
                                        <button
                                          type="button"
                                          onClick={() => handleAddOptionItem(realIndex, grpIdx)}
                                          className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 text-[10px] font-extrabold hover:bg-blue-100 cursor-pointer"
                                        >
                                          + 항목 추가
                                        </button>
                                      </div>

                                      <div className="space-y-1.5">
                                        {grp.options.map((opt, optIdx) => (
                                          <div key={opt.id || optIdx} className="flex items-center gap-2">
                                            <input
                                              type="text"
                                              value={opt.name}
                                              onChange={(e) => handleUpdateOptionItem(realIndex, grpIdx, optIdx, 'name', e.target.value)}
                                              placeholder="옵션 항목명 (예: 5m 커넥터 일체형)"
                                              className="flex-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white"
                                            />
                                            <div className="w-32 flex items-center gap-1 shrink-0">
                                              <input
                                                type="number"
                                                value={opt.price}
                                                onChange={(e) => handleUpdateOptionItem(realIndex, grpIdx, optIdx, 'price', Number(e.target.value) || 0)}
                                                className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right text-slate-900 focus:bg-white"
                                              />
                                              <span className="text-[10px] font-bold text-slate-500 shrink-0">원</span>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => handleDeleteOptionItem(realIndex, grpIdx, optIdx)}
                                              className="p-1 text-slate-400 hover:text-red-500 rounded transition-all cursor-pointer"
                                              title="항목 삭제"
                                            >
                                              <X className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {/* Add Another Option Group Button at the bottom of groups list */}
                                <button
                                  type="button"
                                  onClick={() => handleAddOptionGroup(realIndex)}
                                  className="w-full py-2.5 bg-white hover:bg-blue-50/60 border border-dashed border-blue-300 text-blue-700 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                                >
                                  <Plus className="w-4 h-4 text-blue-600" />
                                  <span>+ 옵션 대분류 추가하기 (예: 대분류 2: 거치대/스탠드, 대분류 3: 케이블/어댑터)</span>
                                </button>
                              </div>
                            )}
                          </div>

                        </div>
                      )}
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
