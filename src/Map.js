// src/Components/TreeMap.js

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';
import bg3 from './Images/whitebg.jpg'; 
import { FaSpinner } from 'react-icons/fa'; // Import FaSpinner

const AgentCategory = ({ category, agents }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="mb-12 text-center" ref={ref}>
      
      {/* Category Title */}
      <motion.h2
        className="text-2xl font-semibold text-primaryBlue mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {category}
      </motion.h2>

      {/* Tree Branches for Agents */}
      <div className="flex justify-center items-center">
        <div className="relative flex items-start">
          {/* Central Line */}
          <div className="w-1 h-20 bg-blue-300 mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"></div>

          {/* Logos as Tree Nodes */}
          <div className="flex flex-wrap gap-6 justify-center mt-8">
            {agents.map((agent, index) => (
              <Link to={`/agent/${agent._id}`} key={agent._id}>
                <motion.div
                  className="relative bg-white w-20 h-20 p-3 rounded-full shadow-md hover:shadow-lg flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.3)',
                  }}
                  transition={{
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <motion.img
                    src={agent.logo || 'https://via.placeholder.com/64'}
                    alt={agent.name}
                    className="h-8 w-8 rounded-full border-2 border-blue-400 object-cover"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'loop',
                      ease: 'easeInOut',
                    }}
                  />
                  <span className="block mt-2 text-xs text-black font-semibold text-center">
                    {agent.name}
                  </span>

                  {/* Line Connecting Each Node */}
                  <div className="absolute w-1 h-8 bg-blue-300 top-0 left-1/2 transform -translate-x-1/2"></div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TreeMap = () => {
  const [agents, setAgents] = useState({});
  const [loading, setLoading] = useState(true); // Initialize loading state

  // Fetch agents and group by category
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get('https://backend-1-sval.onrender.com/api/agents/all');
        const groupedAgents = response.data.reduce((acc, agent) => {
          const category = agent.category || 'Uncategorized';
          if (!acc[category]) acc[category] = [];
          acc[category].push(agent);
          return acc;
        }, {});
        setAgents(groupedAgents);
      } catch (error) {
        console.error('Error fetching agents:', error);
        toast.error('Failed to fetch agents.');
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchAgents();
  }, []);

  // Spinner Component
  const Spinner = () => (
    <div className="flex justify-center items-center h-64">
      <FaSpinner className="animate-spin text-4xl text-primaryBlue" />
    </div>
  );

  return (
    <div
      className="tree-map-container py-12 px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${bg3})` }}
    >
      <h1 className="text-4xl font-bold text-center mb-12 text-primaryBlue tracking-wider shadow-sm shadow-blue-200">
        AI Agent Tree Map
      </h1>

      {loading ? (
        // Render Spinner while loading
        <Spinner />
      ) : (
        // Render Tree Map after loading
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {Object.keys(agents).map((category, idx) => (
            <AgentCategory key={idx} category={category} agents={agents[category]} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeMap;
