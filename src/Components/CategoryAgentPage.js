// src/components/CategoryAgentPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaArrowRight,
  FaSpinner,
  FaCode,
  FaHeadset,
  FaChartLine,
  FaUserTie,
  FaTasks,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

const categoryIcons = {
  Coding: <FaCode className="text-4xl text-indigo-500" />,
  'Customer Service': <FaHeadset className="text-4xl text-green-500" />,
  'Data Analysis': <FaChartLine className="text-4xl text-yellow-500" />,
  'Personal Assistant': <FaUserTie className="text-4xl text-pink-500" />,
  Productivity: <FaTasks className="text-4xl text-blue-500" />,
  // Add more mappings as needed
};

export const CategoryAgentPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        'https://backend-1-sval.onrender.com/api/agents/filters'
      );
      setCategories(response.data.categories.slice(0, 6) || []); // Slice to first 6 categories
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner
          className="animate-spin text-5xl text-indigo-500"
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      {/* Toast Notifications */}
      <ToastContainer />

      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800">
        Explore Our Categories
      </h2>

      {categories.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">
            No categories found. Please try again later.
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <Link
                to={`/allagent?category=${encodeURIComponent(category)}#filters`}
                className="relative w-64 bg-white rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center p-6 transform hover:-translate-y-1 hover:scale-105"
                aria-label={`Explore ${category} category`}
              >
                {/* Category Icon */}
                <div className="mb-4 transition-transform duration-300 transform hover:scale-110">
                  {categoryIcons[category] || (
                    <FaTasks className="text-4xl text-gray-400" />
                  )}
                </div>

                {/* Category Name */}
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-center text-gray-700">
                  {category}
                </h3>

                {/* Optional: Add a short description or tagline */}
                <p className="text-gray-500 text-center mb-4">
                  Discover top agents in {category}.
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* More Button */}
      <div className="flex justify-center mt-12">
        <Link to="/allagent#filters">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            <span className="font-medium">More Categories</span>
            <FaArrowRight className="ml-2 transition-transform duration-300 transform group-hover:translate-x-1" />
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default CategoryAgentPage;
