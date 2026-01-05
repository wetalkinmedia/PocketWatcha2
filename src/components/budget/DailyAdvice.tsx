import React, { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, Award, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface Advice {
  type: 'success' | 'warning' | 'info' | 'achievement';
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: string;
}

export function DailyAdvice() {
  const { supabaseUser } = useAuth();
  const [advice, setAdvice] = useState<Advice[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const loadedRef = React.useRef(false);

  useEffect(() => {
    if (!supabaseUser?.id) {
      setLoading(false);
      setHasProfile(false);
      loadedRef.current = false;
      return;
    }

    if (loadedRef.current) return;
    loadedRef.current = true;
    checkAndGenerateAdvice();
  }, [supabaseUser?.id]);

  const checkAndGenerateAdvice = async () => {
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
        await generateAdvice();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      setHasProfile(false);
      setLoading(false);
    }
  };

  const generateAdvice = async () => {
    if (!supabaseUser) return;

    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfWeek = new Date(today);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

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
          .gte('expense_date', startOfMonth.toISOString().split('T')[0])
      ]);

      const budgets = budgetsResponse.data || [];
      const expenses = expensesResponse.data || [];

      const adviceList: Advice[] = [];

      if (budgets.length === 0) {
        adviceList.push({
          type: 'info',
          icon: <Lightbulb size={24} />,
          title: 'Get Started',
          message: 'Set up your monthly budget to start tracking your financial progress and receive personalized insights.',
          action: 'Create Budget'
        });
        setAdvice(adviceList);
        setLoading(false);
        return;
      }

      const weekExpenses = expenses.filter(
        exp => exp.expense_date >= startOfWeek.toISOString().split('T')[0]
      );
      const weekTotal = weekExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      const weeklyBudget = budgets.reduce((sum, b) => sum + parseFloat(b.monthly_amount), 0) / 4;

      if (weekTotal < weeklyBudget * 0.8) {
        const savedAmount = weeklyBudget - weekTotal;
        adviceList.push({
          type: 'success',
          icon: <TrendingUp size={24} />,
          title: 'Great Job!',
          message: `You're ${((1 - weekTotal / weeklyBudget) * 100).toFixed(0)}% under budget this week! You've saved $${savedAmount.toFixed(2)}. Consider moving this to your savings.`,
          action: 'Add to Savings'
        });
      }

      const categorySpending = budgets.map(budget => {
        const categoryExpenses = expenses.filter(exp => exp.category_id === budget.category_id);
        const spent = categoryExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        const percentage = (spent / parseFloat(budget.monthly_amount)) * 100;
        return {
          name: budget.category.name,
          spent,
          budget: parseFloat(budget.monthly_amount),
          percentage
        };
      });

      const overBudgetCategories = categorySpending.filter(cat => cat.percentage > 100);
      if (overBudgetCategories.length > 0) {
        const category = overBudgetCategories[0];
        adviceList.push({
          type: 'warning',
          icon: <AlertTriangle size={24} />,
          title: 'Budget Alert',
          message: `Your ${category.name} spending is ${category.percentage.toFixed(0)}% of budget ($${(category.spent - category.budget).toFixed(2)} over). Consider adjusting your spending in this category.`,
          action: 'View Details'
        });
      }

      const nearLimitCategories = categorySpending.filter(
        cat => cat.percentage > 80 && cat.percentage <= 100
      );
      if (nearLimitCategories.length > 0) {
        const category = nearLimitCategories[0];
        adviceList.push({
          type: 'warning',
          icon: <AlertTriangle size={24} />,
          title: 'Approaching Limit',
          message: `You've used ${category.percentage.toFixed(0)}% of your ${category.name} budget. Only $${(category.budget - category.spent).toFixed(2)} remaining.`,
          action: 'Track Closely'
        });
      }

      const dayOfMonth = today.getDate();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const expectedSpendingPercentage = (dayOfMonth / daysInMonth) * 100;
      const totalBudget = budgets.reduce((sum, b) => sum + parseFloat(b.monthly_amount), 0);
      const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      const actualSpendingPercentage = (totalSpent / totalBudget) * 100;

      if (actualSpendingPercentage < expectedSpendingPercentage - 10) {
        adviceList.push({
          type: 'achievement',
          icon: <Award size={24} />,
          title: 'Excellent Progress!',
          message: `You're ahead of your budget timeline! At day ${dayOfMonth}, you've only spent ${actualSpendingPercentage.toFixed(0)}% of your budget (expected ${expectedSpendingPercentage.toFixed(0)}%).`,
          action: 'Keep It Up'
        });
      } else if (actualSpendingPercentage > expectedSpendingPercentage + 10) {
        adviceList.push({
          type: 'warning',
          icon: <TrendingDown size={24} />,
          title: 'Spending Above Pace',
          message: `Your spending is ${(actualSpendingPercentage - expectedSpendingPercentage).toFixed(0)}% ahead of schedule. Consider reducing discretionary spending for the rest of the month.`,
          action: 'Review Budget'
        });
      }

      const recentExpenses = expenses.slice(-10);
      const duplicateDescriptions = recentExpenses.reduce((acc, exp) => {
        acc[exp.description] = (acc[exp.description] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const frequentExpenses = Object.entries(duplicateDescriptions).filter(([_, count]) => count >= 3);
      if (frequentExpenses.length > 0) {
        const [description, count] = frequentExpenses[0];
        adviceList.push({
          type: 'info',
          icon: <Lightbulb size={24} />,
          title: 'Recurring Pattern Detected',
          message: `You've logged "${description}" ${count} times recently. Consider setting this as a recurring expense or subscription to track automatically.`,
          action: 'Learn More'
        });
      }

      const savingsBudget = budgets.find(b => b.category.name === 'Savings');
      if (savingsBudget) {
        const savingsExpenses = expenses.filter(exp => exp.category_id === savingsBudget.category_id);
        const savedAmount = savingsExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        const savingsGoal = parseFloat(savingsBudget.monthly_amount);
        const savingsProgress = (savedAmount / savingsGoal) * 100;

        if (savingsProgress >= 100) {
          adviceList.push({
            type: 'achievement',
            icon: <CheckCircle size={24} />,
            title: 'Savings Goal Achieved!',
            message: `Congratulations! You've reached your monthly savings goal of $${savingsGoal.toFixed(2)}. Keep up the great work!`,
            action: 'Celebrate'
          });
        }
      }

      if (adviceList.length === 0) {
        adviceList.push({
          type: 'success',
          icon: <CheckCircle size={24} />,
          title: 'On Track',
          message: 'Your spending is well-balanced and within budget. Keep up the good financial habits!',
          action: 'View Analytics'
        });
      }

      setAdvice(adviceList);
    } catch (error) {
      console.error('Error generating advice:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'warning':
        return 'from-yellow-50 to-orange-50 border-yellow-200';
      case 'achievement':
        return 'from-purple-50 to-pink-50 border-purple-200';
      default:
        return 'from-blue-50 to-cyan-50 border-blue-200';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'achievement':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
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
            <Lightbulb size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Complete Your Profile First
          </h2>
          <p className="text-gray-700 mb-6 text-lg">
            To receive personalized financial advice, please complete your profile with your income and personal details.
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Daily Financial Insights</h2>
        <button
          onClick={() => {
            setLoading(true);
            generateAdvice();
          }}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid gap-6">
        {advice.map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${getBackgroundColor(item.type)} border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300`}
          >
            <div className="flex items-start gap-4">
              <div className={`${getIconColor(item.type)} p-3 rounded-lg flex-shrink-0`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-700 mb-3">{item.message}</p>
                {item.action && (
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    {item.action} →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Financial Tips</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Review Daily</h4>
            <p className="text-sm text-gray-600">
              Check your spending every morning to stay aware of your financial habits and catch overspending early.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Use Cash Envelopes</h4>
            <p className="text-sm text-gray-600">
              For categories you overspend in, try the cash envelope method to physically limit your spending.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Automate Savings</h4>
            <p className="text-sm text-gray-600">
              Set up automatic transfers to savings on payday. Pay yourself first before spending on anything else.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Track Every Dollar</h4>
            <p className="text-sm text-gray-600">
              Small purchases add up. Track every expense, no matter how small, to see your true spending patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
