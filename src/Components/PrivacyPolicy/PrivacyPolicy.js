// src/components/PrivacyPolicy/PrivacyPolicy.js

import React from 'react';
import { motion } from 'framer-motion';
import PrivacyIllustration from '../../Images/privacy.jpg'; // Ensure the path is correct
import { FaShieldAlt, FaUsers, FaRegHandshake, FaLock } from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header with Illustration */}
        <div className="flex flex-col-reverse lg:flex-row items-center">
          {/* Text Content */}
          <motion.div
            className="lg:w-2/3 p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-extrabold text-indigo-600 mb-4 flex items-center">
              <FaShieldAlt className="mr-3 text-3xl" />
              Privacy Policy
            </h1>
            <p className="text-gray-700 mb-6">
              At AiAzent, your privacy is of paramount importance to us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </motion.div>
          {/* Animated Illustration */}
          <motion.div
            className="lg:w-1/3 p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={PrivacyIllustration}
              alt="Privacy Policy Illustration"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </motion.div>
        </div>

        {/* Privacy Policy Sections */}
        <div className="p-8">
          {/* Section 1: Information We Collect */}
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-indigo-700 flex items-center mb-4">
              <FaUsers className="mr-3 text-xl" />
              1. Information We Collect
            </h2>
            <p className="text-gray-700 mb-4">
              We may collect various types of information in connection with the services we provide, including:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li className="flex items-start">
                <FaRegHandshake className="mt-1 mr-2 text-indigo-500" />
                <span className="text-gray-700">
                  <strong>Personal Data:</strong> Includes your name, email address, phone number, and other identifying information.
                </span>
              </li>
              <li className="flex items-start">
                <FaRegHandshake className="mt-1 mr-2 text-indigo-500" />
                <span className="text-gray-700">
                  <strong>Usage Data:</strong> Information about how you use our website, such as your IP address, browser type, and access times.
                </span>
              </li>
              <li className="flex items-start">
                <FaRegHandshake className="mt-1 mr-2 text-indigo-500" />
                <span className="text-gray-700">
                  <strong>Financial Data:</strong> Details related to your payment methods, if applicable.
                </span>
              </li>
            </ul>
          </motion.section>

          {/* Section 2: How We Use Your Information */}
          <motion.section
            className="mb-8 bg-indigo-50 p-6 rounded-lg shadow-inner"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-indigo-700 flex items-center mb-4">
              <FaLock className="mr-3 text-xl" />
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We utilize the collected information for various purposes, including:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li className="flex items-start">
                <FaRegHandshake className="mt-1 mr-2 text-indigo-500" />
                <span className="text-gray-700">To provide and maintain our services.</span>
              </li>
              <li className="flex items-start">
                <FaRegHandshake className="mt-1 mr-2 text-indigo-500" />
                <span className="text-gray-700">To notify you about changes to our services.</span>
              </li>
              <li className="flex items-start">
                <FaRegHandshake className="mt-1 mr-2 text-indigo-500" />
                <span className="text-gray-700">To provide customer support.</span>
              </li>
              <li className="flex items-start">
                <FaRegHandshake className="mt-1 mr-2 text-indigo-500" />
                <span className="text-gray-700">To gather analysis or valuable information to improve our services.</span>
              </li>
            </ul>
          </motion.section>

          {/* Section 3: Disclosure of Your Information */}
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-indigo-700 flex items-center mb-4">
              <FaShieldAlt className="mr-3 text-xl" />
              3. Disclosure of Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We may disclose your personal information in the following situations:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li className="flex items-start">
                <FaRegHandshake className="mt-1 mr-2 text-indigo-500" />
                <span className="text-gray-700">
                  <strong>By Law or to Protect Rights:</strong> If required by law or to protect our rights.
                </span>
              </li>
              <li className="flex items-start">
                <FaRegHandshake className="mt-1 mr-2 text-indigo-500" />
                <span className="text-gray-700">
                  <strong>Third-Party Service Providers:</strong> To provide services to you, such as payment processing.
                </span>
              </li>
              <li className="flex items-start">
                <FaRegHandshake className="mt-1 mr-2 text-indigo-500" />
                <span className="text-gray-700">
                  <strong>Business Transfers:</strong> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
                </span>
              </li>
            </ul>
          </motion.section>

          {/* Section 4: Security of Your Information */}
          <motion.section
            className="mb-8 bg-purple-50 p-6 rounded-lg shadow-inner"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-indigo-700 flex items-center mb-4">
              <FaLock className="mr-3 text-xl" />
              4. Security of Your Information
            </h2>
            <p className="text-gray-700">
              We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </motion.section>

          {/* Section 5: Your Consent */}
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl font-semibold text-indigo-700 flex items-center mb-4">
              <FaUsers className="mr-3 text-xl" />
              5. Your Consent
            </h2>
            <p className="text-gray-700">
              By using our site, you consent to our Privacy Policy.
            </p>
          </motion.section>

          {/* Section 6: Changes to This Privacy Policy */}
          <motion.section
            className="mb-8 bg-indigo-50 p-6 rounded-lg shadow-inner"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 className="text-2xl font-semibold text-indigo-700 flex items-center mb-4">
              <FaShieldAlt className="mr-3 text-xl" />
              6. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700">
              We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will notify you about any changes by updating the “Last Updated” date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.
            </p>
          </motion.section>

          {/* Section 7: Contact Us */}
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <h2 className="text-2xl font-semibold text-indigo-700 flex items-center mb-4">
              <FaRegHandshake className="mr-3 text-xl" />
              7. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions or comments about this Privacy Policy, please contact us:
            </p>
            <div className="text-gray-700">
              <p><strong>Email:</strong> <a href="mailto:support@aiazent.com" className="text-indigo-600 hover:underline">support@aiazent.com</a></p>
              <p><strong>Address:</strong> 1234 AI Avenue, Tech City, TX 75001</p>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
