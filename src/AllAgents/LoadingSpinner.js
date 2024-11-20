// src/Components/LoadingSpinner.js

import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LoadingSpinner = () => (
  <motion.div
    className="fixed inset-0 mt-16 flex justify-center items-center bg-black bg-opacity-50 z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    aria-label="Loading"
  >
    <FaSpinner className="animate-spin text-5xl text-white" />
  </motion.div>
);

export default LoadingSpinner;
