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
        console.warn('No profile found for user:', supabaseUser.id);
        // User exists but no profile - they need to complete registration
        setAuthState({
          isAuthenticated: false,
          user: null,
          supabaseUser,
          loading: false
        });
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
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) {
        return { success: false, message: authError.message };
      }

      if (!authData.user) {
        return { success: false, message: 'Registration failed' };
      }

      // Create the user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          first_name: profile.firstName,
          last_name: profile.lastName,
          age: profile.age,
          salary: profile.salary,
          zip_code: profile.zipCode,
          relationship_status: profile.relationshipStatus,
          occupation: profile.occupation,
          phone_number: profile.phoneNumber
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return { success: false, message: 'Failed to create profile' };
      }

      return { success: true, message: 'Account created successfully!' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
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