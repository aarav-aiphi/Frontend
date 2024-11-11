// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:1337/api';

// Fetch all articles with cover, blocks, and body content populated
export const fetchArticles = async () => {
  const response = await axios.get(
    `http://localhost:1337/api/articles?populate[author][fields][0]=name&populate[author][fields][1]=email&populate[author][fields][2]=publishedAt&populate[cover][populate]=*&populate[Body][populate]=*&populate[tags][populate]=*&populate[category][populate]=*&fields[0]=title&fields[1]=description&fields[2]=slug&fields[3]=publishedat&fields[4]=statuss&fields[5]=readingTime`
  );
  return response.data;
};
// http://localhost:1337/api/articles?populate[author][fields][0]=name&populate[author][fields][1]=email&populate[author][fields][2]=publishedAt&populate[cover][populate]=*&populate[Body][populate]=*&populate[tags][populate]=*&fields[0]=title&fields[1]=description&fields[2]=slug&fields[3]=publishedat&fields[4]=statuss&fields[5]=readingTime
// http://localhost:1337/api/articles?populate[author][fields][0]=name&populate[author][fields][1]=email&populate[author][fields][2]=publishedAt&populate[category][fields][0]=name&populate[category][fields][1]=slug&populate[Body][populate]=*&fields[0]=title&fields[1]=description&fields[2]=slug&fields[3]=publishedat&fields[4]=statuss&fields[5]=readingTime
// Fetch a single article by slug with cover, blocks, and body content populated
export const fetchArticle = async (slug) => {
  const response = await axios.get(
    `${API_URL}/articles?filters[slug][$eq]=${slug}&populate[cover][populate]=*&populate[author][fields][0]=name&populate[author][fields][1]=email&populate[author][fields][2]=publishedAt&populate[category][fields][0]=name&populate[category][fields][1]=slug&populate[Body][populate]=*&populate[tags][populate]=*&fields[0]=title&fields[1]=description&fields[2]=slug&fields[3]=publishedat&fields[4]=statuss&fields[5]=readingTime`
  );
  return response.data;
};

// Fetch all categories (if they have images or nested fields, add populate as needed)
export const fetchCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};


export const fetchAllArticles = async () => {
  try {
      const response = await fetch(`${API_URL}/articles?populate[cover][populate]=*&populate[tags][populate]=*&populate[category][populate]=*&fields[0]=title&fields[1]=description&fields[2]=slug&fields[3]=publishedat&fields[4]=readingTime`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching all articles:', error);
      throw error;
  }
};