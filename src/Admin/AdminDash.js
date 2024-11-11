import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaList, FaTimes, FaEdit } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css'; // Ensure react-toastify styles are imported
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const primaryBlue2 = 'rgb(73, 125, 168)'; // Define your theme color

  const [agents, setAgents] = useState({
    requested: [],
    accepted: [],
    rejected: [],
    onHold: [],
  });
  const [activeTab, setActiveTab] = useState('requested');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [instructions, setInstructions] = useState('');
  const [newsletterModalIsOpen, setNewsletterModalIsOpen] = useState(false);
  const [newsletterData, setNewsletterData] = useState({
    subject: '',
    text: '',
    html: '<h1>Welcome to Our Newsletter</h1><p>Thank you for subscribing to our newsletter. Stay tuned for updates!</p><img src="https://example.com/image.jpg" alt="Newsletter Image" />',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false); // Ref to track submission status

  const token = Cookies.get('token');

  // Fetch Agents function to be called on mount and after status updates
  const fetchAgents = useCallback(async () => {
    try {
      const response = await Promise.all([
        axios.get('http://localhost:5000/api/admin/agents/requested', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
        axios.get('http://localhost:5000/api/admin/agents/accepted', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
        axios.get('http://localhost:5000/api/admin/agents/rejected', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
        axios.get('http://localhost:5000/api/admin/agents/onHold', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
      ]);

      setAgents({
        requested: response[0].data,
        accepted: response[1].data,
        rejected: response[2].data,
        onHold: response[3].data,
      });
    } catch (error) {
      toast.error('Failed to fetch agents');
      console.error('Error fetching agents:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchAgents(); // Fetch agents on component mount
  }, [fetchAgents]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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
        `http://localhost:5000/api/admin/agents/${agentId}/status`,
        { status, instructions },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      toast.success(`Agent status updated to ${status}`);
      setModalIsOpen(false);
      setInstructions('');
      fetchAgents(); // Refresh the list after updating status
    } catch (error) {
      toast.error('Failed to update agent status');
      console.error('Error updating agent status:', error);
    }
  };

  const handleSubmitInstructions = () => {
    if (selectedAgent) {
      updateAgentStatus(selectedAgent._id, 'onHold', instructions);
    }
  };

  const handleNewsletterChange = (e) => {
    const { name, value } = e.target;
    setNewsletterData({ ...newsletterData, [name]: value });
  };

  const handleSendNewsletter = useCallback(async () => {
    if (isSubmittingRef.current) return; // Prevent multiple submissions
    isSubmittingRef.current = true; // Set the ref to true immediately
    setIsSubmitting(true); // Update the state to disable the button

    try {
      await axios.post('http://localhost:5000/api/newsletter/send', newsletterData, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      toast.success('Newsletter sent successfully!');
      setNewsletterModalIsOpen(false);
      setNewsletterData({
        subject: '',
        text: '',
        html: '<h1>Welcome to Our Newsletter</h1><p>Thank you for subscribing to our newsletter. Stay tuned for updates!</p><img src="https://example.com/image.jpg" alt="Newsletter Image" />',
      });
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast.error('Failed to send newsletter.');
    } finally {
      isSubmittingRef.current = false; // Reset the ref
      setIsSubmitting(false); // Re-enable the button
    }
  }, [newsletterData, token]);

  const renderAgents = (category) => {
    if (!agents[category] || agents[category].length === 0) {
      return <p className="text-center text-gray-500">No agents found in this category.</p>;
    }

    return agents[category].map((agent) => (
      <motion.div
        key={agent._id}
        className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 ease-in-out"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to={`/agent/${agent._id}`}>
        <img src={agent.logo} alt={`${agent.name} logo`} className="h-16 w-16 mb-4 rounded-full mx-auto shadow-md" />
        <p className="text-xl font-semibold mb-2 text-center" style={{ color: primaryBlue2 }}>{agent.name}</p>
        <p className="text-sm text-gray-600 mb-4 text-center">{agent.shortDescription}</p>
        </Link>
        <div className="flex justify-center space-x-4">
          <button onClick={() => handleStatusChange(agent, 'accepted')} className="text-green-500" title="Accept">
            <FaCheckCircle />
          </button>
          <button onClick={() => handleStatusChange(agent, 'rejected')} className="text-red-500" title="Reject">
            <FaTimesCircle />
          </button>
          <button onClick={() => handleStatusChange(agent, 'onHold')} className="text-yellow-500" title="On Hold">
            <FaHourglassHalf />
          </button>
          {activeTab === 'onHold' && (
            <button onClick={() => handleStatusChange(agent, 'onHold')} className="text-yellow-500" title="Edit">
              <FaEdit />
            </button>
          )}
        </div>
      </motion.div>
    ));
  };

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      <motion.div className="absolute inset-0 z-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
      </motion.div>

      <div className="relative z-10 flex h-screen">
        <motion.div
          className="w-1/4 bg-white shadow-lg text-gray-700 p-6 space-y-6"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <h2 className="text-3xl font-bold mb-6" style={{ color: primaryBlue2 }}>Admin Dashboard</h2>
          <ul className="space-y-4">
            {['requested', 'accepted', 'rejected', 'onHold'].map((tab) => (
              <li
                key={tab}
                className={`cursor-pointer text-lg hover:bg-gray-200 p-4 rounded-lg flex items-center transition-colors ${activeTab === tab ? 'bg-gray-200' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab === 'requested' && <FaList className="mr-3" />}
                {tab === 'accepted' && <FaCheckCircle className="mr-3" />}
                {tab === 'rejected' && <FaTimesCircle className="mr-3" />}
                {tab === 'onHold' && <FaHourglassHalf className="mr-3" />}
                <span>{`${tab.charAt(0).toUpperCase() + tab.slice(1)} Agents`}</span>
                <span className="ml-auto text-sm text-gray-500">
                  ({agents[tab].length})
                </span>
              </li>
            ))}
            <li
              className="cursor-pointer text-lg hover:bg-gray-200 p-4 rounded-lg flex items-center transition-colors"
              onClick={() => setNewsletterModalIsOpen(true)}
            >
              <FaEdit className="mr-3" />
              Send Newsletter
            </li>
          </ul>
        </motion.div>

        <div className="w-3/4 p-8 overflow-y-auto">
          <h2 className="text-4xl font-bold text-gray-700 mb-8 capitalize">{activeTab} Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{renderAgents(activeTab)}</div>
        </div>
      </div>

      {/* Custom Modal for Instructions */}
      {modalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setModalIsOpen(false)}></div>
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 z-50 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setModalIsOpen(false)}
              aria-label="Close Modal"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: primaryBlue2 }}>Add Instructions for Agent Owner</h2>
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
                className="bg-primaryBlue2 text-white font-bold py-2 px-4 rounded"
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
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setNewsletterModalIsOpen(false)}></div>
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 z-50 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setNewsletterModalIsOpen(false)}
              aria-label="Close Modal"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: primaryBlue2 }}>Send Newsletter</h2>
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
                className="bg-primaryBlue2 text-white font-bold py-2 px-4 rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
