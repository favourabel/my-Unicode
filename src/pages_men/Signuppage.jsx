import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signuppage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    nationality: "",
    houseAddress: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedForm);

    let newErrors = { ...errors };

    if (name === "firstName") {
      if (!value.trim()) newErrors.firstName = "Please input your first name";
      else delete newErrors.firstName;
    }

    if (name === "lastName") {
      if (!value.trim()) newErrors.lastName = "Please input your last name";
      else delete newErrors.lastName;
    }

    if (name === "email") {
      if (!value.trim()) {
        newErrors.email = "Email is required";
      } else if (!value.includes("@")) {
        newErrors.email = "Email must include @";
      } else {
        delete newErrors.email;
      }
    }

    if (name === "password") {
      if (value.length < 6) newErrors.password = "Minimum password length is 6";
      else delete newErrors.password;
    }

    if (name === "confirmPassword") {
      if (value.length < 6) {
        newErrors.confirmPassword = "Minimum password length is 6";
      } else if (value !== updatedForm.password) {
        newErrors.confirmPassword = "Passwords do not match!";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    if (name === "nationality") {
      if (!value.trim()) newErrors.nationality = "Please input your country";
      else delete newErrors.nationality;
    }

    if (name === "houseAddress") {
      if (!value.trim()) newErrors.houseAddress = "Please input your address";
      else delete newErrors.houseAddress;
    }

    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let submitErrors = {};

    if (!formData.firstName.trim()) {
      submitErrors.firstName = "Please input your first name";
    }

    if (!formData.lastName.trim()) {
      submitErrors.lastName = "Please input your last name";
    }

    if (!formData.email.trim()) {
      submitErrors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      submitErrors.email = "Email must include @";
    }

    if (!formData.password) {
      submitErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      submitErrors.password = "Minimum password length is 6";
    }

    if (!formData.confirmPassword) {
      submitErrors.confirmPassword = "Confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      submitErrors.confirmPassword = "Passwords do not match!";
    }

    if (!formData.nationality.trim()) {
      submitErrors.nationality = "Please input your country";
    }

    if (!formData.houseAddress.trim()) {
      submitErrors.houseAddress = "Please input your address";
    }

    setErrors(submitErrors);

    if (Object.keys(submitErrors).length > 0) return;

    const existingUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    const emailExists = existingUsers.find(
      (user) => user.email === formData.email
    );

    if (emailExists) {
      alert("Email already exists!");
      return;
    }

    const newUser = {
      id: Date.now(),
      ...formData,
      role: "student",
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...existingUsers, newUser];

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    window.dispatchEvent(new Event("studentsUpdated"));

    alert("Signup Successful!");

    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            Student Signup
          </h2>

          <input
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            className="w-full mt-3 mb-1 p-3 border rounded-lg"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mb-3">{errors.firstName}</p>
          )}

          <input
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            className="w-full mt-3 mb-1 p-3 border rounded-lg"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mb-3">{errors.lastName}</p>
          )}

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full mt-3 mb-1 p-3 border rounded-lg"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-3">{errors.email}</p>
          )}

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full mt-3 mb-1 p-3 border rounded-lg"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-3">{errors.password}</p>
          )}

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full mt-3 mb-1 p-3 border rounded-lg"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mb-3">
              {errors.confirmPassword}
            </p>
          )}

          <input
            name="dateOfBirth"
            type="date"
            onChange={handleChange}
            className="w-full mt-3 mb-3 p-3 border rounded-lg"
          />

          <input
            name="nationality"
            placeholder="Nationality"
            onChange={handleChange}
            className="w-full mt-3 mb-1 p-3 border rounded-lg"
          />
          {errors.nationality && (
            <p className="text-red-500 text-sm mb-3">
              {errors.nationality}
            </p>
          )}

          <input
            name="houseAddress"
            placeholder="House Address"
            onChange={handleChange}
            className="w-full mt-3 mb-1 p-3 border rounded-lg"
          />
          {errors.houseAddress && (
            <p className="text-red-500 text-sm mb-5">
              {errors.houseAddress}
            </p>
          )}

          <button className="w-full bg-blue-500 text-white py-3 rounded-lg">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}