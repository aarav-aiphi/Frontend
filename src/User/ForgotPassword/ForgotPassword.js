import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/forgot-password', { email });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex max-w-screen h-screen justify-center bg-gray-100 no-scrollbar">
   
      <div className="w-1/2 flex items-center justify-center overflow-y-auto" style={{ height: '93%' }}>
        <div className="max-w-lg w-full p-4">
          <div className="mb-6 text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Forgot Password</h1>
            <p className="text-lg text-gray-600">Enter your email to reset your password</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primaryBlue3 text-white py-3 rounded-lg font-bold transition duration-300 shadow-lg"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;