import React, { useState, useEffect } from 'react'
import { Container, PostCard } from '../components'
import appwriteService from '../appwrite/config'

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        appwriteService.getPosts([])
            .then((posts) => {
                if (posts) {
                    setPosts(posts.documents)
                } else {
                    setError("No posts found")
                }
            })
            .catch((error) => {
                console.error("Error fetching posts:", error)
                setError("Failed to load posts. Please try again later.")
            })
            .finally(() => setLoading(false))
    }, [])

    const filteredPosts = posts.filter((post) =>
        post?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post?.content?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 via-white to-green-50">
            {/* Minimal Hero Section */}
            <div className="py-12 md:py-16 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-green-50">
                <Container className="text-center max-w-3xl">
                    <h1 className="text-3xl md:text-4xl font-bold mb-5">
                        <span className="bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                            Explore Stories
                        </span>
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                        Discover inspiring narratives and creative ideas from our community
                    </p>
                    
                    <div className="relative max-w-xl mx-auto">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search stories, topics, or authors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-10 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 bg-white text-gray-700 placeholder:text-gray-400 shadow-sm transition-all"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-emerald-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </Container>
            </div>

            <Container className="py-12">
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-1 bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                            {searchQuery ? "Search Results" : "All Stories"}
                        </h2>
                        <p className="text-gray-600">
                            {searchQuery 
                                ? `Showing ${filteredPosts.length} of ${posts.length} stories` 
                                : "Browse our collection of community stories"}
                        </p>
                    </div>
                    
                    {filteredPosts.length > 0 && (
                        <div className="bg-emerald-50 rounded-lg py-1.5 px-3 text-emerald-700 font-medium">
                            {filteredPosts.length} {filteredPosts.length === 1 ? 'Story' : 'Stories'}
                        </div>
                    )}
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
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
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-50 to-orange-50 mb-5">
                                <span className="text-2xl">⚠️</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h3>
                        <p className="text-gray-600 max-w-md mb-6">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-all duration-300"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-50 to-green-50 mb-5">
                                <span className="text-2xl text-emerald-600">📝</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {searchQuery ? "No matches found" : "No stories yet"}
                        </h3>
                        <p className="text-gray-600 max-w-md mb-6">
                            {searchQuery 
                                ? `We couldn't find any stories matching "${searchQuery}"` 
                                : "Be the first to share your story with the community!"}
                        </p>
                        {!searchQuery && (
                            <a 
                                href="/add-post" 
                                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-all duration-300"
                            >
                                ✍️ Create Your First Story
                            </a>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <PostCard 
                                key={post.$id} 
                                {...post} 
                                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-emerald-100" 
                            />
                        ))}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default AllPosts