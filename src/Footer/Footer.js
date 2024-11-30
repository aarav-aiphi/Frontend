import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from 'react-icons/fa';
import { toast } from 'react-toastify'; // Ensure only one ToastContainer is used in App.jsx
import 'react-toastify/dist/ReactToastify.css';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscription = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }
    try {
      const response = await axios.post(
        'https://backend-1-sval.onrender.com/api/newsletter/subscribe',
        { email }
      );
      toast.success(response.data.message || 'Subscribed successfully!');
      setEmail(''); // Clear the input field after successful subscription
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Subscription failed. Please try again.';
      toast.error(errorMessage);
      console.error('Subscription error:', error);
    }
  };

  return (
    <footer
      style={{
        backgroundColor: 'rgb(2 25 56)',
      }}
      className="text-white"
    >
      <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Newsletter Subscription */}
        <div className="mx-auto max-w-7xl">
          <div className="relative isolate overflow-hidden px-6 rounded-2xl sm:rounded-3xl sm:px-24 py-10">
            {/* Subscription Content */}
            <div className="flex flex-col items-center text-center">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Keep Updated
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-lg leading-8 text-gray-300">
                Keep up with the latest advancements from AiAzent! Join our
                mailing list to receive selective, noteworthy updates directly
                in your inbox.
              </p>
              <form
                onSubmit={handleSubscription}
                className="mx-auto mt-10 flex max-w-md gap-x-4 w-full"
              >
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/10 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center sm:justify-items-start">
          {/* Products */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/allagent"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/map"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Tree Map
                </Link>
              </li>
              <li>
                <Link
                  to="/agentform"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Submit Agent
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/blogs"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/sponsorship"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <ul className="flex space-x-4 justify-center sm:justify-start">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  <FaFacebookF size={24} />
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  <FaInstagram size={24} />
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  <FaTwitter size={24} />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  <FaLinkedin size={24} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} AiAzent, All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
