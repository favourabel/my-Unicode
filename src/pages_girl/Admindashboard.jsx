import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabaseClient";

const ADMIN_EMAIL = "favourabel150@gmail.com";

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Icon = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  students: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  courses: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="16" y2="11" />
      <line x1="8" y1="15" x2="12" y2="15" />
    </svg>
  ),
  results: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  bell: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  logout: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  plus: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  trash: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  ),
  close: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  menu: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  school: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  eye: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-white text-sm font-medium min-w-[280px] max-w-sm
            ${t.type === "success" ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : ""}
            ${t.type === "error" ? "bg-gradient-to-r from-red-500 to-red-600" : ""}
            ${t.type === "info" ? "bg-gradient-to-r from-blue-500 to-blue-600" : ""}
          `}
        >
          <span className="flex-shrink-0">
            {t.type === "success" && Icon.check}
            {t.type === "error" && Icon.error}
            {t.type === "info" && Icon.info}
          </span>
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">
            {Icon.close}
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── MODAL WRAPPER ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, size = "md" }) {
  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full ${sizes[size]} max-h-[92vh] overflow-y-auto`}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all">
            {Icon.close}
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── CONFIRM DIALOG ───────────────────────────────────────────────────────────
function ConfirmDialog({ title, message, onConfirm, onCancel, danger = true }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${danger ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
          {Icon.warning}
        </div>
        <h3 className="text-lg font-bold text-slate-800 text-center mb-2">{title}</h3>
        <p className="text-slate-500 text-sm text-center mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-2xl text-white font-semibold transition-all hover:shadow-lg ${danger ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-blue-500 to-blue-600"}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FORM FIELD ───────────────────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all bg-slate-50/50";

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, gradient, sub }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg ${gradient}`}>
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
      <div className="absolute -bottom-6 -right-2 w-16 h-16 bg-white/10 rounded-full" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium opacity-90">{label}</span>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">{icon}</div>
        </div>
        <div className="text-4xl font-black tracking-tight">{value}</div>
        {sub && <p className="text-xs opacity-75 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
function Badge({ children, color = "slate" }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700", green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700",
    violet: "bg-violet-100 text-violet-700", slate: "bg-slate-100 text-slate-600",
    cyan: "bg-cyan-100 text-cyan-700",
  };
  return <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-lg ${colors[color]}`}>{children}</span>;
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-4 text-3xl">{icon}</div>
      <h3 className="text-slate-700 font-bold text-lg mb-1">{title}</h3>
      <p className="text-slate-400 text-sm mb-5 max-w-xs">{subtitle}</p>
      {action}
    </div>
  );
}

// ─── LOADING SPINNER ──────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

