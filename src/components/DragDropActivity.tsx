import React, { useState, useRef } from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface DragDropItem {
  id: string;
  content: string;
  type: 'draggable' | 'dropzone';
  correctMatches?: string[];
}

interface DragDropActivityProps {
  title: string;
  instructions: string;
  items: DragDropItem[];
  feedback: {
    correct: string;
    incorrect: string;
  };
}

export function DragDropActivity({ title, instructions, items, feedback }: DragDropActivityProps) {
  const [draggedItem, setDraggedItem] = useState<DragDropItem | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const draggableItems = items.filter(item => item.type === 'draggable');
  const dropzoneItems = items.filter(item => item.type === 'dropzone');

  const handleDragStart = (e: React.DragEvent, item: DragDropItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropzone: DragDropItem) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    const newMatches = { ...matches };
    
    // Remove any existing match for this draggable item
    Object.keys(newMatches).forEach(key => {
      if (newMatches[key] === draggedItem.id) {
        delete newMatches[key];
      }
    });
    
    // Add new match
    newMatches[dropzone.id] = draggedItem.id;
    setMatches(newMatches);
    setDraggedItem(null);

    // Check if this match is correct
    const isCorrect = draggedItem.correctMatches?.includes(dropzone.id);
    setShowFeedback(isCorrect ? 'correct' : 'incorrect');
    
    setTimeout(() => setShowFeedback(null), 2000);

    // Check if all matches are complete and correct
    const allMatched = dropzoneItems.every(dropzone => newMatches[dropzone.id]);
    const allCorrect = dropzoneItems.every(dropzone => {
      const matchedDraggable = draggableItems.find(d => d.id === newMatches[dropzone.id]);
      return matchedDraggable?.correctMatches?.includes(dropzone.id);
    });

    if (allMatched && allCorrect) {
      setIsComplete(true);
    }
  };

  const handleReset = () => {
    setMatches({});
    setShowFeedback(null);
    setIsComplete(false);
  };

  const getMatchedDraggable = (dropzoneId: string) => {
    const dragId = matches[dropzoneId];
    return draggableItems.find(item => item.id === dragId);
  };

  const isItemUsed = (itemId: string) => {
    return Object.values(matches).includes(itemId);
  };

  return (
    <div className="w-full p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{instructions}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Draggable Items */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4">Drag from here:</h4>
          <div className="space-y-3">
            {draggableItems.map(item => (
              <div
                key={item.id}
                draggable={!isItemUsed(item.id)}
                onDragStart={(e) => handleDragStart(e, item)}
                className={`p-4 rounded-lg border-2 border-dashed cursor-move transition-all duration-300 ${
                  isItemUsed(item.id)
                    ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-white border-blue-300 text-gray-800 hover:border-blue-500 hover:shadow-md transform hover:-translate-y-1'
                }`}
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>

        {/* Drop Zones */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4">Drop here:</h4>
          <div className="space-y-3">
            {dropzoneItems.map(dropzone => {
              const matchedItem = getMatchedDraggable(dropzone.id);
              const isCorrect = matchedItem?.correctMatches?.includes(dropzone.id);
              
              return (
                <div
                  key={dropzone.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, dropzone)}
                  className={`p-4 rounded-lg border-2 min-h-[60px] flex items-center justify-center transition-all duration-300 ${
                    matchedItem
                      ? isCorrect
                        ? 'bg-green-100 border-green-400 text-green-800'
                        : 'bg-red-100 border-red-400 text-red-800'
                      : 'bg-gray-50 border-gray-300 border-dashed text-gray-500 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {matchedItem ? (
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle size={20} className="text-green-600" />
                      ) : (
                        <XCircle size={20} className="text-red-600" />
                      )}
                      <span>{matchedItem.content}</span>
                    </div>
                  ) : (
                    <span>{dropzone.content}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`mt-6 p-4 rounded-lg ${
          showFeedback === 'correct' 
            ? 'bg-green-100 border border-green-300 text-green-800' 
            : 'bg-red-100 border border-red-300 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {showFeedback === 'correct' ? (
              <CheckCircle size={20} />
            ) : (
              <XCircle size={20} />
            )}
            <span className="font-semibold">
              {showFeedback === 'correct' ? feedback.correct : feedback.incorrect}
            </span>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {isComplete && (
        <div className="mt-6 p-6 bg-green-100 border border-green-300 rounded-lg text-center">
          <CheckCircle size={32} className="text-green-600 mx-auto mb-2" />
          <h4 className="text-lg font-bold text-green-800 mb-2">Congratulations! 🎉</h4>
          <p className="text-green-700">{feedback.correct}</p>
        </div>
      )}

      {/* Reset Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RotateCcw size={16} />
          Reset Activity
        </button>
      </div>
    </div>
  );
}