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
        <div className="w-full min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-16 text-white">
                <Container className="text-center max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Explore Stories & Ideas
                    </h1>
                    <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                        Discover inspiring stories, helpful tutorials, and creative ideas from our community
                    </p>
                    
                    <div className="relative max-w-xl mx-auto">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search stories, topics, or authors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-12 py-3.5 rounded-xl border-0 focus:ring-2 focus:ring-white focus:ring-opacity-30 bg-white bg-opacity-10 backdrop-blur-sm text-white placeholder:text-gray-200 text-lg"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-300 hover:text-white transition-colors"
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
                    <h2 className="text-2xl font-bold text-neutral-800">
                        {searchQuery ? "Search Results" : "All Stories"}
                        {searchQuery && filteredPosts.length > 0 && (
                            <span className="text-base font-normal text-neutral-500 ml-2">
                                ({filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'})
                            </span>
                        )}
                    </h2>
                    
                    <div className="text-sm text-neutral-500">
                        Showing {filteredPosts.length} of {posts.length} stories
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100">
                                <div className="animate-pulse">
                                    <div className="bg-gray-200 h-48 w-full" />
                                    <div className="p-6">
                                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                                        <div className="flex items-center mt-4">
                                            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                                            <div className="ml-3">
                                                <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                                                <div className="h-2 bg-gray-200 rounded w-16"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-neutral-200">
                        <div className="mb-6 text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-800 mb-2">Something went wrong</h3>
                        <p className="text-neutral-600 max-w-md mb-6">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border-2 border-dashed border-neutral-300">
                        <div className="mb-6 text-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-800 mb-3">
                            {searchQuery ? "No matches found" : "No stories yet"}
                        </h3>
                        <p className="text-neutral-600 max-w-md mb-8 text-lg">
                            {searchQuery 
                                ? `We couldn't find any stories matching "${searchQuery}"` 
                                : "Be the first to share your story with the community!"}
                        </p>
                        {!searchQuery && (
                            <a 
                                href="/add-post" 
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                            >
                                ✍️ Create Your First Story
                            </a>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <PostCard 
                                key={post.$id} 
                                {...post} 
                                className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1" 
                            />
                        ))}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default AllPosts