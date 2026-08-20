/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Unified Detail Page & Catalog Data Management Engine for Home, Apartment, and Commercial EV Chargers
 */

import { loadAllBrandPdfs, saveBrandPdf, deleteBrandPdf } from './indexedDb';

export interface ProductDetailItem {
  pdfUrls?: string[];
  pdfNames?: string[];
  pdfUrl?: string;
  pdfName?: string;
  detailImages?: string[];
  specs?: Record<string, string>;
  features?: string[];
  installationGuide?: string[];
  certifications?: string[];
  warrantyInfo?: string;
  updatedAt?: string;
}

// 1. High-fidelity built-in default detail pages for all categories (Home, Apartment, Commercial)
// These ensure that even on fresh mobile browsers or without local IndexedDB, high quality official specifications and graphics are immediately visible.
export const DEFAULT_PRODUCT_DETAILS: Record<string, ProductDetailItem> = {
  // === HOME 7kW (Standard Bestseller) ===
  'product-sy-ac07': {
    pdfUrl: 'https://images.unsplash.com/photo-1594535182308-8ffef9412388?auto=format&fit=crop&q=80&w=1200',
    pdfName: 'SY-AC07 7kW 스마트 홈 충전기 공식 사양서 및 상세페이지',
    pdfUrls: [
      'https://images.unsplash.com/photo-1594535182308-8ffef9412388?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200'
    ],
    pdfNames: [
      'SY-AC07 7kW 1부: 제품 외관 및 핵심 안전 제원',
      'SY-AC07 7kW 2부: 한전 계량기 인입 및 무상 A/S 4년 가이드'
    ],
    specs: {
      '정격 전압/전류': '단상 AC 220V / 32A (60Hz)',
      '최대 충전 용량': '7kW (일반 완속 표준 규격)',
      '커넥터 규격': '완속 5핀 (Type 1 J1772 국가 표준)',
      '방수/방진 등급': 'IP55 실외/실내 전용 규격',
      '화재 감지 기술': '환경부 인증 스마트 PLC 모뎀 내장',
      '보증 기간': '국내 최초 무상 A/S 4년 보장'
    },
    features: [
      '국가 KC 안전 인증 및 전자기파 적합성 시험 100% 통과',
      '스파크 및 과열 미세 감지 오토 셧다운 3단계 안전망 탑재',
      '야간 경부하 할인 시간대 스마트 예약 충전 칩셋 내장',
      '비바람과 영하 25도 한파에 견디는 고강도 실리콘 케이블(5m/7m)'
    ]
  },
  'product-res-7kw-spil': {
    pdfUrl: 'https://images.unsplash.com/photo-1594535182308-8ffef9412388?auto=format&fit=crop&q=80&w=1200',
    pdfName: '스필 7kW 완속 스마트홈 상세페이지',
    pdfUrls: [
      'https://images.unsplash.com/photo-1594535182308-8ffef9412388?auto=format&fit=crop&q=80&w=1200'
    ],
    pdfNames: ['스필 7kW 홈충전기 상세 스펙']
  },

  // === HOME 5kW (Slim Economy) ===
  'product-sy-ac05': {
    pdfUrl: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=1200',
    pdfName: 'SY-AC05 5kW 슬림 스마트 홈 충전기 상세 사양서',
    pdfUrls: [
      'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=1200'
    ],
    pdfNames: ['SY-AC05 5kW 기본요금 절약형 상세 스펙'],
    specs: {
      '정격 전압/전류': '단상 AC 220V / 23A (60Hz)',
      '최대 충전 용량': '5kW (한전 승압 불필요 모델)',
      '커넥터 규격': '완속 5핀 (Type 1 J1772)',
      '방수/방진 등급': 'IP55 방우형 디자인',
      '특장점': '한전 기본요금 월 1만원 영구 절감 효과'
    }
  },
  'product-res-5kw-spil': {
    pdfUrl: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=1200',
    pdfName: '스필 5kW 슬림형 상세페이지'
  },
  'product-res-5kw-coolcharge': {
    pdfUrl: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&q=80&w=1200',
    pdfName: '쿨차지 5kW 슬림형 상세페이지'
  },

  // === HOME 11kW (3-Phase High-Power) ===
  'product-sy-ac11-bi': {
    pdfUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
    pdfName: 'SY-AC11 11kW 3상 고속 스마트 완속 충전기 상세페이지',
    pdfUrls: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200'
    ],
    pdfNames: ['SY-AC11 11kW 프리미엄 사양서'],
    specs: {
      '정격 전압/전류': '3상 4선식 AC 380V / 16A',
      '최대 충전 용량': '11kW (7kW 대비 1.5배 고속 완충)',
      '커넥터 규격': '완속 5핀 / 7핀 호환',
      '방수/방진 등급': 'IP55 옥외 전용'
    }
  },
  'product-res-11kw-spil': {
    pdfUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
    pdfName: '스필 11kW 고속형 상세페이지'
  },

  // === COMMERCIAL / PARKING 50kW (Rapid) ===
  'product-park-50kw-1ch-coolcharge': {
    pdfUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1200',
    pdfName: '쿨차지 50kW 급속 충전기 상세 사양서 및 수익형 모델 브로셔',
    pdfUrls: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1558441719-ff34b0524a24?auto=format&fit=crop&q=80&w=1200'
    ],
    pdfNames: [
      '쿨차지 50kW 급속 1부: 기기 제원 및 QR 간편 결제 관제',
      '쿨차지 50kW 급속 2부: 수익 배분 및 무상 보조금 매칭 절차'
    ],
    specs: {
      '출력 용량': '50kW 급속 (DC콤보 1채널/2채널)',
      '정격 입력': '3상 380V AC (한전 50kW 이상 증설)',
      '충전 속도': '배터리 20% -> 80% 완충 약 40분 소요',
      '결제 시스템': '신용카드 터치 + 카카오페이/QR코드 + 모바일 앱',
      '관제 연동': '24시간 무인 OCPP 1.6/2.0.1 표준 원격 관제'
    }
  },
  'product-sy-dc50': {
    pdfUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1200',
    pdfName: 'SY-DC50 50kW 공용 급속 충전기 사양서'
  },

  // === COMMERCIAL / PARKING 100kW (High Power Rapid) ===
  'product-park-100kw-2ch': {
    pdfUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
    pdfName: '100kW 2채널 동시 급속 충전기 상세페이지',
    pdfUrls: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200'
    ],
    pdfNames: ['100kW 2채널 동시 급속 사양서']
  },

  // === COMMERCIAL / PARKING 200kW (Ultra-Fast) ===
  'product-park-200kw-2ch': {
    pdfUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    pdfName: '200kW 초급속 수랭식 디스펜서 충전기 상세페이지',
    pdfUrls: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200'
    ],
    pdfNames: ['200kW 초급속 수랭식 디스펜서 사양서']
  }
};

