import React, { useState, useEffect } from 'react';
import { X, Play, CheckCircle, Clock, Users, Star, Award, BookOpen, ArrowRight } from 'lucide-react';
import { InteractiveHotspot } from './InteractiveHotspot';
import { DragDropActivity } from './DragDropActivity';
import { InteractiveQuiz } from './InteractiveQuiz';
import { Course, CourseModule, CourseLesson } from '../types/index';
import { allCourses } from '../data/courses';
import { CheckoutModal } from './CheckoutModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface CoursePlatformProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CoursePlatform({ isOpen, onClose }: CoursePlatformProps) {
  const { supabaseUser } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (supabaseUser && isOpen) {
      loadEnrollments();
    }
  }, [supabaseUser, isOpen]);

  const loadEnrollments = async () => {
    if (!supabaseUser) return;

    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('course_id')
        .eq('user_id', supabaseUser.id);

      if (data) {
        setEnrolledCourses(new Set(data.map(e => e.course_id)));
      }
    } catch (error) {
      console.error('Error loading enrollments:', error);
    }
  };

  if (!isOpen) return null;

  const handleEnroll = async (courseId: string) => {
    if (!supabaseUser) return;

    try {
      await supabase.from('course_enrollments').insert({
        user_id: supabaseUser.id,
        course_id: courseId,
        progress_percentage: 0
      });

      setEnrolledCourses(prev => new Set([...prev, courseId]));
      const course = allCourses.find(c => c.id === courseId);
      if (course) {
        setSelectedCourse({ ...course, enrolled: true });
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const handlePurchaseClick = (course: Course) => {
    if (course.price === 0) {
      handleEnroll(course.id);
    } else {
      setCheckoutCourse(course);
      setShowCheckout(true);
    }
  };

  const handlePurchaseComplete = (courseId: string) => {
    handleEnroll(courseId);
    setShowCheckout(false);
    setCheckoutCourse(null);
  };

  const handleLessonComplete = async (lessonId: string) => {
    if (!selectedModule || !selectedCourse || !supabaseUser) return;

    try {
      await supabase.from('lesson_progress').upsert({
        user_id: supabaseUser.id,
        course_id: selectedCourse.id,
        module_id: selectedModule.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,lesson_id'
      });

      const updatedLessons = selectedModule.lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      );
      setSelectedModule({ ...selectedModule, lessons: updatedLessons });

      await updateCourseProgress();
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const updateCourseProgress = async () => {
    if (!selectedCourse || !supabaseUser) return;

    try {
      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('completed')
        .eq('user_id', supabaseUser.id)
        .eq('course_id', selectedCourse.id);

      const totalLessons = selectedCourse.modules.flatMap(m => m.lessons).length;
      const completedLessons = progressData?.filter(p => p.completed).length || 0;
      const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

      await supabase
        .from('course_enrollments')
        .update({
          progress_percentage: progressPercentage,
          completed_at: progressPercentage === 100 ? new Date().toISOString() : null
        })
        .eq('user_id', supabaseUser.id)
        .eq('course_id', selectedCourse.id);
    } catch (error) {
      console.error('Error updating course progress:', error);
    }
  };

  const renderCourseList = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">AI Learning Platform</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="mb-6">
        <p className="text-lg text-gray-600 mb-4">
          Master AI and Machine Learning with hands-on courses designed for real-world success
        </p>
        <div className="flex gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>500K+ Students</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500 fill-current" />
            <span>4.8 Average Rating</span>
          </div>
          <div className="flex items-center gap-1">
            <Award size={16} />
            <span>Industry Certificates</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {allCourses.map((course) => {
          const isPaidCourse = course.price > 0;
          return (
          <div
            key={course.id}
            className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative ${
              isPaidCourse
                ? 'border-4 border-yellow-400 ring-4 ring-yellow-200 scale-105'
                : 'border border-gray-200'
            }`}
          >
            {isPaidCourse && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-sm font-bold rounded-bl-xl shadow-lg z-10">
                ⭐ FEATURED COURSE
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{course.emoji}</span>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-gray-500 text-sm">({course.students})</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen size={14} />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{course.students}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {course.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {course.skills.length > 3 && (
                  <span className="text-xs text-gray-500">+{course.skills.length - 3} more</span>
                )}
              </div>

              {isPaidCourse ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-3xl font-bold text-green-600">${course.price}</div>
                    <div className="text-sm text-gray-500">Limited Time Offer</div>
                  </div>
                  <button
                    onClick={() => handlePurchaseClick(course)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 font-bold text-lg shadow-lg"
                  >
                    Buy Now - ${course.price}
                    <ArrowRight size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                  >
                    Learn More
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 font-semibold"
                >
                  View Course
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
          );
        })}
      </div>
      
      {checkoutCourse && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => {
            setShowCheckout(false);
            setCheckoutCourse(null);
          }}
          course={checkoutCourse}
          onPurchaseComplete={handlePurchaseComplete}
        />
      )}
    </div>
  );

  const renderCourseDetail = () => {
    if (!selectedCourse) return null;

    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedCourse(null)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowRight size={20} className="rotate-180" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">{selectedCourse.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-auto"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{selectedCourse.emoji}</span>
                <div>
                  <h3 className="text-2xl font-bold">{selectedCourse.title}</h3>
                  <p className="opacity-90">with {selectedCourse.instructor.name}</p>
                </div>
              </div>
              <p className="text-lg opacity-90 mb-4">{selectedCourse.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{selectedCourse.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{selectedCourse.students} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-current" />
                  <span>{selectedCourse.rating} rating</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-bold text-gray-800">Course Modules</h4>
              {selectedCourse.modules.map((module, index) => (
                <div
                  key={module.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setSelectedModule(module)}
                    className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h5 className="font-semibold text-gray-800">
                        Module {index + 1}: {module.title}
                      </h5>
                      <p className="text-gray-600 text-sm">{module.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{module.lessons.length} lessons</span>
                        <span>
                          {module.lessons.reduce((total, lesson) => 
                            total + parseInt(lesson.duration), 0
                          )} min total
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className={`bg-white rounded-xl shadow-lg p-6 ${
              selectedCourse.price > 0
                ? 'border-4 border-yellow-400 ring-4 ring-yellow-200'
                : 'border border-gray-200'
            }`}>
              {selectedCourse.price > 0 && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-2 px-4 rounded-lg mb-4 font-bold">
                  ⭐ FEATURED COURSE - LIMITED TIME
                </div>
              )}

              <div className="text-center mb-4">
                {selectedCourse.price === 0 ? (
                  <div className="text-3xl font-bold text-green-600 mb-2">FREE</div>
                ) : (
                  <div>
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      ${selectedCourse.price}
                    </div>
                    <div className="text-sm text-gray-500">One-time payment</div>
                  </div>
                )}
              </div>

              {enrolledCourses.has(selectedCourse.id) ? (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                    <CheckCircle size={20} />
                    <span className="font-semibold">Enrolled</span>
                  </div>
                  <button
                    onClick={() => setSelectedModule(selectedCourse.modules[0])}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play size={20} />
                    Continue Learning
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handlePurchaseClick(selectedCourse)}
                  className={`w-full py-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 font-bold text-lg ${
                    selectedCourse.price > 0
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                >
                  {selectedCourse.price === 0 ? 'Enroll Free' : `Buy Now - $${selectedCourse.price}`}
                </button>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h5 className="font-bold text-gray-800 mb-3">What you'll learn:</h5>
              <ul className="space-y-2">
                {selectedCourse.skills.map((skill, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedCourse.certificate && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Award size={20} />
                  <span className="font-semibold">Certificate Included</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Earn a professional certificate upon completion
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderModuleDetail = () => {
    if (!selectedModule) return null;

    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedModule(null)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowRight size={20} className="rotate-180" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">{selectedModule.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-auto"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-600">{selectedModule.description}</p>
        </div>

        <div className="space-y-4">
          <h4 className="text-xl font-bold text-gray-800">Lessons</h4>
          {selectedModule.lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setSelectedLesson(lesson)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800">{lesson.title}</h5>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{lesson.duration}</span>
                      </div>
                      {lesson.completed && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle size={14} />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <ArrowRight size={20} className="text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLessonDetail = () => {
    if (!selectedLesson) return null;

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedLesson(null)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowRight size={20} className="rotate-180" />
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{selectedLesson.title}</h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{selectedLesson.duration}</span>
              </div>
              {selectedLesson.completed && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle size={14} />
                  <span>Completed</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              {selectedLesson.contentBlocks?.map((block, index) => (
                <div key={block.id || index} className="mb-6">
                  {block.type === 'text' && block.content.html && (
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: block.content.html.replace(/\n/g, '<br>').replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>').replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded">$1</code>') 
                      }}
                    />
                  )}
                  {block.type === 'video' && block.content.videoUrl && (
                    <video 
                      controls 
                      className="w-full rounded-lg"
                      src={block.content.videoUrl}
                    />
                  )}
                  {block.type === 'image' && block.content.imageUrl && (
                    <img 
                      src={block.content.imageUrl} 
                      alt={block.content.alt || 'Course content'} 
                      className="w-full rounded-lg"
                    />
                  )}
                  {block.type === 'code' && block.content.code && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                      {block.content.title && (
                        <div className="bg-gray-800 text-white px-4 py-2 text-sm font-semibold">
                          {block.content.title}
                        </div>
                      )}
                      {block.content.description && (
                        <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-200">
                          {block.content.description}
                        </div>
                      )}
                      <pre className="p-4 overflow-x-auto">
                        <code className="text-sm">{block.content.code}</code>
                      </pre>
                    </div>
                  )}
                  {(block.type === 'quiz' || block.type === 'interactive-image' || block.type === 'drag-drop') && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      {block.type === 'interactive-image' && (
                        <InteractiveHotspot
                          imageUrl={block.content.imageUrl || ''}
                          title={block.content.title || 'Interactive Image'}
                          description={block.content.description || ''}
                          hotspots={block.content.hotspots || []}
                        />
                      )}
                      {block.type === 'drag-drop' && (
                        <DragDropActivity
                          title={block.content.title || 'Drag & Drop Activity'}
                          instructions={block.content.instructions || ''}
                          items={block.content.items || []}
                          feedback={block.content.feedback || { correct: 'Correct!', incorrect: 'Try again!' }}
                        />
                      )}
                      {block.type === 'quiz' && (
                        <InteractiveQuiz {...block.content} lessonId={selectedLesson.id} />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Lesson {selectedModule?.lessons.findIndex(l => l.id === selectedLesson.id)! + 1} of {selectedModule?.lessons.length}
              </div>
              <div className="flex gap-3">
                {!selectedLesson.completed && (
                  <button
                    onClick={() => handleLessonComplete(selectedLesson.id)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Mark Complete
                  </button>
                )}
                <button
                  onClick={() => {
                    const currentIndex = selectedModule?.lessons.findIndex(l => l.id === selectedLesson.id) || 0;
                    const nextLesson = selectedModule?.lessons[currentIndex + 1];
                    if (nextLesson) {
                      setSelectedLesson(nextLesson);
                    }
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  disabled={!selectedModule?.lessons.find((_, index) => index > selectedModule.lessons.findIndex(l => l.id === selectedLesson.id))}
                >
                  Next Lesson
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-50 w-full h-full overflow-y-auto">
        {selectedLesson ? renderLessonDetail() :
         selectedModule ? renderModuleDetail() :
         selectedCourse ? renderCourseDetail() :
         renderCourseList()}
      </div>
    </div>
  );
}