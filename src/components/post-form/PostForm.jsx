import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileError, setFileError] = useState("");
    const [previewImage, setPreviewImage] = useState(null);

    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    // File validation
    const validateFile = (file) => {
        if (!file) return true;
        
        const maxSize = 2 * 1024 * 1024; // 2MB limit
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'];
        
        if (file.size > maxSize) {
            return "File size must be less than 2MB";
        }
        
        if (!allowedTypes.includes(file.type)) {
            return "Only PNG, JPG, JPEG, GIF, and WebP files are allowed";
        }
        
        return true;
    };

    // Compress image before upload
    const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(resolve, file.type, quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    };

    // Handle file selection with validation and preview
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setFileError("");
        setPreviewImage(null);
        
        if (!file) return;
        
        const validation = validateFile(file);
        if (validation !== true) {
            setFileError(validation);
            e.target.value = ""; // Clear the input
            return;
        }
        
        // Create preview
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        
        console.log("File selected:", {
            name: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
            type: file.type
        });
    };

    const submit = async (data) => {
        setIsSubmitting(true);
        setUploadProgress(0);
        
        try {
            let fileId = post?.featuredImage; // Keep existing image by default
            
            // Handle image upload if new file selected
            if (data.image && data.image[0]) {
                setUploadProgress(25);
                
                let fileToUpload = data.image[0];
                
                // Compress if file is large
                if (fileToUpload.size > 1024 * 1024) { // 1MB
                    console.log("Compressing large image...");
                    fileToUpload = await compressImage(fileToUpload);
                    console.log("Image compressed:", {
                        originalSize: `${(data.image[0].size / 1024 / 1024).toFixed(2)}MB`,
                        compressedSize: `${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`
                    });
                }
                
                setUploadProgress(50);
                const uploadedFile = await appwriteService.uploadFile(fileToUpload);
                
                if (!uploadedFile) {
                    throw new Error("Failed to upload image");
                }
                
                fileId = uploadedFile.$id;
                setUploadProgress(75);
                
                // Delete old image if updating post
                if (post && post.featuredImage && post.featuredImage !== fileId) {
                    appwriteService.deleteFile(post.featuredImage).catch(err => 
                        console.warn("Failed to delete old image:", err)
                    );
                }
            }
            
            // Update or create post
            const postData = {
                ...data,
                featuredImage: fileId,
                userId: userData.$id
            };
            
            let dbPost;
            if (post) {
                dbPost = await appwriteService.updatePost(post.$id, postData);
            } else {
                dbPost = await appwriteService.createPost(postData);
            }
            
            if (!dbPost) {
                throw new Error("Failed to save post");
            }
            
            setUploadProgress(100);
            console.log("Post saved successfully:", dbPost.$id);
            
            // Clean up preview URL
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
            
            navigate(`/post/${dbPost.$id}`);
            
        } catch (error) {
            console.error("Error saving post:", error);
            alert(`Failed to save post: ${error.message}`);
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                {post ? "Edit Story" : "Create New Story"}
            </h2>
            
            <form onSubmit={handleSubmit(submit)} className="flex flex-wrap gap-6 ">
                <div className="flex flex-row">
                <div className="w-full lg:w-2/3">
                    <div className="bg-gray-50 rounded-xl p-5 mb-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Story Details</h3>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <Input
                                    placeholder="Enter your post title"
                                    className="w-full"
                                    {...register("title", { required: "Title is required" })}
                                />
                                {errors.title && (
                                    <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content
                                </label>
                                <RTE 
                                    name="content" 
                                    control={control} 
                                    defaultValue={getValues("content")} 
                                    className="border border-gray-200 rounded-lg overflow-hidden"
                                />
                                {errors.content && (
                                    <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="w-full lg:w-1/3">
                    <div className="bg-gray-50 rounded-xl p-5 mb-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Publishing Options</h3>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Featured Image
                                </label>
                                <div className="relative">
                                    <label className="block w-full bg-white border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:border-emerald-300 transition-colors">
                                        <div className="flex items-center justify-center gap-2 text-gray-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>Choose image...</span>
                                        </div>
                                        <input
                                            type="file"
                                            className="sr-only"
                                            accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
                                            {...register("image", { 
                                                required: !post ? "Featured image is required" : false,
                                                onChange: handleFileChange
                                            })}
                                        />
                                    </label>
                                    
                                    {fileError && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mt-2 text-sm">
                                            ⚠️ {fileError}
                                        </div>
                                    )}
                                    
                                    {errors.image && (
                                        <p className="text-red-600 text-sm mt-1">{errors.image.message}</p>
                                    )}
                                </div>
                            </div>
                            
                            {/* Image Preview */}
                            {(previewImage || post) && (
                                <div className="w-full">
                                    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                        <img
                                            src={previewImage || appwriteService.getFilePreview(post.featuredImage)}
                                            alt={post?.title || "Preview"}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                console.error("Preview image failed to load");
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                        {previewImage && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                                <span className="text-white text-sm">New image preview</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <Select
                                    options={["active", "inactive"]}
                                    className="w-full"
                                    {...register("status", { required: true })}
                                />
                            </div>
                            
                            {/* Upload Progress */}
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="pt-2">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Uploading image...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <Button 
                        type="submit" 
                        className="w-full disabled:opacity-50 disabled:cursor-not-allowed py-3.5 text-lg"
                        disabled={isSubmitting}
                        gradient={true}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {post ? "Updating..." : "Creating..."}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                {post ? "Update Story" : "Publish Story"}
                            </div>
                        )}
                    </Button>
                    
                    {/* File size tip */}
                    <p className="text-sm text-gray-500 mt-4 flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 mr-2 flex-shrink-0 mt-0.5">💡</span>
                        Files over 1MB will be automatically compressed. Max size: 2MB
                    </p>
                </div>
                </div>
            </form>
        </div>
    );
}