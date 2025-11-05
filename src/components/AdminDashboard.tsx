import React, { useState, useEffect } from 'react';
import { Shield, Users, BookOpen, BarChart, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { CourseAuthoringDashboard } from './course-authoring/CourseAuthoringDashboard';

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalLessons: number;
  averageProgress: number;
}

export function AdminDashboard() {
  const { supabaseUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalLessons: 0,
    averageProgress: 0
  });
  const [showCourseAuthoring, setShowCourseAuthoring] = useState(false);

  useEffect(() => {
    if (supabaseUser) {
      checkAdminStatus();
    }
  }, [supabaseUser]);

  const checkAdminStatus = async () => {
    if (!supabaseUser) return;

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', supabaseUser.id)
        .maybeSingle();

      if (data) {
        setIsAdmin(true);
        loadAdminStats();
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminStats = async () => {
    try {
      const [enrollmentsRes, lessonsRes] = await Promise.all([
        supabase.from('course_enrollments').select('progress_percentage'),
        supabase.from('lessons').select('id')
      ]);

      const enrollments = enrollmentsRes.data || [];
      const lessons = lessonsRes.data || [];

      const averageProgress = enrollments.length > 0
        ? Math.round(enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) / enrollments.length)
        : 0;

      setStats({
        totalUsers: 0,
        totalCourses: 3,
        totalEnrollments: enrollments.length,
        totalLessons: lessons.length,
        averageProgress
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <Shield size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            You do not have administrator privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (showCourseAuthoring) {
    return <CourseAuthoringDashboard onBack={() => setShowCourseAuthoring(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Shield className="text-blue-600" size={32} />
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage courses, users, and platform analytics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <Users className="text-blue-500" size={24} />
              <span className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</span>
            </div>
            <p className="text-sm text-gray-600">Total Enrollments</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="text-green-500" size={24} />
              <span className="text-2xl font-bold text-gray-900">{stats.totalCourses}</span>
            </div>
            <p className="text-sm text-gray-600">Active Courses</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="text-purple-500" size={24} />
              <span className="text-2xl font-bold text-gray-900">{stats.totalLessons}</span>
            </div>
            <p className="text-sm text-gray-600">Total Lessons</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <BarChart className="text-orange-500" size={24} />
              <span className="text-2xl font-bold text-gray-900">{stats.averageProgress}%</span>
            </div>
            <p className="text-sm text-gray-600">Avg Progress</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Content Management</h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowCourseAuthoring(true)}
                className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <Plus className="text-blue-600 group-hover:scale-110 transition-transform" size={24} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Create New Lesson</div>
                  <div className="text-sm text-gray-600">Add content, quizzes, and activities</div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group">
                <Edit className="text-green-600 group-hover:scale-110 transition-transform" size={24} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Edit Existing Lessons</div>
                  <div className="text-sm text-gray-600">Modify course content and structure</div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all group">
                <Trash2 className="text-red-600 group-hover:scale-110 transition-transform" size={24} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Manage Courses</div>
                  <div className="text-sm text-gray-600">Archive or delete course content</div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">User Management</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group">
                <Users className="text-blue-600 group-hover:scale-110 transition-transform" size={24} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">View All Users</div>
                  <div className="text-sm text-gray-600">Monitor user activity and progress</div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group">
                <Shield className="text-purple-600 group-hover:scale-110 transition-transform" size={24} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Manage Admins</div>
                  <div className="text-sm text-gray-600">Grant or revoke admin access</div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group">
                <BarChart className="text-green-600 group-hover:scale-110 transition-transform" size={24} />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Analytics & Reports</div>
                  <div className="text-sm text-gray-600">View detailed learning analytics</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-lg font-bold mb-2">Quick Start Guide</h3>
          <ul className="space-y-2 text-sm text-blue-50">
            <li>• Use the Course Authoring tool to create lessons with text, images, videos, and quizzes</li>
            <li>• Quiz responses are automatically saved to the database for tracking</li>
            <li>• Students can view their progress on the dashboard</li>
            <li>• Monitor student activity through analytics and reports</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
