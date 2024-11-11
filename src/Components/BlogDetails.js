// src/Components/BlogDetails.js

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticle, fetchAllArticles } from '../api'; // Ensure fetchAllArticles is imported
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
    FaArrowLeft
} from 'react-icons/fa';
import Slider from 'react-slick'; // React Slick for carousels
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Removed react-helmet and DOMPurify imports
// Removed markdown-to-jsx import if not needed
import parse from 'html-react-parser';

const STRAPI_BASE_URL = 'https://strapi-jrm5.onrender.com'; // Update if different

const BlogDetails = () => {
    const { slug } = useParams(); // Extract slug from URL
    console.log('Fetched Slug:', slug); // Debugging line
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [similarArticles, setSimilarArticles] = useState([]);

    /**
     * Function to truncate descriptions for better UI.
     * @param {string} desc - The description to truncate.
     * @param {number} maxLength - Maximum length of the truncated description.
     */
    const truncateDescription = (desc, maxLength = 100) => {
        if (!desc) return '';
        if (desc.length <= maxLength) return desc;
        return desc.substring(0, maxLength) + '...';
    };

    /**
     * Fetch the current article and all articles to determine similar ones.
     */
    const fetchBlog = async () => {
        try {
            if (!slug) {
                throw new Error('Slug is undefined');
            }
            const response = await fetchArticle(slug);
            console.log('Fetched Blog:', response); // Debugging
            if (response.data.length > 0) {
                const currentBlog = response.data[0]; // Assuming slug is unique
                setBlog(currentBlog);

                // Fetch all articles
                const allArticlesData = await fetchAllArticles();
                const allArticles = allArticlesData.data;

                // Extract current blog's category ID and tag IDs
                const currentCategoryId = currentBlog.category ? currentBlog.category.id : null;
                const currentTagIds = currentBlog.tags ? currentBlog.tags.map(tag => tag.id) : [];
                console.log('Current Category ID:', currentCategoryId); // Debugging
                console.log('Current Tag IDs:', currentTagIds); // Debugging
                console.log('All Articles:', allArticles); // Debugging
                console.log('All Articles Count:', allArticles.length); // Debugging

                // Filter similar articles
                const similar = allArticles.filter(article => {
                    if (article.id === currentBlog.id) return false; // Exclude current blog

                    const articleCategoryId = article.category ? article.category.id : null;
                    const articleTagIds = article.tags ? article.tags.map(tag => tag.id) : [];

                    const hasSameCategory = currentCategoryId && articleCategoryId === currentCategoryId;
                    const hasSharedTags = currentTagIds.some(tagId => articleTagIds.includes(tagId));

                    return hasSameCategory || hasSharedTags;
                });

                setSimilarArticles(similar.slice(0, 3)); // Limit to top 3 similar articles
            } else {
                setBlog(null); // Handle no data found
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching blog:', error);
            toast.error('Failed to fetch blog.');
            setLoading(false);
        }
    };

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
        fetchBlog();
    }, [slug]);

    if (loading) return <p className="text-center text-primaryBlue2">Loading...</p>;
    if (!blog) return <p className="text-center text-red-500">Blog not found</p>;

    // React Slick settings
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

    /**
     * Function to render different types of content blocks.
     * @param {Object} block - The content block to render.
     */
    const renderDynamicZone = (block) => {
        switch (block.__component) {
            case 'shared.rich-text':
                return (
                    <div key={block.id} className="mb-8">
                        <Markdown className="prose lg:prose-xl mx-auto text-gray-800">
                            {block.body}
                        </Markdown>
                    </div>
                );
            case 'shared.editor':
                try {
                    return (
                        <div key={block.id} className="mb-8">
                            <div className="prose lg:prose-xl mx-auto text-gray-800">
                                {parse(block.Ck_Editor)}
                            </div>
                        </div>
                    );
                } catch (error) {
                    console.error('Error parsing editor content:', error);
                    return <p className="text-red-500">Error displaying content.</p>;
                }
            case 'shared.media':
                return (
                    <div key={block.id} className="mb-8">
                        {block.file && block.file.url ? (
                            <img
                                src={`${STRAPI_BASE_URL}${block.file.url}`}
                                alt={block.file.alternativeText || block.file.name}
                                className="w-full h-auto object-contain rounded-lg shadow-md"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/fallback-image.jpg'; // Replace with actual fallback image path
                                }}
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
                                                src={`${STRAPI_BASE_URL}${file.url}`}
                                                alt={file.alternativeText || file.name}
                                                className="w-full h-64 md:h-96 object-contain rounded-lg shadow-md"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/fallback-image.jpg'; // Replace with actual fallback image path
                                                }}
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
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/fallback-video.mp4'; // Replace with actual fallback video path
                                            }}
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

    /**
     * Function to format date strings.
     * @param {string} dateString - The date string to format.
     */
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    /**
     * Function to get all authors' names.
     */
    const getAuthors = () => {
        const authors = [];
        if (blog.author && blog.author.name) authors.push(blog.author.name);
        // Assuming authors_2 is an array of additional authors
        if (blog.authors_2 && blog.authors_2.length > 0) {
            blog.authors_2.forEach(auth => {
                if (auth.name) authors.push(auth.name);
            });
        }
        return authors.join(', ');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto" data-aos="fade-up">
                {/* Back to Blogs Link */}
                <Link to="/blogs" className="flex items-center text-primaryBlue2 hover:underline mb-4">
                    <FaArrowLeft className="mr-2" /> Back to Blogs
                </Link>

                {/* Blog Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primaryBlue text-center">
                    {blog.title}
                </h1>

                {/* Metadata: Category, Tags, Authors, Reading Time */}
                <div className="flex flex-col md:flex-row justify-center items-center mb-6 space-y-2 md:space-y-0 md:space-x-4">
                    {/* Category */}
                    {blog.category && blog.category.name && (
                        <Link
                            to={`/categories/${blog.category.slug}`}
                            className="flex items-center bg-primaryBlue2 text-white text-sm px-3 py-1 rounded-full hover:bg-blue-600 transition-colors duration-300"
                            aria-label={`Category ${blog.category.name}`}
                        >
                            <FaFolder className="mr-1" /> {blog.category.name}
                        </Link>
                    )}

                    {/* Authors */}
                    {getAuthors() && (
                        <div className="flex items-center text-gray-700 text-sm">
                            <FaUser className="mr-1" /> By {getAuthors()}
                        </div>
                    )}

                    {/* Reading Time */}
                    <div className="flex items-center text-gray-700 text-sm">
                        <FaRegClock className="mr-1" /> {blog.readingTime ? `${blog.readingTime} min read` : 'N/A'}
                    </div>
                </div>

                {/* Cover Image */}
                {blog.cover && blog.cover.url && (
                    <div className="relative mt-16">
                        <img
                            src={`${STRAPI_BASE_URL}${blog.cover.url}`}
                            alt={blog.title}
                            className="w-full h-80 object-cover rounded-lg shadow-lg"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/fallback-image.jpg'; // Replace with actual fallback image path
                            }}
                        />
                    </div>
                )}

                {/* Main Blog Content */}
                <div className="prose lg:prose-xl mx-auto text-gray-800 mb-6">
                    {/* Render dynamic components */}
                    {blog.Body && blog.Body.map((block) => renderDynamicZone(block))}
                </div>

                {/* Social Sharing Buttons */}
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
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-600"
                        aria-label="Share on Twitter"
                    >
                        <FaTwitter size={24} />
                    </a>
                    <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blog.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900"
                        aria-label="Share on LinkedIn"
                    >
                        <FaLinkedinIn size={24} />
                    </a>
                </div>

                {/* Similar Articles */}
                {similarArticles.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-semibold mb-6 text-primaryBlue2 text-center">
                            Similar Articles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {similarArticles.map((article) => (
                                <Link
                                    to={`/blogs/${article.slug}`}
                                    key={article.id}
                                    className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                                    data-aos="fade-up"
                                >
                                    {/* Article Cover Image */}
                                    {article.cover && article.cover.url ? (
                                        <img
                                            src={`${STRAPI_BASE_URL}${article.cover.url}`}
                                            alt={article.title}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/fallback-image.jpg';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500">No Image</span>
                                        </div>
                                    )}
                                    {/* Article Details */}
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold mb-2 text-primaryBlue2">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {truncateDescription(article.description, 100)}
                                        </p>
                                        {/* Tags */}
                                        {article.tags && article.tags.length > 0 && (
                                            <div className="mt-3 flex flex-wrap">
                                                {article.tags.map((tag) => (
                                                    tag.name && (
                                                        <Link
                                                            to={tag.slug ? `/tags/${tag.slug}` : '#'}
                                                            key={tag.id}
                                                            className="flex items-center bg-primaryBlue2 text-white text-xs px-2 py-1 mr-2 mb-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                                                            aria-label={`Tag ${tag.name}`}
                                                        >
                                                            <FaTags className="mr-1" /> #{tag.name}
                                                        </Link>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Back to Blogs Link at the Bottom */}
                <Link to="/blogs" className="flex items-center text-primaryBlue2 hover:underline mt-8">
                    <FaArrowLeft className="mr-2" /> Back to Blogs
                </Link>
            </div>
        </div>
    );
};

export default BlogDetails;
