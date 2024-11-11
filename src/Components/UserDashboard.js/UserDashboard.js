// File: UserDashboard.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext.js'; // Import the AuthContext
import Avatar from '../Avatar/Avatar.js';
import {
  FaHeart,
  FaBookmark,
  FaHistory,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaHome // Import FaHome icon
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom'; // Import Link for navigation

const primaryBlue = '#4A90E2'; // Primary blue color
const secondaryBlue = '#1E90FF'; // Secondary blue for variation

const UserDashboard = () => {
  const [savedAgents, setSavedAgents] = useState([]);
  const [likedAgents, setLikedAgents] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [recommendedAgents, setRecommendedAgents] = useState([]); // New state for recommended agents
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [loadingLiked, setLoadingLiked] = useState(true);
  const [loadingUseCases, setLoadingUseCases] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true); // Loading state for recommended agents
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar
  const { isAuthenticated, user, loadingAuth } = useContext(AuthContext); // Get the user from the AuthContext

  const messages = [
    'Welcome to AiAzent!',
    'Transform your business with AI',
    'Discover powerful AI agents',
    'Enhance productivity and efficiency',
  ];

  const token = Cookies.get('token');

  // AgentCard Component
  const AgentCard = ({ agent }) => (
    <motion.div
      className="relative bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 overflow-hidden"
      whileHover={{ translateY: -5 }}
    >
      {/* Accent Border at the Top */}
      <div className="absolute inset-0 border-t-4 border-blue-500 rounded-lg"></div>

      {/* Side Ribbon */}
      <div className="absolute top-0 left-0 bg-blue-500 text-white px-2 py-1 text-xs font-bold rounded-tr-lg rounded-br-lg">
        {agent.category}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {agent.logo && (
          <img
            src={agent.logo}
            alt={`${agent.name} Logo`}
            className="h-12 w-12 sm:h-16 sm:w-16 mb-2 sm:mb-4 object-contain"
          />
        )}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">{agent.name}</h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4">{agent.shortDescription}</p>

        {/* Likes and Savers Count */}
        <div className="flex items-center mt-2 sm:mt-4 space-x-4 sm:space-x-6">
          {/* Likes */}
          <div className="flex items-center text-gray-600 text-xs sm:text-sm">
            <FaHeart className="mr-1 text-red-500" />
            <span>{agent.likes}</span>
          </div>
          {/* Savers Count */}
          <div className="flex items-center text-gray-600 text-xs sm:text-sm">
            <FaBookmark className="mr-1 text-blue-500" />
            <span>{agent.savedByCount}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  useEffect(() => {
    if (!token) {
      toast.error('You need to log in to view the dashboard.');
      return;
    }

    const fetchSavedAgents = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/users/wishlist',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setSavedAgents(response.data.wishlist);
      } catch (error) {
        toast.error('Failed to fetch saved agents.');
        console.error('Error fetching saved agents:', error);
      }
      setLoadingSaved(false);
    };

    const fetchLikedAgents = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/users/liked-agents',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setLikedAgents(response.data.likedAgents);
      } catch (error) {
        toast.error('Failed to fetch liked agents.');
        console.error('Error fetching liked agents:', error);
      }
      setLoadingLiked(false);
    };

    const fetchUseCases = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/users/search-history',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setUseCases(response.data.searchHistory);
      } catch (error) {
        toast.error('Failed to fetch use cases.');
        console.error('Error fetching use cases:', error);
      }
      setLoadingUseCases(false);
    };

    fetchSavedAgents();
    fetchLikedAgents();
    fetchUseCases();
  }, [token]);

  // Fetch recommended agents based on liked and saved agents
  useEffect(() => {
    const fetchRecommendedAgents = async () => {
      if (loadingSaved || loadingLiked) return; // Wait until liked and saved agents are fetched

      try {
        let similarAgents = [];

        // Function to fetch similar agents for a given agent ID
        const fetchSimilar = async (agentId) => {
          try {
            const response = await axios.get(
              `http://localhost:5000/api/agents/similar/${agentId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
              }
            );
            return response.data.bestMatches;
          } catch (error) {
            console.error(`Error fetching similar agents for ${agentId}:`, error);
            return [];
          }
        };

        // Fetch similar agents for each liked agent
        const likedPromises = likedAgents.map((agent) => fetchSimilar(agent._id));
        const likedResults = await Promise.all(likedPromises);
        likedResults.forEach((agents) => {
          similarAgents = similarAgents.concat(agents);
        });

        // Fetch similar agents for each saved agent
        const savedPromises = savedAgents.map((agent) => fetchSimilar(agent._id));
        const savedResults = await Promise.all(savedPromises);
        savedResults.forEach((agents) => {
          similarAgents = similarAgents.concat(agents);
        });

        // Remove duplicate agents based on _id
        const uniqueAgentsMap = new Map();
        similarAgents.forEach((agent) => {
          if (!uniqueAgentsMap.has(agent._id)) {
            uniqueAgentsMap.set(agent._id, agent);
          }
        });
        const uniqueAgents = Array.from(uniqueAgentsMap.values());

        if (uniqueAgents.length > 0) {
          // If there are similar agents, recommend top 4-5 based on likes
          const sortedSimilarAgents = uniqueAgents.sort((a, b) => b.likes - a.likes);
          setRecommendedAgents(sortedSimilarAgents.slice(0, 5));
        } else {
          // If no similar agents, fetch top-liked agents as recommendations
          const response = await axios.get('http://localhost:5000/api/agents/top-likes-by-category');
          const topAgents = response.data;
          setRecommendedAgents(topAgents.slice(0, 5));
        }
      } catch (error) {
        toast.error('Failed to fetch recommended agents.');
        console.error('Error fetching recommended agents:', error);
      }
      setLoadingRecommended(false);
    };

    fetchRecommendedAgents();
  }, [likedAgents, savedAgents, loadingSaved, loadingLiked, token]);

  // Cycle through welcome messages
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearTimeout(timer);
  }, [currentMessageIndex]);

  // Background Elements Component
  const BackgroundElements = () => (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Optional decorative elements */}
    </div>
  );

  // Toggle Sidebar for Mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gray-100">
      <BackgroundElements />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between bg-white shadow-md p-4 z-50">
       
        <button
          onClick={toggleSidebar}
          className="text-gray-800 focus:outline-none"
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
         <div className="flex items-center">
          {user?.profileImagee ? (
            <img
              src={`${user?.profileImage}`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
          ) : (
            <Avatar size={40} name={user?.firstName} className="mr-3" />
          )}
          <h2 className="text-lg font-semibold text-gray-800">{user?.firstName}</h2>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:inset-0 bg-white shadow-md z-40 transition-transform duration-300 ease-in-out w-64`}
      >
        {/* Profile Section */}
        <div className="flex flex-col items-center mt-20 md:mt-5 p-4">
          {user?.profileImagee ? (
            <img
              src={`${user?.profileImage}`}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover mb-3"
            />
          ) : (
            <Avatar size={64} name={user?.firstName} className="mb-3" />
          )}
          <h2 className="text-xl font-semibold text-gray-800">{user?.firstName}</h2>
          <p className="text-sm text-gray-600">{user?.email}</p>
          {/* Optional Edit Profile Button */}
          {/* <button className="mt-3 px-4 py-1 text-sm text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-200">
            Edit Profile
          </button> */}
        </div>

        {/* Separator */}
        <hr className="my-4 border-gray-300" />

        {/* Navigation Menu */}
        <nav className="px-4">
          {['home', 'dashboard', 'saved', 'liked', 'usecases'].map((section) => (
            <div key={section} className="group mb-4">
              {/* 
                Using Link for 'home' and buttons for other sections.
                This ensures 'Home' navigates to '/' without affecting the activeSection state.
              */}
              {section === 'home' ? (
                <Link
                  to="/"
                  className="flex items-center w-full py-2 px-3 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors duration-200"
                >
                  <FaHome className="mr-3" size={18} />
                  <span className="capitalize text-sm">Home</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setActiveSection(section);
                    if (isSidebarOpen) setIsSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                  className={`flex items-center w-full py-2 px-3 rounded-md ${
                    activeSection === section
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  } focus:outline-none transition-colors duration-200`}
                >
                  {section === 'dashboard' && <FaUserCircle className="mr-3" size={18} />}
                  {section === 'saved' && <FaBookmark className="mr-3" size={18} />}
                  {section === 'liked' && <FaHeart className="mr-3" size={18} />}
                  {section === 'usecases' && <FaHistory className="mr-3" size={18} />}
                  <span className="capitalize text-sm">{section}</span>
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 md:p-10 h-screen overflow-auto mt-16 md:mt-0">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <motion.section
              className="mb-12 flex flex-col items-center justify-center h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentMessageIndex}
                  className="text-3xl sm:text-5xl font-bold text-center text-primaryBlue drop-shadow-lg mb-6 sm:mb-8"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.8 }}
                >
                  {messages[currentMessageIndex]}
                </motion.h1>
              </AnimatePresence>

              {/* Recommended Agents */}
              <div className="w-full">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-gray-900">Recommended Agents</h2>
                {loadingRecommended ? (
                  <p className="text-gray-600">Loading recommended agents...</p>
                ) : recommendedAgents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {recommendedAgents.map((agent) => (
                      <AgentCard key={agent._id} agent={agent} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No recommendations available at the moment.</p>
                )}
              </div>
            </motion.section>
          )}

          {/* Section Title */}
          {activeSection !== 'dashboard' && activeSection !== 'home' && (
            <motion.h1
              className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {activeSection === 'saved' && 'Saved Agents'}
              {activeSection === 'liked' && 'Liked Agents'}
              {activeSection === 'usecases' && 'Your Use Cases'}
            </motion.h1>
          )}

          {/* Home Section (Optional: If you want to display content when navigating home within the dashboard) */}
          {/* If "Home" is a separate route, this section can be removed */}
          {/* Uncomment the following if "Home" should display within the dashboard */}
          {/* {activeSection === 'home' && (
            <motion.section
              className="mb-12 flex flex-col items-center justify-center h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-5xl font-bold text-primaryBlue drop-shadow-lg mb-6">
                Welcome Home!
              </h1>
              <p className="text-gray-600 text-center">
                Explore our platform to discover and manage your favorite AI agents.
              </p>
            </motion.section>
          )} */}

          {/* Saved Agents Section */}
          {activeSection === 'saved' && (
            <motion.section
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {loadingSaved ? (
                <p className="text-gray-600">Loading saved agents...</p>
              ) : savedAgents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {savedAgents.map((agent) => (
                    <AgentCard key={agent._id} agent={agent} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No saved agents found.</p>
              )}
            </motion.section>
          )}

          {/* Liked Agents Section */}
          {activeSection === 'liked' && (
            <motion.section
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {loadingLiked ? (
                <p className="text-gray-600">Loading liked agents...</p>
              ) : likedAgents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {likedAgents.map((agent) => (
                    <AgentCard key={agent._id} agent={agent} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No liked agents found.</p>
              )}
            </motion.section>
          )}

          {/* Use Cases Section */}
          {activeSection === 'usecases' && (
            <motion.section
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {loadingUseCases ? (
                <p className="text-gray-600">Loading use cases...</p>
              ) : useCases.length > 0 ? (
                <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
                  <ul className="space-y-3 sm:space-y-4">
                    {useCases.map((useCase) => (
                      <li
                        key={useCase._id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg"
                      >
                        <span className="text-gray-700 text-sm sm:text-base">{useCase.query}</span>
                        <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
                          {new Date(useCase.timestamp).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-600">No use cases found.</p>
              )}
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
