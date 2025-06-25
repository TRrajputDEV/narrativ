import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard, Button } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Home() {
    const [posts, setPosts] = useState([]);
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userData = useSelector((state) => state.auth.userData);
    const isAuthenticated = userData !== null;

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        const fetchPosts = async () => {
            try {
                const allPosts = await appwriteService.getPosts();
                if (allPosts && allPosts.documents) {
                    // Get user posts if logged in
                    if (isAuthenticated) {
                        const userPosts = allPosts.documents.filter(
                            post => post.userId === userData.$id
                        );
                        setPosts(userPosts);
                    }
                    
                    // Get featured posts (prioritize featured, fallback to recent)
                    const featured = allPosts.documents
                        .filter(post => post.featured)
                        .slice(0, 6);
                    
                    if (featured.length > 0) {
                        setFeaturedPosts(featured);
                    } else {
                        // If no featured posts, show most recent posts
                        const recent = [...allPosts.documents]
                            .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
                            .slice(0, 6);
                        setFeaturedPosts(recent);
                    }
                    
                    // Get trending posts (most viewed)
                    const trending = [...allPosts.documents]
                        .sort((a, b) => (b.views || 0) - (a.views || 0))
                        .slice(0, 4);
                    setTrendingPosts(trending);
                }
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError("Failed to load content. Please Reload the Page");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [userData, isAuthenticated]);

    const LoadingSkeleton = ({ count = 6, variant = "card" }) => (
        <div className={`grid gap-8 ${
            variant === "hero" 
                ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" 
                : variant === "trending"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}>
            {[...Array(count)].map((_, i) => (
                <div key={i} className="group">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                        <div className="animate-pulse">
                            <div className="bg-gray-200 h-56 w-full" />
                            <div className="p-6">
                                <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                                <div className="flex items-center justify-between">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const EmptyState = ({ 
        icon, 
        title, 
        description, 
        actionText, 
        actionLink, 
        className = "" 
    }) => (
        <div className={`text-center py-16 ${className}`}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 mb-6">
                <span className="text-4xl">{icon}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">{description}</p>
            {actionText && actionLink && (
                <Link to={actionLink}>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        {actionText}
                    </Button>
                </Link>
            )}
        </div>
    );

    const StatsSection = () => (
        <div className="relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"></div>
            <div className="relative px-8 py-16 md:py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Join Our Growing Community
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Where storytellers connect, share, and inspire readers worldwide
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {[
                        { number: "12K+", label: "Stories Published", color: "from-blue-500 to-blue-600" },
                        { number: "3.2K+", label: "Active Writers", color: "from-indigo-500 to-indigo-600" },
                        { number: "85K+", label: "Monthly Readers", color: "from-purple-500 to-purple-600" }
                    ].map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                <span className="text-2xl text-white font-bold">
                                    {stat.number.charAt(0)}
                                </span>
                            </div>
                            <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                                {stat.number}
                            </div>
                            <div className="text-lg font-semibold text-gray-700">{stat.label}</div>
                        </div>
                    ))}
                </div>
                
                {!isAuthenticated && (
                    <div className="text-center">
                        <div className="inline-flex items-center gap-4">
                            <Link to="/signup">
                                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    Start Writing Today
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    if (error) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <Container>
                    <EmptyState
                        icon="⚠️"
                        title="Oops! it must have been wind"
                        description={error}
                        actionText="Reload the Page"
                        actionLink="/"
                        className="py-20"
                    />
                </Container>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
                
                <div className="relative py-20 md:py-28 text-white">
                    <Container className="text-center">
                        <div className="max-w-4xl mx-auto">
                            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/20">
                                <span className="text-sm font-medium text-blue-200">✨ Premium Storytelling Platform</span>
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                                Welcome to{" "}
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                    Narrativ
                                </span>
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                                Where extraordinary stories come to life and voices echo across the digital realm. 
                                Share your narrative with a community that celebrates creativity.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                {isAuthenticated ? (
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link to="/add-post">
                                            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3">
                                                <span className="text-lg">✍️</span>
                                                Create New Story
                                            </Button>
                                        </Link>
                                        <Link to="/all-posts">
                                            <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 flex items-center gap-3">
                                                <span className="text-lg">📚</span>
                                                Explore Stories
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link to="/signup">
                                            <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3">
                                                <span className="text-lg">✨</span>
                                                Join Narrativ
                                            </Button>
                                        </Link>
                                        <Link to="/login">
                                            <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 flex items-center gap-3">
                                                <span className="text-lg">🔑</span>
                                                Sign In
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Container>
                </div>
            </div>

            <Container className="py-16 md:py-20">
                {/* Featured Stories Section */}
                <div className="mb-20 mt-20">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                                {featuredPosts.some(post => post.featured) 
                                    ? "Featured Stories" 
                                    : "Latest Stories"}
                            </h2>
                            <p className="text-lg text-gray-600">
                                {featuredPosts.some(post => post.featured)
                                    ? "Handpicked narratives that captivate and inspire"
                                    : "Fresh stories from our talented community"}
                            </p>
                        </div>
                        <Link 
                            to="/all-posts" 
                            className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors duration-200"
                        >
                            View All Stories
                            <span className="text-xl">→</span>
                        </Link>
                    </div>
                    
                    {loading ? (
                        <LoadingSkeleton count={6} variant="hero" />
                    ) : featuredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredPosts.map((post, index) => (
                                <div key={post.$id} className="group">
                                    <PostCard 
                                        {...post} 
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon="📚"
                            title="No Stories Yet"
                            description="Be the first to share your story with our community"
                            actionText={isAuthenticated ? "Write First Story" : "Join to Write"}
                            actionLink={isAuthenticated ? "/add-post" : "/signup"}
                        />
                    )}
                    
                    <div className="md:hidden text-center mt-8">
                        <Link 
                            to="/all-posts" 
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                        >
                            View All Stories
                            <span className="text-xl">→</span>
                        </Link>
                    </div>
                </div>

                {/* Trending Stories */}
                {!loading && trendingPosts.length > 0 && (
                    <div className="mb-20">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                                    Trending Stories
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Most loved stories by our community this week
                                </p>
                            </div>
                            <Link 
                                to="/all-posts" 
                                className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors duration-200"
                            >
                                See More
                                <span className="text-xl">→</span>
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {trendingPosts.map((post, index) => (
                                <div key={post.$id} className="group">
                                    <PostCard 
                                        {...post} 
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* User's Stories (only if authenticated) */}
                {isAuthenticated && (
                    <div className="mb-20">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                                    Your Stories
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Your published narratives and creative works
                                </p>
                            </div>
                            <Link 
                                to="/add-post" 
                                className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors duration-200"
                            >
                                + New Story
                            </Link>
                        </div>
                        
                        {loading ? (
                            <LoadingSkeleton count={3} />
                        ) : posts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {posts.map((post) => (
                                    <div key={post.$id} className="group">
                                        <PostCard 
                                            {...post} 
                                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon="📝"
                                title="Your Story Awaits"
                                description="You haven't published any stories yet. Share your first masterpiece with the world and start building your readership."
                                actionText="Create Your First Story"
                                actionLink="/add-post"
                            />
                        )}
                    </div>
                )}
            </Container>

            {/* Community Stats */}
            <StatsSection />
        </div>
    );
}

export default Home;