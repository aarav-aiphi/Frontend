// BulkUpload.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

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
              'Content-Type': 'application/json'
               // Adjust based on your auth setup
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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="bg-white rounded-lg shadow-lg p-6 z-50 w-1/3 relative">
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

        <div>
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
      className="cursor-pointer bg-primaryBlue2 text-white py-2 px-6 rounded-lg shadow-md transition hover:shadow-lg hover:bg-gradient-to-l"
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
          className={`w-full p-2  mt-6 rounded ${
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
