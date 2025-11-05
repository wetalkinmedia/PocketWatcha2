import React, { useState } from 'react';
import { ArrowLeft, Plus, Save, Eye, Settings, Type, Video, Image, HelpCircle, MousePointer, Move, Code, Download, Trash2 } from 'lucide-react';
import { CourseLesson, CourseModule, ContentBlock } from '../../types/course';
import { ContentBlockEditor } from './ContentBlockEditor';

interface LessonEditorProps {
  lesson: CourseLesson;
  module: CourseModule;
  onSave: (lesson: CourseLesson) => void;
  onCancel: () => void;
}

export function LessonEditor({ lesson, module, onSave, onCancel }: LessonEditorProps) {
  const [editingLesson, setEditingLesson] = useState<CourseLesson>(lesson);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<ContentBlock | null>(null);

  const contentBlockTypes = [
    { type: 'text', label: 'Text', icon: Type, description: 'Rich text content with formatting' },
    { type: 'video', label: 'Video', icon: Video, description: 'Video content with chapters and controls' },
    { type: 'image', label: 'Image', icon: Image, description: 'Images with captions and hotspots' },
    { type: 'quiz', label: 'Quiz', icon: HelpCircle, description: 'Interactive quizzes and assessments' },
    { type: 'interactive-image', label: 'Interactive Image', icon: MousePointer, description: 'Images with clickable hotspots' },
    { type: 'drag-drop', label: 'Drag & Drop', icon: Move, description: 'Interactive drag and drop activities' },
    { type: 'code', label: 'Code', icon: Code, description: 'Code snippets with syntax highlighting' },
    { type: 'file-download', label: 'File Download', icon: Download, description: 'Downloadable resources and files' }
  ];

  const addContentBlock = (type: string) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type: type as any,
      content: getDefaultContent(type),
      order: editingLesson.contentBlocks.length,
      settings: {
        fullWidth: false,
        backgroundColor: '#ffffff',
        padding: '16px',
        margin: '16px 0'
      }
    };

    setEditingLesson(prev => ({
      ...prev,
      contentBlocks: [...prev.contentBlocks, newBlock]
    }));
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'text':
        return { html: '<p>Enter your text content here...</p>' };
      case 'video':
        return { 
          url: '', 
          title: 'Video Title',
          description: 'Video description',
          chapters: [],
          autoplay: false,
          controls: true
        };
      case 'image':
        return { 
          url: '', 
          alt: 'Image description',
          caption: 'Image caption',
          width: '100%',
          height: 'auto'
        };
      case 'quiz':
        return {
          title: 'Quiz Title',
          description: 'Quiz description',
          questions: [],
          timeLimit: null,
          passingScore: 70,
          allowRetakes: true,
          showCorrectAnswers: true
        };
      case 'interactive-image':
        return {
          imageUrl: '',
          hotspots: [],
          title: 'Interactive Image',
          description: 'Click on the hotspots to learn more'
        };
      case 'drag-drop':
        return {
          title: 'Drag and Drop Activity',
          instructions: 'Drag items to their correct positions',
          items: [],
          feedback: {
            correct: 'Great job!',
            incorrect: 'Try again!'
          }
        };
      case 'code':
        return {
          code: '// Enter your code here\nconsole.log("Hello, World!");',
          language: 'javascript',
          title: 'Code Example',
          description: 'Code description',
          showLineNumbers: true,
          highlightLines: []
        };
      case 'file-download':
        return {
          files: [],
          title: 'Download Resources',
          description: 'Click to download the files'
        };
      default:
        return {};
    }
  };

  const updateContentBlock = (updatedBlock: ContentBlock) => {
    setEditingLesson(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks.map(block =>
        block.id === updatedBlock.id ? updatedBlock : block
      )
    }));
  };

  const deleteContentBlock = (blockId: string) => {
    setEditingLesson(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks.filter(block => block.id !== blockId)
    }));
  };

  const moveContentBlock = (blockId: string, direction: 'up' | 'down') => {
    const blocks = [...editingLesson.contentBlocks];
    const index = blocks.findIndex(block => block.id === blockId);
    
    if (direction === 'up' && index > 0) {
      [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]];
    } else if (direction === 'down' && index < blocks.length - 1) {
      [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
    }

    // Update order values
    blocks.forEach((block, idx) => {
      block.order = idx;
    });

    setEditingLesson(prev => ({
      ...prev,
      contentBlocks: blocks
    }));
  };

  const handleDragStart = (e: React.DragEvent, block: ContentBlock) => {
    setDraggedBlock(block);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetBlock: ContentBlock) => {
    e.preventDefault();
    
    if (!draggedBlock || draggedBlock.id === targetBlock.id) return;

    const blocks = [...editingLesson.contentBlocks];
    const draggedIndex = blocks.findIndex(block => block.id === draggedBlock.id);
    const targetIndex = blocks.findIndex(block => block.id === targetBlock.id);

    // Remove dragged block and insert at target position
    blocks.splice(draggedIndex, 1);
    blocks.splice(targetIndex, 0, draggedBlock);

    // Update order values
    blocks.forEach((block, idx) => {
      block.order = idx;
    });

    setEditingLesson(prev => ({
      ...prev,
      contentBlocks: blocks
    }));

    setDraggedBlock(null);
  };

  const handleSave = () => {
    const updatedLesson = {
      ...editingLesson,
      updatedAt: new Date().toISOString()
    };
    onSave(updatedLesson);
  };

  if (selectedBlock) {
    return (
      <ContentBlockEditor
        block={selectedBlock}
        onSave={(updatedBlock) => {
          updateContentBlock(updatedBlock);
          setSelectedBlock(null);
        }}
        onCancel={() => setSelectedBlock(null)}
      />
    );
  }

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
            <div>
              <div className="text-sm text-gray-500">{module.title}</div>
              <input
                type="text"
                value={editingLesson.title}
                onChange={(e) => setEditingLesson(prev => ({ ...prev, title: e.target.value }))}
                className="text-xl font-bold text-gray-900 bg-transparent border-none outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              Save Lesson
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Eye size={18} />
              Preview
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Content Blocks Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">Add Content Block</h2>
            <div className="space-y-2">
              {contentBlockTypes.map(blockType => (
                <button
                  key={blockType.type}
                  onClick={() => addContentBlock(blockType.type)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <blockType.icon size={20} className="text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">{blockType.label}</div>
                      <div className="text-xs text-gray-500">{blockType.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Lesson Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingLesson.description || ''}
                  onChange={(e) => setEditingLesson(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Lesson description..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration (minutes)
                </label>
                <input
                  type="number"
                  value={editingLesson.duration}
                  onChange={(e) => setEditingLesson(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Lesson Content</h2>
                  <div className="text-sm text-gray-500">
                    {editingLesson.contentBlocks.length} content blocks
                  </div>
                </div>
              </div>

              <div className="p-6">
                {editingLesson.contentBlocks.length === 0 ? (
                  <div className="text-center py-12">
                    <Type size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No content blocks yet</h3>
                    <p className="text-gray-600 mb-4">Start building your lesson by adding content blocks from the sidebar.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editingLesson.contentBlocks
                      .sort((a, b) => a.order - b.order)
                      .map((block, index) => (
                        <div
                          key={block.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, block)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, block)}
                          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-move"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="text-sm text-gray-500 font-mono">
                                {index + 1}
                              </div>
                              <div className="flex items-center gap-2">
                                {contentBlockTypes.find(type => type.type === block.type)?.icon && (
                                  React.createElement(
                                    contentBlockTypes.find(type => type.type === block.type)!.icon,
                                    { size: 16, className: "text-gray-600" }
                                  )
                                )}
                                <span className="font-medium text-gray-900">
                                  {contentBlockTypes.find(type => type.type === block.type)?.label}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => moveContentBlock(block.id, 'up')}
                                disabled={index === 0}
                                className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => moveContentBlock(block.id, 'down')}
                                disabled={index === editingLesson.contentBlocks.length - 1}
                                className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                ↓
                              </button>
                              <button
                                onClick={() => setSelectedBlock(block)}
                                className="p-1 text-blue-600 hover:text-blue-700"
                              >
                                <Settings size={16} />
                              </button>
                              <button
                                onClick={() => deleteContentBlock(block.id)}
                                className="p-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Content Preview */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            {block.type === 'text' && (
                              <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: block.content.html || 'Empty text block' }} />
                            )}
                            {block.type === 'video' && (
                              <div className="flex items-center gap-3">
                                <Video size={24} className="text-gray-600" />
                                <div>
                                  <div className="font-medium">{block.content.title || 'Untitled Video'}</div>
                                  <div className="text-sm text-gray-600">{block.content.url || 'No video URL set'}</div>
                                </div>
                              </div>
                            )}
                            {block.type === 'image' && (
                              <div className="flex items-center gap-3">
                                <Image size={24} className="text-gray-600" />
                                <div>
                                  <div className="font-medium">{block.content.caption || 'Untitled Image'}</div>
                                  <div className="text-sm text-gray-600">{block.content.url || 'No image URL set'}</div>
                                </div>
                              </div>
                            )}
                            {block.type === 'quiz' && (
                              <div className="flex items-center gap-3">
                                <HelpCircle size={24} className="text-gray-600" />
                                <div>
                                  <div className="font-medium">{block.content.title || 'Untitled Quiz'}</div>
                                  <div className="text-sm text-gray-600">{block.content.questions?.length || 0} questions</div>
                                </div>
                              </div>
                            )}
                            {!['text', 'video', 'image', 'quiz'].includes(block.type) && (
                              <div className="text-gray-600 italic">
                                {contentBlockTypes.find(type => type.type === block.type)?.description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}