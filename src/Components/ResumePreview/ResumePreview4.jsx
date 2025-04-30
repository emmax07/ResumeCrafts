import { useLocation } from "react-router-dom";
import ResumePDFGenerator from "./ResumePDFGenerator";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import PropTypes from "prop-types";
import "./ResumePreview4.css";

const ResumePreview4 = ({ userEmail }) => {
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

      {/* Now the resume content has the correct ID */}
      <div id="resume" className="resume-preview4-container">
        {/* Left Panel */}
        <div className="resume-preview4-left-panel">
          <h1>{resumeData.fullName || "N/A"}</h1>
          <div className="resume-preview4-contact-info">
            <p>{resumeData.address || "N/A"}</p>
            <p>{resumeData.phone || "N/A"}</p>
            <p>{resumeData.email || "N/A"}</p>
            <p>{resumeData.linkedin || "N/A"}</p>
          </div>

          {resumeData.key_skills && resumeData.key_skills.trim() && (
            <div className="resume-preview4-skills-section">
              <strong>SKILLS</strong>
              <div className="resume-preview4-skills-list">
                {resumeData.key_skills
                  .split(/[,•\n]/)
                  .map(
                    (skill, index) =>
                      skill.trim() && <p key={index}>{skill.trim()}</p>
                  )}
              </div>
            </div>
          )}
          {resumeData.education?.length > 0 && (
            <div className="resume-preview4-content-container">
              <h3>EDUCATION</h3>
              {resumeData.education.map((edu, index) => (
                <p key={index}>
                  {edu.includes(":") ? (
                    <>
                      <strong>{edu.split(":")[0]}:</strong> {edu.split(":")[1]}
                    </>
                  ) : (
                    <strong>{edu}</strong>
                  )}
                </p>
              ))}
            </div>
          )}
          {resumeData.certifications?.length > 0 &&
            resumeData.certifications[0].trim() && (
              <div className="resume-preview4-content-container">
                <h3>CERTIFICATIONS</h3>
                {resumeData.certifications.map(
                  (cert, index) => cert.trim() && <p key={index}>{cert}</p>
                )}
              </div>
            )}

          {resumeData.professional_membership?.length > 0 &&
            resumeData.professional_membership[0].trim() && (
              <div className="resume-preview4-content-container">
                <h3>PROFESSIONAL MEMBERSHIP</h3>
                {resumeData.professional_membership.map(
                  (mem, index) => mem.trim() && <p key={index}>{mem}</p>
                )}
              </div>
            )}
        </div>

        {/* Right Panel */}
        <div className="resume-preview4-right-panel">
          {resumeData.profile_summary && resumeData.profile_summary.trim() && (
            <div className="resume-preview4-profile-summary">
              <h3>PROFILE SUMMARY</h3>
              <p>{resumeData.profile_summary}</p>
            </div>
          )}

          {resumeData.work_experience?.length > 0 && (
            <div className="resume-preview4-content-container">
              <h3>WORK EXPERIENCE</h3>
              {resumeData.work_experience.map((experience, index) => {
                const lines = experience
                  .split("\n")
                  .filter((line) => line.trim());
                const dateLine = lines[0] || "";
                const jobTitleLine = lines[1] || "";
                const companyLine = lines[2] || "";
                const descriptionLines = lines.slice(3);
                return (
                  <div key={index} className="resume-preview4-experience-entry">
                    {dateLine && <p className="bold">{dateLine}</p>}
                    {jobTitleLine && <p className="bold">{jobTitleLine}</p>}
                    {companyLine && <p>{companyLine}</p>}
                    {descriptionLines.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {resumeData.projects?.length > 0 && resumeData.projects[0].trim() && (
            <div className="resume-preview4-content-container">
              <h3>PROJECTS</h3>
              {resumeData.projects.map((proj, index) => {
                const [title, ...desc] = proj.split("\n");
                return (
                  <div key={index}>
                    <p className="bold">{title}</p>
                    {desc.map((d, i) => d.trim() && <p key={i}>{d}</p>)}
                  </div>
                );
              })}
            </div>
          )}

          {resumeData.research_publications?.length > 0 &&
            resumeData.research_publications[0].trim() && (
              <div className="resume-preview4-content-container">
                <h3>RESEARCH PUBLICATIONS</h3>
                {resumeData.research_publications.map(
                  (pub, index) => pub.trim() && <p key={index}>{pub}</p>
                )}
              </div>
            )}

          {resumeData.awards?.length > 0 && resumeData.awards[0].trim() && (
            <div className="resume-preview4-content-container">
              <h3>AWARDS</h3>
              {resumeData.awards.map(
                (award, index) => award.trim() && <p key={index}>{award}</p>
              )}
            </div>
          )}
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

ResumePreview4.propTypes = {
  userEmail: PropTypes.string,
};

export default ResumePreview4;
