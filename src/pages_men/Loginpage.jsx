import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ADMIN = {
  email: "favourabel150@gmail.com",
  password: "88888888", // FIXED (must match real value)
};

export default function Loginpage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      const user = data?.user;

      if (!user) {
        alert("Login failed: no user returned");
        setLoading(false);
        return;
      }

      // ADMIN CHECK (unchanged logic)
      if (user.email === ADMIN.email) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: user.email,
            role: "admin",
          })
        );

        navigate("/admin");
        return;
      }

      // NORMAL USER
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          role: "user",
        })
      );

      navigate("/dashboard");
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans">
      
      {/* LEFT SIDE - UNIVERSITY BRANDING (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 relative flex-col justify-center items-center overflow-hidden">
        {/* Decorative Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#07162d] to-slate-800"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

        {/* Branding Content */}
        <div className="relative z-10 text-center px-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-wide">
            Unicode University
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-md mx-auto font-light">
            Welcome to the official university portal. Empowering students and staff for a brighter tomorrow.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 min-h-screen md:min-h-0">
        
        <div className="w-full max-w-md bg-white md:bg-transparent shadow-2xl md:shadow-none rounded-2xl p-8 md:p-0">
          
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Portal Login</h2>
            <p className="text-slate-500 text-sm md:text-base">
              Please enter your university credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                University Email
              </label>
              <input
                type="email"
                placeholder="e.g. student@unicode.edu"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-xl hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-lg shadow-slate-900/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                "Secure Login"
              )}
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}