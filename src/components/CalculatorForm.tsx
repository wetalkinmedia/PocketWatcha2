import React from 'react';
import { AgeGroup, LivingSituation } from '../types';
import { currencies } from '../utils/currencyData';
import { cityGroups } from '../utils/cityData';

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
  onCalculate
}: CalculatorFormProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onCalculate();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      <div className="space-y-2">
        <label htmlFor="currency" className="block text-lg font-semibold text-gray-800">
          💱 Currency
        </label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 transform focus:-translate-y-1 focus:shadow-lg cursor-pointer"
        >
          {currencies.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.flag} {curr.code} - {curr.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="income" className="block text-lg font-semibold text-gray-800">
          💰 Monthly Income
        </label>
        <input
          type="number"
          id="income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your monthly income"
          min="0"
          max="999999999"
          step="0.01"
          className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 transform focus:-translate-y-1 focus:shadow-lg"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="age" className="block text-lg font-semibold text-gray-800">
          🎂 Age Group
        </label>
        <select
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value as AgeGroup | '')}
          className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 transform focus:-translate-y-1 focus:shadow-lg cursor-pointer"
        >
          <option value="">Select your age group</option>
          <option value="18-25">18-25 (Young Adult)</option>
          <option value="26-35">26-35 (Early Career)</option>
          <option value="36-45">36-45 (Mid Career)</option>
          <option value="46-55">46-55 (Pre-Retirement)</option>
          <option value="56+">56+ (Near/In Retirement)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="demographic" className="block text-lg font-semibold text-gray-800">
          🏠 Living Situation
        </label>
        <select
          id="demographic"
          value={demographic}
          onChange={(e) => setDemographic(e.target.value as LivingSituation | '')}
          className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 transform focus:-translate-y-1 focus:shadow-lg cursor-pointer"
        >
          <option value="">Select your situation</option>
          <option value="student">Student</option>
          <option value="single">Single Professional</option>
          <option value="couple">Couple (No Kids)</option>
          <option value="family">Family (With Kids)</option>
          <option value="retiree">Retiree</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="city" className="block text-lg font-semibold text-gray-800">
          🌍 Current City/Location
        </label>
        <select
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 transform focus:-translate-y-1 focus:shadow-lg cursor-pointer"
        >
          <option value="">Select your location</option>
          {cityGroups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.cities.map((cityOption) => (
                <option key={cityOption.value} value={cityOption.value}>
                  {cityOption.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <button
        type="submit"
        onClick={onCalculate}
        className="w-full py-5 px-6 bg-gradient-to-r from-purple-600 via-purple-700 to-violet-800 text-white text-xl font-bold rounded-xl hover:from-purple-700 hover:via-purple-800 hover:to-violet-900 transform hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 transition-all duration-300 uppercase tracking-wider"
      >
        Calculate My Money Magic ✨
      </button>
    </form>
  );
}