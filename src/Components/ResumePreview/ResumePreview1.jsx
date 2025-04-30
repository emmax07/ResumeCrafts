import { useLocation } from "react-router-dom";
import ResumePDFGenerator from "./ResumePDFGenerator";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import PropTypes from "prop-types";
import "./ResumePreview1.css";

const ResumePreview1 = ({ userEmail }) => {
  const location = useLocation();
  const resumeData = location.state?.resume || {};
  const { generatePDF, getPDFBlob } = ResumePDFGenerator();

  const fileName = `${
    resumeData.fullName ? resumeData.fullName.replace(/\s+/g, "") : "resume"
  }_Resume.pdf`;

  const saveResume = async (emailToUse) => {
    const pdfBlob = await getPDFBlob("#resume");
    if (!pdfBlob) {
      alert("Resume not generated. Please try again.");
      return;
    }

    const formData = new FormData();
    formData.append("file", pdfBlob, fileName);
    formData.append("userEmail", emailToUse);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/resumes",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Resume saved successfully!");
      } else {
        alert("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Invalid user email provided. Please provide your user email.");
    }
  };

  const handleSaveClick = () => {
    let emailToUse = userEmail;

    if (!emailToUse) {
      emailToUse = prompt("Please enter your user email to save the resume:");
      if (!emailToUse) {
        alert("Email is required to save the resume.");
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(emailToUse)) {
        alert("Please enter a valid email address.");
        return;
      }
    }

    saveResume(emailToUse);
  };

  return (
    <div>
      <Navbar />

      <div id="resume" className="resume-preview1-container">
        <div className="resume-preview1-header">
          <h1>{resumeData.fullName || "YOUR NAME"}</h1>
        </div>

        <div className="resume-preview1-main-content">
          {/* Left Column */}
          <div className="resume-preview1-left-column">
            {/* CONTACT */}
            <div className="resume-preview1-section contact-section">
              <h3>CONTACT</h3>
              <ul>
                <li>
                  <strong>Email:</strong> {resumeData.email}
                </li>
                <li>
                  <strong>Phone:</strong> {resumeData.phone}
                </li>
                <li>
                  <strong>Address:</strong> {resumeData.address}
                </li>
                <li>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href={`https://${resumeData.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resumeData.linkedin}
                  </a>
                </li>
              </ul>
            </div>

            {/* EDUCATION */}
            {Array.isArray(resumeData.education) &&
              resumeData.education.length > 0 && (
                <div className="resume-preview1-section">
                  <h3>EDUCATION</h3>
                  {resumeData.education.map((edu, index) => {
                    const parts = edu
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean);
                    return (
                      <div key={index} style={{ marginBottom: "16px" }}>
                        <p>
                          <strong>{parts[0]}</strong>
                        </p>
                        <p>{parts[1]}</p>
                        <p>
                          {parts[2]} {parts[3] ? `– ${parts[3]}` : ""}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

            {/* SKILLS */}
            {resumeData.key_skills?.trim() && (
              <div className="section">
                <h3>SKILLS</h3>
                <p>{resumeData.key_skills}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="resume-preview1-right-column">
            {/* PROFILE SUMMARY */}
            {resumeData.profile_summary?.trim() && (
              <div className="resume-preview1-section-Profile">
                <h3>PROFILE SUMMARY</h3>
                <p>{resumeData.profile_summary}</p>
              </div>
            )}

            {/* PROJECTS */}
            {Array.isArray(resumeData.projects) &&
              resumeData.projects.length > 0 && (
                <div className="resume-preview1-section">
                  <h3>PROJECTS</h3>
                  {resumeData.projects.map((proj, index) => {
                    const lines = proj
                      .split("\n")
                      .filter((line) => line.trim());
                    const title = lines[0] || "";
                    const details = lines.slice(1);
                    return (
                      <div
                        key={index}
                        className="resume-preview1-project-entry"
                      >
                        <p>
                          <strong>{title}</strong>
                        </p>
                        {details.map((detail, i) => (
                          <p key={i}>{detail}</p>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

            {/* WORK EXPERIENCE */}
            {Array.isArray(resumeData.work_experience) &&
              resumeData.work_experience.length > 0 && (
                <div className="resume-preview1-section">
                  <h3>WORK EXPERIENCE</h3>
                  {resumeData.work_experience.map((experience, index) => {
                    const lines = experience
                      .split("\n")
                      .filter((line) => line.trim());
                    const dateRange = lines[0] || "";
                    const jobTitle = lines[1] || "";
                    const companyLocation = lines[2] || "";
                    const details = lines.slice(3);
                    return (
                      <div
                        key={index}
                        className="resume-preview1-experience-entry"
                      >
                        <p>
                          <strong>{dateRange}</strong>
                        </p>
                        <p>
                          <strong>{jobTitle}</strong>
                        </p>
                        <p>{companyLocation}</p>
                        {details.map((detail, i) => (
                          <p key={i}>{detail}</p>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

            {/* CERTIFICATIONS */}
            {Array.isArray(resumeData.certifications) &&
              resumeData.certifications.some((item) => item.trim()) && (
                <div className="resume-preview1-section">
                  <h3>CERTIFICATIONS</h3>
                  {resumeData.certifications.map(
                    (cert, index) => cert.trim() && <p key={index}>{cert}</p>
                  )}
                </div>
              )}

            {/* RESEARCH PUBLICATIONS */}
            {Array.isArray(resumeData.research_publications) &&
              resumeData.research_publications.some((item) => item.trim()) && (
                <div className="resume-preview1-section">
                  <h3>RESEARCH PUBLICATIONS</h3>
                  {resumeData.research_publications.map(
                    (pub, index) => pub.trim() && <p key={index}>{pub}</p>
                  )}
                </div>
              )}

            {/* AWARDS */}
            {Array.isArray(resumeData.awards) &&
              resumeData.awards.some((item) => item.trim()) && (
                <div className="resume-preview1-section">
                  <h3>AWARDS</h3>
                  {resumeData.awards.map(
                    (award, index) => award.trim() && <p key={index}>{award}</p>
                  )}
                </div>
              )}

            {/* PROFESSIONAL MEMBERSHIP */}
            {Array.isArray(resumeData.professional_membership) &&
              resumeData.professional_membership.some((item) =>
                item.trim()
              ) && (
                <div className="resume-preview1-section">
                  <h3>PROFESSIONAL MEMBERSHIP</h3>
                  {resumeData.professional_membership.map(
                    (mem, index) => mem.trim() && <p key={index}>{mem}</p>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="resume-button-group">
        <button
          className="resume-button"
          onClick={() => generatePDF("#resume", fileName)}
        >
          Download as PDF
        </button>
        <button className="resume-button" onClick={handleSaveClick}>
          Save Resume
        </button>
      </div>
    </div>
  );
};

ResumePreview1.propTypes = {
  userEmail: PropTypes.string,
};

export default ResumePreview1;
