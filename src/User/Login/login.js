// src/components/Login.js

import React, { useState, useContext } from 'react';
import { FaGoogle } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginImage from '../../Images/login.jpg.jpg'; // your background image
import { AuthContext } from '../../context/AuthContext';

// The newly created OTP component
import AdminOTPVerification from './AdminOTPVerification';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // This stores userId if admin OTP is required
  const [adminUserId, setAdminUserId] = useState(null);

  const navigate = useNavigate();
  const { fetchCurrentUser } = useContext(AuthContext);

  // Google login redirect
  const handleGoogleLogin = () => {
    window.location.href = 'https://backend-1-sval.onrender.com/api/users/auth/google';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'https://backend-1-sval.onrender.com/api/users/login',
        { email, password },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        // The backend might respond differently for admin vs. non-admin:
        //   - If admin => { message: 'OTP sent', userId: '...' }
        //   - If not admin => returns token/cookie directly
        const data = response.data;

        if (data.userId && !data.token) {
          // The user is admin, and the backend has sent an OTP via email
          toast.info('OTP sent to admin email. Please verify.');
          setAdminUserId(data.userId);
        } else if (data.token) {
          // Non-admin or (admin with no OTP required) scenario
          toast.success('Login successful');
          // Refresh user context
          fetchCurrentUser();

          // Check if user is admin in the response
          if (data.user?.isAdmin) {
            navigate('/admin-dashboard');
          } else {
            navigate('/');
          }
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Login failed. Check credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Called when admin successfully verifies OTP
  const handleAdminVerified = async () => {
    // OTP is verified, user is now effectively logged in

    // Possibly fetch user data again to update context
    await fetchCurrentUser();

    // Navigate to admin dashboard
    navigate('/admin-dashboard');
  };

  // If we have an adminUserId => show the OTP form
  if (adminUserId) {
    return (
      <>
    
        <AdminOTPVerification userId={adminUserId} onVerified={handleAdminVerified} />
      </>
    );
  }

  // Otherwise, normal login form
  return (
    <div className="flex flex-col md:flex-row h-screen">
    
      {/* Left side with background image */}
      <div
        className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-8 text-primaryBlue2"
        style={{
          backgroundImage: `url(${loginImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-blue-100 bg-opacity-40 p-4 rounded">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primaryBlue3">
            Welcome Back!
          </h1>
          <p className="text-md md:text-lg max-w-md text-black">
            We’re glad to see you again! Log in to manage AI agents, explore new updates,
            and make the most out of your experience with us.
          </p>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md px-6 py-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Login</h2>
          <p className="text-sm md:text-base text-gray-500 mb-6">
            Welcome back! Please login to your account.
          </p>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-primaryBlue3 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:scale-95 transition duration-200 mb-4"
          >
            <FaGoogle />
            <span>Continue with Google</span>
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600">Email</label>
              <input
                type="email"
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(73,125,168)] outline-none"
                placeholder="username@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600">Password</label>
              <input
                type="password"
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(73,125,168)] outline-none"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <Link
                to="/forgot-password"
                className="text-sm text-[rgb(73,125,168)] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 bg-primaryBlue3 text-white py-3 hover:scale-95 rounded-lg font-semibold transition duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">New User? </span>
            <Link to="/signup" className="text-[rgb(73,125,168)] hover:underline">
              Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
