// src/Components/NewsList.js

import React, { useContext, useState, useEffect, memo } from 'react';
import { NewsContext } from '../context/NewsContext';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { FaSearch, FaChevronRight, FaUser, FaClock, FaCode, FaLaptop, FaRobot, FaBook } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion
import NewsImg from '../Images/blog.jpg'; 
import NewsImg2 from '../Images/blog2.png';
// Renamed for clarity
import bgimg from '../Images/whitebg.jpg';
import bgimg2 from '../Images/whitebg2.jpg';
// Renamed for clarity
// Define the base URL for Strapi
const STRAPI_BASE_URL = '';
const primaryBlue2 = 'rgb(73, 125, 168)';

// Category to Icon mapping
const categoryIcons = {
  Technology: <FaLaptop className="mr-2 text-lg" />,
  AI: <FaRobot className="mr-2 text-lg" />,
  Programming: <FaCode className="mr-2 text-lg" />,
  Education: <FaBook className="mr-2 text-lg" />,
  // Add more categories and their corresponding icons here
  Default: <MdCategory className="mr-2 text-lg" />, // Default icon
};

// Header texts to cycle through
const headerTexts = ['AI Agents Insights', 'Discover AI Trends', 'Innovate with AI'];

const NewsList = () => {
  const { news, loading, categories } = useContext(NewsContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 6;
  
  const placeholderSvg = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#f3f4f6"/>
        <text x="200" y="150" font-family="Arial" font-size="20" fill="#9ca3af" text-anchor="middle" dy=".3em">
            Image not available
        </text>
    </svg>`
)}`;

  const [headerIndex, setHeaderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderIndex((prevIndex) => (prevIndex + 1) % headerTexts.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let tempNews = news;

    // Filter by search term
    if (searchTerm) {
      tempNews = tempNews.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected category
    if (selectedCategory) {
      tempNews = tempNews.filter(item => item.category?.name === selectedCategory);
    }

    setFilteredNews(tempNews);
    setCurrentPage(1); // Reset to first page on new filter
  }, [news, searchTerm, selectedCategory]);

  // Pagination logic
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Memoized NewsCard component
  const NewsCard = memo(({ item }) => {
    return (
      <article className="group flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="md:w-1/3 relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Link to={`/news/${item.slug}`} className="block w-full h-full">
            <img
              src={item?.cover?.url || placeholderSvg}
              alt={item?.title || 'News Cover'}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </Link>
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <Link to={`/news/${item.slug}`} className="block text-primaryBlue2 transition-colors duration-300">
              <h2 className="text-lg md:text-xl font-bold mb-3 text-gray-800">{item.title || 'Untitled News'}</h2>
            </Link>
            <p className="text-gray-600 line-clamp-3 mb-4">
              {item.description ? `${DOMPurify.sanitize(item.description).substring(0, 150)}...` : 'No description available.'}
            </p>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            {item.author && (
              <span className="flex items-center">
                <FaUser className="mr-1" /> {item.author.name}
              </span>
            )}
            {item.readingTime && (
              <span className="flex items-center">
                <FaClock className="mr-1" /> {item.readingTime} min read
              </span>
            )}
          </div>
        </div>
      </article>
    );
  });

  // Animation variants for header texts
  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  // Animation settings
  const headerTransition = {
    duration: 0.8,
    ease: 'easeInOut',
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgimg})`,
      }}
    >
      <div className='md:max-w-4xl md:mx-auto flex md:flex-row flex-col md:gap-10 items-center justify-center'>
        <header className="text-center mb-16 md:w-1/2 mt-28">
          <h1 className="text-5xl md:text-5xl font-bold mb-6 text-gray-900" style={{ color: primaryBlue2 }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={headerTexts[headerIndex]}
                variants={headerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={headerTransition}
                className="block"
              >
                {headerTexts[headerIndex]}
              </motion.span>
            </AnimatePresence>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the latest in AI technology and trends.
          </p>
        </header>
        <div className='w-1/2'>
          <img src={NewsImg2} alt="News Header" className="w-full h-96 object-cover" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search news..."
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-primaryBlue2 transition duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar - Categories */}
          <aside className="lg:w-1/4">
            <div className="sticky top-16 space-y-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center" style={{ color: primaryBlue2 }}>
                  <MdCategory className="mr-2 text-2xl" /> Categories
                </h2>
                {/* All Categories Button */}
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full flex items-center p-2 mb-2 rounded-lg transition ${selectedCategory === '' ? 'bg-primaryBlue3 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <MdCategory className="mr-2" />
                  All Categories
                </button>
                {/* Dynamic Categories Buttons */}
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center p-2 mb-2 rounded-lg transition ${selectedCategory === category.name ? 'bg-primaryBlue3 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {/* Use the mapped icon or default if not found */}
                    {categoryIcons[category.name] || categoryIcons['Default']}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* News Articles */}
          <main className="lg:w-3/4">
            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} height={200} className="rounded-lg" />
                ))}
              </div>
            ) : currentNews.length === 0 ? (
              <p className="text-center text-gray-600">No news found.</p>
            ) : (
              <div className="space-y-6">
                {currentNews.map(item => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array(Math.ceil(filteredNews.length / newsPerPage)).fill().map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 rounded-full border transition ${
                    currentPage === i + 1
                      ? 'bg-primaryBlue2 text-white'
                      : 'text-primaryBlue2 border-primaryBlue2 hover:bg-primaryBlue2 hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default NewsList;
