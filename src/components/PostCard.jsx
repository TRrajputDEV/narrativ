import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'
import SmartImage from './SmartImage'

function PostCard({ $id, title, featuredImage, className = "", compact = false }) {
    const handleImageError = (error) => {
        console.error(`PostCard image error for post ${$id}:`, {
            title,
            featuredImage,
            error: error.message
        })
    }

    const handleImageLoad = () => {
        console.log(`PostCard image loaded successfully for post ${$id}`)
    }

    return (
        <Link 
            to={`/post/${$id}`} 
            className={`block group ${className}`}
            aria-label={`Read "${title}"`}
        >
            <article className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                {/* Image with subtle gradient overlay */}
                <div className="relative h-44 overflow-hidden">
                    {featuredImage ? (
                        <>
                            <SmartImage
                                src={appwriteService.getFilePreview(featuredImage)}
                                alt={title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-80"></div>
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
                            <div className="text-emerald-600 text-4xl">📝</div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                    <h2 className="font-semibold mb-2 text-gray-800 text-lg line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {title}
                    </h2>
                    
                    <div className="mt-auto pt-3 border-t border-gray-100">
                        <div className="inline-flex items-center text-emerald-600 text-sm font-medium group-hover:text-green-700 transition-colors">
                            Read story
                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    )
}

export default PostCard