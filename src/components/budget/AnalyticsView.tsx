import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Calendar, TrendingUp, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface CategoryData {
  name: string;
  value: number;
  color: string;
  budget: number;
  percentage: number;
}

interface TrendData {
  date: string;
  amount: number;
  budget: number;
}

export function AnalyticsView() {
  const { supabaseUser } = useAuth();
  const hasCheckedRef = useRef(false);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalBudget: 0,
    avgDaily: 0,
    topCategory: ''
  });

  useEffect(() => {
    if (!supabaseUser) {
      return;
    }

    if (hasCheckedRef.current) {
      return;
    }

    hasCheckedRef.current = true;
    checkAndLoadAnalytics();
  }, [supabaseUser?.id]);

  useEffect(() => {
    if (hasProfile && supabaseUser && hasCheckedRef.current) {
      loadAnalytics();
    }
  }, [hasProfile, timeRange]);

  const checkAndLoadAnalytics = async () => {
    if (!supabaseUser) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) throw error;

      const profileComplete = data &&
        data.first_name &&
        data.last_name &&
        data.age > 0 &&
        data.salary > 0 &&
        data.zip_code &&
        data.phone_number &&
        data.relationship_status &&
        data.occupation;

      setHasProfile(!!profileComplete);

      if (profileComplete) {
        await loadAnalytics();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setHasProfile(false);
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    if (!supabaseUser) return;

    try {
      const today = new Date();
      let startDate: Date;

      switch (timeRange) {
        case 'week':
          startDate = new Date(today);
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(today.getFullYear(), 0, 1);
          break;
      }
      startDate.setHours(0, 0, 0, 0);

      const [budgetsResponse, expensesResponse] = await Promise.all([
        supabase
          .from('user_budgets')
          .select(`
            *,
            category:budget_categories(*)
          `)
          .eq('user_id', supabaseUser.id),
        supabase
          .from('expenses')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .gte('expense_date', startDate.toISOString().split('T')[0])
          .order('expense_date', { ascending: true })
      ]);

      const budgets = budgetsResponse.data || [];
      const expenses = expensesResponse.data || [];

      const categorySpending = budgets.map(budget => {
        const categoryExpenses = expenses.filter(exp => exp.category_id === budget.category_id);
        const spent = categoryExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        const budgetAmount = parseFloat(budget.monthly_amount);

        return {
          name: budget.category.name,
          value: spent,
          color: budget.category.color,
          budget: budgetAmount,
          percentage: budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0
        };
      }).filter(cat => cat.value > 0);

      setCategoryData(categorySpending);

      const dailySpending: Record<string, number> = {};
      expenses.forEach(exp => {
        const date = exp.expense_date;
        dailySpending[date] = (dailySpending[date] || 0) + parseFloat(exp.amount);
      });

      const totalBudget = budgets.reduce((sum, b) => sum + parseFloat(b.monthly_amount), 0);
      const dailyBudget = totalBudget / 30;

      const trendDataPoints: TrendData[] = [];
      const currentDate = new Date(startDate);
      const endDate = new Date(today);

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        trendDataPoints.push({
          date: dateStr,
          amount: dailySpending[dateStr] || 0,
          budget: dailyBudget
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setTrendData(trendDataPoints);

      const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      const dayCount = Math.max(1, trendDataPoints.length);
      const avgDaily = totalSpent / dayCount;

      const topCategory = categorySpending.length > 0
        ? categorySpending.reduce((max, cat) => cat.value > max.value ? cat : max, categorySpending[0]).name
        : 'None';

      setStats({
        totalSpent,
        totalBudget,
        avgDaily,
        topCategory
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    if (timeRange === 'week') {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (timeRange === 'month') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short' });
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{formatDate(payload[0].payload.date)}</p>
          <p className="text-sm text-gray-600">
            Spent: <span className="font-semibold text-blue-600">${payload[0].value.toFixed(2)}</span>
          </p>
          {payload[1] && (
            <p className="text-sm text-gray-600">
              Budget: <span className="font-semibold text-gray-700">${payload[1].value.toFixed(2)}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-8 text-center shadow-lg">
          <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <PieChartIcon size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Complete Your Profile First
          </h2>
          <p className="text-gray-700 mb-6 text-lg">
            To view financial analytics, please complete your profile with your income and personal details.
          </p>
          <div className="bg-white rounded-lg p-4 mb-6 text-left">
            <p className="font-semibold text-gray-900 mb-2">Required information:</p>
            <ul className="space-y-1 text-gray-700">
              <li>✓ First and Last Name</li>
              <li>✓ Age</li>
              <li>✓ Annual Salary</li>
              <li>✓ Zip Code</li>
              <li>✓ Phone Number</li>
              <li>✓ Relationship Status</li>
              <li>✓ Occupation</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600">
            Click your profile icon in the header to complete your profile setup.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === 'year'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Spent</span>
            <DollarSign className="text-blue-500" size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Budget</span>
            <Calendar className="text-teal-500" size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-900">${stats.totalBudget.toFixed(2)}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Avg Daily</span>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-900">${stats.avgDaily.toFixed(2)}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Top Category</span>
            <PieChartIcon className="text-orange-500" size={20} />
          </div>
          <div className="text-lg font-bold text-gray-900 truncate">{stats.topCategory}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3B82F6"
              strokeWidth={2}
              name="Spent"
              dot={{ fill: '#3B82F6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="budget"
              stroke="#9CA3AF"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Daily Budget"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Breakdown</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage.toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <PieChartIcon size={48} className="mx-auto mb-2" />
              <p>No spending data available</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Budget vs Actual</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="budget" fill="#9CA3AF" name="Budget" />
                <Bar dataKey="value" fill="#3B82F6" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <TrendingUp size={48} className="mx-auto mb-2" />
              <p>No comparison data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Details</h3>
        <div className="space-y-3">
          {categoryData.map((category) => (
            <div key={category.name} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-gray-900">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    ${category.value.toFixed(2)} / ${category.budget.toFixed(2)}
                  </div>
                  <div className={`text-xs font-semibold ${
                    category.percentage > 100 ? 'text-red-600' :
                    category.percentage > 80 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {category.percentage.toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    category.percentage > 100 ? 'bg-red-500' :
                    category.percentage > 80 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(category.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
