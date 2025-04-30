import { Link } from "react-router-dom";
import "../Pages/Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-section">
          <h1>
            Welcome to the <strong>Resume Builder</strong>
          </h1>
          <p>
            Your personalized tool to create beautiful, professional resumes in
            minutes!
          </p>

          <div className="cta-buttons">
            <Link to="/login" className="cta-button login-button">
              Login
            </Link>
            <Link to="/signup" className="cta-button signup-button">
              Sign Up
            </Link>
          </div>

          <div className="bottom-link">
            <p>
              Already have an account? <Link to="/login">Log in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
