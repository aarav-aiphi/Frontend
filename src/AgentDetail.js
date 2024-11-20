// src/Components/AgentDetail.js

import React, { useState, useEffect } from 'react';
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
  FaSpinner, // Import FaSpinner
} from 'react-icons/fa'; // Imported additional icons
import agent5_bg from './Images/agentbg4.jpg'; // Added new banner image

export const AgentDetail = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [similarAgents, setSimilarAgents] = useState([]);
  const [saveCounts, setSaveCounts] = useState({});
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`https://backend-1-sval.onrender.com/api/agents/similar/${id}`);
        if(response.status === 201) {
          
        }
        setAgent(response.data.agent);
        setSimilarAgents(response.data.bestMatches);
        const initialSaves = {};
        initialSaves[response.data.agent._id] = response.data.agent.savedByCount || 0;
        setSaveCounts(initialSaves);
      } catch (error) {
        console.error('Error fetching agent details:', error);
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
      // toast.error('An error occurred while updating the wishlist.');
      console.error('Error updating wishlist:', error);
    }
  };

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
      <div className="flex justify-end space-x-4 px-6 md:px-8 lg:px-12 mt-3">
        {/* Try It Now Button */}
        <Link to={agent.websiteUrl} target="_blank" rel="noopener noreferrer">
          <button className="bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-transform transform hover:scale-105 shadow-md flex items-center">
            <FaArrowRight className="mr-2" /> {/* Added icon */}
            Try it now
          </button>
        </Link>
        {/* Share Button */}
        <button className="text-gray-800 border border-gray-800 px-4 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition flex items-center">
          <FaShareAlt className="mr-2" />
          Share
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
          <p className="text-gray-600">Tried by: {agent.triedBy || 0}</p>
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

            {/* Key Features */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaCheckCircle className="mr-2 text-green-500" /> Key Features
              </h2>
              <ul className="list-disc list-inside text-left space-y-2">
                {agent.keyFeatures?.length ? (
                  agent.keyFeatures.map((feature, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <FaCheckCircle className="mt-1 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No key features available.</li>
                )}
              </ul>
            </motion.div>

            {/* Use Cases */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaUsers className="mr-2 text-blue-500" /> Use Cases
              </h2>
              <ul className="list-disc list-inside text-left space-y-2">
                {agent.useCases?.length ? (
                  agent.useCases.map((useCase, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <FaUsers className="mt-1 mr-2 text-blue-500" />
                      {useCase}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No use cases available.</li>
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
    </div>
  );
};

export default AgentDetail;
