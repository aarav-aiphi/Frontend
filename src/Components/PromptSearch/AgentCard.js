// File: Frontend/src/Body/PromptSearch/AgentCard.js

import React from 'react';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { AiOutlineLike } from "react-icons/ai";
import { motion } from 'framer-motion';
import { AiFillLike } from "react-icons/ai";
import { FaThumbsUp } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'; // For navigation

const AgentCard = ({
  agent,
  likeCounts,
  saveCounts,
  handleLike,
  handleWishlist,
}) => {
  const isLiked = agent.isLiked;
  const isSaved = agent.isSaved;

  return (
    <motion.div
      className="relative bg-white rounded-lg shadow-md p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300 overflow-hidden"
      whileHover={{ translateY: -5 }}
    >
      {/* Like and Save Icons at Top Right */}
      <div className="absolute top-4 right-4 flex space-x-3">
        {/* Like Button */}
        <button
          onClick={(event) => handleLike(event, agent._id)}
          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors z-10"
          aria-label={isLiked ? "Unlike Agent" : "Like Agent"}
        >
          {isLiked ? <FaThumbsUp  size={20} /> : <FaThumbsUp  size={20} />}
          <span className="ml-1 text-sm">{likeCounts[agent._id] || 0}</span>
        </button>

        {/* Save Button */}
        <button
          onClick={(event) => handleWishlist(event, agent._id)}
          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors z-10"
          aria-label={isSaved ? "Unsave Agent" : "Save Agent"}
        >
          {isSaved ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
          <span className="ml-1 text-sm">{saveCounts[agent._id] || 0}</span>
        </button>
      </div>

      {/* Accent Border at the Top */}
      <div className="absolute inset-0 border-t-4 border-blue-500 rounded-lg"></div>

      {/* Side Ribbon */}
      <div className="absolute top-0 left-0 bg-blue-500 text-white px-2 py-1 text-xs font-bold rounded-tr-lg rounded-br-lg">
        {agent.category || 'General'}
      </div>

      {/* Content */}
      <div className="relative z-10 mt-4">
        {/* Navigation Link */}
        <Link to={`/agent/${agent._id}`} className="cursor-pointer">
          {agent.logo && (
            <img
              src={agent.logo}
              alt={`${agent.name} Logo`}
              className="h-16 w-16 sm:h-20 sm:w-20 mb-4 object-contain"
            />
          )}
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
            {agent.name}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            {agent.tagline || 'No description available.'}
          </p>
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {agent.tags && agent.tags.length > 0 ? (
            agent.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-xs">No tags available.</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

AgentCard.propTypes = {
  agent: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    logo: PropTypes.string,
    shortDescription: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
    isLiked: PropTypes.bool,
    isSaved: PropTypes.bool,
  }).isRequired,
  likeCounts: PropTypes.object.isRequired,
  saveCounts: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleWishlist: PropTypes.func.isRequired,
};

export default AgentCard;
