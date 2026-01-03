import { useState, useEffect, useRef } from 'react';
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
  const loadedUserIdRef = useRef<string | null>(null);

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
        // Ignore TOKEN_REFRESHED events to prevent unnecessary reloads
        if (event === 'TOKEN_REFRESHED') {
          return;
        }

        (async () => {
          if (session?.user) {
            await loadUserProfile(session.user);
          } else {
            loadedUserIdRef.current = null;
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
    // Skip if we already loaded this user AND auth state is properly set
    if (loadedUserIdRef.current === supabaseUser.id) {
      // Ensure loading is false without triggering unnecessary updates
      setAuthState(prev => {
        if (prev.loading === false && prev.isAuthenticated && prev.supabaseUser?.id === supabaseUser.id) {
          return prev; // Return same reference to prevent re-render
        }
        return { ...prev, loading: false };
      });
      return;
    }

    try {
      loadedUserIdRef.current = supabaseUser.id;

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        loadedUserIdRef.current = null;
        setAuthState({
          isAuthenticated: false,
          user: null,
          supabaseUser,
          loading: false
        });
        return;
      }

      if (profile) {

        let isAdmin = false;
        try {
          const { data: adminCheck, error: adminError } = await supabase
            .from('admin_users')
            .select('user_id')
            .eq('user_id', supabaseUser.id)
            .maybeSingle();

          if (!adminError) {
            isAdmin = !!adminCheck;
          }
        } catch (adminError) {
          console.warn('Admin check failed, defaulting to non-admin:', adminError);
        }

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
            email: supabaseUser.email || '',
            isAdmin
          },
          supabaseUser,
          loading: false
        });
      } else {
        console.warn('No profile found, will retry in a moment...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const { data: retryProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .maybeSingle();

        if (retryProfile) {
          console.log('Profile loaded on retry:', retryProfile);

          let isAdmin = false;
          try {
            const { data: adminCheck, error: adminError } = await supabase
              .from('admin_users')
              .select('user_id')
              .eq('user_id', supabaseUser.id)
              .maybeSingle();

            if (!adminError) {
              isAdmin = !!adminCheck;
            }
          } catch (adminError) {
            console.warn('Admin check failed, defaulting to non-admin:', adminError);
          }
          console.log('Admin check result:', isAdmin);

          setAuthState({
            isAuthenticated: true,
            user: {
              firstName: retryProfile.first_name,
              lastName: retryProfile.last_name,
              age: retryProfile.age,
              salary: retryProfile.salary,
              zipCode: retryProfile.zip_code,
              relationshipStatus: retryProfile.relationship_status,
              occupation: retryProfile.occupation,
              phoneNumber: retryProfile.phone_number,
              email: supabaseUser.email || '',
              isAdmin
            },
            supabaseUser,
            loading: false
          });
        } else {
          console.error('Profile still not found after retry');
          loadedUserIdRef.current = null;
          setAuthState({
            isAuthenticated: false,
            user: null,
            supabaseUser: null,
            loading: false
          });
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      loadedUserIdRef.current = null;
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

      // Create auth user with profile data in metadata
      // The database trigger will automatically create the profile
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            first_name: profile.firstName.trim(),
            last_name: profile.lastName.trim(),
            age: profile.age,
            salary: profile.salary,
            zip_code: profile.zipCode.trim(),
            relationship_status: profile.relationshipStatus.toLowerCase(),
            occupation: profile.occupation.trim(),
            phone_number: profile.phoneNumber.trim()
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

      console.log('User created, profile will be auto-created by database trigger');

      // Wait for trigger to create profile
      await new Promise(resolve => setTimeout(resolve, 500));

      // Load the user profile into state
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
      loadedUserIdRef.current = null;
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
      console.log('updateProfile called with:', updatedProfile);
      console.log('Current auth state:', {
        isAuthenticated: authState.isAuthenticated,
        hasUser: !!authState.user,
        hasSupabaseUser: !!authState.supabaseUser,
        supabaseUserId: authState.supabaseUser?.id
      });

      if (!authState.supabaseUser) {
        console.error('No supabase user found');
        return { success: false, message: 'Not authenticated' };
      }

      const updateData: any = {};
      if (updatedProfile.firstName !== undefined) updateData.first_name = updatedProfile.firstName;
      if (updatedProfile.lastName !== undefined) updateData.last_name = updatedProfile.lastName;
      if (updatedProfile.age !== undefined) updateData.age = updatedProfile.age;
      if (updatedProfile.salary !== undefined) updateData.salary = updatedProfile.salary;
      if (updatedProfile.zipCode !== undefined) updateData.zip_code = updatedProfile.zipCode;
      if (updatedProfile.relationshipStatus !== undefined) updateData.relationship_status = updatedProfile.relationshipStatus;
      if (updatedProfile.occupation !== undefined) updateData.occupation = updatedProfile.occupation;
      if (updatedProfile.phoneNumber !== undefined) updateData.phone_number = updatedProfile.phoneNumber;

      console.log('Update data:', updateData);
      console.log('Updating profile for user:', authState.supabaseUser.id);

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', authState.supabaseUser.id)
        .select();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Profile update error:', error);
        return { success: false, message: `Profile update failed: ${error.message}` };
      }

      // Reset the ref so profile will be reloaded on next auth state change
      loadedUserIdRef.current = null;
      // Reload the profile to ensure we have the latest data
      await loadUserProfile(authState.supabaseUser);

      return { success: true, message: 'Profile updated successfully!' };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { success: false, message: `Profile update failed: ${error?.message || 'Please try again.'}` };
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