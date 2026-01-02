import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginPopup } from './components/LoginPopup';
import { UserProfile } from './components/UserProfile';
import { TestPanel } from './components/TestPanel';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { Results } from './components/Results';
import { CareerSuggestions } from './components/CareerSuggestions';
import { CoursePlatform } from './components/CoursePlatform';
import { CourseAuthoringDashboard } from './components/course-authoring/CourseAuthoringDashboard';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ResetPassword } from './components/ResetPassword';
import { useTimer } from './hooks/useTimer';
import { useAuth } from './hooks/useAuth';
import { getPersonalizedAllocation } from './utils/allocationLogic';
import { getCareerSuggestions, getCareerAdvice } from './utils/careerSuggestions';
import { AgeGroup, LivingSituation, Allocations, UserProfile as UserProfileType } from './types';

function App() {
  const [income, setIncome] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [age, setAge] = useState<AgeGroup | ''>('');
  const [demographic, setDemographic] = useState<LivingSituation | ''>('');
  const [city, setCity] = useState('');
  const [allocations, setAllocations] = useState<Allocations | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [careerSuggestions, setCareerSuggestions] = useState<any[]>([]);
  const [careerAdvice, setCareerAdvice] = useState<string>('');
  const [showCoursePlatform, setShowCoursePlatform] = useState(false);
  const [showCourseAuthoring, setShowCourseAuthoring] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [errorLog, setErrorLog] = useState<string[]>([]);
  const [debugVisible, setDebugVisible] = useState(false);

  // Use authentication hook
  const { isAuthenticated, user, loading, login, register, logout } = useAuth();

  // Define logError early so it can be used in useEffects
  const logError = useCallback((message: string) => {
    console.error(message);
    setErrorLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  }, []);

  // Timer for showing login popup after 5 minutes (300,000 ms)
  const timer = useTimer(300000, () => {
    if (!isAuthenticated && !loading) {
      setShowLoginPopup(true);
    }
  });

  // Extract stable functions from timer
  const timerPause = timer.pause;
  const timerResume = timer.resume;

  // Pause timer when user focuses on income field
  const handleIncomeFocus = useCallback(() => {
    console.log('Income field focused - pausing timer');
    timerPause();
  }, [timerPause]);

  // Resume timer when user leaves income field
  const handleIncomeBlur = useCallback(() => {
    console.log('Income field blurred - resuming timer');
    timerResume();
  }, [timerResume]);

  // Auto-populate form when user data becomes available after login
  // Use a ref to track if we've already populated to prevent overwriting user edits
  const hasPopulated = useRef(false);

  useEffect(() => {
    console.log('Auth state changed:', {
      isAuthenticated,
      user: user ? `${user.firstName} ${user.lastName}` : null,
      loading,
      hasPopulated: hasPopulated.current
    });

    if (isAuthenticated && user && !hasPopulated.current) {
      console.log('Auto-populating form with user data:', user);
      // Round to 2 decimal places and remove trailing zeros
      const monthlyIncome = Math.round((user.salary / 12) * 100) / 100;
      setIncome(monthlyIncome.toString());

      // Map age to age group
      if (user.age >= 18 && user.age <= 25) setAge('18-25');
      else if (user.age >= 26 && user.age <= 35) setAge('26-35');
      else if (user.age >= 36 && user.age <= 45) setAge('36-45');
      else if (user.age >= 46 && user.age <= 55) setAge('46-55');
      else if (user.age >= 56) setAge('56+');

      // Map relationship status to demographic
      if (user.relationshipStatus === 'married') {
        setDemographic('couple');
      } else if (user.relationshipStatus === 'single') {
        setDemographic('single');
      }

      hasPopulated.current = true;
      console.log('Form populated successfully');
    } else if (!isAuthenticated) {
      // Reset flag when user logs out
      hasPopulated.current = false;
    }
  }, [isAuthenticated, user, loading]);


  const handleCalculate = useCallback(() => {
    setErrorLog([]); // Clear previous errors
    logError('=== CALCULATE CLICKED ===');
    logError(`Current values: income=${income}, age=${age}, demographic=${demographic}, city=${city}, currency=${currency}`);

    // Clean the income value by removing commas and other non-numeric chars except decimal
    const cleanedIncome = income.replace(/[^\d.]/g, '');
    const incomeValue = parseFloat(cleanedIncome);

    // Validate income
    if (!income || income.trim() === '' || isNaN(incomeValue) || incomeValue <= 0) {
      logError('Validation failed: Invalid income');
      alert('Please enter a valid monthly income!');
      return;
    }

    // Validate age
    if (!age || age === '') {
      logError('Validation failed: No age selected');
      alert('Please select your age group!');
      return;
    }

    // Validate demographic
    if (!demographic || demographic === '') {
      logError('Validation failed: No living situation selected');
      alert('Please select your living situation!');
      return;
    }

    // Validate city
    if (!city || city === '') {
      logError('Validation failed: No city selected');
      alert('Please select your city/location!');
      return;
    }

    // Validate currency (should always be set, but just in case)
    if (!currency) {
      logError('Validation failed: No currency');
      alert('Please select a currency!');
      return;
    }

    logError('All validations passed. Calculating...');

    try {
      const personalizedAllocations = getPersonalizedAllocation(age, demographic, city);
      logError(`Generated allocations: ${JSON.stringify(personalizedAllocations)}`);
      logError(`Allocations object exists: ${!!personalizedAllocations}`);
      logError(`Allocations keys: ${Object.keys(personalizedAllocations || {}).join(', ')}`);

      setAllocations(personalizedAllocations);
      logError('setAllocations called');

      // Get career suggestions
      const annualSalary = incomeValue * 12;
      const suggestions = getCareerSuggestions(annualSalary, age, demographic, city, currency);
      const advice = getCareerAdvice(annualSalary, age, city);
      logError(`Career suggestions count: ${suggestions.length}`);
      logError(`Career advice: ${advice}`);

      setCareerSuggestions(suggestions);
      setCareerAdvice(advice);

      logError('Setting showResults to true');
      setShowResults(true);
      logError('setShowResults called with true');

      // Scroll to results after a short delay to ensure they're rendered
      setTimeout(() => {
        const resultsElement = document.querySelector('[data-results]');
        logError(`Results element found: ${!!resultsElement}`);
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      logError(`Error during calculation: ${error}`);
      alert('An error occurred during calculation. Please check the error log.');
    }
  }, [logError, income, age, demographic, city, currency]);

  const handleLegacyLogin = (profile: UserProfileType) => {
    // Legacy login for backward compatibility
    setShowLoginPopup(false);

    // Auto-populate form with profile data
    const monthlyIncome = Math.round((profile.salary / 12) * 100) / 100;
    setIncome(monthlyIncome.toString());
    
    // Map age to age group
    if (profile.age >= 18 && profile.age <= 25) setAge('18-25');
    else if (profile.age >= 26 && profile.age <= 35) setAge('26-35');
    else if (profile.age >= 36 && profile.age <= 45) setAge('36-45');
    else if (profile.age >= 46 && profile.age <= 55) setAge('46-55');
    else if (profile.age >= 56) setAge('56+');
    
    // Map relationship status to demographic
    if (profile.relationshipStatus === 'married') {
      setDemographic('couple');
    } else if (profile.relationshipStatus === 'single') {
      setDemographic('single');
    }
  };

  const handleAuthLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      setShowLoginPopup(false);
    }
    return result;
  };

  const handleAuthRegister = async (email: string, password: string, profile: Omit<UserProfileType, 'email'>) => {
    const result = await register(email, password, profile);
    if (result.success) {
      setShowLoginPopup(false);
    }
    return result;
  };

  const handleLogout = async () => {
    await logout();
    // Clear form data
    setIncome('');
    setAge('');
    setDemographic('');
    setCity('');
    setAllocations(null);
    setShowResults(false);
    setCareerSuggestions([]);
    setCareerAdvice('');
  };

  const handleEditProfile = () => {
    setShowLoginPopup(true);
  };

  const handleLoginClick = () => {
    setShowLoginPopup(true);
  };

  const handleCoursesClick = () => {
    setShowCoursePlatform(true);
  };

  const handleAuthoringClick = () => {
    setShowCourseAuthoring(true);
  };

  const handleDashboardClick = () => {
    setShowDashboard(true);
  };

  const handleAdminClick = () => {
    setShowAdminDashboard(true);
  };


  const MainApp = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-purple-900">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[150]">
          <div className="bg-white rounded-lg p-8 shadow-2xl text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-800">Loading your profile...</p>
          </div>
        </div>
      )}

      {/* Floating Debug Panel */}
      {debugVisible && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-100 border-4 border-yellow-500 rounded-lg shadow-2xl max-w-md max-h-96 overflow-hidden">
          <div className="bg-yellow-500 px-4 py-2 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">🔍 DEBUG LOG</h3>
            <button
              onClick={() => setDebugVisible(false)}
              className="text-white hover:text-yellow-900 font-bold"
            >
              ✕
            </button>
          </div>
          <div className="p-4 bg-white max-h-80 overflow-y-auto">
            {errorLog.length === 0 ? (
              <p className="text-sm text-gray-500">No logs yet...</p>
            ) : (
              errorLog.map((log, index) => (
                <div key={index} className="text-xs font-mono text-gray-800 mb-1 border-b border-gray-200 pb-1">
                  {log}
                </div>
              ))
            )}
          </div>
          <div className="bg-yellow-100 px-4 py-2 border-t-2 border-yellow-500">
            <button
              onClick={() => {
                const logText = errorLog.join('\n');
                navigator.clipboard.writeText(logText);
                alert('Debug log copied to clipboard!');
              }}
              className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded font-bold"
            >
              📋 Copy All Logs
            </button>
          </div>
        </div>
      )}

      {/* Toggle Debug Button (when hidden) */}
      {!debugVisible && (
        <button
          onClick={() => setDebugVisible(true)}
          className="fixed bottom-4 right-4 z-50 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full shadow-2xl font-bold text-sm"
        >
          🔍 Show Debug Log
        </button>
      )}

      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          {!showDashboard && !showAdminDashboard && (
            <Header
              isAuthenticated={isAuthenticated}
              user={user}
              onLoginClick={handleLoginClick}
              onLogoutClick={handleLogout}
              onCoursesClick={handleCoursesClick}
              onAuthoringClick={handleAuthoringClick}
              onDashboardClick={handleDashboardClick}
              onAdminClick={user?.isAdmin ? handleAdminClick : undefined}
            />
          )}
          
          {!showDashboard && !showAdminDashboard && (
            <>
              {isAuthenticated && user && (
                <div className="px-8 pt-8">
                  <UserProfile profile={user} onEdit={handleEditProfile} />
                </div>
              )}

              <CalculatorForm
                income={income}
                setIncome={setIncome}
                currency={currency}
                setCurrency={setCurrency}
                age={age}
                setAge={setAge}
                demographic={demographic}
                setDemographic={setDemographic}
                city={city}
                setCity={setCity}
                onCalculate={handleCalculate}
                onIncomeFocus={handleIncomeFocus}
                onIncomeBlur={handleIncomeBlur}
              />

              {allocations && (
                <Results
                  allocations={allocations}
                  income={parseFloat(income.replace(/[^\d.]/g, ''))}
                  age={age as AgeGroup}
                  currency={currency}
                  city={city}
                  show={showResults}
                />
              )}

              {careerSuggestions.length > 0 && showResults && (
                <CareerSuggestions
                  suggestions={careerSuggestions}
                  currentSalary={parseFloat(income.replace(/[^\d.]/g, ''))}
                  currency={currency}
                  advice={careerAdvice}
                />
              )}
            </>
          )}
        </div>
        
        <LoginPopup
          isOpen={showLoginPopup}
          onClose={() => setShowLoginPopup(false)}
          onLogin={handleLegacyLogin}
          onAuthLogin={handleAuthLogin}
          onAuthRegister={handleAuthRegister}
        />
        
        <CoursePlatform 
          isOpen={showCoursePlatform} 
          onClose={() => setShowCoursePlatform(false)} 
        />
        
        {showCourseAuthoring && (
          <CourseAuthoringDashboard
            instructorId={user?.email || 'instructor-1'}
            onClose={() => setShowCourseAuthoring(false)}
          />
        )}

        {showDashboard && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <Dashboard />
            <button
              onClick={() => setShowDashboard(false)}
              className="fixed top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
            >
              ← Back to Calculator
            </button>
          </div>
        )}

        {showAdminDashboard && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <AdminDashboard />
            <button
              onClick={() => setShowAdminDashboard(false)}
              className="fixed top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
            >
              ← Back to Calculator
            </button>
          </div>
        )}

        <TestPanel />
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;