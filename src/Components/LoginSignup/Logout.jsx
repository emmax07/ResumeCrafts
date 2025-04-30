import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://resumecrafts-5e7e8b26d82f.herokuapp.com/api/logout"
      );
      alert(response.data.message);

      localStorage.removeItem("isLoggedIn");

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error logging out");
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
