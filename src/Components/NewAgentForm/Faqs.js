// src/Components/Faqs.js

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Faqs = () => {
  // Define the FAQ data
  const faqs = [
    {
      category: 'Agent',
      questions: [
        {
          question: 'What is an AI Agent?',
          answer:
            'An AI Agent is a software entity that performs tasks autonomously by leveraging artificial intelligence technologies. It can learn, adapt, and make decisions based on the data it processes.',
        },
        {
          question: 'How do I create a new AI Agent?',
          answer:
            'To create a new AI Agent, navigate to the "Create Agent" section, fill out the required details, upload necessary assets like logos and thumbnails, and submit the form for review.',
        },
        {
          question: 'Can I customize my AI Agent’s features?',
          answer:
            'Yes, you can customize various aspects of your AI Agent, including key features, use cases, pricing models, and subscription plans. This allows you to tailor the agent to your specific needs and audience.',
        },
        {
          question: 'How do I update my AI Agent’s information?',
          answer:
            'To update your AI Agent’s information, go to the Admin Dashboard, select the agent you wish to edit, make the necessary changes in the edit form, and save the updates.',
        },
        {
          question: 'What support is available for AI Agents?',
          answer:
            'Support options vary based on your subscription plan. Free plans include community support, while higher-tier plans offer priority and 24/7 premium support services.',
        },
      ],
    },
    {
      category: 'Payment',
      questions: [
        {
          question: 'What payment methods are accepted?',
          answer:
            'We accept various payment methods including credit/debit cards, PayPal, and bank transfers. You can choose your preferred method during the subscription process.',
        },
        {
          question: 'Is my payment information secure?',
          answer:
            'Yes, we prioritize the security of your payment information. All transactions are processed through secure gateways with encryption to protect your data.',
        },
        {
          question: 'Can I upgrade or downgrade my subscription plan?',
          answer:
            'Absolutely! You can upgrade or downgrade your subscription plan at any time from your account settings. Changes will take effect immediately or at the end of your current billing cycle, depending on your preference.',
        },
        {
          question: 'What is your refund policy?',
          answer:
            'We offer a 30-day refund policy for our subscription plans. If you are not satisfied with the service, you can request a refund within this period.',
        },
        {
          question: 'How do I view my billing history?',
          answer:
            'Your billing history is accessible from the "Billing" section in your account dashboard. Here, you can view past invoices, payment dates, and amounts.',
        },
      ],
    },
  ];

  // State to manage which FAQ is open
  const [openFaqs, setOpenFaqs] = useState({});

  // Toggle the open state of a specific FAQ
  const toggleFaq = (category, index) => {
    setOpenFaqs((prev) => {
      const key = `${category}-${index}`;
      return { ...prev, [key]: !prev[key] };
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-semibold text-gray-800 mb-12 text-center">
        Frequently Asked Questions
      </h2>
      {faqs.map((faqCategory) => (
        <div key={faqCategory.category} className="mb-8">
          <h3 className="text-2xl font-bold text-primaryBlue2 mb-4">
            {faqCategory.category} FAQs
          </h3>
          <div className="space-y-4">
            {faqCategory.questions.map((q, index) => {
              const key = `${faqCategory.category}-${index}`;
              const isOpen = openFaqs[key];
              return (
                <div
                  key={key}
                  className="border rounded-lg shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(faqCategory.category, index)}
                    className="w-full flex justify-between items-center p-4 focus:outline-none focus:ring-2 focus:ring-primaryBlue2"
                    aria-expanded={isOpen ? 'true' : 'false'}
                    aria-controls={`faq-${key}`}
                  >
                    <span className="text-left text-lg font-medium text-gray-700">
                      {q.question}
                    </span>
                    <span className="text-gray-500">
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-${key}`}
                      className="p-4 border-t bg-gray-50"
                    >
                      <p className="text-gray-600">{q.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Faqs;
