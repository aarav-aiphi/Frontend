
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import { FaPaperPlane, FaEnvelope } from 'react-icons/fa';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const { name, email, message } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      const res = await axios.post('https://backend-1-sval.onrender.com/api/contact', formData);
      toast.success(res.data.message || 'Your message has been sent successfully!');
      setStatus('');
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error(
        error.response?.data?.message || 'There was an error submitting the form.'
      );
      setStatus('');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 },
    }),
  };

  return (
    <div>
      <section className="bg-gray-50 dark:bg-slate-800" id="contact">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          {/* Header */}
          <motion.div
            className="mb-12 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* <motion.p
              className="text-base font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-200"
              variants={itemVariants}
              custom={0}
            >
              Contact Us
            </motion.p> */}
            <motion.h2
              className="font-heading mb-4 font-bold tracking-tight text-gray-900 dark:text-white text-3xl sm:text-5xl"
              variants={itemVariants}
              custom={1}
            >
              Get in Touch
            </motion.h2>
            <motion.p
              className="mx-auto mt-4 max-w-md text-xl text-gray-600 dark:text-slate-400"
              variants={itemVariants}
              custom={2}
            >
              Whether you have a question about features, pricing, or anything else, our team is ready to
              answer all your questions.
            </motion.p>
            <motion.p
              className="mx-auto mt-4 max-w-md text-xl text-gray-600 dark:text-slate-400"
              variants={itemVariants}
              custom={2}
            >
               <FaEnvelope className="inline-block mr-2" />
              Email us at:{' '}
              <a
                href="mailto:info@aiphi.ai"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                info@aiphi.ai
              </a>
            </motion.p>
          </motion.div>

           

          {/* Contact Form */}
          <motion.div
            className="p-6 bg-white dark:bg-slate-700 rounded-lg shadow-lg"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h3
              className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white text-center"
              variants={itemVariants}
              custom={3}
            >
              Send Us a Message
            </motion.h3>
            <form id="contactForm" onSubmit={onSubmit} className="space-y-6">
              {/* Name Field */}
              <motion.div
                className="relative"
                variants={itemVariants}
                custom={4}
              >
                <label htmlFor="name" className="sr-only">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="given-name"
                  placeholder="Your Name"
                  value={name}
                  onChange={onChange}
                  required
                  className="w-full rounded-md border border-gray-300 py-3 px-4 shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-300"
                />
              </motion.div>

              {/* Email Field */}
              <motion.div
                className="relative"
                variants={itemVariants}
                custom={5}
              >
                <label htmlFor="email" className="sr-only">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={onChange}
                  required
                  className="w-full rounded-md border border-gray-300 py-3 px-4 shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-300"
                />
              </motion.div>

              {/* Message Field */}
              <motion.div
                className="relative"
                variants={itemVariants}
                custom={6}
              >
                <label htmlFor="message" className="sr-only">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Your Message"
                  value={message}
                  onChange={onChange}
                  required
                  className="w-full rounded-md border border-gray-300 py-3 px-4 shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors duration-300"
                ></textarea>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                variants={itemVariants}
                custom={7}
              >
                <button
                  type="submit"
                  disabled={status === 'Submitting...'}
                  className={`w-full flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                    status === 'Submitting...' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {status === 'Submitting...' ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="h-5 w-5 mr-3" /> Send Message
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </motion.div>

        
        </div>
      </section>
    </div>
  );
};

export default Contact;
