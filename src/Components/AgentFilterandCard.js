// src/components/AgentFilterAndCard.js

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaCheckCircle, 
  FaTimes, 
  FaRegBookmark,
  FaFilter,
  FaSpinner,
  FaHeart,
  FaRegHeart,
  FaSort // Add this import
} from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineLike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { FaThumbsUp } from "react-icons/fa";
import { fetchAgents, updateSavedByCount, updateLikeCount } from '../redux/agentsSlice'; // Import the synchronous actions
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; // Ensure axios is imported

// Import AOS and its styles
import AOS from 'aos';
import 'aos/dist/aos.css';

// Define default filter values
const DEFAULT_FILTERS = {
  accessModel: "Model",
  pricingModel: "Pricing",
  category: "Category",
  industry: "Industry",
};

// Spinner Component
const Spinner = () => (
  <div className="flex justify-center items-center p-4">
    <FaSpinner className="animate-spin text-4xl text-primaryBlue" aria-label="Loading" />
  </div>
);

// AgentCard Component
import { motion } from 'framer-motion';

const AgentCard = ({ agent, saveCounts, likeCounts, handleWishlist, handleLike }) => {
  // Destructure properties with default values
  const { _id, name, logo, shortDescription, category, pricingModel } = agent || {};

  // Safeguard against undefined saveCounts or agent ID
  const saveCount = (saveCounts && _id && saveCounts[_id]) ? saveCounts[_id] : 0;
  const likeCount = (likeCounts && _id && likeCounts[_id]) ? likeCounts[_id] : 0;

  return (
    <Link to={`agent/${_id}`}>
      <motion.div
        className="relative bg-white rounded-lg shadow-md p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300 overflow-hidden w-full sm:w-80 h-72 flex flex-col"
        whileHover={{ translateY: -5 }}
        data-aos="fade-up" // AOS attribute
      >
        {/* Accent Border at the Top */}
        <div className="absolute inset-0 border-t-4 border-blue-500 rounded-lg"></div>

        {/* Side Ribbon */}
        <div className="absolute top-0 left-0 bg-blue-500 text-white px-2 py-1 text-xs font-bold rounded-tr-lg rounded-br-lg">
          {category}
        </div>

        {/* Like and Save Icons at Top Right */}
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          {/* Like Button */}
          <button
            className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200"
            onClick={(event) => handleLike(event, _id)}
            aria-label={likeCount > 0 ? "Unlike Agent" : "Like Agent"}
          >
            <FaThumbsUp  className="mr-1" /> {likeCount}
          </button>

          {/* Save Button */}
          <button
            className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200"
            onClick={(event) => handleWishlist(event, _id)}
            aria-label="Save Agent"
          >
            <FaRegBookmark className="mr-1" /> {saveCount}
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center flex-grow">
          {/* Agent Logo */}
          {logo && (
            <img
              src={logo}
              alt={`${name} Logo`}
              className="h-20 w-20 sm:h-24 sm:w-24 mb-4 object-contain"
            />
          )}

          {/* Agent Name with Pricing */}
          <div className="flex items-center justify-center text-center">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-4">
              {name}
            </h3>
            {pricingModel && (
              <span className="ml-2 text-gray-500 text-sm sm:text-base">
                {pricingModel}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 text-center flex-grow">
            {shortDescription || 'No description provided.'}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

const AgentFilterAndCard = () => {
  // State for sticky filter and its visibility
  const [isSticky, setIsSticky] = useState(false);
  const [showFilter, setShowFilter] = useState(true); // State for filter visibility
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false); // State for filter panel on small screens
  const filterRef = useRef(null);
  const placeholderRef = useRef(null);

  // State for filter options
  const [filterOptions, setFilterOptions] = useState({
    accessModels: [],
    pricingModels: [],
    categories: [],
    industries: [],
  });

  // State to manage which dropdown is open
  const [openDropdown, setOpenDropdown] = useState({
    accessModel: false,
    pricingModel: false,
    category: false,
    industry: false,
    sortBy: false, // Add this line
  });

  // Selected filter values
  const [selected, setSelected] = useState({ ...DEFAULT_FILTERS });

  // Sort Option
  const [sortOption, setSortOption] = useState('Default');

  // Access Redux state
  const dispatch = useDispatch();
  const agentsState = useSelector((state) => state.agents);
 
  const { agents: fetchedAgents, likeCounts, saveCounts, status, error } = agentsState;

  // Animation variants for filter elements
  const filterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.02, transition: { type: "spring", stiffness: 300 } },
  };

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800, // Animation duration in ms
      easing: 'ease-in-out', // Easing option
      once: true, // Whether animation should happen only once
    });
  }, []);

  // Fetch filter options and agents from backend via Redux
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch filter options
        const filtersResponse = await axios.get('https://backend-1-sval.onrender.com/api/agents/filters');
       
        setFilterOptions({
          accessModels: filtersResponse.data.accessModels || [],
          pricingModels: filtersResponse.data.pricingModels || [],
          categories: filtersResponse.data.categories || [],
          industries: filtersResponse.data.industries || [],
        });
      } catch (err) {
        console.error('Error fetching filter options:', err);
    
      }
    };

    fetchFilterOptions();

    // Dispatch fetchAgents only if agents are not already fetched
    if (status === 'idle') {
      dispatch(fetchAgents());
    }
  }, [dispatch, status]);

  // Sticky filter functionality
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (filterRef.current && placeholderRef.current) {
            const filterTop = placeholderRef.current.getBoundingClientRect().top;
            // Adjust the offset as needed (e.g., 70px)
            if (filterTop <= 70) {
              if (!isSticky) {
                setIsSticky(true);
                placeholderRef.current.style.height = `${filterRef.current.offsetHeight}px`;
              }
            } else {
              if (isSticky) {
                setIsSticky(false);
                placeholderRef.current.style.height = '0px';
              }
            }
          }

          // Scroll Detection for Bottom
          const scrollTop = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;

          // If the user has scrolled to within 300px of the bottom
          if (scrollTop + windowHeight >= documentHeight - 300) {
            if (showFilter) setShowFilter(false);
          } else {
            if (!showFilter) setShowFilter(true);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSticky, showFilter]);

  // Handle selection of an option
  const handleSelect = (filterType, value) => {
    setSelected(prev => ({
      ...prev,
      [filterType]: value
    }));
    setOpenDropdown(prev => ({
      ...prev,
      [filterType]: false
    }));
  };

  // Handle sort option selection
  const handleSortSelect = (value) => {
    setSortOption(value);
    setOpenDropdown(prev => ({
      ...prev,
      sortBy: false,
    }));
  };

  // Reset individual filter to default
  const resetFilter = (filterType) => {
    setSelected(prev => ({
      ...prev,
      [filterType]: DEFAULT_FILTERS[filterType]
    }));
  };

  // Toggle dropdown visibility
  const toggleDropdown = (filterType) => {
    setOpenDropdown(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenDropdown({
          accessModel: false,
          pricingModel: false,
          category: false,
          industry: false,
          sortBy: false, // Include sortBy here
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle wishlist functionality
  const handleWishlist = async (event, agentId) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      // Make the API call directly here
      const response = await axios.post(`https://backend-1-sval.onrender.com/api/users/wishlist/${agentId}`, {}, {
        withCredentials: true, // Include credentials if required by your backend
      });

      const { savedByCount } = response.data.agent;

      // Dispatch the synchronous action to update the Redux state
      dispatch(updateSavedByCount({ agentId, savedByCount }));

      // Provide feedback to the user
      toast.success('Wishlist updated successfully!');
    } catch (error) {
      // Handle errors appropriately
      const errorMessage = error.response?.data?.message || 'Failed to update wishlist.';
      toast.error(errorMessage);
      console.error('Error updating wishlist:', error);
    }
  };

  // Handle like functionality
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
        dispatch(updateLikeCount({ agentId, likeCount: response.data.agent.likes }));
      }
      if (response.status === 201) {
        toast.success('Like removed successfully!');
        dispatch(updateLikeCount({ agentId, likeCount: response.data.agent.likes }));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update likes.';
      toast.error(errorMessage);
      console.error('Error updating wishlist:', error);
     
    }
  };

  // Filter agents based on selected filters
  const filteredAgents = fetchedAgents.filter(agent =>
    ((selected.accessModel === 'Model') || agent.accessModel === selected.accessModel) &&
    ((selected.pricingModel === 'Pricing') || agent.pricingModel === selected.pricingModel) &&
    ((selected.category === 'Category') || agent.category === selected.category) &&
    ((selected.industry === 'Industry') || agent.industry === selected.industry)
  );

  // Sort agents based on sortOption
  let sortedAgents = [...filteredAgents];
  if (sortOption === 'Popularity') {
    sortedAgents.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
  }

  // Use sortedAgents instead of filteredAgents
  const categorizedAgents = sortedAgents.reduce((categories, agent) => {
    const category = agent.category || 'Uncategorized';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(agent);
    return categories;
  }, {});

  // Animation variants for agent cards
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

  // Render Loading State
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center p-4">
        <Spinner />
      </div>
    );
  }

  // Render Error State
  if (status === 'failed') {
    return (
      <div className="flex justify-center items-center p-4">
        <p className="text-red-500">Failed to load agents.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Placeholder to maintain layout when fixed */}
      <div ref={placeholderRef}></div>

      {/* Filter Bar for Medium and Larger Screens */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            ref={filterRef}
            className={`w-full z-40 hidden md:block ${
              isSticky
                ? "fixed top-[70px] left-0 right-0 shadow-lg bg-white"
                : "relative bg-white"
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            data-aos="fade-down" // AOS attribute
          >
            <div className="max-w-6xl mx-auto px-4 py-3">
              <motion.div
                className="w-full"
                variants={filterVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                  {/* Category Dropdown */}
                  <div className="relative w-full md:w-1/4" data-aos="fade-left">
                    <button
                      onClick={() => toggleDropdown('category')}
                      className="w-full text-gray-700 text-base border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:bg-indigo-50 transition-colors duration-200 flex items-center justify-between relative"
                      aria-haspopup="true"
                      aria-expanded={openDropdown.category}
                    >
                      <span>{selected.category}</span>
                      <div className="flex items-center space-x-1">
                        {openDropdown.category ? <FaChevronUp /> : <FaChevronDown />}
                        {selected.category !== DEFAULT_FILTERS.category && (
                          <FaTimes
                            className="text-gray-500 hover:text-indigo-500 cursor-pointer ml-2"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering dropdown toggle
                              resetFilter('category');
                            }}
                            aria-label="Clear Category Filter"
                          />
                        )}
                      </div>
                    </button>
                    {openDropdown.category && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
                      >
                        {filterOptions.categories.length === 0 ? (
                          <li className="px-4 py-3 text-gray-500">No Categories Available</li>
                        ) : (
                          filterOptions.categories.map((cat) => (
                            <li
                              key={cat}
                              onClick={() => handleSelect('category', cat)}
                              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-indigo-100 ${
                                selected.category === cat ? 'bg-indigo-100' : ''
                              }`}
                            >
                              <FaCheckCircle className="text-indigo-500 mr-2" />
                              <span>{cat}</span>
                            </li>
                          ))
                        )}
                      </motion.ul>
                    )}
                  </div>

                  {/* Industry Dropdown */}
                  <div className="relative w-full md:w-1/4" data-aos="fade-right">
                    <button
                      onClick={() => toggleDropdown('industry')}
                      className="w-full text-gray-700 text-base border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:bg-indigo-50 transition-colors duration-200 flex items-center justify-between relative"
                      aria-haspopup="true"
                      aria-expanded={openDropdown.industry}
                    >
                      <span>{selected.industry}</span>
                      <div className="flex items-center space-x-1">
                        {openDropdown.industry ? <FaChevronUp /> : <FaChevronDown />}
                        {selected.industry !== DEFAULT_FILTERS.industry && (
                          <FaTimes
                            className="text-gray-500 hover:text-indigo-500 cursor-pointer ml-2"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering dropdown toggle
                              resetFilter('industry');
                            }}
                            aria-label="Clear Industry Filter"
                          />
                        )}
                      </div>
                    </button>
                    {openDropdown.industry && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
                      >
                        {filterOptions.industries.length === 0 ? (
                          <li className="px-4 py-3 text-gray-500">No Industries Available</li>
                        ) : (
                          filterOptions.industries.map((ind) => (
                            <li
                              key={ind}
                              onClick={() => handleSelect('industry', ind)}
                              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-indigo-100 ${
                                selected.industry === ind ? 'bg-indigo-100' : ''
                              }`}
                            >
                              <FaCheckCircle className="text-indigo-500 mr-2" />
                              <span>{ind}</span>
                            </li>
                          ))
                        )}
                      </motion.ul>
                    )}
                  </div>

                  {/* Access Model Dropdown */}
                  <div className="relative w-full md:w-1/4" data-aos="fade-right">
                    <button
                      onClick={() => toggleDropdown('accessModel')}
                      className="w-full text-gray-700 text-base border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:bg-indigo-50 transition-colors duration-200 flex items-center justify-between relative"
                      aria-haspopup="true"
                      aria-expanded={openDropdown.accessModel}
                    >
                      <span>{selected.accessModel}</span>
                      <div className="flex items-center space-x-1">
                        {openDropdown.accessModel ? <FaChevronUp /> : <FaChevronDown />}
                        {selected.accessModel !== DEFAULT_FILTERS.accessModel && (
                          <FaTimes
                            className="text-gray-500 hover:text-indigo-500 cursor-pointer ml-2"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering dropdown toggle
                              resetFilter('accessModel');
                            }}
                            aria-label="Clear Access Model Filter"
                          />
                        )}
                      </div>
                    </button>
                    {openDropdown.accessModel && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
                      >
                        {filterOptions.accessModels.length === 0 ? (
                          <li className="px-4 py-3 text-gray-500">No Access Models Available</li>
                        ) : (
                          filterOptions.accessModels.map((model) => (
                            <li
                              key={model}
                              onClick={() => handleSelect('accessModel', model)}
                              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-indigo-100 ${
                                selected.accessModel === model ? 'bg-indigo-100' : ''
                              }`}
                            >
                              <FaCheckCircle className="text-indigo-500 mr-2" />
                              <span>{model}</span>
                            </li>
                          ))
                        )}
                      </motion.ul>
                    )}
                  </div>

                  {/* Pricing Dropdown */}
                  <div className="relative w-full md:w-1/4" data-aos="fade-up">
                    <button
                      onClick={() => toggleDropdown('pricingModel')}
                      className="w-full text-gray-700 text-base border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:bg-indigo-50 transition-colors duration-200 flex items-center justify-between relative"
                      aria-haspopup="true"
                      aria-expanded={openDropdown.pricingModel}
                    >
                      <span>{selected.pricingModel}</span>
                      <div className="flex items-center space-x-1">
                        {openDropdown.pricingModel ? <FaChevronUp /> : <FaChevronDown />}
                        {selected.pricingModel !== DEFAULT_FILTERS.pricingModel && (
                          <FaTimes
                            className="text-gray-500 hover:text-indigo-500 cursor-pointer ml-2"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering dropdown toggle
                              resetFilter('pricingModel');
                            }}
                            aria-label="Clear Pricing Model Filter"
                          />
                        )}
                      </div>
                    </button>
                    {openDropdown.pricingModel && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
                      >
                        {filterOptions.pricingModels.length === 0 ? (
                          <li className="px-4 py-3 text-gray-500">No Pricing Models Available</li>
                        ) : (
                          filterOptions.pricingModels.map((price) => (
                            <li
                              key={price}
                              onClick={() => handleSelect('pricingModel', price)}
                              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-indigo-100 ${
                                selected.pricingModel === price ? 'bg-indigo-100' : ''
                              }`}
                            >
                              <FaCheckCircle className="text-indigo-500 mr-2" />
                              <span>{price}</span>
                            </li>
                          ))
                        )}
                      </motion.ul>
                    )}
                  </div>

                  {/* Sort By Dropdown */}
                  <div className="relative w-full md:w-1/4" data-aos="fade-up">
                    <button
                      onClick={() => toggleDropdown('sortBy')}
                      className="w-full text-gray-700 text-base border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:bg-indigo-50 transition-colors duration-200 flex items-center justify-between relative"
                      aria-haspopup="true"
                      aria-expanded={openDropdown.sortBy}
                    >
                      <span>{sortOption}</span>
                      <div className="flex items-center space-x-1">
                        {openDropdown.sortBy ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </button>
                    {openDropdown.sortBy && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
                      >
                        {/* Default Option */}
                        <li
                          onClick={() => handleSortSelect('Default')}
                          className={`flex items-center px-4 py-3 cursor-pointer hover:bg-indigo-100 ${
                            sortOption === 'Default' ? 'bg-indigo-100' : ''
                          }`}
                        >
                          <FaCheckCircle className="text-indigo-500 mr-2" />
                          <span>Default</span>
                        </li>
                        {/* Popularity Option */}
                        <li
                          onClick={() => handleSortSelect('Popularity')}
                          className={`flex items-center px-4 py-3 cursor-pointer hover:bg-indigo-100 ${
                            sortOption === 'Popularity' ? 'bg-indigo-100' : ''
                          }`}
                        >
                          <FaCheckCircle className="text-indigo-500 mr-2" />
                          <span>Sort by Popularity</span>
                        </li>
                      </motion.ul>
                    )}
                  </div>

                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agent Cards */}
      <div className="relative w-full overflow-hidden">
        <motion.div 
          className="max-w-6xl w-full mx-auto p-6 relative z-10" 
          initial="hidden" 
          animate="visible" 
          variants={containerVariants}
        >
          {Object.keys(categorizedAgents).map((category, categoryIndex) => (
            <motion.div key={categoryIndex} className="mb-12" data-aos="fade-up">
              {/* Category Header */}
              <motion.div
                className="mb-4 flex items-center space-x-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                data-aos="fade-right"
              >
                <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-primaryBlue2">
                  Explore {category}
                </h1>
                <motion.div className="bg-gradient-to-r from-indigo-500 to-blue-400 h-1 w-20 animate-pulse" data-aos="fade-left"></motion.div>
              </motion.div>

              {/* Category Description */}
              <motion.p
                className="text-gray-500 text-lg italic mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                data-aos="fade-up"
              >
                Discover top agents in the {category} space, crafted for your needs.
              </motion.p>

              <hr className="border-t bg-gray-300 my-4" />

              {/* Agent Grid */}
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {categorizedAgents[category].slice(0, 6).map(agent => (
                  <AgentCard 
                    key={agent._id} 
                    agent={agent} 
                    saveCounts={saveCounts} 
                    likeCounts={likeCounts}
                    handleWishlist={handleWishlist} 
                    handleLike={handleLike} 
                  />
                ))}
              </motion.div>

              {/* More Button */}
              <div className="flex justify-end mt-4">
                <Link to="/allagent">
                  <motion.button
                    className="flex items-center px-4 py-2 text-sm text-gray-500 border border-gray-300 rounded-full hover:bg-gray-100 hover:text-indigo-500 focus:outline-none transition-all duration-200 space-x-1 shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-aos="fade-up"
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

    </div>
  );
};

export default AgentFilterAndCard;
