import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Heart, Briefcase, DollarSign, Lock } from 'lucide-react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (profile: UserProfile) => void;
  onAuthLogin?: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  onAuthRegister?: (email: string, password: string, profile: Omit<UserProfile, 'email'>) => Promise<{ success: boolean; message: string }>;
}

export function LoginPopup({ isOpen, onClose, onLogin, onAuthLogin, onAuthRegister }: LoginPopupProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isForgotCredentials, setIsForgotCredentials] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [credentialsEmail, setCredentialsEmail] = useState('');
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    age: 0,
    salary: 0,
    zipCode: '',
    relationshipStatus: 'single',
    occupation: '',
    phoneNumber: '',
    email: ''
  });

  const handleForgotCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    if (!credentialsEmail || !credentialsEmail.includes('@')) {
      setMessage('Please enter a valid email address! 📧');
      setLoading(false);
      return;
    }

    try {
      // Check if user exists in our system
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('id', '(SELECT id FROM auth.users WHERE email = $1)')
        .limit(1);

      // Always send a password reset email for security (don't reveal if email exists)
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(credentialsEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (resetError) {
        setMessage(`Reset failed: ${resetError.message} ❌`);
      } else {
        setMessage(`📧 If an account exists with ${credentialsEmail}, you'll receive an email with:\n\n✅ Your username (email address)\n✅ A secure password reset link\n\nCheck your inbox and spam folder!`);
        setTimeout(() => {
          setIsForgotCredentials(false);
          setCredentialsEmail('');
          setMessage('');
        }, 5000);
      }
    } catch (error) {
      setMessage('Failed to process request. Please try again! ❌');
    }
    
    setLoading(false);
  };
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    if (!resetEmail || !resetEmail.includes('@')) {
      setMessage('Please enter a valid email address! 📧');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        setMessage(`Reset failed: ${error.message} ❌`);
      } else {
        setMessage('Password reset email sent! Check your inbox and spam folder. 📧✅');
        setTimeout(() => {
          setIsForgotPassword(false);
          setResetEmail('');
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      setMessage('Failed to send reset email. Please try again! ❌');
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isForgotCredentials) {
      return handleForgotCredentials(e);
    }
    
    if (isForgotPassword) {
      return handleForgotPassword(e);
    }
    
    setLoading(true);
    setMessage('');
    
    if (isSignUp) {
      // Sign up validation
      if (!password || password.length < 6) {
        setMessage('Password must be at least 6 characters long! 🔒');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setMessage('Passwords do not match! 🔄');
        setLoading(false);
        return;
      }

      const requiredFields = Object.entries(profile).filter(([key, value]) => {
        if (key === 'age' || key === 'salary') return value <= 0;
        return !value || value.toString().trim() === '';
      });
      
      if (requiredFields.length > 0) {
        setMessage('Please fill in all fields! 📝');
        setLoading(false);
        return;
      }
      
      if (onAuthRegister) {
        try {
          const result = await onAuthRegister(profile.email, password, {
            firstName: profile.firstName,
            lastName: profile.lastName,
            age: profile.age,
            salary: profile.salary,
            zipCode: profile.zipCode,
            relationshipStatus: profile.relationshipStatus,
            occupation: profile.occupation,
            phoneNumber: profile.phoneNumber
          });
          
          if (result.success) {
            setMessage('Account created successfully! Check your email for a welcome message! 🎉📧');
            setTimeout(() => {
              onClose();
            }, 1500);
          } else {
            setMessage(result.message);
          }
        } catch (error) {
          setMessage('Registration failed. Please try again! ❌');
        }
      } else {
        // Fallback to old method
        onLogin(profile);
      }
    } else {
      // Sign in validation
      if (!profile.email || !password) {
        setMessage('Please enter your email and password! 📧');
        setLoading(false);
        return;
      }
      
      if (onAuthLogin) {
        try {
          const result = await onAuthLogin(profile.email, password);
          
          if (result.success) {
            setMessage('Login successful! Welcome back! 🎉');
            setTimeout(() => {
              onClose();
            }, 1500);
          } else {
            setMessage(result.message);
          }
        } catch (error) {
          setMessage('Login failed. Please try again! ❌');
        }
      } else {
        // Fallback to old method
        if (!profile.firstName) {
          setMessage('Please enter your name to continue! 👤');
          setLoading(false);
          return;
        }
        onLogin(profile);
      }
    }
    
    setLoading(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-2">
            {isForgotCredentials ? '🔍 Forgot Username/Password' : isForgotPassword ? '🔐 Reset Password' : isSignUp ? '🚀 Create Your Profile' : '👋 Welcome Back!'}
          </h2>
          <p className="opacity-90">
            {isForgotCredentials
              ? 'Enter your email to receive your username and password reset link'
              : isForgotPassword
              ? 'Enter your email to receive a password reset link'
              : isSignUp 
                ? 'Get personalized financial advice tailored just for you!'
                : 'Sign in to access your personalized money plan'
            }
          </p>
          {/* Test Credentials Info */}
          <div className="mt-4 p-3 bg-white bg-opacity-20 rounded-lg text-sm">
            <p className="font-semibold mb-1">
              {isForgotCredentials ? '🔍 Account Recovery:' : isForgotPassword ? '🔐 Password Reset:' : isSignUp ? '🚀 Create Your Account:' : '🔐 Sign In:'}
            </p>
            <p>
              {isForgotCredentials
                ? 'We\'ll send your username and a password reset link to your email'
                : isForgotPassword
                ? 'We\'ll send you a secure link to reset your password'
                : isSignUp 
                  ? 'Fill out the form to create your personalized profile'
                  : 'Use your email and password to access your account'
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {message && (
            <div className={`p-3 rounded-lg text-center font-semibold ${
              message.includes('successful') || message.includes('Welcome') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {isForgotCredentials ? (
            /* Forgot Username/Password Form */
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={credentialsEmail}
                  onChange={(e) => setCredentialsEmail(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-semibold text-blue-800 mb-2">📧 What you'll receive:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✅ Your username (email address)</li>
                  <li>✅ Secure password reset link</li>
                  <li>✅ Account recovery instructions</li>
                  <li>🔒 Link expires in 1 hour for security</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? '⏳ Sending Recovery Email...' : '📧 Send Username & Reset Link'}
              </button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotCredentials(false);
                    setCredentialsEmail('');
                    setMessage('');
                  }}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  ← Back to Sign In
                </button>
              </div>
            </>
          ) : isForgotPassword ? (
            /* Forgot Password Form */
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? '⏳ Sending Reset Email...' : '📧 Send Reset Link'}
              </button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setResetEmail('');
                    setMessage('');
                  }}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  ← Back to Sign In
                </button>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setIsForgotCredentials(true);
                      setResetEmail('');
                      setMessage('');
                    }}
                    className="text-purple-600 hover:text-purple-800 text-sm transition-colors"
                  >
                    Forgot your username too?
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Regular Login/Signup Form */
            <>
          {/* Basic Info */}
          {isSignUp && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  First Name
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail size={16} className="inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="john.doe@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Lock size={16} className="inline mr-2" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder={isSignUp ? "Create a secure password" : "Enter your password"}
              required
              minLength={isSignUp ? 6 : undefined}
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Lock size={16} className="inline mr-2" />
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>
          )}

          {isSignUp && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🎂 Age
                  </label>
                  <input
                    type="number"
                    value={profile.age || ''}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="30"
                    min="18"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign size={16} className="inline mr-2" />
                    Annual Salary
                  </label>
                  <input
                    type="number"
                    value={profile.salary || ''}
                    onChange={(e) => handleInputChange('salary', parseInt(e.target.value) || 0)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="75000"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={profile.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="12345"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Heart size={16} className="inline mr-2" />
                  Relationship Status
                </label>
                <select
                  value={profile.relationshipStatus}
                  onChange={(e) => handleInputChange('relationshipStatus', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="in-relationship">In a Relationship</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Briefcase size={16} className="inline mr-2" />
                  Occupation
                </label>
                <input
                  type="text"
                  value={profile.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="Software Engineer"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading 
              ? (isSignUp ? '⏳ Creating Account...' : '⏳ Signing In...') 
              : (isSignUp ? '🎯 Create My Profile' : '🚀 Sign In')
            }
          </button>

              {!isSignUp && (
                <div className="text-center">
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setMessage('');
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm transition-colors block mx-auto"
                    >
                      Forgot your password?
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotCredentials(true);
                        setMessage('');
                      }}
                      className="text-purple-600 hover:text-purple-800 text-sm transition-colors block mx-auto"
                    >
                      Forgot username & password?
                    </button>
                  </div>
                </div>
              )}

              <div className="text-center">
            <button
              type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setMessage('');
                }}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"
              }
            </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}