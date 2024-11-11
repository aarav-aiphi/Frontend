// src/Components/Navbar.js

import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaCog, FaRobot } from 'react-icons/fa';
import { AuthContext } from "./context/AuthContext";
import Avatar from "./Components/Avatar/Avatar";
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();


  // Function to toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Function to close mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <>
      <nav className="bg-white fixed w-full top-0 z-50 shadow-lg h-16">
        {/* Large Screen Layout */}
        <div
          className="hidden md:flex flex-wrap items-center justify-between max-w-screen-xl px-6 py-4 mx-auto h-full"
        >
          {/* Website Name */}
          <Link
            to="/"
            className="text-4xl font-extrabold bg-clip-text text-transparent bg-primaryBlue2 tracking-wide hover:scale-105 transition-transform duration-300 flex items-center"
          >
            <FaRobot className="mr-2" />
            AiAzent
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8 items-center">
           
            <Link
              to="/allagent"
              className="text-lg font-medium text-gray-700 hover:text-blue-600 hover:  transition duration-200"
            >
              Category
            </Link>
            <Link
              to="/agentform"
              className="text-lg font-medium text-gray-700 hover:text-blue-600 hover:  transition duration-200"
            >
            Submit Agent
            </Link>
            <Link
              to="/map"
              className="text-lg font-medium text-gray-700 hover:text-blue-600 hover:  transition duration-200"
            >
              Tree Map
            </Link>
            <Link
              to="/blogs"
              className="text-lg font-medium text-gray-700 hover:text-blue-600 hover:  transition duration-200"
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className="text-lg font-medium text-gray-700 hover:text-blue-600 hover:  transition duration-200"
            >
              Contact
            </Link>
          </div>

          {/* Sign-In Button or User Avatar */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="ml-4 relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryBlue"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  aria-label="User Menu"
                >
                  {user?.profileImagee ? (
                    <img
                      src={`${user?.profileImage}`}
                      alt="User Profile"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <Avatar name={user?.firstName} size={40} />
                  )}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      transition={{ duration: 0.2 }}
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                    >
                      <div className="py-1">
                        {/* Dashboard Link */}
                        <Link
                          to="/userdash"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FaUserCircle className="mr-3 text-lg" />
                          Dashboard
                        </Link>
                        {/* Logout Button */}
                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <FaSignOutAlt className="mr-3 text-lg" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primaryBlue3 text-white py-2 px-6 rounded-full font-semibold shadow-md hover:shadow-lg transition-transform transform hover:scale-105 text-center"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Screen Layout */}
        <div className="flex md:hidden justify-between items-center px-4 py-2 h-full">
          {/* Website Name */}
          <Link
            to="/"
            className="text-2xl font-extrabold bg-clip-text text-transparent bg-primaryBlue2 tracking-wide hover:scale-105 transition-transform duration-300 flex items-center"
          >
            <FaRobot className="mr-2" />
            AiAzent
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            type="button"
            className="text-gray-500 focus:outline-none"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? (
              // Close Icon
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger Icon
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-white shadow-md"
              id="mobile-menu"
            >
              <ul className="flex flex-col p-4 space-y-4">
                <li>
                
                </li>
                <li>
                  <Link
                    to="/allagent"
                    onClick={handleLinkClick}
                    className="block text-lg font-medium text-gray-700 hover:text-blue-600 hover:  transition duration-200"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/agentform"
                    onClick={handleLinkClick}
                    className="block text-lg font-medium text-gray-700 hover:text-blue-600 hover:  transition duration-200"
                  >
                    Submit Agent
                  </Link>
                </li>
                <li>
                  <Link
                    to="/map"
                    onClick={handleLinkClick}
                    className="block text-lg font-medium text-gray-700 hover:text-blue-600 hover:  transition duration-200"
                  >
                    Tree Map
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blogs"
                    onClick={handleLinkClick}
                    className="block text-lg font-medium text-gray-700 hover:text-blue-600 hover:  transition duration-200"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    onClick={handleLinkClick}
                    className="block text-lg font-medium text-gray-700 hover:text-blue-600 hover:  transition duration-200"
                  >
                    Contact
                  </Link>
                </li>
                {!isAuthenticated && (
                  <li>
                    <Link
                      to="/login"
                      onClick={handleLinkClick}
                      className="bg-primaryBlue2 text-white py-2 px-6 rounded-full font-semibold shadow-md hover:shadow-lg transition-transform transform hover:scale-105 text-center"
                    >
                      Sign In
                    </Link>
                  </li>
                )}
                {isAuthenticated && (
                  <li className="border-t pt-4">
                    <Link
                      to="/userdash"
                      onClick={handleLinkClick}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <FaUserCircle className="mr-3 text-lg" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        handleLinkClick();
                      }}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <FaSignOutAlt className="mr-3 text-lg" />
                      Logout
                    </button>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Padding to prevent content from being hidden behind the navbar */}
      <div className="mt-16"></div>
    </>
  );
};

export default Navbar;
