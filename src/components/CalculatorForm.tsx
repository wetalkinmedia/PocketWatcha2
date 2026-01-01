import React, { useState, useEffect, useRef } from 'react';
import { AgeGroup, LivingSituation } from '../types';
import { CurrencySelector } from './CurrencySelector';
import { AgeGroupSelector } from './AgeGroupSelector';
import { LivingSituationSelector } from './LivingSituationSelector';
import { CitySelector } from './CitySelector';

interface CalculatorFormProps {
  income: string;
  setIncome: (income: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  age: AgeGroup | '';
  setAge: (age: AgeGroup | '') => void;
  demographic: LivingSituation | '';
  setDemographic: (demographic: LivingSituation | '') => void;
  city: string;
  setCity: (city: string) => void;
  onCalculate: () => void;
  onIncomeFocus?: () => void;
  onIncomeBlur?: () => void;
}

export function CalculatorForm({
  income,
  setIncome,
  currency,
  setCurrency,
  age,
  setAge,
  demographic,
  setDemographic,
  city,
  setCity,
  onCalculate,
  onIncomeFocus,
  onIncomeBlur
}: CalculatorFormProps) {
  const [localIncome, setLocalIncome] = useState(income);
  const isUserTyping = useRef(false);

  useEffect(() => {
    if (!isUserTyping.current) {
      setLocalIncome(income);
    }
  }, [income]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onCalculate();
    }
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalIncome(e.target.value);
  };

  const handleIncomeFocusEvent = () => {
    console.log('CalculatorForm: Income focus event');
    isUserTyping.current = true;
    onIncomeFocus?.();
  };

  const handleIncomeBlurEvent = () => {
    console.log('CalculatorForm: Income blur event');
    isUserTyping.current = false;
    const cleaned = localIncome.replace(/\.$/, '');
    setIncome(cleaned);
    onIncomeBlur?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIncome(localIncome);
    onCalculate();
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      <div className="space-y-2">
        <label className="block text-lg font-semibold text-gray-800">
          💱 Currency
        </label>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="space-y-2">
        <label htmlFor="income" className="block text-lg font-semibold text-gray-800">
          💰 Monthly Income
        </label>
        <input
          type="text"
          inputMode="decimal"
          id="income"
          value={localIncome}
          onChange={handleIncomeChange}
          onFocus={handleIncomeFocusEvent}
          onBlur={handleIncomeBlurEvent}
          onKeyPress={handleKeyPress}
          placeholder="Enter your monthly income (e.g., 5000)"
          className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors hover:border-blue-300"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-lg font-semibold text-gray-800">
          🎂 Age Group
        </label>
        <AgeGroupSelector value={age} onChange={setAge} />
      </div>

      <div className="space-y-2">
        <label className="block text-lg font-semibold text-gray-800">
          🏠 Living Situation
        </label>
        <LivingSituationSelector value={demographic} onChange={setDemographic} />
      </div>

      <div className="space-y-2">
        <label className="block text-lg font-semibold text-gray-800">
          🌍 Current City/Location
        </label>
        <CitySelector value={city} onChange={setCity} />
      </div>

      <button
        type="submit"
        className="w-full py-5 px-6 bg-gradient-to-r from-purple-600 via-purple-700 to-violet-800 text-white text-xl font-bold rounded-xl hover:from-purple-700 hover:via-purple-800 hover:to-violet-900 transform hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 transition-all duration-300 uppercase tracking-wider"
      >
        Calculate My Money Magic ✨
      </button>
    </form>
  );
}