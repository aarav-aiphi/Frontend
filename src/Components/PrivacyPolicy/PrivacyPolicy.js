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
            <p className="text-gray-700">
              Welcome to AiAzent! Your trust is important to us. We want to assure you that we **do not collect, store, or share any personal information** from our users. This Privacy Policy outlines our commitment to your privacy while you navigate our website.
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
          {/* Section 1: Our Commitment */}
          <motion.section
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-indigo-700 flex items-center mb-3">
              <FaUsers className="mr-3 text-xl" />
              1. Our Commitment
            </h2>
            <p className="text-gray-700">
              At AiAzent, we prioritize your privacy. **We do not collect any personal data**, ensuring a secure and worry-free experience as you use our services.
            </p>
          </motion.section>

          {/* Section 2: Information We Do Not Collect */}
          <motion.section
            className="mb-6 bg-indigo-50 p-6 rounded-lg shadow-inner"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-indigo-700 flex items-center mb-3">
              <FaLock className="mr-3 text-xl" />
              2. Information We Do Not Collect
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Personal Data:</strong> Names, emails, phone numbers, and other identifying details.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our website.</li>
              <li><strong>Financial Data:</strong> Payment methods or transaction details.</li>
            </ul>
          </motion.section>

          {/* Section 3: Security Measures */}
          <motion.section
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-indigo-700 flex items-center mb-3">
              <FaShieldAlt className="mr-3 text-xl" />
              3. Security Measures
            </h2>
            <p className="text-gray-700">
              Even though we don’t handle personal information, we implement robust security protocols to protect our website from unauthorized access and ensure a safe browsing environment for all users.
            </p>
          </motion.section>

          {/* Section 4: Your Consent */}
          <motion.section
            className="mb-6 bg-purple-50 p-6 rounded-lg shadow-inner"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-indigo-700 flex items-center mb-3">
              <FaUsers className="mr-3 text-xl" />
              4. Your Consent
            </h2>
            <p className="text-gray-700">
              By using our website, you acknowledge and agree to our Privacy Policy. Since we do not collect personal data, no further consents are required.
            </p>
          </motion.section>

          {/* Section 5: Changes to This Policy */}
          <motion.section
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl font-semibold text-indigo-700 flex items-center mb-3">
              <FaShieldAlt className="mr-3 text-xl" />
              5. Changes to This Policy
            </h2>
            <p className="text-gray-700">
              We may update our Privacy Policy occasionally. Any changes will be posted on this page, and the "Last Updated" date will be revised. We encourage you to review this policy periodically to stay informed.
            </p>
          </motion.section>

          {/* Section 6: Contact Us */}
          <motion.section
            className="mb-6 bg-indigo-50 p-6 rounded-lg shadow-inner"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 className="text-2xl font-semibold text-indigo-700 flex items-center mb-3">
              <FaRegHandshake className="mr-3 text-xl" />
              6. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our Privacy Policy, feel free to reach out:
            </p>
            <div className="text-gray-700">
              <p><strong>Email:</strong> <a href="mailto:info@aiphi.ai" className="text-indigo-600 hover:underline">info@aiphi.ai</a></p>
              <p><strong>Address:</strong> 8th Floor, A Block, Sai Crystal, Plot No 45/52/52A, Sector 35 D, Kharghar, Navi Mumbai 410210</p>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
