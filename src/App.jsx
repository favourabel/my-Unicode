import { BrowserRouter, Routes, Route } from "react-router-dom";

import Admindashboard from "./pages/Admindashboard.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Details from "./pages/Details.jsx";
import Homepage from "./pages/Homepage.jsx";
import Loginpage from "./pages/Loginpage.jsx";
import Signuppage from "./pages/Signuppage.jsx";
import Students from "./pages/Students.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Homepage */}
        <Route path="/" element={<Homepage />} />

        {/* Auth */}
        <Route path="/login" element={<Loginpage />} />
        <Route path="/signup" element={<Signuppage />} />

        {/* Dashboards */}
        <Route path="/admin" element={<Admindashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Students System */}
        <Route path="/students" element={<Students />} />
        <Route path="/details/:id" element={<Details />} />

      </Routes>
    </BrowserRouter>
  );
}