import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticle, fetchAllArticles } from '../api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { toast } from 'react-toastify';
import htmlParser from 'html-react-parser';
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
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Markdown from 'markdown-to-jsx';

const BlogDetails = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [similarArticles, setSimilarArticles] = useState([]);

    const fetchBlog = async () => {
        try {
            const response = await fetchArticle(slug);
            if (response.data.length > 0) {
                const currentBlog = response.data[0];
                setBlog(currentBlog);

                const allArticlesData = await fetchAllArticles();
                const allArticles = allArticlesData.data;

                const currentCategoryId = currentBlog.category ? currentBlog.category.id : null;
                const currentTagIds = currentBlog.tags ? currentBlog.tags.map(tag => tag.id) : [];

                const similar = allArticles.filter(article => {
                    if (article.id === currentBlog.id) return false;

                    const articleCategoryId = article.category ? article.category.id : null;
                    const articleTagIds = article.tags ? article.tags.map(tag => tag.id) : [];

                    const hasSameCategory = currentCategoryId && articleCategoryId === currentCategoryId;
                    const hasSharedTags = currentTagIds.some(tagId => articleTagIds.includes(tagId));

                    return hasSameCategory || hasSharedTags;
                });

                setSimilarArticles(similar.slice(0, 3));
            } else {
                setBlog(null);
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

    if (loading) return <p>Loading...</p>;
    if (!blog) return <p>Blog not found</p>;

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
                    <div key={block.id} className="mb-8">
                        <Markdown className="prose lg:prose-xl mx-auto text-gray-800">
                            {block.body}
                        </Markdown>
                    </div>
                );
            case 'shared.editor':
                return (
                    <div key={block.id} className="mb-8 prose lg:prose-xl mx-auto text-gray-800">
                        {htmlParser(block.Ck_Editor)}
                    </div>
                );
            case 'shared.media':
                return (
                    <div key={block.id} className="mb-8">
                        {block.file && block.file.url ? (
                            <img
                                src={block.file.url}
                                alt={block.file.alternativeText || block.file.name}
                                className="w-full h-auto object-contain rounded-lg shadow-md"
                                loading="lazy"
                                onError={(e) => { e.target.onerror = null; e.target.src = '/fallback-image.jpg'; }}
                            />
                        ) : (
                            <p>Image not available</p>
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
                                                alt={file.alternativeText || file.name}
                                                className="w-full h-64 md:h-96 object-contain rounded-lg"
                                            />
                                        ) : (
                                            <p>Image URL missing</p>
                                        )}
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <p>No images available in the slider.</p>
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
                                        >
                                            <source
                                                src={video.url.startsWith('http') ? video.url : video.url}
                                                type={video.mime || 'video/mp4'}
                                            />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Video not available</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    const getAuthors = () => {
        const authors = [];
        if (blog.author && blog.author.name) authors.push(blog.author.name);
        if (blog.authors_2 && blog.authors_2.length > 0) {
            blog.authors_2.forEach(auth => {
                if (auth.name) authors.push(auth.name);
            });
        }
        return authors.join(', ');
    };

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto" data-aos="fade-up">
                    <Link to="/blogs" className="flex items-center text-primaryBlue2 hover:underline mb-4">
                        <FaArrowLeft className="mr-2" /> Back to Blogs
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primaryBlue text-center">
                        {blog.title}
                    </h1>
                
                    <div className="flex flex-col md:flex-row justify-center items-center mb-6 space-y-2 md:space-y-0 md:space-x-4">
                        {blog.category && blog.category.name && (
                            <Link
                                to={`/categories/${blog.category.slug}`}
                                className="flex items-center bg-primaryBlue2 text-white text-sm px-3 py-1 rounded-full hover:bg-blue-600 transition-colors duration-300"
                                aria-label={`Category ${blog.category.name}`}
                            >
                                <FaFolder className="mr-1" /> {blog.category.name}
                            </Link>
                        )}

                        {getAuthors() && (
                            <div className="flex items-center text-gray-700 text-sm">
                                <FaUser className="mr-1" /> By {getAuthors()}
                            </div>
                        )}

                        <div className="flex items-center text-gray-700 text-sm">
                            <FaRegClock className="mr-1" /> {blog.readingTime ? `${blog.readingTime} min read` : 'N/A'}
                        </div>
                    </div>
                    {blog.cover && blog.cover.url && (
                        <div className="relative mt-16">
                            <img
                                src={blog.cover.url}
                                alt={blog.title}
                                className="w-full h-80 object-cover rounded-lg shadow-lg"
                                onError={(e) => { e.target.onerror = null; e.target.src = '/fallback-image.jpg'; }}
                            />
                        </div>
                    )}

                    <div className="prose lg:prose-xl mx-auto text-gray-800 mb-6">
                        {blog.Body && blog.Body?.map((block) => renderDynamicZone(block))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogDetails;
