// frontend/src/components/NewsList.js
import React, { useEffect, useState, useCallback } from 'react';
import { fetchNews } from '../Services/newsService';
import FocusLock from 'react-focus-lock';

const NewsList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState('');
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    // Fetch available sources on component mount
    useEffect(() => {
        const getSources = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/news/sources`);
                const data = await response.json();
                setSources(data.sources);
            } catch (err) {
                console.error('Error fetching sources:', err.message);
            }
        };
        getSources();
    }, []);

    // Fetch news whenever searchQuery, selectedSource, or page changes
    useEffect(() => {
        const getNews = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchNews(searchQuery, selectedSource, page);
                setArticles(data.articles);
                setTotalResults(data.totalResults);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getNews();
    }, [searchQuery, selectedSource, page]);

    // Handle Modal Close on Esc Key
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setSelectedArticle(null);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // Calculate total pages based on totalResults
    const totalPages = Math.ceil(totalResults / 12); // pageSize = 12

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6 text-primaryBlue2">Latest AI News</h1>
                {/* Filters Skeleton */}
                <div className="flex flex-col md:flex-row items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <div className="w-full px-4 py-2 bg-gray-300 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center space-x-4">
                        <div className="w-full px-4 py-2 bg-gray-300 rounded-lg animate-pulse"></div>
                        <div className="px-4 py-2 bg-gray-300 rounded-lg animate-pulse w-24"></div>
                    </div>
                </div>
                {/* Articles Skeleton */}
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="border rounded-lg p-4 shadow animate-pulse bg-gray-200">
                            <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
                            <div className="h-6 bg-gray-300 mt-4 rounded"></div>
                            <div className="h-4 bg-gray-300 mt-2 rounded"></div>
                            <div className="h-4 bg-gray-300 mt-2 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6 text-primaryBlue2">Latest AI News</h1>

            {/* Filters */}
            <form
                onSubmit={(e) => {
                    e.preventDefault(); // Prevent page refresh
                    setSearchQuery(searchInput);
                    setPage(1); // Reset to first page on new search
                }}
                className="flex flex-col md:flex-row items-center mb-8 space-y-4 md:space-y-0 md:space-x-4"
            >
                {/* Search Bar */}
                <div className="w-full md:w-1/2">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search for news..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue2"
                    />
                </div>

                {/* Source Dropdown and Search Button */}
                <div className="w-full md:w-1/2 flex items-center space-x-4">
                    <select
                        value={selectedSource}
                        onChange={(e) => {
                            setSelectedSource(e.target.value);
                            setPage(1); // Reset to first page on new filter
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryBlue2"
                    >
                        <option value="">All Sources</option>
                        {sources.map((source) => (
                            <option key={source.id} value={source.id}>
                                {source.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primaryBlue2 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* News Articles */}
            {articles.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
                            {article.urlToImage && (
                                <img
                                    src={article.urlToImage}
                                    alt={article.title}
                                    className="w-full h-48 object-cover"
                                    loading="lazy"
                                />
                            )}
                            <div className="p-4">
                                <h2 className="text-2xl font-semibold text-primaryBlue2 mb-2">{article.title}</h2>
                                <p className="text-gray-700 mb-4">{article.description}</p>
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => setSelectedArticle(article)}
                                        className="text-primaryBlue2 font-medium hover:underline focus:outline-none"
                                    >
                                        Read More
                                    </button>
                                    <span className="text-sm text-gray-500">
                                        {new Date(article.publishedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">No articles found.</p>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-4">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-lg ${
                            page === 1
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-primaryBlue2 text-white hover:bg-blue-600'
                        }`}
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-gray-700">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-lg ${
                            page === totalPages
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-primaryBlue2 text-white hover:bg-blue-600'
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Modal for Selected Article */}
            {selectedArticle && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="article-title"
                >
                    <FocusLock>
                        <div className="bg-white rounded-lg max-w-3xl w-full p-6 relative overflow-y-auto max-h-screen">
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl"
                                aria-label="Close Modal"
                            >
                                &times;
                            </button>
                            {selectedArticle.urlToImage && (
                                <img
                                    src={selectedArticle.urlToImage}
                                    alt={selectedArticle.title}
                                    className="w-full h-64 object-cover rounded"
                                    loading="lazy"
                                />
                            )}
                            <h2 id="article-title" className="text-3xl font-bold mt-4 text-primaryBlue2">
                                {selectedArticle.title}
                            </h2>
                            <p className="text-gray-600 mt-2">
                                By {selectedArticle.author || 'Unknown'} on {new Date(selectedArticle.publishedAt).toLocaleDateString()}
                            </p>
                            <p className="text-gray-700 mt-4">
                                {selectedArticle.content || selectedArticle.description || 'No additional content available.'}
                            </p>
                            <a
                                href={selectedArticle.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primaryBlue2 hover:underline mt-4 block"
                            >
                                Read Full Article on Source
                            </a>
                        </div>
                    </FocusLock>
                </div>
            )}
        </div>
    );
};

export default NewsList;
