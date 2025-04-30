import React from "react";
import { useNavigate } from "react-router-dom";
import UploadResume from "./UploadResume";
import Navbar from "../Navbar/Navbar";
import "./UploadResume.css";

function Uploads() {
  const [refresh, setRefresh] = React.useState(false);
  const navigate = useNavigate();

  const handleUpload = () => {
    setRefresh(!refresh);
    navigate("/resumes");
  };

  return (
    <div>
      <Navbar />
      <div className="uploads-container">
        <h1 className="upload-heading">Resume Uploader</h1>
        <UploadResume onUpload={handleUpload} width />
      </div>
    </div>
  );
}

export default Uploads;
