import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence, useInView } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  LayoutDashboard, User, BookOpen, GraduationCap, Calendar, Bell,
  Award, Settings, LogOut, Wallet, Menu, Moon, Sun, Search, X,
  CheckCircle, Plus, Trash2, ArrowUpDown, FileDown, Printer,
  Clock, MapPin, Megaphone, Inbox, Library, Headphones, Activity,
  Hash, Building2, Layers, BookMarked, ChevronRight, Shield, Globe,
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const [allCourses, setAllCourses] = useState([]);
  const [registered, setRegistered] = useState([]);
  const [results, setResults] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [timetableRows, setTimetableRows] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [confirmCourse, setConfirmCourse] = useState(null);
  const [courseQuery, setCourseQuery] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(false);

  const [regQuery, setRegQuery] = useState("");
  const [sortKey, setSortKey] = useState("CourseCode");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const navigate = useNavigate();

  // ── THEME ──
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ── AUTH + PROFILE ──
  useEffect(() => {
    const loadUser = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) { navigate("/login"); return; }

      const email = session.user.email;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("Email", email)
        .maybeSingle();

      if (error || !data) {
        toast.error("Profile not found. Please contact admin.");
        navigate("/login");
        return;
      }
      setUser(data);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) navigate("/login");
    });
    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  // ── LOGOUT ──
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowLogoutModal(false);
    navigate("/login");
  };

  // ── FETCH DATA ──
  useEffect(() => {
    if (!user?.Email) return;
    const fetchAllData = async () => {
      setDataLoading(true);
      try {
        const coursesRes = await supabase.from("courses").select("*");
        if (!coursesRes.error) setAllCourses(coursesRes.data || []);

        const registeredRes = await supabase
          .from("registered_courses").select("*").eq("StudentEmail", user.Email);
        if (!registeredRes.error) setRegistered(registeredRes.data || []);

        const resultsRes = await supabase
          .from("results").select("*").eq("Email", user.Email);
        if (!resultsRes.error) setResults(resultsRes.data || []);

        const performanceRes = await supabase
          .from("performance").select("*").eq("Email", user.Email);
        if (!performanceRes.error) setPerformanceData(performanceRes.data || []);

        const timetableRes = await supabase
          .from("timetable").select("*").eq("Email", user.Email);
        if (!timetableRes.error) setTimetableRows(timetableRes.data || []);

        const announcementsRes = await supabase
          .from("announcements").select("*").order("created_at", { ascending: false });
        if (!announcementsRes.error) setAnnouncements(announcementsRes.data || []);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setDataLoading(false);
      }
    };
    fetchAllData();
  }, [user]);

  // ── DERIVED DATA ──
  const totalUnits = registered.reduce((s, c) => s + (Number(c.Units) || Number(c.units) || 0), 0);
  const currentCGPA = performanceData.length
    ? Number(performanceData[performanceData.length - 1]?.CGPA ||
      performanceData[performanceData.length - 1]?.cgpa) || 0 : 0;
  const completedCount = results.filter(
    (r) => (r.Grade || r.grade || "").charAt(0).toUpperCase() !== "F"
  ).length;

  const cgpaTrend = performanceData.map((p) => ({
    semester: p.Semester || p.semester,
    cgpa: Number(p.CGPA || p.cgpa) || 0,
  }));
  const semesterChartData = performanceData.map((p) => ({
    semester: p.Semester || p.semester,
    gpa: Number(p.GPA || p.gpa) || 0,
  }));

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const schedule = useMemo(() => {
    const grouped = {};
    days.forEach((d) => (grouped[d] = []));
    timetableRows.forEach((row) => {
      const day = row.Day || row.day;
      if (grouped[day]) grouped[day].push(row);
    });
    return grouped;
  }, [timetableRows]);

  const stats = {
    cgpa: currentCGPA,
    registered: registered.length,
    completed: completedCount,
    pending: registered.length,
    attendance: Number(user?.Attendance) || 0,
    fees: Number(user?.OutstandingFees) || 0,
  };

  const isRegistered = (courseCode) =>
    registered.some(
      (r) => (r.CourseCode || r.code || r.Code || "").toLowerCase() ===
        (courseCode || "").toLowerCase()
    );

  const handleRegister = async (course) => {
    const courseCode = course.CourseCode || course.code || course.Code;
    if (isRegistered(courseCode)) {
      toast.error("Course already registered");
      setConfirmCourse(null);
      return;
    }
    setActionLoading(true);
    const newRow = {
      StudentEmail: user.Email,
      CourseCode: courseCode,
      CourseTitle: course.CourseTitle || course.title || course.Title,
      Units: course.Units || course.units,
      Semester: course.Semester || course.semester,
      Lecturer: course.Lecturer || course.lecturer,
      Status: "Registered",
    };
    const { data, error } = await supabase
      .from("registered_courses").insert([newRow]).select().single();
    setActionLoading(false);
    setConfirmCourse(null);
    if (error) { toast.error("Failed to register: " + error.message); return; }
    setRegistered((p) => [...p, data]);
    toast.success(`${courseCode} registered successfully!`);
  };

  const handleDrop = async (courseCode) => {
    setActionLoading(true);
    const { error } = await supabase
      .from("registered_courses").delete()
      .eq("StudentEmail", user.Email).eq("CourseCode", courseCode);
    setActionLoading(false);
    if (error) { toast.error("Failed to drop: " + error.message); return; }
    setRegistered((p) =>
      p.filter((c) => (c.CourseCode || c.code || "").toLowerCase() !== courseCode.toLowerCase())
    );
    toast.success(`${courseCode} dropped successfully!`);
  };

  const filteredCourses = useMemo(() => {
    return allCourses.filter((c) => {
      const code = c.CourseCode || c.code || c.Code || "";
      const title = c.CourseTitle || c.title || c.Title || "";
      const semester = c.Semester || c.semester || "";
      const matchSem = semesterFilter === "all" || semester === semesterFilter;
      const matchQuery =
        code.toLowerCase().includes(courseQuery.toLowerCase()) ||
        title.toLowerCase().includes(courseQuery.toLowerCase());
      return matchSem && matchQuery;
    });
  }, [allCourses, courseQuery, semesterFilter]);

  const processedRegistered = useMemo(() => {
    let data = registered.filter((c) => {
      const code = c.CourseCode || c.code || "";
      const title = c.CourseTitle || c.title || "";
      return (
        code.toLowerCase().includes(regQuery.toLowerCase()) ||
        title.toLowerCase().includes(regQuery.toLowerCase())
      );
    });
    data.sort((a, b) => {
      const aVal = a[sortKey] || "";
      const bVal = b[sortKey] || "";
      return aVal > bVal ? 1 : -1;
    });
    return data;
  }, [registered, regQuery, sortKey]);

  const totalPages = Math.ceil(processedRegistered.length / perPage);
  const pagedRegistered = processedRegistered.slice((page - 1) * perPage, page * perPage);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Registered Courses", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [["Code", "Title", "Units", "Semester", "Lecturer", "Status"]],
      body: processedRegistered.map((c) => [
        c.CourseCode || c.code, c.CourseTitle || c.title,
        c.Units || c.units, c.Semester || c.semester,
        c.Lecturer || c.lecturer, c.Status || c.status || "Registered",
      ]),
    });
    doc.save("registered-courses.pdf");
  };

  const gradeColor = (grade) => {
    const map = {
      A: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
      B: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
      C: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
      D: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
      F: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
    };
    return map[(grade || "").charAt(0).toUpperCase()] || "bg-slate-100 text-slate-600";
  };

  const announcementColor = (type) => {
    const map = {
      Exam: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
      Registration: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
      Scholarship: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
      School: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
      Department: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400",
    };
    return map[type] || "bg-slate-100 text-slate-600";
  };

  const services = [
    { icon: BookOpen, label: "Course Registration", target: "courses", gradient: "from-blue-500 to-indigo-600" },
    { icon: Award, label: "Results", target: "results", gradient: "from-purple-500 to-fuchsia-600" },
    { icon: Wallet, label: "Fees", target: "fees", gradient: "from-emerald-500 to-teal-600" },
    { icon: Library, label: "Library", target: "dashboard", gradient: "from-amber-500 to-orange-600" },
    { icon: Calendar, label: "Academic Calendar", target: "timetable", gradient: "from-pink-500 to-rose-600" },
    { icon: Headphones, label: "Student Support", target: "dashboard", gradient: "from-cyan-500 to-blue-600" },
  ];

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "Course Registration", icon: BookOpen },
    { id: "registered", label: "My Courses", icon: GraduationCap },
    { id: "performance", label: "Performance", icon: Activity },
    { id: "results", label: "Results", icon: Award },
    { id: "timetable", label: "Timetable", icon: Calendar },
    { id: "announcements", label: "Announcements", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // ── ANIMATED COUNTER ──
  const Counter = ({ value = 0, decimals = 0, suffix = "" }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const [display, setDisplay] = useState(0);
    useEffect(() => {
      if (!inView) return;
      const end = parseFloat(value) || 0;
      const startTime = Date.now();
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / 1200, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(end * eased);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, [inView, value]);
    return <span ref={ref}>{display.toFixed(decimals)}{suffix}</span>;
  };

  const EmptyState = ({ icon: Icon = Inbox, title, subtitle }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center mb-4">
        <Icon className="text-slate-400" size={28} />
      </div>
      <h3 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
    </div>
  );

  // ── SECTION HEADER ──
  const SectionHeader = ({ icon: Icon, label, color = "blue" }) => {
    const colors = {
      blue: "text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20",
      indigo: "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20",
    };
    return (
      <div className="flex items-center gap-2 mb-4">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-widest ${colors[color]}`}>
          <Icon size={12} />
          <span>{label}</span>
        </div>
        <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700" />
      </div>
    );
  };

  // ── SKELETON ──
  if (!user) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="hidden md:flex w-64 bg-gradient-to-b from-[#040e1d] to-[#0c2340] flex-col p-6 gap-4">
          <div className="h-12 rounded-2xl bg-white/10 animate-pulse mb-4" />
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-10 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="flex-1 p-8 space-y-6">
          <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 animate-pulse">
                <div className="h-4 w-20 mb-4 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-8 w-28 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { icon: Award, label: "CGPA", value: stats.cgpa, decimals: 2, gradient: "from-blue-500 to-indigo-600" },
    { icon: BookOpen, label: "Registered", value: stats.registered, gradient: "from-purple-500 to-fuchsia-600" },
    { icon: CheckCircle, label: "Completed", value: stats.completed, gradient: "from-emerald-500 to-teal-600" },
    { icon: Clock, label: "Pending", value: stats.pending, gradient: "from-amber-500 to-orange-600" },
    { icon: Activity, label: "Attendance", value: stats.attendance, suffix: "%", gradient: "from-pink-500 to-rose-600" },
    { icon: Wallet, label: "Outstanding (₦)", value: stats.fees, gradient: "from-red-500 to-rose-600" },
  ];

  // ── ACADEMIC INFO ITEMS ──
  const academicItems = [
    { icon: Hash, label: "Matric Number", value: user.MatricNumber, color: "blue" },
    { icon: Building2, label: "Department", value: user.Department, color: "indigo" },
    { icon: Layers, label: "Level", value: user.Level ? `${user.Level} Level` : null, color: "violet" },
    { icon: BookMarked, label: "Semester", value: user.Session, color: "cyan" },
  ];

  const academicColorMap = {
    blue:   { bg: "bg-blue-500/10",   icon: "text-blue-400",   badge: "bg-blue-500/20 text-blue-300 border border-blue-500/20"   },
    indigo: { bg: "bg-indigo-500/10", icon: "text-indigo-400", badge: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/20" },
    violet: { bg: "bg-violet-500/10", icon: "text-violet-400", badge: "bg-violet-500/20 text-violet-300 border border-violet-500/20" },
    cyan:   { bg: "bg-cyan-500/10",   icon: "text-cyan-400",   badge: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/20"   },
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <Toaster position="top-right" />

      {/* ════════ SIDEBAR ════════ */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static flex flex-col
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ background: "linear-gradient(to bottom, #040e1d, #07162d, #0c2340)" }}
      >
        {/* Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-5%] right-[-20%] w-48 h-48 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-[0.08]" />
          <div className="absolute bottom-[20%] left-[-10%] w-56 h-56 bg-indigo-500 rounded-full mix-blend-screen filter blur-[90px] opacity-[0.06]" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 p-6 flex items-center gap-3 border-b border-white/[0.06]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <GraduationCap className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Unicode</h1>
            <p className="text-[10px] text-blue-300/60 uppercase tracking-[0.2em] font-medium">University</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="relative z-10 flex-1 overflow-y-auto px-3 py-4">
          <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-semibold px-4 mb-3">
            Main Menu
          </p>
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => { setActive(item.id); setIsMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                      isActive ? "text-white" : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25"
                      />
                    )}
                    <Icon size={17} className="relative z-10 flex-shrink-0" />
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <ChevronRight size={14} className="relative z-10 ml-auto opacity-70" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Student mini card */}
        <div className="relative z-10 mx-3 mb-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
              {user?.FullName?.charAt(0) || "S"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.FullName}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.MatricNumber || user?.Email}</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="relative z-10 p-3 border-t border-white/[0.06]">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 font-semibold py-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm border border-red-500/10 hover:border-red-500"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ════════ MAIN ════════ */}
      <div className="flex-1 flex flex-col w-full min-w-0">

        {/* ── TOPBAR ── */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen((s) => !s)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Unicode University</span>
              <ChevronRight size={12} className="text-slate-300" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 capitalize">
                {navItems.find((n) => n.id === active)?.label || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl w-64 border border-slate-200 dark:border-slate-700">
            <Search size={14} className="text-slate-400" />
            <input
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:scale-105 transition border border-slate-200 dark:border-slate-700"
            >
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <button className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Bell size={17} />
              {announcements.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-700 ml-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-blue-500/20">
                {user?.FullName?.charAt(0) || "S"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                  {user?.FullName?.split(" ")[0]}
                </p>
                <p className="text-[10px] text-slate-400">Student</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">

          {/* ═══ DASHBOARD HOME ═══ */}
          {active === "dashboard" && (
            <>
              {/* Hero Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl"
                style={{ background: "linear-gradient(135deg, #040e1d 0%, #07162d 50%, #0c2340 100%)" }}
              >
                {/* Orbs */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -right-10 -top-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-[0.12]" />
                  <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-[0.10]" />
                  <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-400 rounded-full mix-blend-screen filter blur-[80px] opacity-[0.05]" />
                </div>

                {/* Grid overlay */}
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                    backgroundSize: "50px 50px",
                  }}
                />

                {/* Accent line */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute top-0 left-8 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                />

                <div className="relative z-10 p-6 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-blue-500/30">
                        {user.FullName?.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#07162d] flex items-center justify-center">
                        <CheckCircle size={12} className="text-white" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">{user.FullName}</h1>
                        <span className="flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/20">
                          <CheckCircle size={11} /> {user.Status || "Active"}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-1">{user.Email}</p>

                      {/* Accent line */}
                      <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-5" />

                      {/* Academic info pills */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {academicItems.map((item) => {
                          const Icon = item.icon;
                          const c = academicColorMap[item.color];
                          return (
                            <motion.div
                              key={item.label}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl ${c.bg} border border-white/[0.06]`}
                            >
                              <Icon size={13} className={c.icon} />
                              <div className="min-w-0">
                                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                                  {item.label}
                                </p>
                                <p className="text-xs font-bold text-white truncate">
                                  {item.value || "N/A"}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* ✅ FIXED: Globe2 → Globe */}
                      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Globe size={11} className="text-slate-500" />
                          {user.Nationality || "N/A"}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar size={11} className="text-slate-500" />
                          {user.DateofBirth || "N/A"}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Shield size={11} className="text-slate-500" />
                          256-bit SSL Secured
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-8">
                {dataLoading
                  ? [...Array(6)].map((_, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 animate-pulse">
                        <div className="h-4 w-20 mb-4 rounded bg-slate-200 dark:bg-slate-700" />
                        <div className="h-8 w-28 rounded bg-slate-200 dark:bg-slate-700" />
                      </div>
                    ))
                  : statCards.map((c, i) => {
                      const Icon = c.icon;
                      return (
                        <motion.div
                          key={c.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          whileHover={{ y: -4, transition: { duration: 0.2 } }}
                          className="relative p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group"
                        >
                          <div className={`absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${c.gradient}`} />
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white mb-4 shadow-md`}>
                            <Icon size={20} />
                          </div>
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                            {c.label}
                          </p>
                          <p className="text-2xl font-bold text-slate-800 dark:text-white">
                            <Counter value={c.value} decimals={c.decimals || 0} suffix={c.suffix || ""} />
                          </p>
                          <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        </motion.div>
                      );
                    })}
              </div>

              {/* Quick Services */}
              <div className="mb-6">
                <SectionHeader icon={BookOpen} label="Quick Services" color="blue" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {services.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <motion.button
                        key={s.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -4 }}
                        onClick={() => setActive(s.target)}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg flex flex-col items-center gap-3 transition-shadow group"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                          <Icon size={22} />
                        </div>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 text-center leading-tight">
                          {s.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  { title: "CGPA Trend", data: cgpaTrend, dataKey: "cgpa", type: "line", empty: "No performance data", emptySub: "CGPA history will appear here." },
                  { title: "Semester GPA", data: semesterChartData, dataKey: "gpa", type: "bar", empty: "No GPA data", emptySub: "Semester results will appear here." },
                ].map((chart) => (
                  <div key={chart.title} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                      <h3 className="font-bold text-slate-800 dark:text-white">{chart.title}</h3>
                    </div>
                    {chart.data.length === 0 ? (
                      <EmptyState title={chart.empty} subtitle={chart.emptySub} />
                    ) : chart.type === "line" ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={chart.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b815" />
                          <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
                          <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                          <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.12)" }} />
                          <Line type="monotone" dataKey="cgpa" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1" }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={chart.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b815" />
                          <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
                          <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                          <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.12)" }} />
                          <Bar dataKey="gpa" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
                          <defs>
                            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#6366f1" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ═══ COURSE REGISTRATION ═══ */}
          {active === "courses" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">Course Registration</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Select courses for your current semester</p>
                </div>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                  Total Units: {totalUnits}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-3 py-2.5 rounded-xl flex-1 border border-slate-200 dark:border-slate-600">
                  <Search size={15} className="text-slate-400" />
                  <input
                    value={courseQuery}
                    onChange={(e) => setCourseQuery(e.target.value)}
                    placeholder="Search course code or title..."
                    className="bg-transparent outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
                <select
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-700/50 px-4 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 outline-none border border-slate-200 dark:border-slate-600"
                >
                  <option value="all">All Semesters</option>
                  <option value="First">First Semester</option>
                  <option value="Second">Second Semester</option>
                </select>
              </div>

              {dataLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 rounded-xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
                  ))}
                </div>
              ) : filteredCourses.length === 0 ? (
                <EmptyState icon={BookOpen} title="No courses available" subtitle="Courses will appear here once added by admin." />
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {filteredCourses.map((course, i) => {
                    const courseCode = course.CourseCode || course.code || course.Code || "";
                    const courseTitle = course.CourseTitle || course.title || course.Title || "";
                    const courseUnits = course.Units || course.units || 0;
                    const courseSemester = course.Semester || course.semester || "";
                    const courseLecturer = course.Lecturer || course.lecturer || "";
                    const reg = isRegistered(courseCode);

                    return (
                      <motion.div
                        key={courseCode || i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          reg
                            ? "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5"
                            : "border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-800 dark:text-white">{courseCode}</span>
                            <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg text-slate-500 dark:text-slate-400 font-medium">
                              {courseUnits} Units
                            </span>
                            {reg && (
                              <span className="text-xs bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-lg font-medium">
                                Registered
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">{courseTitle}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {courseLecturer} • {courseSemester} Semester
                          </p>
                        </div>
                        {reg ? (
                          <button
                            disabled={actionLoading}
                            onClick={() => handleDrop(courseCode)}
                            className="flex items-center gap-1.5 text-sm bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-2 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition disabled:opacity-50 border border-red-100 dark:border-red-500/20"
                          >
                            <Trash2 size={14} /> Drop
                          </button>
                        ) : (
                          <button
                            disabled={actionLoading}
                            onClick={() => setConfirmCourse(course)}
                            className="flex items-center gap-1.5 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 shadow-md shadow-blue-500/20"
                          >
                            <Plus size={14} /> Register
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ REGISTERED COURSES ═══ */}
          {active === "registered" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
            >
              {dataLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 rounded-lg bg-slate-100 dark:bg-slate-700 animate-pulse" />
                  ))}
                </div>
              ) : registered.length === 0 ? (
                <EmptyState title="No Registered Courses" subtitle="Register courses to see them here." />
              ) : (
                <>
                  <div className="flex flex-col md:flex-row justify-between gap-3 mb-6">
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-lg">My Courses</h3>
                      <p className="text-sm text-slate-400">{registered.length} courses registered • {totalUnits} total units</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={exportPDF}
                        className="flex items-center gap-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white px-3 py-2 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition border border-slate-200 dark:border-slate-600"
                      >
                        <FileDown size={14} /> PDF
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white px-3 py-2 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition border border-slate-200 dark:border-slate-600"
                      >
                        <Printer size={14} /> Print
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 px-3 py-2.5 rounded-xl mb-5 border border-slate-200 dark:border-slate-600">
                    <Search size={14} className="text-slate-400" />
                    <input
                      value={regQuery}
                      onChange={(e) => setRegQuery(e.target.value)}
                      placeholder="Search registered courses..."
                      className="bg-transparent outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-700/50 text-left text-slate-500 dark:text-slate-400">
                          {["Code", "Title", "Units", "Semester", "Lecturer", "Status"].map((k) => (
                            <th key={k} className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">
                              <span className="flex items-center gap-1 cursor-pointer hover:text-slate-700 dark:hover:text-white transition">
                                {k} <ArrowUpDown size={11} />
                              </span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                        {pagedRegistered.map((c, i) => (
                          <tr key={c.id || i} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                            <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-white">{c.CourseCode || c.code}</td>
                            <td className="py-3.5 px-4">{c.CourseTitle || c.title}</td>
                            <td className="py-3.5 px-4">{c.Units || c.units}</td>
                            <td className="py-3.5 px-4">{c.Semester || c.semester}</td>
                            <td className="py-3.5 px-4">{c.Lecturer || c.lecturer}</td>
                            <td className="py-3.5 px-4">
                              <span className="text-xs bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full font-semibold">
                                {c.Status || c.status || "Registered"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-5">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={`w-9 h-9 rounded-xl text-sm font-semibold transition ${
                            page === i + 1
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white hover:bg-slate-200"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* ═══ PERFORMANCE ═══ */}
          {active === "performance" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {[
                { title: "CGPA Trend", data: cgpaTrend, type: "line", empty: "No performance data", emptySub: "CGPA history will appear here." },
                { title: "Semester GPA", data: semesterChartData, type: "bar", empty: "No GPA data", emptySub: "Semester results will appear here." },
              ].map((chart) => (
                <div key={chart.title} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                    <h3 className="font-bold text-slate-800 dark:text-white">{chart.title}</h3>
                  </div>
                  {chart.data.length === 0 ? (
                    <EmptyState title={chart.empty} subtitle={chart.emptySub} />
                  ) : chart.type === "line" ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={chart.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b815" />
                        <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.12)" }} />
                        <Line type="monotone" dataKey="cgpa" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1" }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={chart.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b815" />
                        <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.12)" }} />
                        <Bar dataKey="gpa" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* ═══ RESULTS ═══ */}
          {active === "results" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-fuchsia-600 rounded-full" />
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Results & Grades</h3>
              </div>
              {dataLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 rounded-lg bg-slate-100 dark:bg-slate-700 animate-pulse" />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <EmptyState icon={Award} title="No Results Yet" subtitle="Your grades will appear here once published." />
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700/50 text-left text-slate-500 dark:text-slate-400">
                        {["Course", "Units", "Score", "Grade"].map((h) => (
                          <th key={h} className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                      {results.map((r, i) => (
                        <tr key={r.id || i} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-800 dark:text-white">{r.CourseCode || r.code}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{r.CourseTitle || r.title}</p>
                          </td>
                          <td className="py-3.5 px-4">{r.Units || r.units}</td>
                          <td className="py-3.5 px-4 font-semibold">{r.Score || r.score}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${gradeColor(r.Grade || r.grade)}`}>
                              {r.Grade || r.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ TIMETABLE ═══ */}
          {active === "timetable" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-rose-600 rounded-full" />
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Weekly Timetable</h3>
              </div>
              {dataLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-32 rounded-xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
                  ))}
                </div>
              ) : timetableRows.length === 0 ? (
                <EmptyState icon={Calendar} title="No Timetable" subtitle="Your class schedule will appear here." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {days.map((day) => (
                    <div key={day}>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">{day}</p>
                      <div className="space-y-2">
                        {(schedule[day] || []).map((cls, i) => (
                          <motion.div
                            key={cls.id || i}
                            whileHover={{ scale: 1.03 }}
                            className="p-3 rounded-xl border border-indigo-100 dark:border-slate-700"
                            style={{ background: "linear-gradient(135deg, #f0f4ff, #f5f0ff)" }}
                          >
                            <p className="font-bold text-sm text-slate-800">{cls.Course || cls.course}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <Clock size={10} />{cls.Time || cls.time}
                            </p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <MapPin size={10} />{cls.Room || cls.room}
                            </p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <User size={10} />{cls.Lecturer || cls.lecturer}
                            </p>
                          </motion.div>
                        ))}
                        {(schedule[day] || []).length === 0 && (
                          <div className="p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
                            <p className="text-xs text-slate-300 dark:text-slate-600">No classes</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ ANNOUNCEMENTS ═══ */}
          {active === "announcements" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full" />
                <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                  <Megaphone size={18} className="text-amber-500" /> Announcements
                </h3>
              </div>
              {dataLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 rounded-xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
                  ))}
                </div>
              ) : announcements.length === 0 ? (
                <EmptyState icon={Megaphone} title="No Announcements" subtitle="Check back later for updates." />
              ) : (
                <div className="space-y-3">
                  {announcements.map((a, i) => (
                    <motion.div
                      key={a.id || i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${announcementColor(a.Type || a.type)}`}>
                          {a.Type || a.type}
                        </span>
                        <span className="text-xs text-slate-400">
                          {a.created_at ? new Date(a.created_at).toLocaleDateString() : ""}
                        </span>
                      </div>
                      <p className="font-bold text-sm text-slate-800 dark:text-white">{a.Title || a.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{a.Body || a.body}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ PROFILE ═══ */}
          {active === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Profile hero */}
              <div
                className="relative rounded-3xl overflow-hidden p-8 shadow-xl"
                style={{ background: "linear-gradient(135deg, #040e1d 0%, #07162d 60%, #0c2340 100%)" }}
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-[0.08]" />
                </div>
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                  }}
                />
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-blue-500/30 flex-shrink-0">
                    {user.FullName?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{user.FullName}</h2>
                    <p className="text-slate-400 text-sm mt-0.5">{user.Email}</p>
                    <div className="w-10 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full my-3" />
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/20 font-medium">
                        {user.Department || "Department N/A"}
                      </span>
                      <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/20 font-medium">
                        {user.Level ? `${user.Level} Level` : "Level N/A"}
                      </span>
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
                        {user.Status || "Active"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Info Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
                <SectionHeader icon={GraduationCap} label="Academic Information" color="indigo" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Hash, label: "Matric Number", value: user.MatricNumber, color: "blue" },
                    { icon: Building2, label: "Department", value: user.Department, color: "indigo" },
                    { icon: Layers, label: "Level", value: user.Level ? `${user.Level} Level` : null, color: "violet" },
                    { icon: BookMarked, label: "Current Semester", value: user.Session, color: "cyan" },
                  ].map((item) => {
                    const Icon = item.icon;
                    const colorStyles = {
                      blue:   { bg: "bg-blue-50 dark:bg-blue-500/10",   icon: "text-blue-500",   badge: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"   },
                      indigo: { bg: "bg-indigo-50 dark:bg-indigo-500/10", icon: "text-indigo-500", badge: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300" },
                      violet: { bg: "bg-violet-50 dark:bg-violet-500/10", icon: "text-violet-500", badge: "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300" },
                      cyan:   { bg: "bg-cyan-50 dark:bg-cyan-500/10",   icon: "text-cyan-600",   badge: "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300"   },
                    }[item.color];
                    return (
                      <div key={item.label} className={`flex items-start gap-3 p-4 rounded-xl ${colorStyles.bg}`}>
                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm flex-shrink-0">
                          <Icon size={16} className={colorStyles.icon} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{item.label}</p>
                          <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${colorStyles.badge}`}>
                            {item.value || "N/A"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Personal Info Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6">
                <SectionHeader icon={User} label="Personal Information" color="blue" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: "Full Name", value: user.FullName },
                    { label: "Email Address", value: user.Email },
                    { label: "Date of Birth", value: user.DateofBirth },
                    { label: "Nationality", value: user.Nationality },
                    { label: "Status", value: user.Status },
                  ].map((f) => (
                    <div key={f.label} className="border-b border-slate-50 dark:border-slate-700 pb-4">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{f.label}</p>
                      <p className="font-semibold text-slate-800 dark:text-white">{f.value || "—"}</p>
                    </div>
                  ))}
                  <div className="sm:col-span-2 border-b border-slate-50 dark:border-slate-700 pb-4">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">House Address</p>
                    <p className="font-semibold text-slate-800 dark:text-white">{user.HouseAddress || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50 dark:border-slate-700">
                  <Shield size={13} className="text-slate-400" />
                  <span className="text-xs text-slate-400">256-bit SSL encrypted • All data is securely stored</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ FEES / SETTINGS ═══ */}
          {(active === "fees" || active === "settings") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
            >
              <EmptyState
                icon={active === "fees" ? Wallet : Settings}
                title={active === "fees" ? "Fees Portal" : "Settings"}
                subtitle="This section is coming soon."
              />
            </motion.div>
          )}

        </main>
      </div>

      {/* ════════ CONFIRM MODAL ════════ */}
      <AnimatePresence>
        {confirmCourse && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirmCourse(null)}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <BookOpen size={15} className="text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white">Confirm Registration</h3>
                </div>
                <button onClick={() => setConfirmCourse(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-4">
                  <p className="font-bold text-slate-800 dark:text-white">{confirmCourse.CourseCode || confirmCourse.code}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{confirmCourse.CourseTitle || confirmCourse.title}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-lg font-medium">
                      {confirmCourse.Units || confirmCourse.units} Units
                    </span>
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-lg font-medium">
                      {confirmCourse.Semester || confirmCourse.semester} Semester
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Are you sure you want to register for this course?
                </p>
              </div>
              <div className="p-5 border-t border-slate-100 dark:border-slate-700 flex gap-3">
                <button
                  onClick={() => setConfirmCourse(null)}
                  className="flex-1 bg-slate-100 dark:bg-slate-700 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-white hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading}
                  onClick={() => handleRegister(confirmCourse)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 shadow-lg shadow-blue-500/25"
                >
                  {actionLoading ? "Registering..." : "Confirm Register"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════ LOGOUT MODAL ════════ */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowLogoutModal(false)}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 dark:border-slate-700"
            >
              <div
                className="p-6 text-center"
                style={{ background: "linear-gradient(135deg, #040e1d, #07162d)" }}
              >
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/20 flex items-center justify-center mx-auto mb-3">
                  <LogOut size={24} className="text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Ready to leave?</h2>
                <p className="text-sm text-slate-400">You will be returned to the login screen.</p>
              </div>
              <div className="p-5 flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white py-3 rounded-xl font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition shadow-lg shadow-red-500/25"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}