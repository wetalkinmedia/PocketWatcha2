import React, { useState, useEffect } from 'react';
import { BarChart3, Users, DollarSign, TrendingUp, Eye, Play, Download, Star, Calendar, Filter } from 'lucide-react';

interface AnalyticsDashboardProps {
  instructorId: string;
}

interface CourseAnalytics {
  courseId: string;
  courseName: string;
  students: number;
  revenue: number;
  completionRate: number;
  rating: number;
  views: number;
  enrollments: number;
  refunds: number;
}

interface OverallStats {
  totalStudents: number;
  totalRevenue: number;
  totalCourses: number;
  averageRating: number;
  totalViews: number;
  conversionRate: number;
}

export function AnalyticsDashboard({ instructorId }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [instructorId, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    
    // Mock data - in real app, fetch from API
    setTimeout(() => {
      const mockOverallStats: OverallStats = {
        totalStudents: 15420,
        totalRevenue: 89750,
        totalCourses: 8,
        averageRating: 4.7,
        totalViews: 45230,
        conversionRate: 12.5
      };

      const mockCourseAnalytics: CourseAnalytics[] = [
        {
          courseId: '1',
          courseName: 'Complete React Development Course',
          students: 8500,
          revenue: 45200,
          completionRate: 78,
          rating: 4.8,
          views: 25000,
          enrollments: 8500,
          refunds: 85
        },
        {
          courseId: '2',
          courseName: 'Advanced JavaScript Concepts',
          students: 4200,
          revenue: 28400,
          completionRate: 82,
          rating: 4.6,
          views: 12000,
          enrollments: 4200,
          refunds: 42
        },
        {
          courseId: '3',
          courseName: 'Node.js Backend Development',
          students: 2720,
          revenue: 16150,
          completionRate: 75,
          rating: 4.7,
          views: 8230,
          enrollments: 2720,
          refunds: 27
        }
      ];

      setOverallStats(mockOverallStats);
      setCourseAnalytics(mockCourseAnalytics);
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your course performance and student engagement</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Overall Stats */}
      {overallStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users size={20} className="text-blue-600" />
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(overallStats.totalStudents)}</div>
            <div className="text-sm text-green-600 mt-1">+12% from last month</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign size={20} className="text-green-600" />
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(overallStats.totalRevenue)}</div>
            <div className="text-sm text-green-600 mt-1">+18% from last month</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 size={20} className="text-purple-600" />
              </div>
              <div className="text-sm text-gray-600">Active Courses</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{overallStats.totalCourses}</div>
            <div className="text-sm text-blue-600 mt-1">2 published this month</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star size={20} className="text-yellow-600" />
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{overallStats.averageRating}</div>
            <div className="text-sm text-green-600 mt-1">+0.2 from last month</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Eye size={20} className="text-orange-600" />
              </div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(overallStats.totalViews)}</div>
            <div className="text-sm text-green-600 mt-1">+25% from last month</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingUp size={20} className="text-red-600" />
              </div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{overallStats.conversionRate}%</div>
            <div className="text-sm text-green-600 mt-1">+2.1% from last month</div>
          </div>
        </div>
      )}

      {/* Course Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Course Performance</h3>
          <p className="text-gray-600">Detailed analytics for each of your courses</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courseAnalytics.map((course) => (
                <tr key={course.courseId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{course.courseName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{formatNumber(course.students)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{formatCurrency(course.revenue)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${course.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{course.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-400 fill-current mr-1" />
                      <span className="text-gray-900">{course.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{formatNumber(course.views)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">
                      {((course.enrollments / course.views) * 100).toFixed(1)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto mb-2 text-gray-400" />
              <p>Revenue chart visualization would go here</p>
              <p className="text-sm">Integration with charting library needed</p>
            </div>
          </div>
        </div>

        {/* Student Engagement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Engagement</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <TrendingUp size={48} className="mx-auto mb-2 text-gray-400" />
              <p>Engagement chart visualization would go here</p>
              <p className="text-sm">Integration with charting library needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-gray-600">Latest student enrollments and course interactions</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { action: 'New enrollment', course: 'Complete React Development Course', time: '2 minutes ago', type: 'enrollment' },
              { action: 'Course completed', course: 'Advanced JavaScript Concepts', time: '15 minutes ago', type: 'completion' },
              { action: '5-star review', course: 'Node.js Backend Development', time: '1 hour ago', type: 'review' },
              { action: 'New enrollment', course: 'Complete React Development Course', time: '2 hours ago', type: 'enrollment' },
              { action: 'Course completed', course: 'Complete React Development Course', time: '3 hours ago', type: 'completion' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-full ${
                  activity.type === 'enrollment' ? 'bg-blue-100' :
                  activity.type === 'completion' ? 'bg-green-100' :
                  'bg-yellow-100'
                }`}>
                  {activity.type === 'enrollment' && <Users size={16} className="text-blue-600" />}
                  {activity.type === 'completion' && <Play size={16} className="text-green-600" />}
                  {activity.type === 'review' && <Star size={16} className="text-yellow-600" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.course}</div>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}