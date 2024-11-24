// src/Components/OurAIAgents.js

import React from 'react';
import { FaRobot, FaIndustry, FaGlobeAmericas, FaThumbsUp, FaHandsHelping } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const OurAIAgents = () => {
  // Data for the AI Agents metrics

  const metrics = [
    {
      id: 1,
      icon: <FaRobot size={40} className="text-white" />,
      title: 'AI Agents Deployed',
      value: '150+',
      description: 'Number of AI agents successfully deployed across various platforms.',
      bgColor: 'bg-blue-600',
    },
    {
      id: 2,
      icon: <FaIndustry size={40} className="text-white" />,
      title: 'Industries Served',
      value: '20+',
      description: 'Diverse industries leveraging our AI agents to enhance their operations.',
      bgColor: 'bg-green-500',
    },
    {
      id: 3,
      icon: <FaGlobeAmericas size={40} className="text-white" />,
      title: 'Global Reach',
      value: '50+ Countries',
      description: 'AI agents deployed and operational in over 50 countries worldwide.',
      bgColor: 'bg-purple-500',
    },
    {
      id: 4,
      icon: <FaThumbsUp size={40} className="text-white" />,
      title: 'Customer Satisfaction',
      value: '98%',
      description: 'Achieved a 98% satisfaction rate from our clients and users.',
      bgColor: 'bg-yellow-500',
    },
  ];

  // Handler for Sponsorship Button

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title and Subtitle */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-gray-800 mb-4">
            Our AI Agents at a Glance
          </h2>
          <p className="text-lg text-gray-600">
            Discover the impact and reach of our AI agents across various industries and regions.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric) => (
            <motion.div
              key={metric.id}
              className=" p-6 flex flex-col items-center text-center"
              whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0,0,0,0.15)' }}
              transition={{ duration: 0.3 }}
            >
              {/* Icon with Background */}
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full ${metric.bgColor} mb-4`}
              >
                {metric.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {metric.title}
              </h3>

              {/* Value */}
              <p className="text-3xl font-bold text-primaryBlue2 mb-2">
                {metric.value}
              </p>

              {/* Description */}
              <p className="text-gray-600">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        {/* View Sponsorship Button */}
        <div className="mt-12 flex justify-center">
            <Link to="/sponsorship" >
          <motion.button
           
            whileHover={{ scale: 1.05, backgroundColor: '#3B82F6' }} // Adjust the hover color as needed
            whileTap={{ scale: 0.95 }}
            className="flex items-center bg-primaryBlue2 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all"
            aria-label="View Sponsorship Opportunities"
          >
            <FaHandsHelping className="mr-2" />
            View Sponsorship
          </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OurAIAgents;
