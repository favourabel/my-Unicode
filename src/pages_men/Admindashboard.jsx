import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ADMIN = {
  email: "gift067@gmail.com",
  password: "88888888",
};

export default function Admindashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false); // MOBILE SIDEBAR

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    if (!loggedUser) {
      navigate("/login");
      return;
    }

    if (
      loggedUser.role !== "admin" ||
      loggedUser.email !== ADMIN.email
    ) {
      navigate("/dashboard");
      return;
    }

    const loadStudents = () => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const onlyStudents = users.filter(
        (user) => user.role === "student"
      );

      setStudents(onlyStudents);
    };

    loadStudents();

    const handleStudentUpdate = () => {
      loadStudents();
    };

    window.addEventListener("studentsUpdated", handleStudentUpdate);
    window.addEventListener("storage", (e) => {
      if (e.key === "users") loadStudents();
    });

    return () => {
      window.removeEventListener("studentsUpdated", handleStudentUpdate);
    };
  }, [navigate]);

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to log out?"
    );

    if (confirmLogout) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">

      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-[#0f172a] text-white p-4 flex justify-between items-center">
        <h2>Admin</h2>

        <button
          onClick={() => setOpen(!open)}
          className="text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`bg-[#0f172a] text-white p-5 md:w-[220px] w-full ${
          open ? "block" : "hidden"
        } md:block`}
      >
        <h2>University Admin</h2>

        <div className="mt-[30px] flex flex-col gap-[15px]">
          <p onClick={() => navigate("/admin")} className="cursor-pointer">
            Dashboard
          </p>

          <p onClick={() => navigate("/students")} className="cursor-pointer">
            Students
          </p>

          <p
            onClick={handleLogout}
            className="cursor-pointer text-red-500 font-bold"
          >
            Logout
          </p>
        </div>
      </div>

      {/* MAIN DASHBOARD */}
      <div className="flex-1 p-5 bg-[#f1f5f9]">

        <h2>Dashboard Overview</h2>

        {/* STATISTICS */}
        <div className="flex flex-col md:flex-row gap-4 mt-5">

          <div className="bg-blue-600 text-white p-4 rounded-lg flex-1">
            <h3>Total Students</h3>
            <h1>{students.length}</h1>
          </div>

          <div className="bg-green-600 text-white p-4 rounded-lg flex-1">
            <h3>Active Students</h3>
            <h1>{students.length}</h1>
          </div>

          <div className="bg-orange-500 text-white p-4 rounded-lg flex-1">
            <h3>Pending</h3>
            <h1>0</h1>
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white mt-6 p-5 rounded-lg overflow-x-auto">

          <h2>Registered Students</h2>

          <table className="w-full border-collapse mt-5 min-w-[600px]">

            <thead>
              <tr>
                <th className="border p-3">S/N</th>
                <th className="border p-3">First Name</th>
                <th className="border p-3">Last Name</th>
                <th className="border p-3">Email</th>
              </tr>
            </thead>

            <tbody>
              {students.length > 0 ? (
                students.map((student, index) => (
                  <tr key={index}>
                    <td className="border p-3">{index + 1}</td>
                    <td className="border p-3">{student.firstName || "-"}</td>
                    <td className="border p-3">{student.lastName || "-"}</td>
                    <td className="border p-3">{student.email || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-5">
                    No students registered yet
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}