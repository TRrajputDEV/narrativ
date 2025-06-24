// src/utils/imageUtils.js
// Utility functions for better image handling across your app

/**
 * Validates image file before upload
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result
 */
export const validateImageFile = (file, options = {}) => {
    const {
        maxSize = 2 * 1024 * 1024, // 2MB default
        allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'],
        minWidth = 100,
        minHeight = 100
    } = options;

    if (!file) {
        return { isValid: false, error: "No file selected" };
    }

    // Check file size
    if (file.size > maxSize) {
        return { 
            isValid: false, 
            error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${(maxSize / 1024 / 1024).toFixed(2)}MB)` 
        };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
        return { 
            isValid: false, 
            error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}` 
        };
    }

    return { isValid: true, error: null };
};

/**
 * Compresses an image file
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<Blob>} - Compressed image blob
 */
export const compressImage = (file, options = {}) => {
    const {
        maxWidth = 1200,
        maxHeight = 800,
        quality = 0.8,
        outputFormat = file.type
    } = options;

    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            try {
                // Calculate new dimensions while maintaining aspect ratio
                let { width, height } = img;
                
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx.fillStyle = '#FFFFFF'; // White background for transparency
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        console.log('Image compressed:', {
                            originalSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
                            compressedSize: `${(blob.size / 1024 / 1024).toFixed(2)}MB`,
                            compressionRatio: `${((1 - blob.size / file.size) * 100).toFixed(1)}%`,
                            dimensions: `${width}x${height}`
                        });
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to compress image'));
                    }
                }, outputFormat, quality);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = () => reject(new Error('Failed to load image for compression'));
        img.src = URL.createObjectURL(file);
    });
};

/**
 * Creates a preview URL for a file
 * @param {File} file - The file to create preview for
 * @returns {string} - Preview URL
 */
export const createFilePreview = (file) => {
    if (!file) return null;
    return URL.createObjectURL(file);
};

/**
 * Revokes a preview URL to free memory
 * @param {string} url - The URL to revoke
 */
export const revokeFilePreview = (url) => {
    if (url) {
        URL.revokeObjectURL(url);
    }
};

/**
 * Gets image dimensions
 * @param {File} file - The image file
 * @returns {Promise<Object>} - Object with width and height
 */
export const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
};

/**
 * Generates fallback/placeholder images
 * @param {Object} options - Placeholder options
 * @returns {string} - Data URL for placeholder image
 */
export const generatePlaceholderImage = (options = {}) => {
    const {
        width = 400,
        height = 300,
        text = 'No Image',
        bgColor = '#f3f4f6',
        textColor = '#9ca3af',
        fontSize = 18
    } = options;

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <rect width="${width}" height="${height}" fill="${bgColor}"/>
            <text x="${width/2}" y="${height/2}" text-anchor="middle" dominant-baseline="middle" 
                  fill="${textColor}" font-family="Arial, sans-serif" font-size="${fontSize}">
                ${text}
            </text>
        </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/**
 * Retries an image load with exponential backoff
 * @param {string} src - Image source URL
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise<boolean>} - Success status
 */
export const retryImageLoad = (src, maxRetries = 3) => {
    return new Promise((resolve) => {
        let attempts = 0;
        
        const tryLoad = () => {
            const img = new Image();
            
            img.onload = () => resolve(true);
            
            img.onerror = () => {
                attempts++;
                if (attempts < maxRetries) {
                    // Exponential backoff: 1s, 2s, 4s
                    setTimeout(tryLoad, Math.pow(2, attempts - 1) * 1000);
                } else {
                    resolve(false);
                }
            };
            
            img.src = src;
        };
        
        tryLoad();
    });
};

/**
 * Formats file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Checks if a URL is a valid image
 * @param {string} url - URL to check
 * @returns {Promise<boolean>} - Whether URL points to valid image
 */
export const isValidImageUrl = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};