// ─── PRIMARY BUTTON ───────────────────────────────────────────────────────────
function PrimaryBtn({ onClick, children, gradient = "from-blue-600 to-violet-600", className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${gradient} text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 ${className}`}
    >
      {children}
    </button>
  );
}

// ─── STUDENT DETAIL MODAL ─────────────────────────────────────────────────────
function StudentDetailModal({ student, onClose, results }) {
  const studentResults = results.filter(
    (r) => r.student_id === student.id || r.email === student.Email
  );

  return (
    <Modal title={`${student.FullName || "Student"} — Full Profile`} onClose={onClose} size="xl">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
              {(student.FullName || "?")[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">{student.FullName || "—"}</h3>
              <p className="text-slate-500 text-sm">{student.Email || "—"}</p>
              <Badge color={student.Status === "Active" ? "green" : "amber"}>
                {student.Status || "Active"}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Matric Number", value: student.MatricNumber },
              { label: "Department", value: student.Department },
              { label: "Level", value: student.Level },
              { label: "Session", value: student.Session },
              { label: "Nationality", value: student.Nationality },
              { label: "Date of Birth", value: student.DateofBirth },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{f.label}</p>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{f.value || "—"}</p>
              </div>
            ))}
          </div>
          {student.HouseAddress && (
            <div className="mt-3 pt-3 border-t border-blue-100">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Address</p>
              <p className="text-sm font-bold text-slate-700 mt-0.5">{student.HouseAddress}</p>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-black text-slate-800 mb-3 flex items-center gap-2">
            {Icon.results}
            Academic Results
            <Badge color="blue">{studentResults.length}</Badge>
          </h4>
          {studentResults.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <p className="text-slate-400 text-sm">No results published for this student yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full min-w-[500px] text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {["Course", "Score", "Grade", "Semester", "Session"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {studentResults.map((r, i) => (
                    <tr key={r.id || i} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {r.course_code || "—"}
                        <p className="text-xs text-slate-400 font-normal">{r.course_title || ""}</p>
                      </td>
                      <td className="px-4 py-3 font-black text-slate-800">{r.score ?? "—"}</td>
                      <td className="px-4 py-3">
                        <Badge color={{ A: "green", B: "blue", C: "amber", D: "violet", F: "red" }[r.grade] || "slate"}>
                          {r.grade || "—"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{r.semester || "—"}</td>
                      <td className="px-4 py-3 text-slate-400">{r.session || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN ADMIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Admindashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [timetables, setTimetables] = useState([]);

  const [loadingMap, setLoadingMap] = useState({
    students: false, courses: false, results: false,
    announcements: false, timetables: false,
  });

  // ✅ Clean form state matching new schema
  const [courseForm, setCourseForm] = useState({
    title: "", code: "", description: "", credits: "", department: "", semester: "First",
  });
  const [resultForm, setResultForm] = useState({
    student_id: "", course_id: "", score: "", grade: "", semester: "First Semester", session: "",
  });
  const [announcementForm, setAnnouncementForm] = useState({
    title: "", content: "", target: "all", priority: "normal",
  });
  const [timetableForm, setTimetableForm] = useState({
    course_id: "", day: "Monday", start_time: "", end_time: "", venue: "", lecturer: "",
  });

  const toast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((p) => p.filter((t) => t.id !== id));
  }, []);

  const setLoading = (key, val) => setLoadingMap((p) => ({ ...p, [key]: val }));

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      if (session.user.email !== ADMIN_EMAIL) { navigate("/dashboard"); return; }
      fetchAll();
    };
    checkAuth();
    // eslint-disable-next-line
  }, [navigate]);

  const fetchAll = () => {
    fetchStudents();
    fetchCourses();
    fetchResults();
    fetchAnnouncements();
    fetchTimetables();
  };

  const fetchStudents = async () => {
    setLoading("students", true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .neq("Email", ADMIN_EMAIL)
      .order("FullName", { ascending: true });
    if (error) toast("Failed to load students: " + error.message, "error");
    else setStudents(data || []);
    setLoading("students", false);
  };

  const fetchCourses = async () => {
    setLoading("courses", true);
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast("Failed to load courses: " + error.message, "error");
    else setCourses(data || []);
    setLoading("courses", false);
  };

  const fetchResults = async () => {
    setLoading("results", true);
    const { data, error } = await supabase
      .from("results")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast("Failed to load results: " + error.message, "error");
    else setResults(data || []);
    setLoading("results", false);
  };

  const fetchAnnouncements = async () => {
    setLoading("announcements", true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast("Failed to load announcements: " + error.message, "error");
    else setAnnouncements(data || []);
    setLoading("announcements", false);
  };

  const fetchTimetables = async () => {
    setLoading("timetables", true);
    const { data, error } = await supabase
      .from("timetable")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast("Failed to load timetable: " + error.message, "error");
    else setTimetables(data || []);
    setLoading("timetables", false);
  };

  const handleLogout = () => {
    setConfirm({
      title: "Log Out",
      message: "Are you sure you want to log out of the admin portal?",
      danger: false,
      onConfirm: async () => {
        await supabase.auth.signOut();
        localStorage.removeItem("user");
        setConfirm(null);
        navigate("/login");
      },
    });
  };

  const autoGrade = (score) => {
    const n = Number(score);
    if (n >= 70) return "A";
    if (n >= 60) return "B";
    if (n >= 50) return "C";
    if (n >= 45) return "D";
    if (n >= 40) return "E";
    return "F";
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  COURSES CRUD
  // ══════════════════════════════════════════════════════════════════════════
  const openAddCourse = () => {
    setCourseForm({ title: "", code: "", description: "", credits: "", department: "", semester: "First" });
    setModal({ type: "course" });
  };

  const openEditCourse = (c) => {
    setCourseForm({
      title: c.title || "",
      code: c.code || "",
      description: c.description || "",
      credits: c.credits || "",
      department: c.department || "",
      semester: c.semester || "First",
    });
    setModal({ type: "course", data: c });
  };

  const saveCourse = async () => {
    if (!courseForm.title.trim() || !courseForm.code.trim()) {
      toast("Course title and code are required.", "error"); return;
    }
    setSaving(true);

    const payload = {
      title: courseForm.title.trim(),
      code: courseForm.code.trim().toUpperCase(),
      description: courseForm.description.trim(),
      credits: Number(courseForm.credits) || 0,
      department: courseForm.department.trim(),
      semester: courseForm.semester,
    };

    const isEdit = !!modal?.data;
    const { error } = isEdit
      ? await supabase.from("courses").update(payload).eq("id", modal.data.id)
      : await supabase.from("courses").insert([payload]);

    setSaving(false);
    if (error) { toast("Error: " + error.message, "error"); return; }
    toast(isEdit ? "Course updated!" : "Course added!");
    setModal(null);
    fetchCourses();
  };

  const confirmDeleteCourse = (id) => {
    setConfirm({
      title: "Delete Course",
      message: "This will permanently delete the course.",
      onConfirm: async () => {
        const { error } = await supabase.from("courses").delete().eq("id", id);
        setConfirm(null);
        if (error) { toast(error.message, "error"); return; }
        toast("Course deleted.");
        fetchCourses();
      },
    });
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  RESULTS CRUD
  // ══════════════════════════════════════════════════════════════════════════
  const openPublishResult = () => {
    setResultForm({ student_id: "", course_id: "", score: "", grade: "", semester: "First Semester", session: "" });
    setModal({ type: "result" });
  };

  const openEditResult = (r) => {
    setResultForm({
      student_id: r.student_id || "",
      course_id: r.course_id || "",
      score: r.score || "",
      grade: r.grade || "",
      semester: r.semester || "First Semester",
      session: r.session || "",
    });
    setModal({ type: "result", data: r });
  };

  const saveResult = async () => {
    if (!resultForm.student_id || !resultForm.course_id || resultForm.score === "") {
      toast("Student, course, and score are required.", "error"); return;
    }
    setSaving(true);

    const selectedStudent = students.find((s) => String(s.id) === String(resultForm.student_id));
    const selectedCourse = courses.find((c) => c.id === resultForm.course_id);

    const payload = {
      student_id: Number(resultForm.student_id),
      email: selectedStudent?.Email || "",
      course_id: resultForm.course_id,
      course_code: selectedCourse?.code || "",
      course_title: selectedCourse?.title || "",
      score: Number(resultForm.score),
      grade: resultForm.grade || autoGrade(resultForm.score),
      units: selectedCourse?.credits || 0,
      semester: resultForm.semester,
      session: resultForm.session.trim(),
      published: true,
    };

    const isEdit = !!modal?.data;
    const { error } = isEdit
      ? await supabase.from("results").update(payload).eq("id", modal.data.id)
      : await supabase.from("results").insert([payload]);

    setSaving(false);
    if (error) { toast("Error: " + error.message, "error"); return; }
    toast(isEdit ? "Result updated!" : "Result published!");
    setModal(null);
    fetchResults();
  };

  const confirmDeleteResult = (id) => {
    setConfirm({
      title: "Delete Result",
      message: "This result will be permanently removed.",
      onConfirm: async () => {
        const { error } = await supabase.from("results").delete().eq("id", id);
        setConfirm(null);
        if (error) { toast(error.message, "error"); return; }
        toast("Result deleted.");
        fetchResults();
      },
    });
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  ANNOUNCEMENTS CRUD
  // ══════════════════════════════════════════════════════════════════════════
  const openAddAnnouncement = () => {
    setAnnouncementForm({ title: "", content: "", target: "all", priority: "normal" });
    setModal({ type: "announcement" });
  };

  const openEditAnnouncement = (a) => {
    setAnnouncementForm({
      title: a.title || "",
      content: a.content || "",
      target: a.target || "all",
      priority: a.priority || "normal",
    });
    setModal({ type: "announcement", data: a });
  };

  const saveAnnouncement = async () => {
    if (!announcementForm.title.trim() || !announcementForm.content.trim()) {
      toast("Title and content are required.", "error"); return;
    }
    setSaving(true);
    const payload = {
      title: announcementForm.title.trim(),
      content: announcementForm.content.trim(),
      target: announcementForm.target,
      priority: announcementForm.priority,
      type: announcementForm.priority === "urgent" ? "Exam" : "School",
    };

    const isEdit = !!modal?.data;
    const { error } = isEdit
      ? await supabase.from("announcements").update(payload).eq("id", modal.data.id)
      : await supabase.from("announcements").insert([payload]);

    setSaving(false);
    if (error) { toast("Error: " + error.message, "error"); return; }
    toast(isEdit ? "Announcement updated!" : "Announcement posted!");
    setModal(null);
    fetchAnnouncements();
  };

  const confirmDeleteAnnouncement = (id) => {
    setConfirm({
      title: "Delete Announcement",
      message: "This announcement will be permanently removed.",
      onConfirm: async () => {
        const { error } = await supabase.from("announcements").delete().eq("id", id);
        setConfirm(null);
        if (error) { toast(error.message, "error"); return; }
        toast("Announcement deleted.");
        fetchAnnouncements();
      },
    });
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  TIMETABLE CRUD
  // ══════════════════════════════════════════════════════════════════════════
  const openAddTimetable = () => {
    setTimetableForm({ course_id: "", day: "Monday", start_time: "", end_time: "", venue: "", lecturer: "" });
    setModal({ type: "timetable" });
  };

  const openEditTimetable = (t) => {
    setTimetableForm({
      course_id: t.course_id || "",
      day: t.day || "Monday",
      start_time: t.start_time || "",
      end_time: t.end_time || "",
      venue: t.venue || "",
      lecturer: t.lecturer || "",
    });
    setModal({ type: "timetable", data: t });
  };

  const saveTimetable = async () => {
    if (!timetableForm.course_id || !timetableForm.day || !timetableForm.start_time) {
      toast("Course, day, and start time are required.", "error"); return;
    }
    setSaving(true);

    const selectedCourse = courses.find((c) => c.id === timetableForm.course_id);

    const payload = {
      course_id: timetableForm.course_id,
      course_code: selectedCourse?.code || "",
      course_title: selectedCourse?.title || "",
      day: timetableForm.day,
      start_time: timetableForm.start_time,
      end_time: timetableForm.end_time,
      venue: timetableForm.venue.trim(),
      lecturer: timetableForm.lecturer.trim(),
    };

    const isEdit = !!modal?.data;
    const { error } = isEdit
      ? await supabase.from("timetable").update(payload).eq("id", modal.data.id)
      : await supabase.from("timetable").insert([payload]);

    setSaving(false);
    if (error) { toast("Error: " + error.message, "error"); return; }
    toast(isEdit ? "Timetable updated!" : "Class added!");
    setModal(null);
    fetchTimetables();
  };

  const confirmDeleteTimetable = (id) => {
    setConfirm({
      title: "Remove Class",
      message: "This timetable entry will be permanently removed.",
      onConfirm: async () => {
        const { error } = await supabase.from("timetable").delete().eq("id", id);
        setConfirm(null);
        if (error) { toast(error.message, "error"); return; }
        toast("Class removed.");
        fetchTimetables();
      },
    });
  };

  const confirmDeleteStudent = (id, name) => {
    setConfirm({
      title: "Remove Student",
      message: `Remove "${name}" from the system? This cannot be undone.`,
      onConfirm: async () => {
        const { error } = await supabase.from("profiles").delete().eq("id", id);
        setConfirm(null);
        if (error) { toast(error.message, "error"); return; }
        toast("Student removed.");
        fetchStudents();
      },
    });
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Icon.dashboard },
    { id: "students", label: "Students", icon: Icon.students, count: students.length },
    { id: "courses", label: "Courses", icon: Icon.courses, count: courses.length },
    { id: "results", label: "Results", icon: Icon.results, count: results.length },
    { id: "announcements", label: "Announcements", icon: Icon.bell, count: announcements.length },
    { id: "timetable", label: "Timetable", icon: Icon.calendar, count: timetables.length },
  ];

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const gradeColor = (g) => ({ A: "green", B: "blue", C: "amber", D: "violet", E: "cyan", F: "red" }[g] || "slate");
  const priorityColor = { normal: "slate", important: "amber", urgent: "red" };
  const targetColor = { all: "blue", students: "green", staff: "violet" };
  const formatDate = (str) => str ? new Date(str).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

  // ════════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          danger={confirm.danger !== false}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          results={results}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* COURSE MODAL */}
      {modal?.type === "course" && (
        <Modal title={modal.data ? "Edit Course" : "Add New Course"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Course Title" required>
                <input className={inputCls} placeholder="e.g. Data Structures"
                  value={courseForm.title} onChange={(e) => setCourseForm((p) => ({ ...p, title: e.target.value }))} />
              </Field>
              <Field label="Course Code" required>
                <input className={inputCls} placeholder="e.g. CSC201"
                  value={courseForm.code} onChange={(e) => setCourseForm((p) => ({ ...p, code: e.target.value }))} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Department">
                <input className={inputCls} placeholder="e.g. Computer Science"
                  value={courseForm.department} onChange={(e) => setCourseForm((p) => ({ ...p, department: e.target.value }))} />
              </Field>
              <Field label="Credit Units">
                <input className={inputCls} type="number" placeholder="e.g. 3" min="0"
                  value={courseForm.credits} onChange={(e) => setCourseForm((p) => ({ ...p, credits: e.target.value }))} />
              </Field>
              <Field label="Semester">
                <select className={inputCls} value={courseForm.semester}
                  onChange={(e) => setCourseForm((p) => ({ ...p, semester: e.target.value }))}>
                  <option value="First">First Semester</option>
                  <option value="Second">Second Semester</option>
                </select>
              </Field>
            </div>
            <Field label="Description">
              <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Short course description..."
                value={courseForm.description} onChange={(e) => setCourseForm((p) => ({ ...p, description: e.target.value }))} />
            </Field>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm">Cancel</button>
              <button onClick={saveCourse} disabled={saving} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm shadow hover:shadow-lg disabled:opacity-60">
                {saving ? "Saving…" : modal.data ? "Save Changes" : "Add Course"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* RESULT MODAL */}
      {modal?.type === "result" && (
        <Modal title={modal.data ? "Edit Result" : "Publish Result"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Field label="Student" required>
              <select className={inputCls} value={resultForm.student_id}
                onChange={(e) => setResultForm((p) => ({ ...p, student_id: e.target.value }))}>
                <option value="">— Select Student —</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.FullName} ({s.Email}) — {s.MatricNumber || "No Matric"}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Course" required>
              <select className={inputCls} value={resultForm.course_id}
                onChange={(e) => setResultForm((p) => ({ ...p, course_id: e.target.value }))}>
                <option value="">— Select Course —</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Score (0–100)" required>
                <input className={inputCls} type="number" min="0" max="100" placeholder="e.g. 78"
                  value={resultForm.score}
                  onChange={(e) => {
                    const score = e.target.value;
                    setResultForm((p) => ({ ...p, score, grade: autoGrade(score) }));
                  }} />
              </Field>
              <Field label="Grade (auto)">
                <input className={`${inputCls} bg-slate-100 cursor-not-allowed font-bold text-center`} readOnly value={resultForm.grade} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Semester">
                <select className={inputCls} value={resultForm.semester}
                  onChange={(e) => setResultForm((p) => ({ ...p, semester: e.target.value }))}>
                  <option>First Semester</option>
                  <option>Second Semester</option>
                </select>
              </Field>
              <Field label="Session">
                <input className={inputCls} placeholder="e.g. 2023/2024"
                  value={resultForm.session} onChange={(e) => setResultForm((p) => ({ ...p, session: e.target.value }))} />
              </Field>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 text-sm">Cancel</button>
              <button onClick={saveResult} disabled={saving} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm shadow hover:shadow-lg disabled:opacity-60">
                {saving ? "Saving…" : modal.data ? "Save Changes" : "Publish Result"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ANNOUNCEMENT MODAL */}
      {modal?.type === "announcement" && (
        <Modal title={modal.data ? "Edit Announcement" : "New Announcement"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Field label="Title" required>
              <input className={inputCls} placeholder="Announcement title"
                value={announcementForm.title} onChange={(e) => setAnnouncementForm((p) => ({ ...p, title: e.target.value }))} />
            </Field>
            <Field label="Content" required>
              <textarea className={`${inputCls} resize-none`} rows={4} placeholder="Write the announcement content here…"
                value={announcementForm.content} onChange={(e) => setAnnouncementForm((p) => ({ ...p, content: e.target.value }))} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Target Audience">
                <select className={inputCls} value={announcementForm.target}
                  onChange={(e) => setAnnouncementForm((p) => ({ ...p, target: e.target.value }))}>
                  <option value="all">All</option>
                  <option value="students">Students Only</option>
                  <option value="staff">Staff Only</option>
                </select>
              </Field>
              <Field label="Priority">
                <select className={inputCls} value={announcementForm.priority}
                  onChange={(e) => setAnnouncementForm((p) => ({ ...p, priority: e.target.value }))}>
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </Field>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 text-sm">Cancel</button>
              <button onClick={saveAnnouncement} disabled={saving} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm shadow hover:shadow-lg disabled:opacity-60">
                {saving ? "Saving…" : modal.data ? "Save Changes" : "Post Announcement"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* TIMETABLE MODAL */}
      {modal?.type === "timetable" && (
        <Modal title={modal.data ? "Edit Timetable Entry" : "Add Class to Timetable"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Field label="Course" required>
              <select className={inputCls} value={timetableForm.course_id}
                onChange={(e) => setTimetableForm((p) => ({ ...p, course_id: e.target.value }))}>
                <option value="">— Select Course —</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
                ))}
              </select>
            </Field>
            <Field label="Day" required>
              <select className={inputCls} value={timetableForm.day}
                onChange={(e) => setTimetableForm((p) => ({ ...p, day: e.target.value }))}>
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Start Time" required>
                <input className={inputCls} type="time" value={timetableForm.start_time}
                  onChange={(e) => setTimetableForm((p) => ({ ...p, start_time: e.target.value }))} />
              </Field>
              <Field label="End Time">
                <input className={inputCls} type="time" value={timetableForm.end_time}
                  onChange={(e) => setTimetableForm((p) => ({ ...p, end_time: e.target.value }))} />
              </Field>
            </div>
            <Field label="Venue / Room">
              <input className={inputCls} placeholder="e.g. Hall A, Block C" value={timetableForm.venue}
                onChange={(e) => setTimetableForm((p) => ({ ...p, venue: e.target.value }))} />
            </Field>
            <Field label="Lecturer">
              <input className={inputCls} placeholder="e.g. Prof. Adeyemi" value={timetableForm.lecturer}
                onChange={(e) => setTimetableForm((p) => ({ ...p, lecturer: e.target.value }))} />
            </Field>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 text-sm">Cancel</button>
              <button onClick={saveTimetable} disabled={saving} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow hover:shadow-lg disabled:opacity-60">
                {saving ? "Saving…" : modal.data ? "Save Changes" : "Add to Timetable"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ════════════════════════════ LAYOUT ════════════════════════════════ */}
      <div className="flex min-h-screen bg-[#f0f2f8] font-sans text-slate-800">

        {sidebarOpen && (
          <div className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-slate-900 text-slate-300 shadow-2xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
          <div className="px-5 py-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                {Icon.school}
              </div>
              <div className="min-w-0">
                <p className="text-white font-black text-sm truncate">UniAdmin</p>
                <p className="text-slate-400 text-xs">Management Portal</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-1">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">Main Menu</p>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group
                    ${isActive ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/25" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
                >
                  <span className={isActive ? "text-white" : "text-slate-500 group-hover:text-white transition-colors"}>{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isActive ? "bg-white/25 text-white" : "bg-slate-700 text-slate-300"}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="px-3 py-4 border-t border-slate-700/50">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
              {Icon.logout} Logout
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-h-screen md:ml-64">

          <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-4 md:px-8 h-16 flex items-center justify-between shadow-sm flex-shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors">
                {Icon.menu}
              </button>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-800 capitalize leading-tight">
                  {activeTab === "dashboard" ? "Dashboard Overview" : navItems.find((n) => n.id === activeTab)?.label}
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700">Administrator</p>
                <p className="text-xs text-slate-400">{ADMIN_EMAIL}</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow">A</div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">

            {/* DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  <StatCard label="Total Students" value={students.length} icon={Icon.students} gradient="bg-gradient-to-br from-blue-500 to-blue-700" sub="Registered students" />
                  <StatCard label="Total Courses" value={courses.length} icon={Icon.courses} gradient="bg-gradient-to-br from-violet-500 to-violet-700" sub="Active courses" />
                  <StatCard label="Results Published" value={results.length} icon={Icon.results} gradient="bg-gradient-to-br from-emerald-500 to-emerald-700" sub="Across all courses" />
                  <StatCard label="Announcements" value={announcements.length} icon={Icon.bell} gradient="bg-gradient-to-br from-amber-500 to-orange-600" sub="Posted this term" />
                  <StatCard label="Classes Scheduled" value={timetables.length} icon={Icon.calendar} gradient="bg-gradient-to-br from-cyan-500 to-cyan-700" sub="In current timetable" />
                  <StatCard label="Active Students" value={students.length} icon={Icon.students} gradient="bg-gradient-to-br from-rose-500 to-rose-700" sub="Currently enrolled" />
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-base font-black text-slate-800 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {[
                      { label: "Add Course", action: () => { setActiveTab("courses"); setTimeout(openAddCourse, 100); }, cls: "from-blue-600 to-violet-600" },
                      { label: "Publish Result", action: () => { setActiveTab("results"); setTimeout(openPublishResult, 100); }, cls: "from-emerald-500 to-teal-600" },
                      { label: "Announce", action: () => { setActiveTab("announcements"); setTimeout(openAddAnnouncement, 100); }, cls: "from-amber-500 to-orange-500" },
                      { label: "Add Class", action: () => { setActiveTab("timetable"); setTimeout(openAddTimetable, 100); }, cls: "from-cyan-500 to-blue-600" },
                      { label: "View Students", action: () => setActiveTab("students"), cls: "from-rose-500 to-rose-600" },
                    ].map((q) => (
                      <button key={q.label} onClick={q.action} className={`bg-gradient-to-r ${q.cls} text-white rounded-2xl py-3 px-3 text-sm font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all`}>
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-base font-black text-slate-800">All Students</h2>
                    <button onClick={() => setActiveTab("students")} className="text-blue-600 text-sm font-bold hover:text-blue-700">View all →</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[400px]">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          {["#", "Name", "Email", "Department", "Level"].map((h) => (
                            <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {students.slice(0, 5).map((s, i) => (
                          <tr key={s.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer" onClick={() => setSelectedStudent(s)}>
                            <td className="px-6 py-3 text-sm text-slate-400 font-medium">{i + 1}</td>
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                                  {(s.FullName || "?")[0].toUpperCase()}
                                </div>
                                <span className="text-sm font-semibold text-slate-800">{s.FullName || "—"}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3 text-sm text-slate-500">{s.Email || "—"}</td>
                            <td className="px-6 py-3 text-sm text-slate-500">{s.Department || "—"}</td>
                            <td className="px-6 py-3 text-sm text-slate-500">{s.Level || "—"}</td>
                          </tr>
                        ))}
                        {students.length === 0 && (
                          <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">No students registered yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* STUDENTS TAB */}
            {activeTab === "students" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">All Students</h2>
                    <p className="text-slate-400 text-sm mt-0.5">{students.length} registered student{students.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  {loadingMap.students ? <Spinner /> : students.length === 0 ? (
                    <EmptyState icon={Icon.students} title="No Students Found" subtitle="Students will appear here after they register." />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px]">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            {["#", "Student", "Email", "Matric No.", "Department", "Level", "Status", "Actions"].map((h) => (
                              <th key={h} className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {students.map((s, i) => (
                            <tr key={s.id} className="hover:bg-slate-50/70 transition-colors group">
                              <td className="px-4 py-4 text-sm text-slate-400 font-medium">{i + 1}</td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                                    {(s.FullName || "?")[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-800">{s.FullName || "—"}</p>
                                    <p className="text-xs text-slate-400">{s.Nationality || ""}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm text-slate-500">{s.Email || "—"}</td>
                              <td className="px-4 py-4 text-sm text-slate-500">{s.MatricNumber || "—"}</td>
                              <td className="px-4 py-4 text-sm text-slate-500">{s.Department || "—"}</td>
                              <td className="px-4 py-4 text-sm text-slate-500">{s.Level || "—"}</td>
                              <td className="px-4 py-4">
                                <Badge color={s.Status === "Active" ? "green" : "amber"}>{s.Status || "Active"}</Badge>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setSelectedStudent(s)} className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 transition-all" title="View details">
                                    {Icon.eye}
                                  </button>
                                  <button onClick={() => confirmDeleteStudent(s.id, s.FullName)} className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-all" title="Remove student">
                                    {Icon.trash}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* COURSES TAB */}
            {activeTab === "courses" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">Manage Courses</h2>
                    <p className="text-slate-400 text-sm mt-0.5">{courses.length} course{courses.length !== 1 ? "s" : ""} registered</p>
                  </div>
                  <PrimaryBtn onClick={openAddCourse} gradient="from-blue-600 to-violet-600">{Icon.plus} Add Course</PrimaryBtn>
                </div>
                {loadingMap.courses ? <Spinner /> : courses.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                    <EmptyState icon={Icon.courses} title="No Courses Yet" subtitle="Start by adding your first course."
                      action={<PrimaryBtn onClick={openAddCourse}>{Icon.plus} Add First Course</PrimaryBtn>} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {courses.map((c) => (
                      <div key={c.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 flex flex-col">
                        <div className="flex items-start justify-between mb-3 gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <Badge color="blue">{c.code}</Badge>
                              {c.credits > 0 && <Badge color="slate">{c.credits} cr</Badge>}
                              {c.semester && <Badge color="violet">{c.semester}</Badge>}
                            </div>
                            <h3 className="font-black text-slate-800 leading-snug">{c.title}</h3>
                            {c.department && <p className="text-xs text-slate-400 mt-1">{c.department}</p>}
                          </div>
                        </div>
                        {c.description && (
                          <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4 line-clamp-2">{c.description}</p>
                        )}
                        <div className="flex gap-2 pt-3 border-t border-slate-50 mt-auto">
                          <button onClick={() => openEditCourse(c)} className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition-colors">
                            {Icon.edit} Edit
                          </button>
                          <button onClick={() => confirmDeleteCourse(c.id)} className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 text-xs font-bold transition-colors">
                            {Icon.trash} Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* RESULTS TAB */}
            {activeTab === "results" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">Publish Results</h2>
                    <p className="text-slate-400 text-sm mt-0.5">{results.length} result{results.length !== 1 ? "s" : ""} published</p>
                  </div>
                  <PrimaryBtn onClick={openPublishResult} gradient="from-emerald-500 to-teal-600">{Icon.plus} Publish Result</PrimaryBtn>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  {loadingMap.results ? <Spinner /> : results.length === 0 ? (
                    <EmptyState icon={Icon.results} title="No Results Published" subtitle="Publish student results to make them visible."
                      action={<PrimaryBtn onClick={openPublishResult} gradient="from-emerald-500 to-teal-600">{Icon.plus} Publish First Result</PrimaryBtn>} />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px]">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            {["#", "Student", "Email", "Course", "Score", "Grade", "Semester", "Actions"].map((h) => (
                              <th key={h} className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {results.map((r, i) => {
                            const studentProfile = students.find((s) => String(s.id) === String(r.student_id));
                            return (
                              <tr key={r.id} className="hover:bg-slate-50/70 transition-colors group">
                                <td className="px-4 py-4 text-sm text-slate-400">{i + 1}</td>
                                <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                                  {studentProfile?.FullName || "—"}
                                </td>
                                <td className="px-4 py-4 text-sm text-slate-500">
                                  {studentProfile?.Email || r.email || "—"}
                                </td>
                                <td className="px-4 py-4">
                                  <span className="text-xs font-bold text-slate-600">{r.course_code || "—"}</span>
                                </td>
                                <td className="px-4 py-4 text-sm font-black text-slate-800">{r.score ?? "—"}</td>
                                <td className="px-4 py-4">
                                  <Badge color={gradeColor(r.grade)}>{r.grade || "—"}</Badge>
                                </td>
                                <td className="px-4 py-4 text-sm text-slate-500">{r.semester || "—"}</td>
                                <td className="px-4 py-4">
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditResult(r)} className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 transition-all">{Icon.edit}</button>
                                    <button onClick={() => confirmDeleteResult(r.id)} className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-all">{Icon.trash}</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ANNOUNCEMENTS TAB */}
            {activeTab === "announcements" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">Announcements</h2>
                    <p className="text-slate-400 text-sm mt-0.5">{announcements.length} announcement{announcements.length !== 1 ? "s" : ""}</p>
                  </div>
                  <PrimaryBtn onClick={openAddAnnouncement} gradient="from-amber-500 to-orange-500">{Icon.plus} New Announcement</PrimaryBtn>
                </div>
                {loadingMap.announcements ? <Spinner /> : announcements.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                    <EmptyState icon={Icon.bell} title="No Announcements" subtitle="Post announcements to notify students."
                      action={<PrimaryBtn onClick={openAddAnnouncement} gradient="from-amber-500 to-orange-500">{Icon.plus} Post First Announcement</PrimaryBtn>} />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {announcements.map((a) => (
                      <div key={a.id} className={`bg-white rounded-3xl border shadow-sm hover:shadow-md transition-all p-5 ${a.priority === "urgent" ? "border-red-200" : a.priority === "important" ? "border-amber-200" : "border-slate-100"}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <h3 className="font-black text-slate-800">{a.title}</h3>
                              <Badge color={priorityColor[a.priority] || "slate"}>{a.priority || "normal"}</Badge>
                              <Badge color={targetColor[a.target] || "blue"}>{a.target || "all"}</Badge>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed">{a.content}</p>
                            <p className="text-xs text-slate-400 mt-3 font-medium">{formatDate(a.created_at)}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button onClick={() => openEditAnnouncement(a)} className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 transition-all">{Icon.edit}</button>
                            <button onClick={() => confirmDeleteAnnouncement(a.id)} className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-all">{Icon.trash}</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TIMETABLE TAB */}
            {activeTab === "timetable" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-800">Manage Timetable</h2>
                    <p className="text-slate-400 text-sm mt-0.5">{timetables.length} class session{timetables.length !== 1 ? "s" : ""} scheduled</p>
                  </div>
                  <PrimaryBtn onClick={openAddTimetable} gradient="from-cyan-500 to-blue-600">{Icon.plus} Add Class</PrimaryBtn>
                </div>
                {loadingMap.timetables ? <Spinner /> : timetables.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                    <EmptyState icon={Icon.calendar} title="No Classes Scheduled" subtitle="Build your timetable by adding class sessions."
                      action={<PrimaryBtn onClick={openAddTimetable} gradient="from-cyan-500 to-blue-600">{Icon.plus} Add First Class</PrimaryBtn>} />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {DAYS.map((day) => {
                      const dayEntries = timetables.filter((t) => t.day === day);
                      if (dayEntries.length === 0) return null;
                      return (
                        <div key={day}>
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">{day}</h3>
                            <div className="flex-1 h-px bg-slate-200" />
                            <span className="text-xs text-slate-400 font-semibold">{dayEntries.length} class{dayEntries.length !== 1 ? "es" : ""}</span>
                          </div>
                          <div className="flex flex-col gap-3">
                            {dayEntries.sort((a, b) => ((a.start_time || "") > (b.start_time || "") ? 1 : -1)).map((t) => (
                              <div key={t.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-4 flex items-center gap-4 group">
                                <div className="w-1.5 h-14 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-black text-slate-800 truncate">{t.course_title || "Unknown Course"}</p>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    {t.course_code && <Badge color="cyan">{t.course_code}</Badge>}
                                    <span className="text-xs text-slate-400 font-semibold">{t.start_time}{t.end_time ? ` – ${t.end_time}` : ""}</span>
                                    {t.venue && <span className="text-xs text-slate-500 font-medium">📍 {t.venue}</span>}
                                    {t.lecturer && <span className="text-xs text-slate-500 font-medium">👤 {t.lecturer}</span>}
                                  </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                  <button onClick={() => openEditTimetable(t)} className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 transition-all">{Icon.edit}</button>
                                  <button onClick={() => confirmDeleteTimetable(t.id)} className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-all">{Icon.trash}</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  );
}