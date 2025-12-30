import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Save, AlertCircle, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  recommended_percentage: number;
}

interface BudgetAllocation {
  category_id: string;
  category_name: string;
  amount: number;
  percentage: number;
  color: string;
  recommended_percentage: number;
}

export function BudgetAllocator() {
  const { supabaseUser } = useAuth();
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [allocations, setAllocations] = useState<BudgetAllocation[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabaseUser) {
      loadData();
    }
  }, [supabaseUser]);

  const loadData = async () => {
    if (!supabaseUser) return;

    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('budget_categories')
        .select('*')
        .order('display_order');

      if (categoriesError) throw categoriesError;

      setCategories(categoriesData || []);

      const { data: budgetsData, error: budgetsError } = await supabase
        .from('user_budgets')
        .select(`
          *,
          category:budget_categories(*)
        `)
        .eq('user_id', supabaseUser.id);

      if (budgetsError) throw budgetsError;

      if (budgetsData && budgetsData.length > 0) {
        const total = budgetsData.reduce((sum, b) => sum + parseFloat(b.monthly_amount), 0);
        setTotalIncome(total);

        const allocs = categoriesData?.map(cat => {
          const existing = budgetsData.find(b => b.category_id === cat.id);
          return {
            category_id: cat.id,
            category_name: cat.name,
            amount: existing ? parseFloat(existing.monthly_amount) : 0,
            percentage: existing ? parseFloat(existing.percentage) : 0,
            color: cat.color,
            recommended_percentage: cat.recommended_percentage
          };
        }) || [];
        setAllocations(allocs);
      } else {
        const defaultAllocs = categoriesData?.map(cat => ({
          category_id: cat.id,
          category_name: cat.name,
          amount: 0,
          percentage: 0,
          color: cat.color,
          recommended_percentage: cat.recommended_percentage
        })) || [];
        setAllocations(defaultAllocs);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncomeChange = (value: number) => {
    setTotalIncome(value);
    const newAllocations = allocations.map(alloc => ({
      ...alloc,
      amount: (value * alloc.percentage) / 100
    }));
    setAllocations(newAllocations);
  };

  const handleAmountChange = (categoryId: string, amount: number) => {
    const newAllocations = allocations.map(alloc =>
      alloc.category_id === categoryId
        ? {
            ...alloc,
            amount,
            percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0
          }
        : alloc
    );
    setAllocations(newAllocations);
  };

  const handlePercentageChange = (categoryId: string, percentage: number) => {
    const amount = (totalIncome * percentage) / 100;
    const newAllocations = allocations.map(alloc =>
      alloc.category_id === categoryId
        ? { ...alloc, percentage, amount }
        : alloc
    );
    setAllocations(newAllocations);
  };

  const applyRecommended = () => {
    if (totalIncome === 0) {
      setSaveMessage({ type: 'error', text: 'Please enter your monthly income first' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    const newAllocations = allocations.map(alloc => ({
      ...alloc,
      percentage: alloc.recommended_percentage,
      amount: (totalIncome * alloc.recommended_percentage) / 100
    }));
    setAllocations(newAllocations);
  };

  const handleSave = async () => {
    if (!supabaseUser) return;

    if (totalIncome === 0) {
      setSaveMessage({ type: 'error', text: 'Please enter your monthly income' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    const totalPercentage = allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.1 && totalPercentage > 0) {
      setSaveMessage({
        type: 'error',
        text: `Total allocation must equal 100% (currently ${totalPercentage.toFixed(1)}%)`
      });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setSaving(true);
    try {
      const { error: deleteError } = await supabase
        .from('user_budgets')
        .delete()
        .eq('user_id', supabaseUser.id);

      if (deleteError) throw deleteError;

      const budgetsToInsert = allocations
        .filter(alloc => alloc.amount > 0)
        .map(alloc => ({
          user_id: supabaseUser.id,
          category_id: alloc.category_id,
          monthly_amount: alloc.amount,
          percentage: alloc.percentage
        }));

      if (budgetsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('user_budgets')
          .insert(budgetsToInsert);

        if (insertError) throw insertError;
      }

      setSaveMessage({ type: 'success', text: 'Budget saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving budget:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save budget. Please try again.' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const totalAllocated = allocations.reduce((sum, alloc) => sum + alloc.amount, 0);
  const totalPercentage = allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
  const remaining = totalIncome - totalAllocated;

  const chartData = allocations
    .filter(alloc => alloc.amount > 0)
    .map(alloc => ({
      name: alloc.category_name,
      value: alloc.amount,
      color: alloc.color
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Budget Allocator</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Income
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              value={totalIncome || ''}
              onChange={(e) => handleIncomeChange(parseFloat(e.target.value) || 0)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {saveMessage && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              saveMessage.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {saveMessage.type === 'success' ? (
              <CheckCircle className="text-green-500" size={20} />
            ) : (
              <AlertCircle className="text-red-500" size={20} />
            )}
            <span
              className={`font-medium ${
                saveMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {saveMessage.text}
            </span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Allocations</h3>
              <button
                onClick={applyRecommended}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <TrendingUp size={16} />
                Apply Recommended
              </button>
            </div>

            {allocations.map((alloc) => (
              <div key={alloc.category_id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: alloc.color }}
                    />
                    <span className="font-medium text-gray-900">{alloc.category_name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Recommended: {alloc.recommended_percentage}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Amount</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        value={alloc.amount || ''}
                        onChange={(e) =>
                          handleAmountChange(alloc.category_id, parseFloat(e.target.value) || 0)
                        }
                        className="w-full pl-6 pr-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Percentage</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={alloc.percentage.toFixed(1)}
                        onChange={(e) =>
                          handlePercentageChange(alloc.category_id, parseFloat(e.target.value) || 0)
                        }
                        className="w-full pr-6 pl-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
                    </div>
                  </div>
                </div>

                <input
                  type="range"
                  value={alloc.percentage}
                  onChange={(e) =>
                    handlePercentageChange(alloc.category_id, parseFloat(e.target.value))
                  }
                  className="w-full mt-3"
                  min="0"
                  max="100"
                  step="0.1"
                  style={{
                    background: `linear-gradient(to right, ${alloc.color} 0%, ${alloc.color} ${alloc.percentage}%, #e5e7eb ${alloc.percentage}%, #e5e7eb 100%)`
                  }}
                />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Allocation Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Income:</span>
                  <span className="font-semibold text-gray-900">${totalIncome.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Allocated:</span>
                  <span className="font-semibold text-gray-900">${totalAllocated.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Percentage:</span>
                  <span
                    className={`font-semibold ${
                      Math.abs(totalPercentage - 100) < 0.1
                        ? 'text-green-600'
                        : totalPercentage > 100
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {totalPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Remaining:</span>
                    <span
                      className={`font-bold text-lg ${
                        remaining >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      ${Math.abs(remaining).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {chartData.length > 0 && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `$${value.toFixed(2)}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            disabled={saving || totalIncome === 0}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Budget'}
          </button>
        </div>
      </div>
    </div>
  );
}
