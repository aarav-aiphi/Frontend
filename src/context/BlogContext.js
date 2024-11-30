// src/context/BlogContext.js
import React, { createContext, useState, useEffect } from 'react';
import { fetchArticles, fetchCategories } from '../api';

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBlogs = async () => {
    setLoading(true);
    try {
      const articlesData = await fetchArticles();
      setBlogs(articlesData.data); // Assuming articlesData has a 'data' array
      const categoriesData = await fetchCategories();
      setCategories(categoriesData.data); // Assuming categoriesData has a 'data' array
    } catch (error) {
      console.error('Error fetching blogs or categories:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, loading, getBlogs, categories }}>
      {children}
    </BlogContext.Provider>
  );
};
