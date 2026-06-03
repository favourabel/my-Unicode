import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN = {
  email: "gift067@gmail.com",
  password: "88888888",
  role: "admin",
};

export default function Loginpage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // 👑 ADMIN LOGIN (HIGHEST PRIORITY)
    if (
      cleanEmail === ADMIN.email &&
      cleanPassword === ADMIN.password
    ) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: ADMIN.email,
          role: "admin",
        })
      );

      setTimeout(() => {
        navigate("/admin");
      }, 500);

      return;
    }

    // 🎓 STUDENT LOGIN
    const studentUser = users.find(
      (u) =>
        u.email === cleanEmail &&
        u.password === cleanPassword
    );

    if (studentUser) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...studentUser,
          role: "student",
        })
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

      return;
    }

    // ❌ INVALID LOGIN
    alert("Invalid login details");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-[400px]">
        <h2 className="text-center text-2xl font-bold mb-6">
          Login
        </h2>

        <input
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  );
}