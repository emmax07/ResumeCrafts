import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./UploadResume.css";

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserEmail(res.data.email);
      setUserRole(res.data.role);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      alert("Login required");
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/resumes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      if (userRole !== "admin") {
        const filtered = res.data.filter(
          (resume) =>
            resume.user_email.trim().toLowerCase() ===
            userEmail.trim().toLowerCase()
        );
        setResumes(filtered);
      } else {
        setResumes(res.data);
      }
    } catch (err) {
      console.error("Error fetching resumes", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  useEffect(() => {
    if (userEmail && userRole) {
      fetchResumes();
    }
  }, [userEmail, userRole]);

  const downloadResume = (resumeId) => {
    if (
      userRole === "admin" ||
      resumes.some(
        (resume) =>
          resume.id === resumeId &&
          resume.user_email.trim().toLowerCase() ===
            userEmail.trim().toLowerCase()
      )
    ) {
      axios
        .get(`http://localhost:5000/api/resumes/${resumeId}/download`, {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const url = window.URL.createObjectURL(
            new Blob([res.data], { type: "application/pdf" })
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", res.data.filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
        })
        .catch((err) => {
          console.error("Download error", err);
        });
    } else {
      alert("You are not authorized to download this resume.");
    }
  };

  const viewResume = (resumeId) => {
    if (
      userRole === "admin" ||
      resumes.some(
        (resume) =>
          resume.id === resumeId &&
          resume.user_email.trim().toLowerCase() ===
            userEmail.trim().toLowerCase()
      )
    ) {
      axios
        .get(`http://localhost:5000/api/resumes/${resumeId}/preview`, {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const url = window.URL.createObjectURL(
            new Blob([res.data], { type: "application/pdf" })
          );
          window.open(url, "_blank");
        })
        .catch((err) => {
          console.error("View error", err);
        });
    } else {
      alert("You are not authorized to view this resume.");
    }
  };

  const deleteResume = async (resumeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/resumes/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchResumes();
    } catch (err) {
      console.error("Delete error", err);
      alert("Failed to delete the resume.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="resume-list-container">
        <h3>Resumes</h3>
        <ul>
          {resumes.map((resume, index) => {
            console.log(resume);
            return (
              <li key={resume.id} className="resume-list-item">
                <span className="resume-index">{index + 1}.</span>
                <div className="resume-details">
                  <div className="filename">{resume.filename}</div>
                  <div className="email">{resume.user_email}</div>
                </div>
                <div className="action-buttons">
                  <button onClick={() => downloadResume(resume.id)}>
                    Download
                  </button>
                  <button onClick={() => viewResume(resume.id)}>View</button>
                  <button
                    onClick={() => deleteResume(resume.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ResumeList;
