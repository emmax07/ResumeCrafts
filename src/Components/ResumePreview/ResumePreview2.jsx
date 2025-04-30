import { useLocation } from "react-router-dom";
import ResumePDFGenerator from "./ResumePDFGenerator";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import PropTypes from "prop-types";
import "./ResumePreview2.css";

const ResumePreview2 = ({ userEmail }) => {
  const location = useLocation();
  const resumeData = location.state?.resume || {};

  const { generatePDF, getPDFBlob } = ResumePDFGenerator();

  // Normalize key_skills, awards, work_experience, and education
  resumeData.key_skills = Array.isArray(resumeData.key_skills)
    ? resumeData.key_skills
    : typeof resumeData.key_skills === "string" &&
      resumeData.key_skills.length > 0
    ? resumeData.key_skills.split(",").map((skill) => skill.trim())
    : [];

  resumeData.awards = Array.isArray(resumeData.awards) ? resumeData.awards : [];
  resumeData.work_experience = Array.isArray(resumeData.work_experience)
    ? resumeData.work_experience
    : [];
  resumeData.education = Array.isArray(resumeData.education)
    ? resumeData.education
    : [];

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
      alert("Error saving resume. Please try again.");
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
      <div id="resume" className="resume-preview2-wrapper">
        {/* Left side */}
        <div className="resume-preview2-left">
          <div className="resume-preview2-section">
            {resumeData.key_skills.length > 0 ? (
              <div className="resume-preview2-content-container">
                <h2>Key Skills</h2>
                {resumeData.key_skills.map((skill, index) => (
                  <p className="resume-preview2-skill_item" key={index}>
                    {skill}
                  </p>
                ))}
              </div>
            ) : (
              <p>No key skills listed</p>
            )}
          </div>

          <div className="resume-preview2-section">
            {resumeData.awards.length > 0 ? (
              <div className="resume-preview2-content-container">
                <h2>Awards</h2>
                {resumeData.awards.map((award, index) => (
                  <p className="resume-preview2-award_item" key={index}>
                    {award}
                  </p>
                ))}
              </div>
            ) : (
              <p>No awards listed</p>
            )}
          </div>

          <div className="resume-preview2-section">
            {resumeData.research_publications.length > 0 ? (
              <div className="resume-preview2-content-container">
                <h2>Research Publications</h2>
                {resumeData.awards.map((publication, index) => (
                  <p className="resume-preview2-publication_item" key={index}>
                    {publication}
                  </p>
                ))}
              </div>
            ) : (
              <p>No publications listed</p>
            )}
          </div>

          <div className="resume-preview2-section">
            {resumeData.professional_membership.length > 0 ? (
              <div className="resume-preview2-content-container">
                <h2>Professional Membership</h2>
                {resumeData.awards.map((membership, index) => (
                  <p className="resume-preview2-membership_item" key={index}>
                    {membership}
                  </p>
                ))}
              </div>
            ) : (
              <p>No publications listed</p>
            )}
          </div>

          <div className="resume-preview2-contact-info">
            <p>{resumeData.phone || "Phone"}</p>
            <p>{resumeData.email || "Email"}</p>
            <p>{resumeData.address || "Address"}</p>
          </div>
        </div>

        {/* Right side */}
        <div className="resume-preview2-right">
          <h1>{resumeData.fullName || "Your Name"}</h1>

          <p className="resume-preview2-profile-summary">
            {resumeData.profile_summary || "Profile summary goes here."}
          </p>

          <div className="resume-preview2-section">
            <h2>Experience</h2>
            {resumeData.work_experience.length > 0 ? (
              resumeData.work_experience.map((experience, index) => (
                <p className="resume-preview2-new_para" key={index}>
                  {experience}
                </p>
              ))
            ) : (
              <p>No experience listed</p>
            )}
          </div>

          <div className="resume-preview2-section">
            <h2>Education</h2>
            {resumeData.education.length > 0 ? (
              resumeData.education.map((education, index) => (
                <p className="resume-preview2-new_para" key={index}>
                  {education}
                </p>
              ))
            ) : (
              <p>No education listed</p>
            )}
          </div>

          <div className="resume-preview2-section">
            <h2>Projects</h2>
            {resumeData.projects.length > 0 ? (
              resumeData.projects.map((project, index) => (
                <p className="resume-preview2-new_para" key={index}>
                  {project}
                </p>
              ))
            ) : (
              <p>No project listed</p>
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

ResumePreview2.propTypes = {
  userEmail: PropTypes.string,
};

export default ResumePreview2;
