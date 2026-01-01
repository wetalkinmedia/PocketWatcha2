import React, { useState, useRef, useEffect } from 'react';
import { currencies } from '../utils/currencyData';
import { ChevronDown, Search } from 'lucide-react';

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedCurrency = currencies.find(c => c.code === value) || currencies[0];

  const filteredCurrencies = currencies.filter(curr =>
    curr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curr.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 300);
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = (currencyCode: string) => {
    onChange(currencyCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors cursor-pointer flex items-center justify-between hover:border-blue-300"
      >
        <span>
          {selectedCurrency.flag} {selectedCurrency.code} - {selectedCurrency.name}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-hidden">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search currencies..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-80">
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((curr) => (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => handleSelect(curr.code)}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`w-full px-5 py-4 text-left hover:bg-blue-50 active:bg-blue-100 transition-colors border-b border-gray-100 last:border-b-0 ${
                    curr.code === value ? 'bg-blue-100 font-semibold' : ''
                  }`}
                >
                  <span className="text-lg">
                    {curr.flag} {curr.code} - {curr.name}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                No currencies found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
