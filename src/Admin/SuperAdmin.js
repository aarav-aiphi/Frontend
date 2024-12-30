// src/Components/SuperAdminDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
  FaSearch,
  FaHourglassHalf,
} from 'react-icons/fa';

/**
 * Helper function to format keys into Title Case with spaces.
 * E.g., "status_change" => "Status Change"
 */
const formatKey = (key) => {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Helper function to format values.
 * If the value is an object, stringify it; otherwise, return as is.
 */
const formatValue = (value) => {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  return value;
};

const SuperAdminDashboard = () => {
  const [pendingChanges, setPendingChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states for rejection
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [changeToReject, setChangeToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // ==============================
  // FETCH PENDING CHANGES
  // ==============================
  const fetchPendingChanges = async () => {
    setLoading(true);
    setError('');

    try {
      // GET /api/superadmin/pending-changes
      const response = await axios.get('https://backend-1-sval.onrender.com/api/superadmin/pending-changes', {
        withCredentials: true, // if using cookie-based auth
      });
      setPendingChanges(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pending changes:', err);
      setError(err.response?.data?.message || 'Failed to fetch pending changes.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingChanges();
  }, []);

  // ==============================
  // APPROVE CHANGE
  // ==============================
  const handleApprove = async (changeId) => {
    if (!window.confirm('Are you sure you want to approve this change?')) return;

    try {
      // POST /api/superadmin/approve/:changeId
      const response = await axios.post(
        `https://backend-1-sval.onrender.com/api/superadmin/approve/${changeId}`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message || 'Change approved successfully!');
      // Remove from local state
      setPendingChanges((prev) => prev.filter((item) => item._id !== changeId));
    } catch (err) {
      console.error('Error approving change:', err);
      toast.error(err.response?.data?.message || 'Failed to approve change.');
    }
  };

  // ==============================
  // OPEN REJECTION MODAL
  // ==============================
  const openRejectModal = (change) => {
    setChangeToReject(change);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  // ==============================
  // REJECT CHANGE
  // ==============================
  const handleReject = async () => {
    if (!changeToReject) return;

    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason.');
      return;
    }

    try {
      // POST /api/superadmin/reject/:changeId
      const response = await axios.post(
        `https://backend-1-sval.onrender.com/api/superadmin/reject/${changeToReject._id}`,
        { reason: rejectionReason },
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message || 'Change rejected successfully!');
      // Remove from local state
      setPendingChanges((prev) =>
        prev.filter((item) => item._id !== changeToReject._id)
      );
    } catch (err) {
      console.error('Error rejecting change:', err);
      toast.error(err.response?.data?.message || 'Failed to reject change.');
    } finally {
      setRejectModalOpen(false);
      setChangeToReject(null);
      setRejectionReason('');
    }
  };

  // ==============================
  // RENDER PENDING CHANGES
  // ==============================
  const renderPendingChanges = () => {
    if (loading) {
      return <p>Loading pending changes...</p>;
    }
    if (error) {
      return <p className="text-red-600">{error}</p>;
    }
    if (!pendingChanges.length) {
      return <p className="text-gray-500">No pending changes.</p>;
    }

    // Filter by search term (action, collection, or agent name if available)
    const filtered = pendingChanges.filter((change) => {
      const searchLower = searchTerm.toLowerCase();
      const actionMatch = change.action?.toLowerCase().includes(searchLower);
      const collectionMatch = change.collection?.toLowerCase().includes(searchLower);

      // If the agent name is stored in either newData or documentId
      let agentNameMatch = false;
      if (change.newData?.name) {
        agentNameMatch = change.newData.name.toLowerCase().includes(searchLower);
      }
      if (change.documentId?.name) {
        agentNameMatch =
          agentNameMatch ||
          change.documentId.name.toLowerCase().includes(searchLower);
      }

      return actionMatch || collectionMatch || agentNameMatch;
    });

    if (!filtered.length) {
      return <p className="text-gray-500 mt-4">No changes match your search.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((change) => (
          <motion.div
            key={change._id}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-500 ease-in-out"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Action and Collection */}
            <h3 className="text-lg font-semibold mb-2">
              Action: <span className="text-blue-600">{formatKey(change.action)}</span>
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              Collection: <span className="font-semibold">{formatKey(change.collection)}</span>
            </p>
            <p className="text-xs text-gray-500 mb-2">
              Status: <span className="uppercase">{change.status}</span>
            </p>

            {/* If documentId is an agent, show agent details in a sub-card */}
            {change.documentId && (
              <div className="mt-2 bg-gray-50 p-2 rounded shadow-sm">
                <h4 className="font-semibold text-sm mb-1">Agent Details:</h4>
                {/* Agent Logo */}
                {change.documentId.logo && (
                  <div className="flex items-center mb-2">
                    <img
                      src={change.documentId.logo}
                      alt="Agent Logo"
                      className="h-12 w-12 object-contain rounded shadow-md mr-2"
                    />
                    <div>
                      <p className="text-sm font-semibold text-blue-700">
                        {change.documentId.name || 'No Name'}
                      </p>
                    </div>
                  </div>
                )}
                {/* Additional agent fields */}
                {change.documentId.websiteUrl && (
                  <p className="text-sm">
                    <span className="font-semibold">Website:</span> {change.documentId.websiteUrl}
                  </p>
                )}
                {change.documentId.ownerEmail && (
                  <p className="text-sm">
                    <span className="font-semibold">Owner Email:</span> {change.documentId.ownerEmail}
                  </p>
                )}
                {change.documentId.industry && (
                  <p className="text-sm">
                    <span className="font-semibold">Industry:</span> {change.documentId.industry}
                  </p>
                )}
              </div>
            )}

            {/* Render all key-value pairs in newData if present */}
            {change.newData && Object.keys(change.newData).length > 0 && (
              <div className="mt-2 bg-gray-50 p-2 rounded shadow-sm">
                <h4 className="font-semibold text-sm mb-1">New Data:</h4>
                {Object.entries(change.newData).map(([key, value]) => (
                  <p key={key} className="text-sm">
                    <span className="font-semibold">{formatKey(key)}:</span> {formatValue(value)}
                  </p>
                ))}
              </div>
            )}

            {/* If the change was previously rejected, show reason */}
            {change.rejectionReason && (
              <p className="text-sm mt-2 text-red-600">
                <span className="font-semibold">Rejection Reason:</span> {change.rejectionReason}
              </p>
            )}

            {/* Requested By */}
            <p className="text-xs text-gray-400 mt-2">
              Requested By: {change.requestedBy?.username || 'N/A'} ({change.requestedBy?.email || 'N/A'})
            </p>

            {/* Approve / Reject Buttons */}
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => handleApprove(change._id)}
                className="text-green-600 hover:text-green-800"
                title="Approve"
              >
                <FaCheckCircle size={20} />
              </button>
              <button
                onClick={() => openRejectModal(change)}
                className="text-red-600 hover:text-red-800"
                title="Reject"
              >
                <FaTimesCircle size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Background or overlay if desired */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Possibly a subtle background pattern or color */}
      </motion.div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <motion.div
          className="w-1/4 bg-white shadow-lg text-gray-700 p-6 space-y-6"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <h2 className="text-3xl font-bold mb-6 text-blue-800">SuperAdmin Dashboard</h2>
          <ul className="space-y-4">
            {/*
              If you want future expansions (e.g., Approved Changes, Rejected Changes),
              you can add more <li> items here to handle different tabs
            */}
            <li className="bg-gray-200 cursor-pointer text-lg p-4 rounded-lg flex items-center transition-colors">
              <FaHourglassHalf className="mr-3 text-yellow-500" />
              <span>Pending Changes</span>
              <span className="ml-auto text-sm text-gray-500">({pendingChanges.length})</span>
            </li>
          </ul>
        </motion.div>

        {/* Main Content */}
        <div className="w-3/4 p-8 overflow-y-auto">
          <h2 className="text-4xl font-bold text-gray-700 mb-8">Pending Changes</h2>

          {/* Search Input Field */}
          <div className="mb-4 flex items-center space-x-2">
            <FaSearch />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search changes by action, collection, or agent name..."
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Error/Loading */}
          {loading && <p>Loading pending changes...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {/* Render pending changes */}
          {!loading && !error && renderPendingChanges()}
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {rejectModalOpen && changeToReject && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setRejectModalOpen(false)}
          ></div>
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 z-50 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setRejectModalOpen(false)}
              aria-label="Close Modal"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-red-600">
              Reject Change Request
            </h2>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows="4"
              className="w-full p-2 border rounded"
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
