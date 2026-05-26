'use client';

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { setUserSettings } from '@/lib/firestore';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface AuthContextValue extends AuthState {
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({ type: 'SET_USER', payload: user });
    });
    return unsubscribe;
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      try {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Set the display name on the Firebase user profile
        await updateProfile(credential.user, { displayName });

        // Create default user settings doc in Firestore
        await setUserSettings(credential.user.uid, {
          currency: 'USD',
          displayName,
          createdAt: new Date().toISOString(),
        });

        dispatch({ type: 'SET_USER', payload: credential.user });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Sign up failed';
        dispatch({ type: 'SET_ERROR', payload: message });
        throw err;
      }
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      try {
        const credential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        dispatch({ type: 'SET_USER', payload: credential.user });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Sign in failed';
        dispatch({ type: 'SET_ERROR', payload: message });
        throw err;
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await firebaseSignOut(auth);
      dispatch({ type: 'SET_USER', payload: null });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Sign out failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw err;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      await sendPasswordResetEmail(auth, email);
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Password reset failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw err;
    }
  }, []);

  const value: AuthContextValue = {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}