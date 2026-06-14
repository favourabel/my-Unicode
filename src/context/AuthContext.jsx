import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // SIGN UP
  // =========================
  const signup = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;

    return data;
  };

  // =========================
  // LOGIN
  // =========================
  const login = (email, password) => {
    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) throw error;

    return data;
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    return supabase.auth.signOut();
  };

  // =========================
  // AUTH LISTENER (FIXED - NO auth)
  // =========================
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setCurrentUser(user || null);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loginWithGoogle,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}