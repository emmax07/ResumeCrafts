import { useParams } from "react-router-dom";
import ResumePreview1 from "./ResumePreview1";
import ResumePreview2 from "./ResumePreview2";
import ResumePreview3 from "./ResumePreview3";
import ResumePreview4 from "./ResumePreview4";
import ResumePreview5 from "./ResumePreview5";
import ResumePreview6 from "./ResumePreview6";

const ResumePreview = () => {
  const { id } = useParams(); // Extract the dynamic 'id' from the URL

  // Conditionally render components based on the 'id'
  switch (id) {
    case "1":
      return <ResumePreview1 />;
    case "2":
      return <ResumePreview2 />;
    case "3":
      return <ResumePreview3 />;
    case "4":
      return <ResumePreview4 />;
    case "5":
      return <ResumePreview5 />;
    case "6":
      return <ResumePreview6 />;
    default:
      return <div>Invalid Resume Preview ID</div>;
  }
};

export default ResumePreview;
