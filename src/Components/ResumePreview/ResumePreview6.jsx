import { useLocation } from "react-router-dom";
import ResumePDFGenerator from "./ResumePDFGenerator";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import PropTypes from "prop-types";
import "./ResumePreview6.css";

const ResumePreview6 = ({ userEmail }) => {
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

      {/* Added missing ID 'resume' here */}
      <div id="resume" className="resume-preview6-container">
        {/* Header */}
        <div className="resume-preview6-header">
          <h1>{resumeData.fullName || "YOUR NAME"}</h1>
          <div className="resume-preview6-contact-line">
            {resumeData.phone && <span>{resumeData.phone}</span>}
            {resumeData.email && <span> | {resumeData.email}</span>}
            {resumeData.linkedin && (
              <span>
                {" "}
                |{" "}
                <a
                  href={`https://${resumeData.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </span>
            )}
            {resumeData.address && <span> | {resumeData.address}</span>}
          </div>
        </div>

        {/* Body */}
        <div className="resume-preview6-body">
          {/* Left Column */}
          <div className="resume-preview6-left">
            {/* Education */}
            {Array.isArray(resumeData.education) &&
              resumeData.education.length > 0 && (
                <div className="resume-preview6-section">
                  <h3>EDUCATION</h3>
                  {resumeData.education.map((edu, index) => {
                    const parts = edu.split("\n").filter((line) => line.trim());
                    return (
                      <div className="resume-preview6-education" key={index}>
                        <p>
                          <strong>{parts[0]}</strong>
                        </p>
                        <p>{parts[1]}</p>
                        <p>
                          {parts[2]}
                          {parts[3] ? `, ${parts[3]}` : ""}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

            {/* Skills */}
            {resumeData.key_skills && (
              <div className="resume-preview6-section">
                <h3>SKILLS</h3>
                <p>{resumeData.key_skills}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="resume-preview6-right">
            {/* Profile Summary */}
            {resumeData.profile_summary && (
              <div className="resume-preview6-section">
                <h3>PROFILE SUMMARY</h3>
                <p>{resumeData.profile_summary}</p>
              </div>
            )}

            {/* Work Experience */}
            {Array.isArray(resumeData.work_experience) &&
              resumeData.work_experience.length > 0 && (
                <div className="resume-preview6-section">
                  <h3>WORK EXPERIENCE</h3>
                  {resumeData.work_experience.map((experience, index) => {
                    const lines = experience
                      .split("\n")
                      .filter((line) => line.trim());
                    const dateRange = lines[0] || "";
                    const jobTitle = lines[1] || "";
                    const location = lines[2] || "";
                    const details = lines.slice(3);
                    return (
                      <div key={index} className="resume-preview6-entry-block">
                        <p>
                          <strong>{dateRange}</strong>
                        </p>
                        <p>
                          <strong>
                            <em>{jobTitle}</em>
                          </strong>
                        </p>
                        <p>{location}</p>
                        {details.map((d, i) => (
                          <p key={i} className="resume-preview6-entry-detail">
                            {d}
                          </p>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

            {/* Projects */}
            {Array.isArray(resumeData.projects) &&
              resumeData.projects.length > 0 && (
                <div className="resume-preview6-section">
                  <h3>PROJECTS</h3>
                  {resumeData.projects.map((proj, index) => {
                    const lines = proj
                      .split("\n")
                      .filter((line) => line.trim());
                    const title = lines[0] || "";
                    const subtitle = lines[1] || "";
                    const details = lines.slice(2);
                    return (
                      <div key={index} className="resume-preview6-entry-block">
                        <p>
                          <strong>{title}</strong>
                        </p>
                        <p>
                          <em>{subtitle}</em>
                        </p>
                        {details.map((d, i) => (
                          <p key={i} className="resume-preview6-entry-detail">
                            {d}
                          </p>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

            {/* Certifications */}
            {Array.isArray(resumeData.certifications) &&
              resumeData.certifications.some((item) => item.trim()) && (
                <div className="resume-preview6-section">
                  <h3>CERTIFICATIONS</h3>
                  {resumeData.certifications.map(
                    (cert, index) => cert.trim() && <p key={index}>{cert}</p>
                  )}
                </div>
              )}

            {/* Research Publications */}
            {Array.isArray(resumeData.research_publications) &&
              resumeData.research_publications.some((item) => item.trim()) && (
                <div className="resume-preview6-section">
                  <h3>RESEARCH PUBLICATIONS</h3>
                  {resumeData.research_publications.map(
                    (pub, index) => pub.trim() && <p key={index}>{pub}</p>
                  )}
                </div>
              )}

            {/* Awards */}
            {Array.isArray(resumeData.awards) &&
              resumeData.awards.some((item) => item.trim()) && (
                <div className="resume-preview6-section">
                  <h3>AWARDS</h3>
                  {resumeData.awards.map(
                    (award, index) => award.trim() && <p key={index}>{award}</p>
                  )}
                </div>
              )}

            {/* Professional Membership */}
            {Array.isArray(resumeData.professional_membership) &&
              resumeData.professional_membership.some((item) =>
                item.trim()
              ) && (
                <div className="resume-preview6-section">
                  <h3>PROFESSIONAL MEMBERSHIP</h3>
                  {resumeData.professional_membership.map(
                    (mem, index) => mem.trim() && <p key={index}>{mem}</p>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
      {/* Button Group */}
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

ResumePreview6.propTypes = {
  userEmail: PropTypes.string,
};

export default ResumePreview6;
