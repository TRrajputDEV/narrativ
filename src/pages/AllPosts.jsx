import React, { useState, useEffect } from 'react'
import { Container, PostCard } from '../components'
import appwriteService from '../appwrite/config'

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        appwriteService.getPosts([]).then((posts) => {
            if (posts) setPosts(posts.documents)
            setLoading(false)
        })
    }, [])

    const filteredPosts = posts.filter((post) =>
        post?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="w-full py-8 min-h-screen bg-gray-50">
            <Container>
                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search blogs by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 w-full max-w-md rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    />
                </div>

                {loading ? (
                    <div className="text-center text-gray-500 text-xl py-16">
                        Loading blogs...
                    </div>
                ) : filteredPosts.length === 0 && searchQuery ? (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                        <img
                            src="https://media.giphy.com/media/UHAYP0FxJOmFBuOiC2/giphy.gif"
                            alt="Not found"
                            className="w-64 h-64 object-contain"
                        />
                        <p className="mt-4 text-xl font-semibold text-gray-600">
                            Sorry, no blog found!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredPosts.map((post) => (
                            <PostCard key={post.$id} {...post} />
                        ))}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default AllPosts
