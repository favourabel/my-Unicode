import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const ADMIN = {
  email: "favourabel150@gmail.com",
  password: "88888888",
};

export default function Admindashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false); // Used for mobile sidebar toggle

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    if (!loggedUser) {
      navigate("/login");
      return;
    }

    if (loggedUser.role !== "admin" || loggedUser.email !== ADMIN.email) {
      navigate("/dashboard");
      return;
    }

    const loadStudents = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student");

      if (error) {
        console.log("FETCH ERROR:", error.message);
        return;
      }
      setStudents(data);
    };

    loadStudents();

    const handleStudentUpdate = () => loadStudents();
    window.addEventListener("studentsUpdated", handleStudentUpdate);
    return () => window.removeEventListener("studentsUpdated", handleStudentUpdate);
  }, [navigate]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* MOBILE HAMBURGER BUTTON */}
      <div className="md:hidden p-4 fixed top-0 left-0 z-50">
        <button 
          onClick={() => setOpen(!open)} 
          className="p-2 bg-slate-900 text-white rounded-lg shadow-lg h-[50px] w-[50px]"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:static md:block shadow-xl`}
      >
        <div className="p-6 mt-16 md:mt-0">
          <h2 className="text-white text-sm font-bold tracking-widest mb-8 uppercase">
            Admin Portal
          </h2>

          <div className="flex flex-col gap-2 font-medium">
            <p 
              onClick={() => navigate("/admin")} 
              className="cursor-pointer px-4 py-3 rounded-lg bg-slate-800 text-white transition-colors"
            >
              Dashboard
            </p>
            <p 
              onClick={() => navigate("/students")} 
              className="cursor-pointer px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
            >
              Students
            </p>

            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <p
                onClick={handleLogout}
                className="cursor-pointer px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                Logout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto mt-16 md:mt-0 w-full">

        <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard Overview</h1>

        {/* STATISTICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</h3>
            <h1 className="text-4xl font-bold text-slate-800 mt-2">{students.length}</h1>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Students</h3>
            <h1 className="text-4xl font-bold text-slate-800 mt-2">{students.length}</h1>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-orange-400">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Approvals</h3>
            <h1 className="text-4xl font-bold text-slate-800 mt-2">0</h1>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Registered Students</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">S/N</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Full Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length > 0 ? (
                  students.map((student, index) => (
                    <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-slate-800 font-medium">{student.FullName || "-"}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{student.Email || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-10 text-center text-slate-500">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}