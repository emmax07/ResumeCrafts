import { useLocation } from "react-router-dom";
import ResumePDFGenerator from "./ResumePDFGenerator";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import PropTypes from "prop-types";

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
      <div id="resume" className="resume-view-container">
        <h1>{resumeData.fullName || "N/A"}</h1>
        <p>
          <strong>Address:</strong> {resumeData.address || "N/A"}
        </p>
        <p>
          {resumeData.email || "N/A"}, {resumeData.phone || "N/A"},{" "}
          {resumeData.linkedin || "N/A"}
        </p>
        <p>
          <strong>Profile Summary:</strong>{" "}
          {resumeData.profile_summary || "N/A"}
        </p>
        <p>
          <strong>Key Skills:</strong> {resumeData.key_skills || "N/A"}
        </p>

        {/* Sections Rendering */}
        {resumeData.work_experience?.length > 0 && (
          <div className="content-container">
            <strong>Work Experience:</strong>
            {resumeData.work_experience.map((experience, index) => (
              <p className="new_para" key={index}>
                {experience}
              </p>
            ))}
          </div>
        )}

        {resumeData.education?.length > 0 && (
          <div className="content-container">
            <strong>Education:</strong>
            {resumeData.education.map((education, index) => (
              <p className="new_para" key={index}>
                {education}
              </p>
            ))}
          </div>
        )}

        {resumeData.certifications?.length > 0 && (
          <div className="content-container">
            <strong>Certifications:</strong>
            {resumeData.certifications.map((certification, index) => (
              <p className="new_para" key={index}>
                {certification}
              </p>
            ))}
          </div>
        )}

        {resumeData.projects?.length > 0 && (
          <div className="content-container">
            <strong>Projects:</strong>
            {resumeData.projects.map((project, index) => (
              <p className="new_para" key={index}>
                {project}
              </p>
            ))}
          </div>
        )}

        {resumeData.research_publications?.length > 0 && (
          <div className="content-container">
            <strong>Research Publications:</strong>
            {resumeData.research_publications.map((publication, index) => (
              <p className="new_para" key={index}>
                {publication}
              </p>
            ))}
          </div>
        )}

        {resumeData.awards?.length > 0 && (
          <div className="content-container">
            <strong>Awards:</strong>
            {resumeData.awards.map((award, index) => (
              <p className="new_para" key={index}>
                {award}
              </p>
            ))}
          </div>
        )}

        {resumeData.professional_membership?.length > 0 && (
          <div className="content-container">
            <strong>Professional Membership:</strong>
            {resumeData.professional_membership.map((membership, index) => (
              <p className="new_para" key={index}>
                {membership}
              </p>
            ))}
          </div>
        )}
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

export default ResumePreview1;

ResumePreview1.propTypes = {
  userEmail: PropTypes.string,
};
