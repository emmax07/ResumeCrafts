import { useState } from "react";

const ResumeFormHandler = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    professional_title: "",
    phone: "",
    email: "",
    address: "",
    linkedin: "",
    portfolio: "",
    profile_summary: "",
    key_skills: "",
    work_experience: [""],
    education: [""],
    certifications: [""],
    projects: [""],
    research_publications: [""],
    awards: [""],
    professional_membership: [""],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e, index, arrayName) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = e.target.value;
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const handleAddArrayItem = (arrayName) => {
    setFormData({ ...formData, [arrayName]: [...formData[arrayName], ""] });
  };

  const handleRemoveArrayItem = (index, arrayName) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return {
    formData,
    handleChange,
    handleArrayChange,
    handleAddArrayItem,
    handleRemoveArrayItem,
    handleSubmit,
  };
};

export default ResumeFormHandler;
