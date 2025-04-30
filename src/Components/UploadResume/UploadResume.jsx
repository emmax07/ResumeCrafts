import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types"; // Import PropTypes

const UploadResume = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [userEmail, setUserEmail] = useState(""); // Changed from userId to userEmail

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !userEmail)
      return alert("Please select a file and enter a user email.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userEmail", userEmail); // Correctly use userEmail

    try {
      await axios.post("http://localhost:5000/api/resumes", formData);
      alert("Uploaded successfully!");
      onUpload(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-resume-form">
      <input
        type="email" // Use email input for validation
        placeholder="User Email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        required
        className="email-input"
      />
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        required
        className="file-input"
      />
      <button type="submit" className="upload-btn">
        Upload Resume
      </button>
    </form>
  );
};

// Add PropTypes validation for `onUpload` prop
UploadResume.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default UploadResume;
