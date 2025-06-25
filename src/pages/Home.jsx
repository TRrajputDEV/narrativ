import React, { useEffect, useState, useCallback } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Home() {
    const [posts, setPosts] = useState([]);
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const userData = useSelector((state) => state.auth.userData);
    const isAuthenticated = userData !== null;

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const allPosts = await appwriteService.getPosts();
            if (allPosts && allPosts.documents) {
                // Get user posts if logged in
                if (isAuthenticated && userData) {
                    const userPosts = allPosts.documents.filter(
                        post => post.userId === userData.$id
                    );
                    setPosts(userPosts);
                } else {
                    setPosts([]);
                }
                
                // Get featured posts
                const featured = allPosts.documents
                    .filter(post => post.featured)
                    .slice(0, 6);
                
                if (featured.length > 0) {
                    setFeaturedPosts(featured);
                } else {
                    // If no featured posts, show most recent
                    const recent = [...allPosts.documents]
                        .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
                        .slice(0, 6);
                    setFeaturedPosts(recent);
                }
                
                // Get trending posts
                const trending = [...allPosts.documents]
                    .sort((a, b) => (b.views || 0) - (a.views || 0))
                    .slice(0, 4);
                setTrendingPosts(trending);
            } else {
                setPosts([]);
                setFeaturedPosts([]);
                setTrendingPosts([]);
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
            
            if (err.message?.includes('network') || err.message?.includes('fetch')) {
                setError("Network error. Please check your connection.");
            } else if (err.code === 401 || err.message?.includes('unauthorized')) {
                if (retryCount < 2) {
                    setRetryCount(prev => prev + 1);
                    setTimeout(() => fetchPosts(), 1000);
                    return;
                }
            } else {
                setError("Failed to load content. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, userData, retryCount]);

    useEffect(() => {
        setRetryCount(0);
        setError(null);
        
        const timeoutId = setTimeout(() => {
            fetchPosts();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [userData, isAuthenticated]);

    const handleRetry = () => {
        setRetryCount(0);
        fetchPosts();
    };

    const LoadingSkeleton = ({ count = 6, variant = "card" }) => (
        <div className={`grid gap-6 ${
            variant === "hero" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : variant === "trending"
                ? "grid-cols-2 md:grid-cols-4"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}>
            {[...Array(count)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-200 h-48 w-full" />
                        <div className="p-5">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const EmptyState = ({ 
        title, 
        description, 
        actionText, 
        actionLink
    }) => (
        <div className="text-center py-12 border border-gray-200 rounded-2xl bg-white">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-50 to-green-50 mb-5">
                <span className="text-2xl text-emerald-600">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">{description}</p>
            {actionText && actionLink && (
                <Link to={actionLink}>
                    <button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-all duration-300">
                        {actionText}
                    </button>
                </Link>
            )}
        </div>
    );

    if (error) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center">
                <Container>
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-50 to-orange-50 mb-5">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button 
                            onClick={handleRetry}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-all duration-300"
                        >
                            Try Again
                        </button>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 ">
            
            <Container className="py-12">
                {/* Featured Stories */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8 ">
                        <div>
                            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent p-4">
                                {featuredPosts.some(post => post.featured) 
                                    ? "Featured Stories" 
                                    : "Latest Stories"}
                            </h2>
                            <p className="text-gray-600">
                                {featuredPosts.some(post => post.featured)
                                    ? "Handpicked narratives that captivate and inspire"
                                    : "Fresh stories from our community"}
                            </p>
                        </div>
                        <Link 
                            to="/all-posts" 
                            className="hidden md:flex items-center gap-1 text-emerald-600 hover:text-green-700 font-medium transition-colors"
                        >
                            View All <span>→</span>
                        </Link>
                    </div>
                    
                    {loading ? (
                        <LoadingSkeleton count={6} variant="hero" />
                    ) : featuredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredPosts.map((post) => (
                                <PostCard 
                                    key={post.$id} 
                                    {...post} 
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-emerald-100" 
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No Stories Yet"
                            description="Be the first to share your story with our community"
                            actionText={isAuthenticated ? "Write First Story" : "Join to View Posts"}
                            actionLink={isAuthenticated ? "/add-post" : "/signup"}
                        />
                    )}
                    
                    <div className="md:hidden text-center mt-6">
                        <Link 
                            to="/all-posts" 
                            className="inline-flex items-center gap-1 text-emerald-600 hover:text-green-700 font-medium"
                        >
                            View All <span>→</span>
                        </Link>
                    </div>
                </div>

                {/* Trending Stories */}
                {!loading && trendingPosts.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                                    Trending Stories
                                </h2>
                                <p className="text-gray-600">
                                    Most loved stories by our community
                                </p>
                            </div>
                            <Link 
                                to="/all-posts" 
                                className="hidden md:flex items-center gap-1 text-emerald-600 hover:text-green-700 font-medium transition-colors"
                            >
                                See More <span>→</span>
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {trendingPosts.map((post) => (
                                <PostCard 
                                    key={post.$id} 
                                    {...post} 
                                    compact={true}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-emerald-100" 
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* User's Stories */}
                {isAuthenticated && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                                    Your Stories
                                </h2>
                                <p className="text-gray-600">
                                    Your published narratives
                                </p>
                            </div>
                            <Link 
                                to="/add-post" 
                                className="hidden md:flex items-center gap-1 text-emerald-600 hover:text-green-700 font-medium transition-colors"
                            >
                                + New Story
                            </Link>
                        </div>
                        
                        {loading ? (
                            <LoadingSkeleton count={3} />
                        ) : posts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {posts.map((post) => (
                                    <PostCard 
                                        key={post.$id} 
                                        {...post} 
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-emerald-100" 
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title="Your Story Awaits"
                                description="Share your first masterpiece with the world"
                                actionText="Create Story"
                                actionLink="/add-post"
                            />
                        )}
                    </div>
                )}
            </Container>
        </div>
    );
}

export default Home;