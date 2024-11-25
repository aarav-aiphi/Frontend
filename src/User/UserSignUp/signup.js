import React, { useState,useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import login from '../../Images/login.jpg.jpg';
import { AuthContext } from '../../context/AuthContext';

export const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    isAdmin: false, // Optional field for admin registration
  });

  const navigate = useNavigate();
  const { user, fetchCurrentUser } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  const handleGoogleLogin = () => {
    window.location.href = 'https://backend-1-sval.onrender.com/api/users/auth/google';
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      toast.info('Signing up...');
      const response = await axios.post('https://backend-1-sval.onrender.com/api/users/signup', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(response);
    
      if (response.status === 200) {
        toast.success('Signup successful!');
        const user = response.data.user;
         fetchCurrentUser();
        
          navigate('/');
      
      } else if(response.status === 201) {
        toast.error(response.data.message || 'Same user exist please login!');
      }else{
        toast.error('Error occurred during signup!');
      }
    } catch (error) {
      toast.error('Error occurred during signup!');
    }
  };

  return (
    <div>

  
    <div
      className=" hidden md:block bg-center h-screen overflow-y-auto"
      style={{
        backgroundImage: `url(${login})`,
        transform: 'scaleX(-1)',
      }}
    >
      <div
        className="flex transform scale-x-[-1] "
      >
     
        <div className="w-1/2 flex  items-center justify-center bg-opacity-55 max-h-screen mt-24 no-scollbar">
          <div className="w-full max-w-md px-8 py-10">
            <h1 className="text-4xl font-bold text-[rgb(73,125,168)] mb-4">Create Your Account</h1>
            <p className="text-lg text-gray-600 mb-6">Join us and explore AI agents.</p>

            {/* Google Signup Button */}
            <button
            onClick={handleGoogleLogin}
              className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 py-3 rounded-lg font-semibold flex justify-center items-center space-x-2 transition duration-300 shadow-sm mb-4"
            >
              <FaGoogle className="text-red-500" />
              <span>Continue with Google</span>
            </button>

            {/* OR Divider */}
            <div className="flex items-center justify-center mb-6">
              <div className="border-b w-1/4"></div>
              <span className="mx-4 text-gray-400">OR</span>
              <div className="border-b w-1/4"></div>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(73,125,168)] outline-none"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(73,125,168)] outline-none"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(73,125,168)] outline-none"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(73,125,168)] outline-none"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(73,125,168)] outline-none"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              

              <button
                className="w-full bg-[rgb(73,125,168)] text-white py-3 rounded-lg font-bold transition duration-300 shadow-lg"
                type="submit"
              >
                Sign Up
              </button>
            </form>

            {/* Already have an account */}
            <div className="mt-6 text-center">
              <Link to="/login" className="text-[rgb(73,125,168)] hover:underline">
                Already have an account? Log in.
              </Link>
            </div>
          </div>
        </div>

        {/* Right side welcome message */}
        <div className="w-1/2 relative  flex items-center justify-center">
          <div className="relative z-10 text-center text-primaryBlue3 px-8 mb-40">
            <h1 className="text-5xl font-bold mb-4">Welcome to AiAzent!</h1>
            <p className="text-lg max-w-md">
              Discover the power of AI with us. Sign up to explore and create AI agents
              that help solve real-world challenges.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div>
    <div className="flex md:hidden flex-col bg-center h-screen overflow-y-auto">
        {/* Background Image */}
        {/* <div
          className="flex-shrink-0 bg-cover bg-center h-40"
          style={{ backgroundImage: `url(${login})` }}
        ></div> */}

        {/* Signup Form */}
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-[rgb(73,125,168)] mb-4">Create Your Account</h1>
            <p className="text-gray-600 mb-6">Join us and explore AI agents.</p>

            {/* Google Signup Button */}
            <button
              onClick={() => {
                window.location.href = 'https://backend-1-sval.onrender.com/api/users/auth/google';
              }}
              className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 py-2 rounded-lg font-semibold flex justify-center items-center space-x-2 transition duration-300 shadow-sm mb-4"
            >
              <FaGoogle className="text-red-500" />
              <span>Continue with Google</span>
            </button>

            {/* OR Divider */}
            <div className="flex items-center justify-center mb-6">
              <div className="border-b w-1/4"></div>
              <span className="mx-4 text-gray-400">OR</span>
              <div className="border-b w-1/4"></div>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(73,125,168)] outline-none"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(73,125,168)] outline-none"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(73,125,168)] outline-none"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(73,125,168)] outline-none"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(73,125,168)] outline-none"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

             


              <button
                type="submit"
                className="w-full bg-[rgb(73,125,168)] text-white py-2 rounded-lg font-bold transition duration-300 shadow-lg hover:bg-[rgb(60,105,140)]"
              >
                Sign Up
              </button>
            </form>

            {/* Already have an account */}
            <div className="mt-6 text-center">
              <Link to="/login" className="text-[rgb(73,125,168)] hover:underline">
                Already have an account? Log in.
              </Link>
            </div>
          </div>
          </div>
    </div>
      </div>
      </div>
  );
};
