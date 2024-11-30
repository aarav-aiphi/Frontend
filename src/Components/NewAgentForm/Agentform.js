// src/Components/CreateAgentForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import formBackground from '../../Images/whitebg.jpg'; // Adjust the path as needed
import PaymentOptions from './PaymentOption';
import Faqs from './Faqs';
import OurImpact from './OurImpact';
import OurAIAgents from './OurImpact';
import { FaPaperPlane } from 'react-icons/fa'; // Ensure you have this import if needed

const CreateAgentForm = () => {
  const [agentData, setAgentData] = useState({
    name: '',
    createdBy: '',
    websiteUrl: '',
    ownerEmail: '',
    accessModel: '',
    pricingModel: '',
    category: '',
    industry: '',
    tagline: '',
    description: '',
    keyFeatures: '',
    useCases: '',
    tags: '',
    logo: null,
    thumbnail: null,
    videoUrl: '', // Removed duplicate videoUrl
    // Removed fields: price, individualPlan, enterprisePlan, subscriptionModel, refundPolicy
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgentData({ ...agentData, [name]: value });
  };

  const handleFileChange = (e) => {
    setAgentData({ ...agentData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(agentData).forEach((key) => {
      if (agentData[key] !== null && agentData[key] !== '') { // Ensure files and non-empty fields are appended
        formData.append(key, agentData[key]);
      }
    });

    try {
      await axios.post('https://backend-1-sval.onrender.com/api/agents/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Agent created successfully!');
      // Optionally reset the form
      setAgentData({
        name: '',
        createdBy: '',
        websiteUrl: '',
        ownerEmail: '',
        accessModel: '',
        pricingModel: '',
        category: '',
        industry: '',
        tagline: '',
        description: '',
        keyFeatures: '',
        useCases: '',
        tags: '',
        logo: null,
        thumbnail: null,
        videoUrl: '', // Reset videoUrl
        // Removed fields: price, individualPlan, enterprisePlan, subscriptionModel, refundPolicy
      });
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error('Failed to create agent.');
    }
  };

  // Define categories and industries as arrays
  const categories = [
    'AI Agent Memory',
    'AI Agents Frameworks',
    'AI Agents Platform',
    'Agentic IDE',
    'Coding Agent',
    'Coding Assistant',
    'Content Creation',
    'Customer Service',
    'Data Analysis',
    'Digital Workers',
    'LLM',
    'Marketing AI Agent',
    'Observability',
    'Other',
    'Personal Assistant',
    'Productivity',
    'Research',
    'Sales AI Agent',
    'Sandboxes',
    'Tool Libraries',
    'Workflow'
  ];

  const industries = [
    'Vertical',
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'E-commerce',
    'Marketing',
    'Entertainment',
    'Manufacturing',
    'Legal',
    'Human Resources',
    'Energy & Utilities',
    'Real Estate',
    'Travel & Hospitality',
    'Agriculture',
    'Other'
  ];

  return (
    <div
      className="min-h-screen bg-center bg-cover"
      style={{
        backgroundImage: `url(${formBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // Ensures the background image is fixed
      }}
    > 
      <OurAIAgents/>
      {/* <PaymentOptions/> */}
    
      {/* Main Container with padding to prevent navbar overlap */}
      <div className="min-h-screen flex items-center justify-center overflow-auto">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl w-full mx-4 bg-gray-100 bg-opacity-50 p-8 shadow-2xl rounded-lg"
        >
          <h2 className="text-4xl font-bold text-center text-primaryBlue2 mb-8">
            Submit New AI Agent
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Basic Input Fields */}
            <div>
              <label className="block text-sm font-semibold text-primaryBlue">
                AI Agent Name *
              </label>
              <input
                type="text"
                name="name"
                value={agentData.name}
                onChange={handleChange}
                required
                className="mt-1 p-3 w-full border border-primaryBlue2 bg-white rounded-lg focus:ring-2 focus:ring-primaryBlue2"
                placeholder="Enter AI Agent name (e.g., ChatMaster)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primaryBlue">
                Created By
              </label>
              <input
                type="text"
                name="createdBy"
                value={agentData.createdBy}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-primaryBlue2 bg-white rounded-lg focus:ring-2 focus:ring-primaryBlue2"
                placeholder="Enter creator name "
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primaryBlue">
                Website URL *
              </label>
              <input
                type="text"
                name="websiteUrl"
                value={agentData.websiteUrl}
                onChange={handleChange}
                required
                className="mt-1 p-3 w-full border border-primaryBlue2 bg-white rounded-lg focus:ring-2 focus:ring-primaryBlue2"
                placeholder="Enter your website url"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primaryBlue">
                Owner Email *
              </label>
              <input
                type="email"
                name="ownerEmail"
                required
                value={agentData.ownerEmail}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-primaryBlue2 bg-white rounded-lg focus:ring-2 focus:ring-primaryBlue2"
                placeholder="Enter Business email "
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primaryBlue">
                Access Model *
              </label>
              <div className="mt-2 flex gap-4 text-primaryBlue">
                {['Open Source', 'Closed Source', 'API'].map((model) => (
                  <label key={model} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="accessModel"
                      value={model}
                      onChange={handleChange}
                      required
                      className="form-radio text-primaryBlue"
                    />
                    <span>{model}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primaryBlue">
                Pricing Model *
              </label>
              <div className="mt-2 flex gap-4 text-primaryBlue">
                {['Free', 'Freemium', 'Paid'].map((model) => (
                  <label key={model} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="pricingModel"
                      value={model}
                      onChange={handleChange}
                      required
                      className="form-radio text-primaryBlue"
                    />
                    <span>{model}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-primaryBlue">
                Category *
              </label>
              <select
                name="category"
                value={agentData.category}
                onChange={handleChange}
                required
                className="mt-1 p-3 w-full border border-primaryBlue2 bg-white rounded-lg focus:ring-2 focus:ring-primaryBlue2"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((categoryOption) => (
                  <option key={categoryOption} value={categoryOption}>
                    {categoryOption}
                  </option>
                ))}
              </select>
            </div>

            {/* Industry Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-primaryBlue">
                Industry *
              </label>
              <select
                name="industry"
                value={agentData.industry}
                onChange={handleChange}
                required
                className="mt-1 p-3 w-full border border-primaryBlue2 bg-white rounded-lg focus:ring-2 focus:ring-primaryBlue2"
              >
                <option value="" disabled>
                  Select Industry
                </option>
                {industries.map((industryOption) => (
                  <option key={industryOption} value={industryOption}>
                    {industryOption}
                  </option>
                ))}
              </select>
            </div>

            {/* Tagline - Updated to Textarea */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-primaryBlue">
                Tagline
              </label>
              <textarea
                name="tagline"
                value={agentData.tagline}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-primaryBlue2 bg-white rounded-lg focus:ring-2 focus:ring-primaryBlue2"
                placeholder="Enter a catchy tagline for your AI agent (e.g., 'AI agent for autonomous software engineering tasks')"
                rows="2"
              />
            </div>

            {/* Description - Already a Textarea, ensuring proper height */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-primaryBlue">
                Description
              </label>
              <textarea
                name="description"
                value={agentData.description}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-primaryBlue2 bg-white rounded-lg focus:ring-2 focus:ring-primaryBlue2"
                placeholder="Provide a detailed description of your AI agent, its features, and benefits."
                rows="4"
              />
            </div>

            {/* Key Features - Updated to Textarea */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-primaryBlue">
                Key Features (comma separated)
              </label>
              <textarea
                name="keyFeatures"
                value={agentData.keyFeatures}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-primaryBlue2 bg-white rounded-lg focus:ring-2 focus:ring-primaryBlue2"
                placeholder="List key features separated by commas (e.g., 'Natural Language Processing, Machine Learning, 24/7 Support')"
                rows="3"
              />
            </div>

            {/* Use Cases - Updated to Textarea */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-primaryBlue">
                Use Cases (comma separated)
              </label>
              <textarea
                name="useCases"
                value={agentData.useCases}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-primaryBlue2 bg-white rounded-lg focus:ring-2 focus:ring-primaryBlue2"
                placeholder="Describe potential use cases separated by commas (e.g., 'Customer Support, Data Analysis, Content Creation')"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primaryBlue">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={agentData.tags}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-primaryBlue2 bg-white rounded-lg focus:ring-2 focus:ring-primaryBlue2"
                placeholder="Add relevant tags separated by commas (e.g., 'AI, Automation, Chatbot')"
              />
            </div>

            {/* Added Video URL Input */}
            <div>
              <label className="block text-sm font-semibold text-primaryBlue">
                Video URL
              </label>
              <input
                type="text"
                name="videoUrl"
                value={agentData.videoUrl}
                onChange={handleChange}
                className="mt-1 p-3 w-full border border-primaryBlue2 bg-white rounded-lg focus:ring-2 focus:ring-primaryBlue2"
                placeholder="Enter video URL (e.g., YouTube, Vimeo)"
              />
            </div>

            {/* File Inputs */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-primaryBlue">
                Logo *
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  name="logo"
                  onChange={handleFileChange}
                  required
                  className="hidden"
                  id="logo-upload"
                  accept="image/*"
                />
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer bg-primaryBlue2 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700"
                >
                  Upload Logo
                </label>
                {agentData.logo && (
                  <span className="ml-4 text-sm text-gray-600">
                    {agentData.logo.name}
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-primaryBlue">
                Thumbnail Image
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  name="thumbnail"
                  onChange={handleFileChange}
                  className="hidden"
                  id="thumbnail-upload"
                  accept="image/*"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="cursor-pointer bg-primaryBlue2 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700"
                >
                  Upload Thumbnail
                </label>
                {agentData.thumbnail && (
                  <span className="ml-4 text-sm text-gray-600">
                    {agentData.thumbnail.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-14">
            <button
              type="submit"
              className="bg-gradient-to-r from-primaryBlue2 to-blue-500 hover:from-blue-700 hover:to-primaryBlue2 text-white py-3 px-8 rounded-lg shadow-xl"
            >
              Submit AI Agent
            </button>
          </div>
        </form>
      </div>
    
    </div>
  );
};

export default CreateAgentForm;