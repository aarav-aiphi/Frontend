// src/Components/BulkUpload.js

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import SampleCSVDisplay from '../Components/SampleCSVDisplay';

const BulkUpload = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setErrors([]);
    } else {
      setFile(null);
      setErrors(['Please select a valid CSV file.']);
      toast.error('Please select a valid CSV file.');
    }
  };

  // Handle file upload
  const handleUpload = () => {
    if (!file) {
      toast.error('Please select a CSV file to upload.');
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      const csvData = event.target.result;

      try {
        setUploading(true);
        const res = await axios.post(
          'https://backend-1-sval.onrender.com/api/admin/bulk-upload-csv', // Ensure this URL matches your backend route
          { csv: csvData }, // Send CSV data as JSON with 'csv' field
          {
            headers: {
              'Content-Type': 'application/json',
              // Include authentication headers if required
            },
            withCredentials: true,
          }
        );

        toast.success(res.data.message);

        if (res.data.failed && res.data.failed.length > 0) {
          setErrors(res.data.failed);
        } else {
          setErrors([]);
        }

        onUploadSuccess(); // Callback to refresh agents list or perform other actions
        setFile(null); // Reset file input
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An unexpected error occurred during upload.');
        }
        console.error('Bulk upload error:', error);
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read the file.');
      setUploading(false);
    };

    reader.readAsText(file); // Read the file as text
  };

  if (!isOpen) return null; // Don't render the modal if not open

  // Agent Schema Information (for display)
  const agentSchemaInfo = [
    { field: 'name', required: true, type: 'String (max 35 characters)', constraints: 'Unique' },
    { field: 'createdBy', required: false, type: 'String (max 50 characters)', constraints: '' },
    { field: 'websiteUrl', required: true, type: 'String (max 100 characters)', constraints: '' },
    { field: 'contactEmail', required: false, type: 'String (max 50 characters)', constraints: '' },
    { field: 'accessModel', required: true, type: 'String', constraints: 'Options: Open Source, Closed Source, API' },
    { field: 'pricingModel', required: true, type: 'String', constraints: 'Options: Free, Freemium, Paid' },
    { field: 'category', required: true, type: 'String', constraints: '' },
    { field: 'industry', required: true, type: 'String', constraints: '' },
    { field: 'tagline', required: false, type: 'String', constraints: '' },
    { field: 'description', required: false, type: 'String', constraints: '' },
    { field: 'shortDescription', required: false, type: 'String', constraints: '' },
    { field: 'keyFeatures', required: false, type: 'List of Strings', constraints: '' },
    { field: 'useCases', required: false, type: 'List of Strings', constraints: '' },
    { field: 'useRole', required: false, type: 'String', constraints: '' },
    { field: 'tags', required: false, type: 'List of Strings', constraints: '' },
    { field: 'logo', required: false, type: 'String (URL)', constraints: '' },
    { field: 'thumbnail', required: false, type: 'String (URL)', constraints: '' },
    { field: 'videoUrl', required: false, type: 'String (URL)', constraints: '' },
    { field: 'likes', required: false, type: 'Number', constraints: 'Default: 0' },
    { field: 'triedBy', required: false, type: 'Number', constraints: 'Default: 0' },
    { field: 'reviewRatings', required: false, type: 'Number', constraints: 'Default: 0' },
    { field: 'votesThisMonth', required: false, type: 'Number', constraints: 'Default: 0' },
    { field: 'integrationSupport', required: false, type: 'String', constraints: 'Default: None' },
    { field: 'gallery', required: false, type: 'List of Strings (URLs)', constraints: '' },
    { field: 'freeTrial', required: false, type: 'Boolean', constraints: 'Default: false' },
    { field: 'subscriptionModel', required: false, type: 'String', constraints: '' },
    { field: 'status', required: false, type: 'String', constraints: 'Options: requested, accepted, rejected, onHold. Default: requested' },
    { field: 'savedByCount', required: false, type: 'Number', constraints: 'Default: 0' },
    { field: 'ownerEmail', required: false, type: 'String', constraints: '' },
    { field: 'version', required: false, type: 'Number', constraints: 'Default: 0' },
    { field: 'featured', required: false, type: 'Boolean', constraints: 'Default: false' },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="bg-white rounded-lg shadow-lg p-6 z-50 w-3/4 max-w-4xl relative overflow-y-auto max-h-screen">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close Modal"
        >
          <FaTimes />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-semibold mb-4">Bulk Upload Agents</h2>

        {/* Schema Information */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Agent Schema Information</h3>
          <p className="text-gray-600 mb-4">
            Please ensure your CSV file includes the following columns with the correct data types and constraints.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Field</th>
                  <th className="px-4 py-2 border-b">Required</th>
                  <th className="px-4 py-2 border-b">Type</th>
                  <th className="px-4 py-2 border-b">Constraints</th>
                </tr>
              </thead>
              <tbody>
                {agentSchemaInfo.map((fieldInfo, index) => (
                  <tr key={index} className="text-sm text-gray-700">
                    <td className="px-4 py-2 border-b font-medium">{fieldInfo.field}</td>
                    <td className="px-4 py-2 border-b text-center">
                      {fieldInfo.required ? (
                        <span className="text-red-500 font-semibold">Yes</span>
                      ) : (
                        'No'
                      )}
                    </td>
                    <td className="px-4 py-2 border-b">{fieldInfo.type}</td>
                    <td className="px-4 py-2 border-b">{fieldInfo.constraints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* **Insert SampleCSVDisplay Here** */}
        <SampleCSVDisplay />

        {/* File Upload Section */}
        <div className="mt-6">
          {/* Label for the input */}
          <label className="block text-sm font-semibold text-gray-700 mb-2">Upload CSV File</label>

          <div className="mt-1 flex items-center">
            {/* Hidden File Input */}
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />

            {/* Styled Label Acting as the Button */}
            <label
              htmlFor="csv-upload"
              className="cursor-pointer bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md transition hover:shadow-lg hover:bg-blue-700"
            >
              Choose File
            </label>

            {/* File Name Display */}
            {file && (
              <span className="ml-4 text-sm text-gray-600 truncate max-w-xs">
                {file.name}
              </span>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full p-2 mt-6 rounded ${
            uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Errors:</h3>
            <ul className="list-disc list-inside text-red-500 max-h-40 overflow-y-auto">
              {errors.map((err, index) => (
                <li key={index}>
                  Row {err.row}: {err.reason || err.error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUpload;
