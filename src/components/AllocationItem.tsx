import React from 'react';
import { AllocationItem as AllocationItemType, AgeGroup } from '../types';
import { getSuggestion } from '../utils/suggestions';
import { getCurrencySymbol } from '../utils/currencyData';

interface AllocationItemProps {
  category: string;
  allocation: AllocationItemType;
  amount: number;
  age: AgeGroup;
  currency: string;
  city?: string;
  index: number;
}

export function AllocationItem({ category, allocation, amount, age, currency, city, index }: AllocationItemProps) {
  const suggestion = getSuggestion(category as any, age, city, currency);
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div 
      className="bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-2xl border border-white border-opacity-30 shadow-lg hover:bg-opacity-30 transition-all duration-300 transform hover:-translate-y-1"
      style={{
        animationDelay: `${index * 150}ms`
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-3">
          <span className="text-2xl">{allocation.emoji}</span>
          {allocation.name}
        </h3>
        <div className="bg-white bg-opacity-40 px-4 py-2 rounded-full">
          <span className="font-bold text-lg">{allocation.percentage}%</span>
        </div>
      </div>
      
      <div className="text-2xl font-bold text-yellow-300 mb-4">
        {currencySymbol}{amount.toFixed(2)} per month
      </div>
      
      <div className="text-white text-opacity-90 italic leading-relaxed">
        {suggestion}
      </div>
    </div>
  );
}