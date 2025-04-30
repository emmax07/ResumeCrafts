import { useNavigate } from "react-router-dom";
import "./Cards.css";
import Navbar from "../Navbar/Navbar";
import resume_image1 from "../Assets/Resume1.png";
import resume_image2 from "../Assets/Resume2.png";
import resume_image3 from "../Assets/Resume3.png";
import resume_image4 from "../Assets/Resume4.png";
import resume_image5 from "../Assets/Resume5.png";
import resume_image6 from "../Assets/Resume6.png";

const cardData = [
  { id: 1, image: resume_image1 },
  { id: 2, image: resume_image2 },
  { id: 3, image: resume_image3 },
  { id: 4, image: resume_image4 },
  { id: 5, image: resume_image5 },
  { id: 6, image: resume_image6 },
];

const Card = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="card-container">
        {cardData.map((card) => (
          <div
            key={card.id}
            className="card"
            onClick={() => navigate(`/resume/${card.id}`)}
          >
            <img src={card.image} alt={`Resume ${card.id}`} />
            <h3>Resume {card.id}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
