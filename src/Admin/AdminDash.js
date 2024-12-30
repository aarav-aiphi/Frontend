// src/Components/AdminDashboard.js

import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaList,
  FaTimes,
  FaEdit,
  FaUpload,
  FaTrash,
} from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import BulkUpload from './BulkUpload';

/**
 * Helper function to nicely format keys (snake_case or camelCase) to Title Case with spaces.
 */
const formatKey = (key) => {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Helper function to format values.
 * If the value is an object, we convert it to a JSON string (with indentation).
 */
const formatValue = (value) => {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  return value;
};

const AdminDashboard = () => {
  const primaryBlue2 = 'rgb(73, 125, 168)'; // Your theme color

  // ==============================
  // STATE
  // ==============================
  const [agents, setAgents] = useState({
    requested: [],
    accepted: [],
    rejected: [],
    onHold: [],
  });

  // NEW: My Requests (PendingChange) for the logged-in admin
  const [myRequests, setMyRequests] = useState([]);

  const [activeTab, setActiveTab] = useState('requested');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [instructions, setInstructions] = useState('');
  const [newsletterModalIsOpen, setNewsletterModalIsOpen] = useState(false);
  const [newsletterData, setNewsletterData] = useState({
    subject: '',
    text: '',
    html: '<h1>Welcome to Our Newsletter</h1><p>Thank you for subscribing to our newsletter.</p>',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false); // Ref to track submission status
  const [searchTerm, setSearchTerm] = useState('');

  // Edit Modal States
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [agentToEdit, setAgentToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    websiteUrl: '',
    accessModel: '',
    pricingModel: '',
    category: '',
    industry: '',
    ownerEmail: '',
    tagline: '',
    description: '',
    keyFeatures: '',
    useCases: '',
    tags: '',
    videoUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({ logo: null, thumbnail: null });

  // Bulk Upload Modal State
  const [bulkUploadModalIsOpen, setBulkUploadModalIsOpen] = useState(false);

  // ==============================
  // FETCH AGENTS
  // ==============================
  const fetchAgents = useCallback(async () => {
    try {
      const [reqRes, accRes, rejRes, onHoldRes] = await Promise.all([
        axios.get('https://backend-1-sval.onrender.com/api/admin/agents/requested', { withCredentials: true }),
        axios.get('https://backend-1-sval.onrender.com/api/admin/agents/accepted', { withCredentials: true }),
        axios.get('https://backend-1-sval.onrender.com/api/admin/agents/rejected', { withCredentials: true }),
        axios.get('https://backend-1-sval.onrender.com/api/admin/agents/onHold', { withCredentials: true }),
      ]);

      setAgents({
        requested: reqRes.data,
        accepted: accRes.data,
        rejected: rejRes.data,
        onHold: onHoldRes.data,
      });
    } catch (error) {
      toast.error('Failed to fetch agents');
      console.error('Error fetching agents:', error);
    }
  }, []);

  // ==============================
  // FETCH MY REQUESTS (PendingChange)
  // ==============================
  const fetchMyRequests = useCallback(async () => {
    try {
      const response = await axios.get('https://backend-1-sval.onrender.com/api/admin/myrequests', {
        withCredentials: true,
      });
      setMyRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch your requests.');
      console.error('Error fetching my requests:', error);
    }
  }, []);

  // ==============================
  // USEEFFECTS
  // ==============================
  // On mount, fetch all agents
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // Whenever activeTab changes, if it's "myRequests", fetch them
  useEffect(() => {
    if (activeTab === 'myRequests') {
      fetchMyRequests();
    }
  }, [activeTab, fetchMyRequests]);

  // ==============================
  // TAB HANDLER
  // ==============================
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // ==============================
  // STATUS CHANGE (OnHold, Accept, Reject)
  // ==============================
  const handleStatusChange = (agent, status) => {
    if (status === 'onHold') {
      setSelectedAgent(agent);
      setModalIsOpen(true); // Open modal for instructions
    } else {
      updateAgentStatus(agent._id, status);
    }
  };

  const updateAgentStatus = async (agentId, status, instructions = '') => {
    try {
      await axios.put(
        `https://backend-1-sval.onrender.com/api/admin/agents/${agentId}/status`,
        { status, instructions },
        { withCredentials: true }
      );
      toast.success('Status change request submitted for superadmin approval.');
      setModalIsOpen(false);
      setInstructions('');
      fetchAgents();
    } catch (error) {
      toast.error('Failed to submit status change request.');
      console.error('Error updating agent status:', error);
    }
  };

  const handleSubmitInstructions = () => {
    if (selectedAgent) {
      updateAgentStatus(selectedAgent._id, 'onHold', instructions);
    }
  };

  // ==============================
  // SEND NEWSLETTER
  // ==============================
  const handleNewsletterChange = (e) => {
    const { name, value } = e.target;
    setNewsletterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendNewsletter = useCallback(async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      await axios.post('https://backend-1-sval.onrender.com/api/newsletter/send', newsletterData, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Newsletter sent successfully!');
      setNewsletterModalIsOpen(false);
      setNewsletterData({
        subject: '',
        text: '',
        html: '<h1>Welcome to Our Newsletter</h1><p>Thank you for subscribing.</p>',
      });
    } catch (error) {
      toast.error('Failed to send newsletter.');
      console.error('Error sending newsletter:', error);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [newsletterData]);

  // ==============================
  // DELETE AGENT
  // ==============================
  const handleDeleteAgent = async (agentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this agent?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://backend-1-sval.onrender.com/api/admin/agents/${agentId}`, {
        withCredentials: true,
      });
      toast.success('Deletion request submitted for superadmin approval.');
      fetchAgents();
    } catch (error) {
      toast.error('Failed to submit deletion request.');
      console.error('Error deleting agent:', error);
    }
  };

  // ==============================
  // EDIT (UPDATE) AGENT
  // ==============================
  const openEditModal = (agent) => {
    setAgentToEdit(agent);
    setEditFormData({
      name: agent.name || '',
      websiteUrl: agent.websiteUrl || '',
      accessModel: agent.accessModel || '',
      pricingModel: agent.pricingModel || '',
      category: agent.category || '',
      industry: agent.industry || '',
      ownerEmail: agent.ownerEmail || '',
      tagline: agent.tagline || '',
      description: agent.description || '',
      keyFeatures: Array.isArray(agent.keyFeatures) ? agent.keyFeatures.join(', ') : '',
      useCases: Array.isArray(agent.useCases) ? agent.useCases.join(', ') : '',
      tags: Array.isArray(agent.tags) ? agent.tags.join(', ') : '',
      videoUrl: agent.videoUrl || ''
    });
    setSelectedFiles({ logo: null, thumbnail: null });
    setEditModalIsOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setSelectedFiles((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(true);

    try {
      const formData = new FormData();
      for (const key in editFormData) {
        if (editFormData[key] !== '') {
          formData.append(key, editFormData[key]);
        }
      }
      if (selectedFiles.logo) formData.append('logo', selectedFiles.logo);
      if (selectedFiles.thumbnail) formData.append('thumbnail', selectedFiles.thumbnail);

      await axios.put(
        `https://backend-1-sval.onrender.com/api/admin/update/${agentToEdit._id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      toast.success('Update request submitted for superadmin approval.');
      setEditModalIsOpen(false);
      setAgentToEdit(null);
      setEditFormData({
        name: '',
        websiteUrl: '',
        accessModel: '',
        pricingModel: '',
        category: '',
        industry: '',
        ownerEmail: '',
        tagline: '',
        description: '',
        keyFeatures: '',
        useCases: '',
        tags: '',
        videoUrl: ''
      });
      setSelectedFiles({ logo: null, thumbnail: null });
      fetchAgents();
    } catch (error) {
      toast.error('Failed to submit update request.');
      console.error('Error updating agent:', error);
    } finally {
      setIsEditing(false);
    }
  };

  // ==============================
  // RENDER AGENTS
  // ==============================
  const renderAgents = (category) => {
    if (!agents[category] || agents[category].length === 0) {
      return <p className="text-center text-gray-500">No agents found in this category.</p>;
    }

    const filteredAgents = agents[category].filter((agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredAgents.length === 0) {
      return <p className="text-center text-gray-500">No agents match your search.</p>;
    }

    return filteredAgents.map((agent) => (
      <motion.div
        key={agent._id}
        className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 ease-in-out"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to={`/agent/${agent._id}`}>
          <img
            src={agent.logo}
            alt={`${agent.name} logo`}
            className="h-16 w-16 mb-4 rounded-full mx-auto shadow-md"
          />
          <p className="text-xl font-semibold mb-2 text-center" style={{ color: primaryBlue2 }}>
            {agent.name}
          </p>
          <p className="text-sm text-gray-600 mb-4 text-center">{agent.shortDescription}</p>
        </Link>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleStatusChange(agent, 'accepted')}
            className="text-green-500"
            title="Accept"
          >
            <FaCheckCircle />
          </button>
          <button
            onClick={() => handleStatusChange(agent, 'rejected')}
            className="text-red-500"
            title="Reject"
          >
            <FaTimesCircle />
          </button>
          <button
            onClick={() => handleStatusChange(agent, 'onHold')}
            className="text-yellow-500"
            title="On Hold"
          >
            <FaHourglassHalf />
          </button>
          <button
            onClick={() => openEditModal(agent)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDeleteAgent(agent._id)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </motion.div>
    ));
  };

  // ==============================
  // RENDER MY REQUESTS
  // ==============================
  /**
   * Now each "myRequests" entry might look like:
   * {
   *   _id: "...",
   *   action: "status_change",
   *   collection: "agents",
   *   documentId: { ...agentDetails },
   *   newData: { status: 'accepted', ... },
   *   requestedBy: "userId" or user object,
   *   status: "pending",
   *   createdAt: "...",
   *   ...
   * }
   */
  const renderMyRequests = () => {
    if (!myRequests || myRequests.length === 0) {
      return <p className="text-center text-gray-500">No requests found.</p>;
    }

    // Filter by searchTerm
    const filteredRequests = myRequests.filter((req) => {
      const searchLower = searchTerm.toLowerCase();
      const actionMatch = req.action?.toLowerCase().includes(searchLower);
      const collectionMatch = req.collection?.toLowerCase().includes(searchLower);

      // If there's a name in either newData or documentId, we can match that as well
      const newNameMatch = req.newData?.name
        ? req.newData.name.toLowerCase().includes(searchLower)
        : false;
      const docNameMatch =
        req.documentId?.name &&
        req.documentId.name.toLowerCase().includes(searchLower);

      return actionMatch || collectionMatch || newNameMatch || docNameMatch;
    });

    if (filteredRequests.length === 0) {
      return <p className="text-center text-gray-500">No requests match your search.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map((req) => (
          <motion.div
            key={req._id}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 ease-in-out"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h3 className="text-lg font-semibold mb-2">
              Action: <span className="text-blue-600">{formatKey(req.action)}</span>
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              Collection: <span className="font-semibold">{formatKey(req.collection)}</span>
            </p>
            <p className="text-xs text-gray-500 mb-2">
              Request Status: <span className="uppercase">{req.status}</span>
            </p>

            {/* Agent Info if documentId is present */}
            {req.documentId && (
              <div className="mt-2 bg-gray-50 p-2 rounded">
                <h4 className="font-semibold text-sm mb-1">Agent Details:</h4>
                <p className="text-sm">
                  <span className="font-semibold">Name:</span>{' '}
                  {req.documentId.name || 'Unknown'}
                </p>
                <p className="text-xs text-gray-500">
                  ID: {req.documentId._id || 'N/A'}
                </p>
                {req.documentId.websiteUrl && (
                  <p className="text-sm">
                    <span className="font-semibold">Website:</span>{' '}
                    {req.documentId.websiteUrl}
                  </p>
                )}
                {/* Additional agent fields if desired */}
              </div>
            )}

            {/* New Data: This is any dynamic data the request might hold */}
            {req.newData && Object.keys(req.newData).length > 0 && (
              <div className="mt-2 bg-gray-50 p-2 rounded">
                <h4 className="font-semibold text-sm mb-1">Requested Changes:</h4>
                {Object.entries(req.newData).map(([key, value]) => (
                  <p key={key} className="text-sm">
                    <span className="font-semibold">{formatKey(key)}:</span> {formatValue(value)}
                  </p>
                ))}
              </div>
            )}

            {/* If the request is rejected, show reason */}
            {req.status === 'rejected' && req.rejectionReason && (
              <p className="text-sm mt-2 text-red-600">
                <span className="font-semibold">Rejection Reason:</span> {req.rejectionReason}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Created At: {new Date(req.createdAt).toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>
    );
  };

  // ==============================
  // HANDLE BULK UPLOAD
  // ==============================
  const handleBulkUploadSuccess = () => {
    setBulkUploadModalIsOpen(false);
    fetchAgents(); // Refresh agents list after bulk upload
  };

  // ==============================
  // RENDER COMPONENT
  // ==============================
  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Optional background motion/decoration */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      ></motion.div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <motion.div
          className="w-1/4 bg-white shadow-lg text-gray-700 p-6 space-y-6"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <h2 className="text-3xl font-bold mb-6" style={{ color: primaryBlue2 }}>
            Admin Dashboard
          </h2>
          <ul className="space-y-4">
            {/* Add "myRequests" to the tab list */}
            {['requested', 'accepted', 'rejected', 'onHold', 'myRequests'].map((tab) => (
              <li
                key={tab}
                className={`cursor-pointer text-lg hover:bg-gray-200 p-4 rounded-lg flex items-center transition-colors ${
                  activeTab === tab ? 'bg-gray-200' : ''
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab === 'requested' && <FaList className="mr-3" />}
                {tab === 'accepted' && <FaCheckCircle className="mr-3" />}
                {tab === 'rejected' && <FaTimesCircle className="mr-3" />}
                {tab === 'onHold' && <FaHourglassHalf className="mr-3" />}
                {tab === 'myRequests' && <FaList className="mr-3" />} {/* Choose any icon */}
                <span>
                  {tab === 'myRequests'
                    ? 'My Requests'
                    : `${tab.charAt(0).toUpperCase() + tab.slice(1)} Agents`}
                </span>
                {tab !== 'myRequests' && (
                  <span className="ml-auto text-sm text-gray-500">({agents[tab].length})</span>
                )}
              </li>
            ))}
            <li
              className="cursor-pointer text-lg hover:bg-gray-200 p-4 rounded-lg flex items-center transition-colors"
              onClick={() => setBulkUploadModalIsOpen(true)}
            >
              <FaUpload className="mr-3" />
              <span>Bulk Upload Agents</span>
            </li>
            <li
              className="cursor-pointer text-lg hover:bg-gray-200 p-4 rounded-lg flex items-center transition-colors"
              onClick={() => setNewsletterModalIsOpen(true)}
            >
              <FaEdit className="mr-3" />
              <span>Send Newsletter</span>
            </li>
          </ul>
        </motion.div>

        {/* Main Content */}
        <div className="w-3/4 p-8 overflow-y-auto">
          <h2 className="text-4xl font-bold text-gray-700 mb-8 capitalize">
            {activeTab === 'myRequests' ? 'My Requests' : `${activeTab} Agents`}
          </h2>

          {/* Search Input Field */}
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeTab === 'myRequests'
                  ? 'Search requests by action, agent name...'
                  : 'Search agents by name...'
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {activeTab === 'myRequests' ? (
            // Render My Requests
            renderMyRequests()
          ) : (
            // Render Agents
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderAgents(activeTab)}
            </div>
          )}
        </div>
      </div>

      {/* Modal for OnHold Instructions */}
      {modalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setModalIsOpen(false)}
          />
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 z-50 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setModalIsOpen(false)}
              aria-label="Close Modal"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: primaryBlue2 }}>
              Add Instructions for Agent Owner
            </h2>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows="5"
              className="w-full p-2 border rounded"
              placeholder="Enter instructions here..."
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setModalIsOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitInstructions}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Modal */}
      {newsletterModalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setNewsletterModalIsOpen(false)}
          />
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 z-50 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setNewsletterModalIsOpen(false)}
              aria-label="Close Modal"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: primaryBlue2 }}>
              Send Newsletter
            </h2>
            <input
              type="text"
              name="subject"
              value={newsletterData.subject}
              onChange={handleNewsletterChange}
              className="w-full p-2 border rounded mb-4"
              placeholder="Subject"
            />
            <textarea
              name="text"
              value={newsletterData.text}
              onChange={handleNewsletterChange}
              rows="3"
              className="w-full p-2 border rounded mb-4"
              placeholder="Text content"
            />
            <textarea
              name="html"
              value={newsletterData.html}
              onChange={handleNewsletterChange}
              rows="5"
              className="w-full p-2 border rounded mb-4"
              placeholder="HTML content"
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setNewsletterModalIsOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNewsletter}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      <BulkUpload
        isOpen={bulkUploadModalIsOpen}
        onClose={() => setBulkUploadModalIsOpen(false)}
        onUploadSuccess={handleBulkUploadSuccess}
      />

      {/* Edit Modal */}
      {editModalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setEditModalIsOpen(false)}
          />
          <div className="bg-white rounded-lg shadow-lg p-6 w-2/3 max-h-full overflow-y-auto z-50 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setEditModalIsOpen(false)}
              aria-label="Close Modal"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: primaryBlue2 }}>
              Edit Agent Details
            </h2>
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Input Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    required
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website URL *</label>
                  <input
                    type="url"
                    name="websiteUrl"
                    value={editFormData.websiteUrl}
                    onChange={handleEditFormChange}
                    required
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Access Model *</label>
                  <select
                    name="accessModel"
                    value={editFormData.accessModel}
                    onChange={handleEditFormChange}
                    required
                    className="mt-1 p-2 w-full border rounded"
                  >
                    <option value="">Select Access Model</option>
                    <option value="Open Source">Open Source</option>
                    <option value="Closed Source">Closed Source</option>
                    <option value="API">API</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pricing Model *</label>
                  <select
                    name="pricingModel"
                    value={editFormData.pricingModel}
                    onChange={handleEditFormChange}
                    required
                    className="mt-1 p-2 w-full border rounded"
                  >
                    <option value="">Select Pricing Model</option>
                    <option value="Free">Free</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditFormChange}
                    required
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry *</label>
                  <input
                    type="text"
                    name="industry"
                    value={editFormData.industry}
                    onChange={handleEditFormChange}
                    required
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>
               
                <div>
                  <label className="block text-sm font-medium text-gray-700">Owner Email *</label>
                  <input
                    type="email"
                    name="ownerEmail"
                    value={editFormData.ownerEmail}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border rounded"
                  />
                </div>

                {/* Additional Fields */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Tagline</label>
                  <input
                    type="text"
                    name="tagline"
                    value={editFormData.tagline}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border rounded"
                    placeholder="Enter tagline"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditFormChange}
                    rows="3"
                    className="mt-1 p-2 w-full border rounded"
                    placeholder="Enter description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Key Features (comma separated)
                  </label>
                  <input
                    type="text"
                    name="keyFeatures"
                    value={editFormData.keyFeatures}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border rounded"
                    placeholder="Feature1, Feature2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Use Cases (comma separated)
                  </label>
                  <input
                    type="text"
                    name="useCases"
                    value={editFormData.useCases}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border rounded"
                    placeholder="UseCase1, UseCase2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={editFormData.tags}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border rounded"
                    placeholder="Tag1, Tag2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Video URL</label>
                  <input
                    type="text"
                    name="videoUrl"
                    value={editFormData.videoUrl}
                    onChange={handleEditFormChange}
                    className="mt-1 p-2 w-full border rounded"
                    placeholder="e.g., YouTube link"
                  />
                </div>
              

                {/* File Inputs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      name="logo"
                      onChange={handleFileChange}
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
                    {agentToEdit?.logo && (
                      <img
                        src={agentToEdit.logo}
                        alt="Current Logo"
                        className="ml-4 h-16 w-16 object-contain"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
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
                    {agentToEdit?.thumbnail && (
                      <img
                        src={agentToEdit.thumbnail}
                        alt="Current Thumbnail"
                        className="ml-4 h-16 w-16 object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditModalIsOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-blue-600 text-white font-bold py-2 px-4 rounded ${
                    isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                  disabled={isEditing}
                >
                  {isEditing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { AdminDashboard };
