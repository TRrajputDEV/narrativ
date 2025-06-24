// src/components/SmartImage.jsx
// Reusable smart image component with advanced error handling and optimization

import React, { useState, useEffect, useRef } from 'react';
import { retryImageLoad, generatePlaceholderImage } from '../utils/imageUtils';

const SmartImage = ({
    src,
    alt = 'Image',
    className = '',
    fallbackSrc = null,
    placeholder = true,
    retries = 3,
    lazy = true,
    onLoad = () => {},
    onError = () => {},
    showErrorBadge = true,
    dimensions = { width: 400, height: 300 },
    ...props
}) => {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const imgRef = useRef(null);
    const observerRef = useRef(null);

    // Generate fallback placeholder
    const placeholderSrc = fallbackSrc || generatePlaceholderImage({
        width: dimensions.width,
        height: dimensions.height,
        text: hasError ? 'Failed to Load' : 'Loading...',
        bgColor: hasError ? '#fee2e2' : '#f3f4f6',
        textColor: hasError ? '#dc2626' : '#9ca3af'
    });

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!lazy || !imgRef.current) return;

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadImage();
                    observerRef.current?.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        observerRef.current.observe(imgRef.current);

        return () => observerRef.current?.disconnect();
    }, [lazy, src]);

    // Load image immediately if not lazy
    useEffect(() => {
        if (!lazy) {
            loadImage();
        }
    }, [src, lazy]);

    const loadImage = async () => {
        if (!src) {
            setHasError(true);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setHasError(false);

        try {
            const success = await retryImageLoad(src, retries);
            
            if (success) {
                setImageSrc(src);
                setIsLoading(false);
                onLoad();
            } else {
                throw new Error('Image failed to load after retries');
            }
        } catch (error) {
            console.error('SmartImage load error:', { src, error: error.message, retries: retryCount });
            setHasError(true);
            setIsLoading(false);
            setImageSrc(placeholderSrc);
            onError(error);
        }
    };

    const handleImageLoad = () => {
        setIsLoading(false);
        setHasError(false);
        onLoad();
    };

    const handleImageError = (e) => {
        console.error('SmartImage error:', { src, error: e.target.error });
        
        if (retryCount < retries) {
            setRetryCount(prev => prev + 1);
            setTimeout(() => {
                setImageSrc(`${src}?retry=${retryCount + 1}`);
            }, Math.pow(2, retryCount) * 1000);
        } else {
            setHasError(true);
            setIsLoading(false);
            setImageSrc(placeholderSrc);
            onError(new Error('Image failed to load'));
        }
    };

    return (
        <div className={`relative overflow-hidden ${className}`} {...props}>
            {/* Loading skeleton */}
            {isLoading && placeholder && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="text-gray-500 text-sm">Loading...</div>
                </div>
            )}

            {/* Main image */}
            <img
                ref={imgRef}
                src={isLoading && lazy ? placeholderSrc : imageSrc}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading={lazy ? 'lazy' : 'eager'}
            />

            {/* Error badge */}
            {hasError && showErrorBadge && (
                <div className="absolute top-2 right-2 bg-red-100 border border-red-300 text-red-700 text-xs px-2 py-1 rounded-md flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>Image Error</span>
                </div>
            )}

            {/* Retry button for failed images */}
            {hasError && retryCount < retries && (
                <button
                    onClick={() => {
                        setRetryCount(0);
                        loadImage();
                    }}
                    className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-md transition-colors"
                >
                    Retry
                </button>
            )}
        </div>
    );
};

export default SmartImage;