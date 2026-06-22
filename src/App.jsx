import { BrowserRouter, Routes, Route } from "react-router-dom";

import Admindashboard from "./pages_girl/Admindashboard.jsx";
import Dashboard from "./pages_girl/Dashboard.jsx";
import Details from "./pages_girl/Details.jsx";
import Homepage from "./pages_girl/Homepage.jsx";
import Loginpage from "./pages_girl/Loginpage.jsx";
import Signuppage from "./pages_girl/Signuppage.jsx";
import Students from "./pages_girl/Students.jsx";

import ProtectedRoute from "./component/ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Homepage */}
        <Route path="/" element={<Homepage />} />

        {/* Auth */}
        <Route path="/login" element={<Loginpage />} />
        <Route path="/signup" element={<Signuppage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Admindashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Students System */}
        <Route path="/students" element={<Students />} />
        <Route path="/details/:id" element={<Details />} />

      </Routes>
    </BrowserRouter>
  );
}
