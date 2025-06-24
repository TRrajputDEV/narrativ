// src/pages/Post.jsx
// Optimized Post page using SmartImage component

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import SmartImage from "../components/SmartImage";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

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
    };

    const deletePost = () => {
        if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
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
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="py-8">
                <Container>
                    <div className="animate-pulse">
                        {/* Featured image skeleton */}
                        <div className="w-full h-64 md:h-96 bg-gray-200 rounded-xl mb-6"></div>
                        
                        {/* Title skeleton */}
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        
                        {/* Content skeleton */}
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="py-8">
                <Container>
                    <div className="text-center max-w-md mx-auto">
                        <div className="text-6xl mb-4">😞</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
                        <p className="text-red-600 text-lg mb-4">{error}</p>
                        <p className="text-gray-600 mb-6">Redirecting to home page...</p>
                        <Button 
                            onClick={() => navigate("/")} 
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            Go Home Now
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }

    return post ? (
        <div className="py-8">
            <Container>
                {/* Featured Image Section */}
                <div className="w-full mb-8 relative">
                    <div className="aspect-video md:aspect-[21/9] bg-gray-100 rounded-xl overflow-hidden border shadow-sm">
                        <SmartImage
                            src={post.featuredImage ? appwriteService.getOptimizedPreview(post.featuredImage, 'banner') : null}
                            alt={post.title}
                            className="w-full h-full"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            dimensions={{ width: 1200, height: 600 }}
                            lazy={false} // Load immediately for featured image
                            retries={3}
                            showErrorBadge={true}
                        />
                    </div>

                    {/* Author Actions */}
                    {isAuthor && (
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button 
                                    bgColor="bg-green-500" 
                                    className="hover:bg-green-600 shadow-lg"
                                >
                                    <span className="flex items-center space-x-1">
                                        <span>✏️</span>
                                        <span>Edit</span>
                                    </span>
                                </Button>
                            </Link>
                            <Button 
                                bgColor="bg-red-500" 
                                className="hover:bg-red-600 shadow-lg"
                                onClick={deletePost}
                            >
                                <span className="flex items-center space-x-1">
                                    <span>🗑️</span>
                                    <span>Delete</span>
                                </span>
                            </Button>
                        </div>
                    )}
                </div>
                
                {/* Post Content */}
                <article className="max-w-4xl mx-auto">
                    {/* Title */}
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                            {post.title}
                        </h1>
                        
                        {/* Optional: Add metadata like date, author, etc. */}
                        <div className="mt-4 flex items-center text-sm text-gray-600">
                            <span>Published on {new Date(post.$createdAt).toLocaleDateString()}</span>
                            {post.$updatedAt !== post.$createdAt && (
                                <span className="ml-4">
                                    • Updated on {new Date(post.$updatedAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </header>
                    
                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <div className="text-gray-800 leading-relaxed">
                            {parse(post.content)}
                        </div>
                    </div>
                </article>

                {/* Back to Home Link */}
                <div className="mt-12 text-center">
                    <Link 
                        to="/" 
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                        <span>←</span>
                        <span>Back to All Posts</span>
                    </Link>
                </div>
            </Container>
        </div>
    ) : null;
}