import React, { useState, useEffect } from 'react';
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

  // Use authentication hook
  const { isAuthenticated, user, loading, login, register, logout } = useAuth();

  // Timer for showing login popup after 5 minutes (300,000 ms)
  useTimer(300000, () => {
    if (!isAuthenticated && !loading) {
      setShowLoginPopup(true);
    }
  });

  // Auto-populate form when user data becomes available after login
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, user: user ? `${user.firstName} ${user.lastName}` : null });
    if (isAuthenticated && user) {
      setIncome((user.salary / 12).toString());

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
    }
  }, [isAuthenticated, user]);

  const handleCalculate = () => {
    const incomeValue = parseFloat(income);
    
    // Validate income
    if (!income || income.trim() === '' || isNaN(incomeValue) || incomeValue <= 0) {
      alert('Please enter a valid monthly income! 💰');
      return;
    }

    // Validate age
    if (!age || age === '') {
      alert('Please select your age group! 🎂');
      return;
    }

    // Validate demographic
    if (!demographic || demographic === '') {
      alert('Please select your living situation! 🏠');
      return;
    }

    // Validate city
    if (!city || city === '') {
      alert('Please select your city/location! 🌍');
      return;
    }

    // Validate currency (should always be set, but just in case)
    if (!currency) {
      alert('Please select a currency! 💱');
      return;
    }

    console.log('Calculating with:', { incomeValue, age, demographic, city, currency });

    const personalizedAllocations = getPersonalizedAllocation(age, demographic, city);
    console.log('Generated allocations:', personalizedAllocations);
    
    setAllocations(personalizedAllocations);
    
    // Get career suggestions
    const annualSalary = incomeValue * 12; // Convert monthly to annual for career suggestions
    const suggestions = getCareerSuggestions(annualSalary, age, demographic, city, currency);
    const advice = getCareerAdvice(annualSalary, age, city);
    setCareerSuggestions(suggestions);
    setCareerAdvice(advice);
    
    setShowResults(true);
    
    // Scroll to results after a short delay to ensure they're rendered
    setTimeout(() => {
      const resultsElement = document.querySelector('[data-results]');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleLegacyLogin = (profile: UserProfileType) => {
    // Legacy login for backward compatibility
    setShowLoginPopup(false);
    
    // Auto-populate form with profile data
    setIncome((profile.salary / 12).toString());
    
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-purple-900">
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
              onAdminClick={handleAdminClick}
            />
          )}
          
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
          />

          {allocations && (
            <Results
              allocations={allocations}
              income={parseFloat(income)}
              age={age as AgeGroup}
              currency={currency}
              city={city}
              show={showResults}
            />
          )}
          
          {careerSuggestions.length > 0 && showResults && (
            <CareerSuggestions
              suggestions={careerSuggestions}
              currentSalary={parseFloat(income)}
              currency={currency}
              advice={careerAdvice}
            />
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
}

export default App;