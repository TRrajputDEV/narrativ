import conf from '../config/config';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            console.log("Creating Post With:", {
                title,
                slug,
                contentLength: content?.length || 0,
                featuredImage,
                status,
                userId
            });

            const response = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            );

            console.log("Post created successfully:", response.$id);
            return response;
        } catch (error) {
            console.error("Appwrite service :: createPost :: error", {
                error: error.message,
                code: error.code,
                type: error.type,
                data: { title, slug, featuredImage, status, userId }
            });
            throw error; // Re-throw to handle in UI
        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            console.log("Updating Post:", {
                slug,
                title,
                contentLength: content?.length || 0,
                featuredImage,
                status
            });

            const response = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            );

            console.log("Post updated successfully:", response.$id);
            return response;
        } catch (error) {
            console.error("Appwrite service :: updatePost :: error", {
                error: error.message,
                code: error.code,
                type: error.type,
                slug,
                data: { title, featuredImage, status }
            });
            throw error;
        }
    }

    async deletePost(slug) {
        try {
            console.log("Deleting Post:", slug);
            
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );

            console.log("Post deleted successfully:", slug);
            return true;
        } catch (error) {
            console.error("Appwrite service :: deletePost :: error", {
                error: error.message,
                code: error.code,
                type: error.type,
                slug
            });
            return false;
        }
    }

    async getPost(slug) {
        try {
            console.log("Fetching Post:", slug);
            
            const response = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );

            console.log("Post fetched successfully:", {
                id: response.$id,
                title: response.title,
                featuredImage: response.featuredImage
            });
            
            return response;
        } catch (error) {
            console.error("Appwrite service :: getPost :: error", {
                error: error.message,
                code: error.code,
                type: error.type,
                slug
            });
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            console.log("Fetching Posts with queries:", queries);
            
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );

            console.log("Posts fetched successfully:", {
                total: response.total,
                count: response.documents.length
            });
            
            return response;
        } catch (error) {
            console.error("Appwrite service :: getPosts :: error", {
                error: error.message,
                code: error.code,
                type: error.type,
                queries
            });
            return false;
        }
    }

    // Enhanced file upload with better error handling
    async uploadFile(file) {
        try {
            if (!file) {
                throw new Error("No file provided");
            }

            console.log("Uploading file:", {
                name: file.name,
                size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
                type: file.type
            });

            const response = await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            );

            console.log("File uploaded successfully:", {
                id: response.$id,
                name: response.name,
                size: `${(response.sizeOriginal / 1024 / 1024).toFixed(2)}MB`
            });

            return response;
        } catch (error) {
            console.error("Appwrite service :: uploadFile :: error", {
                error: error.message,
                code: error.code,
                type: error.type,
                fileName: file?.name,
                fileSize: file?.size
            });
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            if (!fileId) {
                console.warn("No fileId provided for deletion");
                return true;
            }

            console.log("Deleting file:", fileId);
            
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            );

            console.log("File deleted successfully:", fileId);
            return true;
        } catch (error) {
            console.error("Appwrite service :: deleteFile :: error", {
                error: error.message,
                code: error.code,
                type: error.type,
                fileId
            });
            return false;
        }
    }

    // Enhanced getFilePreview with validation and error handling
    getFilePreview(fileId, width = 400, height = 300, gravity = 'center', quality = 80) {
        try {
            if (!fileId) {
                console.warn("No fileId provided for preview");
                return null;
            }

            console.log("Getting file preview:", {
                fileId,
                dimensions: `${width}x${height}`,
                quality
            });

            const previewUrl = this.bucket.getFilePreview(
                conf.appwriteBucketId,
                fileId,
                width,
                height,
                gravity,
                quality
            );

            return previewUrl;
        } catch (error) {
            console.error("Appwrite service :: getFilePreview :: error", {
                error: error.message,
                fileId,
                width,
                height
            });
            return null;
        }
    }

    // Helper method to get optimized preview URLs
    getOptimizedPreview(fileId, type = 'card') {
        const previewSizes = {
            card: { width: 400, height: 300 },
            banner: { width: 1200, height: 600 },
            thumbnail: { width: 150, height: 150 }
        };

        const size = previewSizes[type] || previewSizes.card;
        return this.getFilePreview(fileId, size.width, size.height);
    }

    // Utility method to check if file exists
    async fileExists(fileId) {
        try {
            await this.bucket.getFile(conf.appwriteBucketId, fileId);
            return true;
        } catch (error) {
            console.warn("File does not exist:", fileId);
            return false;
        }
    }
}

const service = new Service();
export default service;