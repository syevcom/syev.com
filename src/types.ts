/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActivePage = 'home' | 'about' | 'products' | 'solutions' | 'review' | 'support' | 'sol_residential' | 'sol_commercial' | 'sol_parking';

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'B2C' | 'B2B';
  businessNumber?: string;
  companyName?: string;
}

export interface Product {
  id: string;
  name: string;
  type: '완속' | '급속' | '초급속' | '스마트홈' | '스탠드';
  power: string;
  features: string[];
  specs: { [key: string]: string };
  image: string;
  description: string;
  plcSupported: boolean;
  price?: number;
  detailCategory?: '비공용완속' | '비공용중속' | '공용완속' | '급속' | '스탠드';
}

export interface Solution {
  id: string;
  title: string;
  category: 'Commercial' | 'Residential' | 'ParkingLot';
  subtitle: string;
  description: string;
  target: string;
  recommendedPower: string;
  benefits: string[];
  subsidyProcess: string[];
  image: string;
  detailImageUrl?: string;
  blueprintImageUrl?: string;
  recommendedProducts?: string[];
}

export interface Review {
  id: string;
  title: string;
  location: string;
  category: 'Commercial' | 'Residential' | 'ParkingLot';
  date: string;
  rating: number;
  beforeImg: string;
  afterImg: string;
  author: string;
  interview: string;
  details: string;
  coordinates: { x: number; y: number }; // Percentage for interactive visual map
  blogUrl?: string;
  isBlogImported?: boolean;
  blogName?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Booking {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  location: string;
  purpose: 'Commercial' | 'Residential' | 'ParkingLot';
  memo?: string;
  status: '접수대기' | '상담예약완료' | '시공설계중' | '시공완료';
  createdAt: string;
  estimateCost?: string;
}

export interface ASRequest {
  id: string;
  userId: string;
  productName: string;
  serialNumber?: string;
  symptom: string;
  status: '접수완료' | '기사배정' | '처리완료';
  createdAt: string;
}
