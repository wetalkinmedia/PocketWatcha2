import React, { useState } from 'react';
import { ArrowLeft, Save, Eye, Upload, Plus, Trash2, Settings, Play, Pause } from 'lucide-react';
import { ContentBlock, Quiz, QuizQuestion, InteractiveImage, Hotspot, DragDropActivity, DragDropItem, VideoChapter } from '../../types/course';

interface ContentBlockEditorProps {
  block: ContentBlock;
  onSave: (block: ContentBlock) => void;
  onCancel: () => void;
}

export function ContentBlockEditor({ block, onSave, onCancel }: ContentBlockEditorProps) {
  const [editingBlock, setEditingBlock] = useState<ContentBlock>(block);
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');

  const handleSave = () => {
    onSave(editingBlock);
  };

  const updateContent = (newContent: any) => {
    setEditingBlock(prev => ({
      ...prev,
      content: { ...prev.content, ...newContent }
    }));
  };

  const updateSettings = (newSettings: any) => {
    setEditingBlock(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const renderContentEditor = () => {
    switch (editingBlock.type) {
      case 'text':
        return <TextEditor content={editingBlock.content} onChange={updateContent} />;
      case 'video':
        return <VideoEditor content={editingBlock.content} onChange={updateContent} />;
      case 'image':
        return <ImageEditor content={editingBlock.content} onChange={updateContent} />;
      case 'quiz':
        return <QuizEditor content={editingBlock.content} onChange={updateContent} />;
      case 'interactive-image':
        return <InteractiveImageEditor content={editingBlock.content} onChange={updateContent} />;
      case 'drag-drop':
        return <DragDropEditor content={editingBlock.content} onChange={updateContent} />;
      case 'code':
        return <CodeEditor content={editingBlock.content} onChange={updateContent} />;
      case 'file-download':
        return <FileDownloadEditor content={editingBlock.content} onChange={updateContent} />;
      default:
        return <div className="text-gray-600">Content editor for {editingBlock.type} coming soon...</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              Edit {editingBlock.type.charAt(0).toUpperCase() + editingBlock.type.slice(1).replace('-', ' ')} Block
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              Save Block
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Eye size={18} />
              Preview
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mt-4">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'content'
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {activeTab === 'content' ? (
              renderContentEditor()
            ) : (
              <BlockSettings settings={editingBlock.settings} onChange={updateSettings} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Text Editor Component
function TextEditor({ content, onChange }: { content: any; onChange: (content: any) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Text Content</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content (HTML supported)
        </label>
        <textarea
          value={content.html || ''}
          onChange={(e) => onChange({ html: e.target.value })}
          className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          placeholder="Enter your text content here. HTML tags are supported."
        />
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Preview:</h3>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content.html || 'No content yet...' }}
        />
      </div>
    </div>
  );
}

// Video Editor Component
function VideoEditor({ content, onChange }: { content: any; onChange: (content: any) => void }) {
  const [chapters, setChapters] = useState<VideoChapter[]>(content.chapters || []);

  const addChapter = () => {
    const newChapter: VideoChapter = {
      id: `chapter-${Date.now()}`,
      title: 'New Chapter',
      startTime: 0,
      endTime: 60,
      description: ''
    };
    const updatedChapters = [...chapters, newChapter];
    setChapters(updatedChapters);
    onChange({ chapters: updatedChapters });
  };

  const updateChapter = (index: number, updatedChapter: VideoChapter) => {
    const updatedChapters = chapters.map((chapter, i) => 
      i === index ? updatedChapter : chapter
    );
    setChapters(updatedChapters);
    onChange({ chapters: updatedChapters });
  };

  const deleteChapter = (index: number) => {
    const updatedChapters = chapters.filter((_, i) => i !== index);
    setChapters(updatedChapters);
    onChange({ chapters: updatedChapters });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Video Content</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video Title
          </label>
          <input
            type="text"
            value={content.title || ''}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter video title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video URL
          </label>
          <input
            type="url"
            value={content.url || ''}
            onChange={(e) => onChange({ url: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/video.mp4"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={content.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="Video description"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={content.autoplay || false}
            onChange={(e) => onChange({ autoplay: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Autoplay</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={content.controls !== false}
            onChange={(e) => onChange({ controls: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Show Controls</span>
        </label>
      </div>

      {/* Video Chapters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Video Chapters</h3>
          <button
            onClick={addChapter}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add Chapter
          </button>
        </div>

        <div className="space-y-3">
          {chapters.map((chapter, index) => (
            <div key={chapter.id} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <input
                  type="text"
                  value={chapter.title}
                  onChange={(e) => updateChapter(index, { ...chapter, title: e.target.value })}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Chapter title"
                />
                <input
                  type="number"
                  value={chapter.startTime}
                  onChange={(e) => updateChapter(index, { ...chapter, startTime: parseInt(e.target.value) || 0 })}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Start time (seconds)"
                />
                <input
                  type="number"
                  value={chapter.endTime}
                  onChange={(e) => updateChapter(index, { ...chapter, endTime: parseInt(e.target.value) || 0 })}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="End time (seconds)"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chapter.description || ''}
                  onChange={(e) => updateChapter(index, { ...chapter, description: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Chapter description"
                />
                <button
                  onClick={() => deleteChapter(index)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Image Editor Component
function ImageEditor({ content, onChange }: { content: any; onChange: (content: any) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Image Content</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={content.url || ''}
            onChange={(e) => onChange({ url: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alt Text
          </label>
          <input
            type="text"
            value={content.alt || ''}
            onChange={(e) => onChange({ alt: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Image description for accessibility"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Caption
        </label>
        <input
          type="text"
          value={content.caption || ''}
          onChange={(e) => onChange({ caption: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Image caption"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Width
          </label>
          <input
            type="text"
            value={content.width || '100%'}
            onChange={(e) => onChange({ width: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="100% or 400px"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Height
          </label>
          <input
            type="text"
            value={content.height || 'auto'}
            onChange={(e) => onChange({ height: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="auto or 300px"
          />
        </div>
      </div>

      {content.url && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Preview:</h3>
          <img
            src={content.url}
            alt={content.alt || 'Preview'}
            className="max-w-full h-auto rounded-lg"
            style={{ width: content.width, height: content.height }}
          />
          {content.caption && (
            <p className="text-sm text-gray-600 mt-2 text-center italic">{content.caption}</p>
          )}
        </div>
      )}
    </div>
  );
}

// Quiz Editor Component
function QuizEditor({ content, onChange }: { content: any; onChange: (content: any) => void }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(content.questions || []);

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `question-${Date.now()}`,
      type: 'multiple-choice',
      question: 'New question',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 'Option 1',
      points: 1
    };
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    onChange({ questions: updatedQuestions });
  };

  const updateQuestion = (index: number, updatedQuestion: QuizQuestion) => {
    const updatedQuestions = questions.map((question, i) => 
      i === index ? updatedQuestion : question
    );
    setQuestions(updatedQuestions);
    onChange({ questions: updatedQuestions });
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    onChange({ questions: updatedQuestions });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Quiz Content</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quiz Title
          </label>
          <input
            type="text"
            value={content.title || ''}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Quiz title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Limit (minutes)
          </label>
          <input
            type="number"
            value={content.timeLimit || ''}
            onChange={(e) => onChange({ timeLimit: parseInt(e.target.value) || null })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="No limit"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={content.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={2}
          placeholder="Quiz description"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passing Score (%)
          </label>
          <input
            type="number"
            value={content.passingScore || 70}
            onChange={(e) => onChange({ passingScore: parseInt(e.target.value) || 70 })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            max="100"
          />
        </div>
        <div className="flex items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.allowRetakes !== false}
              onChange={(e) => onChange({ allowRetakes: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Allow Retakes</span>
          </label>
        </div>
        <div className="flex items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.showCorrectAnswers !== false}
              onChange={(e) => onChange({ showCorrectAnswers: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Show Correct Answers</span>
          </label>
        </div>
      </div>

      {/* Questions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
          <button
            onClick={addQuestion}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add Question
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                <button
                  onClick={() => deleteQuestion(index)}
                  className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => updateQuestion(index, { ...question, question: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your question"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Type
                    </label>
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(index, { ...question, type: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="true-false">True/False</option>
                      <option value="fill-blank">Fill in the Blank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Points
                    </label>
                    <input
                      type="number"
                      value={question.points}
                      onChange={(e) => updateQuestion(index, { ...question, points: parseInt(e.target.value) || 1 })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </div>
                </div>

                {question.type === 'multiple-choice' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer Options
                    </label>
                    <div className="space-y-2">
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctAnswer === option}
                            onChange={() => updateQuestion(index, { ...question, correctAnswer: option })}
                            className="text-blue-600"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(question.options || [])];
                              newOptions[optionIndex] = e.target.value;
                              updateQuestion(index, { ...question, options: newOptions });
                            }}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Explanation (optional)
                  </label>
                  <textarea
                    value={question.explanation || ''}
                    onChange={(e) => updateQuestion(index, { ...question, explanation: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Explain why this is the correct answer"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Interactive Image Editor Component
function InteractiveImageEditor({ content, onChange }: { content: any; onChange: (content: any) => void }) {
  const [hotspots, setHotspots] = useState<Hotspot[]>(content.hotspots || []);

  const addHotspot = () => {
    const newHotspot: Hotspot = {
      id: `hotspot-${Date.now()}`,
      x: 50,
      y: 50,
      title: 'New Hotspot',
      content: 'Hotspot content',
      type: 'info'
    };
    const updatedHotspots = [...hotspots, newHotspot];
    setHotspots(updatedHotspots);
    onChange({ hotspots: updatedHotspots });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Interactive Image</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={content.imageUrl || ''}
            onChange={(e) => onChange({ imageUrl: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={content.title || ''}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Interactive image title"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={content.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={2}
          placeholder="Instructions for users"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Hotspots</h3>
          <button
            onClick={addHotspot}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add Hotspot
          </button>
        </div>

        <div className="space-y-3">
          {hotspots.map((hotspot, index) => (
            <div key={hotspot.id} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  value={hotspot.title}
                  onChange={(e) => {
                    const updatedHotspots = hotspots.map((h, i) => 
                      i === index ? { ...h, title: e.target.value } : h
                    );
                    setHotspots(updatedHotspots);
                    onChange({ hotspots: updatedHotspots });
                  }}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Hotspot title"
                />
                <input
                  type="number"
                  value={hotspot.x}
                  onChange={(e) => {
                    const updatedHotspots = hotspots.map((h, i) => 
                      i === index ? { ...h, x: parseInt(e.target.value) || 0 } : h
                    );
                    setHotspots(updatedHotspots);
                    onChange({ hotspots: updatedHotspots });
                  }}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="X position (%)"
                  min="0"
                  max="100"
                />
                <input
                  type="number"
                  value={hotspot.y}
                  onChange={(e) => {
                    const updatedHotspots = hotspots.map((h, i) => 
                      i === index ? { ...h, y: parseInt(e.target.value) || 0 } : h
                    );
                    setHotspots(updatedHotspots);
                    onChange({ hotspots: updatedHotspots });
                  }}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Y position (%)"
                  min="0"
                  max="100"
                />
                <select
                  value={hotspot.type}
                  onChange={(e) => {
                    const updatedHotspots = hotspots.map((h, i) => 
                      i === index ? { ...h, type: e.target.value as any } : h
                    );
                    setHotspots(updatedHotspots);
                    onChange({ hotspots: updatedHotspots });
                  }}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="info">Info</option>
                  <option value="question">Question</option>
                  <option value="link">Link</option>
                  <option value="media">Media</option>
                </select>
              </div>
              <textarea
                value={hotspot.content}
                onChange={(e) => {
                  const updatedHotspots = hotspots.map((h, i) => 
                    i === index ? { ...h, content: e.target.value } : h
                  );
                  setHotspots(updatedHotspots);
                  onChange({ hotspots: updatedHotspots });
                }}
                className="w-full mt-3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Hotspot content"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Drag Drop Editor Component
function DragDropEditor({ content, onChange }: { content: any; onChange: (content: any) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Drag & Drop Activity</h2>
      <p className="text-gray-600">Drag and drop editor coming soon...</p>
    </div>
  );
}

// Code Editor Component
function CodeEditor({ content, onChange }: { content: any; onChange: (content: any) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Code Block</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={content.title || ''}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Code example title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={content.language || 'javascript'}
            onChange={(e) => onChange({ language: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="sql">SQL</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={content.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={2}
          placeholder="Explain what this code does"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Code
        </label>
        <textarea
          value={content.code || ''}
          onChange={(e) => onChange({ code: e.target.value })}
          className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          placeholder="Enter your code here..."
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={content.showLineNumbers !== false}
            onChange={(e) => onChange({ showLineNumbers: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Show Line Numbers</span>
        </label>
      </div>
    </div>
  );
}

// File Download Editor Component
function FileDownloadEditor({ content, onChange }: { content: any; onChange: (content: any) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">File Download</h2>
      <p className="text-gray-600">File download editor coming soon...</p>
    </div>
  );
}

// Block Settings Component
function BlockSettings({ settings, onChange }: { settings: any; onChange: (settings: any) => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Block Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Color
          </label>
          <input
            type="color"
            value={settings?.backgroundColor || '#ffffff'}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
            className="w-full h-10 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings?.fullWidth || false}
              onChange={(e) => onChange({ fullWidth: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Full Width</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Padding
          </label>
          <input
            type="text"
            value={settings?.padding || '16px'}
            onChange={(e) => onChange({ padding: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="16px"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Margin
          </label>
          <input
            type="text"
            value={settings?.margin || '16px 0'}
            onChange={(e) => onChange({ margin: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="16px 0"
          />
        </div>
      </div>
    </div>
  );
}