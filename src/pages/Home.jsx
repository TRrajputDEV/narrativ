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
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        setLoading(true);
        
        const fetchPosts = async () => {
            try {
                const allPosts = await appwriteService.getPosts();
                if (allPosts) {
                    // Get user posts if logged in
                    if (userData) {
                        const userPosts = allPosts.documents.filter(
                            post => post.userId === userData.$id
                        );
                        setPosts(userPosts);
                    }
                    
                    // Get featured posts (prioritize featured, fallback to recent)
                    const featured = allPosts.documents
                        .filter(post => post.featured)
                        .slice(0, 4);
                    
                    if (featured.length > 0) {
                        setFeaturedPosts(featured);
                    } else {
                        // If no featured posts, show most recent posts
                        const recent = [...allPosts.documents]
                            .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt))
                            .slice(0, 4);
                        setFeaturedPosts(recent);
                    }
                    
                    // Get trending posts (most viewed)
                    const trending = [...allPosts.documents]
                        .sort((a, b) => (b.views || 0) - (a.views || 0))
                        .slice(0, 3);
                    setTrendingPosts(trending);
                }
            } catch (err) {
                console.error("Error fetching posts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [userData]);

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-16 md:py-24 text-white">
                <Container className="text-center max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Welcome to <span className="text-white">Narrativ</span>
                    </h1>
                    <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                        Where stories come alive and voices echo across the digital realm. 
                        Share your narrative with the world.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {userData ? (
                            <Link to="/add-post">
                                <Button className="flex items-center gap-2 font-medium px-6 py-3.5 rounded-xl shadow-md transition-all">
                                    ✍️ Create New Story
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-medium px-6 py-3.5 rounded-xl shadow-md transition-all">
                                        🔑 Login to Your Account
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="flex items-center gap-2  font-medium px-6 py-3.5 rounded-xl shadow-md transition-all">
                                        ✨ Join Narrativ
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </Container>
            </div>

            <Container className="py-12">
                {/* Featured Stories - Always shows content */}
                <div className="mb-16">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {featuredPosts.some(post => post.featured) 
                                    ? "Featured Stories" 
                                    : "Recent Stories"}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {featuredPosts.some(post => post.featured)
                                    ? "Editor's picks of captivating narratives"
                                    : "Latest stories from our community"}
                            </p>
                        </div>
                        <Link to="/all-posts" className="text-blue-600 hover:text-blue-800 font-medium">
                            View all stories →
                        </Link>
                    </div>
                    
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                    <div className="animate-pulse">
                                        <div className="bg-gray-200 h-48 w-full" />
                                        <div className="p-5">
                                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredPosts.map((post) => (
                                <PostCard 
                                    key={post.$id} 
                                    {...post} 
                                    className="transition-transform hover:scale-[1.02]"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Trending Stories */}
                {!loading && trendingPosts.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Trending Stories</h2>
                                <p className="text-gray-600 mt-1">Most popular stories this week</p>
                            </div>
                            <Link to="/all-posts" className="text-blue-600 hover:text-blue-800 font-medium">
                                See more trends →
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {trendingPosts.map((post, index) => (
                                <div 
                                    key={post.$id} 
                                    className={`bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 ${index === 0 ? 'lg:col-span-2' : ''}`}
                                >
                                    <PostCard 
                                        {...post} 
                                        variant={index === 0 ? "large" : "normal"}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* User's Stories (only if logged in) */}
                {userData && (
                    <div className="mb-16">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Your Stories</h2>
                                <p className="text-gray-600 mt-1">Your published narratives</p>
                            </div>
                            <Link to="/add-post" className="text-blue-600 hover:text-blue-800 font-medium">
                                + New Story
                            </Link>
                        </div>
                        
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                                        <div className="animate-pulse">
                                            <div className="bg-gray-200 h-48 w-full" />
                                            <div className="p-5">
                                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                                <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : posts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {posts.map((post) => (
                                    <PostCard 
                                        key={post.$id} 
                                        {...post} 
                                        className="transition-transform hover:scale-[1.02]"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl bg-white">
                                <div className="text-5xl mb-4">📖</div>
                                <h3 className="text-xl font-medium text-gray-700 mb-2">
                                    Your story starts here
                                </h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    You haven't published any stories yet. Share your first story with the world!
                                </p>
                                <div className="mt-6">
                                    <Link to="/add-post">
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg">
                                            Create Your First Story
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Community Stats */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 border border-blue-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">1K+</div>
                            <div className="text-gray-700 font-medium">Stories Shared</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
                            <div className="text-gray-700 font-medium">Active Writers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-violet-600 mb-2">10K+</div>
                            <div className="text-gray-700 font-medium">Readers Engaged</div>
                        </div>
                    </div>
                    <div className="text-center mt-8">
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Join our growing community of storytellers and readers who are sharing and discovering 
                            compelling narratives every day.
                        </p>
                        {!userData && (
                            <div className="mt-6">
                                <Link to="/signup">
                                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium px-6 py-3 rounded-lg">
                                        Become a Storyteller
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Home;