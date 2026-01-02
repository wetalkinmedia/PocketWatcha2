import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { UserProfile } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  supabaseUser: User | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    supabaseUser: null,
    loading: true
  });

  useEffect(() => {
    // Initialize auth in background without blocking UI
    try {
      // Get initial session in background
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log('Initial session check:', session ? 'Session found' : 'No session');
        if (session?.user) {
          loadUserProfile(session.user);
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            supabaseUser: null,
            loading: false
          });
        }
      }).catch(error => {
        console.warn('Auth session check failed:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          supabaseUser: null,
          loading: false
        });
      });

      // Listen for auth changes
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state change event:', event, 'Session:', session ? 'Present' : 'None');
        (async () => {
          if (session?.user) {
            await loadUserProfile(session.user);
          } else {
            console.log('No session, setting unauthenticated state');
            setAuthState({
              isAuthenticated: false,
              user: null,
              supabaseUser: null,
              loading: false
            });
          }
        })();
      });
      
      return () => {
        data.subscription?.unsubscribe();
      };
    } catch (error) {
      console.warn('Auth listener setup failed:', error);
    }
  }, []);

  const loadUserProfile = async (supabaseUser: User) => {
    try {
      console.log('Loading profile for user:', supabaseUser.id);
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          supabaseUser,
          loading: false
        });
        return;
      }

      if (profile) {
        console.log('Profile loaded successfully:', profile);
        setAuthState({
          isAuthenticated: true,
          user: {
            firstName: profile.first_name,
            lastName: profile.last_name,
            age: profile.age,
            salary: profile.salary,
            zipCode: profile.zip_code,
            relationshipStatus: profile.relationship_status,
            occupation: profile.occupation,
            phoneNumber: profile.phone_number,
            email: supabaseUser.email || ''
          },
          supabaseUser,
          loading: false
        });
      } else {
        console.error('No profile found for user:', supabaseUser.id);
        console.error('This user has an auth account but no profile in user_profiles table');
        // User exists but no profile - create a basic profile or show error
        alert('Your account exists but your profile is missing. Please contact support or try registering again.');
        setAuthState({
          isAuthenticated: false,
          user: null,
          supabaseUser: null,
          loading: false
        });
        // Sign them out since they can't use the app without a profile
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        supabaseUser,
        loading: false
      });
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, message: error.message };
      }

      if (data.user) {
        console.log('Login successful, user:', data.user.id);
        // Profile will be loaded by the auth state change listener
        return { success: true, message: 'Login successful!' };
      }

      return { success: false, message: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (email: string, password: string, profile: Omit<UserProfile, 'email'>): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Starting registration for:', email);
      console.log('Password length:', password.length);
      console.log('Profile data:', profile);

      // Validate email format
      if (!email || !email.includes('@')) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      // Validate password length
      if (!password || password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }

      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            first_name: profile.firstName,
            last_name: profile.lastName
          }
        }
      });

      console.log('Auth signup result:', {
        user: authData?.user?.id,
        session: !!authData?.session,
        error: authError
      });

      if (authError) {
        console.error('Auth error:', authError);
        return { success: false, message: authError.message };
      }

      if (!authData.user) {
        console.error('No user returned from signup');
        return { success: false, message: 'Registration failed - no user created' };
      }

      console.log('User created, now creating profile for user ID:', authData.user.id);

      // Wait a brief moment to ensure session is fully established in the database context
      // This prevents RLS policy violations due to race conditions
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify we have a session before creating profile
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Session check before profile creation:', !!sessionData.session);

      // Create the user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          first_name: profile.firstName.trim(),
          last_name: profile.lastName.trim(),
          age: profile.age,
          salary: profile.salary,
          zip_code: profile.zipCode.trim(),
          relationship_status: profile.relationshipStatus.toLowerCase(),
          occupation: profile.occupation.trim(),
          phone_number: profile.phoneNumber.trim()
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        console.error('Profile creation error details:', JSON.stringify(profileError, null, 2));
        return { success: false, message: `Failed to create profile: ${profileError.message}` };
      }

      console.log('Profile created successfully');

      // Load the user profile into state immediately
      await loadUserProfile(authData.user);

      return { success: true, message: 'Account created successfully!' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, message: error?.message || 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setAuthState({
        isAuthenticated: false,
        user: null,
        supabaseUser: null,
        loading: false
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updatedProfile: Partial<UserProfile>): Promise<{ success: boolean; message: string }> => {
    try {
      if (!authState.supabaseUser) {
        return { success: false, message: 'Not authenticated' };
      }

      const updateData: any = {};
      if (updatedProfile.firstName) updateData.first_name = updatedProfile.firstName;
      if (updatedProfile.lastName) updateData.last_name = updatedProfile.lastName;
      if (updatedProfile.age) updateData.age = updatedProfile.age;
      if (updatedProfile.salary) updateData.salary = updatedProfile.salary;
      if (updatedProfile.zipCode) updateData.zip_code = updatedProfile.zipCode;
      if (updatedProfile.relationshipStatus) updateData.relationship_status = updatedProfile.relationshipStatus;
      if (updatedProfile.occupation) updateData.occupation = updatedProfile.occupation;
      if (updatedProfile.phoneNumber) updateData.phone_number = updatedProfile.phoneNumber;

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', authState.supabaseUser.id);

      if (error) {
        console.error('Profile update error:', error);
        return { success: false, message: 'Profile update failed' };
      }

      // Update local state
      if (authState.user) {
        setAuthState(prev => ({
          ...prev,
          user: prev.user ? { ...prev.user, ...updatedProfile } : null
        }));
      }

      return { success: true, message: 'Profile updated successfully!' };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: 'Profile update failed. Please try again.' };
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile
  };
}