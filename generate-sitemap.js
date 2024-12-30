// frontend/generate-sitemap.js

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

// Base URL of your website
const BASE_URL = 'https://aiazent.ai';

// Static URLs to include in the sitemap
const staticUrls = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/agentform', changefreq: 'monthly', priority: 0.8 },
  { url: '/sponsorship', changefreq: 'monthly', priority: 0.8 },
  { url: '/allagent', changefreq: 'monthly', priority: 0.8 },
  { url: '/login', changefreq: 'monthly', priority: 0.8 },
  { url: '/signup', changefreq: 'monthly', priority: 0.8 },
  { url: '/admin-dashboard', changefreq: 'monthly', priority: 0.8 },
  { url: '/map', changefreq: 'monthly', priority: 0.8 },
  { url: '/news', changefreq: 'monthly', priority: 0.8 },
  // { url: '/blogs', changefreq: 'monthly', priority: 0.8 }, // Removed as per your request
  // { url: '/add-blog', changefreq: 'monthly', priority: 0.8 }, // Removed as per your request
  { url: '/userdash', changefreq: 'monthly', priority: 0.8 },
  { url: '/privacy', changefreq: 'yearly', priority: 0.5 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  { url: '/community', changefreq: 'monthly', priority: 0.8 },
  // Add other static routes as needed
];

// Function to fetch dynamic agent URLs from the backend API
const getAgentUrls = async () => {
  try {
    const response = await axios.get('https://backend-1-sval.onrender.com/api/agents/all'); // Replace with your actual API endpoint
    const agents = response.data; // Adjust based on your API response structure

    // Map agents to sitemap URLs
    return agents.map(agent => ({
      url: `/agent/${agent._id}`, // Ensure `_id` is the correct field
      changefreq: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error fetching agent URLs:', error);
    return [];
  }
};


// Main function to generate sitemap
const generateSitemap = async () => {
  try {
    // Fetch dynamic URLs
    const agentUrls = await getAgentUrls();
 console.log(agentUrls);
    // Combine static and dynamic URLs
    const allUrls = [...staticUrls, ...agentUrls];

    // Create a sitemap stream
    const sitemapStream = new SitemapStream({ hostname: BASE_URL });

    // Convert URLs to a Readable stream and pipe to sitemap
    const xmlString = await streamToPromise(Readable.from(allUrls).pipe(sitemapStream)).then(data => data.toString());

    // Define the path to save the sitemap
    const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');

    // Write the sitemap to the public directory
    fs.writeFileSync(sitemapPath, xmlString);

    console.log('sitemap.xml successfully generated!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
};

// Execute the sitemap generation
generateSitemap();
