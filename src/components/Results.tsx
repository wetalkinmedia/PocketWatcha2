import React, { useEffect, useRef } from 'react';
import { Allocations, AgeGroup } from '../types';
import { AllocationItem } from './AllocationItem';
import { getCityData } from '../utils/cityData';
import { getCurrencySymbol } from '../utils/currencyData';

interface ResultsProps {
  allocations: Allocations;
  income: number;
  age: AgeGroup;
  currency: string;
  city: string;
  show: boolean;
}

export function Results({ allocations, income, age, currency, city, show }: ResultsProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const cityData = getCityData(city);
  const currencySymbol = getCurrencySymbol(currency);

  useEffect(() => {
    if (show && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [show]);

  if (!show) return null;

  return (
    <div 
      ref={resultsRef}
      data-results="true"
      className="mt-8 mx-8 mb-8 p-8 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-2xl text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-center mb-8">
          🎯 Your Personalized Money Plan
          {cityData && (
            <div className="text-lg font-normal mt-2 opacity-90">
              Optimized for {cityData.flag} {cityData.name}
            </div>
          )}
        </h2>
        
        <div className="grid gap-6">
          {Object.entries(allocations).map(([key, allocation], index) => {
            const monthlyAmount = (income * allocation.percentage / 100);
            return (
              <AllocationItem
                key={key}
                category={key}
                allocation={allocation}
                amount={monthlyAmount}
                age={age}
                currency={currency}
                city={city}
                index={index}
              />
            );
          })}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white bg-opacity-5 rounded-full blur-3xl"></div>
    </div>
  );
}