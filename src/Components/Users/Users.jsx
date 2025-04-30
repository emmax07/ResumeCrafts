import { useEffect, useState } from "react";
import axios from "axios";
import "./Users_Admin.css";
import Navbar from "../Navbar/Navbar";

const Users = () => {
  const [profile, setProfile] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  // Function to fetch profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setFormData({
        username: res.data.username,
        email: res.data.email,
        password: "",
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      alert("Login required");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      await axios.put("http://localhost:5000/api/user/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Re-fetch the profile to reflect changes
      await fetchProfile();
      setEditing(false);
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      console.error("Update failed:", err.response || err);
      alert("Update failed. Please check your input or try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="user-dashboard">
        <h2>User Profile</h2>

        <p>
          <strong>Username:</strong>{" "}
          {editing ? (
            <input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          ) : (
            profile.username
          )}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {editing ? (
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          ) : (
            profile.email
          )}
        </p>

        {editing && (
          <p>
            <strong>New Password:</strong>{" "}
            <input
              placeholder="Enter a new password if you wish to update it, otherwise leave blank."
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </p>
        )}

        {editing ? (
          <div className="button-container">
            <button onClick={handleSave}>Save</button>
            <button
              onClick={() => {
                setEditing(false);
                setFormData({
                  username: profile.username,
                  email: profile.email,
                  password: "",
                });
              }}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)}>Edit</button>
        )}
      </div>
    </>
  );
};

export default Users;
