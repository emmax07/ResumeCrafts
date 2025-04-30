import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Users_Admin.css";
import Navbar from "../Navbar/Navbar";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
  });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfileAndUsers = async () => {
      try {
        // Fetch user profile
        const profile = await axios.get(
          "http://localhost:5000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (profile.data.role !== "admin") {
          alert("Access denied");
          navigate("/login");
          return;
        }

        // Fetch all users if the logged-in user is an admin
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        alert("Unauthorized");
        navigate("/login");
      }
    };

    fetchProfileAndUsers();
  }, [navigate, token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${editingUser}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(
        users.map((user) =>
          user.id === editingUser ? { ...user, ...formData } : user
        )
      );
      setEditingUser(null);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update user");
    }
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) =>
              editingUser === user.id ? (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditingUser(null)}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminUser;
