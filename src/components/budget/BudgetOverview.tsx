import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, Lightbulb, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  recommended_percentage: number;
}

interface UserBudget {
  id: string;
  category_id: string;
  monthly_amount: number;
  percentage: number;
  category: BudgetCategory;
  spent: number;
}

interface FinancialTip {
  id: string;
  title: string;
  content: string;
  category: string;
}

interface BudgetOverviewProps {
  onNavigate?: (view: string) => void;
}

export function BudgetOverview({ onNavigate }: BudgetOverviewProps) {
  const { supabaseUser, user } = useAuth();
  const hasCheckedRef = useRef(false);
  const [budgets, setBudgets] = useState<UserBudget[]>([]);
  const [currentTip, setCurrentTip] = useState<FinancialTip | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [stats, setStats] = useState({
    todayRemaining: 0,
    weeklySpending: 0,
    savingsGoal: 0,
    savingsProgress: 0
  });

  useEffect(() => {
    if (!supabaseUser) {
      setLoading(false);
      return;
    }

    if (hasCheckedRef.current) {
      return;
    }

    hasCheckedRef.current = true;
    checkProfileCompletion();
  }, [supabaseUser?.id]);

  const checkProfileCompletion = async () => {
    if (!supabaseUser) {
      setHasProfile(false);
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
        await Promise.all([
          loadBudgetData(),
          loadDailyTip()
        ]);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setHasProfile(false);
      setLoading(false);
    }
  };

  const loadBudgetData = async () => {
    if (!supabaseUser) {
      setLoading(false);
      return;
    }

    console.log('Loading budget data for user:', supabaseUser.id);
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const { data: budgetData, error: budgetError } = await supabase
        .from('user_budgets')
        .select(`
          *,
          category:budget_categories(*)
        `)
        .eq('user_id', supabaseUser.id);

      if (budgetError) {
        console.error('Budget data error:', budgetError);
        throw budgetError;
      }

      console.log('Budget data loaded:', budgetData?.length || 0, 'budgets');

      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .gte('expense_date', startOfMonth.toISOString().split('T')[0]);

      if (expensesError) throw expensesError;

      const budgetsWithSpending = budgetData?.map(budget => {
        const categoryExpenses = expensesData?.filter(
          exp => exp.category_id === budget.category_id
        ) || [];
        const spent = categoryExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        return { ...budget, spent };
      }) || [];

      setBudgets(budgetsWithSpending);

      const todayExpenses = expensesData?.filter(
        exp => exp.expense_date === today.toISOString().split('T')[0]
      ) || [];
      const todaySpent = todayExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      const dailyBudget = budgetsWithSpending.reduce((sum, b) => sum + b.monthly_amount, 0) / 30;
      const todayRemaining = dailyBudget - todaySpent;

      const weekExpenses = expensesData?.filter(
        exp => exp.expense_date >= startOfWeek.toISOString().split('T')[0]
      ) || [];
      const weeklySpending = weekExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

      const savingsBudget = budgetsWithSpending.find(b => b.category.name === 'Savings');
      const savingsGoal = savingsBudget?.monthly_amount || 0;
      const savingsProgress = savingsBudget ? (savingsBudget.spent / savingsBudget.monthly_amount) * 100 : 0;

      setStats({
        todayRemaining,
        weeklySpending,
        savingsGoal,
        savingsProgress
      });

    } catch (error) {
      console.error('Error loading budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDailyTip = async () => {
    try {
      console.log('Loading daily tip...');
      const { data, error } = await supabase
        .from('financial_tips')
        .select('*')
        .order('display_order');

      if (error) {
        console.error('Error fetching tips:', error);
        throw error;
      }

      console.log('Tips loaded:', data?.length || 0);
      if (data && data.length > 0) {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        const tipIndex = dayOfYear % data.length;
        setCurrentTip(data[tipIndex]);
        console.log('Current tip set:', data[tipIndex].title);
      }
    } catch (error) {
      console.error('Error loading tip:', error);
    }
  };

  const getProgressColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 100) return 'bg-red-500';
    if (percentage > 80) return 'bg-yellow-500';
    return 'bg-green-500';
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
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8 text-center shadow-lg">
          <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Complete Your Profile First
          </h2>
          <p className="text-gray-700 mb-6 text-lg">
            To use the budget tools, please complete your profile with your income and personal details.
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

  const totalBudget = budgets.reduce((sum, b) => sum + b.monthly_amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      {currentTip && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 text-white p-3 rounded-lg">
              <Lightbulb size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{currentTip.title}</h3>
              <p className="text-gray-700">{currentTip.content}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Money Left Today</span>
            <DollarSign className="text-blue-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ${stats.todayRemaining.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 mt-2">
            {stats.todayRemaining >= 0 ? (
              <TrendingUp className="text-green-500" size={16} />
            ) : (
              <TrendingDown className="text-red-500" size={16} />
            )}
            <span className={`text-sm ${stats.todayRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.todayRemaining >= 0 ? 'On track' : 'Over budget'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">This Week's Spending</span>
            <Calendar className="text-purple-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ${stats.weeklySpending.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Last 7 days activity
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Savings Goal</span>
            <Target className="text-green-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            ${stats.savingsGoal.toFixed(2)}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(stats.savingsProgress, 100)}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {stats.savingsProgress.toFixed(0)}% achieved
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Monthly Budget Overview</h2>
          <div className="text-right">
            <div className="text-sm text-gray-600">Total Budget</div>
            <div className="text-2xl font-bold text-gray-900">${totalBudget.toFixed(2)}</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-bold text-gray-900">
              ${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(totalSpent, totalBudget)}`}
              style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
            />
          </div>
          <div className="text-right mt-1">
            <span className={`text-sm font-medium ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(totalRemaining).toFixed(2)} {totalRemaining >= 0 ? 'remaining' : 'over budget'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.monthly_amount) * 100;
            const remaining = budget.monthly_amount - budget.spent;

            return (
              <div key={budget.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${budget.category.color}20` }}
                    >
                      <span style={{ color: budget.category.color }}>●</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{budget.category.name}</h3>
                      <p className="text-sm text-gray-600">
                        ${budget.spent.toFixed(2)} of ${budget.monthly_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(remaining).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {remaining >= 0 ? 'left' : 'over'}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(budget.spent, budget.monthly_amount)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-600">
                  <span>{percentage.toFixed(0)}% used</span>
                  <span>{budget.percentage.toFixed(0)}% of total budget</span>
                </div>
              </div>
            );
          })}
        </div>

        {budgets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <DollarSign size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Budget Set</h3>
            <p className="text-gray-600 mb-4">Set up your monthly budget to start tracking your spending</p>
            <button
              onClick={() => onNavigate?.('allocator')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Create Budget
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
