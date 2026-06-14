import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      const authUser = JSON.parse(localStorage.getItem("user"));

      if (!authUser) {
        navigate("/login");
        return;
      }

      // 🔥 FETCH REAL DATA FROM SUPABASE
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

    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-full md:w-[250px] bg-white shadow-lg p-5">

        <h1 className="text-xl font-bold mb-6">Student Panel</h1>

        <ul className="space-y-4 text-gray-600">
          <li className="font-semibold text-blue-600">Dashboard</li>
          <li>Profile</li>
          <li>Courses</li>
          <li>Settings</li>
        </ul>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="mt-10 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-6">

        {/* HEADER */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-6">
          <h1 className="text-xl md:text-2xl font-bold">
            Hi, {user.FullName}
          </h1>
          <p className="text-gray-500">
            Welcome to your student dashboard
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-yellow-300 p-4 rounded-xl">
            Email<br />
            <b>{user.Email}</b>
          </div>

          <div className="bg-purple-300 p-4 rounded-xl">
            Nationality<br />
            <b>{user.Nationality}</b>
          </div>

          <div className="bg-pink-300 p-4 rounded-xl">
            DOB<br />
            <b>{user.DateofBirth}</b>
          </div>

        </div>

        {/* PROFILE */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow">

          <h2 className="text-xl font-bold mb-4">
            Student Information
          </h2>

          <div className="space-y-3 text-gray-700">

            <p><b>Full Name:</b> {user.FullName}</p>
            <p><b>Email:</b> {user.Email}</p>
            <p><b>Date of Birth:</b> {user.DateofBirth}</p>
            <p><b>Nationality:</b> {user.Nationality}</p>
            <p><b>Address:</b> {user.HouseAddress}</p>

          </div>

        </div>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] md:w-[320px] text-center">

            <h2 className="text-lg font-bold mb-4">
              Are you sure you want to logout?
            </h2>

            <div className="flex justify-between gap-4">

              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full bg-gray-300 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded-lg"
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}