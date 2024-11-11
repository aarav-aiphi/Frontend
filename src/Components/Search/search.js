// Search.js
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from 'axios';
import { FaFilter, FaChevronDown, FaChevronUp, FaCheckCircle, FaTimes } from "react-icons/fa";

// Define default filter values as a constant to ensure consistency
const DEFAULT_FILTERS = {
  accessModel: "Model",
  pricingModel: "Pricing",
  category: "Category",
  industry: "Industry",
};

const Search = ({ setModel, setPrice, setCategory, setIndustry, isCardSectionInView }) => {
  const [isSticky, setIsSticky] = useState(false);
  const filterRef = useRef(null);
  const placeholderRef = useRef(null);

  // State for filter options
  const [filterOptions, setFilterOptions] = useState({
    accessModels: [],
    pricingModels: [],
    categories: [],
    industries: [],
  });

  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // State to manage which dropdown is open
  const [openDropdown, setOpenDropdown] = useState({
    accessModel: false,
    pricingModel: false,
    category: false,
    industry: false,
  });

  // Selected values initialized with default filters
  const [selected, setSelected] = useState({ ...DEFAULT_FILTERS });

  // Animation variants for filter elements
  const filterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.02, transition: { type: "spring", stiffness: 300 } },
  };

  // Fetch filter options from backend
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/agents/filters');
        console.log('API Response:', response.data); // Debugging line
        setFilterOptions({
          accessModels: response.data.accessModels || [],
          pricingModels: response.data.pricingModels || [],
          categories: response.data.categories || [],
          industries: response.data.industries || [],
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching filter options:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Log selected.accessModel changes
  useEffect(() => {
    console.log('Selected Access Model:', selected.accessModel);
  }, [selected.accessModel]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (filterRef.current && placeholderRef.current) {
            const filterTop = placeholderRef.current.getBoundingClientRect().top;
            if (filterTop <= 70 && isCardSectionInView) {
              if (!isSticky) {
                setIsSticky(true);
                // Set the placeholder height to prevent layout shift
                placeholderRef.current.style.height = `${filterRef.current.offsetHeight}px`;
              }
            } else {
              if (isSticky) {
                setIsSticky(false);
                // Reset the placeholder height
                placeholderRef.current.style.height = '0px';
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCardSectionInView, isSticky]);

  // Handle selection of an option
  const handleSelect = (filterType, value) => {
    console.log(`Selecting ${filterType}: ${value}`); // Debugging line
    setSelected(prev => ({
      ...prev,
      [filterType]: value
    }));
    onFilterChange(filterType, value);
    setOpenDropdown(prev => ({
      ...prev,
      [filterType]: false
    }));
  };

  // Handle filter changes
  const onFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'accessModel':
        setModel(value);
        break;
      case 'pricingModel':
        setPrice(value);
        break;
      case 'category':
        setCategory(value);
        break;
      case 'industry':
        setIndustry(value);
        break;
      default:
        break;
    }
  };

  // Reset individual filter to default
  const resetFilter = (filterType) => {
    console.log(`Resetting filter: ${filterType}`); // Debugging line

    setSelected(prev => ({
      ...prev,
      [filterType]: DEFAULT_FILTERS[filterType] // Use DEFAULT_FILTERS for consistency
    }));
    onFilterChange(filterType, DEFAULT_FILTERS[filterType]);

    // Optional: Close the dropdown after resetting
    setOpenDropdown(prev => ({
      ...prev,
      [filterType]: false
    }));
  };

  // Toggle dropdown visibility
  const toggleDropdown = (filterType) => {
    setOpenDropdown(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenDropdown({
          accessModel: false,
          pricingModel: false,
          category: false,
          industry: false,
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <p className="text-gray-500">Loading filters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-4">
        <p className="text-red-500">Failed to load filters.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Placeholder to maintain layout when fixed */}
      <div ref={placeholderRef}></div>
      <div
        ref={filterRef}
        className={`transition-all duration-300 w-full z-40 ${
          isSticky && isCardSectionInView
            ? "fixed top-[70px] left-0 right-0 shadow-lg bg-white"
            : "relative bg-white"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3">
          <motion.div
            className="w-full"
            variants={filterVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Access Model Dropdown */}
              <div className="relative w-full md:w-1/4">
                <button
                  onClick={() => toggleDropdown('accessModel')}
                  className="w-full text-gray-700 text-base border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:bg-indigo-50 transition-colors duration-200 flex items-center justify-center space-x-2 relative"
                  aria-haspopup="true"
                  aria-expanded={openDropdown.accessModel}
                >
                  <span className="text-center">{selected.accessModel}</span>
                  <div className="flex items-center space-x-1">
                    {openDropdown.accessModel ? <FaChevronUp /> : <FaChevronDown />}
                    {selected.accessModel !== DEFAULT_FILTERS.accessModel && (
                      <FaTimes
                        className="text-gray-500 hover:text-indigo-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering dropdown toggle
                          resetFilter('accessModel');
                        }}
                        aria-label="Clear Access Model Filter"
                      />
                    )}
                  </div>
                </button>
                {openDropdown.accessModel && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
                  >
                    {filterOptions.accessModels.length === 0 ? (
                      <li className="px-4 py-3 text-gray-500">No Access Models Available</li>
                    ) : (
                      filterOptions.accessModels.map((model) => (
                        <li
                          key={model}
                          onClick={() => handleSelect('accessModel', model)}
                          className={`flex items-center px-4 py-3 cursor-pointer hover:bg-indigo-100 ${
                            selected.accessModel === model ? 'bg-indigo-100' : ''
                          }`}
                        >
                          <FaCheckCircle className="text-indigo-500 mr-2" />
                          <span className="text-center w-full">{model}</span>
                        </li>
                      ))
                    )}
                  </motion.ul>
                )}
              </div>

              {/* Pricing Dropdown */}
              <div className="relative w-full md:w-1/4">
                <button
                  onClick={() => toggleDropdown('pricingModel')}
                  className="w-full text-gray-700 text-base border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:bg-indigo-50 transition-colors duration-200 flex items-center justify-center space-x-2 relative"
                  aria-haspopup="true"
                  aria-expanded={openDropdown.pricingModel}
                >
                  <span className="text-center">{selected.pricingModel}</span>
                  <div className="flex items-center space-x-1">
                    {openDropdown.pricingModel ? <FaChevronUp /> : <FaChevronDown />}
                    {selected.pricingModel !== DEFAULT_FILTERS.pricingModel && (
                      <FaTimes
                        className="text-gray-500 hover:text-indigo-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering dropdown toggle
                          resetFilter('pricingModel');
                        }}
                        aria-label="Clear Pricing Model Filter"
                      />
                    )}
                  </div>
                </button>
                {openDropdown.pricingModel && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
                  >
                    {filterOptions.pricingModels.length === 0 ? (
                      <li className="px-4 py-3 text-gray-500">No Pricing Models Available</li>
                    ) : (
                      filterOptions.pricingModels.map((price) => (
                        <li
                          key={price}
                          onClick={() => handleSelect('pricingModel', price)}
                          className={`flex items-center px-4 py-3 cursor-pointer hover:bg-indigo-100 ${
                            selected.pricingModel === price ? 'bg-indigo-100' : ''
                          }`}
                        >
                          <FaCheckCircle className="text-indigo-500 mr-2" />
                          <span className="text-center w-full">{price}</span>
                        </li>
                      ))
                    )}
                  </motion.ul>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="relative w-full md:w-1/4">
                <button
                  onClick={() => toggleDropdown('category')}
                  className="w-full text-gray-700 text-base border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:bg-indigo-50 transition-colors duration-200 flex items-center justify-center space-x-2 relative"
                  aria-haspopup="true"
                  aria-expanded={openDropdown.category}
                >
                  <span className="text-center">{selected.category}</span>
                  <div className="flex items-center space-x-1">
                    {openDropdown.category ? <FaChevronUp /> : <FaChevronDown />}
                    {selected.category !== DEFAULT_FILTERS.category && (
                      <FaTimes
                        className="text-gray-500 hover:text-indigo-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering dropdown toggle
                          resetFilter('category');
                        }}
                        aria-label="Clear Category Filter"
                      />
                    )}
                  </div>
                </button>
                {openDropdown.category && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
                  >
                    {filterOptions.categories.length === 0 ? (
                      <li className="px-4 py-3 text-gray-500">No Categories Available</li>
                    ) : (
                      filterOptions.categories.map((cat) => (
                        <li
                          key={cat}
                          onClick={() => handleSelect('category', cat)}
                          className={`flex items-center px-4 py-3 cursor-pointer hover:bg-indigo-100 ${
                            selected.category === cat ? 'bg-indigo-100' : ''
                          }`}
                        >
                          <FaCheckCircle className="text-indigo-500 mr-2" />
                          <span className="text-center w-full">{cat}</span>
                        </li>
                      ))
                    )}
                  </motion.ul>
                )}
              </div>

              {/* Industry Dropdown */}
              <div className="relative w-full md:w-1/4">
                <button
                  onClick={() => toggleDropdown('industry')}
                  className="w-full text-gray-700 text-base border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:bg-indigo-50 transition-colors duration-200 flex items-center justify-center space-x-2 relative"
                  aria-haspopup="true"
                  aria-expanded={openDropdown.industry}
                >
                  <span className="text-center">{selected.industry}</span>
                  <div className="flex items-center space-x-1">
                    {openDropdown.industry ? <FaChevronUp /> : <FaChevronDown />}
                    {selected.industry !== DEFAULT_FILTERS.industry && (
                      <FaTimes
                        className="text-gray-500 hover:text-indigo-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering dropdown toggle
                          resetFilter('industry');
                        }}
                        aria-label="Clear Industry Filter"
                      />
                    )}
                  </div>
                </button>
                {openDropdown.industry && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
                  >
                    {filterOptions.industries.length === 0 ? (
                      <li className="px-4 py-3 text-gray-500">No Industries Available</li>
                    ) : (
                      filterOptions.industries.map((ind) => (
                        <li
                          key={ind}
                          onClick={() => handleSelect('industry', ind)}
                          className={`flex items-center px-4 py-3 cursor-pointer hover:bg-indigo-100 ${
                            selected.industry === ind ? 'bg-indigo-100' : ''
                          }`}
                        >
                          <FaCheckCircle className="text-indigo-500 mr-2" />
                          <span className="text-center w-full">{ind}</span>
                        </li>
                      ))
                    )}
                  </motion.ul>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Search;
