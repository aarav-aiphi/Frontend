import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaFacebookF, FaInstagram, FaTwitter, FaGithub, FaDribbble } from 'react-icons/fa';
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
      const response = await axios.post('https://backend-1-sval.onrender.com/api/newsletter/subscribe', { email });
      toast.success(response.data.message || 'Subscribed successfully!');
      setEmail(''); // Clear the input field after successful subscription
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Subscription failed. Please try again.';
      toast.error(errorMessage);
      console.error('Subscription error:', error);
    }
  };

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Newsletter Subscription */}
        <div className="mx-auto  max-w-7xl ">
        <div
          className="relative isolate overflow-hidden  px-6   rounded-2xl sm:rounded-3xl sm:px-24 py-10"
        >
          {/* Decorative SVG Background */}
       

          {/* Subscription Content */}
          <div className="flex flex-col items-center text-center">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Keep Updated
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-lg leading-8 text-gray-300">
              Keep pace with SecureCloud advancements! Join our mailing list for selective, noteworthy updates.
            </p>

            <form 
              onSubmit={handleSubscription} 
              className="mx-auto mt-10 flex max-w-md gap-x-4 w-full"
            >
              <div className="flex items-center justify-center px-3 bg-gray-700 rounded-md">
                <FaEnvelope size={20} className="text-gray-300" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="min-w-0 flex-auto rounded-md border-0 bg-white/10 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 placeholder-gray-400"
              />

              <button
                type="submit"
                onClick={handleSubscription}
                className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition duration-300"
              >
                Notify me
              </button>
            </form>
          </div>
        </div>
      </div>

        {/* Footer Links */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <ul className="space-y-2">
              {/* <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  Our Story
                </a>
              </li> */}
              
              <li>
                <Link to='/blogs' className="text-gray-400 hover:text-white transition duration-300">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
             
              {/* <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  Pricing
                </a>
              </li> */}
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition duration-300">
                 Privacy Policy
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">8th Floor, A Block, Sai Crystal, Plot No 45/52/52A, Sector 35 D, Kharghar Navi Mumbai 410210</li>
              <li className="text-gray-400">Email: 
              info@aiphi.ai</li>
              <li className="text-gray-400">Phone: 
              +91 99016 98890</li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="mt-12 flex justify-center space-x-6">
          <a href="#" className="text-gray-400 hover:text-white transition duration-300">
            <FaFacebookF size={24} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition duration-300">
            <FaInstagram size={24} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition duration-300">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition duration-300">
            <FaGithub size={24} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition duration-300">
            <FaDribbble size={24} />
          </a>
        </div>

        {/* Footer Note */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400">&copy; {new Date().getFullYear()} AiAzent, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
