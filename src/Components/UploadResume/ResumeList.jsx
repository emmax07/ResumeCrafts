import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./UploadResume.css";

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  // Check token validity before making API requests
  const isTokenValid = () => {
    if (!token) {
      setErrorMessage("Token expired or not available. Please login again.");
      return false;
    }
    return true;
  };

  // Fetch user profile data
  const fetchProfile = async () => {
    if (!isTokenValid()) return;

    try {
      const res = await axios.get(
        "https://resumecrafts-5e7e8b26d82f.herokuapp.com/api/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserEmail(res.data.email);
      setUserRole(res.data.role);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setErrorMessage("Login required. Please log in again.");
    }
  };

  // Fetch resumes based on user role
  const fetchResumes = async () => {
    if (!isTokenValid()) return;

    try {
      const res = await axios.get(
        "https://resumecrafts-5e7e8b26d82f.herokuapp.com/api/resumes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      setErrorMessage("Error fetching resumes. Please try again later.");
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

  // Download resume function
  const downloadResume = (resumeId) => {
    if (!isTokenValid()) return;

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
        .get(
          `https://resumecrafts-5e7e8b26d82f.herokuapp.com/api/resumes/${resumeId}/download`,
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        )
        .then((res) => {
          const url = window.URL.createObjectURL(
            new Blob([res.data], { type: "application/pdf" })
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "resume.pdf"); // fallback filename
          document.body.appendChild(link);
          link.click();
          link.remove();
        })
        .catch((err) => {
          console.error("Download error", err);
          setErrorMessage(
            "There was an error downloading your resume. Please try again."
          );
        });
    } else {
      alert("You are not authorized to download this resume.");
    }
  };

  // View resume function
  const viewResume = (resumeId) => {
    if (!isTokenValid()) return;

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
        .get(
          `https://resumecrafts-5e7e8b26d82f.herokuapp.com/api/resumes/${resumeId}/preview`,
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
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
          setErrorMessage(
            "There was an error viewing your resume. Please try again."
          );
        });
    } else {
      alert("You are not authorized to view this resume.");
    }
  };

  // Delete resume function
  const deleteResume = async (resumeId) => {
    if (!isTokenValid()) return;

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
      fetchResumes();
    } catch (err) {
      console.error("Delete error", err);
      setErrorMessage("Failed to delete the resume. Please try again later.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="resume-list-container">
        <h3>Resumes</h3>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <ul>
          {resumes.map((resume, index) => (
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
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResumeList;
