/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActivePage } from '../types';
import { Info, Zap, Settings, MapPin, HelpCircle, Home } from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  categoryLabels?: {
    home: string;
    about: string;
    products: string;
    solutions: string;
    review: string;
    support: string;
  };
}

export default function Navbar({ 
  activePage, 
  onPageChange,
  categoryLabels = {
    home: '홈',
    about: '회사소개',
    products: '신제품소개',
    solutions: '용도별솔루션',
    review: '설치후기',
    support: '고객지원'
  }
}: NavbarProps) {
  const menuItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: categoryLabels.home, icon: <Home className="w-4 h-4" /> },
    { id: 'about', label: categoryLabels.about, icon: <Info className="w-4 h-4" /> },
    { id: 'products', label: categoryLabels.products, icon: <Zap className="w-4 h-4" /> },
    { id: 'solutions', label: categoryLabels.solutions, icon: <Settings className="w-4 h-4" /> },
    { id: 'review', label: categoryLabels.review, icon: <MapPin className="w-4 h-4" /> },
    { id: 'support', label: categoryLabels.support, icon: <HelpCircle className="w-4 h-4" /> }
  ];

  return (
    <nav className="bg-white text-slate-700 py-2 sm:py-0 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-1 sm:gap-6 sm:h-12 items-center">
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                id={`btn-nav-${item.id}`}
                className={`px-3 sm:px-4 py-2 sm:py-0 sm:h-12 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600 font-black'
                    : 'border-transparent text-slate-600 hover:text-blue-600'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
