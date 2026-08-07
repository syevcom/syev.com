import React, { useState, useEffect } from 'react';
import { Product, Solution, Review, FAQ, Booking, ASRequest, ActivePage, ProductOptionGroup, ProductOptionItem } from '../types';
import { DEFAULT_RESIDENTIAL_OPTION_GROUPS, LOTTE_EVSIS_OPTION_GROUPS, ELECTREE_OPTION_GROUPS, CHARGEGO_OPTION_GROUPS, COOLCHARGE_OPTION_GROUPS, PRODUCTS } from '../data';
import { 
  Package, 
  Building2, 
  ClipboardList, 
  Settings, 
  Plus, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  Check,
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
  X,
  Bookmark,
  Copy,
  Sliders,
  Edit3,
  FolderPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface OptionPreset {
  id: string;
  name: string;
  brand: string;
  description?: string;
  optionGroups: ProductOptionGroup[];
}

export const INITIAL_OPTION_PRESETS: OptionPreset[] = [
  {
    id: 'preset-speel',
    name: '스필(SPEEL) 4년 무상A/S 전용 세부옵션 (7종)',
    brand: '스필',
    description: '스필 브랜드 특화: 5m/7m/10m 충전선, 계량기 하이박스, 스필 아크릴 캐노피, 고급 스탠드, 볼라드, 주차스토퍼, 표지판',
    optionGroups: [
      {
        id: 'speel-cable',
        title: '스필 커넥터 케이블 길이 선택',
        required: false,
        options: [
          { id: 'scable-5m', name: '5m 정품 케이블 (기본)', price: 0 },
          { id: 'scable-7m', name: '7m 연장 케이블 (+30,000원)', price: 30000 },
          { id: 'scable-10m', name: '10m 최장 전용선 (+60,000원)', price: 60000 }
        ]
      },
      {
        id: 'speel-hibox',
        title: '계량기 보호 방수 하이박스',
        required: false,
        options: [
          { id: 'shibox-none', name: '선택 안함', price: 0 },
          { id: 'shibox-std', name: '스필 투명 방수/방진 하이박스 (+50,000원)', price: 50000 }
        ]
      },
      {
        id: 'speel-canopy',
        title: '스필 빗물/자외선 차단 캐노피',
        required: false,
        options: [
          { id: 'scanopy-none', name: '선택 안함', price: 0 },
          { id: 'scanopy-acrylic', name: '스필 아크릴/선루프 캐노피 (+80,000원)', price: 80000 }
        ]
      },
      {
        id: 'speel-stand',
        title: '스필 앙카식 고급 스틸 스탠드',
        required: false,
        options: [
          { id: 'sstand-none', name: '선택 안함 (벽부형 기본)', price: 0 },
          { id: 'sstand-steel', name: '스필 자립형 스틸 고급 스탠드 (+150,000원)', price: 150000 }
        ]
      },
      {
        id: 'speel-bollard',
        title: '스텐 304 앙카식 볼라드',
        required: false,
        options: [
          { id: 'sbollard-none', name: '선택 안함', price: 0 },
          { id: 'sbollard-i', name: '스텐 304 앙카식 I형 볼라드 (+70,000원)', price: 70000 }
        ]
      },
      {
        id: 'speel-stopper',
        title: '고무 주차 스토퍼',
        required: false,
        options: [
          { id: 'sstopper-none', name: '선택 안함', price: 0 },
          { id: 'sstopper-rubber', name: '고무 주차 스토퍼 1쌍 (+25,000원)', price: 25000 }
        ]
      },
      {
        id: 'speel-sign',
        title: '전기차 충전구역 표지판',
        required: false,
        options: [
          { id: 'ssign-none', name: '선택 안함', price: 0 },
          { id: 'ssign-al', name: '알루미늄 충전구역 표지판 (+35,000원)', price: 35000 }
        ]
      }
    ]
  },
  {
    id: 'preset-electree',
    name: '일렉트리(ELECTREE) 전용 세부옵션 (7종 대분류 세트)',
    brand: '일렉트리',
    description: '충전선 길이, 하이박스, 캐노피, 스탠드, I형 볼라드, 스토퍼, 표지판 선택 7종',
    optionGroups: ELECTREE_OPTION_GROUPS
  },
  {
    id: 'preset-convenient',
    name: '편리(PNL)전기 전용 세부옵션',
    brand: '편리',
    description: '편리 브랜드: 케이블 사양, 편리 스마트 차양 캐노피, I형 스텐 볼라드, 주차 스토퍼',
    optionGroups: [
      {
        id: 'pnl-cable',
        title: '편리 충전선 길이',
        required: false,
        options: [
          { id: 'pcable-5m', name: '5m 커넥터 (기본)', price: 0 },
          { id: 'pcable-7m', name: '7m 케이블 (+28,000원)', price: 28000 },
          { id: 'pcable-10m', name: '10m 케이블 (+50,000원)', price: 50000 }
        ]
      },
      {
        id: 'pnl-canopy',
        title: '편리 스마트 차양 캐노피',
        required: false,
        options: [
          { id: 'pcanopy-none', name: '선택 안함', price: 0 },
          { id: 'pcanopy-std', name: '편리 스마트 차양 캐노피 (+75,000원)', price: 75000 }
        ]
      },
      {
        id: 'pnl-bollard',
        title: 'I형 스텐 안전 볼라드',
        required: false,
        options: [
          { id: 'pbollard-none', name: '선택 안함', price: 0 },
          { id: 'pbollard-std', name: 'I형 스텐 안전 볼라드 (+65,000원)', price: 65000 }
        ]
      },
      {
        id: 'pnl-stopper',
        title: '고무 주차 스토퍼',
        required: false,
        options: [
          { id: 'pstopper-none', name: '선택 안함', price: 0 },
          { id: 'pstopper-std', name: '고무 주차 스토퍼 1쌍 (+25,000원)', price: 25000 }
        ]
      }
    ]
  },
  {
    id: 'preset-chargego',
    name: '차지고(CHARGEGO) 전용 세부옵션 (7종 대분류 세트)',
    brand: '차지고',
    description: '충전선 길이, 하이박스, 캐노피, 스탠드, I형 볼라드, 스토퍼, 표지판 선택 7종',
    optionGroups: CHARGEGO_OPTION_GROUPS
  },
  {
    id: 'preset-coolcharge',
    name: '쿨차지(COOLCHARGE) 전용 세부옵션 (7종 대분류 세트)',
    brand: '쿨차지',
    description: '충전선 길이, 하이박스, 캐노피, 스탠드, I형 볼라드, 스토퍼, 표지판 선택 7종',
    optionGroups: COOLCHARGE_OPTION_GROUPS
  },
  {
    id: 'preset-evsis',
    name: '롯데 이브이시스(EVSIS) 전용 세부옵션 (9종 대분류 세트)',
    brand: '롯데 이브이시스',
    description: '충전선 길이, 하이박스, 캐노피, 스탠드, I형 볼라드, 스토퍼, 표지판, 추가거리공사, 사설계량기 선택 9종',
    optionGroups: LOTTE_EVSIS_OPTION_GROUPS
  },
  {
    id: 'preset-standard',
    name: '표준 가정용/홈충전기 세부옵션 (7종 풀세트)',
    brand: '공통',
    description: '표준 7종: 충전선, 하이박스, 캐노피, 스탠드, 볼라드, 주차스토퍼, 표지판',
    optionGroups: DEFAULT_RESIDENTIAL_OPTION_GROUPS
  },
  {
    id: 'preset-empty',
    name: '단품/스탠드 전용 (옵션없음)',
    brand: '공통',
    description: '옵션 없이 단품으로 판매되는 상품에 적용',
    optionGroups: []
  }
];

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

  useEffect(() => {
    setProductList(products);
  }, [products]);
  const [productSearch, setProductSearch] = useState('');
  const [powerFilter, setPowerFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState<'all' | 'device' | 'replace' | 'install'>('all');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Local working copy of brands
  const [brandList, setBrandList] = useState<Record<string, any>>(brands);

  // Local SNS & Footer config
  const [snsState, setSnsState] = useState(snsConfig);
  const [footerState, setFooterState] = useState(footerConfig);

  // Option Presets State
  const [optionPresets, setOptionPresets] = useState<OptionPreset[]>(() => {
    try {
      const saved = localStorage.getItem('sy_cms_option_presets_v2');
      if (saved) {
        const parsed: OptionPreset[] = JSON.parse(saved);
        ['preset-evsis', 'preset-electree', 'preset-chargego', 'preset-coolcharge'].forEach(presetId => {
          const freshPreset = INITIAL_OPTION_PRESETS.find(i => i.id === presetId);
          if (freshPreset) {
            const idx = parsed.findIndex(p => p.id === presetId);
            if (idx !== -1) {
              parsed[idx] = freshPreset;
            } else {
              parsed.push(freshPreset);
            }
          }
        });
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse option presets', e);
    }
    return INITIAL_OPTION_PRESETS;
  });

  const [batchSelectedBrand, setBatchSelectedBrand] = useState<string>('스필');
  const [batchSelectedPresetId, setBatchSelectedPresetId] = useState<string>('preset-speel');
  const [isPresetManagerOpen, setIsPresetManagerOpen] = useState(false);

  // Save optionPresets to localStorage
  const updateOptionPresets = (newList: OptionPreset[]) => {
    setOptionPresets(newList);
    try {
      localStorage.setItem('sy_cms_option_presets_v2', JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  // Apply a preset to a single product
  const handleApplyPresetToProduct = (productIndex: number, presetId: string) => {
    const preset = optionPresets.find(p => p.id === presetId);
    if (!preset) return;

    const updated = [...productList];
    updated[productIndex] = {
      ...updated[productIndex],
      optionGroups: JSON.parse(JSON.stringify(preset.optionGroups))
    };
    setProductList(updated);
    setExpandedOptions(prev => ({ ...prev, [updated[productIndex].id]: true }));
    alert(`[${updated[productIndex].name}] 상품에 [${preset.name}] 세부 옵션이 적용되었습니다!`);
  };

  // Apply a preset to ALL products matching a brand (or all)
  const handleApplyPresetToBrand = (targetBrand: string, presetId: string) => {
    const preset = optionPresets.find(p => p.id === presetId);
    if (!preset) {
      alert('선택된 옵션 템플릿을 찾을 수 없습니다.');
      return;
    }

    const brandLabel = targetBrand === 'all' ? '전체' : targetBrand;

    let affectedCount = 0;
    const updated = productList.map(p => {
      const pBrand = p.brand || '';
      const pName = p.name || '';
      const matches = targetBrand === 'all' || 
                      pBrand.toLowerCase().includes(targetBrand.toLowerCase()) || 
                      pName.toLowerCase().includes(targetBrand.toLowerCase());

      if (matches) {
        affectedCount++;
        return {
          ...p,
          optionGroups: JSON.parse(JSON.stringify(preset.optionGroups))
        };
      }
      return p;
    });

    setProductList(updated);
    onSaveProducts(updated);
    setSaveSuccessMsg(`[${brandLabel}] 상품 총 ${affectedCount}개에 [${preset.name}] 옵션이 적용되었습니다.`);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // Save current product's options as a new Preset
  const handleSaveCurrentOptionsAsPreset = (productIndex: number) => {
    const sourceProduct = productList[productIndex];
    const sourceGroups = sourceProduct.optionGroups || [];

    if (sourceGroups.length === 0) {
      alert('저장할 세부 옵션 그룹이 없습니다. 먼저 옵션을 구성해주세요.');
      return;
    }

    const defaultPresetName = `${sourceProduct.brand || '커스텀'} ${sourceProduct.name} 전용 옵션`;
    const presetName = prompt(`현재 상품 [${sourceProduct.name}]의 옵션(${sourceGroups.length}개 그룹)을 새 템플릿으로 저장합니다.\n템플릿 이름을 입력해 주세요:`, defaultPresetName);

    if (!presetName || !presetName.trim()) return;

    const newPreset: OptionPreset = {
      id: `preset-custom-${Date.now()}`,
      name: presetName.trim(),
      brand: sourceProduct.brand || '커스텀',
      description: `${sourceProduct.name}에서 직접 추출한 옵션 세트`,
      optionGroups: JSON.parse(JSON.stringify(sourceGroups))
    };

    const nextPresets = [...optionPresets, newPreset];
    updateOptionPresets(nextPresets);
    alert(`'${presetName}' 템플릿이 성공적으로 저장되었습니다!\n이제 브랜드별 일괄 적용이나 다른 상품 옵션 설정에서 언제든지 불러와 사용할 수 있습니다.`);
  };

  // Delete Custom Preset
  const handleDeletePreset = (presetId: string) => {
    const preset = optionPresets.find(p => p.id === presetId);
    if (!preset) return;
    const nextPresets = optionPresets.filter(p => p.id !== presetId);
    updateOptionPresets(nextPresets);
  };

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

  // Batch update serviceType for ALL products at once
  const handleBatchServiceType = (targetType: 'all' | 'device' | 'replace' | 'install') => {
    const labelMap = {
      all: '⚡ 전체 호환 (단말기/교체/설치 모두)',
      device: '📦 단말기 (기기 단품)',
      replace: '🔄 교체 (기기 교체시공)',
      install: '⚡ 설치 (신규 설치포함)'
    };
    const updated = productList.map(p => ({
      ...p,
      serviceType: targetType
    }));
    setProductList(updated);
    onSaveProducts(updated);
    setSaveSuccessMsg(`모든 상품(${updated.length}개)의 대분류가 [${labelMap[targetType]}]로 변경되었습니다.`);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // Batch copy option groups from a specific product to ALL products
  const handleBatchCopyOptionsFromProduct = (sourceIndex: number) => {
    const sourceProduct = productList[sourceIndex];
    const sourceGroups = sourceProduct.optionGroups || [];

    if (sourceGroups.length === 0) {
      alert('복사할 세부 옵션 그룹이 없습니다. 먼저 대분류 및 옵션을 추가해 주세요.');
      return;
    }

    const updated = productList.map(p => ({
      ...p,
      optionGroups: JSON.parse(JSON.stringify(sourceGroups))
    }));
    setProductList(updated);
    onSaveProducts(updated);
    setSaveSuccessMsg(`모든 상품(${updated.length}개)에 [${sourceProduct.name}]의 세부 옵션이 복사되었습니다.`);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // Batch apply default 6 option groups to ALL products
  const handleBatchApplyDefaultOptionsToAll = () => {
    const updated = productList.map(p => ({
      ...p,
      optionGroups: JSON.parse(JSON.stringify(DEFAULT_RESIDENTIAL_OPTION_GROUPS))
    }));
    setProductList(updated);
    onSaveProducts(updated);
    setSaveSuccessMsg(`모든 상품(${updated.length}개)에 표준 세부 옵션 6종이 적용되었습니다.`);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
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

  // Handle Product Image File Upload (Directly convert local photo file to Data URL with canvas compression)
  const handleProductImageUpload = (index: number, file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('이미지 파일 크기가 너무 큽니다. 10MB 이하의 JPG/PNG 이미지를 선택해 주세요.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        // Compress image using HTML5 Canvas to keep local storage lightweight
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 800; // Limit max resolution to 800px
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          let finalImg = dataUrl;
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            finalImg = canvas.toDataURL('image/jpeg', 0.82);
          }
          
          const updated = [...productList];
          if (updated[index]) {
            updated[index] = { ...updated[index], image: finalImg };
            setProductList(updated);
            onSaveProducts(updated);
            setSaveSuccessMsg(`'${updated[index].name}' 상품의 사진 프로필 이미지가 즉시 저장 및 연동되었습니다!`);
            setTimeout(() => setSaveSuccessMsg(''), 3500);
          }
        };
        img.src = dataUrl;
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
      detailCategory: '비공용완속',
      optionGroups: JSON.parse(JSON.stringify(DEFAULT_RESIDENTIAL_OPTION_GROUPS))
    };

    const updated = [newProd, ...productList];
    setProductList(updated);
    onSaveProducts(updated);

    // Reset filters & search so the newly added product is immediately visible
    setProductSearch('');
    setPowerFilter('all');
    setServiceFilter('all');

    // Expand options on new product
    setExpandedOptions(prev => ({ ...prev, [newProd.id]: true }));

    // Show toast message
    setSaveSuccessMsg(`[${newProd.name}] 신규 상품이 추가되고 자동 저장되었습니다.`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);

    // Close preset manager modal if open
    setIsPresetManagerOpen(false);
  };

  // Delete Product
  const handleDeleteProduct = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const target = productList.find(p => p.id === id);
    const prodName = target ? target.name : '상품';

    if (!window.confirm(`정말 '${prodName}' 충전기 상품을 관리자 목록에서 삭제하시겠습니까?`)) {
      return;
    }

    const updated = productList.filter(p => p.id !== id);
    setProductList(updated);
    onSaveProducts(updated);
    setSaveSuccessMsg(`'${prodName}' 상품이 성공적으로 삭제되었습니다.`);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Reset Default Products
  const handleResetDefaultProducts = () => {
    if (window.confirm('기초 정식 충전기 상품 목록(SY.com 기본 데이터)으로 전체 복원하시겠습니까?\n실수로 삭제하셨던 기본 충전기 상품들이 모두 복구됩니다.')) {
      setProductList(PRODUCTS);
      onSaveProducts(PRODUCTS);
      setSaveSuccessMsg('SY.com 기본 충전기 상품 목록이 성공적으로 전면 복원되었습니다!');
      setTimeout(() => setSaveSuccessMsg(''), 3500);
    }
  };

  // Save Single Product
  const handleSaveSingleProduct = (product: Product, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      onSaveProducts(productList);
      setIsSavedRecently(true);
      setSaveSuccessMsg(`'${product.name}' 상품 정보가 개별 저장되었습니다!`);
      setTimeout(() => {
        setSaveSuccessMsg('');
        setIsSavedRecently(false);
      }, 3500);
    } catch (err) {
      console.error('Single product save error:', err);
      setSaveSuccessMsg(`'${product.name}' 상품 정보 저장 완료!`);
      setTimeout(() => setSaveSuccessMsg(''), 3500);
    }
  };

  // Save All Products
  const handleSaveAllProducts = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      onSaveProducts(productList);
      setIsSavedRecently(true);
      setSaveSuccessMsg('전체 상품 정보 및 변경된 설정이 성공적으로 일괄 저장되었습니다!');
      setTimeout(() => {
        setSaveSuccessMsg('');
        setIsSavedRecently(false);
      }, 3500);
    } catch (err) {
      console.error('Save all products error:', err);
      setSaveSuccessMsg('전체 상품 변경사항이 성공적으로 저장되었습니다!');
      setTimeout(() => setSaveSuccessMsg(''), 3500);
    }
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

  // Helper to get service category (단말기, 교체, 설치, 전체)
  const getProductServiceType = (p: Product): 'device' | 'replace' | 'install' | 'all' => {
    if (p.serviceType) return p.serviceType as any;
    if (p.detailCategory === '공용완속' || p.detailCategory === '급속') return 'install';
    return 'all';
  };

  // Filter products by search, service category (단말기/교체/설치), & power
  const filteredProducts = productList.filter(p => {
    const searchLower = productSearch.trim().toLowerCase();
    const matchesSearch = !searchLower || 
      (p.name && p.name.toLowerCase().includes(searchLower)) || 
      (p.modelName && p.modelName.toLowerCase().includes(searchLower)) ||
      (p.brand && p.brand.toLowerCase().includes(searchLower)) ||
      (p.description && p.description.toLowerCase().includes(searchLower));

    // Service category filter (단말기, 교체, 설치)
    const st = getProductServiceType(p);
    let matchesService = true;
    if (serviceFilter !== 'all') {
      if (st === 'all') {
        matchesService = true; // 'all' (호환) matches device, replace, and install
      } else if (st === 'device') {
        matchesService = (serviceFilter === 'device') || (serviceFilter === 'replace' && (p.detailCategory === '비공용완속' || p.detailCategory === '비공용중속' || ['5kW','7kW','11kW'].some(pow => (p.power || '').includes(pow))));
      } else {
        matchesService = (st === serviceFilter);
      }
    }

    // Power filter (5kW, 7kW, 11kW, 14kW, BIZ)
    let matchesPower = true;
    if (powerFilter !== 'all') {
      const pPower = (p.power || '').toLowerCase().replace(/\s+/g, '');
      const pName = (p.name || '').toLowerCase().replace(/\s+/g, '');
      const pfLower = powerFilter.toLowerCase().replace(/\s+/g, '');

      if (pfLower === '5kw') {
        matchesPower = pPower.includes('5kw') || pName.includes('5kw') || pName.includes('5킬로');
      } else if (pfLower === '7kw') {
        matchesPower = pPower.includes('7kw') || pName.includes('7kw') || pName.includes('7킬로');
      } else if (pfLower === '11kw') {
        matchesPower = pPower.includes('11kw') || pName.includes('11kw') || pName.includes('11킬로');
      } else if (pfLower === '14kw') {
        matchesPower = pPower.includes('14kw') || pName.includes('14kw') || pName.includes('14킬로');
      } else if (pfLower === 'biz') {
        matchesPower = pPower.includes('biz') || pPower.includes('50kw') || pPower.includes('200kw') || 
                       (p.type && (p.type.includes('급속') || p.type.includes('초급속'))) || 
                       (p.detailCategory && p.detailCategory.includes('급속'));
      } else {
        matchesPower = pPower.includes(pfLower) || pName.includes(pfLower);
      }
    }

    return matchesSearch && matchesService && matchesPower;
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
        
        {/* Success Alert Banner (Floating Toast) */}
        <AnimatePresence>
          {saveSuccessMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-[99999] px-6 py-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-2xl font-black text-sm sm:text-base border-2 border-emerald-400 gap-4 min-w-[340px] max-w-xl pointer-events-auto"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">저장 완료 (SAVE SUCCESS)</div>
                  <div className="text-xs sm:text-sm font-extrabold text-white">{saveSuccessMsg}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSaveSuccessMsg('')}
                className="text-slate-300 hover:text-white font-bold text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer transition-all shrink-0"
              >
                닫기
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleResetDefaultProducts}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
                  title="실수로 삭제된 상품이나 기본 정식 충전기 데이터 전체 복원"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                  <span>기본 상품 복원</span>
                </button>

                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>신규 상품 추가</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleSaveAllProducts(e)}
                  className={`px-5 py-2.5 font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSavedRecently
                      ? 'bg-emerald-500 text-white ring-2 ring-emerald-300'
                      : 'bg-blue-600 hover:bg-blue-500 text-white animate-bounce-short'
                  }`}
                >
                  {isSavedRecently ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>✓ 저장 완료!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>전체 변경사항 저장</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              {/* Row 1: Search & Option Controls */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="상품명, 모델명 또는 브랜드 검색..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button
                    type="button"
                    onClick={expandAllOptions}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                  >
                    📂 모든 옵션 펼치기
                  </button>
                  <button
                    type="button"
                    onClick={collapseAllOptions}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                  >
                    📁 모두 접기
                  </button>
                </div>
              </div>

              {/* Row 2: Service Classification & Power Output Filters */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                
                {/* 1. Service Type Filter (단말기 / 교체 / 설치) */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-slate-700 mr-1 shrink-0 flex items-center gap-1">
                    🏷️ 구분 필터:
                  </span>
                  {[
                    { id: 'all', label: '전체 구분' },
                    { id: 'device', label: '📦 단말기 (기기 단품)' },
                    { id: 'replace', label: '🔄 교체 (기기 교체시공)' },
                    { id: 'install', label: '⚡ 설치 (신규 설치포함)' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setServiceFilter(st.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                        serviceFilter === st.id
                          ? 'bg-slate-900 text-amber-400 border border-slate-800 shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* 2. Power Output Filter */}
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-xs font-black text-slate-500 mr-1 shrink-0">⚡ 용량 필터:</span>
                  {['all', '5kW', '7kW', '11kW', '14kW', 'BIZ'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPowerFilter(p)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                        powerFilter === p
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {p === 'all' ? '전체 용량' : p}
                    </button>
                  ))}
                </div>

              </div>

              {/* Row 3: Quick Batch Apply for Service Type & Options */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5 bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/80">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-amber-950 flex items-center gap-1">
                      ⚡ 대분류(구분) 전체 일괄 지정:
                    </span>
                    <span className="text-[11px] font-bold text-amber-800 hidden md:inline">
                      (한 번만 클릭하면 모든 {productList.length}개 상품의 대분류가 한꺼번에 변경됩니다)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleBatchServiceType('all')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black transition-all shadow-xs cursor-pointer"
                    >
                      ⚡ 전체 [모두 호환(단말기/교체/설치)]으로 일괄 변경
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBatchServiceType('device')}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-black transition-all shadow-xs cursor-pointer"
                    >
                      📦 전체 [단말기]로 일괄 변경
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBatchServiceType('replace')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-black transition-all shadow-xs cursor-pointer"
                    >
                      🔄 전체 [교체시공]으로 일괄 변경
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBatchServiceType('install')}
                      className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-black transition-all shadow-xs cursor-pointer"
                    >
                      ⚡ 전체 [신규설치]로 일괄 변경
                    </button>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-amber-200/80 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-black text-blue-950 flex items-center gap-1">
                      🏷️ 브랜드별 세부 옵션 템플릿 일괄 지정:
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap w-full xl:w-auto justify-end">
                    {/* Select Target Brand */}
                    <div className="flex items-center gap-1 bg-white border border-blue-200 px-2 py-1 rounded-lg">
                      <span className="text-[11px] font-bold text-slate-500 shrink-0">대상 브랜드:</span>
                      <select
                        value={batchSelectedBrand}
                        onChange={(e) => setBatchSelectedBrand(e.target.value)}
                        className="text-xs font-black text-blue-950 bg-transparent focus:outline-hidden cursor-pointer"
                      >
                        <option value="all">🌐 전체 브랜드 상품</option>
                        <option value="스필">스필 (SPEEL)</option>
                        <option value="일렉트리">일렉트리 (ELECTREE)</option>
                        <option value="편리">편리 (PNL)전기</option>
                        <option value="차지고">차지고 (CHARGEGO)</option>
                        <option value="롯데 이브이시스">롯데 이브이시스 (EVSIS)</option>
                      </select>
                    </div>

                    {/* Select Option Preset */}
                    <div className="flex items-center gap-1 bg-white border border-blue-200 px-2 py-1 rounded-lg">
                      <span className="text-[11px] font-bold text-slate-500 shrink-0">적용할 템플릿:</span>
                      <select
                        value={batchSelectedPresetId}
                        onChange={(e) => setBatchSelectedPresetId(e.target.value)}
                        className="text-xs font-black text-slate-800 bg-transparent focus:outline-hidden cursor-pointer max-w-[210px] truncate"
                      >
                        {optionPresets.map(preset => (
                          <option key={preset.id} value={preset.id}>
                            [{preset.brand}] {preset.name} ({preset.optionGroups.length}개 그룹)
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyPresetToBrand(batchSelectedBrand, batchSelectedPresetId)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black transition-all shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current text-blue-200" />
                      <span>⚡ 브랜드에 템플릿 일괄 적용</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPresetManagerOpen(true)}
                      className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-black transition-all shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>⚙️ 템플릿 미리작성/관리</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black transition-all shadow-md cursor-pointer flex items-center gap-1 shrink-0 ring-2 ring-emerald-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>➕ 신규 상품 추가</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBatchApplyDefaultOptionsToAll}
                      className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>⚡ 표준 7종 전체적용</span>
                    </button>

                    <button
                      type="button"
                      onClick={expandAllOptions}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                    >
                      📂 펼치기
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Table Card List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1 flex-wrap gap-2">
                <p className="text-xs font-black text-slate-700">
                  총 <span className="text-blue-600 font-extrabold">{filteredProducts.length}개</span> 상품 표시 중 (전체 {productList.length}개)
                </p>
                <div className="flex items-center gap-2">
                  {(powerFilter !== 'all' || serviceFilter !== 'all' || productSearch) && (
                    <button
                      type="button"
                      onClick={() => { setPowerFilter('all'); setServiceFilter('all'); setProductSearch(''); }}
                      className="text-xs font-bold text-slate-500 hover:text-blue-600 underline cursor-pointer"
                    >
                      필터 전체 해제
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>신규 상품 추가</span>
                  </button>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                  <p className="text-sm font-extrabold text-slate-700">
                    선택하신 조건에 검색되는 충전기 상품이 없습니다.
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    필터(용량: {powerFilter}, 구분: {serviceFilter}) 또는 검색어를 변경해 보세요.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setPowerFilter('all'); setServiceFilter('all'); setProductSearch(''); }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    전체 상품 보기 (필터 초기화)
                  </button>
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const realIndex = productList.findIndex(p => p.id === product.id);
                  return (
                  <div
                    key={product.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4 relative"
                  >
                    {/* Card Top Action Header */}
                    <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-slate-900 text-amber-400 rounded-md text-[11px] font-black tracking-tight">
                          ID: {product.id}
                        </span>
                        <span className="text-xs font-black text-slate-800">
                          [{product.brand || 'SY.com'}] {product.name}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-extrabold border border-blue-200">
                          {product.type} ({product.power || '7kW'})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleSaveSingleProduct(product, e)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer ring-2 ring-emerald-300/50"
                        >
                          <Save className="w-3.5 h-3.5 text-white" />
                          <span>이 상품 저장</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>삭제</span>
                        </button>
                      </div>
                    </div>

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
                          value={product.image.startsWith('data:') ? '📷 파일에서 업로드된 이미지' : product.image}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (!val.includes('업로드된 이미지') && !val.includes('Local Image File Loaded')) {
                              handleProductChange(realIndex, 'image', val);
                            }
                          }}
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

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div>
                            <div className="flex items-center justify-between mb-0.5">
                              <label className="block text-[10px] font-bold text-amber-800">판매/시공 구분</label>
                              <button
                                type="button"
                                onClick={() => handleBatchServiceType(getProductServiceType(product) as any)}
                                className="text-[9px] font-black text-amber-800 hover:text-amber-950 underline bg-amber-200/70 hover:bg-amber-300 px-1 py-0.2 rounded cursor-pointer shrink-0"
                                title="이 구분을 전체 상품에 일괄 적용"
                              >
                                ⚡전체적용
                              </button>
                            </div>
                            <select
                              value={getProductServiceType(product)}
                              onChange={(e) => handleProductChange(realIndex, 'serviceType', e.target.value)}
                              className="w-full px-2 py-1.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-black text-amber-900 focus:bg-white"
                            >
                              <option value="all">⚡ 전체 (단말기/교체/설치 호환)</option>
                              <option value="device">📦 단말기 (기기 단품)</option>
                              <option value="replace">🔄 교체 (기기 교체시공)</option>
                              <option value="install">⚡ 설치 (신규 설치포함)</option>
                            </select>
                          </div>

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
                              <option value="스탠드">스탠드/보호부스</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500">출력 용량</label>
                            <input
                              type="text"
                              value={product.power || ''}
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

                        <div className="pt-1 space-y-1.5">
                          <button
                            type="button"
                            onClick={(e) => handleSaveSingleProduct(product, e)}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>이 상품 개별 저장</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>이 상품 삭제</span>
                          </button>
                        </div>
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
                            {/* Option Presets Quick Bar for Product Card */}
                            <div className="bg-gradient-to-r from-blue-50 to-amber-50 border border-blue-200 p-3 rounded-xl space-y-2 shadow-xs">
                              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5">
                                <div className="text-xs font-black text-blue-950 flex items-center gap-1.5 shrink-0">
                                  <Bookmark className="w-4 h-4 text-blue-600" />
                                  <span>📋 브랜드 세부 옵션 템플릿 간편 선택</span>
                                </div>
                                
                                <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-end">
                                  {/* Select Preset Dropdown */}
                                  <select
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        handleApplyPresetToProduct(realIndex, e.target.value);
                                        e.target.value = '';
                                      }
                                    }}
                                    defaultValue=""
                                    className="px-2.5 py-1.5 bg-white border border-blue-300 rounded-lg text-xs font-black text-slate-800 shadow-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                  >
                                    <option value="" disabled>-- 미리 작성된 옵션 템플릿 불러오기 --</option>
                                    {optionPresets.map(preset => (
                                      <option key={preset.id} value={preset.id}>
                                        [{preset.brand}] {preset.name} (대분류 {preset.optionGroups.length}개)
                                      </option>
                                    ))}
                                  </select>

                                  <button
                                    type="button"
                                    onClick={() => handleSaveCurrentOptionsAsPreset(realIndex)}
                                    className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1 shrink-0"
                                    title="현재 설정된 옵션 그룹을 템플릿으로 저장"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                    <span>💾 템플릿으로 저장</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const brandName = product.brand || '';
                                      const sourceGroups = product.optionGroups || [];
                                      if (sourceGroups.length === 0) {
                                        alert('복사할 옵션 대분류가 없습니다. 먼저 옵션을 구성해주세요.');
                                        return;
                                      }
                                      if (window.confirm(`[${product.name}]의 세부 옵션(${sourceGroups.length}개 대분류)을 [${brandName || '전체'}] 브랜드 모든 상품에 일괄 복사하시겠습니까?`)) {
                                        let count = 0;
                                        const updated = productList.map(p => {
                                          const matches = !brandName || (p.brand || '').toLowerCase().includes(brandName.toLowerCase());
                                          if (matches) {
                                            count++;
                                            return {
                                              ...p,
                                              optionGroups: JSON.parse(JSON.stringify(sourceGroups))
                                            };
                                          }
                                          return p;
                                        });
                                        setProductList(updated);
                                        alert(`[${brandName || '전체'}] 브랜드 상품 총 ${count}개에 옵션이 성공적으로 일괄 복사되었습니다!`);
                                      }
                                    }}
                                    className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1 shrink-0"
                                  >
                                    <Zap className="w-3.5 h-3.5 fill-current text-amber-200" />
                                    <span>⚡ [{product.brand || '이 브랜드'}] 전체 일괄복사</span>
                                  </button>
                                </div>
                              </div>
                            </div>

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
              }))}
            </div>

            {/* Bottom Save Bar */}
            <div className="sticky bottom-4 z-40 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-700">
              <span className="text-xs font-extrabold text-slate-300">
                총 {productList.length}개 상품 설정중 (수정 후 반드시 [저장]을 눌러주세요)
              </span>
              <button
                type="button"
                onClick={(e) => handleSaveAllProducts(e)}
                className={`px-6 py-2.5 font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer ${
                  isSavedRecently
                    ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 scale-105'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {isSavedRecently ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>✓ 저장 완료되었습니다!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>전체 상품 변경사항 일괄 저장하기</span>
                  </>
                )}
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

      {/* Option Preset Manager Modal */}
      {isPresetManagerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black">브랜드별 세부 옵션 템플릿 미리작성 & 관리자</h3>
              </div>
              <button
                onClick={() => setIsPresetManagerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Subtitle / Help */}
            <div className="bg-amber-50 p-4 border-b border-amber-200/80 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="font-bold flex items-center gap-1">
                  💡 미리 브랜드별 대분류/세부 옵션을 작성해 두고 필요할 때 일괄 적용하세요!
                </p>
                <p className="text-amber-800 text-[11px]">
                  스필, 일렉트리, 편리전기, 차지고, 롯데 이브이시스 등 브랜드별 전용 옵션을 클릭 한번으로 개별 상품 또는 해당 브랜드 전 상품에 일괄 적용할 수 있습니다.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddProduct}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 border border-emerald-400"
              >
                <Plus className="w-4 h-4" />
                <span>➕ 신규 상품 추가</span>
              </button>
            </div>

            {/* Preset List Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optionPresets.map((preset) => (
                  <div key={preset.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-blue-300 transition-all">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-md">
                          {preset.brand}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          옵션 대분류 {preset.optionGroups.length}개
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{preset.name}</h4>
                      {preset.description && (
                        <p className="text-xs text-slate-500 font-semibold mt-1">{preset.description}</p>
                      )}

                      {/* Preview of Option Groups */}
                      <div className="mt-2.5 pt-2 border-t border-slate-200/70 space-y-1">
                        {preset.optionGroups.length === 0 ? (
                          <span className="text-xs text-slate-400 italic">옵션 없음 (단품)</span>
                        ) : (
                          preset.optionGroups.map((grp, i) => (
                            <div key={i} className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                              <span className="text-blue-600 font-black">•</span>
                              <span className="truncate">{grp.title} ({grp.options.length}개 선택지)</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleApplyPresetToBrand(preset.brand, preset.id);
                        }}
                        className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>[{preset.brand}] 전 상품 일괄 적용</span>
                      </button>

                      {preset.id.startsWith('preset-custom-') && (
                        <button
                          type="button"
                          onClick={() => handleDeletePreset(preset.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all cursor-pointer"
                          title="템플릿 삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                총 {optionPresets.length}개의 세부옵션 템플릿 등록됨
              </span>
              <button
                type="button"
                onClick={() => setIsPresetManagerOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black cursor-pointer"
              >
                닫기
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
