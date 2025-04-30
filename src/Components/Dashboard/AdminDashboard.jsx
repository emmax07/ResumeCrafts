import { Link } from "react-router-dom";
import "./Dashboard.css";
import Navbar from "../Navbar/Navbar";

const cards = [
  { title: "Users", link: "/admin_users", icon: "👥", color: "blue" },
  { title: "Resumes", link: "/resumes", icon: "💼", color: "green" },
  {
    title: "Resume Templates",
    link: "/resume_templates",
    icon: "📝",
    color: "orange",
  },
  { title: "Upload Resume", link: "/upload_resume", icon: "📤", color: "red" },
];

const AdminDashboard = () => {
  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="dashboard-card-column">
          {cards.map((card, idx) => (
            <Link
              to={card.link}
              key={idx}
              className={`dashboard-card card-${card.color}`}
            >
              <div className="card-info">
                <h2 className="card-title">{card.title}</h2>
              </div>
              <div className="card-icon">{card.icon}</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
