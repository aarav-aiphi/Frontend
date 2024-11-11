// src/Components/AllAgents.js

import React, { useState, useEffect } from 'react';
import { Filter } from './Filter/Filter';
import { AgentList } from './AgentList';
import { FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';
import bg3 from "../Images/whitebg.jpg";
import { motion, AnimatePresence } from 'framer-motion';

export const AllAgents = () => {
  const [filters, setFilters] = useState({
    category: 'Category',
    industry: 'Industry',
    pricingModel: 'Pricing',
    accessModel: 'Access',
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // State to manage filter panel visibility on small screens
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  // State to manage filter sidebar collapse on large screens
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);

  const toggleFilterCollapse = () => setIsFilterCollapsed(!isFilterCollapsed);

  // Prevent body scroll when filter is open on small screens
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFilterOpen]);

  // Handle Escape key to close filter panel on small screens
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isFilterOpen) {
        setIsFilterOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isFilterOpen]);

  return (
    <div className='mt-16 flex flex-col md:flex-row relative bg-center bg-cover'
   
        style={{ backgroundImage: `url(${bg3})` }}
      >
    
      {/* Filter Sidebar for Large Screens */}
      <div
        className={`hidden md:flex fixed md:static top-16 left-0 h-full bg-gray-100 shadow-xl transition-all duration-300 z-0 ${
          isFilterCollapsed ? 'w-20' : 'w-80'
        }`}
      >
        {/* Flex column for sidebar content */}
        <div className="flex flex-col h-full w-72 mt-10">
          {/* Filter Collapse Button */}
          <div className="flex justify-end p-2">
            <button
              onClick={toggleFilterCollapse}
              className="flex items-center text-primaryBlue hover:text-blue-700 transition-colors duration-300"
              aria-label={isFilterCollapsed ? 'Expand Filter Sidebar' : 'Collapse Filter Sidebar'}
            >
              <FaFilter className="mr-2" size={20} />
              {isFilterCollapsed ? <FaChevronRight size={20} /> : <FaChevronLeft size={20} />}
            </button>
          </div>
          {/* Conditionally render the filter content based on collapsed state */}
          {!isFilterCollapsed && (
            <div className="flex-grow overflow-y-auto">
              <Filter onFilterChange={handleFilterChange} />
            </div>
          )}
        </div>
      </div>

      {/* Agent List */}
      <div
        className={`w-full transition-all duration-300 ${
          isFilterCollapsed ? 'md:ml-5' : 'md:ml-5'
        }`}
      >
        <AgentList filters={filters} />
      </div>

      {/* Filter Toggle Button for Small Screens */}
      <div
        className="fixed bottom-24 right-4 z-60 p-3 cursor-pointer text-primaryBlue hover:text-blue-700 transition-all duration-300 md:hidden bg-white rounded-full shadow-lg"
        onClick={toggleFilter}
        aria-label="Toggle Filter Panel"
      >
        <FaFilter size={24} />
      </div>

      {/* Filter Panel for Small Screens */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black opacity-50 z-40"
              onClick={toggleFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              aria-hidden="true"
            ></motion.div>

            {/* Filter Panel */}
            <motion.div
              className="fixed top-16 left-0 w-80 bg-white shadow-xl transform translate-x-0 transition-transform duration-300 ease-in-out z-50 h-full overflow-y-auto"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="flex flex-col space-y-6 p-6">
                {/* Close Button */}
                <div className="flex justify-end">
                  <button
                    onClick={toggleFilter}
                    className="text-gray-700 hover:text-primaryBlue transition-colors duration-300"
                    aria-label="Close Filter Panel"
                  >
                    <IoIosClose size={24} />
                  </button>
                </div>

                {/* Filter Content */}
                <Filter onFilterChange={handleFilterChange} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllAgents;
