import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/LoginSignup/Login.jsx";
import Signup from "./Components/LoginSignup/Signup.jsx";
import Logout from "./Components/LoginSignup/Logout.jsx";
import Cards from "./Components/Cards/Cards.jsx";
import Home from "./Pages/Home.jsx";
import AdminDashboard from "./Components/Dashboard/AdminDashboard.jsx";
import UsersDashboard from "./Components/Dashboard/UsersDashboard.jsx";
import Resume from "./Components/Resume/Resume.jsx";
import ResumePreview from "./Components/ResumePreview/ResumePreview.jsx";
import Users from "./Components/Users/Users.jsx";
import AdminUser from "./Components/Users/Adminusers.jsx";
import ForgotPassword from "./Components/Password/ForgotPassword.jsx";
import ResetPassword from "./Components/Password/ResetPassword.jsx";
import { UserProvider } from "./Components/UserContext/UserContext.jsx";
import Uploads from "./Components/UploadResume/Uploads.jsx";
import ResumeList from "./Components/UploadResume/ResumeList.jsx";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/users" element={<Users />} />
          <Route path="/admin_users" element={<AdminUser />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/users_dashboard" element={<UsersDashboard />} />
          <Route path="/admin_dashboard" element={<AdminDashboard />} />
          <Route path="/resume_templates" element={<Cards />} />
          <Route path="/resume/:id" element={<Resume />} />
          <Route path="/resume_preview/:id" element={<ResumePreview />} />
          <Route path="/resumes" element={<ResumeList />} />
          <Route path="/upload_resume" element={<Uploads />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
