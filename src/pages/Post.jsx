import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import SmartImage from "../components/SmartImage";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
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
            <div className="min-h-screen bg-background animate-fadeIn">
                <Container>
                    <div className="py-8 md:py-16">
                        {/* Title Skeleton */}
                        <div className="max-w-3xl mx-auto mb-8">
                            <div className="h-10 bg-muted rounded-xl mb-6 w-3/4 mx-auto animate-pulse"></div>
                            <div className="h-4 bg-muted rounded-xl mb-4 w-1/2 mx-auto animate-pulse"></div>
                        </div>

                        {/* Featured Image Skeleton */}
                        <div className="aspect-video bg-muted rounded-xl mb-12 animate-pulse"></div>

                        {/* Content Skeleton */}
                        <div className="max-w-3xl mx-auto space-y-4">
                            {[...Array(8)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className="h-4 bg-muted rounded-xl animate-pulse"
                                    style={{width: `${Math.random() * 40 + 60}%`}}
                                ></div>
                            ))}
                            <div className="h-4 bg-muted rounded-xl w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-muted rounded-xl w-full animate-pulse"></div>
                            <div className="h-4 bg-muted rounded-xl w-5/6 animate-pulse"></div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center animate-fadeIn">
                <Container>
                    <div className="text-center max-w-md mx-auto">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-5">
                                <span className="text-2xl">⚠️</span>
                            </div>
                        </div>
                        <div className="bg-card rounded-2xl border border-border shadow-lg p-8">
                            <h1 className="text-2xl font-black text-foreground mb-4 doto-heading">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-muted-foreground mb-6">{error}</p>
                            <p className="text-muted-foreground mb-8">Redirecting to home page...</p>
                            <Button 
                                onClick={() => navigate("/")} 
                                className="bg-white hover:bg-white/90 text-black px-6 py-3 rounded-lg hover:scale-105 doto-button"
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
        <div className="min-h-screen bg-background animate-fadeIn">
            {/* Scroll to top button */}
            {showScrollTop && (
                <button 
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white text-black shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    aria-label="Scroll to top"
                >
                    <FaArrowUp />
                </button>
            )}

            <Container>
                <div className="py-10 grid gap-10 max-w-4xl mx-auto">
                    {/* Title & Meta */}
                    <div className="grid gap-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-black text-white doto-heading">
                            {post.title}
                        </h1>
                        
                        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                            <span>
                                {new Date(post.$createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                            {post.$updatedAt !== post.$createdAt && (
                                <span className="text-white flex items-center">
                                    <span className="mr-1">•</span> Updated {new Date(post.$updatedAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Featured Image */}
                    {post.featuredImage && (
                        <div className="w-full rounded-xl overflow-hidden bg-muted border-2 border-border aspect-video shadow-lg">
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
                        className="prose prose-lg max-w-none bg-card rounded-xl p-6 md:p-8 shadow-lg border border-border"
                    >
                        {parse(DOMPurify.sanitize(post.content))}
                    </article>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4 justify-between items-center">
                        <Link
                            to="/all-posts"
                            className="inline-flex items-center gap-2 text-white hover:text-muted-foreground font-medium transition-colors"
                        >
                            <span>←</span>
                            Back to Stories
                        </Link>
                        {isAuthor && (
                            <div className="flex gap-3">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button className="flex items-center gap-2 bg-card hover:bg-muted text-foreground border border-border px-4 py-2.5 rounded-lg hover:scale-105 doto-button">
                                        <FaEdit /> Edit
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2.5 rounded-lg hover:scale-105 doto-button"
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
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-card rounded-xl p-6 max-w-md w-full shadow-2xl border border-border">
                        <h3 className="text-xl font-black text-foreground mb-3 doto-heading">Delete this story?</h3>
                        <p className="text-muted-foreground mb-6">This action cannot be undone. The story will be permanently removed.</p>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 bg-muted hover:bg-border text-foreground doto-button"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    deletePost();
                                }}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white doto-button"
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
