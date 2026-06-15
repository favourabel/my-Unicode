import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Added for mobile menu

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      const authUser = JSON.parse(localStorage.getItem("user"));
      if (!authUser) {
        navigate("/login");
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("Email", authUser.email)
        .single();
      if (error) {
        console.log("PROFILE FETCH ERROR:", error.message);
        return;
      }
      setUser(data);
    };
    loadUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setShowLogoutModal(false);
    setTimeout(() => { navigate("/login"); }, 500);
  };

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Loading student data...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* MOBILE HAMBURGER OVERLAY */}
      <div className="md:hidden p-4 fixed top-0 left-0 z-50">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 bg-slate-900 text-white rounded-lg h-[50px] w-[50px]">
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} md:static md:flex flex-col justify-between shadow-xl`}>
        
        <div className="p-6 mt-16 md:mt-0">
          <h1 className="text-sm font-bold tracking-wider text-white uppercase mb-8">Student Portal</h1>
          <ul className="flex flex-col gap-2 font-medium">
            <li className="bg-slate-800 text-white px-4 py-3 rounded-lg cursor-pointer">Dashboard</li>
            <li className="px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">Profile</li>
            <li className="px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">Courses</li>
            <li className="px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">Settings</li>
          </ul>
        </div>

        <div className="p-6 border-t border-slate-700/50">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-red-500/10 text-red-400 font-semibold py-3 rounded-lg hover:bg-red-500 hover:text-white transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-5 md:p-10 overflow-y-auto w-full mt-16 md:mt-0">
        <div className="bg-gradient-to-r from-[#07162d] to-slate-800 p-8 rounded-2xl shadow-md mb-8 text-white relative overflow-hidden">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Hi, {user.FullName}</h1>
          <p className="text-slate-300 text-lg">Welcome to your student dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500"><p className="text-xs font-semibold text-slate-500 uppercase mb-2">Email</p><b className="text-sm md:text-lg text-slate-800 truncate block">{user.Email}</b></div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-purple-500"><p className="text-xs font-semibold text-slate-500 uppercase mb-2">Nationality</p><b className="text-lg text-slate-800 block">{user.Nationality || "-"}</b></div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-pink-500"><p className="text-xs font-semibold text-slate-500 uppercase mb-2">DOB</p><b className="text-lg text-slate-800 block">{user.DateofBirth || "-"}</b></div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">Student Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div><p className="text-sm text-slate-500">Full Name</p><p className="font-semibold text-slate-800">{user.FullName}</p></div>
            <div><p className="text-sm text-slate-500">Email</p><p className="font-semibold text-slate-800">{user.Email}</p></div>
            <div className="sm:col-span-2"><p className="text-sm text-slate-500">Address</p><p className="font-semibold text-slate-800">{user.HouseAddress}</p></div>
          </div>
        </div>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Ready to leave?</h2>
            <div className="flex justify-between gap-4 mt-6">
              <button onClick={() => setShowLogoutModal(false)} className="w-full bg-slate-100 py-3 rounded-xl font-semibold">Cancel</button>
              <button onClick={handleLogout} className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}