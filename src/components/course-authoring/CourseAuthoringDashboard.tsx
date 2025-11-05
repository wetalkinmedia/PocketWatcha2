import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Users, BarChart3, Settings, Upload, Play, Eye, CreditCard as Edit3, Trash2, Copy, Search, Filter, Grid2x2 as Grid, List } from 'lucide-react';
import { Course, CourseTemplate } from '../../types/course';
import { CourseEditor } from './CourseEditor';
import { MediaLibrary } from './MediaLibrary';
import { AnalyticsDashboard } from './AnalyticsDashboard';

interface CourseAuthoringDashboardProps {
  instructorId?: string;
  onClose?: () => void;
  onBack?: () => void;
}

export function CourseAuthoringDashboard({ instructorId = 'default', onClose, onBack }: CourseAuthoringDashboardProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'media' | 'analytics' | 'settings'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [templates, setTemplates] = useState<CourseTemplate[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadCourses();
    loadTemplates();
  }, [instructorId]);

  const loadCourses = async () => {
    // Mock data - in real app, fetch from API
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Complete React Development Course',
        description: 'Master React from basics to advanced concepts',
        instructor: {
          id: instructorId,
          name: 'John Smith',
          bio: 'Senior React Developer',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
          credentials: ['React Expert', '10+ Years Experience']
        },
        duration: '40 hours',
        level: 'Intermediate',
        price: 199.99,
        originalPrice: 299.99,
        rating: 4.8,
        reviewCount: 1250,
        studentCount: '15,000+',
        skills: ['React', 'JavaScript', 'Hooks', 'Context API', 'Redux'],
        modules: [],
        certificate: true,
        enrolled: false,
        progress: 0,
        emoji: '⚛️',
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Web Development',
        tags: ['React', 'Frontend', 'JavaScript'],
        language: 'English',
        subtitles: ['English', 'Spanish'],
        requirements: ['Basic JavaScript knowledge'],
        whatYouWillLearn: ['Build modern React applications', 'Master React Hooks', 'State management with Redux'],
        targetAudience: ['Frontend developers', 'JavaScript developers'],
        published: true,
        publishedAt: '2024-01-15T10:00:00Z',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: instructorId
      }
    ];
    setCourses(mockCourses);
  };

  const loadTemplates = async () => {
    // Mock templates
    const mockTemplates: CourseTemplate[] = [
      {
        id: '1',
        name: 'Programming Course Template',
        description: 'Perfect for coding bootcamps and programming courses',
        category: 'Programming',
        modules: [],
        thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300',
        estimatedSetupTime: 30
      },
      {
        id: '2',
        name: 'Business Course Template',
        description: 'Ideal for business and entrepreneurship courses',
        category: 'Business',
        modules: [],
        thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300',
        estimatedSetupTime: 25
      }
    ];
    setTemplates(mockTemplates);
  };

  const handleCreateCourse = (template?: CourseTemplate) => {
    const newCourse: Course = {
      id: Date.now().toString(),
      title: 'New Course',
      description: 'Course description',
      instructor: {
        id: instructorId,
        name: 'John Smith',
        bio: 'Course Instructor',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        credentials: []
      },
      duration: '0 hours',
      level: 'Beginner',
      price: 0,
      rating: 0,
      reviewCount: 0,
      studentCount: '0',
      skills: [],
      modules: template?.modules.map((module, index) => ({
        ...module,
        id: `module-${index}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })) || [],
      certificate: false,
      enrolled: false,
      progress: 0,
      emoji: '📚',
      thumbnail: template?.thumbnail || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: template?.category || 'General',
      tags: [],
      language: 'English',
      subtitles: [],
      requirements: [],
      whatYouWillLearn: [],
      targetAudience: [],
      published: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: instructorId
    };

    setSelectedCourse(newCourse);
    setShowCreateModal(false);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && course.published) ||
                         (filterStatus === 'draft' && !course.published);
    return matchesSearch && matchesFilter;
  });

  if (selectedCourse) {
    return (
      <CourseEditor
        course={selectedCourse}
        onSave={(updatedCourse) => {
          setCourses(prev => {
            const existing = prev.find(c => c.id === updatedCourse.id);
            if (existing) {
              return prev.map(c => c.id === updatedCourse.id ? updatedCourse : c);
            } else {
              return [...prev, updatedCourse];
            }
          });
          setSelectedCourse(null);
        }}
        onCancel={() => setSelectedCourse(null)}
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
              onClick={onBack || onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Course Authoring Studio</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Create Course
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 mt-4">
          {[
            { id: 'courses', label: 'My Courses', icon: BookOpen },
            { id: 'media', label: 'Media Library', icon: Upload },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings }
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
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Courses</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Courses Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          course.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {course.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{course.studentCount} students</span>
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit3 size={16} />
                          Edit
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                          <Copy size={16} />
                        </button>
                        <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {filteredCourses.map(course => (
                    <div key={course.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              course.published
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {course.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{course.studentCount} students</span>
                            <span>{course.duration}</span>
                            <span>Updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCourse(course)}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                          >
                            <Edit3 size={16} />
                            Edit
                          </button>
                          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                            <Copy size={16} />
                          </button>
                          <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'media' && <MediaLibrary instructorId={instructorId} />}
        {activeTab === 'analytics' && <AnalyticsDashboard instructorId={instructorId} />}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <button
                  onClick={() => handleCreateCourse()}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <Plus size={24} className="mx-auto mb-2 text-gray-400" />
                  <div className="font-semibold text-gray-700">Start from Scratch</div>
                  <div className="text-sm text-gray-500">Create a completely custom course</div>
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Or choose a template:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleCreateCourse(template)}
                      className="p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                    >
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <div className="font-semibold text-gray-900">{template.name}</div>
                      <div className="text-sm text-gray-600 mb-2">{template.description}</div>
                      <div className="text-xs text-gray-500">Setup time: ~{template.estimatedSetupTime} minutes</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}