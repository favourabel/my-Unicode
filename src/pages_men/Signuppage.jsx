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

    if (!formData.FullName.trim()) submitErrors.FullName = "Please input your full name";
    if (!formData.Email.trim()) submitErrors.Email = "Email is required";
    if (!formData.Password) submitErrors.Password = "Password is required";
    if (formData.Password !== formData.ConfirmPassword) submitErrors.ConfirmPassword = "Passwords do not match";
    if (!formData.Nationality.trim()) submitErrors.Nationality = "Please input your country";
    if (!formData.HouseAddress.trim()) submitErrors.HouseAddress = "Please input your address";

    setErrors(submitErrors);
    if (Object.keys(submitErrors).length > 0) return;

    try {
      const cleanEmail = formData.Email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: formData.Password,
      });

      if (error) {
        setErrors({ general: error.message });
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{
          FullName: formData.FullName.trim(),
          Email: cleanEmail,
          Password: formData.Password,
          DateofBirth: formData.DateofBirth || null,
          Nationality: formData.Nationality.trim(),
          HouseAddress: formData.HouseAddress.trim(),
        }]);

      if (profileError) {
        setErrors({ general: profileError.message });
        return;
      }

      navigate("/login");
    } catch (err) {
      setErrors({ general: "Signup failed. Try again." });
    }
  };

  const inputStyles = "w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none";
  const labelStyles = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="text-gray-500 mt-2">Join the Unicode University community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelStyles}>Full Name</label>
              <input name="FullName" placeholder="John Doe" onChange={handleChange} className={inputStyles} />
              {errors.FullName && <p className="text-red-500 text-xs mt-1">{errors.FullName}</p>}
            </div>
            <div>
              <label className={labelStyles}>Email Address</label>
              <input name="Email" type="email" placeholder="john@university.edu" onChange={handleChange} className={inputStyles} />
              {errors.Email && <p className="text-red-500 text-xs mt-1">{errors.Email}</p>}
            </div>
            <div>
              <label className={labelStyles}>Password</label>
              <input name="Password" type="password" placeholder="••••••••" onChange={handleChange} className={inputStyles} />
              {errors.Password && <p className="text-red-500 text-xs mt-1">{errors.Password}</p>}
            </div>
            <div>
              <label className={labelStyles}>Confirm Password</label>
              <input name="ConfirmPassword" type="password" placeholder="••••••••" onChange={handleChange} className={inputStyles} />
              {errors.ConfirmPassword && <p className="text-red-500 text-xs mt-1">{errors.ConfirmPassword}</p>}
            </div>
          </div>

          <div>
            <label className={labelStyles}>Date of Birth</label>
            <input name="DateofBirth" type="date" onChange={handleChange} className={inputStyles} />
          </div>

          <div>
            <label className={labelStyles}>Nationality</label>
            <input name="Nationality" placeholder="e.g. Nigeria" onChange={handleChange} className={inputStyles} />
            {errors.Nationality && <p className="text-red-500 text-xs mt-1">{errors.Nationality}</p>}
          </div>

          <div>
            <label className={labelStyles}>House Address</label>
            <input name="HouseAddress" placeholder="123 University Ave, City" onChange={handleChange} className={inputStyles} />
            {errors.HouseAddress && <p className="text-red-500 text-xs mt-1">{errors.HouseAddress}</p>}
          </div>

          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
              {errors.general}
            </div>
          )}

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-blue-200 mt-4">
            Register Student
          </button>
        </form>
      </div>
    </div>
  );
}