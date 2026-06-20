import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Globe,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Shield,
  BookOpen,
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Hash,
  Building2,
  Layers,
  BookMarked,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Course Registration",
    description: "Register and manage your courses seamlessly each semester.",
  },
  {
    icon: Award,
    title: "Results & Transcripts",
    description: "Access your grades, CGPA trends, and download transcripts.",
  },
  {
    icon: Users,
    title: "Student Community",
    description: "Connect with peers, join groups, and collaborate on projects.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Enterprise-grade encryption protects all your academic data.",
  },
];

const stats = [
  { value: "15K+", label: "Students" },
  { value: "500+", label: "Courses" },
  { value: "98%", label: "Satisfaction" },
  { value: "50+", label: "Departments" },
];

const departments = [
  "Computer Science",
  "Information Technology",
  "Software Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Accounting",
  "Economics",
  "Medicine & Surgery",
  "Nursing Science",
  "Law",
  "Mass Communication",
  "English & Literature",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Microbiology",
  "Biochemistry",
];

const levels = ["100", "200", "300", "400", "500", "600"];

const sessions = ["First Semester", "Second Semester"];

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
    MatricNumber: "",
    Department: "",
    Level: "",
    Session: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [currentFeature, setCurrentFeature] = useState(0);

  // ── Auto-rotate features carousel ──
  useState(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let submitErrors = {};

    if (!formData.FullName.trim()) submitErrors.FullName = "Please input your full name";
    if (!formData.Email.trim()) submitErrors.Email = "Email is required";
    if (!formData.Password) submitErrors.Password = "Password is required";
    if (formData.Password !== formData.ConfirmPassword)
      submitErrors.ConfirmPassword = "Passwords do not match";
    if (!formData.Nationality.trim()) submitErrors.Nationality = "Please input your country";
    if (!formData.HouseAddress.trim()) submitErrors.HouseAddress = "Please input your address";
    if (!formData.MatricNumber.trim()) submitErrors.MatricNumber = "Please input your matric number";
    if (!formData.Department) submitErrors.Department = "Please select your department";
    if (!formData.Level) submitErrors.Level = "Please select your level";
    if (!formData.Session) submitErrors.Session = "Please select your session";

    setErrors(submitErrors);
    if (Object.keys(submitErrors).length > 0) return;

    setLoading(true);

    try {
      const cleanEmail = formData.Email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: formData.Password,
      });

      if (error) {
        setErrors({ general: error.message });
        setLoading(false);
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert([
        {
          FullName: formData.FullName.trim(),
          Email: cleanEmail,
          Password: formData.Password,
          DateofBirth: formData.DateofBirth || null,
          Nationality: formData.Nationality.trim(),
          HouseAddress: formData.HouseAddress.trim(),
          MatricNumber: formData.MatricNumber.trim(),
          Department: formData.Department,
          Level: formData.Level,
          Session: formData.Session,
        },
      ]);

      if (profileError) {
        setErrors({ general: profileError.message });
        setLoading(false);
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErrors({ general: "Signup failed. Try again." });
      setLoading(false);
    }
  };

  // ── Text/date/email field configs ──
  const textFields = [
    {
      name: "FullName",
      label: "Full Name",
      type: "text",
      placeholder: "John Doe",
      icon: User,
      colSpan: 1,
    },
    {
      name: "Email",
      label: "University Email",
      type: "email",
      placeholder: "john@unicode.edu",
      icon: Mail,
      colSpan: 1,
    },
    {
      name: "MatricNumber",
      label: "Matric Number",
      type: "text",
      placeholder: "UNI/2021/0001",
      icon: Hash,
      colSpan: 1,
    },
    {
      name: "Password",
      label: "Password",
      type: "password",
      placeholder: "Create a strong password",
      icon: Lock,
      colSpan: 1,
      isPassword: true,
      toggleKey: "password",
    },
    {
      name: "ConfirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Repeat your password",
      icon: Lock,
      colSpan: 1,
      isPassword: true,
      toggleKey: "confirm",
    },
    {
      name: "DateofBirth",
      label: "Date of Birth",
      type: "date",
      placeholder: "",
      icon: Calendar,
      colSpan: 1,
    },
    {
      name: "Nationality",
      label: "Nationality",
      type: "text",
      placeholder: "e.g. Nigeria",
      icon: Globe,
      colSpan: 1,
    },
    {
      name: "HouseAddress",
      label: "House Address",
      type: "text",
      placeholder: "123 University Ave, City",
      icon: MapPin,
      colSpan: 2,
    },
  ];

  // ── Dropdown field configs ──
  const dropdownFields = [
    {
      name: "Department",
      label: "Department",
      icon: Building2,
      options: departments,
      placeholder: "Select your department",
      colSpan: 2,
    },
    {
      name: "Level",
      label: "Level",
      icon: Layers,
      options: levels,
      placeholder: "Select level",
      colSpan: 1,
      formatOption: (opt) => `${opt} Level`,
    },
    {
      name: "Session",
      label: "Session / Semester",
      icon: BookMarked,
      options: sessions,
      placeholder: "Select semester",
      colSpan: 1,
    },
  ];

  const getShowPassword = (toggleKey) =>
    toggleKey === "password" ? showPassword : showConfirmPassword;

  const togglePassword = (toggleKey) => {
    if (toggleKey === "password") setShowPassword((s) => !s);
    else setShowConfirmPassword((s) => !s);
  };

  const getInputType = (field) => {
    if (!field.isPassword) return field.type;
    return getShowPassword(field.toggleKey) ? "text" : "password";
  };

  // ── Reusable input wrapper classes ──
  const inputWrapperClass = (name) => {
    const isFocused = focusedField === name;
    const hasError = !!errors[name];
    return `relative flex items-center rounded-xl border-2 transition-all duration-300 bg-white ${
      hasError
        ? "border-red-400 shadow-sm shadow-red-100"
        : isFocused
        ? "border-blue-500 shadow-lg shadow-blue-500/10 ring-4 ring-blue-500/5"
        : "border-slate-200 hover:border-slate-300"
    }`;
  };

  const iconClass = (name) => {
    const isFocused = focusedField === name;
    const hasError = !!errors[name];
    return `transition-colors duration-300 ${
      hasError ? "text-red-400" : isFocused ? "text-blue-500" : "text-slate-400"
    }`;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans overflow-hidden">

      {/* ════════════════════════════════════════════════ */}
      {/* LEFT PANEL                                       */}
      {/* ════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col justify-between overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#040e1d] via-[#07162d] to-[#0c2340]" />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] opacity-[0.07]" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[140px] opacity-[0.06]" />
          <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-cyan-400 rounded-full mix-blend-screen filter blur-[100px] opacity-[0.04]" />
        </div>

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 p-8 flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <GraduationCap className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">Unicode</h2>
            <p className="text-blue-300/60 text-[10px] uppercase tracking-[0.2em] font-medium">University</p>
          </div>
        </motion.div>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-8"
            />
            <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white leading-tight mb-5">
              Begin Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Academic Journey
              </span>
              <br />
              Today.
            </h1>
            <p className="text-slate-400 text-base max-w-sm leading-relaxed mb-8">
              Join thousands of students at Unicode University. Register once and access everything — courses, results, timetables, and more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 max-w-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-start gap-4"
                >
                  {(() => {
                    const Icon = features[currentFeature].icon;
                    return (
                      <>
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="text-blue-400" size={20} />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-sm mb-1">
                            {features[currentFeature].title}
                          </h3>
                          <p className="text-slate-400 text-xs leading-relaxed">
                            {features[currentFeature].description}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
                <div className="flex gap-1.5">
                  {features.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentFeature(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === currentFeature
                          ? "w-8 bg-gradient-to-r from-blue-500 to-indigo-500"
                          : "w-1.5 bg-slate-600 hover:bg-slate-500"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentFeature((p) => (p === 0 ? features.length - 1 : p - 1))}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => setCurrentFeature((p) => (p + 1) % features.length)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="relative z-10 p-8 xl:px-16"
        >
          <div className="flex items-center gap-6 xl:gap-10">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.1 }}
              >
                <p className="text-xl xl:text-2xl font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════════════ */}
      {/* RIGHT PANEL — SIGNUP FORM                        */}
      {/* ════════════════════════════════════════════════ */}
      <div className="w-full lg:flex-1 flex flex-col min-h-screen">

        {/* Mobile branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-gradient-to-br from-[#040e1d] via-[#07162d] to-[#0c2340] p-6 pb-10"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <GraduationCap className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-white font-bold leading-tight">Unicode University</h2>
              <p className="text-blue-300/50 text-[9px] uppercase tracking-[0.2em]">Student Portal</p>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            Create Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Account
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Join the Unicode University community today.
          </p>
        </motion.div>

        {/* Form scroll container */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex items-start lg:items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 -mt-5 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="w-full max-w-[580px]"
            >
              {/* Desktop header */}
              <div className="hidden lg:block mb-8">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl xl:text-4xl font-bold text-slate-900 mb-2"
                >
                  Create Account
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-slate-500"
                >
                  Join the Unicode University community today.
                </motion.p>
              </div>

              {/* Progress indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-2 mb-6"
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <span className="text-xs font-semibold text-blue-600">Personal Info</span>
                </div>
                <div className="flex-1 h-px bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-400 text-xs font-bold">2</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Verification</span>
                </div>
                <div className="flex-1 h-px bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-400 text-xs font-bold">3</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Access</span>
                </div>
              </motion.div>

              {/* General error */}
              <AnimatePresence>
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-5 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                      <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-600 font-medium">{errors.general}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-5 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                      <p className="text-sm text-emerald-600 font-medium">{success}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── FORM ── */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* ── Section Label: Personal Info ── */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="flex items-center gap-2 mb-1"
                >
                  <User size={13} className="text-blue-500" />
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                    Personal Information
                  </span>
                  <div className="flex-1 h-px bg-blue-100" />
                </motion.div>

                {/* ── Text / Date / Email Fields ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {textFields.map((field, i) => {
                    const Icon = field.icon;
                    const isFullWidth = field.colSpan === 2;

                    return (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.06 }}
                        className={isFullWidth ? "sm:col-span-2" : ""}
                      >
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                          {field.label}
                          {field.name !== "DateofBirth" && (
                            <span className="text-red-400 ml-1">*</span>
                          )}
                        </label>
                        <div className={inputWrapperClass(field.name)}>
                          <div className="pl-3.5 pr-1 flex-shrink-0">
                            <Icon size={16} className={iconClass(field.name)} />
                          </div>
                          <input
                            name={field.name}
                            type={getInputType(field)}
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={handleChange}
                            onFocus={() => setFocusedField(field.name)}
                            onBlur={() => setFocusedField(null)}
                            className="w-full py-3 px-2.5 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm"
                          />
                          {/* Password toggle */}
                          {field.isPassword && (
                            <button
                              type="button"
                              onClick={() => togglePassword(field.toggleKey)}
                              className="pr-3.5 pl-1 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                              tabIndex={-1}
                            >
                              {getShowPassword(field.toggleKey) ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          )}
                          {/* Valid check for email */}
                          {field.name === "Email" &&
                            formData.Email.includes("@") &&
                            formData.Email.includes(".") && (
                              <div className="pr-3.5">
                                <CheckCircle size={14} className="text-emerald-500" />
                              </div>
                            )}
                          {/* Password match check */}
                          {field.name === "ConfirmPassword" &&
                            formData.ConfirmPassword &&
                            formData.Password === formData.ConfirmPassword && (
                              <div className="pr-3.5">
                                <CheckCircle size={14} className="text-emerald-500" />
                              </div>
                            )}
                          {/* Matric number check */}
                          {field.name === "MatricNumber" &&
                            formData.MatricNumber.trim().length >= 5 && (
                              <div className="pr-3.5">
                                <CheckCircle size={14} className="text-emerald-500" />
                              </div>
                            )}
                        </div>

                        <AnimatePresence>
                          {errors[field.name] && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex items-center gap-1 text-red-500 text-xs mt-1.5 font-medium overflow-hidden"
                            >
                              <AlertCircle size={11} />
                              {errors[field.name]}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>

                {/* ── Section Label: Academic Info ── */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-center gap-2 pt-2"
                >
                  <GraduationCap size={13} className="text-indigo-500" />
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                    Academic Information
                  </span>
                  <div className="flex-1 h-px bg-indigo-100" />
                </motion.div>

                {/* ── Dropdown Fields ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dropdownFields.map((field, i) => {
                    const Icon = field.icon;
                    const isFullWidth = field.colSpan === 2;
                    const isFocused = focusedField === field.name;
                    const hasError = !!errors[field.name];

                    return (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.95 + i * 0.07 }}
                        className={isFullWidth ? "sm:col-span-2" : ""}
                      >
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                          {field.label}
                          <span className="text-red-400 ml-1">*</span>
                        </label>

                        <div
                          className={`relative flex items-center rounded-xl border-2 transition-all duration-300 bg-white ${
                            hasError
                              ? "border-red-400 shadow-sm shadow-red-100"
                              : isFocused
                              ? "border-blue-500 shadow-lg shadow-blue-500/10 ring-4 ring-blue-500/5"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="pl-3.5 pr-1 flex-shrink-0">
                            <Icon
                              size={16}
                              className={`transition-colors duration-300 ${
                                hasError
                                  ? "text-red-400"
                                  : isFocused
                                  ? "text-blue-500"
                                  : "text-slate-400"
                              }`}
                            />
                          </div>

                          <select
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            onFocus={() => setFocusedField(field.name)}
                            onBlur={() => setFocusedField(null)}
                            className="w-full py-3 px-2.5 bg-transparent outline-none text-slate-800 text-sm appearance-none cursor-pointer"
                          >
                            <option value="" disabled>
                              {field.placeholder}
                            </option>
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {field.formatOption ? field.formatOption(opt) : opt}
                              </option>
                            ))}
                          </select>

                          {/* Custom chevron */}
                          <div className="pr-3.5 pl-1 flex-shrink-0 pointer-events-none">
                            <ChevronRight
                              size={15}
                              className={`rotate-90 transition-transform duration-300 ${
                                isFocused ? "text-blue-500 rotate-[270deg]" : "text-slate-400"
                              }`}
                            />
                          </div>

                          {/* Valid check */}
                          {formData[field.name] && !hasError && (
                            <div className="pr-2 flex-shrink-0">
                              <CheckCircle size={14} className="text-emerald-500" />
                            </div>
                          )}
                        </div>

                        <AnimatePresence>
                          {hasError && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex items-center gap-1 text-red-500 text-xs mt-1.5 font-medium overflow-hidden"
                            >
                              <AlertCircle size={11} />
                              {errors[field.name]}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Password strength indicator */}
                {formData.Password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-1.5 mb-1">
                      {[1, 2, 3, 4].map((level) => {
                        const strength =
                          formData.Password.length >= 8 &&
                          /[A-Z]/.test(formData.Password) &&
                          /[0-9]/.test(formData.Password) &&
                          /[^A-Za-z0-9]/.test(formData.Password)
                            ? 4
                            : formData.Password.length >= 8 &&
                              (/[A-Z]/.test(formData.Password) ||
                                /[0-9]/.test(formData.Password))
                            ? 3
                            : formData.Password.length >= 6
                            ? 2
                            : 1;
                        return (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              level <= strength
                                ? strength === 1
                                  ? "bg-red-400"
                                  : strength === 2
                                  ? "bg-amber-400"
                                  : strength === 3
                                  ? "bg-blue-400"
                                  : "bg-emerald-400"
                                : "bg-slate-200"
                            }`}
                          />
                        );
                      })}
                    </div>
                    <p className="text-xs text-slate-400">
                      Password strength:{" "}
                      <span
                        className={`font-semibold ${
                          formData.Password.length < 6
                            ? "text-red-500"
                            : formData.Password.length < 8
                            ? "text-amber-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {formData.Password.length < 6
                          ? "Weak"
                          : formData.Password.length < 8
                          ? "Fair"
                          : /[A-Z]/.test(formData.Password) &&
                            /[0-9]/.test(formData.Password)
                          ? "Strong"
                          : "Good"}
                      </span>
                    </p>
                  </motion.div>
                )}

                {/* Terms */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="text-xs text-slate-400 leading-relaxed"
                >
                  By registering, you agree to Unicode University's{" "}
                  <button type="button" className="text-blue-600 hover:underline font-medium">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button type="button" className="text-blue-600 hover:underline font-medium">
                    Privacy Policy
                  </button>
                  .
                </motion.p>

                {/* Submit button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <motion.button
                    type="submit"
                    disabled={loading || !!success}
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className={`
                      w-full relative overflow-hidden font-bold text-base py-4 rounded-xl
                      transition-all duration-300 flex items-center justify-center gap-2
                      disabled:cursor-not-allowed
                      ${
                        success
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                          : loading
                          ? "bg-blue-600 text-white"
                          : "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl shadow-slate-900/25 hover:shadow-2xl disabled:opacity-60"
                      }
                    `}
                  >
                    {!loading && !success && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Creating Account...
                        </>
                      ) : success ? (
                        <>
                          <CheckCircle size={20} />
                          Account Created!
                        </>
                      ) : (
                        <>
                          Register Student
                          <ArrowRight size={18} />
                        </>
                      )}
                    </span>
                  </motion.button>
                </motion.div>
              </form>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="mt-6 pt-6 border-t border-slate-100"
              >
                <p className="text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition"
                  >
                    Sign in here
                  </button>
                </p>
              </motion.div>

              {/* Security badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="mt-5 flex items-center justify-center gap-2 text-slate-400"
              >
                <Shield size={13} />
                <span className="text-xs">256-bit SSL encrypted connection</span>
              </motion.div>

            </motion.div>
          </div>
        </div>

        {/* Mobile bottom stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="lg:hidden px-4 pb-6"
        >
          <div className="grid grid-cols-4 gap-2">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                <p className="text-base font-bold text-slate-800">{s.value}</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}