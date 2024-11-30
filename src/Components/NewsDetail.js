// src/Components/NewsDetails.js

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchNewsArticle, fetchAllNewsArticles } from '../api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { toast } from 'react-toastify';
import {
    FaFolder,
    FaTags,
    FaUser,
    FaRegClock,
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaArrowLeft,
    FaSpinner
} from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const STRAPI_BASE_URL = 'https://strapi-jrm5.onrender.com';

const NewsDetails = () => {
    const { slug } = useParams();
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [similarNews, setSimilarNews] = useState([]);

    const fetchNews = async () => {
        try {
            if (!slug) throw new Error('Slug is undefined');
            const response = await fetchNewsArticle(slug);
            if (response.data.length > 0) {
                const currentNews = response.data[0];
                setNewsItem(currentNews);
                const allNewsData = await fetchAllNewsArticles();
                const allNews = allNewsData.data;

                const currentCategoryId = currentNews.category ? currentNews.category.id : null;
                const currentTagIds = currentNews.tags ? currentNews.tags.map(tag => tag.id) : [];
                const similar = allNews.filter(item => {
                    if (item.id === currentNews.id) return false;
                    const itemCategoryId = item.category ? item.category.id : null;
                    const itemTagIds = item.tags ? item.tags.map(tag => tag.id) : [];
                    const hasSameCategory = currentCategoryId && itemCategoryId === currentCategoryId;
                    const hasSharedTags = currentTagIds.some(tagId => itemTagIds.includes(tagId));
                    return hasSameCategory || hasSharedTags;
                });
                setSimilarNews(similar.slice(0, 3));
            } else setNewsItem(null);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching news:', error);
            // toast.error('Failed to fetch news.');
            setLoading(false);
        }
    };

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
        fetchNews();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-4xl text-primaryBlue2" />
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    if (!newsItem) return <p className="text-center text-red-500">News not found</p>;

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
    };

    const renderDynamicZone = (block) => {
        switch (block.__component) {
            case 'shared.rich-text':
                return (
                    <div key={block.id} className="mb-8" dangerouslySetInnerHTML={{ __html: block.body }} />
                );
            case 'shared.editor':
                return (
                    <div key={block.id} className="mb-8" dangerouslySetInnerHTML={{ __html: block.Ck_Editor }} />
                );
            case 'shared.media':
                return (
                    <div key={block.id} className="mb-8">
                        {block.file && block.file.url ? (
                            <img
                                src={block.file.url}
                                alt=""
                                className="w-full h-auto object-contain rounded-lg shadow-md"
                                loading="lazy"
                                onError={(e) => { e.target.onerror = null }}
                            />
                        ) : (
                            <p className="text-red-500">Image not available</p>
                        )}
                    </div>
                );
            case 'shared.slider':
                return (
                    <div key={block.id} className="mb-8">
                        {block.files && block.files.length > 0 ? (
                            <Slider {...sliderSettings}>
                                {block.files.map((file, idx) => (
                                    <div key={idx} className="flex justify-center">
                                        {file.url ? (
                                            <img
                                                src={file.url}
                                                alt=""
                                                className="w-full h-64 md:h-96 object-contain rounded-lg shadow-md"
                                                loading="lazy"
                                                onError={(e) => { e.target.onerror = null }}
                                            />
                                        ) : (
                                            <p className="text-red-500">Image URL missing</p>
                                        )}
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <p className="text-red-500">No images available in the slider.</p>
                        )}
                    </div>
                );
            case 'shared.quote':
                return (
                    <div key={block.id} className="mb-8">
                        <blockquote className="border-l-4 border-primaryBlue2 pl-4 italic text-gray-700">
                            {block.body}
                        </blockquote>
                    </div>
                );
            case 'shared.video':
                return (
                    <div key={block.id} className="mb-8">
                        {block.Video && block.Video.length > 0 ? (
                            block.Video.map((video, idx) => (
                                <div key={idx} className="mb-4">
                                    <div className="aspect-video">
                                        <video
                                            controls
                                            className="w-full h-full rounded-lg shadow-md border border-gray-300"
                                            onError={(e) => { e.target.onerror = null }}
                                        >
                                            <source
                                                src={video.url.startsWith('http') ? video.url : `${STRAPI_BASE_URL}${video.url}`}
                                                type={video.mime || 'video/mp4'}
                                            />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-red-500">Video not available</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    const getAuthors = () => {
        const authors = [];
        if (newsItem.author && newsItem.author.name) authors.push(newsItem.author.name);
        if (newsItem.authors_2 && newsItem.authors_2.length > 0) {
            newsItem.authors_2.forEach(auth => {
                if (auth.name) authors.push(auth.name);
            });
        }
        return authors.join(', ');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto" data-aos="fade-up">
                <Link to="/news" className="flex items-center text-primaryBlue2 hover:underline mb-4">
                    <FaArrowLeft className="mr-2" /> Back to News
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primaryBlue text-center">
                    {newsItem.title}
                </h1>

                <div className="flex flex-col md:flex-row justify-center items-center mb-6 space-y-2 md:space-y-0 md:space-x-4">
                    {newsItem.category && newsItem.category.name && (
                        <Link
                            to={`/categories/${newsItem.category.slug}`}
                            className="flex items-center bg-primaryBlue2 text-white text-sm px-3 py-1 rounded-full hover:bg-blue-600 transition-colors duration-300"
                            aria-label={`Category ${newsItem.category.name}`}
                        >
                            <FaFolder className="mr-1" /> {newsItem.category.name}
                        </Link>
                    )}
                    {getAuthors() && (
                        <div className="flex items-center text-gray-700 text-sm">
                            <FaUser className="mr-1" /> By {getAuthors()}
                        </div>
                    )}
                    <div className="flex items-center text-gray-700 text-sm">
                        <FaRegClock className="mr-1" /> {newsItem.readingTime ? `${newsItem.readingTime} min read` : 'N/A'}
                    </div>
                </div>

                {newsItem.cover && newsItem.cover.url && (
                    <div className="relative mt-16">
                        <img
                            src={newsItem.cover.url}
                            alt=""
                            className="w-full h-80 object-cover rounded-lg shadow-lg"
                            onError={(e) => { e.target.onerror = null }}
                        />
                    </div>
                )}

                <div className="prose lg:prose-xl mx-auto text-gray-800 mb-6">
                    {newsItem.Body && newsItem.Body.map((block) => renderDynamicZone(block))}
                </div>

                <div className="flex justify-center mt-6 space-x-4">
                    <a
                        href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                        aria-label="Share on Facebook"
                    >
                        <FaFacebookF size={24} />
                    </a>
                    <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(newsItem.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-600"
                        aria-label="Share on Twitter"
                    >
                        <FaTwitter size={24} />
                    </a>
                    <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(newsItem.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900"
                        aria-label="Share on LinkedIn"
                    >
                        <FaLinkedinIn size={24} />
                    </a>
                </div>

                {/* Similar News Section */}
                {similarNews.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Similar News</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {similarNews.map(item => (
                                <Link to={`/news/${item.slug}`} key={item.id} className="block group">
                                    <div className="overflow-hidden rounded-lg shadow-md">
                                        <img
                                            src={item.cover?.url}
                                            alt={item.title || 'News Cover'}
                                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>
                                    <h3 className="mt-2 text-lg font-medium text-gray-700 group-hover:text-primaryBlue2 transition-colors duration-300">
                                        {item.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsDetails;
