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
        data: { name },
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
  // LOGOUT (clears Supabase + localStorage)
  // =========================
  const logout = async () => {
    // Clear local fallback user (offline admin)
    localStorage.removeItem("user");
    setCurrentUser(null);

    // Try to sign out of Supabase too (ignore errors if offline)
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("⚠️ Supabase signOut failed (offline?):", err.message);
    }
  };

  // =========================
  // AUTH LISTENER (with offline fallback + timeout safety)
  // =========================
  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      try {
        // Race Supabase against a 8s timeout so we never hang forever
        const userPromise = supabase.auth.getUser();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Auth timeout")), 8000)
        );

        const {
          data: { user },
        } = await Promise.race([userPromise, timeoutPromise]);

        if (!isMounted) return;

        if (user) {
          // ✅ Supabase session exists
          setCurrentUser(user);
        } else {
          // No Supabase user → check localStorage fallback (offline admin)
          const stored = localStorage.getItem("user");
          setCurrentUser(stored ? JSON.parse(stored) : null);
        }
      } catch (err) {
        // ❌ Supabase unreachable / timed out → use localStorage fallback
        console.warn(
          "⚠️ Supabase unreachable in AuthContext, using localStorage:",
          err.message
        );
        if (!isMounted) return;
        const stored = localStorage.getItem("user");
        setCurrentUser(stored ? JSON.parse(stored) : null);
      } finally {
        // ✅ CRITICAL: always stop loading, even on error/timeout
        if (isMounted) setLoading(false);
      }
    };

    getUser();

    // Listen for Supabase auth changes (login/logout when online)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setCurrentUser(session.user);
      } else {
        // Supabase logged out → fall back to localStorage if present
        const stored = localStorage.getItem("user");
        setCurrentUser(stored ? JSON.parse(stored) : null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
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