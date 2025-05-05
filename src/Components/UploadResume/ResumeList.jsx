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

  // Fetch user profile data (email and role)
  const fetchProfile = async () => {
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
      alert("Login required");
    }
  };

  // Fetch resumes based on user role
  const fetchResumes = async () => {
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
    }
  };

  // Check if the token is valid
  const isTokenValid = () => {
    if (!token) {
      alert("Session expired, please log in again.");
      return false;
    }
    return true;
  };

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
          // Log to check the content type and response data
          console.log("Response headers: ", res.headers);
          console.log("Response data: ", res.data);

          // Check if the response content type is pdf
          if (res.headers["content-type"] === "application/pdf") {
            const url = window.URL.createObjectURL(
              new Blob([res.data], { type: "application/pdf" })
            );
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "resume.pdf"); // fallback filename
            document.body.appendChild(link);
            link.click();
            link.remove();
          } else {
            console.error("Received content is not a PDF.");
            setErrorMessage(
              "Failed to download the resume. The file may not be a valid PDF."
            );
          }
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
          // Log to check the content type and response data
          console.log("Response headers: ", res.headers);
          console.log("Response data: ", res.data);

          // Check if the response content type is pdf
          if (res.headers["content-type"] === "application/pdf") {
            const url = window.URL.createObjectURL(
              new Blob([res.data], { type: "application/pdf" })
            );
            window.open(url, "_blank");
          } else {
            console.error("Received content is not a PDF.");
            setErrorMessage(
              "Failed to view the resume. The file may not be a valid PDF."
            );
          }
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
      alert("Failed to delete the resume.");
    }
  };

  // Fetch profile and resumes when the component mounts
  useEffect(() => {
    fetchProfile();
  }, [token]);

  // Fetch resumes when the user data is available
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
        {errorMessage && <p className="error-message">{errorMessage}</p>}
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
