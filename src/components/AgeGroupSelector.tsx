import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { AgeGroup } from '../types';

interface AgeGroupSelectorProps {
  value: AgeGroup | '';
  onChange: (value: AgeGroup | '') => void;
}

const ageGroups = [
  { value: '18-25' as AgeGroup, label: '18-25 (Young Adult)' },
  { value: '26-35' as AgeGroup, label: '26-35 (Early Career)' },
  { value: '36-45' as AgeGroup, label: '36-45 (Mid Career)' },
  { value: '46-55' as AgeGroup, label: '46-55 (Pre-Retirement)' },
  { value: '56+' as AgeGroup, label: '56+ (Near/In Retirement)' },
];

export function AgeGroupSelector({ value, onChange }: AgeGroupSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canCloseRef = useRef(false);

  const selectedAge = ageGroups.find(a => a.value === value);

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

  const handleSelect = (ageValue: AgeGroup) => {
    onChange(ageValue);
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
          {selectedAge ? selectedAge.label : 'Select your age group'}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden">
          <div className="overflow-y-auto overflow-x-hidden max-h-80" style={{ WebkitOverflowScrolling: 'touch' }}>
            {ageGroups.map((age) => (
              <button
                key={age.value}
                type="button"
                onClick={() => handleSelect(age.value)}
                className={`w-full px-5 py-4 text-left hover:bg-blue-50 active:bg-blue-100 transition-colors border-b border-gray-100 last:border-b-0 ${
                  age.value === value ? 'bg-blue-100 font-semibold' : ''
                }`}
              >
                <span className="text-lg">{age.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
