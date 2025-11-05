import React, { useState, useEffect } from 'react';
import { Save, Eye, Settings, Plus, ArrowLeft, Upload, Play, Image, FileText, HelpCircle, MousePointer, Move } from 'lucide-react';
import { Course, CourseModule, CourseLesson, ContentBlock } from '../../types/course';
import { ContentBlockEditor } from './ContentBlockEditor';
import { LessonEditor } from './LessonEditor';
import { CourseSettings } from './CourseSettings';

interface CourseEditorProps {
  course: Course;
  onSave: (course: Course) => void;
  onCancel: () => void;
}

export function CourseEditor({ course, onSave, onCancel }: CourseEditorProps) {
  const [editingCourse, setEditingCourse] = useState<Course>(course);
  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'preview'>('content');
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  useEffect(() => {
    if (autoSave) {
      const interval = setInterval(() => {
        handleSave(false);
      }, 30000); // Auto-save every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoSave, editingCourse]);

  const handleSave = (showNotification = true) => {
    const updatedCourse = {
      ...editingCourse,
      updatedAt: new Date().toISOString()
    };
    setEditingCourse(updatedCourse);
    onSave(updatedCourse);
    setLastSaved(new Date());
    
    if (showNotification) {
      // Show save notification
      console.log('Course saved successfully');
    }
  };

  const addModule = () => {
    const newModule: CourseModule = {
      id: `module-${Date.now()}`,
      title: 'New Module',
      description: 'Module description',
      lessons: [],
      completed: false,
      locked: false,
      order: editingCourse.modules.length,
      estimatedDuration: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setEditingCourse(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }));
  };

  const addLesson = (moduleId: string) => {
    const newLesson: CourseLesson = {
      id: `lesson-${Date.now()}`,
      title: 'New Lesson',
      description: 'Lesson description',
      duration: 0,
      contentBlocks: [],
      completed: false,
      locked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setEditingCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId
          ? { ...module, lessons: [...module.lessons, newLesson] }
          : module
      )
    }));
  };

  const updateModule = (updatedModule: CourseModule) => {
    setEditingCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === updatedModule.id ? updatedModule : module
      )
    }));
  };

  const updateLesson = (moduleId: string, updatedLesson: CourseLesson) => {
    setEditingCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map(lesson =>
                lesson.id === updatedLesson.id ? updatedLesson : lesson
              )
            }
          : module
      )
    }));
  };

  if (selectedLesson && selectedModule) {
    return (
      <LessonEditor
        lesson={selectedLesson}
        module={selectedModule}
        onSave={(updatedLesson) => {
          updateLesson(selectedModule.id, updatedLesson);
          setSelectedLesson(null);
          setSelectedModule(null);
        }}
        onCancel={() => {
          setSelectedLesson(null);
          setSelectedModule(null);
        }}
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
              <h1 className="text-xl font-bold text-gray-900">{editingCourse.title}</h1>
              <div className="text-sm text-gray-500">
                Last saved: {lastSaved.toLocaleTimeString()}
                {autoSave && <span className="ml-2 text-green-600">• Auto-save enabled</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="rounded"
              />
              Auto-save
            </label>
            <button
              onClick={() => handleSave()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              Save
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Eye size={18} />
              Preview
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 mt-4">
          {[
            { id: 'content', label: 'Content', icon: FileText },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'preview', label: 'Preview', icon: Eye }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'content' && (
          <div className="h-full flex">
            {/* Sidebar - Course Structure */}
            <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Course Structure</h2>
                  <button
                    onClick={addModule}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  {editingCourse.modules.length} modules • {editingCourse.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons
                </div>
              </div>

              <div className="p-4 space-y-4">
                {editingCourse.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg">
                    <div className="p-3 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) => updateModule({ ...module, title: e.target.value })}
                          className="font-semibold bg-transparent border-none outline-none flex-1"
                        />
                        <button
                          onClick={() => addLesson(module.id)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {module.lessons.length} lessons • {module.estimatedDuration} min
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            setSelectedModule(module);
                            setSelectedLesson(lesson);
                          }}
                          className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-6">
                              {moduleIndex + 1}.{lessonIndex + 1}
                            </span>
                            <span className="font-medium text-gray-900 flex-1">{lesson.title}</span>
                            <span className="text-xs text-gray-500">{lesson.duration}min</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1 ml-8">
                            {lesson.contentBlocks.length} content blocks
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
                  
                  {editingCourse.modules.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No modules yet</h3>
                      <p className="text-gray-600 mb-4">Start building your course by adding your first module.</p>
                      <button
                        onClick={addModule}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                      >
                        <Plus size={20} />
                        Add First Module
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-700">{editingCourse.modules.length}</div>
                          <div className="text-sm text-blue-600">Modules</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-700">
                            {editingCourse.modules.reduce((total, module) => total + module.lessons.length, 0)}
                          </div>
                          <div className="text-sm text-green-600">Lessons</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-purple-700">
                            {editingCourse.modules.reduce((total, module) => 
                              total + module.lessons.reduce((lessonTotal, lesson) => lessonTotal + lesson.contentBlocks.length, 0), 0
                            )}
                          </div>
                          <div className="text-sm text-purple-600">Content Blocks</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-orange-700">
                            {editingCourse.modules.reduce((total, module) => total + module.estimatedDuration, 0)}
                          </div>
                          <div className="text-sm text-orange-600">Minutes</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <button
                            onClick={addModule}
                            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                          >
                            <Plus size={24} className="mx-auto mb-2 text-gray-400" />
                            <div className="text-sm font-medium text-gray-700">Add Module</div>
                          </button>
                          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center">
                            <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                            <div className="text-sm font-medium text-gray-700">Upload Media</div>
                          </button>
                          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center">
                            <HelpCircle size={24} className="mx-auto mb-2 text-gray-400" />
                            <div className="text-sm font-medium text-gray-700">Add Quiz</div>
                          </button>
                          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center">
                            <MousePointer size={24} className="mx-auto mb-2 text-gray-400" />
                            <div className="text-sm font-medium text-gray-700">Interactive</div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="h-full overflow-y-auto p-6">
            <CourseSettings
              course={editingCourse}
              onUpdate={setEditingCourse}
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Preview</h2>
                <p className="text-gray-600">Preview functionality coming soon...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}