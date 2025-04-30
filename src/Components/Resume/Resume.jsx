import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ResumeFormHandler from "./ResumeFormHandler";
import "./Resume.css";
import Navbar from "../Navbar/Navbar";

const Resume = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    formData,
    handleChange,
    handleArrayChange,
    handleAddArrayItem,
    handleRemoveArrayItem,
  } = ResumeFormHandler();

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const validIds = ["1", "2", "3", "4", "5", "6"];
    if (validIds.includes(id)) {
      navigate(`/resume_preview/${id}`, { state: { resume: formData } });
    } else {
      setError("Invalid resume ID");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="main-container">
        <div className="resume-container">
          <h1>Resume Template {id}</h1>
          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn"
              value={formData.linkedin}
              onChange={handleChange}
            />
            <textarea
              name="profile_summary"
              placeholder="Profile Summary"
              value={formData.profile_summary}
              onChange={handleChange}
            />
            <textarea
              name="key_skills"
              placeholder="Key Skills"
              value={formData.key_skills}
              onChange={handleChange}
            />

            {/* Work Experience */}
            <div>
              {formData.work_experience.length > 0 && <h3>Work Experience</h3>}{" "}
              {formData.work_experience.map((experience, index) => (
                <div key={index}>
                  <p>
                    <textarea
                      className="data-input"
                      name={`workExperience-${index}`}
                      value={experience}
                      onChange={(e) =>
                        handleArrayChange(e, index, "work_experience")
                      }
                      placeholder={`Work Experience ${index + 1}`}
                    />
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveArrayItem(index, "work_experience")
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayItem("work_experience")}
              >
                Add Work Experience
              </button>
            </div>

            {/* Education */}
            <div>
              {formData.education.length > 0 && <h3>Education</h3>}{" "}
              {formData.education.map((education, index) => (
                <div key={index}>
                  <p>
                    <textarea
                      className="data-input"
                      name={`Education-${index}`}
                      value={education}
                      onChange={(e) => handleArrayChange(e, index, "education")}
                      placeholder={`Education ${index + 1}`}
                    />
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(index, "education")}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayItem("education")}
              >
                Add Education
              </button>
            </div>

            {/* Certifications */}
            <div>
              {formData.certifications.length > 0 && <h3>Certifications</h3>}{" "}
              {formData.certifications.map((certification, index) => (
                <div key={index}>
                  <p>
                    <textarea
                      className="data-input"
                      name={`Certifications-${index}`}
                      value={certification}
                      onChange={(e) =>
                        handleArrayChange(e, index, "certifications")
                      }
                      placeholder={`Certifications ${index + 1}`}
                    />
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveArrayItem(index, "certifications")
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayItem("certifications")}
              >
                Add Certifications
              </button>
            </div>

            {/* Projects */}
            <div>
              {formData.projects.length > 0 && <h3>Projects</h3>}{" "}
              {formData.projects.map((project, index) => (
                <div key={index}>
                  <p>
                    <textarea
                      className="data-input"
                      name={`Projects-${index}`}
                      value={project}
                      onChange={(e) => handleArrayChange(e, index, "projects")}
                      placeholder={`Projects ${index + 1}`}
                    />
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(index, "projects")}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayItem("projects")}
              >
                Add Projects
              </button>
            </div>

            {/* Research Publications */}
            <div>
              {formData.research_publications.length > 0 && (
                <h3>Research Publications</h3>
              )}{" "}
              {formData.research_publications.map((publication, index) => (
                <div key={index}>
                  <p>
                    <textarea
                      className="data-input"
                      name={`Research Publications-${index}`}
                      value={publication}
                      onChange={(e) =>
                        handleArrayChange(e, index, "research_publications")
                      }
                      placeholder={`Research Publications ${index + 1}`}
                    />
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveArrayItem(index, "research_publications")
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayItem("research_publications")}
              >
                Add Research Publications
              </button>
            </div>

            {/* Awards */}
            <div>
              {formData.awards.length > 0 && <h3>Awards</h3>}{" "}
              {formData.awards.map((award, index) => (
                <div key={index}>
                  <p>
                    <textarea
                      className="data-input"
                      name={`Awards-${index}`}
                      value={award}
                      onChange={(e) => handleArrayChange(e, index, "awards")}
                      placeholder={`Awards ${index + 1}`}
                    />
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(index, "awards")}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayItem("awards")}
              >
                Add Awards
              </button>
            </div>

            {/* Professional Membership */}
            <div>
              {formData.professional_membership.length > 0 && (
                <h3>Professional Membership</h3>
              )}{" "}
              {formData.professional_membership.map((membership, index) => (
                <div key={index}>
                  <p>
                    <textarea
                      className="data-input"
                      name={`Professional Membership-${index}`}
                      value={membership}
                      onChange={(e) =>
                        handleArrayChange(e, index, "professional_membership")
                      }
                      placeholder={`Professional Membership ${index + 1}`}
                    />
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveArrayItem(index, "professional_membership")
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddArrayItem("professional_membership")}
              >
                Add Professional Membership
              </button>
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Resume;
