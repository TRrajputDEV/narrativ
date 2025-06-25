import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import SmartImage from "../components/SmartImage";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { FaArrowUp, FaEdit, FaTrash } from "react-icons/fa";

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const contentRef = useRef(null);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Handle scroll events for scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch post data
    useEffect(() => {
        if (slug) {
            setLoading(true);
            setError(null);
            
            appwriteService.getPost(slug)
                .then((post) => {
                    if (post) {
                        setPost(post);
                        console.log("Post loaded successfully:", {
                            id: post.$id,
                            title: post.title,
                            featuredImage: post.featuredImage
                        });
                    } else {
                        setError("Post not found");
                        setTimeout(() => navigate("/"), 3000);
                    }
                })
                .catch((err) => {
                    console.error("Failed to load post:", err);
                    setError("Failed to load post. Please try again.");
                    setTimeout(() => navigate("/"), 3000);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const handleImageError = (error) => {
        console.error(`Featured image error for post ${post?.$id}:`, {
            featuredImage: post?.featuredImage,
            error: error.message
        });
    };

    const handleImageLoad = () => {
        console.log(`Featured image loaded successfully for post ${post?.$id}`);
        setImageLoaded(true);
    };

    const deletePost = () => {
        setLoading(true);
        
        appwriteService.deletePost(post.$id)
            .then((status) => {
                if (status) {
                    // Delete associated image
                    if (post.featuredImage) {
                        appwriteService.deleteFile(post.featuredImage);
                    }
                    navigate("/");
                } else {
                    alert("Failed to delete post. Please try again.");
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error("Delete post error:", error);
                alert("An error occurred while deleting the post.");
                setLoading(false);
            });
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
                <Container>
                    <div className="py-8 md:py-16">
                        {/* Title Skeleton */}
                        <div className="max-w-3xl mx-auto mb-8">
                            <div className="h-10 bg-gray-200 rounded-xl mb-6 w-3/4 mx-auto"></div>
                            <div className="h-4 bg-gray-200 rounded-xl mb-4 w-1/2 mx-auto"></div>
                        </div>

                        {/* Featured Image Skeleton */}
                        <div className="aspect-video bg-gray-200 rounded-xl mb-12"></div>

                        {/* Content Skeleton */}
                        <div className="max-w-3xl mx-auto space-y-4">
                            {[...Array(8)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className="h-4 bg-gray-200 rounded-xl"
                                    style={{width: `${Math.random() * 40 + 60}%`}}
                                ></div>
                            ))}
                            <div className="h-4 bg-gray-200 rounded-xl w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded-xl w-full"></div>
                            <div className="h-4 bg-gray-200 rounded-xl w-5/6"></div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center">
                <Container>
                    <div className="text-center max-w-md mx-auto">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-50 to-orange-50 mb-5">
                                <span className="text-2xl">⚠️</span>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <p className="text-gray-500 mb-8">Redirecting to home page...</p>
                            <Button 
                                onClick={() => navigate("/")} 
                                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-lg"
                            >
                                Take Me Home
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    return post ? (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-green-50">
            {/* Scroll to top button */}
            {showScrollTop && (
                <button 
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    aria-label="Scroll to top"
                >
                    <FaArrowUp />
                </button>
            )}

            <Container>
                <div className="py-10 grid gap-10 max-w-4xl mx-auto">
                    {/* Title & Meta */}
                    <div className="grid gap-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                            {post.title}
                        </h1>
                        
                        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
                            <span>
                                {new Date(post.$createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                            {post.$updatedAt !== post.$createdAt && (
                                <span className="text-emerald-600 flex items-center">
                                    <span className="mr-1">•</span> Updated {new Date(post.$updatedAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Featured Image */}
                    {post.featuredImage && (
                        <div className="w-full rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 aspect-video">
                            <SmartImage
                                src={appwriteService.getOptimizedPreview(post.featuredImage, 'banner')}
                                alt={post.title}
                                className="w-full h-full object-cover transition-opacity duration-500"
                                style={{ opacity: imageLoaded ? 1 : 0 }}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                dimensions={{ width: 800, height: 450 }}
                                lazy={false}
                                retries={2}
                                showErrorBadge={true}
                            />
                        </div>
                    )}

                    {/* Content */}
                    <article 
                        ref={contentRef}
                        className="prose prose-lg max-w-none bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100"
                    >
                        {parse(post.content)}
                    </article>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4 justify-between items-center">
                        <Link
                            to="/all-posts"
                            className="inline-flex items-center gap-2 text-emerald-600 hover:text-green-700 font-medium"
                        >
                            <span>←</span>
                            Back to Stories
                        </Link>
                        {isAuthor && (
                            <div className="flex gap-3">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg">
                                        <FaEdit /> Edit
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2.5 rounded-lg"
                                >
                                    <FaTrash /> Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Container>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg border border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Delete this story?</h3>
                        <p className="text-gray-600 mb-6">This action cannot be undone. The story will be permanently removed.</p>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    deletePost();
                                }}
                                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    ) : null;
}