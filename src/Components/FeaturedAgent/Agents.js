import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight, FaThumbsUp ,  FaHeart} from 'react-icons/fa';
import { AiFillLike } from "react-icons/ai";
import { AiOutlineLike } from "react-icons/ai";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Agents = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get('https://backend-1-sval.onrender.com/api/agents/top-likes-by-category');
        setAgents(response.data);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };
    fetchAgents();
  }, []);

  // Custom Previous and Next buttons with fixed style
  const PrevArrow = ({ onClick }) => (
    <button
      className="absolute z-10 left-[-25px] top-1/2 transform -translate-y-1/2 p-2 text-primaryBlue2 rounded-full bg-white shadow-md focus:outline-none"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <FaChevronLeft size={24} />
    </button>
  );

  const NextArrow = ({ onClick }) => (
    <button
      className="absolute z-10 right-[-25px] top-1/2 transform -translate-y-1/2 p-2 text-primaryBlue2 rounded-full bg-white shadow-md focus:outline-none"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <FaChevronRight size={24} />
    </button>
  );

  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Faster automatic sliding speed
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <section className="py-12 ">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-primaryBlue mb-6 text-center">
          Top Featured <span className="text-black">AI Products</span>
        </h2>
        <Slider {...settings}>
          {agents.map(agent => (
            <div key={agent._id} className="p-4">
              <Link to={`/agent/${agent._id}`} className="block">
                <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 w-96 transition-transform transform hover:scale-105 hover:shadow-xl">
                  <img
                    src={agent.logo}
                    alt={agent.name}
                    className="w-16 h-16 object-cover rounded-full border-2 border-gray-200"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-primaryBlue2">{agent.name}</h3>
                    <p className="text-sm text-gray-500 italic">{agent.category}</p> {/* Display category */}
                    <p className="text-sm text-gray-600 mt-1">{agent.description.slice(0, 50)}...</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <AiFillLike  className="text-primaryBlue2" />
                      <span className="text-sm font-semibold text-gray-700">{agent.likes} Likes</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export { Agents };
