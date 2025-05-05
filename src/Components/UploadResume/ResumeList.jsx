import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./UploadResume.css";

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const token = localStorage.getItem("token");

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "https://resumecrafts-5e7e8b26d82f.herokuapp.com/api/user/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserEmail(res.data.email);
      setUserRole(res.data.role);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      alert("Login required");
    }
  };

  // Fetch resume list
  const fetchResumes = async () => {
    try {
      const res = await axios.get(
        "https://resumecrafts-5e7e8b26d82f.herokuapp.com/api/resumes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (userRole !== "admin") {
        const filtered = res.data.filter(
          (resume) =>
            resume.user_email?.trim().toLowerCase() ===
            userEmail?.trim().toLowerCase()
        );
        setResumes(filtered);
      } else {
        setResumes(res.data);
      }
    } catch (err) {
      console.error("Error fetching resumes", err);
    }
  };

  // Download resume PDF
  const downloadResume = (resumeId) => {
    const targetResume = resumes.find((r) => r.id === resumeId);
    if (!targetResume) return alert("Resume not found");

    if (
      userRole === "admin" ||
      targetResume.user_email?.trim().toLowerCase() ===
        userEmail?.trim().toLowerCase()
    ) {
      axios
        .get(
          `https://resumecrafts-5e7e8b26d82f.herokuapp.com/api/resumes/${resumeId}/download`,
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          const filename = targetResume.filename || `resume_${resumeId}.pdf`;
          const url = window.URL.createObjectURL(
            new Blob([res.data], { type: "application/pdf" })
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
        })
        .catch((err) => {
          console.error("Download error", err);
          alert("Failed to download the resume. It may not exist.");
        });
    } else {
      alert("You are not authorized to download this resume.");
    }
  };

  // View resume in new tab
  const viewResume = (resumeId) => {
    const targetResume = resumes.find((r) => r.id === resumeId);
    if (!targetResume) return alert("Resume not found");

    if (
      userRole === "admin" ||
      targetResume.user_email?.trim().toLowerCase() ===
        userEmail?.trim().toLowerCase()
    ) {
      axios
        .get(
          `https://resumecrafts-5e7e8b26d82f.herokuapp.com/api/resumes/${resumeId}/preview`,
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          const url = window.URL.createObjectURL(
            new Blob([res.data], { type: "application/pdf" })
          );
          window.open(url, "_blank");
        })
        .catch((err) => {
          console.error("View error", err);
          alert("Failed to open the resume. It may not exist.");
        });
    } else {
      alert("You are not authorized to view this resume.");
    }
  };

  // Delete resume
  const deleteResume = async (resumeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://resumecrafts-5e7e8b26d82f.herokuapp.com/api/resumes/${resumeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchResumes(); // refresh list
    } catch (err) {
      console.error("Delete error", err);
      alert("Failed to delete the resume.");
    }
  };

  // Load profile on first render
  useEffect(() => {
    fetchProfile();
  }, [token]);

  // Load resumes once user info is fetched
  useEffect(() => {
    if (userEmail && userRole) {
      fetchResumes();
    }
  }, [userEmail, userRole]);

  return (
    <div>
      <Navbar />
      <div className="resume-list-container">
        <h3>Resumes</h3>
        <ul>
          {resumes.map((resume, index) => {
            console.log("Resume ID:", resume.id);
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
