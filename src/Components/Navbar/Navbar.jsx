import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Logout from "../LoginSignup/Logout.jsx";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(""); // Track user role
  const [username, setUsername] = useState(""); // Track username
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await axios.get(
            "http://localhost:5000/api/user/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // Assuming the role and username are part of the response
          const userRole = res.data.role;
          const userName = res.data.username;
          setRole(userRole); // Set role from the fetched profile
          setUsername(userName); // Set username from the fetched profile
          setIsLoggedIn(true); // User is logged in if profile is successfully fetched
        } else {
          setIsLoggedIn(false); // No token, so not logged in
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setIsLoggedIn(false); // In case of error, treat user as not logged in
      }
    };

    fetchProfile(); // Run the fetch function on component mount
  }, []);

  const handleNavigation = () => {
    // Navigate to the appropriate dashboard based on the role
    if (role === "admin") {
      navigate("/admin_dashboard");
    } else if (role === "user") {
      navigate("/users_dashboard");
    }
  };

  return (
    <nav>
      <ul>
        <li className="home-button">
          <Link to="/">💼 ResumeCrafts</Link>
        </li>
      </ul>

      <div className="right-items">
        <ul>
          {isLoggedIn && username && (
            <li className="username">
              {/* Circle with emoji (placeholder image) */}
              <div className="avatar">
                <span role="img" aria-label="user">
                  👤
                </span>
              </div>
              <span>Hello, {username}</span>
            </li>
          )}
          <li className="dashboard">
            <button onClick={handleNavigation}>
              {role === "admin" ? "Admin Dashboard" : "User Dashboard"}
            </button>
          </li>
          {isLoggedIn ? (
            <li className="logout-button">
              <Logout />
            </li>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
