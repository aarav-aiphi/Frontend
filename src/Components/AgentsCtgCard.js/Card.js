// Card.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { FaRegBookmark, FaTags } from 'react-icons/fa';
import { AiOutlineLink } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import bgimg3 from '../../Images/bg3.jpg';
import 'react-toastify/dist/ReactToastify.css';

export const Card = ({ propmodel, propprice, propcategory, propindustry }) => {
  const [agents, setAgents] = useState([]);
  const [saveCounts, setSaveCounts] = useState({});

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get('https://backend-xa3g.onrender.com/api/agents/all');
        const initialSaves = {};
        response.data.forEach(agent => {
          initialSaves[agent._id] = agent.savedByCount || 0;
        });
        setSaveCounts(initialSaves);
        setAgents(response.data || []);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };
    fetchAgents();
  }, []);

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

      const message = response.status === 200 ? 'Agent added to wishlist!' : 'Agent removed from wishlist!';
      toast.success(message);

      setSaveCounts((prevSaveCounts) => ({
        ...prevSaveCounts,
        [agentId]: response.data.agent.savedByCount,
      }));
    } catch (error) {
      toast.error('An error occurred while updating the wishlist.');
      console.error('Error updating wishlist:', error);
    }
  };

  const filteredAgents = agents.filter(agent =>
    ((propmodel === '' || propmodel === 'Model') || agent.accessModel === propmodel) &&
    ((propprice === '' || propprice === 'Pricing') || agent.pricingModel === propprice) &&
    ((propcategory === '' || propcategory === 'Category') || agent.category === propcategory) &&
    ((propindustry === '' || propindustry === 'Industry') || agent.industry === propindustry)
  );

  const categorizedAgents = filteredAgents.reduce((categories, agent) => {
    const category = agent.category || 'Uncategorized';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(agent);
    return categories;
  }, {});

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: { type: 'spring', stiffness: 300 }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <div className="relative w-full overflow-hidden"
    
    >
      {/* Background Decorative Elements */}
    
    

      {/* Agent Cards */}
      <motion.div className="max-w-6xl w-full mx-auto p-6 relative z-10" initial="hidden" animate="visible" variants={containerVariants}>
        {Object.keys(categorizedAgents).map((category, categoryIndex) => (
          <motion.div key={categoryIndex} className="mb-12">
            {/* Category Header */}
            <motion.div
              className="mb-4 flex items-center space-x-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-primaryBlue2">
                Explore {category}
              </h1>
              <motion.div className="bg-gradient-to-r from-indigo-500 to-blue-400 h-1 w-20 animate-pulse"></motion.div>
            </motion.div>

            {/* Category Description */}
            <motion.p
              className="text-gray-500 text-lg italic mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Discover top agents in the {category} space, crafted for your needs.
            </motion.p>

            <hr className="border-t bg-gray-300 my-4" />

            {/* Agent Grid */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {categorizedAgents[category].slice(0, 6).map(agent => (
                <Link to={`agent/${agent._id}`} key={agent._id}>
                  <motion.div
                    className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out relative"
                    whileHover="hover"
                    whileTap="tap"
                    variants={itemVariants}
                  >
                    {/* Agent Header */}
                    <div className="flex items-center space-x-4">
                      <motion.img
                        src={agent.logo || 'https://www.svgrepo.com/show/499962/music.svg'}
                        className="h-14 w-14 rounded-full object-cover border border-primaryBlue"
                        alt={agent.name}
                        initial={{ rotate: 0 }}
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <div>
                        <h2 className="font-bold text-lg text-primaryBlue hover:text-gray-500 transition-colors duration-200">
                          {agent.name}
                        </h2>
                        <p className="text-sm text-gray-400 flex items-center space-x-1">
                          <AiOutlineLink /> <span>{agent.pricingModel}</span>
                        </p>
                      </div>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      className="absolute top-6 right-6 flex items-center text-primaryBlue hover:text-blue-900 transition-all"
                      onClick={(event) => handleWishlist(event, agent._id)}
                    >
                      <FaRegBookmark className="mr-2" /> {saveCounts[agent._id] || 0}
                    </button>

                    {/* Agent Description */}
                    <p className="mt-4 text-gray-600">
                      {agent.shortDescription || 'No description provided.'}
                    </p>

                    {/* Agent Tags */}
                    <motion.div className="flex flex-wrap gap-2 mt-4">
                      {agent.tags && agent.tags.map((tag, idx) => (
                        <motion.span
                          key={idx}
                          style={
                            {color:'rgb(64 103 156)'}
                          }
                          className="bg-blue-50 text-xs px-3 py-1 rounded-full shadow flex items-center space-x-2"
                          whileHover={{ scale: 1.1 }}
                        >
                          <FaTags /> <span>{tag}</span>
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>

            {/* More Button */}
            <div className="flex justify-end mt-4">
              <Link to="/allagent">
                <motion.button
                  className="flex items-center px-4 py-2 text-sm text-gray-500 border border-gray-300 rounded-full hover:bg-gray-100 hover:text-indigo-500 focus:outline-none transition-all duration-200 space-x-1 shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>More</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Card;
