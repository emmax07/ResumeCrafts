import { useLocation } from "react-router-dom";
import ResumePDFGenerator from "./ResumePDFGenerator";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import PropTypes from "prop-types";
import "./ResumePreview5.css"; // Import the CSS file

const ResumePreview5 = ({ userEmail }) => {
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

      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
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
      <div id="resume" className="resume-preview5-container">
        <div className="resume-preview5-sidebar">
          <div className="resume-preview5-contact-info">
            <h1>{resumeData.fullName || "Full Name"}</h1>
            <p>{resumeData.profession || "Profession Title"}</p>
            <p>{resumeData.email || "Email"}</p>
            <p>{resumeData.phone || "Phone"}</p>
            <p>{resumeData.address || "Address"}</p>
          </div>

          <div className="resume-preview5-sidebar-section">
            <h2>Profile Summary</h2>
            <p>{resumeData.profile_summary || "N/A"}</p>
          </div>

          <div className="resume-preview5-sidebar-section">
            <h2>Education</h2>
            {resumeData.education?.map((edu, index) => (
              <p key={index}>{edu}</p>
            ))}
          </div>

          <div className="resume-preview5-sidebar-section">
            <h2>Certifications</h2>
            {resumeData.certifications?.map((cert, index) => (
              <p key={index}>{cert}</p>
            ))}
          </div>

          <div className="resume-preview5-sidebar-section">
            <h2>Skills</h2>
            <p>{resumeData.key_skills || "N/A"}</p>
          </div>
        </div>

        <div className="resume-preview5-main-content">
          <div className="resume-preview5-main-section">
            <h2>Professional Experience</h2>
            {resumeData.work_experience?.map((work, index) => (
              <p key={index} className="resume-preview5-new-para">
                {work}
              </p>
            ))}
          </div>

          {resumeData.projects?.length > 0 && (
            <div className="resume-preview5-main-section">
              <h2>Projects</h2>
              {resumeData.projects.map((project, index) => (
                <p key={index} className="resume-preview5-new-para">
                  {project}
                </p>
              ))}
            </div>
          )}

          {resumeData.research_publications?.length > 0 && (
            <div className="resume-preview5-main-section">
              <h2>Research Publications</h2>
              {resumeData.research_publications.map((publication, index) => (
                <p key={index} className="resume-preview5-new-para">
                  {publication}
                </p>
              ))}
            </div>
          )}

          {resumeData.awards?.length > 0 && (
            <div className="resume-preview5-main-section">
              <h2>Awards</h2>
              {resumeData.awards.map((award, index) => (
                <p key={index} className="resume-preview5-new-para">
                  {award}
                </p>
              ))}
            </div>
          )}

          {resumeData.professional_membership?.length > 0 && (
            <div className="resume-preview5-main-section">
              <h2>Professional Membership</h2>
              {resumeData.professional_membership.map((membership, index) => (
                <p key={index} className="resume-preview5-new-para">
                  {membership}
                </p>
              ))}
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

ResumePreview5.propTypes = {
  userEmail: PropTypes.string,
};

export default ResumePreview5;
