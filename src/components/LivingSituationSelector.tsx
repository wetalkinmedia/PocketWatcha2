import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { LivingSituation } from '../types';

interface LivingSituationSelectorProps {
  value: LivingSituation | '';
  onChange: (value: LivingSituation | '') => void;
}

const situations = [
  { value: 'student' as LivingSituation, label: 'Student' },
  { value: 'single' as LivingSituation, label: 'Single Professional' },
  { value: 'couple' as LivingSituation, label: 'Couple (No Kids)' },
  { value: 'family' as LivingSituation, label: 'Family (With Kids)' },
  { value: 'retiree' as LivingSituation, label: 'Retiree' },
];

export function LivingSituationSelector({ value, onChange }: LivingSituationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canCloseRef = useRef(false);

  const selectedSituation = situations.find(s => s.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!canCloseRef.current) return;
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
      if (event.key === 'Enter' && !canCloseRef.current) {
        canCloseRef.current = true;
      }
    }

    if (isOpen) {
      canCloseRef.current = false;
      const timer = setTimeout(() => {
        canCloseRef.current = true;
      }, 600);

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timer);
        canCloseRef.current = false;
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = (situationValue: LivingSituation) => {
    onChange(situationValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors cursor-pointer flex items-center justify-between hover:border-blue-300"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {selectedSituation ? selectedSituation.label : 'Select your situation'}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden">
          <div className="overflow-y-auto overflow-x-hidden max-h-80" style={{ WebkitOverflowScrolling: 'touch' }}>
            {situations.map((situation) => (
              <button
                key={situation.value}
                type="button"
                onClick={() => handleSelect(situation.value)}
                className={`w-full px-5 py-4 text-left hover:bg-blue-50 active:bg-blue-100 transition-colors border-b border-gray-100 last:border-b-0 ${
                  situation.value === value ? 'bg-blue-100 font-semibold' : ''
                }`}
              >
                <span className="text-lg">{situation.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
