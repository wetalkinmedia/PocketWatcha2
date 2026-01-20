import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { cityGroups } from '../utils/cityData';

interface CitySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CitySelector = React.memo(function CitySelector({ value, onChange }: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  let selectedCity = null;
  for (const group of cityGroups) {
    const city = group.cities.find(c => c.value === value);
    if (city) {
      selectedCity = city;
      break;
    }
  }

  const filteredGroups = cityGroups.map(group => ({
    ...group,
    cities: group.cities.filter(city =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.cities.length > 0);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    setTimeout(() => searchInputRef.current?.focus(), 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }, []);

  const handleSelect = useCallback((cityValue: string) => {
    onChange(cityValue);
    setIsOpen(false);
    setSearchTerm('');
  }, [onChange]);

  const handleModalClose = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors cursor-pointer flex items-center justify-between hover:border-blue-300 relative z-10"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {selectedCity ? selectedCity.name : 'Select your location'}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 pointer-events-none ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black bg-opacity-50 flex items-start justify-center pt-20 pb-20" onClick={handleModalClose}>
          <div className="relative w-full max-w-2xl mx-4 my-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search cities..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              <div className="overflow-y-auto overflow-x-hidden max-h-96" style={{ WebkitOverflowScrolling: 'touch' }}>
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => (
                    <div key={group.label}>
                      <div className="px-4 py-2 bg-gray-100 text-sm font-semibold text-gray-600 sticky top-0">
                        {group.label}
                      </div>
                      {group.cities.map((city) => (
                        <button
                          key={city.value}
                          type="button"
                          onClick={() => handleSelect(city.value)}
                          className={`w-full px-5 py-4 text-left hover:bg-blue-50 active:bg-blue-100 transition-colors border-b border-gray-100 last:border-b-0 ${
                            city.value === value ? 'bg-blue-100 font-semibold' : ''
                          }`}
                        >
                          <span className="text-lg">{city.name}</span>
                        </button>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No cities found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
