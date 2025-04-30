import { useLocation } from "react-router-dom";
import ResumePDFGenerator from "./ResumePDFGenerator";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import PropTypes from "prop-types";
import "./ResumePreview3.css";

const ResumePreview3 = ({ userEmail }) => {
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
      <div id="resume" className="resume-preview3-container">
        {/* Header */}
        <div className="resume-preview3-header-section">
          <h1 className="resume-preview3-full-name">
            {resumeData.fullName || "N/A"}
          </h1>
        </div>

        {/* Two Columns */}
        <div className="resume-preview3-main-content">
          {/* Left Sidebar */}
          <div className="resume-preview3-left-column">
            <div className="resume-preview3-contact-section">
              <h2 className="resume-preview3-section-title">Contact</h2>
              <p>{resumeData.address || "Address not provided"}</p>
              <p>{resumeData.phone || "Phone not provided"}</p>
              <p>{resumeData.email || "Email not provided"}</p>
              <p>{resumeData.linkedin || "LinkedIn not provided"}</p>
            </div>

            <div className="resume-preview3-education-section">
              <h2 className="resume-preview3-section-title">Education</h2>
              {resumeData.education?.length > 0 ? (
                resumeData.education.map((edu, index) => (
                  <p className="resume-preview3-new_para" key={index}>
                    {edu}
                  </p>
                ))
              ) : (
                <p>No education details</p>
              )}
            </div>

            <div className="resume-preview3-skills-section">
              <h2 className="resume-preview3-section-title">Skills</h2>
              <p>{resumeData.key_skills || "No skills listed"}</p>
            </div>
          </div>

          {/* Right Content */}
          <div className="resume-preview3-right-column">
            <div className="resume-preview3-profile-summary">
              <h2 className="resume-preview3-section-title">Profile</h2>
              <p>
                {resumeData.profile_summary || "No profile summary provided."}
              </p>
            </div>

            {resumeData.work_experience?.length > 0 && (
              <div className="resume-preview3-work-experience-section">
                <h2 className="resume-preview3-section-title">
                  Work Experience
                </h2>
                {resumeData.work_experience.map((experience, index) => (
                  <p className="resume-preview3-new_para" key={index}>
                    {experience}
                  </p>
                ))}
              </div>
            )}

            {resumeData.projects?.length > 0 && (
              <div className="resume-preview3-section">
                <h2 className="resume-preview3-section-title">Projects</h2>
                {resumeData.projects.map((project, index) => (
                  <p className="resume-preview3-new_para" key={index}>
                    {project}
                  </p>
                ))}
              </div>
            )}

            {resumeData.research_publications?.length > 0 && (
              <div className="resume-preview3-section">
                <h2 className="resume-preview3-section-title">
                  Research Publications
                </h2>
                {resumeData.research_publications.map((publication, index) => (
                  <p className="resume-preview3-new_para" key={index}>
                    {publication}
                  </p>
                ))}
              </div>
            )}

            {resumeData.awards?.length > 0 && (
              <div className="resume-preview3-section">
                <h2 className="resume-preview3-section-title">Awards</h2>
                {resumeData.awards.map((award, index) => (
                  <p className="resume-preview3-new_para" key={index}>
                    {award}
                  </p>
                ))}
              </div>
            )}

            {resumeData.professional_membership?.length > 0 && (
              <div className="resume-preview3-section">
                <h2 className="resume-preview3-section-title">
                  Professional Membership
                </h2>
                {resumeData.professional_membership.map((membership, index) => (
                  <p className="resume-preview3-new_para" key={index}>
                    {membership}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
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

export default ResumePreview3;

ResumePreview3.propTypes = {
  userEmail: PropTypes.string,
};
