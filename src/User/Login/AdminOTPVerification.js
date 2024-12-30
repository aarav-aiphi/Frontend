// src/components/AdminOTPVerification.js

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * Props:
 *  - userId: The admin user's ID (returned by the backend upon login)
 *  - onVerified: A callback function to finalize login flow (navigate to admin dashboard, etc.)
 */
const AdminOTPVerification = ({ userId, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // POST request to /verify-otp with { userId, otp }
      const response = await axios.post(
        'https://backend-1-sval.onrender.com/api/users/verify-otp',
        { userId, otp },
        { withCredentials: true } // Ensure cookies are included
      );

      if (response.status === 200) {
        toast.success('OTP verified successfully!');
        // The backend sets or returns the JWT token. 
        // We call onVerified() to let the parent component know we're done.
        onVerified();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.response?.data?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin OTP Verification</h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter the 6-digit code sent to your email.
        </p>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">OTP Code</label>
            <input
              type="text"
              required
              pattern="\d{6}"
              title="Enter the 6-digit OTP"
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 mt-4 rounded bg-primaryBlue2 text-white font-semibold hover:bg-blue-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminOTPVerification;
