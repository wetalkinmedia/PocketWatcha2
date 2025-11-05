import React, { useState, useEffect } from 'react';
import { BookOpen, Award, TrendingUp, Clock, CheckCircle, Play, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { ProgressBar } from './ProgressBar';
import { allCourses } from '../data/courses';

interface CourseProgress {
  course_id: string;
  progress_percentage: number;
  enrolled_at: string;
  completed_at: string | null;
}

interface LessonProgressData {
  lesson_id: string;
  course_id: string;
  module_id: string;
  completed: boolean;
  last_accessed_at: string;
}

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLessonsCompleted: number;
  currentStreak: number;
  totalHoursLearned: number;
}

export function Dashboard() {
  const { supabaseUser } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<CourseProgress[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgressData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalLessonsCompleted: 0,
    currentStreak: 0,
    totalHoursLearned: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabaseUser) {
      loadDashboardData();
    }
  }, [supabaseUser]);

  const loadDashboardData = async () => {
    if (!supabaseUser) return;

    try {
      const [enrollmentsRes, progressRes] = await Promise.all([
        supabase
          .from('course_enrollments')
          .select('*')
          .eq('user_id', supabaseUser.id),
        supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', supabaseUser.id)
      ]);

      if (enrollmentsRes.data) {
        setEnrolledCourses(enrollmentsRes.data);
      }

      if (progressRes.data) {
        setLessonProgress(progressRes.data);
      }

      calculateStats(enrollmentsRes.data || [], progressRes.data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (enrollments: CourseProgress[], progress: LessonProgressData[]) => {
    const completedCourses = enrollments.filter(e => e.completed_at !== null).length;
    const inProgressCourses = enrollments.filter(e => e.completed_at === null).length;
    const totalLessonsCompleted = progress.filter(p => p.completed).length;
    const totalHoursLearned = Math.floor(totalLessonsCompleted * 0.25);

    setStats({
      totalCourses: enrollments.length,
      completedCourses,
      inProgressCourses,
      totalLessonsCompleted,
      currentStreak: 0,
      totalHoursLearned
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning Dashboard</h1>
          <p className="text-gray-600">Track your progress and continue learning</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="text-blue-500" size={24} />
              <span className="text-2xl font-bold text-gray-900">{stats.totalCourses}</span>
            </div>
            <p className="text-sm text-gray-600">Enrolled Courses</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <Award className="text-green-500" size={24} />
              <span className="text-2xl font-bold text-gray-900">{stats.completedCourses}</span>
            </div>
            <p className="text-sm text-gray-600">Courses Completed</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="text-purple-500" size={24} />
              <span className="text-2xl font-bold text-gray-900">{stats.totalLessonsCompleted}</span>
            </div>
            <p className="text-sm text-gray-600">Lessons Completed</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-orange-500" size={24} />
              <span className="text-2xl font-bold text-gray-900">{stats.totalHoursLearned}h</span>
            </div>
            <p className="text-sm text-gray-600">Hours Learned</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={24} className="text-blue-600" />
                Courses In Progress
              </h2>

              {enrolledCourses.filter(e => !e.completed_at).length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No courses in progress</p>
                  <p className="text-sm text-gray-400 mt-2">Start a course to see your progress here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses
                    .filter(e => !e.completed_at)
                    .map(enrollment => {
                      const course = allCourses.find(c => c.id === enrollment.course_id);
                      if (!course) return null;

                      const courseLessons = course.modules.flatMap(m => m.lessons);
                      const completedLessons = lessonProgress.filter(
                        p => p.course_id === course.id && p.completed
                      ).length;

                      return (
                        <div
                          key={enrollment.course_id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-3xl">{course.emoji}</div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                              <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                              <ProgressBar
                                current={completedLessons}
                                total={courseLessons.length}
                                size="md"
                              />
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Calendar size={14} />
                                  <span>Started {new Date(enrollment.enrolled_at).toLocaleDateString()}</span>
                                </div>
                                <button className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-semibold">
                                  <Play size={16} />
                                  Continue Learning
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award size={24} className="text-green-600" />
                Completed Courses
              </h2>

              {stats.completedCourses === 0 ? (
                <div className="text-center py-12">
                  <Award size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No completed courses yet</p>
                  <p className="text-sm text-gray-400 mt-2">Keep learning to earn certificates</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enrolledCourses
                    .filter(e => e.completed_at)
                    .map(enrollment => {
                      const course = allCourses.find(c => c.id === enrollment.course_id);
                      if (!course) return null;

                      return (
                        <div
                          key={enrollment.course_id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="text-2xl mb-2">{course.emoji}</div>
                          <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                          <div className="flex items-center gap-1 text-sm text-green-600 mb-2">
                            <CheckCircle size={14} />
                            <span>Completed</span>
                          </div>
                          {course.certificate && (
                            <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all text-sm font-semibold">
                              View Certificate
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Learning Streak</h3>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{stats.currentStreak}</div>
                <p className="text-blue-100">Days in a row</p>
              </div>
              <p className="text-sm text-blue-100 mt-4">
                Keep your streak alive by completing at least one lesson today!
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {lessonProgress
                  .sort((a, b) => new Date(b.last_accessed_at).getTime() - new Date(a.last_accessed_at).getTime())
                  .slice(0, 5)
                  .map((progress, index) => {
                    const course = allCourses.find(c => c.id === progress.course_id);
                    const module = course?.modules.find(m => m.id === progress.module_id);
                    const lesson = module?.lessons.find(l => l.id === progress.lesson_id);

                    if (!lesson) return null;

                    return (
                      <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                        <div className={`w-2 h-2 rounded-full mt-2 ${progress.completed ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                          <p className="text-xs text-gray-500">{course?.title}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(progress.last_accessed_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                {lessonProgress.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
