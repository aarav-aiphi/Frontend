// src/Components/AgentDetail.js

import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaShareAlt, 
  FaRegBookmark, 
  FaIndustry, 
  FaKey, 
  FaCheckCircle, 
  FaLightbulb, 
  FaUsers, 
  FaArrowRight,
  FaSpinner,
  FaEye, // Existing import
  FaFacebook, // New import for Facebook
  FaLinkedin, // New import for LinkedIn
  FaCopy,      // New import for Copy Link
} from 'react-icons/fa';
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa"; 
import agent5_bg from './Images/agentbg4.jpg';
import { CategoryAgentPage } from './Components/CategoryAgentPage';

export const AgentDetail = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [similarAgents, setSimilarAgents] = useState([]);
  const [saveCounts, setSaveCounts] = useState({});
  const [loading, setLoading] = useState(true); // Initialize loading state
  const [isShareOpen, setIsShareOpen] = useState(false); // State to control share menu visibility
  const shareRef = useRef(null); // Reference to the share button container

  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`https://backend-1-sval.onrender.com/api/agents/similar/${id}`);
        if (response.status === 201) {
          // Handle if needed
        }
        setAgent(response.data.agent);
        setSimilarAgents(response.data.bestMatches);
        const initialSaves = {};
        initialSaves[response.data.agent._id] = response.data.agent.savedByCount || 0;
        setSaveCounts(initialSaves);

        // Increment triedBy count
        const triedByResponse = await axios.post(`https://backend-1-sval.onrender.com/api/agents/triedby/${id}`, {}, {
          withCredentials: true, // Include if authentication is required
        });

        if (triedByResponse.status === 200) {
          setAgent(triedByResponse.data.agent);
        }

      } catch (error) {
        console.error('Error fetching agent details:', error);
        // Optionally display a toast notification
        // toast.error('Failed to load agent details.');
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchAgentDetails();
  }, [id]);

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
        toast.success(`Agent Added to wishlist!`);
        setSaveCounts((prevSaveCounts) => ({
          ...prevSaveCounts,
          [agentId]: response.data.agent.savedByCount,
        }));
      }
      if (response.status === 201) {
        toast.success(`Agent Removed from wishlist!`);
        setSaveCounts((prevSaveCounts) => ({
          ...prevSaveCounts,
          [agentId]: response.data.agent.savedByCount,
        }));
      }

    } catch (error) {
      toast.error('Authentication required');
      // console.error('Error updating wishlist:', error);
    }
  };

  // Function to toggle share menu
  const toggleShare = () => {
    setIsShareOpen(!isShareOpen);
  };

  // Function to handle sharing on Facebook
  const handleShareFacebook = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(`Check out ${agent.name}!`);
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&t=${shareTitle}`;
    window.open(facebookShareUrl, '_blank', 'noopener,noreferrer');
    setIsShareOpen(false);
  };

  // Function to handle sharing on LinkedIn
  const handleShareLinkedIn = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
    window.open(linkedinShareUrl, '_blank', 'noopener,noreferrer');
    setIsShareOpen(false);
  };

  // Function to handle copying link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link.'));
    setIsShareOpen(false);
  };

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setIsShareOpen(false);
      }
    };
    if (isShareOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShareOpen]);

  // Spinner Component
  const Spinner = () => (
    <div className="flex justify-center items-center h-screen" aria-label="Loading">
      <FaSpinner className="animate-spin text-5xl text-primaryBlue" />
    </div>
  );

  if (loading) {
    return <Spinner />; // Render Spinner while loading
  }

  if (!agent) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-500">Agent not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto bg-gray-50 relative">

      

      {/* Banner and Logo Section */}
      <div className="relative w-full h-56 rounded-lg overflow-visible">
        {/* Banner Image */}
        <img
          src={agent5_bg}
          alt={`${agent.name} Banner`}
          className="w-full h-full object-cover rounded-lg"
        />
        {/* Agent Logo */}
        <div className="absolute left-6 bottom-0 transform translate-y-1/2 z-10">
          <img
            src={agent.logo || 'https://via.placeholder.com/150'}
            alt={agent.name}
            className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>
      </div>

      {/* Action Buttons Below Banner Image */}
      <div className="flex justify-end space-x-4 px-6 md:px-8 lg:px-12 mt-3 relative" ref={shareRef}>
        {/* Try It Now Button */}
        <Link to={agent.websiteUrl} target="_blank" rel="noopener noreferrer">
          <button className="bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-transform transform hover:scale-105 shadow-md flex items-center">
            <FaArrowRight className="mr-2" /> {/* Added icon */}
            Try it now
          </button>
        </Link>
        {/* Share Button */}
        <button 
          className="relative text-gray-800 border border-gray-800 px-4 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition flex items-center"
          onClick={toggleShare}
          aria-label="Share Agent"
        >
          <FaShareAlt className="mr-2" />
          Share

          {/* Share Options Dropdown */}
          {isShareOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
              <button
                onClick={handleShareFacebook}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaFacebook className="mr-2 text-blue-600" />
                Facebook
              </button>
              <button
                onClick={handleShareLinkedIn}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaLinkedin className="mr-2 text-blue-700" />
                LinkedIn
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaCopy className="mr-2 text-gray-600" />
                Copy Link
              </button>
            </div>
          )}
        </button>
      </div>

      {/* Agent Information Section */}
      <div className="mt-10 px-6 md:px-8 lg:px-12">
        {/* Agent Name */}
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">{agent.name || 'Unknown Agent'}</h1>
        {/* Short Description */}
        <p className="text-md md:text-xl mt-2 text-gray-600">{agent.shortDescription || 'No short description available.'}</p>
        
        {/* Category and Industry Badges */}
        <div className="mt-4 flex flex-wrap items-center space-x-2">
          <span className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm md:text-base">
            <FaIndustry className="mr-1" /> {agent.category || 'Uncategorized'}
          </span>
          <span className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm md:text-base">
            <FaKey className="mr-1" /> {agent.industry || 'Unknown Industry'}
          </span>
        </div>
        
        {/* Tried By and Wishlist Button */}
        <div className="flex items-center mt-4">
          {/* Tried By with Eye Icon */}
          <div className="flex items-center text-gray-600">
            <FaEye className="mr-2" aria-label="Tried By" />
            <span>{agent.triedBy || 0}</span>
          </div>
          {/* Wishlist Button */}
          <button
            className="flex items-center text-gray-800 bg-gray-300 hover:bg-gray-400 transition-all ml-4 px-4 py-2 rounded-full shadow-sm"
            onClick={(event) => handleWishlist(event, agent._id)}
            aria-label="Save Agent to Wishlist"
          >
            <FaRegBookmark className="mr-2" size={20} />
            <span className="text-lg">{saveCounts[agent._id] || 0}</span>
          </button>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 md:px-8 lg:px-12 mb-12">
        {/* Left Column: Description, Key Features, Use Cases */}
        <div className="lg:col-span-2 p-6 mt-6 flex justify-center">
          {/* Inner Wrapper to Center Content */}
          <div className="max-w-2xl w-full">
            {/* Description */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaLightbulb className="mr-2 text-yellow-500" /> Description
              </h2>
              <p className="text-gray-700">{agent.description || 'No detailed description available.'}</p>
            </motion.div>

  

<motion.div
  className="mb-6 border border-gray-300  p-4 bg-gray-50"
  initial={{ opacity: 0, y: 10 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  viewport={{ once: true }}
>
  <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
   Key Features
  </h2>
  <ul className="text-left space-y-2">
    {agent.keyFeatures?.length ? (
      agent.keyFeatures.map((feature, index) => (
        <li
          key={index}
          className="text-gray-700 flex items-start bg-blue-50 hover:bg-blue-100 p-3 rounded-lg"
        >
          <FaCheckCircle className="mt-1 mr-2 text-green-500" /> {/* Check Icon */}
          {feature}
        </li>
      ))
    ) : (
      <li className="text-gray-400 p-3 bg-blue-50 rounded-lg flex items-center">
        <FaExclamationCircle className="mr-2 text-yellow-500" /> {/* Warning Icon */}
        No key features available.
      </li>
    )}
  </ul>
</motion.div>



<motion.div
  className="mb-6 border border-gray-300 p-4 bg-gray-50 "
  initial={{ opacity: 0, y: 10 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.4 }}
  viewport={{ once: true }}
>
  <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
    Use Cases
  </h2>
  <ul className="text-left space-y-2">
    {agent.useCases?.length ? (
      agent.useCases.map((useCase, index) => (
        <li
          key={index}
          className="text-gray-700 flex items-start bg-blue-50 hover:bg-blue-100 p-3 rounded-lg"
        >
          <FaUsers className="mt-1 mr-2 text-blue-500" /> {/* User Icon */}
          {useCase}
        </li>
      ))
    ) : (
      <li className="text-gray-400 p-3 bg-blue-50 rounded-lg flex items-center">
        <FaExclamationCircle className="mr-2 text-yellow-500" /> {/* Warning Icon */}
        No use cases available.
      </li>
    )}
  </ul>
</motion.div>

          </div>
        </div>

        {/* Right Column: Similar Agents */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaUsers className="mr-2 text-blue-500" /> Similar Agents
          </h2>
          <div className="space-y-4">
            {similarAgents.length ? (
              similarAgents.map((similarAgent) => (
                <Link
                  to={`/agent/${similarAgent._id}`}
                  key={similarAgent._id}
                  className="flex flex-col sm:flex-row items-center bg-blue-50 hover:bg-blue-100 p-4 rounded-lg transition-all"
                >
                  <img
                    src={similarAgent.logo || 'https://via.placeholder.com/50'}
                    alt={similarAgent.name}
                    className="h-16 w-16 rounded-full object-cover"
                    loading="lazy" // Added lazy loading for performance
                  />
                  <div className="mt-2 sm:mt-0 sm:ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      {similarAgent.name}
                      <FaArrowRight className="ml-2 text-gray-500" /> {/* Added icon */}
                    </h3>
                    <p className="text-gray-500 text-sm">{similarAgent.category}</p>
                    {/* Short Description */}
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {similarAgent.shortDescription || 'No short description available.'}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400">No similar agents found.</p>
            )}
          </div>
        </div>
      </div>
      <CategoryAgentPage/>
    </div>
  );
};

export default AgentDetail;
