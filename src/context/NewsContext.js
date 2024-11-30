// src/context/BlogContext.js
import React, { createContext, useState, useEffect } from 'react';
import { fetchNewsArticles, fetchNewsCategories } from '../api';

export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getNews = async () => {
    setLoading(true);
    try {
      const articlesData = await fetchNewsArticles();
      setNews(articlesData.data); // Assuming articlesData has a 'data' array
      const categoriesData = await fetchNewsCategories();
      setCategories(categoriesData.data); // Assuming categoriesData has a 'data' array
    } catch (error) {
      console.error('Error fetching News or categories:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    getNews();
  }, []);

  return (
    <NewsContext.Provider value={{ news, loading, getNews, categories }}>
      {children}
    </NewsContext.Provider>
  );
};
