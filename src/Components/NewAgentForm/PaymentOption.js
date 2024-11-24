// src/Components/PaymentOptions.js

import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PaymentOptions = ({ onSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const paymentPlans = [
    {
      id: 0,
      name: 'Free',
      price: '$0/month',
      features: [
        'Listed in Agents Directory',
        'Limited Visibility',
        'Community Support',
      ],
      color: 'bg-gray-50',
      borderColor: 'border-gray-400',
      textColor: 'text-gray-700',
    },
    {
      id: 1,
      name: 'Basic',
      price: '$99/month',
      features: [
        'Highlighted in Agents Directory',
        'Standard Visibility',
        'Basic Support',
      ],
      color: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-900',
    },
    {
      id: 2,
      name: 'Standard',
      price: '$199/month',
      features: [
        'Highlighted in Agents Directory',
        'Enhanced Visibility',
        'Priority Support',
        'Access to Performance Metrics',
      ],
      color: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-900',
    },
    {
      id: 3,
      name: 'Premium',
      price: '$299/month',
      features: [
        'Top Placement in Directory',
        'Maximum Visibility',
        '24/7 Premium Support',
        'Advanced Analytics Tools',
        'Custom Branding',
      ],
      color: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-900',
    },
  ];

  const handleSelect = (plan) => {
    setSelectedPlan(plan.id);
    if (onSelect) {
      onSelect(plan.name);
    }
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
      transition: {
        duration: 0.3,
      },
    },
    selected: {
      scale: 1.05,
      boxShadow: '0px 15px 25px rgba(0, 0, 0, 0.3)',
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="mb-12 px-4  pt-16">
      <h3 className="text-3xl  font-extrabold text-gray-800 mb-8 text-center">
        Choose Your Subscription Plan
      </h3>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {paymentPlans.map((plan) => (
          <motion.div
            key={plan.id}
            onClick={() => handleSelect(plan)}
            variants={cardVariants}
            whileHover="hover"
            animate={selectedPlan === plan.id ? 'selected' : 'visible'}
            className={`relative p-8 border rounded-lg cursor-pointer transition-colors ${
              selectedPlan === plan.id
                ? `${plan.borderColor} border-4`
                : 'border-gray-200'
            } ${plan.color}`}
            role="button"
            aria-pressed={selectedPlan === plan.id}
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSelect(plan);
              }
            }}
          >
            {/* Selected Indicator */}
            {selectedPlan === plan.id && (
              <FaCheckCircle className="absolute top-4 right-4 text-green-600 text-2xl" />
            )}
            <h4 className={`text-2xl font-bold text-center mb-4 ${plan.textColor}`}>
              {plan.name}
            </h4>
            <p className={`text-3xl font-semibold text-center mb-6 ${plan.textColor}`}>
              {plan.price}
            </p>
            <ul className="space-y-2 text-gray-600">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm">
                  <span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PaymentOptions;
