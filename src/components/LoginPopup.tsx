import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Heart, Briefcase, DollarSign, Lock } from 'lucide-react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabase';
import { formatPhoneNumber } from '../utils/phoneFormat';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (profile: UserProfile) => void;
  onAuthLogin?: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  onAuthRegister?: (email: string, password: string, profile: Omit<UserProfile, 'email'>) => Promise<{ success: boolean; message: string }>;
  onUpdateProfile?: (profile: Partial<UserProfile>) => Promise<{ success: boolean; message: string }>;
  currentUser?: UserProfile | null;
  editMode?: boolean;
}

export function LoginPopup({ isOpen, onClose, onLogin, onAuthLogin, onAuthRegister, onUpdateProfile, currentUser, editMode = false }: LoginPopupProps) {
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

  // Pre-populate form in edit mode
  useEffect(() => {
    if (isOpen && editMode && currentUser) {
      setProfile(currentUser);
    }
  }, [isOpen, editMode, currentUser]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setPassword('');
        setConfirmPassword('');
        setMessage('');
        setLoading(false);
        setResetEmail('');
        setCredentialsEmail('');
        if (!editMode) {
          setProfile({
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
        }
        setIsSignUp(false);
        setIsForgotPassword(false);
        setIsForgotCredentials(false);
      }, 300);
    }
  }, [isOpen, editMode]);

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
      // Always send a password reset email for security (don't reveal if email exists)
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(credentialsEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (resetError) {
        setMessage('Failed to send email. Please try again! ❌');
      } else {
        setMessage('📧 Recovery email sent! Check your inbox for your username and password reset instructions. The link expires in 1 hour. ✅');
        setTimeout(() => {
          setIsForgotCredentials(false);
          setCredentialsEmail('');
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      setMessage('Failed to send email. Please try again! ❌');
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
        setMessage('Failed to send reset email. Please try again! ❌');
      } else {
        setMessage('📧 Password reset email sent! Check your inbox for the reset link. ✅');
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

    if (editMode) {
      console.log('Edit mode - submitting form with profile:', profile);

      // Edit profile mode - check specific required fields
      const missingFields: string[] = [];

      if (!profile.firstName || profile.firstName.trim() === '') missingFields.push('First Name');
      if (!profile.lastName || profile.lastName.trim() === '') missingFields.push('Last Name');
      if (!profile.age || profile.age <= 0) missingFields.push('Age');
      if (!profile.salary || profile.salary <= 0) missingFields.push('Salary');
      if (!profile.zipCode || profile.zipCode.trim() === '') missingFields.push('Zip Code');
      if (!profile.phoneNumber || profile.phoneNumber.trim() === '') missingFields.push('Phone Number');
      if (!profile.relationshipStatus || profile.relationshipStatus.trim() === '') missingFields.push('Relationship Status');
      if (!profile.occupation || profile.occupation.trim() === '') missingFields.push('Occupation');

      if (missingFields.length > 0) {
        console.log('Validation failed - missing fields:', missingFields);
        setMessage(`Please fill in: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }

      if (onUpdateProfile) {
        try {
          const updateData = {
            firstName: profile.firstName,
            lastName: profile.lastName,
            age: profile.age,
            salary: profile.salary,
            zipCode: profile.zipCode,
            relationshipStatus: profile.relationshipStatus,
            occupation: profile.occupation,
            phoneNumber: profile.phoneNumber
          };

          console.log('Calling onUpdateProfile with:', updateData);
          const result = await onUpdateProfile(updateData);
          console.log('Update result:', result);

          if (result.success) {
            setMessage('Profile updated successfully! 🎉');
            setTimeout(() => {
              onClose();
            }, 1500);
          } else {
            setMessage(result.message);
          }
        } catch (error) {
          console.error('Profile update error in LoginPopup:', error);
          setMessage('Profile update failed. Please try again! ❌');
        }
      } else {
        console.error('onUpdateProfile is not defined');
        setMessage('Update function not available! ❌');
      }
      setLoading(false);
      return;
    }

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
          setMessage('Signing you in...');
          const result = await onAuthLogin(profile.email, password);

          if (result.success) {
            setMessage('Login successful! Loading your profile...');
            // Wait a bit longer to ensure profile loads
            setTimeout(() => {
              onClose();
            }, 2000);
          } else {
            setMessage(result.message);
          }
        } catch (error) {
          console.error('Login error in popup:', error);
          setMessage('Login failed. Please try again!');
        }
      } else {
        // Fallback to old method
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
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] overflow-y-auto p-4"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-hidden flex flex-col my-auto"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 text-white relative flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors p-2"
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 pr-12">
            {editMode ? '✏️ Edit Your Profile' : isForgotCredentials ? '🔍 Forgot Username/Password' : isForgotPassword ? '🔐 Reset Password' : isSignUp ? '🚀 Create Your Profile' : '👋 Welcome Back!'}
          </h2>
          <p className="opacity-90 text-sm sm:text-base">
            {editMode
              ? 'Update your personal information'
              : isForgotCredentials
              ? 'Enter your email to receive your username and password reset link'
              : isForgotPassword
              ? 'Enter your email to receive a password reset link'
              : isSignUp
                ? 'Get personalized financial advice tailored just for you!'
                : 'Sign in to access your personalized money plan'
            }
          </p>
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-white bg-opacity-20 rounded-lg text-xs sm:text-sm">
            <p className="font-semibold mb-1">
              {editMode ? '✏️ Edit Profile:' : isForgotCredentials ? '🔍 Account Recovery:' : isForgotPassword ? '🔐 Password Reset:' : isSignUp ? '🚀 Create Your Account:' : '🔐 Sign In:'}
            </p>
            <p>
              {editMode
                ? 'Make changes to your profile information below'
                : isForgotCredentials
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

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1"
        >
          {message && (
            <div className={`p-3 rounded-lg ${message.includes('❌') || message.includes('match') || message.includes('failed') || message.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message}
            </div>
          )}

          {isForgotCredentials ? (
            <>
              <div>
                <label htmlFor="credentialsEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email Address
                </label>
                <input
                  id="credentialsEmail"
                  name="credentialsEmail"
                  type="email"
                  value={credentialsEmail}
                  onChange={(e) => setCredentialsEmail(e.target.value)}
                  className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-base"
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
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
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
            <>
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email Address
                </label>
                <input
                  id="resetEmail"
                  name="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-base"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
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
              </div>
            </>
          ) : (
            <>
              {(isSignUp || editMode) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-base"
                  placeholder="John"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-base"
                  placeholder="Doe"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>
          )}

          {editMode && (
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-600 transition-all text-base cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
            </div>
          )}

          {!editMode && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-base"
                  placeholder="john.doe@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Lock size={16} className="inline mr-2" />
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-base"
                  placeholder={isSignUp ? "Create a secure password" : "Enter your password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  minLength={isSignUp ? 6 : undefined}
                />
              </div>

              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    <Lock size={16} className="inline mr-2" />
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-base"
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                  />
                </div>
              )}
            </>
          )}

          {(isSignUp || editMode) && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                    🎂 Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    value={profile.age || ''}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                    className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-base"
                    placeholder="30"
                    min="18"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="salary" className="block text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign size={16} className="inline mr-2" />
                    Annual Salary
                  </label>
                  <input
                    id="salary"
                    name="salary"
                    type="number"
                    value={profile.salary || ''}
                    onChange={(e) => handleInputChange('salary', parseInt(e.target.value) || 0)}
                    className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-base"
                    placeholder="75000"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Zip Code
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={profile.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-base"
                    placeholder="12345"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={profile.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', formatPhoneNumber(e.target.value))}
                    className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-base"
                    placeholder="555-123-4567"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="relationshipStatus" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Heart size={16} className="inline mr-2" />
                  Relationship Status
                </label>
                <select
                  id="relationshipStatus"
                  name="relationshipStatus"
                  value={profile.relationshipStatus}
                  onChange={(e) => handleInputChange('relationshipStatus', e.target.value)}
                  className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-base"
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
                <label htmlFor="occupation" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Briefcase size={16} className="inline mr-2" />
                  Occupation
                </label>
                <input
                  id="occupation"
                  name="occupation"
                  type="text"
                  value={profile.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full p-2 sm:p-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-base"
                  placeholder="Software Engineer"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
          >
            {loading
              ? (editMode ? 'Updating Profile...' : isSignUp ? 'Creating Account...' : 'Signing In...')
              : (editMode ? 'Update Profile' : isSignUp ? 'Create My Profile' : 'Sign In')
            }
          </button>

              {!isSignUp && !editMode && (
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

              {!editMode && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setMessage('');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors py-2 px-4"
                  >
                    {isSignUp
                      ? 'Already have an account? Sign In'
                      : "Don't have an account? Sign Up"
                    }
                  </button>
                </div>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}
