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
        })
    }

    const handleImageLoad = () => {
        console.log(`PostCard image loaded successfully for post ${$id}`)
    }

    return (
        <Link to={`/post/${$id}`} className="block">
            <article className="w-full h-full border border-gray-800 bg-black text-white rounded-lg overflow-hidden flex flex-col hover:scale-[1.02] transition-transform duration-300">
                {/* Image */}
                <div className="w-full aspect-video bg-gray-900 overflow-hidden">
                    <SmartImage
                        src={featuredImage ? appwriteService.getFilePreview(featuredImage) : null}
                        alt={title}
                        className="w-full h-full object-cover"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h2>
                    <div className="mt-auto text-sm text-gray-400">Read More →</div>
                </div>
            </article>
        </Link>
    )
}

export default PostCard
