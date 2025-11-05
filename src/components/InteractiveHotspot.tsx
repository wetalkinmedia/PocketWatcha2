import React, { useState } from 'react';
import { X, Info, HelpCircle, ExternalLink, Play } from 'lucide-react';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  content: string;
  type: 'info' | 'question' | 'link' | 'media';
}

interface InteractiveHotspotProps {
  imageUrl: string;
  title: string;
  description: string;
  hotspots: Hotspot[];
}

export function InteractiveHotspot({ imageUrl, title, description, hotspots }: InteractiveHotspotProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  const getHotspotIcon = (type: string) => {
    switch (type) {
      case 'info': return Info;
      case 'question': return HelpCircle;
      case 'link': return ExternalLink;
      case 'media': return Play;
      default: return Info;
    }
  };

  const getHotspotColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-500';
      case 'question': return 'bg-green-500';
      case 'link': return 'bg-purple-500';
      case 'media': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <div className="relative inline-block">
        <img
          src={imageUrl}
          alt={title}
          className="w-full max-w-4xl rounded-lg shadow-lg"
        />
        
        {hotspots.map((hotspot, index) => {
          const Icon = getHotspotIcon(hotspot.type);
          return (
            <button
              key={hotspot.id}
              onClick={() => setSelectedHotspot(hotspot)}
              className={`absolute w-8 h-8 ${getHotspotColor(hotspot.type)} text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 animate-pulse hover:animate-none`}
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title={hotspot.title}
            >
              <Icon size={16} />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                {index + 1}
              </span>
            </button>
          );
        })}
      </div>

      {selectedHotspot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">{selectedHotspot.title}</h4>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="text-gray-700 leading-relaxed">
              {selectedHotspot.content}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedHotspot(null)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}