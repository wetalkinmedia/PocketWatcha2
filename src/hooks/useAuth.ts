import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  const loadingRef = useRef(false);
  const isInitializedRef = useRef(false);
  const loadUserProfileRef = useRef<((user: User) => Promise<void>) | null>(null);

  const loadUserProfile = useCallback(async (supabaseUser: User) => {
    // Skip if we already loaded this user
    if (loadedUserIdRef.current === supabaseUser.id && isInitializedRef.current) {
      console.log('Profile already loaded for user:', supabaseUser.id);
      return;
    }

    // Skip if already loading to prevent concurrent calls
    if (loadingRef.current) {
      console.log('Profile loading already in progress');
      return;
    }

    try {
      loadingRef.current = true;

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        loadingRef.current = false;
        return;
      }

      if (!profile) {
        console.warn('No profile found, will retry once...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const { data: retryProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .maybeSingle();

        if (!retryProfile) {
          console.error('Profile still not found after retry');
          loadingRef.current = false;
          return;
        }
      }

      const finalProfile = profile || await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle()
        .then(r => r.data);

      if (!finalProfile) {
        loadingRef.current = false;
        return;
      }

      let isAdmin = false;
      try {
        const { data: adminCheck } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', supabaseUser.id)
          .maybeSingle();

        isAdmin = !!adminCheck;
      } catch (adminError) {
        console.warn('Admin check failed, defaulting to non-admin');
      }

      // Mark as initialized and loaded
      loadedUserIdRef.current = supabaseUser.id;
      isInitializedRef.current = true;

      // Only update state once with all data
      setAuthState({
        isAuthenticated: true,
        user: {
          firstName: finalProfile.first_name,
          lastName: finalProfile.last_name,
          age: finalProfile.age,
          salary: finalProfile.salary,
          zipCode: finalProfile.zip_code,
          relationshipStatus: finalProfile.relationship_status,
          occupation: finalProfile.occupation,
          phoneNumber: finalProfile.phone_number,
          email: supabaseUser.email || '',
          isAdmin
        },
        supabaseUser,
        loading: false
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      loadingRef.current = false;
    }
  }, []);

  // Store the function in a ref so useEffect can access latest version without re-running
  useEffect(() => {
    loadUserProfileRef.current = loadUserProfile;
  }, [loadUserProfile]);

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;
    const hasRunRef = { current: false };

    const initAuth = async () => {
      // Prevent multiple runs
      if (hasRunRef.current) {
        console.log('initAuth already ran, skipping');
        return;
      }
      hasRunRef.current = true;

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!mounted) return;

        console.log('Initial session check:', session ? 'Session found' : 'No session');

        if (session?.user && loadUserProfileRef.current) {
          await loadUserProfileRef.current(session.user);
        } else if (!session?.user) {
          setAuthState({
            isAuthenticated: false,
            user: null,
            supabaseUser: null,
            loading: false
          });
          isInitializedRef.current = true;
        }
      } catch (error) {
        console.warn('Auth session check failed:', error);
        if (mounted) {
          setAuthState({
            isAuthenticated: false,
            user: null,
            supabaseUser: null,
            loading: false
          });
          isInitializedRef.current = true;
        }
      }
    };

    // Only initialize if not already initialized
    if (!isInitializedRef.current) {
      initAuth();
    }

    // Listen for auth changes (only set up listener once)
    if (!authSubscription) {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (!mounted) return;

        console.log('Auth state change event:', event);

        // Ignore these events to prevent loops
        if (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          return;
        }

        // Handle sign in
        if (event === 'SIGNED_IN') {
          if (session?.user && loadUserProfileRef.current) {
            // Reset initialization flag to force reload
            isInitializedRef.current = false;
            loadedUserIdRef.current = null;
            loadUserProfileRef.current(session.user);
          }
        }
        // Handle sign out
        else if (event === 'SIGNED_OUT') {
          loadedUserIdRef.current = null;
          isInitializedRef.current = false;
          loadingRef.current = false;
          setAuthState({
            isAuthenticated: false,
            user: null,
            supabaseUser: null,
            loading: false
          });
        }
        // Ignore other events like USER_UPDATED to prevent loops
      });

      authSubscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
        authSubscription = null;
      }
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
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
        console.log('Login successful');
        return { success: true, message: 'Login successful!' };
      }

      return { success: false, message: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }, []);

  const register = useCallback(async (email: string, password: string, profile: Omit<UserProfile, 'email'>): Promise<{ success: boolean; message: string }> => {
    try {
      // Validate email format
      if (!email || !email.includes('@')) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      // Validate password length
      if (!password || password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }

      // Create auth user with profile data in metadata
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

      if (authError) {
        console.error('Auth error:', authError);
        return { success: false, message: authError.message };
      }

      if (!authData.user) {
        return { success: false, message: 'Registration failed' };
      }

      // Wait for trigger to create profile
      await new Promise(resolve => setTimeout(resolve, 800));

      // Reset initialization to force profile load
      isInitializedRef.current = false;
      loadedUserIdRef.current = null;
      await loadUserProfile(authData.user);

      return { success: true, message: 'Account created successfully!' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, message: error?.message || 'Registration failed. Please try again.' };
    }
  }, [loadUserProfile]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      loadedUserIdRef.current = null;
      isInitializedRef.current = false;
      loadingRef.current = false;
      setAuthState({
        isAuthenticated: false,
        user: null,
        supabaseUser: null,
        loading: false
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const updateProfile = useCallback(async (updatedProfile: Partial<UserProfile>): Promise<{ success: boolean; message: string }> => {
    try {
      if (!authState.supabaseUser) {
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

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', authState.supabaseUser.id);

      if (error) {
        console.error('Profile update error:', error);
        return { success: false, message: `Profile update failed: ${error.message}` };
      }

      // Update local state with new profile data
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? {
          ...prev.user,
          ...updatedProfile
        } : null
      }));

      return { success: true, message: 'Profile updated successfully!' };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { success: false, message: `Profile update failed: ${error?.message || 'Please try again.'}` };
    }
  }, [authState.supabaseUser]);

  // Memoize the return value to prevent unnecessary re-renders
  const memoizedUser = useMemo(() => authState.user, [
    authState.user?.email,
    authState.user?.firstName,
    authState.user?.lastName,
    authState.user?.age,
    authState.user?.salary,
    authState.user?.isAdmin
  ]);

  return useMemo(() => ({
    isAuthenticated: authState.isAuthenticated,
    user: memoizedUser,
    supabaseUser: authState.supabaseUser,
    loading: authState.loading,
    login,
    register,
    logout,
    updateProfile
  }), [
    authState.isAuthenticated,
    memoizedUser,
    authState.supabaseUser,
    authState.loading,
    login,
    register,
    logout,
    updateProfile
  ]);
}
