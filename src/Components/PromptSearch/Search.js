// File: Frontend/src/Body/PromptSearch/Search.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaAnglesRight } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import AgentCard from './AgentCard'; // Ensure correct path
import 'react-toastify/dist/ReactToastify.css';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const { isAuthenticated } = useContext(AuthContext);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMoreCount, setShowMoreCount] = useState(10);
  const [useCases, setUseCases] = useState([]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const token = Cookies.get('token');

  // State for Like and Save counts and statuses
  const [likeCounts, setLikeCounts] = useState({});
  const [saveCounts, setSaveCounts] = useState({});
  const [likedAgents, setLikedAgents] = useState({});
  const [savedAgents, setSavedAgents] = useState({});

  // Placeholder use cases to cycle through
  const placeholderUseCases = [
    'I want a coding AI agent which helps me in website building',
    'Find me an AI assistant for customer support',
    'Looking for an AI tool to automate data entry',
    'Need a predictive analytics solution for sales',
    'Suggest an AI chatbot for e-commerce',
  ];

  useEffect(() => {
    const fetchUseCases = async () => {
      try {
        const response = await axios.get('https://backend-1-sval.onrender.com/api/usecase', {
          withCredentials: true,
        });
        setUseCases(response.data);
      } catch (error) {
        console.error('Error fetching use cases:', error);
        // toast.error('Failed to fetch use cases. Please try again.');
      }
    };
    fetchUseCases();
  }, []);

  // Cycle through placeholder use cases
  useEffect(() => {
    const placeholderInterval = setInterval(() => {
      setPlaceholderIndex((prevIndex) =>
        prevIndex === placeholderUseCases.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change placeholder every 4 seconds

    return () => clearInterval(placeholderInterval);
  }, []);

  const handleSearch = async (searchQuery) => {
    const finalQuery = searchQuery || query;

    if (!isAuthenticated) {
      toast.error('Please log in to perform searches.');
      return;
    }

    if (!finalQuery.trim()) {
      toast.error('Please enter a search query.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('https://backend-1-sval.onrender.com/api/agents/search', {
        params: { query: finalQuery },
        withCredentials: true,
      });
      setResults(response.data);

      // Initialize like and save counts and statuses
      const initialLikes = {};
      const initialSaves = {};
      const initialLiked = {};
      const initialSaved = {};

      response.data.forEach((agent) => {
        initialLikes[agent._id] = agent.likes || 0;
        initialSaves[agent._id] = agent.savedByCount || 0;
        initialLiked[agent._id] = agent.isLiked || false; // Assuming agent has isLiked
        initialSaved[agent._id] = agent.isSaved || false; // Assuming agent has isSaved
      });

      setLikeCounts(initialLikes);
      setSaveCounts(initialSaves);
      setLikedAgents(initialLiked);
      setSavedAgents(initialSaved);

      // Save the search query to the backend
      await saveSearchQuery(finalQuery);
    } catch (error) {
      console.error('Error fetching search results:', error);
      toast.error('Failed to fetch search results. Please try again.');
    }
    setLoading(false);
  };

  const saveSearchQuery = async (searchQuery) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to save search queries.');
      return;
    }

    try {
      await axios.post(
        'https://backend-1-sval.onrender.com/api/users/save-search',
        { query: searchQuery },
        {
          withCredentials: true,
          
        }
      );
      
    } catch (error) {
      console.error('Error saving search query:', error);
      toast.error('Failed to save search query. Please try again.');
    }
  };

  const handleUseCaseClick = (useCase) => {
    setQuery(useCase);
    handleSearch(useCase);
  };

  const handleShowMore = () => {
    setShowMoreCount(showMoreCount + 10);
  };

  // Handle Like Functionality
  const handleLike = async (event, agentId) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      
     
      const url = `https://backend-1-sval.onrender.com/api/users/like/${agentId}`;
      const method = 'post';

      const response = await axios({
        method,
        url,
        
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success('Agent liked successfully!');
        setLikeCounts((prevLikeCounts) => ({
          ...prevLikeCounts,
          [agentId]: response.data.agent.likes,
        }));
        setLikedAgents((prevLiked) => ({
          ...prevLiked,
          [agentId]: true,
        }));
      }
      if (response.status === 201) {
        toast.success('Like removed successfully!');
        setLikeCounts((prevLikeCounts) => ({
          ...prevLikeCounts,
          [agentId]: response.data.agent.likes,
        }));
        setLikedAgents((prevLiked) => ({
          ...prevLiked,
          [agentId]: false,
        }));
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === 'You have already liked this agent'
      ) {
        toast.info('You have already liked this agent!');
      } else {
        toast.error('An error occurred while liking the agent.');
      }
      console.error('Error liking agent:', error);
    }
  };

  // Handle Save (Wishlist) Functionality
  const handleWishlist = async (event, agentId) => {
    event.preventDefault();
    event.stopPropagation();

    try {
     
      

      const url = `https://backend-1-sval.onrender.com/api/users/wishlist/${agentId}`;
      const method = 'post';

      const response = await axios({
        method,
        url,
       
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success('Agent added to wishlist!');
        setSaveCounts((prevSaveCounts) => ({
          ...prevSaveCounts,
          [agentId]: response.data.agent.savedByCount,
        }));
        setSavedAgents((prevSaved) => ({
          ...prevSaved,
          [agentId]: true,
        }));
      }
      if (response.status === 201) {
        toast.success('Agent removed from wishlist!');
        setSaveCounts((prevSaveCounts) => ({
          ...prevSaveCounts,
          [agentId]: response.data.agent.savedByCount,
        }));
        setSavedAgents((prevSaved) => ({
          ...prevSaved,
          [agentId]: false,
        }));
      }
    } catch (error) {
      toast.error('An error occurred while updating the wishlist.');
      console.error('Error updating wishlist:', error);
    }
  };

  // Motion Variants for Animation
  const resultsVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  // Placeholder Variants
  const placeholderVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="w-full py-20">
      {/* Main container with max width and rounded corners */}
      <div
        className="max-w-7xl mx-auto rounded-3xl p-8 bg-gray-200"
      >
        <h1 className="text-xl font-semibold mb-8" style={{ fontFamily: 'system-ui' }}>
          ✨ Get solution recommendations for your use case, generated by AI
        </h1>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="relative flex w-full bg-white shadow-lg rounded-3xl p-2 py-12 md:py-6 border border-gray-300 transition duration-500 hover:shadow-2xl focus-within:ring-2 focus-within:ring-blue-200"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder=""
            className="flex-grow p-3 rounded-l-full focus:outline-none text-lg"
          />
          {/* Animated Placeholder Text */}
          {!query && (
            <div className="absolute left-8 top-7 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={placeholderIndex}
                  className="text-xl text-gray-700"
                  variants={placeholderVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 1 }}
                >
                  {placeholderUseCases[placeholderIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
          <button
            type="submit"
            className="bg-primaryBlue3 absolute bottom-2 right-2 text-white rounded-full md:px-6 md:py-3 px-3 py-3 hover:scale-95 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Recommendations'}
          </button>
        </form>

        {/* Popular Use Cases */}
        <div className="w-full max-w-4xl mt-8 pl-8">
          <h2 className="text-lg mb-4">Try popular use cases:</h2>
          <div className="flex flex-wrap gap-4">
            {useCases.length > 0 ? (
              useCases.map((useCase) => (
                <button
                  key={useCase._id}
                  onClick={() => handleUseCaseClick(useCase.name)}
                  className="bg-white text-primaryBlue2 px-5 py-2 rounded-full border border-gray-200 shadow hover:shadow-lg hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                >
                  {useCase.name}
                </button>
              ))
            ) : (
              <p>No use cases found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && <div className="text-center mt-4">Loading...</div>}

      {/* Search Results */}
      {results.length > 0 && (
        <motion.div
          className="max-w-7xl mx-auto mt-8 px-8"
          initial="hidden"
          animate="visible"
          variants={resultsVariants}
        >
          <h2 className="text-2xl font-bold mb-6">Search Results for "{query}":</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.slice(0, showMoreCount).map((agent) => (
              <AgentCard
                key={agent._id}
                agent={{
                  ...agent,
                  isLiked: likedAgents[agent._id],
                  isSaved: savedAgents[agent._id],
                }}
                likeCounts={likeCounts}
                saveCounts={saveCounts}
                handleLike={handleLike}
                handleWishlist={handleWishlist}
              />
            ))}
          </div>

          {/* Show More Button */}
          {results.length > showMoreCount && (
            <div className="flex justify-center w-full mt-6">
              <button
                onClick={handleShowMore}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-full hover:scale-105 transform transition duration-300"
              >
                Show More Agents
              </button>
            </div>
          )}
        </motion.div>
      )}

     
    </div>
  );
};

export default SearchComponent;
