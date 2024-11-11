import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaThumbsUp, FaHeart, FaRegHeart, FaArrowRight,FaRegBookmark } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css'; // Import custom styles

const AGENTS_PER_PAGE = 20;
const SLIDES_TO_SHOW = 3;

export const AgentList = ({ filters }) => {
  const [agents, setAgents] = useState([]);
  const [topAgents, setTopAgents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [likeCounts, setLikeCounts] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [saveCounts, setSaveCounts] = useState({});
const agentListRef = useRef(null);
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get('https://backend-xa3g.onrender.com/api/agents/all');
        const sortedAgents = response.data.sort((a, b) => b.likes - a.likes); // Sort by likes
        setAgents(response.data || []);
        setTopAgents(sortedAgents.slice(0, 10)); // Get top 10 agents based on likes

        const initialLikes = {};
        const initialSaves = {};
        response.data.forEach(agent => {
          initialLikes[agent._id] = agent.likes || 0;
          initialSaves[agent._id] = agent.savedByCount || 0;
        });
        setLikeCounts(initialLikes);
        setSaveCounts(initialSaves);

      } catch (error) {
        console.error('Error fetching agents:', error);
        toast.error('Error fetching agents!');
      }
    };
    fetchAgents();
  }, []);

  const handleLike = async (event, agentId) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('You need to log in to like agents!');
        return;
      }
      const url = `https://backend-xa3g.onrender.com/api/users/like/${agentId}`;
      const method = 'post';

      const response = await axios({
        method,
        url,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });
      

      if (response.status === 200) {
        toast.success('Agent liked successfully!');
        setLikeCounts((prevLikeCounts) => ({
          ...prevLikeCounts,
          [agentId]: response.data.agent.likes
        }));
      }
      if (response.status === 201) {
        toast.success('Like removed successfully!');
        setLikeCounts((prevLikeCounts) => ({
          ...prevLikeCounts,
          [agentId]: response.data.agent.likes
        }));
      }

    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message === 'You have already liked this agent') {
        toast.info('You have already liked this agent!');
      } else {
        toast.error('An error occurred while liking the agent.');
      }
      console.error('Error liking agent:', error);
    }
  };

  const handleWishlist = async (event, agentId) => {
    event.preventDefault();
    event.stopPropagation();
  
    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('You need to log in to save agents!');
        return;
      }

    
      const url = `https://backend-xa3g.onrender.com/api/users/wishlist/${agentId}`;
      const method = 'post';

      const response = await axios({
        method,
        url,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success(`Agent Added to  wishlist!`);
        setSaveCounts((prevSaveCounts) => ({
          ...prevSaveCounts,
          [agentId]: response.data.agent.savedByCount,
        }));
      }
      if (response.status === 201) {
        toast.success(`Agent Removed from  wishlist!`);
       
        setSaveCounts((prevSaveCounts) => ({
          ...prevSaveCounts,
          [agentId]: response.data.agent.savedByCount,
        }));
      }
    } catch (error) {
      toast.error('An error occurred while updating the wishlist.');
      console.error('Error updating wishlist:', error);
    }
  };

  const filteredAgents = agents.filter((agent) => {
    
    return (
      (filters.category === 'Category' || agent.category === filters.category) &&
      (filters.industry === 'Industry' || agent.industry === filters.industry) &&
      (filters.pricingModel === 'Pricing' || agent.price === filters.pricingModel) &&
      (filters.accessModel === 'Access' || agent.accessModel === filters.accessModel)
    );
  });

  const totalPages = Math.ceil(filteredAgents.length / AGENTS_PER_PAGE);

  const getCurrentPageAgents = () => {
    const start = (currentPage - 1) * AGENTS_PER_PAGE;
    const end = start + AGENTS_PER_PAGE;
    return filteredAgents.slice(start, end);
  };

  

  const scrollToTop = () => {
    if (agentListRef.current) {
      agentListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      scrollToTop();
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      scrollToTop();
    }
  };

  return (
    <div className="mt-9 mx-auto  max-h-screen overflow-y-auto "  >
 

      {/* Top Agents Carousel */}
    

      {/* Main Agents Section */}
      <motion.div
        className="flex justify-between  items-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-primaryBlue" ref={agentListRef}></h2>
        
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2, duration: 0.6 }}
      >
        {getCurrentPageAgents().length > 0 ? (
          getCurrentPageAgents().map((agent) => (
            <motion.div
              key={agent._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <Link to={`/agent/${agent._id}`}>
                <div className="p-4 rounded-lg flex items-start group transition-all duration-300 agent-card">
                  <div className="flex-shrink-0">
                    <img
                      src={agent.logo || 'https://via.placeholder.com/50'}
                      alt={agent.name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  </div>

                  <div className="ml-4 flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-primaryBlue group-hover:text-blue-900 transition-colors duration-300">
                        {agent.name}
                      </h3>
                      <span className="text-sm text-gray-500">{agent.price}</span>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">{agent.shortDescription || 'No description available.'}</p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {agent.tags && agent.tags.length > 0 ? (
                        agent.tags.map((tag, index) => (
                          <span key={index} className="bg-white text-blue-900 text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No tags available</span>
                      )}
                    </div>

                    <div className="flex items-center mt-4">
                      <button
                        className="flex items-center text-primaryBlue hover:text-blue-900 transition-all"
                        onClick={(event) => handleLike(event, agent._id)}
                      >
                        <FaThumbsUp className="mr-2" /> {likeCounts[agent._id] || 0}
                      </button>
                      <button
                        className="flex items-center text-primaryBlue hover:text-blue-900 transition-all ml-4"
                        onClick={(event) => handleWishlist(event, agent._id)}
                      >
                         <FaRegBookmark className="mr-2" />  {saveCounts[agent._id] || 0} 
                       
                      </button>
                      
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-600"
          >
            No agents found.
          </motion.p>
        )}
      </motion.div>

      <motion.div
        className="flex justify-center items-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`p-2 border rounded-full ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''} text-primaryBlue border-primaryBlue`}
        >
          &lt;
        </button>

        <div className="flex space-x-2 mx-4">
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page + 1}
              onClick={() => handlePageChange(page + 1)}
              className={`p-2 rounded-full border ${currentPage === page + 1 ? 'bg-primaryBlue text-white' : 'text-primaryBlue border-primaryBlue'}`}
            >
              {page + 1}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`p-2 border rounded-full ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''} text-primaryBlue border-primaryBlue`}
        >
          &gt;
        </button>
      </motion.div>
    </div>
  );
};
