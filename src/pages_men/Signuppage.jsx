import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Signuppage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    DateofBirth: "",
    Nationality: "",
    HouseAddress: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let submitErrors = {};

    if (!formData.FullName.trim())
      submitErrors.FullName = "Please input your full name";

    if (!formData.Email.trim())
      submitErrors.Email = "Email is required";

    if (!formData.Password)
      submitErrors.Password = "Password is required";

    if (formData.Password !== formData.ConfirmPassword)
      submitErrors.ConfirmPassword = "Passwords do not match";

    if (!formData.Nationality.trim())
      submitErrors.Nationality = "Please input your country";

    if (!formData.HouseAddress.trim())
      submitErrors.HouseAddress = "Please input your address";

    setErrors(submitErrors);

    if (Object.keys(submitErrors).length > 0) return;

    try {
      // CLEAN EMAIL
      const cleanEmail = formData.Email.trim().toLowerCase();

      console.log("FORM DATA:", formData);

      // 1. CREATE AUTH USER
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: formData.Password,
      });

      if (error) {
        console.log("AUTH ERROR:", error.message);
        setErrors({ general: error.message });
        return;
      }

      const user = data?.user;

      console.log("USER:", user);

      if (!user) {
        setErrors({ general: "User creation failed" });
        return;
      }

      // 2. INSERT PROFILE (MATCH YOUR EXACT COLUMNS)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            FullName: formData.FullName.trim(),
            Email: cleanEmail,
            Password: formData.Password,
            DateofBirth: formData.DateofBirth || null,
            Nationality: formData.Nationality.trim(),
            HouseAddress: formData.HouseAddress.trim(),
          },
        ])
        .select();

      console.log("PROFILE ERROR:", profileError);
      console.log("PROFILE DATA:", profileData);

      if (profileError) {
        setErrors({ general: profileError.message });
        return;
      }

      navigate("/login");
    } catch (err) {
      console.log("CATCH ERROR:", err);
      setErrors({ general: "Signup failed. Try again." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 w-full max-w-lg">

        <input name="FullName" placeholder="Full Name" onChange={handleChange} className="w-full p-3 border mt-3" />

        <input name="Email" placeholder="Email" onChange={handleChange} className="w-full p-3 border mt-3" />

        <input name="Password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-3 border mt-3" />

        <input name="ConfirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} className="w-full p-3 border mt-3" />

        <input name="DateofBirth" type="date" onChange={handleChange} className="w-full p-3 border mt-3" />

        <input name="Nationality" placeholder="Nationality" onChange={handleChange} className="w-full p-3 border mt-3" />

        <input name="HouseAddress" placeholder="House Address" onChange={handleChange} className="w-full p-3 border mt-3" />

        {errors.general && (
          <p className="text-red-500 text-sm mt-2">{errors.general}</p>
        )}

        <button className="w-full bg-blue-500 text-white py-3 mt-4">
          Sign Up
        </button>
      </form>
    </div>
  );
}