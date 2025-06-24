
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
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
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

    // Modern Loading State with Shimmer Effect
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <Container>
                    <div className="py-8 md:py-16">
                        {/* Hero Section Skeleton */}
                        <div className="relative mb-16">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-red-400/20 rounded-3xl blur-3xl"></div>
                            <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                                <div className="animate-pulse">
                                    <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl mb-6 bg-[length:200%_100%] animate-shimmer"></div>
                                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl mb-4 w-3/4 bg-[length:200%_100%] animate-shimmer"></div>
                                </div>
                            </div>
                        </div>

                        {/* Featured Image Skeleton */}
                        <div className="relative mb-12">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-2xl"></div>
                            <div className="relative aspect-[21/9] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-3xl bg-[length:200%_100%] animate-shimmer"></div>
                        </div>

                        {/* Content Skeleton */}
                        <div className="max-w-4xl mx-auto">
                            <div className="animate-pulse space-y-6">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl bg-[length:200%_100%] animate-shimmer" style={{width: `${Math.random() * 40 + 60}%`}}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    // Modern Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center">
                <Container>
                    <div className="text-center max-w-md mx-auto">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-pink-400/20 to-orange-400/20 rounded-full blur-2xl"></div>
                            <div className="relative text-8xl animate-bounce">🚫</div>
                        </div>
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-red-600 text-lg mb-4 font-medium">{error}</p>
                            <p className="text-gray-600 mb-8">Redirecting to home page...</p>
                            <Button 
                                onClick={() => navigate("/")} 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
        <div className="min-h-screen bg-gray-50">
            <Container>
                <div className="py-10 grid gap-10 max-w-5xl mx-auto">
                    {/* Title & Meta */}
                    <div className="grid gap-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{post.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span>
                                {new Date(post.$createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                            {post.$updatedAt !== post.$createdAt && (
                                <span className="text-blue-500">Updated {new Date(post.$updatedAt).toLocaleDateString()}</span>
                            )}
                        </div>
                    </div>

                    {/* Featured Image */}
                    {post.featuredImage && (
                        <div className="w-full rounded-xl overflow-hidden bg-gray-100 border aspect-[16/7] flex items-center justify-center">
                            <SmartImage
                                src={appwriteService.getOptimizedPreview(post.featuredImage, 'banner')}
                                alt={post.title}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "opacity 0.5s",
                                    opacity: imageLoaded ? 1 : 0
                                }}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                dimensions={{ width: 600, height: 260 }}
                                lazy={false}
                                retries={2}
                                showErrorBadge={true}
                            />
                        </div>
                    )}

                    {/* Content */}
                    <article className="prose prose-slate max-w-none bg-white rounded-xl p-6 shadow border">
                        {parse(post.content)}
                    </article>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 justify-between items-center">
                        <Link
                            to="/all-posts"
                            className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
                        >
                            <span className="text-lg">←</span>
                            Back to All Posts
                        </Link>
                        {isAuthor && (
                            <div className="flex gap-2">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Edit</Button>
                                </Link>
                                <Button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Container>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg border">
                        <h3 className="text-lg font-semibold mb-2">Delete this post?</h3>
                        <p className="text-gray-600 mb-6 text-sm">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 bg-black hover:bg-slate-500 text-black"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    deletePost();
                                }}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
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

const styles = `
@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slide-up {
    from { 
        opacity: 0;
        transform: translateY(30px);
    }
    to { 
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fade-in-up {
    from { 
        opacity: 0;
        transform: translateY(20px);
    }
    to { 
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes scale-in {
    from { 
        opacity: 0;
        transform: scale(0.9);
    }
    to { 
        opacity: 1;
        transform: scale(1);
    }
}

.animate-shimmer {
    animation: shimmer 2s infinite;
}

.animate-fade-in {
    animation: fade-in 0.8s ease-out;
}

.animate-slide-up {
    animation: slide-up 0.8s ease-out 0.2s both;
}

.animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out 0.4s both;
}

.animate-scale-in {
    animation: scale-in 0.3s ease-out;
}
`;