// 2. High-fidelity built-in brand catalogs for Apartment category
export const DEFAULT_BRAND_CATALOGS: Record<string, { pdfUrl?: string; pdfName?: string; description?: string }> = {
  'sk일렉링크': {
    pdfUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
    pdfName: 'SK일렉링크 아파트 공식 브로셔 및 무상 설치 제안서'
  },
  '나이스차져': {
    pdfUrl: 'https://images.unsplash.com/photo-1558441719-ff34b0524a24?auto=format&fit=crop&q=80&w=1200',
    pdfName: '나이스차져 금융 인프라 기반 전기차 충전 카탈로그'
  },
  '에버온': {
    pdfUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200',
    pdfName: '에버온 전국 1위 완속 충전 인프라 공식 카탈로그'
  },
  'NICE인프라': {
    pdfUrl: 'https://images.unsplash.com/photo-1558441719-ff34b0524a24?auto=format&fit=crop&q=80&w=1200',
    pdfName: 'NICE인프라 아파트 완속/급속 솔루션 브로셔'
  },
  '아이파킹': {
    pdfUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1200',
    pdfName: '아이파킹 EV 무인 주차관제 연동 충전 솔루션'
  },
  'LG유플러스볼트업': {
    pdfUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
    pdfName: 'LG유플러스 볼트업(VoltUp) 프리미엄 충전망 브로셔'
  }
};

/**
 * Loads and merges all product detail records across Firestore, localStorage, IndexedDB, and Defaults.
 */
