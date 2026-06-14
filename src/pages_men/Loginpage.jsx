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
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}