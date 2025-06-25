import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input } from './index'
import authService from '../appwrite/auth'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const login = async (data) => {
        setError("")
        setIsLoading(true)
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if (userData) dispatch(authLogin(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message || "Login failed. Please check your credentials.")
        } finally {
            setIsLoading(false)
        }
    }

    const ErrorMessage = ({ error }) => (
        error && (
            <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 flex items-start shadow-sm">
                <div className="flex-shrink-0 mr-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-red-800 font-medium">{error}</p>
                </div>
            </div>
        )
    )

    const InputField = ({ 
        id, 
        label, 
        type, 
        placeholder, 
        register, 
        validation, 
        error,
        isPassword = false
    }) => (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
                {label}
            </label>
            <div className="relative">
                <Input
                    id={id}
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                        error 
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-gray-200 bg-gray-50 focus:border-emerald-500 focus:ring-emerald-500/20 hover:border-gray-300'
                    } focus:outline-none focus:ring-2`}
                    {...register(id, validation)}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                        {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.415 1.415M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-sm text-red-600 flex items-center font-medium">
                    <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error.message}
                </p>
            )}
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-br from-emerald-700 to-green-800 px-8 py-12 text-center">
                        {/* Logo */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">N</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Welcome Text */}
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-white">
                                Welcome Back
                            </h1>
                            <p className="text-emerald-100 text-lg">
                                Sign in to continue your journey
                            </p>
                        </div>
                    </div>
                    
                    {/* Form Section */}
                    <div className="px-6 py-8 sm:px-8 sm:py-10">
                        <ErrorMessage error={error} />
                        
                        <form onSubmit={handleSubmit(login)} className="space-y-6">
                            <InputField
                                id="email"
                                label="Email Address"
                                type="email"
                                placeholder="Enter your email"
                                register={register}
                                validation={{
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                        message: "Please enter a valid email address"
                                    }
                                }}
                                error={errors.email}
                            />
                            
                            <InputField
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                register={register}
                                validation={{
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                }}
                                error={errors.password}
                                isPassword={true}
                            />
                            
                            {/* Submit Button */}
                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className="w-full py-3.5 font-medium rounded-lg shadow-sm transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                    gradient={true}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                            Signing in...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Sign In
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>
                        
                        {/* Divider */}
                        <div className="flex items-center my-6">
                            <div className="flex-1 border-t border-gray-200"></div>
                            <span className="px-4 text-sm text-gray-500 bg-white">or</span>
                            <div className="flex-1 border-t border-gray-200"></div>
                        </div>
                        
                        {/* Sign Up Link */}
                        <div className="text-center">
                            <p className="text-gray-600">
                                New to Narrativ?{' '}
                                <Link
                                    to="/signup"
                                    className="font-semibold text-emerald-600 hover:text-green-700 transition-colors duration-200 hover:underline"
                                >
                                    Create your account
                                </Link>
                            </p>
                        </div>
                        
                        {/* Back to Home */}
                        <div className="text-center mt-6">
                            <Link
                                to="/"
                                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Trust Indicators */}
                <div className="mt-6 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Secure Login
                        </div>
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Trusted Platform
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login