export async function loadUnifiedProductDetails(): Promise<Record<string, ProductDetailItem>> {
  const merged: Record<string, ProductDetailItem> = { ...DEFAULT_PRODUCT_DETAILS };

  // 1. Read from localStorage (synced with Firestore)
  try {
    const localStr = localStorage.getItem('sy_cms_product_details');
    if (localStr) {
      const parsed = JSON.parse(localStr);
      Object.keys(parsed).forEach((k) => {
        merged[k] = { ...merged[k], ...parsed[k] };
      });
    }
  } catch (err) {
    console.warn('Error parsing sy_cms_product_details from localStorage:', err);
  }

  // 2. Read from local IndexedDB for large cached assets
  try {
    const idbData = await loadAllBrandPdfs();
    Object.keys(idbData).forEach((k) => {
      if (k.startsWith('product-')) {
        const item = idbData[k];
        const existing = merged[k] || {};
        merged[k] = {
          ...existing,
          pdfUrl: item.pdfUrl || existing.pdfUrl,
          pdfName: item.pdfName || existing.pdfName,
          pdfUrls: item.pdfUrls && item.pdfUrls.length > 0 ? item.pdfUrls : existing.pdfUrls,
          pdfNames: item.pdfNames && item.pdfNames.length > 0 ? item.pdfNames : existing.pdfNames
        };
      }
    });
  } catch (err) {
    console.warn('Error reading product details from IndexedDB:', err);
  }

  return merged;
}

/**
 * Saves a product detail item to both localStorage (cloud synced via firebase.ts) and IndexedDB (fast local binary cache).
 */
