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
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Enter your post title"
                    className="mb-4"
                    {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                    <p className="text-red-600 text-sm mb-2">{errors.title.message}</p>
                )}
                
                <Input
                    label="Slug :"
                    placeholder="post-url-slug"
                    className="mb-4"
                    {...register("slug", { required: "Slug is required" })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                {errors.slug && (
                    <p className="text-red-600 text-sm mb-2">{errors.slug.message}</p>
                )}
                
                <RTE 
                    label="Content :" 
                    name="content" 
                    control={control} 
                    defaultValue={getValues("content")} 
                />
                {errors.content && (
                    <p className="text-red-600 text-sm mt-2">{errors.content.message}</p>
                )}
            </div>
            
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
                    {...register("image", { 
                        required: !post ? "Featured image is required" : false,
                        onChange: handleFileChange
                    })}
                />
                
                {fileError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4">
                        ⚠️ {fileError}
                    </div>
                )}
                
                {errors.image && (
                    <p className="text-red-600 text-sm mb-2">{errors.image.message}</p>
                )}
                
                {/* Image Preview */}
                {(previewImage || post) && (
                    <div className="w-full mb-4">
                        <img
                            src={previewImage || appwriteService.getFilePreview(post.featuredImage)}
                            alt={post?.title || "Preview"}
                            className="rounded-lg w-full h-48 object-cover border"
                            onError={(e) => {
                                console.error("Preview image failed to load");
                                e.target.style.display = 'none';
                            }}
                        />
                        {previewImage && (
                            <p className="text-sm text-gray-600 mt-1">New image preview</p>
                        )}
                    </div>
                )}
                
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                
                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mb-4">
                        <div className="bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
                    </div>
                )}
                
                <Button 
                    type="submit" 
                    bgColor={post ? "bg-green-500" : "bg-blue-500"} 
                    className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting 
                        ? (post ? "Updating..." : "Creating...") 
                        : (post ? "Update Post" : "Create Post")
                    }
                </Button>
                
                {/* File size tip */}
                <p className="text-xs text-gray-500 mt-2">
                    💡 Tip: Files over 1MB will be automatically compressed. Max size: 2MB
                </p>
            </div>
        </form>
    );
}