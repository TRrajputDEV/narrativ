// src/components/PostCard.jsx
// Optimized PostCard using SmartImage component

import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'
import SmartImage from './SmartImage'

function PostCard({ $id, title, featuredImage }) {
    const handleImageError = (error) => {
        console.error(`PostCard image error for post ${$id}:`, {
            title,
            featuredImage,
            error: error.message
        });
    };

    const handleImageLoad = () => {
        console.log(`PostCard image loaded successfully for post ${$id}`);
    };

    return (
        <Link to={`/post/${$id}`} className="block">
            <article className='w-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100'>
                {/* Image container with fixed aspect ratio */}
                <div className='w-full h-48 bg-gray-100'>
                    <SmartImage
                        src={featuredImage ? appwriteService.getOptimizedPreview(featuredImage, 'card') : null}
                        alt={title}
                        className="w-full h-full"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        dimensions={{ width: 400, height: 300 }}
                        lazy={true}
                        retries={2}
                    />
                </div>
                
                {/* Content */}
                <div className="p-4">
                    <h2 className='text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2'>
                        {title}
                    </h2>
                    
                    {/* Optional: Add excerpt or metadata */}
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span>Read more →</span>
                    </div>
                </div>
            </article>
        </Link>
    )
}

export default PostCard