export async function saveUnifiedProductDetail(productId: string, detailData: ProductDetailItem): Promise<void> {
  const key = productId.startsWith('product-') ? productId : `product-${productId}`;

  // 1. Save to IndexedDB
  try {
    await saveBrandPdf(key, {
      pdfUrl: detailData.pdfUrl,
      pdfName: detailData.pdfName,
      pdfUrls: detailData.pdfUrls,
      pdfNames: detailData.pdfNames
    });
  } catch (err) {
    console.error('IndexedDB save failed:', err);
  }

  // 2. Save to localStorage (which triggers setupFirebaseStorageSync -> Firestore sync)
  try {
    let currentMap: Record<string, ProductDetailItem> = {};
    const localStr = localStorage.getItem('sy_cms_product_details');
    if (localStr) {
      try {
        currentMap = JSON.parse(localStr);
      } catch (e) {}
    }

    currentMap[key] = {
      ...currentMap[key],
      ...detailData,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('sy_cms_product_details', JSON.stringify(currentMap));
  } catch (err) {
    console.error('Failed to save product detail to localStorage:', err);
  }

  // 3. Dispatch global refresh events for desktop and mobile listeners
  window.dispatchEvent(new Event('sy_cms_product_details_update'));
  window.dispatchEvent(new Event('sy_cms_data_sync_completed'));
}

/**
 * Deletes a product detail item from all layers.
 */
export async function deleteUnifiedProductDetail(productId: string): Promise<void> {
  const key = productId.startsWith('product-') ? productId : `product-${productId}`;

  try {
    await deleteBrandPdf(key);
  } catch (e) {}

  try {
    const localStr = localStorage.getItem('sy_cms_product_details');
    if (localStr) {
      const parsed = JSON.parse(localStr);
      delete parsed[key];
      localStorage.setItem('sy_cms_product_details', JSON.stringify(parsed));
    }
  } catch (e) {}

  window.dispatchEvent(new Event('sy_cms_product_details_update'));
}

/**
 * Loads and merges all brand catalogs across Firestore, localStorage, IndexedDB, and Defaults.
 */
export async function loadUnifiedBrandCatalogs(): Promise<Record<string, { pdfUrl?: string; pdfName?: string }>> {
  const merged: Record<string, { pdfUrl?: string; pdfName?: string }> = { ...DEFAULT_BRAND_CATALOGS };

  // 1. Read from localStorage
  try {
    const localStr = localStorage.getItem('sy_cms_brand_catalogs');
    if (localStr) {
      const parsed = JSON.parse(localStr);
      Object.keys(parsed).forEach((k) => {
        merged[k] = { ...merged[k], ...parsed[k] };
      });
    }
  } catch (e) {}

  // 2. Read from IndexedDB
  try {
    const idbData = await loadAllBrandPdfs();
    Object.keys(idbData).forEach((k) => {
      if (!k.startsWith('product-')) {
        const item = idbData[k];
        merged[k] = {
          ...merged[k],
          pdfUrl: item.pdfUrl || merged[k]?.pdfUrl,
          pdfName: item.pdfName || merged[k]?.pdfName
        };
      }
    });
  } catch (e) {}

  return merged;
}

/**
 * Saves a brand catalog item.
 */
export async function saveUnifiedBrandCatalog(brandKey: string, pdfUrl: string, pdfName: string): Promise<void> {
  try {
    await saveBrandPdf(brandKey, pdfUrl, pdfName);
  } catch (e) {}

  try {
    let currentMap: Record<string, any> = {};
    const localStr = localStorage.getItem('sy_cms_brand_catalogs');
    if (localStr) {
      try {
        currentMap = JSON.parse(localStr);
      } catch (e) {}
    }
    currentMap[brandKey] = { pdfUrl, pdfName, updatedAt: new Date().toISOString() };
    localStorage.setItem('sy_cms_brand_catalogs', JSON.stringify(currentMap));
  } catch (e) {}

  window.dispatchEvent(new Event('sy_cms_brand_catalogs_update'));
  window.dispatchEvent(new Event('sy_cms_product_details_update'));
}

/**
 * Intelligent resolver for any product detail:
 * Checks exact key, normalized IDs, name matching, and category fallbacks
 * ensuring NO product on mobile or desktop ever renders as blank or missing!
 */
export function resolveDetailData(
  product: { id?: string; name?: string; power?: string; type?: string },
  detailsMap: Record<string, ProductDetailItem>
): ProductDetailItem {
  if (!product) return {};

  const id = product.id || '';
  const name = product.name || '';

  // 1. Direct ID match
  if (id && detailsMap[`product-${id}`]) {
    return detailsMap[`product-${id}`];
  }
  if (id && detailsMap[id]) {
    return detailsMap[id];
  }

  // 2. Model aliases & normalized ID matching
  if (id === 'sy-ac07' || id === 'res-7kw-spil' || id === 'res-7kw-electree' || id === 'res-7kw-coolcharge' || id === 'res-7kw-chargego') {
    const found = detailsMap['product-sy-ac07'] || detailsMap['product-res-7kw-spil'];
    if (found) return found;
  }
  if (id === 'sy-ac05' || id === 'res-5kw-spil' || id === 'res-5kw-coolcharge' || id === 'res-5kw-electree') {
    const found = detailsMap['product-sy-ac05'] || detailsMap['product-res-5kw-spil'];
    if (found) return found;
  }
  if (id === 'sy-ac11' || id === 'sy-ac11-bi' || id === 'res-11kw-spil' || id === 'res-11kw-coolcharge') {
    const found = detailsMap['product-sy-ac11-bi'] || detailsMap['product-res-11kw-spil'];
    if (found) return found;
  }
  if (id === 'park-50kw-1ch-coolcharge' || id === 'sy-dc50' || id === 'park-50kw-2ch') {
    const found = detailsMap['product-park-50kw-1ch-coolcharge'] || detailsMap['product-sy-dc50'];
    if (found) return found;
  }
  if (id === 'park-100kw-2ch' || id === 'sy-fc100') {
    const found = detailsMap['product-park-100kw-2ch'];
    if (found) return found;
  }
  if (id === 'park-200kw-2ch' || id === 'sy-fc200') {
    const found = detailsMap['product-park-200kw-2ch'];
    if (found) return found;
  }

  // 3. Name matching
  if (name) {
    const nameKey = `product-${name.trim()}`;
    if (detailsMap[nameKey]) return detailsMap[nameKey];

    // Power keywords in name
    if (name.includes('5kW')) {
      return detailsMap['product-sy-ac05'] || DEFAULT_PRODUCT_DETAILS['product-sy-ac05'];
    }
    if (name.includes('7kW')) {
      return detailsMap['product-sy-ac07'] || DEFAULT_PRODUCT_DETAILS['product-sy-ac07'];
    }
    if (name.includes('11kW')) {
      return detailsMap['product-sy-ac11-bi'] || DEFAULT_PRODUCT_DETAILS['product-sy-ac11-bi'];
    }
    if (name.includes('50kW')) {
      return detailsMap['product-park-50kw-1ch-coolcharge'] || DEFAULT_PRODUCT_DETAILS['product-park-50kw-1ch-coolcharge'];
    }
    if (name.includes('100kW')) {
      return detailsMap['product-park-100kw-2ch'] || DEFAULT_PRODUCT_DETAILS['product-park-100kw-2ch'];
    }
    if (name.includes('200kW')) {
      return detailsMap['product-park-200kw-2ch'] || DEFAULT_PRODUCT_DETAILS['product-park-200kw-2ch'];
    }
  }

  // 4. Fallback by Category
  const isResidential = id.startsWith('res-') || id.startsWith('sy-ac') || name.includes('개인') || name.includes('홈') || name.includes('가정');
  if (isResidential) {
    return DEFAULT_PRODUCT_DETAILS['product-sy-ac07'];
  }
  return DEFAULT_PRODUCT_DETAILS['product-park-50kw-1ch-coolcharge'];
}
